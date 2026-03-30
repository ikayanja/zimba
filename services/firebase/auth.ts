import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const registerUser = async (data: { email: string; password: string; role: "homeowner" | "mason"; name: string; phone: string; location: string; avatar?: string }) => {
  const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
  await updateProfile(user, { displayName: data.name, photoURL: data.avatar || "" });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => signOut(auth);
export const getCurrentUser = () => auth.currentUser;
