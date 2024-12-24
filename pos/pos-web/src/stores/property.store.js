import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { deleteUndefinedFromObj } from "@/utils/Utils/Utils";

let initialState = {
  propertyId: "",
  name: null,
  type: null,
  ownerIds: undefined,
  tenantIds: undefined,
};

let store = (set) => ({
  ...initialState,
  update: (data) => {
    const cleanData = { ...data };
    // deleteUndefinedFromObj(cleanData); // TODO: need to talk with faysal vai
    return set({ ...cleanData });
  },

  reset: () => set(initialState),
});

store = devtools(store);
store = persist(store, { name: "property" });

const usePropertyStore = create(store);

export default usePropertyStore;
