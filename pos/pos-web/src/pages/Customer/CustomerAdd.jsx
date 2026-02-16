import { useDocumentFormat } from "@/api/useDocumentFormat";
import CustomerForm from "./CustomerForm";
import { useNavigate } from "react-router-dom";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
import Loading from "@/components/loading";

const CustomerAdd = () => {
  const navigate = useNavigate();
  const { status, documentId: newCustomerId } = useDocumentFormat(DOCUMENT_FORMAT.VALUES.Customer);

  const onSuccess = () => {
    navigate(-1);
  };
  if (status === "loading") {
    return <Loading />;
  }
  return <CustomerForm onSuccess={onSuccess} customerId={newCustomerId} />;
};
export default CustomerAdd;
