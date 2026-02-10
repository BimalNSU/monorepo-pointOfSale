import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, Space, Switch, Tag, Typography } from "antd";
const { Text } = Typography;
const { confirm } = Modal;

const UserActiveSwitch = ({ isActive, userId, onSubmit }) => {
  const { userId: authUserId } = useFirebaseAuth();

  const onChange = (value) => {
    const verb = !value ? "deactivate" : "active";
    confirm({
      title: `Are you sure you want to ${verb} this user?`,
      ...(!value && {
        icon: <ExclamationCircleOutlined />,
        content:
          "This will immediately terminate all sessions for this user, logging them out from all devices.",
      }),
      async onOk() {
        await onSubmit(value);
      },
    });
  };
  return (
    <Space size={5}>
      <Text>Status</Text>
      {authUserId === userId ? (
        isActive ? (
          <Tag color="success">Active</Tag>
        ) : (
          <Tag color="error">Inactive</Tag>
        )
      ) : (
        <Switch
          value={isActive}
          onChange={onChange}
          checkedChildren={"Active"}
          unCheckedChildren={"Inactive"}
        />
      )}
    </Space>
  );
};
export default UserActiveSwitch;
