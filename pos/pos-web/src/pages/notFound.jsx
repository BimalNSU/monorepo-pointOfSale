import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { Button, Result } from "antd";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const { session } = useFirebaseAuth();
  const location = useLocation();

  // if (location.pathname === "/" && session?.id) {
  //   return <Navigate to="/dashboard" />;
  // }
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        !session?.id ? (
          <>
            <Button type="primary" onClick={() => navigate(-1)}>
              Back Home
            </Button>
            <Button type="primary" onClick={() => navigate("/login", { replace: true })}>
              Goto Login
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={() => navigate("/dashboard")}>
            Back Home
          </Button>
        )
      }
    />
  );
};
export default NotFound;
