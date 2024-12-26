import { Layout, Menu } from "antd";
// footer img and icon
import Index from "../Index/Index";
import About from "../About/About";
import Subscription from "../Subscription/Subscription";
import CustomFooter from "./Footer/Footer";
import NavBar from "./NavBar/NavBar";

const { Content } = Layout;
// Profile Icon
const MainLayoutLandingPage = (props) => {
  return (
    <div>
      <Layout className="layout">
        {/* <CustomHeader /> */}
        <NavBar />
        <Content>
          {props.page === "home" ? <Index /> : null}
          {props.page === "about" ? <About /> : null}
          {props.page === "subscription" ? <Subscription /> : null}
        </Content>
        <CustomFooter />
      </Layout>
    </div>
  );
};
export default MainLayoutLandingPage;
