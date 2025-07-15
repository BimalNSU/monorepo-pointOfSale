import { useEffect } from "react";
import { getAuth, onIdTokenChanged } from "firebase/auth";
import useAuthStore from "@/stores/auth.store";

export const useFirebaseAuthListener = () => {
  const { userId, user, session, updateStore, resetStore } = useAuthStore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        updateStore({ user: firebaseUser });

        // //only for testing
        // const token = await firebaseUser.getIdToken();
        // console.log("✅ ID token changed/refreshed:", token);
      } else {
        if (userId && session && user) {
          resetStore(); //auto clear local auth
        }
        console.log("X, logout");
      }
    });

    return () => unsubscribe();
  }, []);
};
