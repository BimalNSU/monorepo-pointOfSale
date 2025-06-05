import React, { useState, useEffect } from "react";
import styles from "./Personal.module.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Tabs,
  Row,
  Radio,
  Col,
  DatePicker,
  Upload,
  Modal,
  Typography,
  Button,
  message,
  InputNumber,
  Spin,
  Select,
  Space,
  Result,
} from "antd";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { PlusOutlined, UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { collection, doc, updateDoc, addDoc, query, where } from "firebase/firestore";
import {
  useFirestore,
  useStorage,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useStorageDownloadURL,
} from "reactfire";
import { ref, uploadBytesResumable } from "firebase/storage";
// import * as validator from "../../../utils"
import * as validator from "../../utils/Validation/Validation";

import { success, error, checkValueExist, deleteUndefinedNullFromObj } from "@/utils/Utils/Utils";
// import style from "../../assets/common/style.css";

import dayjs from "dayjs";
import { COLLECTIONS } from "@pos/shared-models";
const bloodGroupsData = [];

import { apiProvider } from "@/utils/ApiProvider/ApiProvider";
import { useCustomAuth } from "@/utils/hooks/customAuth";
// import { Address } from "@/components/Address/AddressComponent";
import FetchFile from "../FetchFile/FetchFile";
import FileUpload from "../FIleUpload/FileUpload";
import ImageUploadWithPreview from "../FIleUpload/ImageUploadWithPreview";
import { FOLDERS } from "@/constants/folders";
import { DOB_dateFormat } from "@/constants/dateFormat";
import Form1 from "./AddEdit/PersonalInfoForm";
import Form2 from "./AddEdit/OtherInfoForm";
import PersonalInfoForm from "./AddEdit/PersonalInfoForm";
import OtherInfoForm from "./AddEdit/OtherInfoForm";
// import { updateUserOtherInfo } from "@/api/admin/userFunctions";

const { confirm } = Modal;
const { Option } = Select;
const { Title } = Typography;

const UserEdit = ({ targetRole, onSuccess, userData }) => {
  const { userId: authUserId, isAdmin, getToken } = useCustomAuth();
  const navigate = useNavigate();
  const storage = useStorage();
  const firestore = useFirestore();
  const [activeKey, setActiveKey] = useState("1");

  // tab change
  const changeTab = (Key) => setActiveKey(Key);
  // image uplaod
  // image upload to firebase
  const ImageUploadToFirebase = async (userId, file, folderName) => {
    const fileToUpload = file.originFileObj;
    const fileName = fileToUpload.name;
    const newRef = ref(storage, `${folderName}/${userId}/${fileName}`);
    const uploadTask = uploadBytesResumable(newRef, fileToUpload);
    uploadTask.then(() => {
      success(`${fileName} is uploaded`);
    });
    return newRef._location.path_;
  };
  // const updateDbForOtherInfo = async (data) => {
  //   const otherInfo = { ...data };
  //   if (otherInfo.uploadBirth && typeof otherInfo.uploadBirth === "object") {
  //     otherInfo.uploadBirth = await ImageUploadToFirebase(
  //       userData.id,
  //       otherInfo.uploadBirth[0],
  //       FOLDERS.birthcertificate,
  //     );
  //   }
  //   if (otherInfo.uploadTin && typeof otherInfo.uploadTin === "object") {
  //     otherInfo.uploadTin = await ImageUploadToFirebase(
  //       userData.id,
  //       otherInfo.uploadTin[0],
  //       FOLDERS.tin,
  //     );
  //   }
  //   if (otherInfo.uploadNID && typeof otherInfo.uploadNID === "object") {
  //     otherInfo.uploadNID = await ImageUploadToFirebase(
  //       userData.id,
  //       otherInfo.uploadNID[0],
  //       FOLDERS.nid,
  //     );
  //   }
  //   if (otherInfo.uploadVAT && typeof otherInfo.uploadVAT === "object") {
  //     otherInfo.uploadVAT = await ImageUploadToFirebase(
  //       userData.id,
  //       otherInfo.uploadVAT[0],
  //       FOLDERS.vat,
  //     );
  //   }
  //   if (otherInfo.uploadTradeLicense && typeof otherInfo.uploadTradeLicense === "object") {
  //     otherInfo.uploadTradeLicense = await ImageUploadToFirebase(
  //       userData.id,
  //       otherInfo.uploadTradeLicense[0],
  //       FOLDERS.tradeLicense,
  //     );
  //   }
  //   if (otherInfo.otherFiles && typeof otherInfo.otherFiles === "object") {
  //     otherInfo.otherFiles = await ImageUploadToFirebase(
  //       userData.id,
  //       otherInfo.otherFiles[0],
  //       FOLDERS.otherFiles,
  //     );
  //   }
  //   if (otherInfo.uploadPassport && typeof otherInfo.uploadPassport === "object") {
  //     otherInfo.uploadPassport = await ImageUploadToFirebase(
  //       userData.id,
  //       otherInfo.uploadPassport[0],
  //       FOLDERS.passport,
  //     );
  //   }
  //   try {
  //     const accessToken = await getToken();
  //     if (!accessToken) {
  //       navigate(`${isAdmin ? "/admin" : "/"}login`);
  //     }
  //     const res = isAdmin
  //       ? await apiProvider.addUserByAdmin(otherInfo, accessToken)
  //       : await apiProvider.updateFormTwo(otherInfo, accessToken);
  //     if (res.data?.success) {
  //       successMsg();
  //     } else {
  //       const errors = res.data?.error;
  //       error("Update errors, try again");
  //     }
  //   } catch (error) {
  //     /* empty */
  //   }
  // };

  const handleSubmitPersonalInfo = async (data, personalInfoForm) => {
    const { profileImage, ...personalInfo } = data;
    // const verb = newUserId ? "update" : "add";
    const verb = "update";
    confirm({
      // title: `Are you sure to ${newUserId !== " " ? "update" : "add"} personal Information?`,
      title: `Are you sure to ${verb} personal Information?`,
      async onOk() {
        try {
          // personalInfo.uid = userData.id;
          const accessToken = await getToken();
          if (!accessToken) {
            navigate(`${isAdmin ? "/admin" : "/"}login`);
          }
          const res = isAdmin
            ? await apiProvider.addUserByAdmin({ ...personalInfo, uid: userData.id }, accessToken)
            : await apiProvider.updateFormOne({ ...personalInfo }, accessToken);
          if (res.data?.uid) {
            const nUserId = res.data.uid;
            if (typeof profileImage === "object") {
              const profileImagePath = await ImageUploadToFirebase(
                nUserId,
                profileImage[0],
                FOLDERS.profile,
              );
              const docRef = doc(firestore, COLLECTIONS.users, nUserId);
              await updateDoc(docRef, {
                profileImage: profileImagePath,
                updatedAt: new Date(),
                updatedBy: authUserId,
              });
            }
            // const profileImagePath =
            //   typeof profileImage === "object"
            //     ? await ImageUploadToFirebase(nUserId, profileImage[0], FOLDERS.profile)
            //     : null;
            // const docRef = doc(firestore, COLLECTIONS.users, nUserId);
            // await updateDoc(docRef, {
            //   profileImage: profileImagePath,
            //   updatedAt: new Date(),
            //   updatedBy: authUserId,
            // });
          }
          if (res.data.success) {
            changeTab("2");
          } else {
            const errors = res.data?.error;
            errors.forEach((error) => {
              const fieldName = Object.keys(error);
              const errorMessage = error[fieldName];
              personalInfoForm.setFields([{ name: fieldName, errors: [errorMessage] }]); //set error messages in antd form
            });
          }
        } catch (error) {
          console.log("error", error);
        }
      },
    });
  };
  const handleSubmitOtherInfo = async (data, form) => {
    const otherInfo = { ...data };
    deleteUndefinedNullFromObj(otherInfo);
    const accessToken = await getToken();
    if (!accessToken) {
      navigate(`${isAdmin ? "/admin" : "/"}login`);
    }
    const verb = "update";
    confirm({
      title: `Are you sure to ${verb} Detail Info.?`,
      async onOk() {
        if (userData?.id) {
          // using this "isRegistrationCompleted" value, the admin-api detect what type of request will be performed in backend
          otherInfo.isRegistrationCompleted = true;
          otherInfo.uid = userData.id;
          // const res = await updateUserOtherInfo(
          //   storage,
          //   otherInfo,
          //   userData.id,
          //   accessToken,
          //   isAdmin,
          // );
          // if (res.data?.success) {
          //   successMsg();
          // } else {
          //   const errors = res.data?.error;
          //   error("Update errors, try again");
          //   changeTab("2");
          // }
        }
      },
    });
  };

  const onFinishFailed = () => {
    if (activeKey === "1") {
      changeTab("1");
    } else {
      changeTab("2");
    }
  };

  function successMsg() {
    const message = `Updated successfully`;
    success(message);
    // success(`${role} Created ID : ${newUserId}`);
    // navigate(`/admin/${role}s`);
    onSuccess(userData.id);
  }
  const onChange = (key) => {
    changeTab(key);
  };
  if (!isAdmin && authUserId !== userData.id) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        // extra={<Button type="primary">Back Home</Button>}
      />
    );
  }
  const items = [
    {
      label: "1. Personal Information",
      key: "1",
      children: (
        <div className="border p-4 rounded">
          <PersonalInfoForm
            targetRole={targetRole}
            userData={userData}
            onSubmit={handleSubmitPersonalInfo}
            isAdmin={isAdmin}
          >
            <Button
              className={styles.btn}
              type="primary"
              htmlType="submit"
              // style={{ backgroundColor: "green" }}
            >
              {userData ? "Update" : "Save"} & Continue
            </Button>
            {userData ? (
              <Button
                className={styles.btn}
                // type="primary"
                onClick={() => changeTab("2")}
                type="green"
                // style={{ color: "white", "--hover-background": "green", "--hover-opacity": 0.5 }}
              >
                Next
              </Button>
            ) : null}
          </PersonalInfoForm>
        </div>
      ),
    },
    {
      label: "2. Detail Info.",
      key: "2",
      children: (
        <div className="border p-4 rounded">
          <Row gutter={16} justify="right" align="middle">
            <Button
              className={styles.btn}
              shape="circle"
              type="secondary"
              onClick={() => changeTab("1")}
            >
              <ArrowLeftOutlined />
            </Button>
          </Row>
          <br />
          <OtherInfoForm
            targetRole={targetRole}
            userData={userData}
            onSubmit={handleSubmitOtherInfo}
          />
        </div>
      ),
    },
  ];
  return (
    <div className="addPadding-40">
      <Tabs
        defaultActiveKey="1"
        activeKey={activeKey}
        centered
        items={items}
        onChange={onChange}
      ></Tabs>
    </div>
  );
};
export default UserEdit;
