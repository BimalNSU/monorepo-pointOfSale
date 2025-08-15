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

const ProductEdit = () => {
  const { userId } = useFirebaseAuth();
  const navigate = useNavigate();
  const db = useFirestore();
  const { id } = useParams();
  const { status, data } = useProduct(id);
  const productService = new ProductService(db);
  const [responseMessage, setResponseMessage] = useState();
  const [productForm] = Form.useForm();

  const handleFormSubmit = async (values) => {
    confirm({
      title: "Are you sure to update product?",
      async onOk() {
        try {
          await productService.edit(id, values, userId);
          setResponseMessage("success");
        } catch (err) {
          console.log(err);
          setResponseMessage("error");
        }
      },
    });
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
        <ProductForm data={data} form={productForm} />
        <ProductImageManager product={data} />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 16,
          }}
        >
          <Button type="primary" size="large" htmlType="submit">
            {"Update Product"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};
export default ProductEdit;
