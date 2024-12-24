// import { useState, useEffect } from 'react'
import { collection, doc, addDoc, updateDoc, query, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useAuth, useFirestoreDocData } from "reactfire";
import moment from "moment";
import { useParams } from "react-router-dom";

class CustomQuery {
  authUserId = useAuth().currentUser.uid;
  firestore = useFirestore();
  // propertyCollectionRef = collection(this.firestore, 'testPropertiesByBimal')
  propertyCollectionRef = collection(this.firestore, "properties");
  ownerUnitsRef = collection(this.firestore, "ownerUnits");
  // usersCollectionRef = collection(this.firestore, 'testUsersByBimal')
  usersCollectionRef = collection(this.firestore, "users");
  // constructor(){}
  getCurrentPropertyData = () => {
    const q = query(this.propertyCollectionRef, where("managerUid", "==", this.authUserId));
    const { status, data } = useFirestoreCollectionData(q);
    return new Promise(
      (resolve) => {
        if (status === "success") {
          resolve(data); // return data
        }
      },
      (reject) => {
        if (status === "reject") {
          reject(status);
        }
      },
    );
  };
  getVacantUnitsOfProperty = () => {
    const q = query(this.propertyCollectionRef, where("managerUid", "==", this.authUserId));
    const { status: propertyDataStatus, data: propertyData } = useFirestoreCollectionData(q);
    const { status: ownerUnitsStatus, data: ownerUnitsData } = useFirestoreCollectionData(
      this.ownerUnitsRef,
    );

    return new Promise(
      (resolve) => {
        if (propertyDataStatus === "success" && ownerUnitsStatus === "success") {
          if (propertyData.length) {
            const vacantUnits = propertyData[0].residential.filter((unit) =>
              ownerUnitsData.findIndex(
                (assignedUnit) =>
                  assignedUnit.unitId === unit.unitId &&
                  !assignedUnit.isDeleted &&
                  assignedUnit.isRentable,
              ) === -1
                ? unit
                : null,
            );
            resolve(vacantUnits); // return data
          }
        }
      },
      (reject) => {
        if (propertyDataStatus === "reject" || ownerUnitsStatus === "reject") {
          reject(
            `propertyDataStatus: ${propertyDataStatus}; ownerUnitsStatus: ${ownerUnitsStatus}`,
          );
        }
      },
    );
  };
  // asyncCall = async () => {
  //     console.log('async function calling');
  //     const data = await this.getVacantUnitsOfAssignedProperty()
  //     console.log(data);
  //     return data
  // }
  // getData = () => {
  //     this.asyncCall()
  //     return this.data
  // }

