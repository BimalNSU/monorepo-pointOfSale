import React, { useState } from "react";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useFirestore } from "reactfire";
import ProductForm from "./subComponent/productForm";
import { Button, Card, Form, Modal, Result, Row, Tag } from "antd";
import { useProduct } from "@/api/useProduct";
import ProductService from "@/service/product.service";
import Loading from "@/components/loading";
import ProductImageManager from "./subComponent/productImageManager";
const { confirm } = Modal;

const ProductEdit = ({ product, resetMode }) => {
  const { userId } = useFirebaseAuth();
  const db = useFirestore();
  const productService = new ProductService(db);
  const [responseMessage, setResponseMessage] = useState();
  const [productForm] = Form.useForm();

  const handleFormSubmit = async (values) => {
    confirm({
      title: "Are you sure to update product?",
      async onOk() {
        try {
          await productService.edit(product.id, values, userId);
          setResponseMessage("success");
          resetMode();
        } catch (err) {
          console.log(err);
          setResponseMessage("error");
        }
      },
    });
  };
  return (
    <>
      {" "}
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
      <Form
        onFinish={handleFormSubmit}
        form={productForm}
        layout="horizontal"
        labelCol={{
          xs: { span: 9 }, // label width in mobile
          sm: { span: 8 },
          md: { span: 6 }, // tablet
          lg: { span: 6 },
          xl: { span: 6 },
        }}
        wrapperCol={{
          xs: { span: 15 }, // input width in mobile
          sm: { span: 16 },
          md: { span: 18 },
          lg: { span: 18 },
          xl: { span: 18 },
        }}
        labelAlign="left"
        labelWrap
        // onFinishFailed={onFinishFailed}
      >
        <ProductForm data={product} form={productForm} />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 16,
          }}
        >
          <Button size="large" onClick={resetMode}>
            Cancel
          </Button>
          <Button type="primary" size="large" htmlType="submit">
            {"Update Product"}
          </Button>
        </div>
      </Form>
    </>
  );
};
export default ProductEdit;
