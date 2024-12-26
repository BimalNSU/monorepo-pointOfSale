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

import { success, error, deleteUndefinedFromObj, checkValueExist } from "@/utils/Utils/Utils";

import dayjs from "dayjs";
import { COLLECTIONS } from "@/constants/collections";

import { apiProvider } from "@/utils/ApiProvider/ApiProvider";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import { Address } from "@/components/Address/AddressComponent";
import FetchFile from "../FetchFile/FetchFile";
import FileUpload from "../FIleUpload/FileUpload";
import PersonalInfoForm from "./AddEdit/PersonalInfoForm";
import OtherInfoForm from "./AddEdit/OtherInfoForm";
// import { updateUserOtherInfo } from "@/api/admin/userFunctions";
import { uploadUserProfile } from "@/api/common/commonFunctions";
const bloodGroupsData = [];

const { confirm } = Modal;
const { Option } = Select;
const { Title } = Typography;
const dateTimeFormat = "DD/MM/YYYY HH:mm:ss";
// const domain = window.location.origin;
// const currentDateTime = dayjs().format(dateTimeFormat).toString();

const UserAdd = ({ targetRole, onSuccess }) => {
  const { userId: authUserId, role: authRole, isAdmin, getToken } = useCustomAuth();
  const navigate = useNavigate();
  const storage = useStorage();
  const firestore = useFirestore();
  const [activeKey, setActiveKey] = useState("1");
  const [newUserId, setNewUserId] = useState();

  // tab change
  const changeTab = (Key) => setActiveKey(Key);

  const handleSubmitPersonalInfo = async (data, form) => {
    const { profileImage, ...personalInfo } = data;
    const verb = newUserId ? "update" : "add";
    confirm({
      title: `Are you sure to ${verb} personal Information?`,
      async onOk() {
        try {
          if (newUserId && isAdmin) {
            personalInfo.uid = newUserId;
          }
          const accessToken = await getToken();
          if (!accessToken) {
            navigate(`${isAdmin ? "/admin" : "/"}login`);
          }
          const res = isAdmin
            ? await apiProvider.addUserByAdmin({ ...personalInfo }, accessToken)
            : await apiProvider.updateFormOne({ ...personalInfo }, accessToken);
          if (res.data?.uid) {
            const nUserId = res.data.uid;
            setNewUserId(nUserId);
            // if (typeof profileImage === "object") {
            //   const profileImagePath = await ImageUploadToFirebase(
            //     nUserId,
            //     profileImage[0],
            //     FOLDERS.profile,
            //   );
            //   const docRef = doc(firestore, COLLECTIONS.users, nUserId);
            //   await updateDoc(docRef, { profileImage: profileImagePath });
            // }
            const profileImagePath =
              typeof profileImage === "object"
                ? await uploadUserProfile(storage, nUserId, profileImage[0])
                : null;
            const docRef = doc(firestore, COLLECTIONS.users, nUserId);
            await updateDoc(docRef, {
              profileImage: profileImagePath,
              updatedAt: new Date(),
              updatedBy: authUserId,
            });
          }
          if (res.data.success) {
            changeTab("2");
          } else {
            const errors = res.data?.error;
            errors.forEach((error) => {
              const fieldName = Object.keys(error);
              const errorMessage = error[fieldName];
              form.setFields([{ name: fieldName, errors: [errorMessage] }]); //set error messages in antd form
            });
          }
        } catch (error) {
          console.log("error", error);
        }
      },
    });
  };

  const handleSubmitOtherInfo = async (data, form) => {
    const verb = "add";
    const accessToken = await getToken();
    if (!accessToken) {
      navigate(`${isAdmin ? "/admin" : "/"}login`);
    }
    confirm({
      title: `Are you sure to ${verb} Detail Info.?`,
      async onOk() {
        if (newUserId) {
          const otherInfo = {
            ...data,
            isRegistrationCompleted: true, // using this "isRegistrationCompleted" value, the admin-api detect what type of request will be performed in backend
            role: targetRole, //only adding role value while making create new user request
            uid: newUserId,
          };
          // await updateDbForOtherInfo(otherInfo);
          // const res = await updateUserOtherInfo(
          //   storage,
          //   otherInfo,
          //   newUserId,
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
        } else {
          error("Something went wrong. Try again");
          changeTab("2");
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
    const message = `${targetRole} Id: ${newUserId} is created successfully`;
    success(message);
    // success(`${role} Created ID : ${newUserId}`);
    // navigate(`/admin/${role}s`);
    onSuccess(newUserId);
  }

  const items = [
    {
      label: "1. Personal Information",
      key: "1",
      children: (
        <div className="border p-4 rounded">
          <PersonalInfoForm
            targetRole={targetRole}
            onSubmit={handleSubmitPersonalInfo}
            // onSuccess={handleForm1Submit}
            // authUserId={authUserId}
            isAdmin={isAdmin}
          >
            <Button type="primary" htmlType="submit" style={{ backgroundColor: "green" }}>
              {newUserId ? "Update" : "Save"} & Continue
            </Button>
            {newUserId ? (
              <Button
                type="primary"
                onClick={() => changeTab("2")}
                style={{ backgroundColor: "green" }}
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
            authRole={authRole}
            onSubmit={handleSubmitOtherInfo}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="addPadding-40">
      <Tabs defaultActiveKey="1" activeKey={activeKey} centered items={items}></Tabs>
    </div>
  );
};
export default UserAdd;
