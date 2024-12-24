import React, { useState } from "react";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import { useHistory } from "react-router-dom";
import { useFirestore, useStorage } from "reactfire";
import ProductAddEdit from "@/components/Product/ProductAddEdit";
import { Card, Row, Tag } from "antd";
import ProductService from "@/service/product.service";
import { useDocumentFormat } from "@/api/useDocumentFormat";

const AddProduct = () => {
  const { userId } = useCustomAuth();
  const history = useHistory();
  const db = useFirestore();
  const storage = useStorage();
  const { status, documentId: newProductId } = useDocumentFormat("product");
  const productService = new ProductService(db);
  const [responseMessage, setResponseMessage] = useState();

  const handleSubmit = async (values, form) => {
    try {
      await productService.create({ ...values, id: newProductId }, userId);
      form.resetFields();
      setResponseMessage("success");
    } catch (err) {
      console.log(err);
      setResponseMessage("error");
    }
  };
  return (
    <Card
      title="Add Product"
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
            {responseMessage === "success" ? "New product added successfully" : "Fail to add"}
          </Tag>
        </Row>
      ) : null}
      <ProductAddEdit onSubmit={handleSubmit} newProductFormat={{ status, newProductId }} />;
    </Card>
  );
};
export default AddProduct;
