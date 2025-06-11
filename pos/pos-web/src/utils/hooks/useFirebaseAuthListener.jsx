import { useEffect } from "react";
import { getAuth, onIdTokenChanged } from "firebase/auth";
import useAuthStore2 from "@/stores/auth2.store";

export const useFirebaseAuthListener = () => {
  const { userId, user, updateStore, resetStore } = useAuthStore2();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        updateStore({ user: firebaseUser, ...(!userId && { userId: firebaseUser.uid }) });

        // //only for testing
        // const token = await firebaseUser.getIdToken();
        // console.log("✅ ID token changed/refreshed:", token);
      } else {
        // resetStore(); //auto clear local auth
        console.log("X, logout");
      }
    });

    return () => unsubscribe();
  }, []);
};
