import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export const mapSupabaseUser = (user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}): AppUser => ({
  uid: user.id,
  email: user.email ?? null,
  displayName: (user.user_metadata?.name as string | undefined) ?? null,
  photoURL: (user.user_metadata?.avatar_url as string | undefined) ?? null,
});
