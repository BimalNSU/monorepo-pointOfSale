import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore, useStorage } from "reactfire";
import { Card, Row, Tag } from "antd";
import UserService from "@/service/user.service";
import UserAddEdit from "@/components/User/AddEdit/userAddEdit";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";

const UserAdd = () => {
  const { getToken, session } = useFirebaseAuth();
  const navigate = useNavigate();
  const db = useFirestore();
  const storage = useStorage();
  const userService = new UserService(db);
  const [responseMessage, setResponseMessage] = useState();

  const handleSubmit = async (values, form) => {
    try {
      const idToken = await getToken();
      const res = await userService.add(values, idToken, session.id);
      if (res.status === 201) {
        form.resetFields();
        setResponseMessage("success");
      } else {
        form.setFields(
          Object.entries(res.data.errors).map(([field, errors]) => ({
            name: field,
            errors,
          })),
        );
        setResponseMessage("error");
      }
    } catch (err) {
      setResponseMessage(err.message ?? "error");
    }
  };
  return (
    <Card
      title="Add User"
      bordered={false}
      style={{
        // width: 300,
        margin: "10px",
      }}
    >
      {/* Display the response message */}
      {responseMessage ? (
        <Row justify="end">
          <Tag
            color={responseMessage === "success" ? "#87d068" : "#f50"}
            style={{ fontSize: "18px", marginBottom: "8px" }}
          >
            {responseMessage === "success" ? "New user added successfully" : "Fail to add"}
          </Tag>
        </Row>
      ) : null}
      <UserAddEdit onSubmit={handleSubmit} authRole={session.role} />
    </Card>
  );
};
export default UserAdd;
