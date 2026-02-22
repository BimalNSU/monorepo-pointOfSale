import { useSession } from "@/api/useSession";
import { useUser } from "@/api/useUser";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { Spin } from "antd";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthLoader = () => {
  const { session, userId, updateAuth } = useFirebaseAuth();
  const { data: dbSession, status: sessionStatus } = useSession(session?.id);
  const { data: dbUser, status: userStatus } = useUser(userId);

  useEffect(() => {
    if (sessionStatus === "success" && userStatus === "success") {
      updateAuth(dbUser, dbSession);
    }
  }, [dbSession, dbUser, sessionStatus, userStatus]);

  if (!session?.id || sessionStatus === "loading" || userStatus === "loading") {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!dbUser || !dbSession) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default AuthLoader;
