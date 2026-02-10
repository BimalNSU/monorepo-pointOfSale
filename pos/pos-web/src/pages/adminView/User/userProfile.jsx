import { useUser } from "@/api/useUser";
import UserService from "@/service/user.service";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { Button, Card, Col, message, Modal, notification, Row, Typography } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFirestore, useStorage } from "reactfire";
import UserForm from "@/components/User/userForm";
import UserView from "../../../components/User/userView";
import UserPassword from "@/components/User/userPassword";
import Loading from "@/components/loading";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/constants/dateFormat";
import CustomCard from "@/components/customCard/customCard";
import { EditOutlined } from "@ant-design/icons";
import UserProfilePicture from "@/components/profileImage/userProfilePicture";
import UserActiveSwitch from "../../../components/User/userActiveSwitch";
import { USER_ROLE } from "@pos/shared-models";
const { confirm } = Modal;
const { Title, Text } = Typography;

const UserProfile = () => {
  const { userId: authUserId, session, getToken } = useFirebaseAuth();
  const { id: userId } = useParams();
  const db = useFirestore();
  const storage = useStorage();
  const { status, data: user } = useUser(userId);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const userService = new UserService(db);

  const handleUpdate = (updatedUser, form) => {
    confirm({
      title: "Are you sure to update user info?",
      async onOk() {
        try {
          const idToken = await getToken();
          const res = await userService.updateByAdmin(userId, updatedUser, idToken, session.id);
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
  const handleUpdatePassword = async (values) => {
    const idToken = await getToken();
    const res = await userService.updatePasswordByAdmin(
      userId,
      values.newPassword,
      idToken,
      session.id,
    );
    if (res.status !== 200) {
      throw new Error("Fail to change password");
    }
  };
  const handleUserActive = async (isActive) => {
    try {
      const idToken = await getToken();
      const res = await userService.updateStatus(userId, { isActive }, idToken, session.id);
      if (res.status === 200) {
        message.success("Status updated successfully");
      } else {
        throw new Error(`Fail to update`);
      }
    } catch (e) {
      message.error(e.message ?? "Fail to update");
    }
  };
  const updateProfileImage = async (file) => {
    try {
      await userService.updateProfileImage(
        storage,
        userId,
        { oldImagePath: user.profileImage, newImageFile: file },
        authUserId,
      );
    } catch (e) {
      message.error(e.message);
    }
  };
  if (status === "loading") {
    return <Loading />;
  }
  return (
    <div style={{ marginLeft: 5 }}>
      <Title level={4}>User Details</Title>
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
                  <Col>
                    <UserActiveSwitch
                      isActive={user.isActive}
                      userId={userId}
                      onSubmit={handleUserActive}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <UserProfilePicture storagePath={user.profileImage} onSubmit={updateProfileImage} />
              </Col>
            </Row>
            <UserPassword
              onUpdate={handleUpdatePassword}
              isAdmin={session.role === USER_ROLE.VALUES.Admin}
            />
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
export default UserProfile;
