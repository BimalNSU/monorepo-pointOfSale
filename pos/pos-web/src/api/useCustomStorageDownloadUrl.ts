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

  const fetchData = async () => {
    setStatus("loading");
    try {
      if (storagePath) {
        const fileRef = ref(storage, storagePath);
        const url = await getDownloadURL(fileRef);
        const metaData = await getMetadata(fileRef);
        const fileExtension = getFileExtension(metaData.name);
        // console.log("url", url);
        // console.log("metaData", metaData);
        setData({ url, metaData, fileExtension });
      }
      setStatus("success");
    } catch (err) {
      console.log(err);
      setStatus("error");
    }
    // const xhr = new XMLHttpRequest();
    // xhr.responseType = "blob";
    // xhr.onload = (event) => {
    //   const blob = xhr.response;
    //   console.log("blob", blob);
    // };
    // xhr.open("GET", url);
    // xhr.send();
    // getDownloadURL(ref(storage, "images/stars.jpg"))
    //   .then((url) => {
    //     // `url` is the download URL for 'images/stars.jpg'

    //     // This can be downloaded directly:
    //     const xhr = new XMLHttpRequest();
    //     xhr.responseType = "blob";
    //     xhr.onload = (event) => {
    //       const blob = xhr.response;
    //     };
    //     xhr.open("GET", url);
    //     xhr.send();

    //     // Or inserted into an <img> element
    //     const img = document.getElementById("myimg");
    //     img.setAttribute("src", url);
    //   })
    //   .catch((error) => {
    //     // Handle any errors
    //   });
  };
  useEffect(() => {
    fetchData();
  }, [storagePath]);

  return { status, data };
};
