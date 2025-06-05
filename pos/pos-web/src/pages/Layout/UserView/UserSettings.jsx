import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography, Checkbox, Divider } from "antd";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import { useFirestore } from "reactfire";
import { doc, updateDoc } from "firebase/firestore";
import { COLLECTIONS } from "@pos/shared-models";
import { ArrowLeftOutlined } from "@ant-design/icons";
// import { updateUserRoleStatus } from "@/api/admin/userFunctions";
const { Title } = Typography;

function UserSettings() {
  const navigate = useNavigate();
  const db = useFirestore();
  const { role, allowedRoles, updateStore, userId } = useCustomAuth();
  const userDocRef = doc(db, COLLECTIONS.users, userId);

  // helpers
  const capitalizeFirstLetter = (s) => {
    const first = s.slice(0, 1);
    const rest = s.slice(1);
    return `${first.toUpperCase()}${rest}`;
  };

  // handlers
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleChangePassword = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleSignOutAll = () => {};

  const handleChangeAllowedRoles = async (role, isEnabled) => {
    const roleStatus = isEnabled ? "activated" : "inactivated";
    // await updateUserRoleStatus(db, userId, role, roleStatus);
  };

  return (
    <div style={{ paddingInline: "3rem" }}>
      <Button shape="circle" onClick={() => navigate("/")} style={{ fontSize: 15 }}>
        <ArrowLeftOutlined />
      </Button>
      <section id="security">
        <Title level={4}>Security</Title>
        <Divider style={{ margin: 1 }} />
        <Title level={5}>Password</Title>
        <Link to="/settings/change-password">
          <Button>Change Password</Button>
        </Link>

        <Title level={5} style={{ marginTop: "2rem" }}>
          Active Sessions
        </Title>
        <p>Every active sessions for your account across different devices and browsers.</p>
        {/* TODO: not implemented */}
        <Button onClick={handleSignOutAll} disabled>
          Sign Out For All Sessions
        </Button>
      </section>

      <section id="profile-activation" style={{ marginTop: "3rem" }}>
        <Title level={4}>Profile Activation</Title>
        <Divider style={{ margin: 1 }} />
        <div>
          {["manager", "owner", "tenant"].map(
            (r) =>
              role !== r && (
                <div key={r}>
                  <Checkbox
                    checked={allowedRoles[r].status === "activated"}
                    onChange={(e) => handleChangeAllowedRoles(r, e.target.checked)}
                  >
                    Activate {capitalizeFirstLetter(r)} Profile
                  </Checkbox>
                  <br />
                </div>
              ),
          )}
        </div>
      </section>
    </div>
  );
}

export default UserSettings;
