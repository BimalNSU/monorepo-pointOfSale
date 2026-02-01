// export const ROLE_PERMISSIONS = {
//   // OWNER: ["ALL"],
//   MANAGER: ["SALE", "REFUND", "REPORT", "STOCK"],
//   CASHIER: ["SALE"],
//   // WAITER: ["CREATE_ORDER"],
//   SALESMAN: ["CREATE_ORDER"],
//   STOCK: ["STOCK"],
// };

export const SHOP_ROLES = {
  KEYS: {
    0: { text: "No Access", color: "red" },
    1: { text: "Manager", color: "blue" },
    2: { text: "Cashier", color: "green" },
    3: { text: "Salesman", color: "purple" },
    4: { text: "Stock Manager", color: "orange" },
  },
  VALUES: { N0_ACCESS: 0, Manager: 1, Cashier: 2, Salesman: 3, STOCK: 4 },
};
