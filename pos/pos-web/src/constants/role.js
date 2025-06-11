export const ROLE = {
  1: { type: 1, text: "Admin" },
  2: { type: 2, text: "Employee" },
  3: { type: 3, text: "Vendor" },
};
export const USER_ROLE = {
  KEYS: { 1: "Admin", 2: "Employee", 3: "Vendor" },
  VALUES: { Admin: 1, Employee: 2, Vendor: 3 },
};
export const ROLE_STATUS = {
  KEYS: {
    1: { text: "Active", color: "success" },
    2: { text: "Inactive", color: "processing" },
    3: { text: "Revoked", color: "red" },
  },
  VALUES: { Active: 1, Inactive: 2, Revoked: 3 },
};
export const SHOP_ROLE = {
  KEYS: { 1: { text: "Manager" }, 2: { text: "Cashier" }, 3: { text: "Salesman" } },
  VALUES: { Manager: 1, Cashier: 2, Salesman: 3 },
};
