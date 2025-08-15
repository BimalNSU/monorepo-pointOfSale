import React, { useState } from "react";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "reactfire";
import { Button, Card, Form, Row, Tag } from "antd";
import ProductService from "@/service/product.service";
import { useDocumentFormat } from "@/api/useDocumentFormat";
import ProductForm from "./subComponent/productForm";
import useFirebaseMultiUpload from "@/api/useFirebaseMultiUpload";
import ProductImagesSection from "./subComponent/productImageSection";

const ProductAdd = () => {
  const { uploadFiles, progress, uploading, uploadedCount, totalCount } = useFirebaseMultiUpload();
  const [fileList, setFileList] = useState([]);

  const { userId, role, session } = useFirebaseAuth();
  const navigate = useNavigate();
  const db = useFirestore();
  const { status, documentId: newProductId } = useDocumentFormat("product");
  const productService = new ProductService(db);
  const [responseMessage, setResponseMessage] = useState();
  const [productForm] = Form.useForm();

  const resetForm = () => {
    productForm.resetFields();
    // Revoke all object URLs after submission
    fileList.forEach((f) => f.preview && f.file && URL.revokeObjectURL(f.preview));
    setFileList([]);
  };
  const handleFormSubmit = async (values) => {
    if (!fileList.length) {
      message.warning("Please select images");
      return;
    }

    const imagesArray = [];
    const folderPath = `${FOLDERS.products}/${newProductId}`;
    const now = new Date();

    const filesToUpload = fileList.map((f, index) => ({
      file: f.file,
      folderPath,
      metadata: {},
      onSuccess: (fileData) => {
        imagesArray.push({
          path: fileData.path,
          filename: fileData.filename,
          isPrimary: f.isPrimary,
          order: index + 1,
          metadata: { createdAt: now, contentType: f.file.type },
        });
      },
      onError: (err) => {
        console.error("Upload failed:", err);
        message.error(`Failed to upload ${f.name}`);
      },
    }));
    try {
      await uploadFiles({
        files: filesToUpload,
        concurrency: 3,
        onAllSuccess: async () => {
          const { qty, ...rest } = values;
          const newProduct = {
            ...rest,
            id: newProductId,
            media: { images: imagesArray, videos: [] },
            ...(role === USER_ROLE.VALUES.Admin && { qty: values.qty }),
          };
          await productService.create(newProduct, {
            userId,
            role: session.role,
            shopId: session.shopId,
            shopRole: session.shopRole,
          });
        },
      });
      resetForm();
      setResponseMessage("success");
      message.success("Product created successfully!");
    } catch (e) {
      setResponseMessage("error");
      message.error(e.message || "Fail to create product");
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
      styles={{ body: { padding: 8 } }}
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
      >
        <ProductForm newProductFormat={{ newProductId, status }} form={productForm} />
        {/* Image Upload Section */}
        <Card
          title="Product Images"
          bordered={false}
          style={{ marginBottom: 24 }}
          styles={{
            header: { borderBottom: 0, paddingBottom: 0, paddingLeft: 11 },
            body: {
              paddingTop: 0,
              paddingLeft: 11,
              paddingRight: 11,
              paddingBottom: 11,
            },
          }}
        >
          <ProductImagesSection
            fileList={fileList}
            setFileList={setFileList}
            progress={progress}
            uploading={uploading}
            uploadedCount={uploadedCount}
            totalCount={totalCount}
          />
        </Card>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 16,
          }}
        >
          <Button size="large" onClick={resetForm}>
            Reset
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={uploading}
            disabled={!fileList.length}
          >
            {uploading ? "Creating Product..." : "Create Product"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};
export default ProductAdd;
