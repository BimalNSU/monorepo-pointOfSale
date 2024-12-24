import React, { useState, useEffect } from "react";
import moment from "moment";
import { useHistory, useParams, Link } from "react-router-dom";
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
import { useCustomProperty } from "@/utils/hooks/customProperty";
const dateFormat = "DD/MM/YYYY";
const { Title } = Typography;
const role = "tenant";
const TenantProfileView = () => {
  const params = useParams();
  const userId = params.id;
  const { isAdmin, userId: authUserId } = useCustomAuth();
  const { propertyId } = useCustomProperty();

  return (
    <div className="addPadding-10">
      <ProfileView
        userId={userId}
        role={role}
        // currentPropertyId={isAdmin ? null : propertyId}
        currentPropertyId={propertyId}
        authUserId={authUserId}
        isAdmin={isAdmin}
      />
    </div>
  );
};
export default TenantProfileView;
