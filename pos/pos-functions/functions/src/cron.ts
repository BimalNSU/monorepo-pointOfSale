import {
  ChartOfAccountId,
  COLLECTIONS,
  Transaction as TransactionModel,
  ChartOfAccount as ChartOfAccountModel,
  WithId,
  NatureType,
} from "@pos/shared-models";
import { db, Timestamp } from "./firebase";
import { firestoreConverter } from "./utils/converter";
import { regionalFunctions } from "./utils/functions";
import dayjs from "dayjs";
import { AccountBalance } from "./db-collections/accountBalance.collection";
import { ChartOfAccount } from "./db-collections/chartOfAccount.collection";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
type Amount = number;

const initiateOpeningBalances = async () => {
  const documentFormat = "YYYY-MM-DD";
  const now = dayjs().tz("Asia/Dhaka");
  const newAccountBalanceId = now.format(documentFormat);
  const yesterday = now.subtract(1, "day");
  const currentBalanceId = yesterday.format(documentFormat);
  const start = yesterday.startOf("day").toDate();
  const end = yesterday.endOf("day").toDate();
  const queryInTransactions = db
    .collection(COLLECTIONS.transactions)
    .withConverter(firestoreConverter<TransactionModel>())
    .where("createdAt", ">=", Timestamp.fromDate(start))
    .where("createdAt", "<=", Timestamp.fromDate(end))
    .orderBy("createdAt", "desc");
  const transactionSnapshots = await queryInTransactions.get();
  const transactions = transactionSnapshots.docs.map((doc) => {
    return { ...doc.data(), id: doc.id } as WithId<TransactionModel>;
  });

  // 1. Collect unique coaIds from all transactions
  const coaIdsSet = new Set<ChartOfAccountId>();
  transactions.forEach((t) => {
    t.heads.forEach((head) => {
      coaIdsSet.add(head.coaId);
    });
  });
  const coaIds = Array.from(coaIdsSet);

  // 2. Batch fetch all ChartOfAccount once
  const chartOfAccountObj = new ChartOfAccount();
  const fetchedChartOfAccounts = await chartOfAccountObj.getByIds(coaIds);

  // 3. Build map
  const chartOfAccountsMap: Record<
    ChartOfAccountId,
    Pick<ChartOfAccountModel, "normalBalance"> & { amount: Amount }
  > = fetchedChartOfAccounts.reduce((pre, curr) => {
    pre[curr.id] = { normalBalance: curr.normalBalance, amount: 0 };
    return pre;
  }, Object());

  const accountBalance = new AccountBalance();
  const previousDayBalances = await accountBalance.get(currentBalanceId);

  //4. loading last accountBalance
  const previousBalanceMap: Record<ChartOfAccountId, Amount> =
    previousDayBalances?.accounts.reduce((pre, curr) => {
      pre[curr.id] = curr.amount;
      return pre;
    }, Object()) ?? Object.create(null);

  // 5. Sum transaction heads to chartOfAccountsMap
  transactions.forEach((t) =>
    t.heads.map((head) => {
      const newAmount =
        chartOfAccountsMap[head.coaId].normalBalance === NatureType.debit
          ? head.nature === NatureType.debit
            ? head.amount
            : -head.amount
          : head.nature === NatureType.credit
          ? head.amount
          : -head.amount;
      chartOfAccountsMap[head.coaId].amount += newAmount;
    })
  );
  const newBalanceMap: Record<ChartOfAccountId, Amount> = Object.create(null);
  //add new amounts from transactions to newBalanceMap
  Object.entries(chartOfAccountsMap).forEach(([coaId, value]) => {
    newBalanceMap[coaId] = (previousBalanceMap[coaId] ?? 0) + value.amount;
  });
  //append miss-matched oldBalance to newBalanceMap
  Object.entries(previousBalanceMap).forEach(([coaId, amount]) => {
    newBalanceMap[coaId] = newBalanceMap[coaId] ?? amount;
  });
  const batch = db.batch();
  const newAccountBalanceDoc = {
    accounts: Object.entries(newBalanceMap).map(([coaId, value]) => ({
      id: coaId,
      amount: value,
    })),
  };
  accountBalance.set(batch, newAccountBalanceDoc, newAccountBalanceId);
  await batch.commit();
};

