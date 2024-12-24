import React, { useState, useEffect } from "react";
import styles from "../Personal.module.css";
import { useHistory, useParams } from "react-router-dom";
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
import { PlusOutlined, UploadOutlined, ArrowLeftOutlined, DatabaseFilled } from "@ant-design/icons";
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
import * as validator from "../../../utils/Validation/Validation";

import { success, error, deleteUndefinedFromObj, checkValueExist } from "@/utils/Utils/Utils";
// import style from "../../../assets/common/style.css";
const bloodGroupsData = [];

// import { Address } from "@/components/Address/AddressComponent";
import FetchFile from "../../FetchFile/FetchFile";
import FileUpload from "../../FIleUpload/FileUpload";
const { Option } = Select;
const { Title } = Typography;

const OtherInfoForm = ({ targetRole, userData, onSubmit }) => {
  const [otherInfoForm] = Form.useForm();

  useEffect(() => {
    if (userData && (targetRole === "member" || userData.isRegistrationCompleted)) {
      const { address, ...rest } = userData;
      otherInfoForm.setFieldsValue({ ...rest }); //TODO: need to optimize the code
    }
  }, [userData]);

  const onFinishOtherInfoForm = (data) => {
    const cc_m_cArray = data.cc_m_c ? data.cc_m_c.split(" ") : [];
    const cc_m_c_type = cc_m_cArray.pop();
    const cc_m_c = cc_m_c_type ? { type: cc_m_c_type, value: cc_m_cArray.join(" ") } : null;
    const address = {
      // country: data.country, //TODO: further it will be used
      house: data.house,
      village_road: data.village_road,
      block_sector_area: data.block_sector_area || null,
      avenue: data.avenue || null,
      division_state: data.division_state,
      district: data.district,
      cc_m_c,
      upazila: data.upazila || null,
      union: data.union || null,
      thana: data.thana,
      ward: data.ward,
      postOffice: data.postOffice,
    };
    const otherInfo = {
      address,
      birthCertificate: data.birthCertificate || null,
      nid: data.nid || null,
      passportNo: data.passportNo || null,
      bin_vat: data.bin_vat || null,
      drivingLicense: data.drivingLicense || null,
      tin: data.tin || null,
      emergencyMobile: data.emergencyMobile || null,
      emergencyEmail: data.emergencyEmail || null,
      files: {
        birthCertificate: data.files?.birthCertificate || userData?.files?.birthCertificate || null,
        tin: data.files?.tin || userData?.files?.tin || null,
        nid: data.files?.nid || userData?.files?.nid || null,
        bin_vat: data.files?.bin_vat || userData?.files?.bin_vat || null,
        tradeLicense: data.files?.tradeLicense || userData?.files?.tradeLicense || null,
        passport: data.files?.passport || userData?.files?.passport || null,
        others: data.files?.others || userData?.files?.others || null,
      },
    };
    if (targetRole === "manager" || targetRole === "owner" || targetRole === "tenant") {
      otherInfo.residentsNo = data.residentsNo || null;
    }
    // showConfirmOtherInfoForm(otherInfo);
    onSubmit(otherInfo, otherInfoForm);
  };

  const onFinishFailed = () => {
    // if (activeKey === "1") {
    //   changeTab("1");
    // } else {
    //   changeTab("2");
    // }
  };

  return (
    <>
      <Row>
        <Col>
          <Title level={3}>Detail Info.</Title>
        </Col>
      </Row>
      <Form
        form={otherInfoForm}
        name="register"
        onFinish={onFinishOtherInfoForm}
        scrollToFirstError
        labelAlign="left"
        labelWrap
        layout="vertical"
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={12}>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <Form.Item
              name="birthCertificate"
              label="Birth Certificate No:"
              rules={[
                {
                  pattern: new RegExp(/^(\d{17}$)/),
                  message: `Please enter ${targetRole}'s valid birth certificate number`,
                },
              ]}
            >
              <Input type={"text"} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <Form.Item
              name="nid"
              label="NID No:"
              rules={[
                {
                  // pattern: new RegExp(/^[1-9](\d{9}$|\d{12}$|\d{16}$)/),
                  pattern: new RegExp(/^[0-9](\d{9}$|\d{12}$|\d{16}$)/),
                  message: `Please enter ${targetRole}'s valid NID number`,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <Form.Item
              name="passportNo"
              label="Passport No"
              rules={[
                {
                  pattern: new RegExp(/^([a-z0-9]+)$/, "gi"),
                  message: `Please enter ${targetRole}'s valid Passport number`,
                  // message: validator.PASSPORT_ACCEPTED_MESSAGE,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          {targetRole === "owner" || targetRole == "tenant" || targetRole == "member" ? (
            <>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item
                  name="bin_vat"
                  label="BIN/VAT No:"
                  rules={[
                    {
                      whitespace: true,
                      message: validator.BLANK_SPACE_MESSAGE,
                    },
                    {
                      min: validator.BINVAT_MIN_DIGIT,
                      message: validator.BINVAT_MIN_DIGIT_MESSAGE,
                    },
                    {
                      max: validator.BINVAT_MAX_DIGIT,
                      message: validator.BINVAT_MAX_DIGIT_MESSAGE,
                    },
                    // { type:'number',  message: PHONE_NUMBER_ACCPTED_MESSAGE},
                    {
                      pattern: new RegExp(/[0-9]/),
                      message: validator.BINVAT_ACCEPTED_MESSAGE,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item
                  name="drivingLicense"
                  label="Driving License"
                  rules={[
                    {
                      whitespace: true,
                      message: validator.BLANK_SPACE_MESSAGE,
                    },
                    {
                      min: validator.DRIVING_LICENSE_MIN_DIGIT,
                      message: validator.DRIVING_LICENSE_MIN_DIGIT_MESSAGE,
                    },
                    {
                      max: validator.DRIVING_LICENSE_MAX_DIGIT,
                      message: validator.DRIVING_LICENSE_MAX_DIGIT_MESSAGE,
                    },
                    // { type:'number',  message: PHONE_NUMBER_ACCPTED_MESSAGE},
                    {
                      pattern: new RegExp(/[0-9]/),
                      message: validator.DRIVING_LICENSE_ACCEPTED_MESSAGE,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </>
          ) : null}
          {targetRole === "owner" || targetRole == "tenant" ? (
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="residentsNo"
                label="Residents No."
                // wrapperCol={{span: 10, offset: 0}}
                rules={[
                  {
                    required: true,
                    message: `Please enter ${targetRole}'s Resident no.!`,
                  },
                  // {
                  //   pattern: new RegExp(/[0-9]+$/),
                  //   message: validator.FAMILY_MEMBER_NUMBER_ACCEPTED_MESSAGE,
                  // },
                ]}
              >
                {/* <Input width={"100%"} /> */}
                <InputNumber min={1} formatter={(value) => value.replace(/[.]/g, "")} />
              </Form.Item>
            </Col>
          ) : null}
          {targetRole === "owner" || targetRole == "tenant" || targetRole == "member" ? (
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="tin"
                label="TIN No:"
                rules={[
                  {
                    whitespace: true,
                    message: validator.BLANK_SPACE_MESSAGE,
                  },
                  // {
                  //   min: validator.TIN_MIN_DIGIT,
                  //   message: validator.TIN_MIN_DIGIT_MESSAGE,
                  // },
                  // {
                  //   max: validator.TIN_MAX_DIGIT,
                  //   message: validator.TIN_MAX_DIGIT_MESSAGE,
                  // },
                  // // { type:'number',  message: PHONE_NUMBER_ACCPTED_MESSAGE},
                  // {
                  //   pattern: new RegExp(/[0-9]/),
                  //   message: validator.TIN_ACCEPTED_MESSAGE,
                  // },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          ) : null}
        </Row>
        <br />
        {/* <Address form={otherInfoForm} address={userData?.address || {}} /> */}

        <Row gutter={12}>
          <Title level={5}>Emergency Contact Info.</Title>
        </Row>
        <Row gutter={12}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form.Item
              name="emergencyMobile"
              label="Mobile No:"
              rules={[
                {
                  pattern: new RegExp(/^01[3-9]\d{8}$/),
                  message: `Please enter ${targetRole}'s valid Mobile No!`,
                },
                {
                  whitespace: true,
                  message: validator.BLANK_SPACE_MESSAGE,
                },
              ]}
            >
              <Input type={"text"} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form.Item
              name="emergencyEmail"
              label="Email:"
              rules={[
                {
                  message: `Please enter ${targetRole}'s  E-mail!`,
                },
                {
                  type: "email",
                  message: validator.VALID_EMAIL_MESSAGE,
                },
                {
                  whitespace: true,
                  message: validator.BLANK_SPACE_MESSAGE,
                },
              ]}
            >
              <Input type={"email"} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Title level={5}>Documents</Title>
        </Row>
        <Row gutter={12} justify="space-between">
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <FileUpload
              form={otherInfoForm}
              prefixFieldName="files"
              name="birthCertificate"
              label="Birth Certificate:"
              src={userData?.files?.birthCertificate}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <FileUpload
              form={otherInfoForm}
              prefixFieldName="files"
              name="nid"
              label="NID:"
              src={userData?.files?.nid}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <FileUpload
              form={otherInfoForm}
              prefixFieldName="files"
              name="passport"
              label="Passport:"
              src={userData?.files?.passport}
            />
          </Col>

          {targetRole === "owner" || targetRole === "tenant" || targetRole == "member" ? (
            <>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <FileUpload
                  form={otherInfoForm}
                  prefixFieldName="files"
                  name="tin"
                  label="TIN Certificate:"
                  src={userData?.files?.tin}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <FileUpload
                  form={otherInfoForm}
                  prefixFieldName="files"
                  name="bin_vat"
                  label="BIN/VAT:"
                  src={userData?.files?.bin_vat}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <FileUpload
                  form={otherInfoForm}
                  prefixFieldName="files"
                  name="tradeLicense"
                  label="Trade License(.jpg, .png, .pdf):"
                  src={userData?.files?.tradeLicense}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <FileUpload
                  form={otherInfoForm}
                  prefixFieldName="files"
                  name="others"
                  label="Add more documents (.jpg, .png, .pdf):"
                  src={userData?.files?.others}
                />
              </Col>
            </>
          ) : null}
        </Row>

        <Row gutter={[0, 0]} justify="center" align="middle">
          <Col>
            <Button className={styles.btn} type="primary" htmlType="submit">
              {/* {newUserId ? "Update" : "Create"} {targetRole} */}
              {`${!userData ? "Create" : "Update"} ${targetRole}`}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default OtherInfoForm;
