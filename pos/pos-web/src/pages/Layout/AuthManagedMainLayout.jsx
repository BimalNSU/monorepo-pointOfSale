import { Spin } from "antd";
import { doc } from "firebase/firestore";
import { useEffect } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";
import LoggedInLayout from "./Logged-in-layout/LoggedInLayout";
import { COLLECTIONS } from "@/constants/collections";
import { useCustomAuth } from "@/utils/hooks/customAuth";

const AuthManagedLayout = () => {
  const db = useFirestore();
  const { userId, requestToUpdate } = useCustomAuth();
  const userDocRef = doc(db, COLLECTIONS.users, userId);
  const { status, data: userData } = useFirestoreDocData(userDocRef, {
    idField: "id",
  });
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
