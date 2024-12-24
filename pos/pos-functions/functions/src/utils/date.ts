// Dayjs
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/en";

dayjs.extend(customParseFormat);
dayjs.locale("en");

const DEFAULT_DATE_FORMAT = "YYYY/MM/DD";

export const getMonthDateFromDateString = (
  dateString: string,
  format = DEFAULT_DATE_FORMAT
) => {
  const date = dayjs(dateString, format);
  return date.format("MMMM");
};
