import dayjs from "dayjs";
import { BILL_TYPE } from "@/constants/billsType";
import { DATE_FORMAT, DATE_MMM_YYYY } from "@/constants/dateFormat";

function processCommonBills(cBillIds, cBills, nameFormat, finalBillsArr) {
  cBillIds?.forEach((id, key) => {
    const { bills, targetMonth } = cBills[id];
    bills?.forEach((bill) => {
      finalBillsArr.push({
        name: nameFormat(bill.billingTypeName, "Common Bill", targetMonth),
        amount: bill.subBillingTypes.reduce((acc, subBill) => {
          return acc + subBill.amount;
        }, 0),
        type: "CBiLL",
        billType: " cBill",
        targetMonth,
        key: finalBillsArr.length + 1,
      });
    });
  });
}

function processRecurringBills(rBillIssueIds, rBills, nameFormat, finalBillsArr) {
  rBillIssueIds?.forEach((id, key) => {
    const { title, subBills, targetMonth } = rBills[id];
    finalBillsArr.push({
      name: nameFormat(title, "Recurring Bill", targetMonth),
      amount: subBills.reduce((acc, subBill) => {
        return acc + subBill.amount;
      }, 0),
      type: "RBiLL",
      billType: " rBill",
      targetMonth,
      key: finalBillsArr.length + 1,
    });
  });
}

function processPropertyBillsForTenant(
  pBillIds,
  pBills,
  nameFormat,
  unitsInfo,
  shopsInfo,
  parkingLots,
  finalBillsArr,
  discountArr,
) {
  // property bills
  pBillIds?.forEach((id, key) => {
    const { bills, targetMonth, serviceCharge, discount, unit, shop, parking } = pBills[id];
    const commonData = {
      targetMonth,
      billType: "pBill",
    };
    // Create unitRent
    unit?.forEach((unit) => {
      finalBillsArr.push({
        name: nameFormat(unitsInfo[unit.id], "Unit", targetMonth),
        amount: unit.rent,
        type: "unit",
        key: finalBillsArr.length + 1,
        ...commonData,
      });
    });
    // Create shopRent
    shop?.forEach((s) => {
      finalBillsArr.push({
        ...commonData,
        name: nameFormat(shopsInfo[s.id], "Shop", targetMonth),
        amount: s.rent,
        type: "shop",
        key: finalBillsArr.length + 1,
      });
    });
    // Create parkingRent
    parking?.forEach((lot) => {
      finalBillsArr.push({
        ...commonData,
        name: nameFormat(parkingLots[lot.id], "Parking", targetMonth),
        amount: lot.rent,
        type: "parking",
        key: finalBillsArr.length + 1,
      });
    });
    // Create billsArr
    Object.entries(bills || {}).forEach((item) => {
      const billName = item[1].name;
      const billAmount = item[1].amount;
      const billType = BILL_TYPE[item[1].type]?.text;
      finalBillsArr.push({
        ...commonData,
        name: nameFormat(billName, billType, targetMonth),
        amount: billAmount,
        type: billType,
        key: finalBillsArr.length + 1,
      });
    });
    // Create otherBillsArr
    if (serviceCharge != null) {
      finalBillsArr.push({
        ...commonData,
        name: nameFormat("Service Charge", "Property Bill", targetMonth),
        amount: serviceCharge,
        type: "Service",
        key: finalBillsArr.length + 1,
      });
    }
    //  added discount
    discountArr.push({
      ...commonData,
      name: "Discount",
      amount: discount,
      type: "Discount",
      key: discountArr.length + 1,
    });
  });
}

function processPropertyBillsForOwner(pBillIds, pBills, nameFormat, finalBillsArr) {
  // property bills
  pBillIds?.forEach((id, key) => {
    const { bills, targetMonth, serviceCharge, discount, unit, parking } = pBills[id];
    const commonData = {
      targetMonth,
      billType: "pBill",
    };
    // Create billsArr
    Object.entries(bills || {}).forEach((item) => {
      const billName = item[1].name;
      const billAmount = item[1].amount;
      const billType = BILL_TYPE[item[1].type].text;
      finalBillsArr.push({
        ...commonData,
        name: nameFormat(billName, billType, targetMonth),
        amount: billAmount,
        type: billType,
        key: finalBillsArr.length + 1,
      });
    });
  });
}

//TODO: need to optimize following function
const invoiceProcess = (data) => {
  // get the inovice data and process the data for the UI
  const {
    invoiceType,
    createdAt,
    dueDate,
    units: unitsInfo,
    shops: shopsInfo,
    parkingLots,
    pBills,
    pBillIds,
    cBills,
    cBillIds,
    rBillIds,
    rBillIssueIds,
    rBills,
    role,
    variant,
    tenantAgreementId,
    ...tempData
  } = data;
  tempData.month = dayjs(createdAt.toDate()).format(DATE_MMM_YYYY);
  tempData.createdAt = dayjs(createdAt.toDate()).format(DATE_FORMAT);
  tempData.dueDate = dayjs(dueDate.toDate()).format(DATE_FORMAT);
  const finalBillsArr = [];
  const discountArr = [];

  // this is for name format
  const nameFormat = (name, type, targetMonth) => {
    const month = targetMonth !== tempData.month ? `-(${targetMonth})` : "";
    const typeFormate = `-(${type})`;
    return `${name} ${typeFormate} ${month}`;
  };

  if (invoiceType === "regular") {
    if (role === "owner") {
      // show pbills
      processPropertyBillsForOwner(pBillIds, pBills, nameFormat, finalBillsArr);
    }
    if (tenantAgreementId && role === "tenant") {
      // show pbills
      processPropertyBillsForTenant(
        pBillIds,
        pBills,
        nameFormat,
        unitsInfo,
        shopsInfo,
        parkingLots,
        finalBillsArr,
        discountArr,
      );
    }
    if (role === "owner" || (tenantAgreementId && role === "tenant" && variant === "all")) {
      // show cBills
      processCommonBills(cBillIds, cBills, nameFormat, finalBillsArr);
    }
    if (role === "owner") {
      processRecurringBills(rBillIssueIds, rBills, nameFormat, finalBillsArr);
    }
  }
  // for money receipt's bills(i.e custom invoice)
  else {
    data.bills.forEach((b, index) => {
      finalBillsArr.push({
        name: b.name,
        amount: b.amount,
        type: "N/A",
        billType: " N/A",
        // targetMonth,
        key: index + 1,
      });
    });
  }

  tempData.billsDetailsArr = finalBillsArr;
  tempData.discountArr = discountArr;
  tempData.previousDue = 0;
  tempData.role = role;
  return tempData;
};

export { invoiceProcess };
