import { Card, Row, Col, Modal, message } from "antd";
import ShopForm from "./subComponents/shopForm";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { useFirestore } from "reactfire";
import ShopService from "@/service/shop.service";
import { useDocumentFormat } from "@/api/useDocumentFormat";
import { DOCUMENT_FORMAT } from "@/constants/document-format";
const { confirm } = Modal;

const ShopAdd = () => {
  const { userId } = useFirebaseAuth();
  const db = useFirestore();
  const shopService = new ShopService(db);
  const { status, documentId: newShopId } = useDocumentFormat(DOCUMENT_FORMAT.VALUES.Shop);

  const handleSubmit = (newShop, shopForm) => {
    if (!newShopId) {
      return message.error(`Shop ID isn't included`);
    }
    confirm({
      title: "Are you sure to create new shop?",
      async onOk() {
        try {
          await shopService.create({ ...newShop, id: newShopId }, userId);
          shopForm.resetFields();
          message.success("New Shop is created successfully");
        } catch (e) {
          message.success("Failed to update");
        }
      },
    });
  };
  return (
    <Row gutter={16}>
      <Col span={12}>
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
          <ShopForm onSubmit={handleSubmit} newShopFormat={{ status, newShopId }} />
        </Card>
      </Col>
    </Row>
  );
};

export default ShopAdd;
