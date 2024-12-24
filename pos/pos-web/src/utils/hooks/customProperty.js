import usePropertyStore from "../../stores/property.store";
import _ from "lodash";

export const useCustomProperty = () => {
  // Store
  const propertyId = usePropertyStore((state) => state.propertyId);
  const name = usePropertyStore((state) => state.name);
  const type = usePropertyStore((state) => state.type);
  const ownerIds = usePropertyStore((state) => state.ownerIds);
  const tenantIds = usePropertyStore((state) => state.tenantIds);

  const updateStore = usePropertyStore((state) => state.update);
  const resetStore = usePropertyStore((state) => state.reset);

  const requestForUpdate = (newPropertyData, role) => {
    if (!newPropertyData) return;

    const updatableData = {};
    //when propertyId is changed
    if (newPropertyData.propertyId && newPropertyData.propertyId !== propertyId) {
      updatableData.propertyId = newPropertyData.propertyId;
    }
    if (newPropertyData.name && newPropertyData.name !== name) {
      updatableData.name = newPropertyData.name;
    }
    if (newPropertyData.type && newPropertyData.type !== type) {
      updatableData.type = newPropertyData.type;
    }
    if (role === "manager") {
      const updatableOwnerIds = getUpdatableOwnerIds(newPropertyData);
      if (updatableOwnerIds) {
        updatableData.ownerIds = updatableOwnerIds;
      }
      const updatableTenantIds = getUpdatableTenantIds(newPropertyData);
      if (updatableTenantIds) {
        updatableData.tenantIds = updatableTenantIds;
      }
    } else {
      updatableData.ownerIds = undefined; // removing field
      updatableData.tenantIds = undefined; // removing field
    }
    updateStore(updatableData);
  };
  const getUpdatableOwnerIds = (newPropertyData) => {
    const residentialOwnerIds = newPropertyData.residentialOwnerIds || [];
    const parkingOwnerIds = newPropertyData.parkingOwnerIds || [];

    const shopOwnerIds = newPropertyData.shopOwnerIds || [];
    const newUniqueOwnerIds = [
      ...new Set([...residentialOwnerIds, ...parkingOwnerIds, ...shopOwnerIds]),
    ];
    if (
      !ownerIds ||
      newUniqueOwnerIds.length !== ownerIds.length ||
      !newUniqueOwnerIds.every((newOwnerId) => ownerIds.includes(newOwnerId))
    ) {
      return newUniqueOwnerIds;
    }
    return undefined;
  };
  const getUpdatableTenantIds = (newPropertyData) => {
    const newTenantIds = newPropertyData.agreementedTenantIds || [];
    if (
      !tenantIds ||
      newTenantIds.length !== tenantIds.length ||
      !newTenantIds.every((newTenantId) => tenantIds.includes(newTenantId))
    ) {
      return newTenantIds;
    }
    return undefined;
  };
  return {
    propertyId,
    name,
    type,
    ownerIds,
    tenantIds,
    requestForUpdate,
    resetStore,
  };
};
