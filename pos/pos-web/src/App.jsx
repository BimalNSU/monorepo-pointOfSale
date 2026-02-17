import { Route, BrowserRouter, Routes, Outlet, Navigate } from "react-router-dom";
import "./assets/common/style.css";
import "firebase/storage";
// import MainLayoutLandingPage from "@/pages/LandingPage/Layout/MainLayoutLandingPage";
// import Index from "./pages/LandingPage/Index/Index";
import { useFirebaseAuthListener } from "./utils/hooks/useFirebaseAuthListener";
import AuthLoader from "./pages/Layout/authLoader";
import LoggedInLayout from "./pages/Layout/Logged-in-layout/LoggedInLayout";
import RequireRole from "./pages/requireRole";
import { SHOP_ROLE, USER_ROLE } from "@pos/shared-models";
import useAuthStore from "./stores/auth.store";
import { Spin } from "antd";
import { lazy, Suspense } from "react";
import ProductDetails2 from "./components/Product/productDetails2";
import RequireAuth from "./pages/Layout/requireAuth";

const CustomerLayout = lazy(() => import("./pages/Layout/Customer-layout/customerLayout"));

const CustomerAdd = lazy(() => import("./pages/Customer/CustomerAdd"));
const CustomerProfile = lazy(() => import("./pages/Customer/customerProfile"));
const Customers = lazy(() => import("./pages/Customer/customers"));

const PublishedProducts = lazy(() => import("./pages/Layout/Customer-layout/publishedProducts"));
const OfficeAddress = lazy(() => import("./pages/Layout/Customer-layout/addressSection"));
const ShopPage = lazy(() => import("./pages/shopPage"));

const Login = lazy(() => import("@/pages/Auth/Login/Login"));
// const HomePage = lazy(() => import("./pages/homePage"));
const Dashboard = lazy(() => import("./components/dashboard/dashboard"));

const SelfProfile = lazy(() => import("./pages/Layout/UserView/UserProfile/View/SelfProfile"));

const Users = lazy(() => import("./pages/adminView/User/users"));
const UserAdd = lazy(() => import("./pages/adminView/User/userAdd"));
const UserProfile = lazy(() => import("./pages/adminView/User/userProfile"));

const Shops = lazy(() => import("./pages/adminView/shop/shops"));
const ShopAdd = lazy(() => import("./pages/adminView/shop/shopAdd"));
const ShopSettingsPage = lazy(() => import("./pages/adminView/shop/shopSettingsPage"));

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

// Customer Auth for actions like Add to Cart
const CustomerAuth = ({ children }) => {
  const { session } = useAuthStore();
  if (!session?.id || session.role !== "Customer") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  useFirebaseAuthListener();
  const { session, isLoggingOut } = useAuthStore();

  if (isLoggingOut) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Spin size="large" />
          </div>
        }
      >
        <Routes>
          {/* ---------------- PUBLIC CUSTOMER ROUTES ---------------- */}
          <Route element={<CustomerLayout />}>
            <Route index element={<PublishedProducts />} />
            <Route path="contact-us" element={<OfficeAddress />} />
            <Route path="product/:id" element={<ProductDetails2 />} />
          </Route>

          {/* ---------------- PUBLIC ROUTES ---------------- */}
          <Route path="/shop" element={<ShopPage />} />
          <Route
            path="/login"
            element={!session?.id ? <Login /> : <Navigate to="/dashboard" replace />}
          />

          {/* ---------------- EMPLOYEE/ADMIN PORTAL ---------------- */}
          <Route element={<RequireAuth />}>
            <Route element={<AuthLoader />}>
              <Route element={<LoggedInLayout />}>
                {/* Dashboard & Profile */}
                <Route
                  path="/dashboard"
                  element={
                    <RequireRole allowedRoles={[USER_ROLE.VALUES.Admin, USER_ROLE.VALUES.Employee]}>
                      <Dashboard />
                    </RequireRole>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <RequireRole allowedRoles={[USER_ROLE.VALUES.Admin, USER_ROLE.VALUES.Employee]}>
                      <SelfProfile />
                    </RequireRole>
                  }
                />

                {/* Users */}
                <Route
                  path="/users"
                  element={
                    <RequireRole allowedRoles={[USER_ROLE.VALUES.Admin]}>
                      <Outlet />
                    </RequireRole>
                  }
                >
                  <Route index element={<Users />} />
                  <Route path="add" element={<UserAdd />} />
                  <Route path=":id" element={<UserProfile />} />
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
                  <Route path=":id" element={<ShopSettingsPage />} />
                </Route>

                <Route
                  path="customers"
                  element={
                    <RequireRole
                      allowedRoles={[USER_ROLE.VALUES.Admin, USER_ROLE.VALUES.Employee]}
                      allowedShopRoles={[SHOP_ROLE.VALUES.Manager]}
                    >
                      <Outlet />
                    </RequireRole>
                  }
                >
                  <Route index element={<Customers />} />
                  <Route path="add" element={<CustomerAdd />} />
                  <Route path=":id" element={<CustomerProfile />} />
                </Route>

                {/* Products */}
                <Route
                  path="/products"
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
          </Route>

          {/* ---------------- CUSTOMER PROTECTED ACTIONS ---------------- */}
          {/* Example: Add to Cart */}
          <Route
            path="/cart/add/:productId"
            element={
              <CustomerAuth>
                {/* Your Add to Cart Component */}
                <div>Add to Cart Page / Component Here</div>
              </CustomerAuth>
            }
          />

          {/* ---------------- 404 ---------------- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
