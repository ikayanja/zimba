import React from "react";
import { create } from "zustand";
import { getCurrentUser } from "../services/supabase/auth";
import { mapSupabaseUser, supabase } from "../services/supabase/config";
import { getUserProfile } from "../services/supabase/data";
import type { UserProfile } from "../utils/types";
import type { AppUser } from "../services/supabase/config";

type AuthState = {
  user: AppUser | null;
  profile: UserProfile | null;
  initializing: boolean;
  setAuthState: (user: AppUser | null, profile: UserProfile | null) => void;
  updateProfileState: (updates: Partial<UserProfile>) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  initializing: true,
  setAuthState: (user, profile) => set({ user, profile, initializing: false }),
  updateProfileState: (updates) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, ...updates }
        : state.user
          ? {
              id: state.user.uid,
              name: state.user.displayName || "",
              email: state.user.email || "",
              phone: "",
              location: "",
              role: (updates.role as UserProfile["role"]) || "homeowner",
              ...updates,
            }
          : state.profile,
    })),
}));

export const useAuth = () => {
  const { user, profile, initializing, setAuthState, updateProfileState } = useAuthStore();

  React.useEffect(() => {
    const syncCurrentUser = async () => {
      const user = await getCurrentUser();

      if (!user) {
        setAuthState(null, null);
        return;
      }

      const mappedUser = mapSupabaseUser(user);
      const nextProfile = await getUserProfile(mappedUser.uid);
      setAuthState(mappedUser, nextProfile);
    };

    syncCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setAuthState(null, null);
        return;
      }

      const mappedUser = mapSupabaseUser(session.user);
      const nextProfile = await getUserProfile(mappedUser.uid);
      setAuthState(mappedUser, nextProfile);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuthState]);

  return { user, profile, role: profile?.role ?? null, initializing, updateProfileState };
};
