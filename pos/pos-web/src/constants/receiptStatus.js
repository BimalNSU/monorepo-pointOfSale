export const RECEIPT_STATUS = {
  KEYS: {
    0: { type: 0, text: "Pending", color: "cyan" },
    1: { type: 1, text: "Completed", color: "success" },
    2: { type: 2, text: "Cancelled", color: "red" },
  },
  VALUES: {
    Pending: 0,
    completed: 1,
    Cancelled: 2,
  },
};

export const RECEIPT_MODE = {
  KEYS: {
    0: { type: 0, text: "Cash" },
    1: { type: 1, text: "Bank" },
    2: { type: 2, text: "MFS" },
    3: { type: 3, text: "Cheque" },
  },
  VALUES: {
    Cash: 0,
    Bank: 1,
    MFS: 2,
    Cheque: 3,
  },
};
