import React from "react";
import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../services/firebase/firebaseConfig";
import { getUserProfile } from "../services/firebase/firestore";
import type { UserProfile } from "../utils/types";

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  initializing: boolean;
  setAuthState: (user: User | null, profile: UserProfile | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  initializing: true,
  setAuthState: (user, profile) => set({ user, profile, initializing: false }),
}));

export const useAuth = () => {
  const { user, profile, initializing, setAuthState } = useAuthStore();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setAuthState(null, null);
        return;
      }

      const nextProfile = await getUserProfile(firebaseUser.uid);
      setAuthState(firebaseUser, nextProfile);
    });

    return unsubscribe;
  }, [setAuthState]);

  return { user, profile, role: profile?.role ?? null, initializing };
};
