import { getAuth, signOut } from "firebase/auth";
import useAuthStore from "@/stores/auth.store";
import { apiProvider } from "../ApiProvider/ApiProvider";
import { ActiveSession, User, WithId } from "@pos/shared-models";
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
    isLoadingAuth,
    isLoggingOut,
    updateStore,
    resetStore,
  } = useAuthStore();

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
  const updateAuth = async (data: { user: User; session: ActiveSession }) => {
    if (!data.user || !data.session) {
      return await clearAuth();
    }

    //check update for user
    const newUpdates: Partial<
      Pick<User, "firstName" | "lastName" | "shopRoles"> & {
        session: WithId<Pick<ActiveSession, "role" | "shopId" | "shopRole">>;
        isLoadingAuth: boolean;
      }
    > = {};
    if (firstName !== data.user.firstName) {
      newUpdates.firstName = data.user.firstName;
    }
    if (lastName !== data.user.lastName) {
      newUpdates.lastName = data.user.lastName;
    }

    const numOfNewShopRoles = Object.keys(data.user.shopRoles ?? {}).length;
    const numOfCurrentShopRoles = Object.keys(shopRoles ?? {}).length;
    if (
      (!numOfCurrentShopRoles || !numOfNewShopRoles) &&
      numOfCurrentShopRoles !== numOfNewShopRoles
    ) {
      newUpdates.shopRoles = data.user.shopRoles;
    } else if (numOfCurrentShopRoles && numOfNewShopRoles) {
      const condition1 =
        numOfCurrentShopRoles &&
        shopRoles &&
        Object.entries(data.user.shopRoles ?? {}).every(
          ([shopId, shopRole]) => shopRoles[shopId] === shopRole,
        );
      const condition2 =
        numOfNewShopRoles &&
        Object.entries(shopRoles ?? {}).every(
          ([shopId, shopRole]) => data.user.shopRoles![shopId] === shopRole,
        );
      if (!condition1 || !condition2) {
        newUpdates.shopRoles = data.user.shopRoles;
      }
    }

    /*# region update of session data */

    const newSessionUpdates: WithId<Pick<ActiveSession, "role" | "shopId" | "shopRole">> = Object({
      ...(session ?? {}),
    });
    if (newSessionUpdates.role !== data.session.role) {
      newSessionUpdates.role = data.session.role;
    }
    if (newSessionUpdates.shopId !== data.session.shopId) {
      newSessionUpdates.shopId = data.session.shopId;
    }
    if (newSessionUpdates.shopRole !== data.session.shopRole) {
      newSessionUpdates.shopRole = data.session.shopRole;
    }
    if (Object.keys(newSessionUpdates).length) {
      newUpdates.session = newSessionUpdates;
    }
    if (isLoadingAuth) {
      newUpdates.isLoadingAuth = undefined; //it removes from auth
    }
    if (Object.keys(newUpdates).length) {
      updateStore({ ...newUpdates });
    }
  };
  return {
    userId,
    firstName,
    lastName,
    shopRoles,
    user,
    session,
    isLoadingAuth,
    isLoggingOut,
    updateStore,
    resetStore,
    getToken,
    logout,
    updateAuth,
  };
};
