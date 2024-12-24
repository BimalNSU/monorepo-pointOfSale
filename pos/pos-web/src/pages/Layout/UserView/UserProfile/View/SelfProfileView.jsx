import React, { useState, useEffect } from "react";
import moment from "moment";
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
import ProfileView from "@/components/User/ProfileView";
import { useCustomAuth } from "@/utils/hooks/customAuth";

const dateFormat = "DD/MM/YYYY";
const dateTimeFormat = "YYYY/MM/DD, h:mm:ss a";
const { Title } = Typography;

const SelfProfileView = () => {
  const { userId, role } = useCustomAuth();
  return <ProfileView userId={userId} role={role} authUserId={userId} />;
};
export default SelfProfileView;
