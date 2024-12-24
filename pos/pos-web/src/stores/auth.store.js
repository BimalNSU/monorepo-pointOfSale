import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { deleteUndefinedFromObj } from "@/utils/Utils/Utils";

let initialState = {
  //note: undefined fields' values help to delete those fields when the 'reset()' function will be called
  isLoggedIn: false,
  currentLoginType: "id", // "id", "email", "mobile"
  token: undefined, // it can be idToken for admin or accessToken those are login with customToken id
  refreshToken: undefined,
  expirationTime: undefined,
  // uid: "SOMEIMPOSSIBLEID123",
  id: "",
  role: undefined,
  name: undefined,
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  mobile: undefined,
  user: undefined,
  // user: {},
};

let store = (set) => ({
  ...initialState,
  update: (data) => {
    // const {
    //   token,
    //   userId,
    //   currentLoginType,
    //   role,
    //   isLoggedIn,
    //   // user,
    //   ...others
    // } = data;
    const cleanData = { ...data };
    deleteUndefinedFromObj(cleanData);
    // const d = { ...cleanData };
    return set({ ...cleanData });
  },

  // reset: () => set(initialState),
  reset: () => {
    set(initialState);
    // localStorage.clear(); // hard reset
  },
});

store = devtools(store);
store = persist(store, { name: "auth" });

const useAuthStore = create(store);

export default useAuthStore;
