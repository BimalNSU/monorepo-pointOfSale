import { Space, Row, Col, Typography, Image } from "antd";
import { doc } from "firebase/firestore";
import { useFirestoreDocData, useFirestore, useStorage, useStorageDownloadURL } from "reactfire";
import { COLLECTIONS } from "@pos/shared-models";
import { ref } from "firebase/storage";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { apiProvider } from "@/utils/ApiProvider/ApiProvider";

const { Text } = Typography;

const SwitchableShop = ({ shopId, shopRole }) => {
  const db = useFirestore();
  const storage = useStorage();
  const { getToken, session } = useFirebaseAuth();
  const shopDocRef = doc(db, COLLECTIONS.shops, shopId);
  const { status, data: shopData } = useFirestoreDocData(shopDocRef, { idField: "id" });

  const FetchFile = ({ storagePath }) => {
    const { data: fileUrl } = useStorageDownloadURL(ref(storage, storagePath));
    if (storagePath.split(".")[1] === "pdf") {
      return (
        <a
          href={fileUrl}
          target="_blank"
          style={{
            width: "90px",
            height: "120px",
            paddingBottom: "20px",
            paddingRight: "10px",
            marginLeft: "10px",
          }}
          rel="noreferrer"
        >
          LINK
        </a>
      );
    } else {
      return (
        <Image
          src={fileUrl}
          width={50}
          preview={false}
          // alt="Image"
          // style={{
          //   width: "50px",
          //   height: "50px",
          //   paddingBottom: "20px",
          //   paddingRight: "10px",
          //   marginLeft: "10px",
          // }}
        />
      );
    }
  };
  const handleSelectedShop = async () => {
    try {
      const idToken = await getToken();
      await apiProvider.updateSession(session.id, { shopId, shopRole }, idToken);
    } catch (e) {
      console.log(e);
    }
  };
  if (status === "loading") {
    return (
      <>Loading...</>
      //   <div className={`spin`}>
      //     <Spin size="default" />
      //   </div>
    );
  }
  const ShopContainer = (
    <Row
      gutter={[10, 10]}
      style={session.shopId === shopId ? { background: "#f1f1f1" } : { background: "#fbfbfb" }}
    >
      <Col>{shopData.shopImage ? <FetchFile storagePath={shopData.shopImage} /> : null}</Col>
      <Col>
        {/* <Col xs={8} sm={8} md={8} lg={8} xl={8}> */}
        <Space direction="vertical" size={1}>
          <Text>{shopData.name}</Text>
        </Space>
      </Col>
    </Row>
  );
  return session.shopId === shopId ? (
    ShopContainer
  ) : (
    <a onClick={() => handleSelectedShop(shopData)}>{ShopContainer}</a>
  );
};
export default SwitchableShop;
