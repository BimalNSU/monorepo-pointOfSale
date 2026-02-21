import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { USER_ROLE } from "@pos/shared-models";
import { lazy } from "react";
const AdminDashboard = lazy(() => import("../adminView/adminDashboard"));
const EmployeeDashboard = lazy(() => import("@/components/dashboard/employeeDashboard"));

const Dashboard = () => {
  const { session } = useFirebaseAuth();
  return session.role === USER_ROLE.VALUES.Admin ? <AdminDashboard /> : <EmployeeDashboard />;
};
export default Dashboard;
