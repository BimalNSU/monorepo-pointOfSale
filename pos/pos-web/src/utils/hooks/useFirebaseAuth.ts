import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import useAuthStore from "@/stores/auth.store";
import { apiProvider } from "../ApiProvider/ApiProvider";
import { Session as SessionModel, User, WithId } from "@pos/shared-models";
import { useNavigate } from "react-router-dom";
import { Session } from "@/db-collections/session.collections";
import { useFirestore } from "reactfire";

export const useFirebaseAuth = () => {
  const auth = getAuth();
  const db = useFirestore();
  const sessionObj = new Session(db);
  const navigate = useNavigate();
  const {
    userId,
    firstName,
    lastName,
    shopRoles,
    session,
    user,
    isLoggingIn,
    isLoggingOut,
    updateStore,
    resetStore,
  } = useAuthStore();

  const login = async (data: { loginWith: string; password: string }, reCaptchaToken: string) => {
    const res = await apiProvider.login(data, reCaptchaToken);
    if (!res) {
      throw new Error(`Unable to connect server`);
    }
    if (res.status === 200) {
      // const userData = { ...res.data.userData, currentLoginType };
      const { accessToken, sessionId, userData } = res.data;
      const signInResult = await signInWithCustomToken(auth, accessToken);
      updateStore(
        Object({ userId: signInResult.user.uid, session: { id: sessionId }, isLoggingIn: true }),
      );
    } else {
      throw new Error(res?.data?.error);
    }
  };
  const clearAuth = async () => {
    resetStore(true); //clear local auth
    navigate("/login", { replace: true });
    await signOut(auth);
    resetStore();
  };
  const logout = async () => {
    if (session) {
      const tempAuthStore = {
        userId,
        firstName,
        lastName,
        shopRoles: { ...shopRoles },
        session,
        user,
      };
      try {
        resetStore(true);
        //Note: following lines must be in order
        await sessionObj.delete(session.id);
        navigate("/login", { replace: true });
        await signOut(auth);
        resetStore();
      } catch (e) {
        updateStore({ ...Object(tempAuthStore) }); //restore previous auth data
        console.log(e);
      }
    }
  };
  const getToken = async () => {
    return user ? user.getIdToken() : null;
  };
  const updateAuth = async (dbUser?: User, dbSession?: WithId<SessionModel>) => {
    if (!dbUser || !dbSession) {
      return await clearAuth();
    }

    //check update for user
    const newUpdates: Partial<
      Pick<User, "firstName" | "lastName" | "shopRoles"> & {
        session: WithId<Pick<SessionModel, "role" | "shopId" | "shopRole">>;
        isLoggingIn?: boolean;
      }
    > = {};
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

    /*# region update of session data */

    const newSessionUpdates: WithId<Pick<SessionModel, "role" | "shopId" | "shopRole">> = Object();
    if (session?.role !== dbSession.role) {
      newSessionUpdates.role = dbSession.role;
    }
    if (session?.shopId !== dbSession.shopId) {
      newSessionUpdates.shopId = dbSession.shopId;
    }
    if (session?.shopRole !== dbSession.shopRole) {
      newSessionUpdates.shopRole = dbSession.shopRole;
    }
    if (Object.keys(newSessionUpdates).length) {
      newUpdates.session = { ...newSessionUpdates, id: dbSession.id };
    }
    if (isLoggingIn) {
      newUpdates.isLoggingIn = undefined; //it removes from auth
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
    isLoggingIn,
    isLoggingOut,
    updateStore,
    resetStore,
    getToken,
    login,
    logout,
    updateAuth,
  };
};
