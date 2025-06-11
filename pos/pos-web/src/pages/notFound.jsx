import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { Button, Result, Spin } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const { isLoggingOut } = useFirebaseAuth();
  const navigate = useNavigate();
  if (isLoggingOut) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // full viewport height
        }}
      >
        <Spin />
      </div>
    );
  }
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          Back Home
        </Button>
      }
    />
  );
};
export default NotFound;
