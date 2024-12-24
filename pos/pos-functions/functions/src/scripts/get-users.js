import { COLLECTIONS } from "../constants/collections";
import { db } from "../firebase";
import { writeFile } from "fs/promises";

const BASE_PATH = "./src/scripts/data";

const getUsers = async () => {
  const dbUsers = (await db.collection(COLLECTIONS.users).get()).docs.map(
    (doc) => ({ ...doc.data(), id: doc.id })
  );
  // const dbUsers = (await db.collection(COLLECTIONS.users).get()).docs.map(
  //   (doc) => doc.data()
  // );
  const usersJson = JSON.stringify(dbUsers);
  await writeFile(`${BASE_PATH}/${COLLECTIONS.users}.json`, usersJson);
};

getUsers().then(() => process.exit(0));
