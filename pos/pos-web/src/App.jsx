import { Route, BrowserRouter, Routes, Outlet } from "react-router-dom";
import "./assets/common/style.css";
import "firebase/storage";
import Login from "@/pages/Auth/Login/Login";
import MainLayoutLandingPage from "@/pages/LandingPage/Layout/MainLayoutLandingPage";
import Index from "./pages/LandingPage/Index/Index";
import NotFound from "./pages/notFound";
import { useFirebaseAuthListener } from "./utils/hooks/useFirebaseAuthListener";
import TestBarcode from "./pages/ManagerView/testBarcode";
import PrintBarcode from "./pages/ManagerView/printBarcode";
import InvoiceReport from "./pages/ManagerView/Invoice/invoiceReport";
import InvoiceDetails from "./pages/ManagerView/Invoice/View/invoiceDetails";
import Invoices from "./pages/ManagerView/Invoice/invoices";
import InvoiceAdd from "./pages/ManagerView/Invoice/Add/invoiceAdd";
import ProductEdit from "./pages/ManagerView/Product/ProductEdit";
import ProductAdd from "./pages/ManagerView/Product/ProductAdd";
import Products from "./pages/ManagerView/Product/Products";
import UserAdd from "./pages/adminView/User/userAdd";
import Users from "./pages/adminView/User/users";
import Dashboard from "./components/dashboard/dashboard";
import AuthLoader from "./pages/Layout/authLoader";
import LoggedInLayout from "./pages/Layout/Logged-in-layout/LoggedInLayout";
import RequireRole from "./pages/requireRole";
import { SHOP_ROLE, USER_ROLE } from "./constants/role";
import useAuthStore from "./stores/auth.store";
import { Spin } from "antd";

const App = () => {
  useFirebaseAuthListener(); //Called once to sync with auth
  const { userId, session, isLoggingOut } = useAuthStore();
  if (isLoggingOut) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // full viewport height
        }}
      >
        <Spin />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" exact element={<MainLayoutLandingPage page={"home"} />} />
        <Route path="/index" exact element={<Index />}></Route>
        <Route path="/about" exact>
          {/* <MainLayoutLandingPage page={"about"} /> */}
        </Route>
        <Route path="/subscription" exact>
          {/* <MainLayoutLandingPage page={"subscription"} /> */}
        </Route>

        <Route path="/login" exact element={<Login />} />
        {/* <Route
          path="/login"
          exact
          element={!session?.id ? <Login /> : <Navigate to="/dashboard" />}
        /> */}
        {/* {userId && session?.id && <Route path="/*" element={<PrivateRoute />} />} */}

        {userId && session?.id && (
          <Route element={<AuthLoader />}>
            <Route element={<LoggedInLayout />}>
              <Route path="dashboard" element={<Dashboard />} />

              <Route
                path="users"
                element={
                  <RequireRole allowedRoles={[USER_ROLE.VALUES.Admin]}>
                    <Outlet />
                  </RequireRole>
                }
              >
                <Route index element={<Users />} />
                <Route path="add" element={<UserAdd />} />
              </Route>

              <Route
                path="products"
                element={
                  <RequireRole
                    allowedRoles={[USER_ROLE.VALUES.Admin, USER_ROLE.VALUES.Employee]}
                    allowedShopRoles={[SHOP_ROLE.VALUES.Manager]}
                  >
                    <Outlet />
                  </RequireRole>
                }
              >
                <Route index element={<Products />} />
                <Route path="add" element={<ProductAdd />} />
                <Route path=":id" element={<ProductEdit />} />
              </Route>

              <Route
                path="sales"
                element={
                  <RequireRole
                    allowedRoles={[USER_ROLE.VALUES.Admin, USER_ROLE.VALUES.Employee]}
                    allowedShopRoles={[SHOP_ROLE.VALUES.Manager, SHOP_ROLE.VALUES.Salesman]}
                  >
                    <InvoiceAdd />
                  </RequireRole>
                }
              />

              <Route
                path="invoices"
                element={
                  <RequireRole
                    allowedRoles={[USER_ROLE.VALUES.Admin, USER_ROLE.VALUES.Employee]}
                    allowedShopRoles={[
                      SHOP_ROLE.VALUES.Manager,
                      SHOP_ROLE.VALUES.Salesman,
                      SHOP_ROLE.VALUES.Cashier,
                    ]}
                  >
                    <Outlet />
                  </RequireRole>
                }
              >
                <Route index element={<Invoices />} />
                <Route path=":id" element={<InvoiceDetails />} />
              </Route>

              <Route
                path="reports"
                element={
                  <RequireRole
                    allowedRoles={[USER_ROLE.VALUES.Admin, USER_ROLE.VALUES.Employee]}
                    allowedShopRoles={[
                      SHOP_ROLE.VALUES.Manager,
                      SHOP_ROLE.VALUES.Salesman,
                      SHOP_ROLE.VALUES.Cashier,
                    ]}
                  >
                    <InvoiceReport />
                  </RequireRole>
                }
              />

              <Route path="barcode" element={<TestBarcode />} />
              <Route path="print-barcode" element={<PrintBarcode />} />
            </Route>
          </Route>
        )}
        {/* Handle the case where no route matches */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
