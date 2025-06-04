import { COLLECTIONS } from "@/constants/collections";
import { FetchStatus, MemberId } from "@pos/shared-models/dist/models/common.model";
import { User } from "@pos/shared-models/dist/models/user.model";
import { firestoreConverter } from "@/utils/converter";
import { doc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useMemo, useState } from "react";
import { useFirestore, useFirestoreDocData, useStorage } from "reactfire";
const userFirestoreConverter = firestoreConverter<User>();

export const useUserProfile = (id: MemberId) => {
  const db = useFirestore();
  // const storage = useStorage();
  // const [statusDownloadPhotoUrl, setStatusFetchPhotoUrl] = useState<FetchStatus>();
  // const [downloadProfilePhotoUrl, setDownloadProfilePhotoUrl] = useState<string | null>();
  const docRef = doc(db, COLLECTIONS.users, id).withConverter(userFirestoreConverter);
  const { status, data } = useFirestoreDocData(docRef, {
    idField: "id",
  });

  // const fetchDownloadableProfileImageUrl = async (photoUrl: string | null) => {
  //   try {
  //     const imgRef = photoUrl ? ref(storage, photoUrl) : null;
  //     const nProfileImageUrl = imgRef ? await getDownloadURL(imgRef) : null;
  //     setDownloadProfilePhotoUrl(nProfileImageUrl);
  //     setStatusFetchPhotoUrl("success");
  //   } catch (err) {
  //     setStatusFetchPhotoUrl("error");
  //   }
  // };
  // useEffect(() => {
  //   if (dbMember?.profileImage) {
  //     fetchDownloadableProfileImageUrl(dbMember.profileImage);
  //   } else {
  //     setStatusFetchPhotoUrl("success");
  //   }
  // }, [dbMember]);

  // const data = useMemo(() => {
  //   if (dbMember) {
  //     const { profileImage, ...rest } = dbMember;
  //     return { ...rest, profileImage: downloadProfilePhotoUrl };
  //   }
  // }, [dbMember]);
  // const status = useMemo(() => {
  //   if (fetchDataStatus === "success" && statusDownloadPhotoUrl === "success") {
  //     return "success";
  //   }
  //   if (fetchDataStatus === "error" || statusDownloadPhotoUrl === "error") {
  //     return "error";
  //   }
  //   return "loading";
  // }, [fetchDataStatus, statusDownloadPhotoUrl]);

  return { status, data };
};
