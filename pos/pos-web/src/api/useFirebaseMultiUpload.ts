import { useState } from "react";
import { ref, uploadBytesResumable } from "firebase/storage";
import { useStorage } from "reactfire";
import { generateAlphanumeric } from "@/utils/Utils/Utils";
import { getFileExtension } from "./common/commonFunctions";
import { MetadataType, ProductImageType } from "@pos/shared-models";
type PartialMetadataType = Pick<MetadataType, "size" | "contentType"> & {
  width?: number;
  height?: number;
};
type SuccessData = Pick<ProductImageType, "path" | "filename"> & { metadata: PartialMetadataType };

type UploadFile = {
  file: File;
  folderPath: string;
  metadata?: object;
  onSuccess?: (data: SuccessData) => void;
  onError?: (error: unknown) => void;
};

type UploadConfig = {
  files: UploadFile[];
  concurrency?: number; // max concurrent uploads
  onAllSuccess?: (data: SuccessData[]) => Promise<void> | void;
};

export default function useFirebaseMultiUpload() {
  const storage = useStorage();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const uploadFiles = async ({ files, concurrency = 3, onAllSuccess }: UploadConfig) => {
    const totalFiles = files.length;
    if (!totalFiles) return;

    setUploading(true);
    setProgress(0);
    setUploadedCount(0);
    setTotalCount(totalFiles);

    let uploadedBytes = 0;
    const totalBytes = files.reduce((sum, f) => sum + f.file.size, 0);
    const results: SuccessData[] = [];

    // Upload a single file
    const runUpload = async (fileObj: UploadFile) => {
      const { file, folderPath, metadata = {}, onSuccess, onError } = fileObj;
      return new Promise<void>((resolve) => {
        const fileId = generateAlphanumeric(10);
        const fileExtension = getFileExtension(file.name);
        const storagePath = `${folderPath}/${fileId}.${fileExtension}`;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        let prevTransferred = 0;

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const delta = snapshot.bytesTransferred - prevTransferred;
            prevTransferred = snapshot.bytesTransferred;
            uploadedBytes += delta;

            // use functional update for immediate UI refresh
            setProgress(() => Math.round((uploadedBytes / totalBytes) * 100));
          },
          (error) => {
            onError?.(error);
            resolve();
          },
          async () => {
            // Start with basic file metadata
            const fileData: SuccessData = {
              path: storagePath,
              filename: file.name,
              metadata: { size: file.size, contentType: file.type, ...metadata },
            };
            // If the file is an image, get width and height
            if (file.type.startsWith("image/")) {
              const img = new Image();
              img.src = URL.createObjectURL(file);
              await new Promise<void>((resolveImg) => {
                img.onload = () => {
                  fileData.metadata = {
                    ...fileData.metadata,
                    width: img.width,
                    height: img.height,
                  };
                  resolveImg();
                };
                img.onerror = () => {
                  // console.warn("Failed to get image dimensions for", file.name);
                  resolveImg(); // still resolve so upload continues
                };
              });
            } else {
              // Non-image files: just add createdAt
              fileData.metadata = { ...fileData.metadata };
            }

            results.push(fileData);
            setUploadedCount((prev) => prev + 1);
            onSuccess?.(fileData);
            resolve();
          },
        );
      });
    };

    // Concurrency queue
    const queue: UploadFile[] = [...files];
    const workers: Promise<void>[] = [];

    const startWorker = async () => {
      while (queue.length > 0) {
        const fileObj = queue.shift()!;
        await runUpload(fileObj);
      }
    };

    // Start workers limited by concurrency
    const concurrencyLimit = Math.min(concurrency, totalFiles);
    for (let i = 0; i < concurrencyLimit; i++) {
      workers.push(startWorker());
    }

    await Promise.all(workers);
    await onAllSuccess?.(results);
    setUploading(false);
    // setProgress(0);
    // setUploadedCount(0);
    // setTotalCount(0);
  };

  return { uploadFiles, progress, uploading, uploadedCount, totalCount };
}
