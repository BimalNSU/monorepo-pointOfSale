import { useCustomers } from "./useCustomers";
import { useDebounce } from "react-use";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import { CustomerRow } from "../customer.type";
type Filter = {
  page: number;
  pageSize: number;
  searchTerm?: string;
};
export const useCustomersPaginated = ({ page = 1, pageSize = 10, searchTerm }: Filter) => {
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerRow[]>([]);
  const { status, data } = useCustomers({ isDeleted: false });

  useDebounce(
    () => {
      if (!data?.length) {
        setFilteredCustomers([]);
        return;
      }
      const lowerSearch = searchTerm?.toLowerCase();
      const result = [];
      for (const c of data) {
        if (
          !lowerSearch ||
          (lowerSearch &&
            (c.id.includes(lowerSearch) ||
              c.firstName.toLowerCase().includes(lowerSearch) ||
              c.mobile.includes(lowerSearch) ||
              c.email?.toLowerCase().includes(lowerSearch)))
        ) {
          const { createdAt, ...rest } = c;
          result.push({
            ...rest,
            createdAt: dayjs(createdAt as Date).format(DATE_TIME_FORMAT),
            key: c.id,
          });
        }
      }
      setFilteredCustomers(result);
    },
    500,
    [data, searchTerm],
  );
  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, page, pageSize]);

  return { status, data: paginatedCustomers, itemCount: filteredCustomers.length };
};
