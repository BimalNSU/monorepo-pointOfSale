import { useCustomers } from "@/api/useCustomers";
import CustomersContainer from "@/components/Customer/customerDataTable";

const DeletedCustomers = () => {
  const { status, data } = useCustomers({ isDeleted: true });
  return <CustomersContainer status={status} data={data} />;
};
export default DeletedCustomers;