// const activate = async () => {
//   const ref = db
//     .collectionGroup(COLLECTIONS.tenantAgreements)
//     .withConverter(firestoreConverter<TenantAgreement>())
//     .where("status", "in", ["tenantAccepted", "pending", "active"])
//     .where("startDate", "<", new Date());
//   const tenantAgreements = (await ref.get()).docs.map((doc) => {
//     const agreementDocRef = doc.ref;
//     const agreementCollectionRef = agreementDocRef.parent; // parentCollectionRef
//     const propertyDocRef = agreementCollectionRef.parent; // immediateParentDocumentRef
//     const propertyId = propertyDocRef?.id || ""; // TODO: solve typescript error

//     return { ...doc.data(), id: doc.id, propertyId };
//   });

//   const activeTenantAgreementsGrouped: Record<
//     PropertyId,
//     WithId<TenantAgreement>[]
//   > = {};

//   tenantAgreements
//     .filter((a) => a.status === "active")
//     .forEach((a) => {
//       if (activeTenantAgreementsGrouped[a.propertyId] == undefined) {
//         activeTenantAgreementsGrouped[a.propertyId] = [];
//       }
//       activeTenantAgreementsGrouped[a.propertyId].push(a);
//     });

//   const tenantAgreementsGrouped: Record<
//     PropertyId,
//     (WithId<TenantAgreement> & { propertyId: PropertyId })[]
//   > = {};

//   tenantAgreements
//     .filter((data) => {
//       // only for units/shops with no tenants and either
//       // a) type manual with status pending or
//       // b) type electronic with status tenantAccepted
//       const propertyId = data.propertyId;
//       const isCorrectStatus =
//         (data.agreementFileType === "electronic" &&
//           data.status === "tenantAccepted") ||
//         (data.agreementFileType === "manual" && data.status === "pending");

//       let hasNoTenant = false;
//       if (data.unitIds.length) {
//         hasNoTenant =
//           activeTenantAgreementsGrouped[propertyId]?.find(
//             (agreement) =>
//               getIntersection(agreement.unitIds, data.unitIds).length > 0
//           ) == undefined;
//       } else if (data.shopIds.length) {
//         hasNoTenant =
//           activeTenantAgreementsGrouped[propertyId]?.find(
//             (agreement) =>
//               getIntersection(agreement.shopIds, data.shopIds).length > 0
//           ) == undefined;
//       }
//       return isCorrectStatus && hasNoTenant;
//     })
//     .forEach((a) => {
//       const propertyId = a.propertyId;

//       if (tenantAgreementsGrouped[propertyId] == undefined) {
//         tenantAgreementsGrouped[propertyId] = [];
//       }
//       tenantAgreementsGrouped[propertyId].push(a);
//     });

//   const propertyPromises = Object.entries(tenantAgreementsGrouped).map(
//     async ([propertyId, agreements]) => {
//       await db.runTransaction(async (t) => {
//         const propertyRef = db
//           .collection(COLLECTIONS.properties)
//           .withConverter(firestoreConverter<Property>())
//           .doc(propertyId);

//         const residentialsRef = propertyRef
//           .collection(COLLECTIONS.residentials)
//           .withConverter(firestoreConverter<Residential>());
//         const residentials = await t.get(residentialsRef);

//         const shopsRef = propertyRef
//           .collection(COLLECTIONS.shops)
//           .withConverter(firestoreConverter<Shop>());
//         const shops = await t.get(shopsRef);

//         const parkingLotsRef = propertyRef
//           .collection(COLLECTIONS.parkingLots)
//           .withConverter(firestoreConverter<ParkingLot>());
//         const parkingLots = await t.get(parkingLotsRef);

