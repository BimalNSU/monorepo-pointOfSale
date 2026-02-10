// import styles from "../../pages/OwnerView/Dashboard/Dashboard.module.css";
import { Row, Col, Card, Spin, Result, Button, Avatar } from "antd";
import { useShopsBy } from "@/api/useShopsBy";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { useNavigate } from "react-router-dom";
import { SHOP_ROLE } from "@pos/shared-models";
import { GlobalOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import ShopCard from "./subComponents/shopCard";
import { apiProvider } from "@/utils/ApiProvider/ApiProvider";
import { error } from "@/utils/Utils/Utils";

const { Meta } = Card;

const Dashboard = () => {
  const navigate = useNavigate();
  const { shopRoles, session, getToken } = useFirebaseAuth();
  const shopIds = useMemo(() => {
    return Object.keys(shopRoles ?? {});
  }, [shopRoles]);

  // const shopIds = Object.keys(shopRoles ?? {});
  const { status, data: shops } = useShopsBy(shopIds);

  const handleSelectedShop = async (shopId, shopRole) => {
    try {
      const idToken = await getToken();
      const res = await apiProvider.updateSession(session.id, { shopId, shopRole }, idToken);
      if (res.status !== 200) {
        error("Unable to swtich");
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (status === "loading") {
    return (
      <div className={"spin"}>
        <Spin size="large" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <Result
        status="error"
        title="Invalid data"
        subTitle="Invalid data fetching error ...!"
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        }
      />
    );
  }
  return (
    <div>
      {shops.map((shop) => (
        <ShopCard
          key={shop.id}
          logo={shop.logo}
          name={shop.name}
          shopRole={shopRoles[shop.id]}
          isSelected={session.shopId === shop.id}
          // manager={shop.manager}
          onClick={() =>
            session.shopId !== shop.id && handleSelectedShop(shop.id, shopRoles?.[shop.id])
          }
        />
      ))}
    </div>
  );
};
export default Dashboard;
