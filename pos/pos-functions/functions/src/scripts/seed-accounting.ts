import {
  AccountTypeHead,
  AccountType as AccountTypeModel,
  WithId,
} from "@pos/shared-models";
import { ChartOfAccount } from "../db-collections/chartOfAccount.collection";
import { db } from "../firebase";
import { AccountType } from "../db-collections/accountType.collection";

const seedFixAssets = (accountTypes: WithId<AccountTypeModel>[]) => {
  const accountType = accountTypes.find((type) => type.name === "fixAsset")!;
  return [
    "Land",
    "Buildings",
    "Machinery and Equipment",
    "Vehicles",
    "Furniture and Fixtures",
  ].map((name, index) => ({
    id: `${index + 12}`,
    name,
    accountTypeId: accountType.id,
    accountTypeName: accountType.name,
    accountTypeHead: accountType.head,
  }));
};
const seedOtherAssets = (accountTypes: WithId<AccountTypeModel>[]) => {
  const accountType = accountTypes.find((type) => type.name === "otherAsset")!;
  return ["Long-term Investments", "Deferred Tax Assets"].map(
    (name, index) => ({
      id: `${index + 17}`,
      name,
      accountTypeId: accountType.id,
      accountTypeName: accountType.name,
      accountTypeHead: accountType.head,
    })
  );
};

const seedCurrentLiabilities = (accountTypes: WithId<AccountTypeModel>[]) => {
  const accountType = accountTypes.find(
    (type) => type.name === "currentLiabilities"
  )!;
  return ["Short-term Loans", "Accrued Expenses", "Taxes Payable"].map(
    (name, index) => ({
      id: `${index + 19}`,
      name,
      accountTypeId: accountType.id,
      accountTypeName: accountType.name,
      accountTypeHead: accountType.head,
    })
  );
};
const seedNonCurrentLiabilities = (
  accountTypes: WithId<AccountTypeModel>[]
) => {
  const accountType = accountTypes.find(
    (type) => type.name === "nonCurrentLiabilities"
  )!;
  return [
    "Long-term Loans",
    "Bonds Payable",
    "Deferred Tax Liabilities",
    "Mortgage Payable",
  ].map((name, index) => ({
    id: `${index + 22}`,
    name,
    accountTypeId: accountType.id,
    accountTypeName: accountType.name,
    accountTypeHead: accountType.head,
  }));
};

//expense
const seedCostOfGoodsSoldTypeExpense = (
  accountTypes: WithId<AccountTypeModel>[]
) => {
  const accountType = accountTypes.find(
    (type) => type.name === "costOfGoodsSold"
  )!;
  return ["Direct Materials", "Direct Labor", "Manufacturing Overhead"].map(
    (name, index) => ({
      id: `${index + 28}`,
      name,
      accountTypeId: accountType.id,
      accountTypeName: accountType.name,
      accountTypeHead: accountType.head,
    })
  );
};
const seedGeneralAndAdministrativeExpenses = (
  accountTypes: WithId<AccountTypeModel>[]
) => {
  const accountType = accountTypes.find(
    (type) => type.name === "generalAdmistrativeExpenses"
  )!;
  return [
    "Office Supplies",
    "Rent",
    "Utilities",
    "Salaries and Wages",
    "Depreciation",
  ].map((name, index) => ({
    id: `${index + 31}`,
    name,
    accountTypeId: accountType.id,
    accountTypeName: accountType.name,
    accountTypeHead: accountType.head,
  }));
};
const seedFinancialExpenses = (accountTypes: WithId<AccountTypeModel>[]) => {
  const accountType = accountTypes.find(
    (type) => type.name === "financialExpenses"
  )!;
  return ["Interest Expense", "Bad Debt Expense"].map((name, index) => ({
    id: `${index + 36}`,
    name,
    accountTypeId: accountType.id,
    accountTypeName: accountType.name,
    accountTypeHead: accountType.head,
  }));
};
const seedOtherExpenses = (accountTypes: WithId<AccountTypeModel>[]) => {
  const accountType = accountTypes.find(
    (type) => type.name === "otherExpenses"
  )!;
  return ["Loss on Sale of Assets", "Income Tax Expense"].map(
    (name, index) => ({
      id: `${index + 38}`,
      name,
      accountTypeId: accountType.id,
      accountTypeName: accountType.name,
      accountTypeHead: accountType.head,
    })
  );
};

