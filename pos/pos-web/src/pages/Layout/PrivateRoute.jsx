import { useCustomAuth } from "@/utils/hooks/customAuth";
import { Navigate } from "react-router-dom";
import AuthManagedLayout from "./AuthManagedMainLayout";

const PrivateRoute = () => {
  const { isLoggedIn } = useCustomAuth();
  return isLoggedIn ? <AuthManagedLayout></AuthManagedLayout> : <Navigate to="/login" />;
};

export default PrivateRoute;
