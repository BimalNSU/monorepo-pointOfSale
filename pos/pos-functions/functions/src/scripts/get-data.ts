import { COLLECTIONS } from "../constants/collections";
import { db } from "../firebase";
import { writeFile } from "fs/promises";

const BASE_PATH = "./src/scripts/data";

const getData = async () => {
  const configurations = (
    await db.collection(COLLECTIONS.configurations).get()
  ).docs.map((doc) => doc.data());
  const commonBillConfigs = (
    await db.collection(COLLECTIONS.commonBillConfigurations).get()
  ).docs.map((doc) => doc.data());
  const configCommonBills = (
    await db.collection(COLLECTIONS.configCommonBills).get()
  ).docs.map((doc) => doc.data());

  const configurationsJson = JSON.stringify(configurations);
  const commonBillConfigsJson = JSON.stringify(commonBillConfigs);
  const configCommonBillsJson = JSON.stringify(configCommonBills);

  await writeFile(
    `${BASE_PATH}/${COLLECTIONS.configurations}.json`,
    configurationsJson
  );
  await writeFile(
    `${BASE_PATH}/${COLLECTIONS.commonBillConfigurations}.json`,
    commonBillConfigsJson
  );
  await writeFile(
    `${BASE_PATH}/${COLLECTIONS.configCommonBills}.json`,
    configCommonBillsJson
  );
};

getData().then(() => process.exit(0));
