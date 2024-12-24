export const COLLECTIONS = {
  // --- ROOT COLLECTIONS ---

  users: "users",
  properties: "properties",
  commonBills: "commonBills",
  recurringBills: "recurringBills",
  configurations: "configurations",
  configCommonBills: "configCommonBills",
  propertyBills: "propertyBills",
  commonBillConfigurations: "commonBillConfigurations", // !DEPRECATED
  members: "members",
  memberAssignments: "memberAssignments",
  // ! THIS IS ONLY FOR DEMO
  invoices: "invoices",
  recurringBillIssues: "recurringBillIssues",
  pbillNames: "pbillNames",
  invoicePayments: "invoicePayments",
  // new
  propertyPoints: "propertyPoints",
  pointTransactions: "pointTransactions",
  pointUsages: "pointUsages",
  communications: "communications",
  announcements: "announcements",
  nidRecords: "nidRecords",
  nidCreditUsages: "nidCreditUsages",

  // incomeCategories: "incomeCategories", // !DEPRECATED
  // expenseCategories: "expenseCategories", // !DEPRECATED
  // payrollCategories: "payrollCategories", // !DEPRECATED
  // recurringBillsMemo: "recurringBillsMemo", // !DEPRECATED

  // --- SUBCOLLECTIONS ---

  // users
  notifications: "notifications",

  // properties
  managerAssignments: "managerAssignments",
  ownerAssignments: "ownerAssignments", // TODO: not using; will be remove
  tenantAssignments: "tenantAssignments", // TODO: not using; will be remove
  residentials: "residentials",
  parkingLots: "parkingLots",
  shops: "shops",
  plotOwnerAssignments: "plotOwnerAssignments",
  tenantAgreements: "tenantAgreements",

  pbillConfigs: "pbillConfigs",
  // configPbills: "configPbills", // !DEPRECATED

  // properties/residentials
  ownerUnitAssignments: "ownerUnitAssignments",

  // properties/parkingLots
  ownerParkingAssignments: "ownerParkingAssignments",

  // properties/shops
  ownerShopAssignments: "ownerShopAssignments",

  // commonBillConfigurations
  subBillingTypes: "subBillingTypes",
};
