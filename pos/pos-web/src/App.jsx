import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./assets/common/style.css";
import "firebase/storage";
import Login from "@/pages/Auth/Login/Login";
import MainLayoutLandingPage from "@/pages/LandingPage/Layout/MainLayoutLandingPage";

import Index from "./pages/LandingPage/Index/Index";
import PrivateRoute from "./pages/Layout/PrivateRoute";
import Products from "./pages/ManagerView/Product/Products";
import ProductEdit from "./pages/ManagerView/Product/ProductEdit";
import Invoices from "./pages/ManagerView/Invoice/invoices";
import InvoiceDetails from "./pages/ManagerView/Invoice/View/invoiceDetails";
import ProductAdd from "./pages/ManagerView/Product/ProductAdd";
import InvoiceAdd from "./pages/ManagerView/Invoice/Add/invoiceAdd";
import NotFound from "./pages/notFound";
import InvoiceReport from "./pages/ManagerView/Invoice/invoiceReport";
import TestBarcode from "./pages/ManagerView/testBarcode";

const App = () => {
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

        <Route element={<PrivateRoute />}>
          {/* Define nested routes for private pages */}
          <Route path="products">
            {/* Product-related routes */}
            <Route index element={<Products />} />
            <Route path="add" element={<ProductAdd />} />
            <Route path=":id" element={<ProductEdit />} />
          </Route>
          <Route path="sales" element={<InvoiceAdd />} />
          <Route path="invoices">
            <Route index element={<Invoices />} />
            {/* Invoice-related routes */}
            {/* <Route path="add" element={<InvoiceAdd />} /> */}
            <Route path=":id" element={<InvoiceDetails />} />
          </Route>
          <Route path="reports" element={<InvoiceReport />} />

          <Route path="barcode" element={<TestBarcode />} />

          {/* Handle the case where no route matches */}
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
