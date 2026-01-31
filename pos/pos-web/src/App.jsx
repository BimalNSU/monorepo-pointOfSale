import { Route, BrowserRouter, Routes, Outlet } from "react-router-dom";
import "./assets/common/style.css";
import "firebase/storage";
// import MainLayoutLandingPage from "@/pages/LandingPage/Layout/MainLayoutLandingPage";
// import Index from "./pages/LandingPage/Index/Index";
import { useFirebaseAuthListener } from "./utils/hooks/useFirebaseAuthListener";
import AuthLoader from "./pages/Layout/authLoader";
import LoggedInLayout from "./pages/Layout/Logged-in-layout/LoggedInLayout";
import RequireRole from "./pages/requireRole";
import { SHOP_ROLE, USER_ROLE } from "./constants/role";
import useAuthStore from "./stores/auth.store";
import { Spin } from "antd";
import { lazy, Suspense } from "react";

const Login = lazy(() => import("@/pages/Auth/Login/Login"));
const HomePage = lazy(() => import("./pages/homePage"));
const Dashboard = lazy(() => import("./components/dashboard/dashboard"));

const Users = lazy(() => import("./pages/adminView/User/users"));
const UserAdd = lazy(() => import("./pages/adminView/User/userAdd"));
const UserDetails = lazy(() => import("./pages/adminView/User/userDetails"));

const Shops = lazy(() => import("./pages/adminView/shop/shops"));
const ShopAdd = lazy(() => import("./pages/adminView/shop/shopAdd"));
const ShopDetails = lazy(() => import("./pages/adminView/shop/shopDetails"));

const Products = lazy(() => import("./pages/ManagerView/Product/Products"));
const ProductAdd = lazy(() => import("./pages/ManagerView/Product/productAdd"));
const ProductDetails = lazy(() => import("./pages/ManagerView/Product/productDetails"));

const InvoiceAdd = lazy(() => import("./pages/ManagerView/Invoice/Add/invoiceAdd"));
const Invoices = lazy(() => import("./pages/ManagerView/Invoice/invoices"));
const InvoiceDetails = lazy(() => import("./pages/ManagerView/Invoice/View/invoiceDetails"));
const InvoiceReport = lazy(() => import("./pages/ManagerView/Invoice/invoiceReport"));

const GLReport = lazy(() => import("./pages/common/gl_report/generalLedgerReport"));
const BkashTransactions = lazy(() => import("./pages/common/bkashTransactions"));

const TestBarcode = lazy(() => import("./pages/ManagerView/testBarcode"));
const PrintBarcode = lazy(() => import("./pages/ManagerView/printBarcode"));

const NotFound = lazy(() => import("./pages/notFound"));

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
      <Suspense
        fallback={
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin size="large" />
          </div>
        }
      >
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          {/* <Route path="/home" exact element={<MainLayoutLandingPage page={"home"} />} /> */}
          {/* <Route path="/index" exact element={<Index />}></Route> */}
          {/* <Route path="/about" exact> */}
          {/* <MainLayoutLandingPage page={"about"} /> */}
          {/* </Route> */}
          {/* <Route path="/subscription" exact> */}
          {/* <MainLayoutLandingPage page={"subscription"} /> */}
          {/* </Route> */}

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
                  {/* <Route path=":id" element={<UserEdit />} /> */}
                  <Route path=":id" element={<UserDetails />} />
                </Route>

                <Route
                  path="shops"
                  element={
                    <RequireRole allowedRoles={[USER_ROLE.VALUES.Admin]}>
                      <Outlet />
                    </RequireRole>
                  }
                >
                  <Route index element={<Shops />} />
                  <Route path="add" element={<ShopAdd />} />
                  <Route path=":id" element={<ShopDetails />} />
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
                  <Route path=":id" element={<ProductDetails />} />
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
                <Route
                  path="btransactions"
                  element={
                    <RequireRole
                      allowedRoles={[USER_ROLE.VALUES.Admin, USER_ROLE.VALUES.Employee]}
                      allowedShopRoles={[
                        SHOP_ROLE.VALUES.Manager,
                        SHOP_ROLE.VALUES.Salesman,
                        SHOP_ROLE.VALUES.Cashier,
                      ]}
                    >
                      <BkashTransactions />
                    </RequireRole>
                  }
                />
                <Route
                  path="gl-report"
                  element={
                    <RequireRole allowedRoles={[USER_ROLE.VALUES.Admin]}>
                      <GLReport />
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
      </Suspense>
    </BrowserRouter>
  );
};
export default App;
