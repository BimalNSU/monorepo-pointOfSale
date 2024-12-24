import { useStorageDownloadURL, useStorage } from "reactfire";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "./index.css";
import { Upload, Modal, Form, Button, message } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, StarOutlined } from "@ant-design/icons";
import { useCustomStorageDownloadUrl } from "../../api/useCustomStorageDownloadUrl";
const ACCPET_FILE_FORMAT = ".jpg,.PNG,.pdf";
const imageExtensions = ["jpg", "PNG"];

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const uploadButton = (
  <div>
    <PlusOutlined />
    <div
      style={{
        marginTop: 8,
      }}
    >
      Upload
    </div>
  </div>
);

const normFile = (e) => {
  // if (Array.isArray(e)) {
  //   console.log("e", e);
  //   return e;
  // }
  // return e && e?.fileList;
  console.log("e", e);
  if (Array.isArray(e)) {
    console.log("e", e);
    return e.fileList[0];
  }
  return e.file;
};

const props_file = {
  multiple: true,
  onChange({ file, fileList }) {
    if (file) {
      file.status = "done";
      file.error = "";
    }
  },
  maxCount: 1,
};

const AttachFile = ({ form, formProps, name, label, storagePath, showRemoveIcon }) => {
  const { status, data } = useCustomStorageDownloadUrl(storagePath);
  const { url: fileUrl, metaData, fileExtension } = data || {};
  const [fileList, setFileList] = useState([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  useEffect(() => {
    if (fileUrl && metaData) {
      const nFileList = [
        {
          uid: "1",
          name: metaData.customMetadata?.originalFileName || "",
          status: "done",
          url: fileUrl,
          thumbUrl: fileUrl,
        },
      ];
      setFileList(nFileList);
      // form.setFieldValue("oldFiles", [{ path: nFileList }]);

      //   form.setFieldValue("attachedFile", {
      //     uid: "1",
      //     name: "image.png",
      //     status: "done",
      //     url: fileUrl,
      //     thumbUrl: fileUrl,
      //   });
    }
  }, [fileUrl]);
  const handleAttachmentBeforeUpload = (file) => {
    // const fieldName = [0, "path"];
    const isFileLargerThen20M = file.size / 1024 / 1024 < 20;
    if (!isFileLargerThen20M) {
      const errorMessage = `File must smaller than 20 MB!`;
      message.error(errorMessage);
      //TODO: need to show error message in the form (not working)
      // form.setFields([{ name: fieldName, errors: [errorMessage] }]); //add error message in antd form
      return Upload.LIST_IGNORE;
    }
    const acceptedFormats = ["jpg", "PNG", "pdf"];
    const pattern = new RegExp(`[(${acceptedFormats})]+$`, "gi");
    const fileName = file.name;
    //return true if the file format are "pdf"or "jpg"or "PNG"
    if (pattern.test(fileName)) {
      // form.setFields([{ name: fieldName, errors: [] }]); //TODO: need to show error message in the form (not working)
      return true;
    } else {
      const errorMessage = `You can only upload ${acceptedFormats.join(" or ")}  file!`;
      message.error(errorMessage);
      //TODO: need to show error message in the form (not working)
      // form.setFields([{ name: fieldName, errors: [errorMessage] }]); //add error message in "otherInfoForm" antd
      return Upload.LIST_IGNORE;
    }
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    if (fileExtension && imageExtensions.includes(fileExtension)) {
      setPreviewOpen(true);
    }

    // setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1)); //hide file path from preview title
  };
  const handleChange = ({ file, fileList }) => {
    if (file) {
      //override file uploading status
      file.status = "done";
      file.error = "";
    }
    //TODO: need to check following code in needed or not
    const nFileList = fileList.map((item) => {
      const { status, error, ...rest } = item;
      return { ...rest, status: "done" };
    });
    setFileList(nFileList);
  };

  return (
    <>
      {/* <Button onClick={() => console.log("fileList", fileList)}>fileList</Button> */}
      <Form.Item
        {...formProps}
        name={name}
        label={label}
        // valuePropName="fileList"
        // valuePropName="file"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: "Please attached a file" }]}
      >
        <Upload
          //   action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          //   listType="picture-circle"
          //   listType="picture"
          listType={fileExtension && imageExtensions.includes(fileExtension) ? "picture" : "text"}
          //   listType="picture-card"
          fileList={fileList}
          onPreview={
            fileExtension && imageExtensions.includes(fileExtension) ? handlePreview : null
          }
          onChange={handleChange}
          multiple={true}
          maxCount={1}
          //   onRemove={false}
          beforeUpload={(file) => handleAttachmentBeforeUpload(file)}
          accept={ACCPET_FILE_FORMAT}
          showUploadList={{
            showRemoveIcon: showRemoveIcon ? true : false,
            showDownloadIcon: fileExtension ? true : false,
            downloadIcon: "Download",
            // showRemoveIcon: true,
            // removeIcon: <StarOutlined onClick={(e) => console.log(e, "custom removeIcon event")} />,
          }}
          className="upload-list-inline"
        >
          {/* {fileList.length >= 1 ? null : uploadButton} */}
          {fileList.length < 1 && "+ Upload"}
        </Upload>
      </Form.Item>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export default AttachFile;
