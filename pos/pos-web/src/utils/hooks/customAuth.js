import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import { useEffect } from "react";
import { useSigninCheck } from "reactfire";
import useAuthStore from "../../stores/auth.store";
// import _ from "lodash";
import axios from "axios";

export const useCustomAuth = () => {
  // Store
  const token = useAuthStore((state) => state.token);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const expirationTime = useAuthStore((state) => state.expirationTime);
  const userId = useAuthStore((state) => state.id);
  const currentLoginType = useAuthStore((state) => state.currentLoginType);
  const firstName = useAuthStore((state) => state.firstName);
  const lastName = useAuthStore((state) => state.lastName);
  const role = useAuthStore((state) => state.role);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const user = useAuthStore((state) => state.user);
  const updateStore = useAuthStore((state) => state.update);
  const resetStore = useAuthStore((state) => state.reset);

  // Firebase
  const auth = getAuth();
  //   const storage = useStorage();
  //   const firestore = useFirestore();

  const { status: signInCheckStatus, data: signInCheckResult } = useSigninCheck();

  // Check for firebase login, reset if not
  useEffect(() => {
    if (signInCheckStatus === "success") {
      if (token && signInCheckResult && !signInCheckResult.signedIn) {
        // // if (role && role !== "admin") {
        // if (!isAdmin) {
        //   // firebaseLogin(customToken)
        //   //   .then((data) => {
        //   //     // console.log(data)
        //   //   })
        //   //   .catch((err) => {
        //   //     console.error(err);
        //   //     resetStore();
        //   //   });
        // } else {
        //   // If admin
        //   // resetStore();
        // }
      } else if (!token && signInCheckResult && signInCheckResult.signedIn) {
        signOut(auth);
      }
    }
  }, [token, signInCheckResult, signInCheckStatus, role]);

  const getToken = async () => {
    if (!user) {
      return null;
    }
    if (!refreshToken || !expirationTime) {
      return null;
    }
    const now = Date.now();
    if (now < expirationTime - 5 * 60 * 1000) {
      return token;
    } else {
      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", refreshToken);
      try {
        const res = await axios.post(
          // `https://securetoken.googleapis.com/v1/token?key=${process.env.REACT_APP_apiKey}`,
          `https://securetoken.googleapis.com/v1/token?key=${import.meta.env.VITE_apiKey}`,
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );
        const { access_token, expires_in } = res.data;
        const nToken = access_token;
        const nExpirationTime = now + expires_in * 1000;
        updateStore({ token: nToken, expirationTime: nExpirationTime });
        return nToken;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    // return await user.getIdToken();
  };

  const firebaseLogin = async (token) => {
    const user = (await signInWithCustomToken(auth, token)).user;
    // const idToken = await user.getIdToken();
    // console.log("idToken", idToken);
    return user;
  };

  const requestToUpdate = (newUserData) => {
    if (!newUserData) return;
    // eslint-disable-next-line no-constant-condition
    if (newUserData.refreshToken !== refreshToken && false) {
      //TODO: will be remove 'false' key word in the next phase
      resetStore();
    } else {
      const updatableData = {};
      if (newUserData.firstName !== firstName) {
        updatableData.firstName = newUserData.firstName;
      }
      if (newUserData.lastName !== lastName) {
        updatableData.lastName = newUserData.lastName;
      }
      if (role !== newUserData.role) {
        updatableData.role = newUserData.role;
      }
      updateStore(updatableData);
    }
  };

  const loginWithCustomToken = async (customToken, userData) => {
    try {
      const result = await signInWithCustomToken(auth, customToken);
      const nUser = result.user;
      // const accessToken = nUser.accessToken;
      const { currentLoginType, id, role, firstName, lastName, mobile, email } = userData;
      const updatableData = {
        currentLoginType,
        id,
        role,
        firstName,
        lastName,
        email,
        mobile,
      };
      login(updatableData, nUser);
    } catch (error) {
      console.error(error);
    }
  };
  const login = (userData, user) => {
    const token = user.accessToken;
    const refreshToken = user.stsTokenManager?.refreshToken;
    const expirationTime = user.stsTokenManager?.expirationTime;
    const updatableData = {
      ...userData,
      isLoggedIn: true,
      token,
      refreshToken,
      expirationTime,
      user,
    };

    updateStore(updatableData);
  };

  const logout = async () => {
    await signOut(auth);
    resetStore();
  };

  return {
    signInCheckResult,
    signInCheckStatus,
    isLoggedIn,
    // token,
    refreshToken,
    expirationTime,
    getToken,
    userId,
    role,
    firstName,
    lastName,
    currentLoginType,
    login,
    loginWithCustomToken,
    logout,
    updateStore,
    requestToUpdate,
  };
};
