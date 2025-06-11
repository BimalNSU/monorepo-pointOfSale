import { Outlet, Route, Routes } from "react-router-dom";
import { useSession } from "@/api/useSession";
import { USER_ROLE, SHOP_ROLE } from "@/constants/role";
import Users from "@/pages/adminView/User/users";
import UserAdd from "@/pages/adminView/User/userAdd";
import Products from "@/pages/ManagerView/Product/Products";
import ProductAdd from "@/pages/ManagerView/Product/ProductAdd";
import ProductEdit from "@/pages/ManagerView/Product/ProductEdit";
import InvoiceAdd from "@/pages/ManagerView/Invoice/Add/invoiceAdd";
import Invoices from "@/pages/ManagerView/Invoice/invoices";
import InvoiceDetails from "@/pages/ManagerView/Invoice/View/invoiceDetails";
import InvoiceReport from "@/pages/ManagerView/Invoice/invoiceReport";
import { useEffect } from "react";
import { useFirebaseAuth } from "./utils/hooks/useFirebaseAuth";
import { useUser } from "./api/useUser";
import { Spin } from "antd";
import LoggedInLayout from "./pages/Layout/Logged-in-layout/LoggedInLayout";
import TestBarcode from "./pages/ManagerView/testBarcode";
import Dashboard from "./components/dashboard/dashboard";

const PrivateRoute = () => {
  const { userId, session, updateUserInfo, updateSessionInfo } = useFirebaseAuth();
  const { status, data: dbSession } = useSession(userId, session?.id);
  const { status: fetchUser, data: dbUser } = useUser(userId);

  useEffect(() => {
    if (fetchUser === "success") {
      updateUserInfo(dbUser);
    }
  }, [dbUser]);
  useEffect(() => {
    if (status === "success") {
      updateSessionInfo(dbSession);
    }
  }, [dbSession]);
  if (status === "loading" || fetchUser === "loading") {
    return (
      <div className={`spin`}>
        <Spin size="large" />
      </div>
    );
  }

  // if (!session?.id) return null; // Or a loading spinner
  // if (!session.id) return <Navigate to="/login" />;

  return (
    <Routes>
      <Route element={<LoggedInLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        {session.role === USER_ROLE.VALUES.Admin ? (
          <Route path="users" element={<Outlet />}>
            <Route index element={<Users />} />
            <Route path="add" element={<UserAdd />} />
          </Route>
        ) : null}

        {(session.role && session.role === USER_ROLE.VALUES.Admin) ||
        (session.shopRole && session.shopRole === SHOP_ROLE.VALUES.Manager) ? (
          <Route path="products" element={<Outlet />}>
            <Route index element={<Products />} />
            <Route path="add" element={<ProductAdd />} />
            <Route path=":id" element={<ProductEdit />} />
          </Route>
        ) : null}

        {[SHOP_ROLE.VALUES.Manager, SHOP_ROLE.VALUES.Salesman].includes(session.shopRole) && (
          <Route path="sales" element={<InvoiceAdd />} />
        )}

        {session.shopId && (
          <>
            <Route path="invoices" element={<Outlet />}>
              <Route index element={<Invoices />} />
              <Route path=":id" element={<InvoiceDetails />} />
            </Route>
            <Route path="reports" element={<InvoiceReport />} />
          </>
        )}
        <Route path="barcode" element={<TestBarcode />} />
      </Route>
    </Routes>
  );
};

export default PrivateRoute;
