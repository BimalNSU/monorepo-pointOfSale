import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Form, Upload, Button, message, Modal, Row, Col } from "antd";
import { useState } from "react";
import FetchFile from "../FetchFile/FetchFile";

const ACCPET_FILE_FORMAT = "";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
const ImageUploadWithPreview = ({ name, src }) => {
  // profile img
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const [state, setState] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  });
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const handleChange = ({ fileList }) => {
    if (fileList.length) {
      fileList[0].error = "";
      fileList[0].status = "done";
    }
    setState({ fileList });
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
      fileList: state.fileList,
    });
  };
  const handleProfileImageBeforeUpload = (file) => {
    const isFileLargerThen2M = file.size / 1024 / 1024 < 2;
    if (!isFileLargerThen2M) {
      message.error(`Image must smaller than 2MB!`);
      return Upload.LIST_IGNORE;
    }
    const acceptedFormats = ["jpg", "PNG"];
    const pattern = new RegExp(`[(${acceptedFormats})]+$`, "gi");
    const fileName = file.name;
    //return true if the file format are "pdf"or "jpg"or "PNG"
    if (pattern.test(fileName)) {
      return true;
    } else {
      message.error(`You can only upload ${acceptedFormats.join(" or ")} file!`);
      return Upload.LIST_IGNORE;
    }
  };
  const handleCancel = () => setState({ previewVisible: false, fileList: state.fileList });
  return (
    <Row>
      <Col>{state.fileList.length ? null : src ? <FetchFile storagePath={src} /> : null}</Col>
      <Col>
        <Form.Item
          name={name}
          getValueFromEvent={normFile}
          // rules={[{ required: true, message: 'Please input NID in .pdf or .jpg or .png!' }]}
          extra=""
          rules={[
            {
              required: false,
              message: "Please attach .jpg or .png file",
            },
          ]}
        >
          <Upload
            listType="picture-card"
            fileList={state.fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={handleProfileImageBeforeUpload}
            accept={".PNG,.jpg"}
          >
            {state.fileList.length ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Modal
          open={state.previewVisible}
          title={state.previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={state.previewImage} />
        </Modal>
      </Col>
    </Row>
  );
};

export default ImageUploadWithPreview;
