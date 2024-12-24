const intlObj = new Intl.NumberFormat("en-IN", {
  // style: "currency",
  // currency: "BDT",
  // minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export const convertToBD = (amount: number) => {
  // India uses thousands/lakh/crore separators
  return intlObj.format(amount);
};
