import { COLLECTIONS } from "../constants/collections";
import { db, FieldValue } from "../firebase";
import { writeFile } from "fs/promises";

const BASE_PATH = "./src/scripts/data";

const updateUsersFieldNames = async () => {
  const collectionRef = db.collection(COLLECTIONS.users);
  const dbUsers = (await collectionRef.get()).docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  try {
    const batch = db.batch();
    dbUsers.forEach((u) => {
      const docRef = collectionRef.doc(u.id);
      batch.set(
        docRef,
        {
          nid: u.NID || null,
          bin_vat: u.BINVAT || null,
          NID: FieldValue.delete(),
          BINVAT: FieldValue.delete(),
          files: {
            birthCertificate: u.uploadBirth || null,
            tin: u.uploadTin || null,
            nid: u.uploadNID || null,
            bin_vat: u.uploadVAT || null,
            tradeLicense: u.uploadTradeLicense || null,
            passport: u.uploadPassport || null,
            others: u.otherFiles || null,
          },
          uploadBirth: FieldValue.delete(),
          uploadTin: FieldValue.delete(),
          uploadNID: FieldValue.delete(),
          uploadVAT: FieldValue.delete(),
          uploadTradeLicense: FieldValue.delete(),
          uploadPassport: FieldValue.delete(),
          otherFiles: FieldValue.delete(),
        },
        { merge: true }
      );
    });
    await batch.commit();
  } catch (err) {
    console.log("err", err);
  } finally {
    //
  }
};

updateUsersFieldNames().then(() => process.exit(0));
