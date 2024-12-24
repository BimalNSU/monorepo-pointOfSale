import { FOLDERS } from "../constants/folder";
import { bucket } from "../firebase";
import axios from "axios";
import randomstring from "randomstring";

export async function uploadFile(folderPath: string, bufferValue: Buffer) {
  const fileId = randomstring.generate({ charset: "alphanumeric" });
  const filePath = `${folderPath}/${fileId}.jpg`;
  const file = bucket.file(filePath);
  await file.save(bufferValue, {
    contentType: "image/jpeg",
  });
  return filePath;
}
export async function uploadNidPhoto(bufferValue: Buffer) {
  const basePath = FOLDERS.nidRecords;
  const filePath = await uploadFile(basePath, bufferValue);
  return filePath;
}

export async function fetchImage(imageUrl: string) {
  // Get image
  const imageResponse = await axios({
    url: imageUrl,
    method: "GET",
    responseType: "arraybuffer",
  });
  return imageResponse.data;
}
