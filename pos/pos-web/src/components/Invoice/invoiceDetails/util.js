export const convertToWords = (num) => {
  const single = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const double = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const formatTenth = (digit, prev) => {
    return digit === 0 ? "" : " " + (digit === 1 ? double[prev] : tens[digit]);
  };

  const formatOther = (digit, next, denom) => {
    return (
      (digit !== 0 && next !== 1 ? " " + single[digit] : "") +
      (digit !== 0 || next !== 0 ? " " + denom : "")
    );
  };

  let res = "";
  let index = 0;
  let digit = 0;
  let next = 0;
  let words = [];

  num = num.replace(/,/g, "").replace(/\..*$/, "");

  if (isNaN(parseInt(num))) {
    res = "";
  } else if (parseInt(num) > 0 && num.length <= 10) {
    for (index = num.length - 1; index >= 0; index--) {
      digit = parseInt(num[index]);
      next = index > 0 ? parseInt(num[index - 1]) : 0;
      switch (num.length - index - 1) {
        case 0:
          words.push(formatOther(digit, next, ""));
          break;
        case 1:
          words.push(formatTenth(digit, parseInt(num[index + 1])));
          break;
        case 2:
          words.push(
            digit !== 0
              ? " " +
                  single[digit] +
                  " Hundred" +
                  (next !== 0 || parseInt(num[index + 2]) !== 0 ? "" : "")
              : "",
          );
          break;
        case 3:
          words.push(formatOther(digit, next, "Thousand"));
          break;
        case 4:
          words.push(formatTenth(digit, parseInt(num[index + 1])));
          break;
        case 5:
          words.push(formatOther(digit, next, "Lakh"));
          break;
        case 6:
          words.push(formatTenth(digit, parseInt(num[index + 1])));
          break;
        case 7:
          words.push(formatOther(digit, next, "Crore"));
          break;
        case 8:
          words.push(formatTenth(digit, parseInt(num[index + 1])));
          break;
        case 9:
          words.push(
            digit !== 0
              ? " " +
                  single[digit] +
                  " Hundred" +
                  (next !== 0 || parseInt(num[index + 2]) !== 0 ? "" : " Crore")
              : "",
          );
          break;
      }
    }
    res = words.reverse().join("").trim() + " Only";
  } else {
    res = "";
  }

  return res;
};
