import { supabase } from "./config";

type RegisterInput = {
  email: string;
  password: string;
  role: "homeowner" | "mason";
  name: string;
  phone: string;
  location: string;
  avatar?: string;
};

const requireUser = <T extends { user: unknown | null }>(payload: T) => {
  if (!payload.user) {
    throw new Error("Authentication did not return a user.");
  }

  return payload.user as {
    id: string;
    email?: string | null;
    user_metadata?: Record<string, unknown> | null;
  };
};

export const registerUser = async (data: RegisterInput) => {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        avatar_url: data.avatar || "",
        role: data.role,
      },
    },
  });

  if (error) throw error;
  return requireUser(authData);
};

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

export const updateAuthProfile = async (updates: { name?: string; avatar_url?: string }) => {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      ...(updates.name ? { name: updates.name } : {}),
      ...(updates.avatar_url ? { avatar_url: updates.avatar_url } : {}),
    },
  });

  if (error) throw error;
  return data.user;
};
