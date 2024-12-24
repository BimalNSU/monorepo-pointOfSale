// import { COLLECTIONS } from "./constants/collections";
// import { db } from "./firebase";
// import { PropertyId, UserId, WithId } from "./models/common.model";
// import { ParkingLot } from "./models/parkingLot.model";
// import { Property } from "./models/category.model";
// import { Residential } from "./models/residential.model";
// import { Shop } from "./models/product.model";
// import { TenantAgreement } from "./models/tenantAgreement.model";
// import { TenantUser } from "./models/user.model";
// import { firestoreConverter } from "./utils/converter";
// import { regionalFunctions } from "./utils/functions";
// import { getIntersection } from "./utils/array";
// import {
//   RecurringBill,
//   RecurringBillIssue,
// } from "./models/recurringBill.model";
// import dayjs from "dayjs";

// const deactivate = async () => {
//   const ref = db
//     .collectionGroup(COLLECTIONS.tenantAgreements)
//     .withConverter(firestoreConverter<TenantAgreement>())
//     .where("status", "==", "active")
//     .where("endDate", "<", new Date());
//   const tenantAgreements = await ref.get();
//   const tenantAgreementsGrouped: Record<
//     PropertyId,
//     FirebaseFirestore.QueryDocumentSnapshot<TenantAgreement>[]
//   > = {};
//   tenantAgreements.docs.forEach((doc) => {
//     const agreementDocRef = doc.ref;
//     const agreementCollectionRef = agreementDocRef.parent; // parentCollectionRef
//     const propertyDocRef = agreementCollectionRef.parent; // immediateParentDocumentRef
//     const propertyId = propertyDocRef!.id; // TODO: solve typescript error

//     if (tenantAgreementsGrouped[propertyId] == undefined) {
//       tenantAgreementsGrouped[propertyId] = [];
//     }
//     tenantAgreementsGrouped[propertyId].push(doc);
//   });

//   const propertyPromises = Object.entries(tenantAgreementsGrouped).map(
//     async ([propertyId, tenantAgreementDocs]) => {
//       await db.runTransaction(async (t) => {
//         const propertyRef = db
//           .collection(COLLECTIONS.properties)
//           .withConverter(firestoreConverter<Property>())
//           .doc(propertyId);

//         const residentialsRef = db
//           .collection(COLLECTIONS.properties)
//           .doc(propertyId)
//           .collection(COLLECTIONS.residentials)
//           .withConverter(firestoreConverter<Residential>());
//         const residentials = Object.fromEntries(
//           (await t.get(residentialsRef)).docs.map((doc) => [doc.id, doc.data()])
//         );

//         const shopsRef = db
//           .collection(COLLECTIONS.properties)
//           .doc(propertyId)
//           .collection(COLLECTIONS.shops)
//           .withConverter(firestoreConverter<Shop>());
//         const shops = Object.fromEntries(
//           (await t.get(shopsRef)).docs.map((doc) => [doc.id, doc.data()])
//         );

//         const parkingLotsRef = db
//           .collection(COLLECTIONS.properties)
//           .doc(propertyId)
//           .collection(COLLECTIONS.parkingLots)
//           .withConverter(firestoreConverter<ParkingLot>());
//         const parkingLots = Object.fromEntries(
//           (await t.get(parkingLotsRef)).docs.map((doc) => [doc.id, doc.data()])
//         );

//         const tenantAgreementPromises = tenantAgreementDocs.map(async (doc) => {
//           const tenantAgreement = doc.data();
//           const tenantAgreementId = doc.id;

//           const tenantRef = db
//             .collection(COLLECTIONS.users)
//             .doc(tenantAgreement.tenantId)
//             .withConverter(firestoreConverter<TenantUser>());
//           const tenantDoc = await t.get(tenantRef);

//           const willUpdateResidentials =
//             tenantAgreement.type === 1 || tenantAgreement.type === 2;
//           const willUpdateParking =
//             tenantAgreement.type === 1 ||
//             tenantAgreement.type === 3 ||
//             tenantAgreement.type === 4;
//           const willUpdateShops =
//             tenantAgreement.type === 4 || tenantAgreement.type === 5;

//           const changes = {
//             tenantAgreementId: null,
//             tenantId: null,
//           };
//           // Update residentials in property doc
//           if (willUpdateResidentials) {
//             tenantAgreement.unitIds!.map((unitId) => {
//               const ref = db
//                 .collection(COLLECTIONS.properties)
//                 .doc(propertyId)
//                 .collection(COLLECTIONS.residentials)
//                 .doc(unitId)
//                 .withConverter(firestoreConverter<Residential>());

//               // !following will fail if unit doesn't exist in residentials subcollection
//               t.update(ref, changes);
//               residentials[unitId] = { ...residentials[unitId], ...changes };
//             });
//           }

