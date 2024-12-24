import React from "react";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { Spin } from "antd";
import { COLLECTIONS } from "@/constants/collections";
import { useParams } from "react-router-dom";
import { doc } from "firebase/firestore";
import ResidentialPropertyDetails from "@/components/Property/PropertyDetails/ResidentialPropetyDetails";
import CommercialpropertyDetails from "@/components/Property/PropertyDetails/CommercialPropetyDetails";

const PropertyDetails = () => {
  const { userId, role } = useCustomAuth();
  const firestore = useFirestore();
  const params = useParams();
  const { id: propertyId } = params;
  const propertyDocRef = doc(firestore, COLLECTIONS.properties, propertyId);
  const { status, data } = useFirestoreDocData(propertyDocRef);

  if (status === "loading") {
    return (
      <div className={"spin"}>
        <Spin size="large" />
      </div>
    );
  }
  return data.type === "residential" ? (
    <ResidentialPropertyDetails propertyData={data} authUserId={userId} authRole={role} />
  ) : data.type === "commercial" ? (
    <CommercialpropertyDetails propertyData={data} authUserId={userId} authRole={role} />
  ) : null;
};

export default PropertyDetails;
