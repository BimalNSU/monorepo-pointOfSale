export const getIntersection = <T>(arr1: T[], arr2: T[]) => {
  return arr1.filter((val) => arr2.includes(val));
};
