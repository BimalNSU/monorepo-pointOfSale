import { FOLDERS } from "@/constants/folders";
import { success } from "@/utils/Utils/Utils";
import { deleteObject, ref, uploadBytesResumable } from "firebase/storage";
import { randomAlphanumeric } from "random-string-alphanumeric-generator";
const fileNameLength = 20;

//TODO: need to work on following function
const deleteFileFromFirebase = async (storage, path) => {
  const objRef = ref(storage, path);
  return new Promise((resolve, reject) => {
    const deleteTask = deleteObject(objRef);
    deleteTask
      .then(() => resolve(`File path: ${path} is deleted.`))
      .catch((e) => reject(`Failed to delete file: ${e}`));
  });
};
const getFileExtension = (fileName) => {
  const pattern = /\.([0-9a-z]+)(?:[?#]|$)/i;
  const matchedResult = pattern.exec(fileName);
  return matchedResult[1];
};
const uploadFileToFirebase = async (storage, folderPath, file) => {
  const fileToUpload = file.originFileObj || file; // 👈 fallback
  if (!fileToUpload) {
    throw new Error("No file to upload");
  }
  const fileName = fileToUpload.name;
  const randomFileName = randomAlphanumeric(fileNameLength);
  const fileExtension = getFileExtension(file.name);
  const newRef = ref(storage, `${folderPath}/${randomFileName}.${fileExtension}`);
  const metadata = {
    // cacheControl: 'public,max-age=300',
    contentType: file.type,
    customMetadata: {
      originalFileName: fileName,
      //can also possible to add more info here
    },
  };
  const uploadTask = uploadBytesResumable(newRef, fileToUpload, metadata);
  await uploadTask.then();
  // success(`${fileName} is uploaded`);
  return newRef.fullPath;
};

const uploadUserProfile = async (storage, userId, file) => {
  const folderPath = `${FOLDERS.users}/${userId}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadUserBrithCertificate = async (storage, userId, file) => {
  const folderPath = `${FOLDERS.users}/${userId}/${FOLDERS.birthCertificates}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadUserNid = async (storage, userId, file) => {
  const folderPath = `${FOLDERS.users}/${userId}/${FOLDERS.nid}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadUserPassport = async (storage, userId, file) => {
  const folderPath = `${FOLDERS.users}/${userId}/${FOLDERS.passport}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadUserTin = async (storage, userId, file) => {
  const folderPath = `${FOLDERS.users}/${userId}/${FOLDERS.tin}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadUserBin_vat = async (storage, userId, file) => {
  const folderPath = `${FOLDERS.users}/${userId}/${FOLDERS.bin_vat}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadUserTradeLicense = async (storage, userId, file) => {
  const folderPath = `${FOLDERS.users}/${userId}/${FOLDERS.tradeLicense}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadUserOthers = async (storage, userId, file) => {
  const folderPath = `${FOLDERS.users}/${userId}/${FOLDERS.others}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

//for member
const uploadMemberProfile = async (storage, memberId, file) => {
  const folderPath = `${FOLDERS.member.profile}/${memberId}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadMemberBrithCertificate = async (storage, memberId, file) => {
  const folderPath = `${FOLDERS.member.birthCertificate}/${memberId}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadMemberNid = async (storage, memberId, file) => {
  const folderPath = `${FOLDERS.member.nid}/${memberId}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadMemberPassport = async (storage, memberId, file) => {
  const folderPath = `${FOLDERS.member.passport}/${memberId}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadMemberTin = async (storage, memberId, file) => {
  const folderPath = `${FOLDERS.member.tin}/${memberId}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadMemberBin_vat = async (storage, memberId, file) => {
  const folderPath = `${FOLDERS.member.bin_vat}/${memberId}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadMemberTradeLicense = async (storage, memberId, file) => {
  const folderPath = `${FOLDERS.member.tradeLicense}/${memberId}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

const uploadMemberOthers = async (storage, memberId, file) => {
  const folderPath = `${FOLDERS.member.others}/${memberId}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

//for agreement
const uploadManualAgreement = async (storage, propertyId, userId, agreementId, file) => {
  const folderPath = `${FOLDERS.agreement}/${propertyId}/${userId}/${agreementId}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};
const uploadManualAgreementOldFile = async (storage, propertyId, userId, agreementId, file) => {
  const folderPath = `${FOLDERS.agreement}/${propertyId}/${userId}/${agreementId}/${FOLDERS.oldFiles}`;
  const pathRef = await uploadFileToFirebase(storage, folderPath, file);
  return pathRef;
};

export {
  getFileExtension,
  deleteFileFromFirebase,
  uploadFileToFirebase,
  uploadUserProfile,
  uploadUserBrithCertificate,
  uploadUserNid,
  uploadUserPassport,
  uploadUserTin,
  uploadUserBin_vat,
  uploadUserTradeLicense,
  uploadUserOthers,

  //for member
  uploadMemberProfile,
  uploadMemberBrithCertificate,
  uploadMemberNid,
  uploadMemberPassport,
  uploadMemberTin,
  uploadMemberBin_vat,
  uploadMemberTradeLicense,
  uploadMemberOthers,

  //for agreement
  uploadManualAgreement,
  uploadManualAgreementOldFile,
};
