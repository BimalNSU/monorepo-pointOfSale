import { useState } from "react";
import {
  List,
  Card,
  Image,
  Button,
  Upload,
  Modal,
  Progress,
  message,
  Avatar,
  Skeleton,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  MenuOutlined,
} from "@ant-design/icons";
import { useFirestore, useStorage } from "reactfire";
import { ref } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import useBatchImageUrls from "@/api/useBatchImageUrls";
import { FOLDERS } from "@/constants/folders";
import useFirebaseUpload from "@/api/useFirebaseUpload";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import ProductService from "@/service/product.service";
const { Dragger } = Upload;

const ProductImageManager = ({ product }) => {
  const { userId } = useFirebaseAuth();
  const db = useFirestore();
  const storage = useStorage();
  const productService = new ProductService(db);
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const { uploadFile, uploading, progress } = useFirebaseUpload();

  // Get URLs for all product images
  const imagePaths = product.media?.images?.map((img) => img.path) || [];
  const { urls: imageUrls, loading: imagesLoading } = useBatchImageUrls(imagePaths);

  const handleUpload = async (option) => {
    const file = option.file.originFileObj || option.file;
    await uploadFile({
      file,
      folderPath: FOLDERS.products,
      metadata: {
        createdAt: new Date(),
      },
      onSuccess: async (fileData) => {
        const newImage = {
          path: fileData.path,
          filename: fileData.filename,
          isPrimary: product.media?.images?.length === 0,
          order: product.media?.images?.length || 0,
          metadata: fileData.metadata,
        };
        await productService.editMedia(product.id, newImage, product.media.images, userId);
        message.success(`${file.name} uploaded successfully`);
        option.onSuccess("OK");
      },
      onError: (error) => {
        option.onError(error);
        message.error(`Upload failed: ${error.message}`);
        console.error("Upload failed:", error);
      },
    });
  };

  const handleDelete = async (image) => {
    Modal.confirm({
      title: "Are you sure you want to delete this image?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const imageRef = ref(storage, image.path);
          await productService.deleteMedia(
            product.id,
            imageRef,
            image,
            product.media.images,
            userId,
          );
          message.success("Image deleted successfully");
        } catch (error) {
          message.error(`Failed to delete image: ${error.message}`);
        }
      },
    });
  };

  const setPrimaryImage = async (image) => {
    try {
      const mutatedImageData = { ...image, isPrimary: true };
      await productService.editMedia(product.id, mutatedImageData, product.media.images, userId);
      message.success("Primary image updated");
    } catch (error) {
      message.error(`Failed to update primary image: ${error.message}`);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index, e) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
  };

  const handleDrop = async (hoverIndex) => {
    if (draggedIndex === null || draggedIndex === hoverIndex) return;

    const reorderedImages = [...product.media?.images];
    const [removed] = reorderedImages.splice(draggedIndex, 1);
    reorderedImages.splice(hoverIndex, 0, removed);

    try {
      await updateDoc(doc(db, "products", product.id), {
        ["media.images"]: reorderedImages.map((img, idx) => ({ ...img, order: idx })),
      });
      message.success("Image order updated");
    } catch (error) {
      message.error(`Failed to reorder images: ${error.message}`);
    } finally {
      setDraggedIndex(null);
    }
  };

  // Preview image in modal
  const handlePreview = (url) => {
    setPreviewImage(imageUrls[url]);
    setPreviewVisible(true);
  };

  if (imagesLoading) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  return (
    <Card
      title="Product Images"
      extra={
        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          multiple
          accept="image/*"
          disabled={uploading}
        >
          <Button type="primary" icon={<UploadOutlined />} loading={uploading}>
            Upload Images
          </Button>
        </Upload>
      }
    >
      {uploading && (
        <Progress
          percent={progress}
          status="active"
          strokeColor={{ from: "#108ee9", to: "#87d068" }}
        />
      )}

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
        dataSource={
          product.media?.images.sort((image1, image2) => image1.order > image2.order) || []
        }
        renderItem={(image, index) => (
          <div
            key={image.filename}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(index, e)}
            onDrop={() => handleDrop(index)}
            style={{
              opacity: draggedIndex === index ? 0.5 : 1,
              border: draggedIndex === index ? "2px dashed #1890ff" : "none",
              padding: 8,
              transition: "all 0.3s",
            }}
          >
            <Card
              hoverable
              cover={
                <Image
                  src={imageUrls[image.path]}
                  alt="Product"
                  preview={{ visible: false }}
                  onClick={() => handlePreview(image.path)}
                  style={{ height: 160, objectFit: "cover" }}
                />
              }
              actions={[
                <Button
                  type="text"
                  icon={
                    image.isPrimary ? <StarFilled style={{ color: "#faad14" }} /> : <StarOutlined />
                  }
                  onClick={() => setPrimaryImage(image)}
                  disabled={image.isPrimary}
                />,
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(image)}
                />,
                <Button type="text" icon={<MenuOutlined />} style={{ cursor: "move" }} />,
              ]}
            >
              <Card.Meta
                avatar={<Avatar src={imageUrls[image.path]} />}
                title={image.isPrimary ? "Primary Image" : "Secondary Image"}
                description={`Order: ${index + 1}`}
              />
            </Card>
          </div>
        )}
      />

      <Modal
        open={previewVisible}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Card>
  );
};

export default ProductImageManager;
