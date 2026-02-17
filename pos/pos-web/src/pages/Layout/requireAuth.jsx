import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";

const RequireAuth = () => {
  const { userId, session } = useFirebaseAuth();
  const location = useLocation();

  // Not logged in → redirect
  if (!userId || !session?.id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
