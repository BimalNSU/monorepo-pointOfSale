import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import styles from "./SelfProfileView.module.css";
import envelope from "../../../../../images/envelope.png";
import {
  Modal,
  Form,
  Upload,
  Menu,
  Button,
  Typography,
  message,
  Divider,
  Row,
  Col,
  Table,
  Tabs,
  Dropdown,
  Select,
  Card,
  notification,
} from "antd";
import { DownOutlined, FilePdfOutlined, UploadOutlined, EditOutlined } from "@ant-design/icons";
import {
  doc,
  getFirestore,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import {
  FirebaseAppProvider,
  FirestoreProvider,
  useFirestoreDocData,
  useStorage,
  useStorageDownloadURL,
  useFirestore,
  useFirestoreCollectionData,
  useStorageTask,
  useFirebaseApp,
} from "reactfire";
import { ref, uploadBytesResumable, getStorage } from "firebase/storage";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "reactfire";
// import ProfileView from "@/components/User/ProfileView";
import UserService from "@/service/user.service";
import Loading from "@/components/loading";
import UserProfilePicture from "@/components/profileImage/userProfilePicture";
import CustomCard from "@/components/customCard/customCard";
import UserForm from "@/components/User/userForm";
import UserView from "@/components/User/userView";
import { useUser } from "@/api/useUser";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { DATE_FORMAT } from "@/constants/dateFormat";
import UserPassword from "@/components/User/userPassword";

const dateFormat = "DD/MM/YYYY";
const dateTimeFormat = "YYYY/MM/DD, h:mm:ss a";
const { Title, Text } = Typography;
const { confirm } = Modal;

const SelfProfile = () => {
  const { userId: authUserId, session, getToken } = useFirebaseAuth();
  const db = useFirestore();
  const storage = useStorage();
  const { status, data: user } = useUser(authUserId);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const userService = new UserService(db);
  // return <ProfileView userId={userId} role={role} authUserId={userId} />;
  const handleUpdate = (updatedUser, form) => {
    confirm({
      title: "Are you sure to update user info?",
      async onOk() {
        try {
          const idToken = await getToken();
          const res = await userService.update(authUserId, updatedUser, idToken, session.id);
          if (res.status === 200) {
            notification.success({ message: "User updated successfully", duration: 2 });
            form.resetFields();
            setIsEditing(false);
          } else {
            form.setFields(
              Object.entries(res.data.errors).map(([field, errors]) => ({
                name: field,
                errors,
              })),
            );
            notification.error({ message: "Fail to update", duration: 2 });
          }
        } catch (e) {
          notification.error({ message: e.message ?? "Fail to update", duration: 2 });
        }
      },
    });
  };
  const updateProfileImage = async (file) => {
    try {
      await userService.updateProfileImage(
        storage,
        authUserId,
        { oldImagePath: user.profileImage, newImageFile: file },
        authUserId,
      );
    } catch (e) {
      notification.error({ message: e.message });
    }
  };
  const handleUpdatePassword = async (values) => {
    const idToken = await getToken();
    const res = await userService.updatePassword(
      authUserId,
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      idToken,
      session.id,
    );
    if (res.status !== 200) {
      throw new Error("Fail to change password");
    }
  };
  if (status === "loading") {
    return <Loading />;
  }
  return (
    <div style={{ marginLeft: 5 }}>
      <Title level={4}>User Profile</Title>
      <Row gutter={[11, 8]}>
        <Col xs={32} sm={24} md={24} lg={8} xl={8}>
          <Card
            styles={{
              // width: 300,
              // margin: "1px",
              body: {
                margin: 0,
                paddingTop: 11,
                paddingLeft: 8,
                paddingRight: 8,
                paddingBottom: 16,
              },
            }}
          >
            <Row justify="space-between">
              <Col span={12}>
                <Row gutter={[16, 8]}>
                  <Col span={24}>
                    <Text>{`Created At: `}</Text>
                    <Text>{dayjs(user.createdAt).format(DATE_FORMAT)}</Text>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <UserProfilePicture storagePath={user.profileImage} onSubmit={updateProfileImage} />
              </Col>
            </Row>
            <UserPassword onUpdate={handleUpdatePassword} />
          </Card>
        </Col>
        <Col xs={32} sm={24} md={24} lg={16} xl={16}>
          <CustomCard
            title={
              <>
                <span>User Info</span>
                {!isEditing && (
                  <Button onClick={handleEdit} type="text">
                    <EditOutlined />
                  </Button>
                )}
              </>
            }
          >
            {isEditing ? (
              <UserForm
                mode="edit"
                userData={user}
                onSubmit={handleUpdate}
                onCancel={handleCancel}
              />
            ) : (
              <UserView user={user} onEdit={handleEdit} />
            )}
          </CustomCard>
        </Col>
      </Row>
    </div>
  );
};
export default SelfProfile;
3;
