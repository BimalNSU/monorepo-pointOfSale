import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User } from "firebase/auth";
import {
  ActiveSession,
  ActiveSessionId,
  User as UserModel,
  UserId,
  ShopId,
  ShopRole,
} from "@pos/shared-models";

type SessionType = Pick<ActiveSession, "role" | "shopId" | "shopRole"> & {
  id: ActiveSessionId;
};
type UpdateData = Pick<UserModel, "firstName" | "lastName" | "shopRoles"> & {
  userId: string;
  session: SessionType;
  user: User;
  isLoadingAuth?: boolean;
};
interface AuthState {
  userId: UserId | null;
  firstName: string | null;
  lastName?: string | null;
  shopRoles?: Record<ShopId, ShopRole> | null;
  session?: SessionType;
  user: User | null;
  updateStore: (data: Partial<UpdateData>) => void;
  resetStore: (isLoggingOut?: boolean) => void;
  isLoadingAuth?: boolean;
  isLoggingOut?: boolean;
}
const initialState = {
  userId: undefined,
  firstName: undefined,
  lastName: undefined,
  shopRoles: undefined,
  session: undefined,
  user: undefined,
  isLoadingAuth: undefined, //only use after logging attempt once
  isLoggingOut: undefined, //only use during logging out
};

const useAuthStore = create<AuthState>()(
  persist(
    devtools(
      (set, get) => ({
        ...initialState,
        updateStore: (data) => {
          const currentState = get();
          set({
            ...data,
            ...(currentState.isLoggingOut && { isLoggingOut: undefined }),
          }); // partial update
        },
        resetStore: (isLoggingOut?: boolean) => {
          set({ ...initialState, ...(isLoggingOut && { isLoggingOut }) });
          // localStorage.clear(); // hard reset
        },
      }),
      { name: "auth2" }, // 👈 store name for DevTools
    ),
    { name: "auth22" },
  ),
);
export default useAuthStore;
