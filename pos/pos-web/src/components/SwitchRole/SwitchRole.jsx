import { Space, Row, Col, Typography, Badge } from "antd";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import { CheckCircleOutlined, UserOutlined } from "@ant-design/icons";
import { USER_ROLE } from "@/constants/role";
const { Text } = Typography;

const SwitchRole = () => {
  const { role: authRole, allowedRoles, requestToSwitchRole } = useCustomAuth();

  const handleSwitchRole = (newRole) => {
    requestToSwitchRole(newRole);
  };

  return (
    <Row>
      <Col offset={1}>
        <Row justify="space-between">
          {Object.entries(allowedRoles)
            .filter((item) => item[1].status === "activated")
            .map((item, index) => (
              <Col key={index} span={24}>
                <Space
                  size={4}
                  style={
                    item[0] === authRole ? { background: "#f1f1f1" } : { background: "#fbfbfb" }
                  }
                >
                  <UserOutlined
                  // style={{ fontSize: "24px", color: "#1890ff" }}
                  />
                  {item[0] === authRole ? (
                    <>
                      <Text>{USER_ROLE.KEYS[item[0]]}</Text>
                      <Badge color="green" />
                    </>
                  ) : (
                    <a onClick={() => handleSwitchRole(item[0])}>
                      <Text>{USER_ROLE.KEYS[item[0]]}</Text>
                    </a>
                  )}
                </Space>
              </Col>
            ))}
        </Row>
      </Col>
    </Row>
  );
};
export default SwitchRole;