const seedData = async () => {
  const authUserId = "bimal";
  const accountTypeSeeds = [
    { id: "1", name: "currentAsset", head: AccountTypeHead.ASSET },
    { id: "2", name: "pettyCash", head: AccountTypeHead.ASSET },
    { id: "3", name: "bank", head: AccountTypeHead.ASSET },
    { id: "4", name: "fixAsset", head: AccountTypeHead.ASSET },
    { id: "5", name: "otherAsset", head: AccountTypeHead.ASSET },

    { id: "6", name: "currentLiabilities", head: AccountTypeHead.LIABILITY },
    { id: "7", name: "bankLoan", head: AccountTypeHead.LIABILITY },
    { id: "8", name: "nonCurrentLiabilities", head: AccountTypeHead.LIABILITY },

    { id: "9", name: "salesRevenue", head: AccountTypeHead.INCOME },
    { id: "10", name: "otherRevenue", head: AccountTypeHead.INCOME },

    { id: "11", name: "costOfGoodsSold", head: AccountTypeHead.EXPENSE },
    { id: "12", name: "operatingExpenses", head: AccountTypeHead.EXPENSE },
    {
      id: "13",
      name: "generalAdmistrativeExpenses",
      head: AccountTypeHead.EXPENSE,
    },
    { id: "14", name: "financialExpenses", head: AccountTypeHead.EXPENSE },
    { id: "15", name: "otherExpenses", head: AccountTypeHead.EXPENSE },
  ];
  const accountType = new AccountType();
  const batch = db.batch();
  accountTypeSeeds.forEach((type) => {
    const { id, ...rest } = type;
    accountType.create(batch, rest, id);
  });

  const chartOfAccount = new ChartOfAccount();
  const now = new Date();
  const defaultDataInCoa = {
    isActive: true,
    createdAt: now,
    createdBy: authUserId,
    isDeleted: false,
    updatedAt: now,
    updatedBy: authUserId,
    deletedAt: null,
    deletedBy: null,
  };

  const currentAssetAccountType = accountTypeSeeds.find(
    (type) => type.name === "currentAsset"
  )!;
  const currentLiabilityAccountType = accountTypeSeeds.find(
    (type) => type.name === "currentLiabilities"
  )!;
  const bankLoanAccountType = accountTypeSeeds.find(
    (type) => type.name === "bankLoan"
  )!;
  const financialExpensesAccountType = accountTypeSeeds.find(
    (type) => type.name === "financialExpenses"
  )!;
  const reserveChartOfAccountSeeds = [
    {
      id: "1",
      name: "Receivable",
      accountTypeName: currentAssetAccountType.name,
      accountTypeId: currentAssetAccountType.id,
      accountTypeHead: currentAssetAccountType.head,
    },
    {
      id: "2",
      name: "Prepaid Expenses",
      accountTypeName: currentAssetAccountType.name,
      accountTypeId: currentAssetAccountType.id,
      accountTypeHead: currentAssetAccountType.head,
    },
    {
      id: "3",
      name: "Undeposited Funds",
      accountTypeName: currentAssetAccountType.name,
      accountTypeId: currentAssetAccountType.id,
      accountTypeHead: currentAssetAccountType.head,
    },
    {
      id: "4",
      name: "Accounts Payable",
      accountTypeName: currentLiabilityAccountType.name,
      accountTypeId: currentLiabilityAccountType.id,
      accountTypeHead: currentLiabilityAccountType.head,
    },
    {
      id: "5",
      name: "Bank Loan",
      accountTypeName: bankLoanAccountType.name,
      accountTypeId: bankLoanAccountType.id,
      accountTypeHead: bankLoanAccountType.head,
    },
    {
      id: "6",
      name: "Unearned Revenue",
      accountTypeName: currentLiabilityAccountType.name,
      accountTypeId: currentLiabilityAccountType.id,
      accountTypeHead: currentLiabilityAccountType.head,
    },
    {
      id: "7",
      name: "Bank Charges",
      accountTypeName: financialExpensesAccountType.name,
      accountTypeId: financialExpensesAccountType.id,
      accountTypeHead: financialExpensesAccountType.head,
    },
  ];
  reserveChartOfAccountSeeds.forEach((coa) => {
    const { id, ...rest } = coa;
    chartOfAccount.create(batch, { ...rest, ...defaultDataInCoa }, id);
  });
  const pettyCashAccountType = accountTypeSeeds.find(
    (type) => type.name === "pettyCash"
  )!;
  const bankAccountType = accountTypeSeeds.find(
    (type) => type.name === "bank"
  )!;
  const salesRevenueAccountType = accountTypeSeeds.find(
    (type) => type.name === "salesRevenue"
  )!;
  const otherChartOfAccounts = [
    {
      id: "8",
      name: "Petty Cash",
      accountTypeName: pettyCashAccountType.name,
      accountTypeId: pettyCashAccountType.id,
      accountTypeHead: pettyCashAccountType.head,
    },
    {
      id: "9",
      name: "Bank",
      accountTypeName: bankAccountType.name,
      accountTypeId: bankAccountType.id,
      accountTypeHead: bankAccountType.head,
    },
    {
      id: "10",
      name: "Inventory",
      accountTypeName: currentAssetAccountType.name,
      accountTypeId: currentAssetAccountType.id,
      accountTypeHead: currentAssetAccountType.head,
    },
    {
      id: "11",
      name: "Short-term Investments",
      accountTypeName: currentAssetAccountType.name,
      accountTypeId: currentAssetAccountType.id,
      accountTypeHead: currentAssetAccountType.head,
    },
    ...seedFixAssets(accountTypeSeeds),
    ...seedOtherAssets(accountTypeSeeds),

    ...seedCurrentLiabilities(accountTypeSeeds),
    ...seedNonCurrentLiabilities(accountTypeSeeds),

    {
      id: "26",
      name: "Monthly Income",
      accountTypeId: salesRevenueAccountType.id,
      accountTypeName: salesRevenueAccountType.name,
      accountTypeHead: salesRevenueAccountType.head,
    },
    {
      id: "27",
      name: "Product Sales",
      accountTypeId: salesRevenueAccountType.id,
      accountTypeName: salesRevenueAccountType.name,
      accountTypeHead: salesRevenueAccountType.head,
    },

    //expense accounts
    ...seedCostOfGoodsSoldTypeExpense(accountTypeSeeds),
    ...seedGeneralAndAdministrativeExpenses(accountTypeSeeds),
    ...seedFinancialExpenses(accountTypeSeeds),
    ...seedOtherExpenses(accountTypeSeeds),
  ];
  otherChartOfAccounts.forEach((coa) => {
    const { id, ...rest } = coa;
    chartOfAccount.create(batch, { ...rest, ...defaultDataInCoa }, id);
  });
  await batch.commit();
  console.log("checkout");
};

seedData().then(() => process.exit(0));
