import { Route, BrowserRouter, Switch } from "react-router-dom";
import "./assets/common/style.css";
import "firebase/storage";
import Login from "@/pages/Auth/Login/Login";
import MainLayoutLandingPage from "@/pages/LandingPage/Layout/MainLayoutLandingPage";

import AuthManagedMainLayout from "@/pages/Layout/AuthManagedMainLayout";
import Index from "./pages/LandingPage/Index/Index";
import PrivateRoute from "./pages/Layout/PrivateRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/home" exact>
          <MainLayoutLandingPage page={"home"} />
        </Route>
        <Route path="/index" exact>
          <Index />
        </Route>
        <Route path="/about" exact>
          <MainLayoutLandingPage page={"about"} />
        </Route>
        <Route path="/subscription" exact>
          <MainLayoutLandingPage page={"subscription"} />
        </Route>

        <Route path="/login" exact>
          <Login />
        </Route>

        <PrivateRoute>
          <AuthManagedMainLayout />
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
};
export default App;
