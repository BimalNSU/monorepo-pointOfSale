export const customSort = (arr: Array<any>, dataIndex: string) => {
  const pattern = /^\d+/i;
  return arr.sort((cur, next) => {
    const a = cur[dataIndex].toLowerCase();
    const b = next[dataIndex].toLowerCase();
    const numOfA = a.match(pattern);
    const numOfB = b.match(pattern);
    // when both of them r non-numeric
    if (numOfA == null && numOfB == null) {
      // increasing order
      return a > b ? 1 : a < b ? -1 : 0;
    } else if (numOfA == null) {
      return -1;
    } else if (numOfB == null) {
      return 1;
    } else {
      // numeric value sort section(increasing order)
      const n1 = parseInt(numOfA[0]);
      const n2 = parseInt(numOfB[0]);
      if (n1 > n2) {
        return 1;
      } else if (n1 < n2) {
        return -1;
      } else {
        // when both r identical prefix numerical value
        return a > b ? 1 : a < b ? -1 : 0;
      }
    }
  });
};