//           // Update shops in property doc
//           if (willUpdateShops) {
//             tenantAgreement.shopIds!.map((shopId) => {
//               const ref = db
//                 .collection(COLLECTIONS.properties)
//                 .doc(propertyId)
//                 .collection(COLLECTIONS.shops)
//                 .doc(shopId)
//                 .withConverter(firestoreConverter<Shop>());

//               // !following will fail if shop doesn't exist in residentials subcollection
//               t.update(ref, changes);
//               shops[shopId] = { ...shops[shopId], ...changes };
//             });
//           }

//           // Update parkingLots in property doc
//           if (willUpdateParking) {
//             tenantAgreement.parkingIds!.map((parkingLotId) => {
//               const ref = db
//                 .collection(COLLECTIONS.properties)
//                 .doc(propertyId)
//                 .collection(COLLECTIONS.parkingLots)
//                 .doc(parkingLotId)
//                 .withConverter(firestoreConverter<ParkingLot>());
//               // !following will fail if parkingLot doesn't exist in parkingLots subcollection
//               t.update(ref, changes);
//               parkingLots[parkingLotId] = {
//                 ...parkingLots[parkingLotId],
//                 ...changes,
//               };
//             });
//           }

//           // Update tenant agreement
//           t.update(doc.ref, {
//             status: "expired",
//             actualEndDate: tenantAgreement.endDate,
//           });

//           // Update user (tenant)
//           const tenant = tenantDoc.data()!;
//           const ind = tenant.tenantAssignmentList[
//             propertyId
//           ].agreementIds.findIndex((val) => val === tenantAgreementId);
//           if (ind > -1) {
//             tenant.tenantAssignmentList[propertyId].agreementIds.splice(ind, 1);
//             if (
//               tenant.tenantAssignmentList[propertyId].agreementIds.length === 0
//             ) {
//               delete tenant.tenantAssignmentList[propertyId];
//             }
//           }
//           t.update(tenantRef, {
//             tenantAssignmentList: tenant.tenantAssignmentList,
//           });
//         });
//         await Promise.all(tenantAgreementPromises);

//         // Update property doc
//         const newTenantIds: Set<UserId> = new Set();

//         Object.values(residentials)
//           .filter((unit) => unit.tenantId != undefined)
//           .forEach((unit) => newTenantIds.add(unit.tenantId!));

//         Object.values(shops)
//           .filter((shop) => shop.tenantId != undefined)
//           .forEach((shop) => newTenantIds.add(shop.tenantId!));

//         Object.values(parkingLots)
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

// export const processTenantAgreements = regionalFunctions.pubsub
//   .schedule("5 0 * * *") // Everyday at 00:05
//   .timeZone("Asia/Dhaka")
//   .onRun(async () => {
//     await deactivate();
//     await activate();
//   });

// export const issueRecurringBill = regionalFunctions.pubsub
//   .schedule("5 0 * * *") // Everyday at 00:05
//   .timeZone("Asia/Dhaka")
//   .onRun(async () => {
//     // current month iter  - duration end < createdAt month
//     const now = new Date();
//     const todayDate = now.getDate();
//     const recurringBillDocs = await db
//       .collection(COLLECTIONS.recurringBills)
//       .where("dueDate", "==", todayDate)
//       .withConverter(firestoreConverter<RecurringBill>())
//       .get();

//     const applicableRBills: WithId<RecurringBill>[] = [];
//     const recurringBills = recurringBillDocs.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     for (const rbill of recurringBills) {
//       if (rbill.durationType === 1) {
//         applicableRBills.push(rbill);
//       } else {
//         // TODO: update the following with `.count()` after migrating to new Firebase Functions version
//         const rbillIssues = await db
//           .collection(COLLECTIONS.recurringBillIssues)
//           .where("rBillId", "==", rbill.id)
//           .withConverter(firestoreConverter<RecurringBillIssue>())
//           .get();
//         if (rbillIssues.docs.length < rbill.durationEnd!) {
//           applicableRBills.push(rbill);
//         }
//       }
//     }

//     if (applicableRBills.length === 0) {
//       return;
//     }

//     const batch = db.batch();
//     // TODO: change according to requirements if necessary
//     const month = dayjs(new Date()).format("MMM-YYYY");

//     applicableRBills.forEach((rbill) => {
//       const recurringBillIssue: RecurringBillIssue = {
//         month,
//         rBillId: rbill.id,
//         propertyId: rbill.propertyId,
//         createdAt: now,
//         isDeleted: false,
//       };
//       batch.create(
//         db.collection(COLLECTIONS.recurringBillIssues).doc(),
//         recurringBillIssue
//       );
//     });

//     await batch.commit();
//   });
