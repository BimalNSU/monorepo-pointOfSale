import { GENDER_TYPE, MARITAL_TYPE, RELIGION_TYPE } from "@/constants/common";
import { DATE_FORMAT } from "@/constants/dateFormat";
import { USER_ROLE } from "@/constants/role";
import { Descriptions } from "antd";
import dayjs from "dayjs";

const UserView = ({ user }) => {
  const items = [
    { key: "1", label: "Role", children: USER_ROLE.KEYS[user.role], span: 2 },
    { key: "2", label: "First Name", children: user.firstName },
    { key: "3", label: "Last Name", children: user.lastName ?? "N/A" },
    { key: "4", label: "Mobile", children: user.mobile },
    { key: "5", label: "Email", children: user.email ?? "N/A" },
    { key: "6", label: "DOB", children: dayjs(user.DOB).format(DATE_FORMAT) },
    { key: "7", label: "Blood Group", children: user.bloodGroup ?? "N/A" },
    { key: "8", label: "Gender", children: user.gender ? GENDER_TYPE.KEYS[user.gender] : "N/A" },
    {
      key: "9",
      label: "Religion",
      children: user.religion ? RELIGION_TYPE.KEYS[user.religion] : "N/A",
    },
    {
      key: "10",
      label: "Marital Status",
      children: user.maritalStatus ? MARITAL_TYPE.KEYS[user.maritalStatus] : "N/A",
    },
  ];
  return (
    <>
      {/* <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={4}>User Info</Title>
        <Button onClick={onEdit} type="text">
          <EditOutlined />
        </Button>
      </div> */}

      <Descriptions
        column={2}
        // title={`User Info`}
        size="small"
        // extra={
        //   <Button onClick={onEdit} type="text">
        //     <EditOutlined />
        //   </Button>
        // }
        items={items}
      />
    </>
  );
};
export default UserView;
