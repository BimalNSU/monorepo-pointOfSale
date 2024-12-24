//it's used in PMS invoice-payment only, will be removed
export const INVOICE_PAYMENT_STATUS = {
  pending: { type: "pending", text: "Pending", color: "cyan" },
  done: { type: "done", text: "Done", color: "success" },
  cancel: { type: "cancel", text: "Cancel", color: "red" },
};

export const INVOICE_STATUS = {
  KEYS: {
    0: { type: 0, text: "Draft", color: "black" },
    1: { type: 1, text: "Unpaid", color: "red" },
    // 2: { type: 2, text: "Partial", color: "cyan" },
    3: { type: 3, text: "Paid", color: "success" },
    4: { type: 4, text: "Transferred", color: "yellow" },
    5: { type: 5, text: "Cancelled", color: "yellow" },
  },
  VALUES: {
    Draft: 0,
    Unpaid: 1,
    // Partial: 2,
    Paid: 3,
    Returned: 4,
    Cancelled: 5,
  },
};
