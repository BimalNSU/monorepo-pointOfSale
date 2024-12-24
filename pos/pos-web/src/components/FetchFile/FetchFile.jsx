import { useStorageDownloadURL, useStorage } from "reactfire";
import { ref } from "firebase/storage";
import styles from "./FetchFile.module.css";
import { Image } from "antd";

const FetchFile = ({ storagePath }) => {
  const storage = useStorage();
  const { data: fileUrl } = useStorageDownloadURL(ref(storage, storagePath));

  if (storagePath.split(".")[1] === "pdf") {
    return (
      <a href={fileUrl} target="_blank" className={styles.fetchFileStyle} rel="noreferrer">
        LINK
      </a>
    );
  }
  return <Image src={fileUrl} alt="demo download" className={styles.fetchFileStyle} />;
};

export default FetchFile;