  assignUnitToOwner = async (ownerId, unitId) => {
    const ownerUnitsRef = collection(this.firestore, "ownerUnits");
    const currentDateTime = moment().format().toString();
    const doc = await addDoc(ownerUnitsRef, {
      ownerId: ownerId,
      unitId: unitId,
      addedBy: this.authUserId,
      createdAt: currentDateTime,
    });
    return doc;
  };
  getOccupiedUnitsOfProperty = () => {
    // const propertyCollectionRef = collection(this.firestore, 'properties')
    const q = query(this.propertyCollectionRef, where("managerUid", "==", this.authUserId));
    const { status, data: propertyData } = useFirestoreCollectionData(q);
    // const ownerUnitsRef = collection(this.firestore, 'ownerUnits')
    const { status: ownerUnitsStatus, data: ownerUnitsData } = useFirestoreCollectionData(
      this.ownerUnitsRef,
    );
    return new Promise(
      (resolve) => {
        if (status === "success" && ownerUnitsStatus === "success") {
          if (propertyData.length) {
            const occupiedUnits = propertyData[0].residential.filter((unit) =>
              ownerUnitsData.findIndex(
                (occupiedUnit) =>
                  occupiedUnit.unitId === unit.unitId &&
                  !occupiedUnit.isDeleted &&
                  occupiedUnit.isRentable,
              ) === -1
                ? null
                : unit,
            );
            resolve(occupiedUnits); // return data
          }
        }
      },
      (reject) => {
        if (status === "reject") {
          reject(status);
        }
      },
    );
  };
  getOccupiedUnitsOfSpecificUserOfProperty = () => {
    // const propertyCollectionRef = collection(this.firestore, 'properties')
    // const params = useParams()
    // const ownerDocId = params.id
    const q = query(this.propertyCollectionRef, where("managerUid", "==", this.authUserId));
    const { status: propertyStatus, data: propertyData } = useFirestoreCollectionData(q);
    const ownerUnitsRef = collection(this.firestore, "ownerUnits");

    const ownerDocId = "frJBpLtYczDbuNBbF4fA";
    // const userDocRef = doc(this.firestore, 'users')
    // const { status: userProfileStatus, data: userProfileData } = useFirestoreDocData(userDocRef) // useFirestoreDocData() takes more time then useFirestoreCollectionData()
    const userDocRef = collection(this.firestore, "users");
    const q3 = query(userDocRef, where("role", "==", "owner"));
    const { status: userProfileStatus, data: userProfileData2 } = useFirestoreCollectionData(q3);

    // const q2 = query(this.ownerUnitsRef, where("ownerId", "==", ownerId))
    const { status: ownerUnitsStatus, data: ownerUnitsData } =
      useFirestoreCollectionData(ownerUnitsRef);
    return new Promise(
      (resolve) => {
        if (
          userProfileStatus === "success" &&
          propertyStatus === "success" &&
          ownerUnitsStatus === "success"
        ) {
          // const ownerId = userProfileData.uid
          const ownerInfo = userProfileData2.find((item) => item.NO_ID_FIELD === ownerDocId);
          const ownerId = ownerInfo.uid;

          const occupiedUnitsOfSpecificOwner = ownerUnitsData.filter(
            (unit) => unit.ownerId === ownerId,
          );
          if (propertyData.length) {
            const occupiedUnits = propertyData[0].residential.filter((unit) =>
              occupiedUnitsOfSpecificOwner.findIndex(
                (occupiedUnit) =>
                  occupiedUnit.unitId === unit.unitId &&
                  !occupiedUnit.isDeleted &&
                  occupiedUnit.isRentable,
              ) === -1
                ? null
                : unit,
            );
            resolve(occupiedUnits); // return data
          }
        }
      },
      (reject) => {
        if (propertyStatus === "reject") {
          reject(propertyStatus);
        }
      },
    );
  };
  getOccupiedUnitsWithOwnerInfo = () => {
    // const propertyCollectionRef = collection(this.firestore, 'properties')
    const params = useParams();
    const ownerDocId = params.id;
    const q = query(this.propertyCollectionRef, where("managerUid", "==", this.authUserId));
    const { status: propertyStatus, data: propertyData } = useFirestoreCollectionData(q);
    const ownerUnitsRef = collection(this.firestore, "ownerUnits");

    // const ownerDocId ="frJBpLtYczDbuNBbF4fA"
    // const userDocRef = doc(this.firestore, 'users')
    // const { status: userProfileStatus, data: userProfileData } = useFirestoreDocData(userDocRef) // useFirestoreDocData() takes more time then useFirestoreCollectionData()
    const userDocRef = collection(this.firestore, "users");
    const q3 = query(userDocRef, where("role", "==", "owner"));
    const { status: userProfileStatus, data: userProfileData2 } = useFirestoreCollectionData(q3);

    // const q2 = query(this.ownerUnitsRef, where("ownerId", "==", ownerId))
    const { status: ownerUnitsStatus, data: ownerUnitsData } =
      useFirestoreCollectionData(ownerUnitsRef);
    return new Promise(
      (resolve) => {
        if (
          userProfileStatus === "success" &&
          propertyStatus === "success" &&
          ownerUnitsStatus === "success"
        ) {
          // const ownerId = userProfileData.uid
          const ownerInfo = userProfileData2.find((item) => item.NO_ID_FIELD === ownerDocId);
          const ownerId = ownerInfo.uid;

          const occupiedUnitsOfSpecificOwner = ownerUnitsData.filter(
            (unit) => unit.ownerId === ownerId,
          );
          if (propertyData.length) {
            const occupiedUnits = propertyData[0].residential.filter((unit) =>
              occupiedUnitsOfSpecificOwner.findIndex(
                (occupiedUnit) =>
                  occupiedUnit.unitId === unit.unitId &&
                  !occupiedUnit.isDeleted &&
                  occupiedUnit.isRentable,
              ) === -1
                ? null
                : unit,
            );
            resolve({
              currentPropertyId: propertyData[0].NO_ID_FIELD,
              ownerInfo: ownerInfo,
              occupiedUnits: occupiedUnits,
            }); // return data
          }
        }
      },
      (reject) => {
        if (propertyStatus === "reject") {
          reject(propertyStatus);
        }
      },
    );
  };
  unassignUnitFromOwner = async (documentId) => {
    const ownerUnitsRef = doc(this.firestore, "ownerUnits", documentId);
    const result = await updateDoc(ownerUnitsRef, { deleted: true });
    return result;
  };
  addOwner = async (data) => {
    const userDocRef = doc(this.firestore, "testUsersByBimal");
    await addDoc(userDocRef, { ...data });
  };
  updateOwner = async (documentId, newData) => {
    const userDocRef = doc(this.firestore, "testUsersByBimal", documentId);
    await updateDoc(userDocRef, { ...newData });
  };
  getOwnerListWithOccupiedUnits = () => {
    const q = query(this.propertyCollectionRef, where("managerUid", "==", this.authUserId));
    const { status: propertyDataStatus, data: propertyData } = useFirestoreCollectionData(q);
    const q2 = query(this.usersCollectionRef, where("role", "==", "owner"));
    const { status: getOwnerProfileDataStatus, data: ownerProfileData } =
      useFirestoreCollectionData(q2);
    const { status, data: ownerUnits } = useFirestoreCollectionData(this.ownerUnitsRef);
    return new Promise((resolve, reject) => {
      if (
        propertyDataStatus === "success" &&
        getOwnerProfileDataStatus === "success" &&
        status === "success"
      ) {
        if (propertyData.length && ownerProfileData.length) {
          const ownerList = ownerProfileData.map((owner) => {
            const occupiedUnitIds = ownerUnits
              .filter((item) => item.ownerId === owner.uid && !item.deleted)
              .map((item) => item.unitId);
            const copyOwner = { ...owner };
            delete copyOwner.NO_ID_FIELD;
            copyOwner.userDocRefId = owner.NO_ID_FIELD; // change "NO_ID_FIELD" field name to "userDocRefId"
            if (occupiedUnitIds.length) {
              return {
                ...copyOwner,
                occupiedUnits: propertyData[0].residential
                  .filter((unit) => (occupiedUnitIds.includes(unit.unitId) ? unit : null))
                  .map((unit) => unit.unitNo)
                  .join(","),
              };
            } else {
              return {
                ...copyOwner,
                occupiedUnits: "N/A",
              };
            }
          });
          resolve(ownerList); // return data
        }
      } else if (getOwnerProfileDataStatus === "reject") {
        reject(getOwnerProfileDataStatus);
      }
    });
  };
}
export default CustomQuery;
