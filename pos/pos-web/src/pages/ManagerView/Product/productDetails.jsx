import { useState } from "react";
import { Button, Col, Result, Row } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/loading";
import ProductImageManager from "./subComponent/productImageManager";
import ProductView from "./subComponent/productView";
import { EditOutlined } from "@ant-design/icons";
import ProductEdit from "./productEdit";
import { useProduct } from "@/api/useProduct";
import CustomCard from "@/components/customCard/customCard";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const { status, data: productData } = useProduct(productId);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  if (status === "loading") {
    return <Loading />;
  }
  if (status === "error") {
    return (
      <Result
        status="error"
        title="Data fetch error ...!"
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        }
      />
    );
  }
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <CustomCard
          title={
            <>
              <span>Product Info</span>
              {!isEditing && (
                <Button onClick={handleEdit} type="text">
                  <EditOutlined />
                </Button>
              )}
            </>
          }
        >
          {isEditing ? (
            <ProductEdit product={productData} resetMode={handleCancel} />
          ) : (
            <ProductView product={productData} />
          )}
        </CustomCard>
      </Col>
      <Col span={24}>
        <ProductImageManager product={productData} />
      </Col>
    </Row>
  );
};

export default ProductDetails;
