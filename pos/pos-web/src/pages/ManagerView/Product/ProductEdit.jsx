import React, { useState } from "react";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useFirestore, useStorage } from "reactfire";
import ProductAddEdit from "@/components/Product/ProductAddEdit";
import { Button, Card, Result, Row, Tag } from "antd";
import { useProduct } from "@/api/useProduct";
import ProductService from "@/service/product.service";
import Loading from "@/components/loading";
import ProductImageManager from "./subComponent/productImage";

const ProductEdit = () => {
  const { userId } = useFirebaseAuth();
  const navigate = useNavigate();
  const db = useFirestore();
  const storage = useStorage();
  const { id } = useParams();
  const { status, data } = useProduct(id);
  const productService = new ProductService(db);
  const [responseMessage, setResponseMessage] = useState();

  const handleSubmit = async (values) => {
    try {
      await productService.edit(id, values, userId);
      setResponseMessage("success");
    } catch (err) {
      console.log(err);
      setResponseMessage("error");
    }
  };
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
    <Card
      title="Edit Product"
      bordered={false}
      style={{
        // width: 300,
        margin: "10px",
      }}
    >
      {/* Display the response message */}
      {responseMessage ? (
        <Row justify="end">
          <Tag
            color={responseMessage === "success" ? "#87d068" : "#f50"}
            style={{ fontSize: "18px", marginBottom: "8px" }}
          >
            {responseMessage === "success" ? "Updated successfully" : "Fail to update"}
          </Tag>
        </Row>
      ) : null}
      <ProductAddEdit data={data} onSubmit={handleSubmit} />
      <ProductImageManager product={data} />
    </Card>
  );
};
export default ProductEdit;
