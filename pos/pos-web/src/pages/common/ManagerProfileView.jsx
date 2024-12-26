import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams, Link } from "react-router-dom";
// import envelope from "../../../images/envelope.png"
import {
  Tabs,
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
  Dropdown,
  Select,
  Spin,
  Space,
  Card,
} from "antd";
import {
  DownOutlined,
  FilePdfOutlined,
  UploadOutlined,
  LeftCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { doc, getFirestore, updateDoc, collection, addDoc, deleteDoc } from "firebase/firestore";
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

import ProfileView from "@/components/User/ProfileView";
import { useCustomAuth } from "@/utils/hooks/customAuth";

const { Title } = Typography;
const role = "manager";
const ManagerProfileView = () => {
  const params = useParams();
  const userId = params.id;
  const { isAdmin, userId: authUserId } = useCustomAuth();

  return (
    <div className="addPadding-40">
      <ProfileView userId={userId} role={role} authUserId={authUserId} isAdmin={isAdmin} />
    </div>
  );
};
export default ManagerProfileView;
