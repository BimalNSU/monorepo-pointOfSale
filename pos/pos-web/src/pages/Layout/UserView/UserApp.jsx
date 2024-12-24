import { Route, BrowserRouter, useHistory, Switch } from "react-router-dom";
// firebase
import { collection, getFirestore } from "firebase/firestore";
// import { ref, listAll, getStorage } from "@firebase/storage"

import {
  FirestoreProvider,
  useSigninCheck,
  useAuth,
  useFirebaseApp,
  StorageProvider,
  useStorage,
  useStorageDownloadURL,
  useStorageTask,
  useFirestore,
  useFirestoreCollectionData,
} from "reactfire";
import "firebase/storage";
import { uploadBytesResumable, getStorage } from "firebase/storage";

import UserSettings from "./UserSettings";
import UserSettingsChangePassword from "./UserSettingsChangePassword";
import SelfProfileView from "./UserProfile/View/SelfProfileView";
import SelfProfileEdit from "./UserProfile/Edit/SelfProfileEdit";
import { Spin } from "antd";
import { useCustomProperty } from "@/utils/hooks/customProperty";

const UserApp = () => {
  // const app = props.app;
  // const userData = props.userData;
  // getting owner property ids
  // const propertyId = props.userData.verifyOnPropertyIds?.map((propertyId) => {
  //   if (!propertyId?.isDeleted) return propertyId.id;
  // })[0];
  const { propertyId } = useCustomProperty();
  // const firestore = useFirestore();
  // const propertyCollectionRef = collection(firestore, COLLECTIONS.properties);
  // const { status, data } = useFirestoreCollectionData(propertyCollectionRef, propertyId);
  // if (status === "loading") {
  //   return (
  //     <div className={`spin`}>
  //       <Spin size="large" />
  //     </div>
  //   );
  // }
  return (
    <Switch>
      {/* <StorageProvider sdk={getStorage(app)}> */}
      {/* <Route path={`/${userData.role}/profile`} exact component={Profile} /> */}
      {/* <Route path={`/${userData.role}/profile`} exact component={OwnerProfile} />
      <Route path={`/${userData.role}/profile/edit/:id`} exact component={EditProfile} /> */}
      {/* </StorageProvider> */}

      <Route path="/profile/view" exact component={SelfProfileView} />
      <Route path="/profile/edit" exact component={SelfProfileEdit} />

      <Route path="/settings" exact component={UserSettings} />
      <Route path="/settings/change-password" exact component={UserSettingsChangePassword} />
    </Switch>
  );
};
export default UserApp;
