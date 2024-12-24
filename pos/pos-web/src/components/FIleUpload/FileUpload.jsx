import { UploadOutlined } from "@ant-design/icons";
import { Form, Upload, Button, Col, Row } from "antd";
import { useState } from "react";
import FetchFile from "../FetchFile/FetchFile";

const ACCPET_FILE_FORMAT = ".jpg,.PNG,.pdf";
const FileUpload = ({ form, prefixFieldName, name, label, src }) => {
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
  const handleAttachmentBeforeUpload = (file, fieldName) => {
    const acceptedFormats = ["jpg", "PNG", "pdf"];
    const pattern = new RegExp(`[(${acceptedFormats})]+$`, "gi");
    const fileName = file.name;
    //return true if the file format are "pdf"or "jpg"or "PNG"
    if (pattern.test(fileName)) {
      form.setFields([{ name: fieldName, errors: [] }]);
      return true;
    } else {
      // message.error(`You can only upload ${acceptedFormats.join(" or ")}  file!`);
      const errorMessage = `You can only upload ${acceptedFormats.join(" or ")}  file!`;
      form.setFields([{ name: fieldName, errors: [errorMessage] }]); //add error message in "otherInfoForm" antd
      return Upload.LIST_IGNORE;
    }
  };
  return (
    <Row style={{ width: "100%" }} align={"middle"} justify={""}>
      <Col>
        <Form.Item
          // name={name}
          name={[prefixFieldName, name]}
          label={label}
          getValueFromEvent={normFile}
          // rules={[{ required: true, message: 'Please input NID in .pdf or .jpg or .png!' }]}
          extra=""
        >
          <Upload
            // listType="picture"
            beforeUpload={(file) => handleAttachmentBeforeUpload(file, name)}
            onChange={handleChange}
            accept={ACCPET_FILE_FORMAT}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
      </Col>
      {src ? (
        <Col>{state.fileList.length ? null : src ? <FetchFile storagePath={src} /> : null}</Col>
      ) : null}
    </Row>
  );
};

export default FileUpload;
