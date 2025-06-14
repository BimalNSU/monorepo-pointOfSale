import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
// import styles from "./UserProfileEdit.module.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Tabs,
  Row,
  Radio,
  Col,
  DatePicker,
  Upload,
  Modal,
  Space,
  Typography,
  Button,
  message,
  InputNumber,
  Spin,
} from "antd";
import { PlusOutlined, UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { doc, updateDoc } from "firebase/firestore";
import { useFirestoreDocData, useStorage, useStorageDownloadURL, useFirestore } from "reactfire";
import { ref, uploadBytesResumable } from "firebase/storage";
import * as validator from "../../../../../utils/Validation/Validation";
import ProfileView from "@/components/User/ProfileView";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import { COLLECTIONS } from "@pos/shared-models";
import UserEdit from "@/components/User/UserEdit";
import { useUserProfile } from "@/api/useUserProfile";

const { TabPane } = Tabs;
const { Title } = Typography;
const dateFormat = "DD/MM/YYYY";
const dateTimeFormat = "YYYY/MM/DD, h:mm:ss a";
const SelfProfileEdit = () => {
  const navigate = useNavigate();
  const { userId, role } = useCustomAuth();
  const { status, data } = useUserProfile(userId);

  const onSuccess = () => {
    navigate(-1);
  };
  if (status === "loading") {
    return (
      <Row align="bottom" justify="center">
        <Spin size="large" />
      </Row>
    );
  }
  return <UserEdit targetRole={role} onSuccess={onSuccess} userData={data} />;
};

export default SelfProfileEdit;
