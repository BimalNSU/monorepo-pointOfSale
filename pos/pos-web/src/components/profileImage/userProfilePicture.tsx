import { Upload, Avatar, Button, message, Spin } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useCustomStorageDownloadUrl } from "@/api/useCustomStorageDownloadUrl";
import { UserId } from "@pos/shared-models";
interface Props {
  storagePath?: string;
  userId: UserId;
  onSubmit: Function;
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
        <Avatar
          shape="square"
          size={128}
          icon={<UserOutlined />}
          src={data?.url ?? undefined}
          style={{ marginBottom: 16 }}
        />
        <Upload beforeUpload={handleUpload} showUploadList={false} accept="image/*">
          <Button icon={<UploadOutlined />}>{data?.url ? "Change Photo" : "Upload Photo"}</Button>
        </Upload>
      </Spin>
    </div>
  );
};

export default UserProfilePicture;
