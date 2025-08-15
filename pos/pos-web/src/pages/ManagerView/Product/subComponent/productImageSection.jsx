import { useEffect } from "react";
import { Button, Upload, Progress, Space, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableCard from "./sortableCard";

const sixColors = {
  "0%": "#108ee9",
  "20%": "#289bcf",
  "40%": "#40a8b5",
  "60%": "#57b69c",
  "80%": "#6fc382",
  "100%": "#87d068",
};

function ProductImagesSection({
  fileList,
  setFileList,
  progress,
  uploading,
  uploadedCount,
  totalCount,
}) {
  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      fileList.forEach((f) => f.preview && f.file && URL.revokeObjectURL(f.preview));
    };
  }, []);

  const onDragEnd = ({ active, over }) => {
    if (!over) return;
    if (active.id !== over.id) {
      setFileList((prev) => {
        const oldIndex = prev.findIndex((f) => f.uid === active.id);
        const newIndex = prev.findIndex((f) => f.uid === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  // Upload change: merge existing files + add new previews
  const handleUploadChange = ({ fileList: newFiles }) => {
    setFileList((prev) => {
      const existingNumOfFiles = prev.length;
      // Keep existing previews
      const existingFiles = prev.filter((f) => newFiles.find((n) => n.uid === f.uid));
      const addedFiles = newFiles
        .filter((f) => !prev.find((p) => p.uid === f.uid))
        .map((f) => ({
          uid: f.uid,
          name: f.name,
          file: f.originFileObj,
          preview: f.originFileObj ? URL.createObjectURL(f.originFileObj) : f.url,
          isPrimary: existingNumOfFiles === 0 && f.uid === newFiles[0].uid,
        }));
      return [...existingFiles, ...addedFiles];
    });
  };

  const removeFile = (index) => {
    setFileList((prev) => {
      const removed = prev[index];
      if (removed?.preview && removed.file) {
        URL.revokeObjectURL(removed.preview); // revoke memory
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const setPrimary = (index) => {
    setFileList((prev) => prev.map((f, i) => ({ ...f, isPrimary: i === index })));
  };

  return (
    <>
      <Upload
        multiple
        accept="image/*"
        beforeUpload={() => false}
        showUploadList={false}
        fileList={fileList}
        onChange={handleUploadChange}
      >
        <Button icon={<PlusOutlined />} type="dashed" style={{ width: "100%" }}>
          Click or drag images to upload
        </Button>
      </Upload>

      <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
        <SortableContext items={fileList.map((f) => f.uid)} strategy={verticalListSortingStrategy}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 11, marginTop: 16 }}>
            {fileList.map((file, index) => (
              <SortableCard
                key={file.uid}
                fileObj={file}
                index={index}
                onRemove={removeFile}
                onSetPrimary={setPrimary}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {uploading && (
        <div style={{ marginTop: 24 }}>
          <Progress
            percent={Math.round(progress)}
            status={progress === 100 ? "success" : "active"}
            strokeColor={sixColors}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              color: "#666",
            }}
          >
            <Space>
              <span>Uploading files</span>
              <Spin size="small" />
            </Space>
            <span>
              {uploadedCount} / {totalCount}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
export default ProductImagesSection;
