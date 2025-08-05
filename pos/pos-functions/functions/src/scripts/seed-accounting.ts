import { ChartOfAccount } from "../db-collections/chartOfAccount.collection";
import { db } from "../firebase";

const seedData = async () => {
  const data = [
    {
      id: "assets",
      name: "Assets",
      parentId: null,
      normalBalance: null,
      isPostable: false,
    },
    {
      id: "current_assets",
      name: "Current Assets",
      parentId: "assets",
      normalBalance: null,
      isPostable: false,
    },
    {
      id: "bank",
      name: "Bank",
      parentId: "current_assets",
      normalBalance: null,
      isPostable: false,
    },
    {
      id: "city_bank",
      name: "City Bank",
      parentId: "bank",
      normalBalance: 0,
      isPostable: true,
    },
    {
      id: "brac_bank",
      name: "BRAC Bank",
      parentId: "bank",
      normalBalance: 0,
      isPostable: true,
    },
    //add more banks here
    {
      id: "bkash",
      name: "bKash",
      parentId: "current_assets",
      normalBalance: 0,
      isPostable: true,
    },
    {
      id: "rocket",
      name: "Rocket",
      parentId: "current_assets",
      normalBalance: 0,
      isPostable: true,
    },
    {
      id: "cash",
      name: "Cash in Hand",
      parentId: "current_assets",
      normalBalance: 0,
      isPostable: true,
    },
    {
      id: "inventory",
      name: "Inventory",
      parentId: "assets",
      normalBalance: 0,
      isPostable: true,
    },
    {
      id: "liabilities",
      name: "Liabilities",
      parentId: null,
      normalBalance: null,
      isPostable: false,
    },
    {
      id: "accounts_payable",
      name: "Accounts Payable",
      parentId: "liabilities",
      normalBalance: 1,
      isPostable: true,
    },
    {
      id: "vat_payable",
      name: "VAT Payable",
      parentId: "liabilities",
      normalBalance: 1,
      isPostable: true,
    },
    /*
    Income -> Sales Revenue -> Product Sale
                            -> Online Sale
           -> Contra Revenue -> Sales Return
                             -> Sales Discount
    */
    //#region : inserting all income accounts
    {
      id: "income",
      name: "Income",
      parentId: null,
      normalBalance: null,
      isPostable: false,
    },
    {
      id: "sales_revenue",
      name: "Sales Revenue",
      parentId: "income",
      normalBalance: null,
      isPostable: false,
    },
    {
      id: "product_sale",
      name: "Product Sale",
      parentId: "sales_revenue",
      normalBalance: 1,
      isPostable: true,
    },
    {
      id: "online_sale",
      name: "Online Sale",
      parentId: "sales_revenue",
      normalBalance: 1,
      isPostable: true,
    },
    {
      id: "contra_revenue",
      name: "Contra Revenue",
      parentId: "income",
      normalBalance: null,
      isPostable: false,
    },
    {
      id: "sales_return",
      name: "Sales Return",
      parentId: "contra_revenue",
      // type: "Income",
      // subtype: "Contra-Revenue",
      normalBalance: 0,
      isPostable: true,
    },
    {
      id: "sales_discount",
      name: "Sales Discount",
      parentId: "contra_revenue",
      normalBalance: 0,
      isPostable: true,
    },
    //#endregion
    {
      id: "expense",
      name: "Expense",
      parentId: null,
      normalBalance: null,
      isPostable: false,
    },
    {
      id: "cost_of_goods",
      name: "Cost of goods",
      parentId: "expense",
      normalBalance: 0,
      isPostable: true,
    },
    {
      id: "rent_expense",
      name: "Shop Rent",
      parentId: "expense",
      normalBalance: 0,
      isPostable: true,
    },
    {
      id: "salary_expense",
      name: "Staff Salaries",
      parentId: "expense",
      normalBalance: 0,
      isPostable: true,
    },
    {
      id: "utility_expense",
      name: "Utilities",
      parentId: "expense",
      normalBalance: 0,
      isPostable: true,
    },
    {
      id: "purchase",
      name: "Purchases",
      parentId: "expense",
      normalBalance: 0,
      isPostable: true,
    },
    {
      id: "advertising",
      name: "Advertising & Marketing",
      parentId: "expense",
      normalBalance: 0,
      isPostable: true,
    },
    {
      id: "transport_expense",
      name: "Transportation",
      parentId: "expense",
      normalBalance: 0,
      isPostable: true,
    },
    {
      id: "misc_expense",
      name: "Miscellaneous Expense",
      parentId: "expense",
      normalBalance: 0,
      isPostable: true,
    },
  ];
  const now = new Date();
  const charOfAccount = new ChartOfAccount();
  const batch = db.batch();
  const common = {
    createdAt: now,
    createdBy: "bimal",
    updatedAt: now,
    updatedBy: "bimal",
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
  };
  data.forEach((account) => {
    const { id, ...rest } = account;
    charOfAccount.create(batch, { ...rest, ...common }, id);
  });
  await batch.commit();
  console.log("Inserted all accounts");
};

seedData().then(() => process.exit(0));
/*
[
  {
    "id": "assets",
    "name": "Assets",
    "parentId": null,
    "children": [
      {
        "id": "current_assets",
        "name": "Current Assets",
        "parentId": "assets",
        "children": [
          {
            "id": "bank",
            "name": "Bank",
            "parentId": "current_assets",
            "children": [
              {
                "id": "city_bank",
                "name": "City Bank",
                "parentId": "bank",
                "children": []
              },
              {
                "id": "brac_bank",
                "name": "BRAC Bank",
                "parentId": "bank",
                "children": []
              }
            ]
          },
          {
            "id": "bkash",
            "name": "bKash",
            "parentId": "current_assets",
            "children": []
          },
          {
            "id": "petty_cash",
            "name": "Petty Cash",
            "parentId": "current_assets",
            "children": []
          }
        ]
      }
    ]
  }
]
*/
