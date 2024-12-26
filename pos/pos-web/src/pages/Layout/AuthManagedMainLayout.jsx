import { Spin } from "antd";
import { useEffect } from "react";
import LoggedInLayout from "./Logged-in-layout/LoggedInLayout";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import { useUser } from "@/api/useUser";

const AuthManagedLayout = () => {
  const { userId, requestToUpdate } = useCustomAuth();
  const { status, data: userData } = useUser(userId);

  useEffect(() => {
    if (status === "success") {
      requestToUpdate(userData);
    }
  }, [userData]);

  if (status === "loading") {
    return (
      <div className={`spin`}>
        <Spin size="large" />
      </div>
    );
  }
  return <LoggedInLayout />;
};
export default AuthManagedLayout;