//         const tenantAgreementPromises = agreements.map(async (a) => {
//           const tenantAgreementId = a.id;

//           const tenantRef = db
//             .collection(COLLECTIONS.users)
//             .doc(a.tenantId)
//             .withConverter(firestoreConverter<TenantUser>());
//           const tenantDoc = await t.get(tenantRef);

//           const willUpdateResidentials = a.type === 1 || a.type === 2;
//           const willUpdateParking =
//             a.type === 1 || a.type === 3 || a.type === 4;
//           const willUpdateShops = a.type === 4 || a.type === 5;

//           // Update residentials in property doc
//           if (willUpdateResidentials) {
//             a.unitIds!.map((unitId) => {
//               const ref = propertyRef
//                 .collection(COLLECTIONS.residentials)
//                 .doc(unitId)
//                 .withConverter(firestoreConverter<Residential>());

//               // !following will fail if unit doesn't exist in residentials subcollection
//               t.update(ref, {
//                 tenantAgreementId,
//                 tenantId: a.tenantId,
//               });
//             });
//           }

//           // Update shops in property doc
//           if (willUpdateShops) {
//             a.shopIds!.map((shopId) => {
//               const ref = propertyRef
//                 .collection(COLLECTIONS.shops)
//                 .doc(shopId)
//                 .withConverter(firestoreConverter<Shop>());

//               // !following will fail if shop doesn't exist in residentials subcollection
//               t.update(ref, {
//                 tenantAgreementId,
//                 tenantId: a.tenantId,
//               });
//             });
//           }

//           // Update parkingLots in property doc
//           if (willUpdateParking) {
//             a.parkingIds!.map((parkingLotId) => {
//               const ref = propertyRef
//                 .collection(COLLECTIONS.parkingLots)
//                 .doc(parkingLotId)
//                 .withConverter(firestoreConverter<ParkingLot>());
//               // !following will fail if parkingLot doesn't exist in parkingLots subcollection
//               t.update(ref, {
//                 tenantAgreementId,
//                 tenantId: a.tenantId,
//               });
//             });
//           }

//           const agreementDocRef = propertyRef
//             .collection(COLLECTIONS.tenantAgreements)
//             .doc(a.id);

//           // Update tenant agreement
//           t.update(agreementDocRef, { status: "active" });

//           // Update user (tenant)

//           const tenant = tenantDoc.data()!;
//           if (tenant.tenantAssignmentList[propertyId] == undefined) {
//             tenant.tenantAssignmentList[propertyId] = { agreementIds: [] };
//           }
//           tenant.tenantAssignmentList[propertyId].agreementIds.push(
//             tenantAgreementId
//           );
//           t.update(tenantRef, {
//             tenantAssignmentList: tenant.tenantAssignmentList,
//           });
//         });
//         await Promise.all(tenantAgreementPromises);

//         // Update property doc
//         const newTenantIds: Set<UserId> = new Set();

//         residentials.docs
//           .map((doc) => doc.data())
//           .filter((unit) => unit.tenantId != undefined)
//           .forEach((unit) => newTenantIds.add(unit.tenantId!));

//         shops.docs
//           .map((doc) => doc.data())
//           .filter((shop) => shop.tenantId != undefined)
//           .forEach((shop) => newTenantIds.add(shop.tenantId!));

//         parkingLots.docs
//           .map((doc) => doc.data())
//           .filter((parking) => parking.tenantId != undefined)
//           .forEach((parking) => newTenantIds.add(parking.tenantId!));

//         t.update(propertyRef, {
//           agreementedTenantIds: Array.from(newTenantIds),
//         });
//       });
//     }
//   );
//   await Promise.all(propertyPromises);
// };

export const openingBalanceInitiator = regionalFunctions.pubsub
  .schedule("1 0 * * *") // Everyday at 00:01
  .timeZone("Asia/Dhaka")
  .onRun(async () => {
    await initiateOpeningBalances();
  });
