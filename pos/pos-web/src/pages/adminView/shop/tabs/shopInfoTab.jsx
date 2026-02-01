import { useState } from "react";
import { Card, message, Modal } from "antd";
import { useShop } from "@/api/useShop";
import ShopForm from "../subComponents/shopForm";
import ShopView from "../subComponents/shopView";
import { useFirestore } from "reactfire";
import Loading from "@/components/loading";
import ShopService from "@/service/shop.service";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
const { confirm } = Modal;

const ShopInfoTab = ({ shopId }) => {
  const { userId } = useFirebaseAuth();
  const db = useFirestore();
  const { status, data: shop } = useShop(shopId);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const shopService = new ShopService(db);

  const handleUpdate = (updatedShop) => {
    confirm({
      title: "Are you sure to update shop info?",
      async onOk() {
        try {
          await shopService.edit(shopId, updatedShop, userId);
          setIsEditing(false);
          message.success("Shop updated successfully");
        } catch (e) {
          message.success("Failed to update");
        }
      },
    });
  };
  if (status === "loading") {
    return <Loading />;
  }
  return (
    <Card
      styles={{
        // width: 300,
        // margin: "1px",
        body: {
          margin: 0,
          paddingTop: 0,
          paddingLeft: 8,
          paddingRight: 8,
          paddingBottom: 16,
        },
      }}
    >
      {isEditing ? (
        <ShopForm
          mode="edit"
          initialValues={shop}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
        />
      ) : (
        <ShopView shop={shop} onEdit={handleEdit} />
      )}
    </Card>
  );
};

export default ShopInfoTab;
