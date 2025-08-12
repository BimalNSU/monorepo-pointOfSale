import { generateAlphanumeric } from "@/utils/Utils/Utils";
import { message } from "antd";
import { ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { useStorage } from "reactfire";
type UploadFile = {
  file: File;
  folderPath: string;
  metadata: object;
  onSuccess?: Function;
  onError?: Function;
};
const useFirebaseUpload = () => {
  const storage = useStorage();
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const uploadFile = async ({
    file,
    folderPath, // e.g. 'products', 'banners'
    metadata = {},
    onSuccess,
    onError,
  }: UploadFile) => {
    setUploading(true);
    setProgress(0);
    try {
      const storagePath = `${folderPath}/${file.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const nProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(nProgress);
        },
        (error) => {
          setUploading(false);
          onError?.(error);
        },
        async () => {
          const fileData = {
            path: storagePath,
            filename: file.name,
            metadata: {
              size: file.size,
              contentType: file.type,
              fileId: generateAlphanumeric(10),
              ...metadata,
            },
          };
          await onSuccess?.(fileData);
          setUploading(false);
          setProgress(0);
        },
      );
    } catch (error) {
      setUploading(false);
      message.error(`Upload error`);
      onError?.(error);
      throw error;
    }
  };
  return { uploadFile, progress, uploading };
};
export default useFirebaseUpload;
