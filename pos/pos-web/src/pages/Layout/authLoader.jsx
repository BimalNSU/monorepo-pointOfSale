import { useSession } from "@/api/useSession";
import { useUser } from "@/api/useUser";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { Spin } from "antd";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const AuthLoader = () => {
  const { userId, updateAuth, session } = useFirebaseAuth();
  const { status, data: dbSession } = useSession(userId, session.id);
  const { status: fetchUser, data: dbUser } = useUser(userId);

  useEffect(() => {
    if (status === "success" && fetchUser === "success") {
      updateAuth({ user: dbUser, session: dbSession, isLoadingAuth: undefined });
    }
  }, [dbUser, dbSession]);

  if (status === "loading" || fetchUser === "loading") {
    return (
      <div className={`spin`}>
        <Spin size="large" />
      </div>
    );
  }
  return <Outlet />;
};
export default AuthLoader;
