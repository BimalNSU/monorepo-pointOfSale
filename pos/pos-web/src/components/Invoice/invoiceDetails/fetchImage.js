import { useEffect, useState } from "react";
import { useStorage } from "reactfire";
import { getDownloadURL, ref } from "firebase/storage";

export const useFetchImage = (propertyImage) => {
  const storage = useStorage();
  const [base64Image, setBase64Image] = useState(null);

  const fetchData = async () => {
    if (!propertyImage) return;

    const storageRef = ref(storage, propertyImage);

    try {
      const url = await getDownloadURL(storageRef);
      const base64Image = await getBase64FromUrl(url);
      setBase64Image(base64Image);
    } catch (error) {
      console.error("Error getting image:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [propertyImage]);

  return base64Image;
};

const getBase64FromUrl = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);
    return base64;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
};

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
