import { Navigate } from "react-router-dom";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { ShopRole, UserRole } from "@pos/shared-models";
import { USER_ROLE } from "@pos/shared-models";

const RequireRole = ({
  children,
  allowedRoles = [],
  allowedShopRoles = [],
}: {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  allowedShopRoles: ShopRole[];
}) => {
  const { session } = useFirebaseAuth();
  const hasAccess =
    session &&
    allowedRoles.includes(session.role) &&
    (session.role === USER_ROLE.VALUES.Admin ||
      !allowedShopRoles.length ||
      (session.shopRole && allowedShopRoles.includes(session.shopRole)));

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
