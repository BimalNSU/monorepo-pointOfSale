import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./assets/common/style.css";
import "firebase/storage";
import Login from "@/pages/Auth/Login/Login";
import MainLayoutLandingPage from "@/pages/LandingPage/Layout/MainLayoutLandingPage";
import Index from "./pages/LandingPage/Index/Index";
import PrivateRoute from "./privateRoute";
import NotFound from "./pages/notFound";
import { useFirebaseAuthListener } from "./utils/hooks/useFirebaseAuthListener";
import useAuthStore2 from "./stores/auth2.store";

const App = () => {
  useFirebaseAuthListener(); //Called once to sync with auth
  const { userId, session } = useAuthStore2();
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
        {userId && session?.id && <Route path="/*" element={<PrivateRoute />} />}

        {/* Handle the case where no route matches */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
