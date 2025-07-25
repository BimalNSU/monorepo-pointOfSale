import { Upload, Avatar, Button, message, Spin, Skeleton, Row, Col } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useCustomStorageDownloadUrl } from "@/api/useCustomStorageDownloadUrl";
import { UserId } from "@pos/shared-models";
interface Props {
  storagePath?: string;
  userId: UserId;
  onSubmit: (file: File) => Promise<void>;
}

const UserProfilePicture: React.FC<Props> = ({ storagePath, onSubmit }) => {
  const { status, data } = useCustomStorageDownloadUrl(storagePath);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      //   // Delete old image if exists
      //   await deleteObject(storageRef).catch(() => {});
      //   // Upload new file
      //   await uploadBytes(storageRef, file);
      await onSubmit(file);
      message.success("Profile picture uploaded!");
    } catch (error) {
      message.error("Failed to upload profile picture.");
    } finally {
      setLoading(false);
    }
    return false; // Prevent Upload from auto uploading
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Spin spinning={loading}>
        {status === "loading" ? (
          <>
            <Skeleton.Avatar active size={128} shape="square" style={{ marginBottom: 16 }} />
            <br />
            <Skeleton.Button active size="default" style={{ width: 140 }} />
          </>
        ) : (
          <Row
            justify="center"
            gutter={[16, 16]}
            style={{ textAlign: "center", flexDirection: "column" }}
          >
            <Col>
              <Avatar
                shape="square"
                size={128}
                icon={<UserOutlined />}
                src={data?.url ?? undefined}
                style={{ marginBottom: 8 }}
              />
            </Col>
            <Col>
              <Upload beforeUpload={handleUpload} showUploadList={false} accept="image/*">
                <Button icon={<UploadOutlined />}>
                  {data?.url ? "Change Photo" : "Upload Photo"}
                </Button>
              </Upload>
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default UserProfilePicture;
