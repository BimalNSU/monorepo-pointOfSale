import { useCustomAuth } from "@/utils/hooks/customAuth";
import { Redirect } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useCustomAuth();
  return isLoggedIn ? children : <Redirect to="/login" />;
};

export default PrivateRoute;
