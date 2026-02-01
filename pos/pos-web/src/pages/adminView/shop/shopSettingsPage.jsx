import { Card, Tabs } from "antd";
import ShopInfoTab from "./tabs/shopInfoTab";
import EmployeeAccessTab from "./tabs/employeeAccessTab";
import { useParams, useSearchParams } from "react-router-dom";

const ShopSettingsPage = () => {
  const { id: shopId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const activeTab = ["shop", "access"].includes(tabFromUrl) ? tabFromUrl : "shop";
  const onTabChange = (key) => {
    setSearchParams({ tab: key });
  };
  return (
    <Card title="Shop Settings">
      <Tabs
        defaultActiveKey="shop"
        activeKey={activeTab}
        onChange={onTabChange}
        items={[
          {
            key: "shop",
            label: "Shop Info",
            children: <ShopInfoTab shopId={shopId} />,
          },
          {
            key: "access",
            label: "Employees & Access",
            children: <EmployeeAccessTab shopId={shopId} />,
          },
        ]}
      />
    </Card>
  );
};
export default ShopSettingsPage;
