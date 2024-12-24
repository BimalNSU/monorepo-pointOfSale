import { Route, Switch } from "react-router-dom";
// import Dashboard from "../Dashboard/Dashboard";
import "firebase/storage";

import ProductList from "../Product/ProductList";
import CategoryList from "../Category/categoryList";
import AddProduct from "../Product/AddProduct";
import EditProduct from "../Product/EditProduct";
import InvoiceList from "../Invoice/invoiceList";
import InvoiceAdd from "../Invoice/Add/invoiceAdd";
import InvoiceView from "../Invoice/View/invoiceView";
import DemoPrint from "../Invoice/demo-print";
import InvoiceReport from "../Invoice/invoiceReport";

const ManagerApp = () => {
  return (
    <Switch>
      {/* property */}
      <Route path="/categories" exact component={CategoryList} />

      <Route path="/products" exact component={ProductList} />
      {/* <Route path="/products/:id/view" exact component={PropertyDetails} /> */}
      <Route path="/products/add" exact component={AddProduct} />
      <Route path="/products/:id" exact component={EditProduct} />

      <Route path="/invoices" exact component={InvoiceList} />
      <Route path="/invoices/add" exact>
        <InvoiceAdd />
      </Route>
      <Route path="/invoices/:id" exact component={InvoiceView}></Route>

      <Route path="/reports" exact component={InvoiceReport} />

      <Route path="/demo-receipt" exact component={DemoPrint}></Route>

      {/* TODO: following 3 routes for member, will be removed and move to under a propertyId scope
      <Route path="/members" exact>
        <MemberList />
      </Route>
      <Route path="/members/add" exact>
        <MemberAdd />
      </Route>
      <Route path="/members/:id/edit" exact>
        <MemberEdit />
      </Route> */}
    </Switch>
  );
};
export default ManagerApp;
