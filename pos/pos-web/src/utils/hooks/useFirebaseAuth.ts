import { getAuth, signOut } from "firebase/auth";
import useAuthStore2 from "@/stores/auth2.store";
import { apiProvider } from "../ApiProvider/ApiProvider";
import { ActiveSession, User } from "@pos/shared-models";
import { useNavigate } from "react-router-dom";

export const useFirebaseAuth = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const {
    userId,
    firstName,
    lastName,
    shopRoles,
    session,
    user,
    isLoggingOut,
    updateStore,
    resetStore,
  } = useAuthStore2();

  const clearAuth = async () => {
    resetStore(true); //clear local auth
    await signOut(auth);
    navigate("/login", { replace: true });
    resetStore();
  };
  const logout = async () => {
    try {
      const token = await user?.getIdToken();
      if (token) {
        const tempAuthStore = {
          userId,
          firstName,
          lastName,
          shopRoles: { ...shopRoles },
          session: { ...session },
          user: { ...user },
        };
        resetStore(true);
        const res = await apiProvider.removeSession(tempAuthStore.session?.id, token);
        if (res?.status === 200) {
          await signOut(auth);
          navigate("/login", { replace: true });
          resetStore();
        } else {
          updateStore({ ...Object(tempAuthStore) }); //restore previous auth data
          throw new Error(res?.statusText);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getToken = async () => {
    return user ? user.getIdToken() : null;
  };
  const updateUserInfo = async (dbUser: User) => {
    if (!dbUser) {
      return await clearAuth();
    }
    const newUpdates: Partial<Pick<User, "firstName" | "lastName" | "shopRoles">> = {};
    if (firstName !== dbUser.firstName) {
      newUpdates.firstName = dbUser.firstName;
    }
    if (lastName !== dbUser.lastName) {
      newUpdates.lastName = dbUser.lastName;
    }

    const numOfNewShopRoles = Object.keys(dbUser.shopRoles ?? {}).length;
    const numOfCurrentShopRoles = Object.keys(shopRoles ?? {}).length;
    if (
      (!numOfCurrentShopRoles || !numOfNewShopRoles) &&
      numOfCurrentShopRoles !== numOfNewShopRoles
    ) {
      newUpdates.shopRoles = dbUser.shopRoles;
    } else if (numOfCurrentShopRoles && numOfNewShopRoles) {
      const condition1 =
        numOfCurrentShopRoles &&
        shopRoles &&
        Object.entries(dbUser.shopRoles ?? {}).every(
          ([shopId, shopRole]) => shopRoles[shopId] === shopRole,
        );
      const condition2 =
        numOfNewShopRoles &&
        Object.entries(shopRoles ?? {}).every(
          ([shopId, shopRole]) => dbUser.shopRoles![shopId] === shopRole,
        );
      if (!condition1 || !condition2) {
        newUpdates.shopRoles = dbUser.shopRoles;
      }
    }
    if (Object.keys(newUpdates).length) {
      updateStore({ ...newUpdates });
    }
  };
  const updateSessionInfo = async (dbSession: ActiveSession) => {
    if (!dbSession) {
      return await clearAuth();
    }
    const newUpdates = Object({ ...(session ?? {}) });
    if (newUpdates.role !== dbSession.role) {
      newUpdates.role = dbSession.role;
    }
    if (newUpdates.shopId !== dbSession.shopId) {
      newUpdates.shopId = dbSession.shopId;
    }
    if (newUpdates.shopRole !== dbSession.shopRole) {
      newUpdates.shopRole = dbSession.shopRole;
    }
    if (Object.keys(newUpdates).length) {
      updateStore({ session: newUpdates });
    }
  };
  return {
    userId,
    firstName,
    lastName,
    shopRoles,
    user,
    session,
    isLoggingOut,
    updateStore,
    resetStore,
    getToken,
    logout,
    updateUserInfo,
    updateSessionInfo,
  };
};
