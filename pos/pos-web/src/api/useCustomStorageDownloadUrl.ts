import { getFileExtension } from "@/api/common/commonFunctions";
import { getStorage, ref, getDownloadURL, getMetadata } from "firebase/storage";
import { useEffect, useState } from "react";
type Data = {
  url: string;
  metaData: any;
  fileExtension: string;
};

export const useCustomStorageDownloadUrl = (storagePath?: string) => {
  const storage = getStorage();
  const [status, setStatus] = useState<string>("loading");
  const [data, setData] = useState<Data | undefined>();

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      setStatus("loading");
      try {
        if (storagePath) {
          const fileRef = ref(storage, storagePath);
          const url = await getDownloadURL(fileRef);
          const metaData = await getMetadata(fileRef);
          const fileExtension = getFileExtension(metaData.name);
          if (!abortController.signal.aborted) {
            setData({ url, metaData, fileExtension });
          }
        }
        if (!abortController.signal.aborted) {
          setStatus("success");
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setStatus("error");
        }
      }
    })();
    return () => {
      abortController.abort();
    };
  }, [storagePath]);

  return { status, data };
};
