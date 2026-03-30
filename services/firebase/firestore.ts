import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { app } from "./firebaseConfig";
import type { ChatMessage, Job, UserProfile } from "../../utils/types";

const db = getFirestore(app);

export const jobsCollection = collection(db, "jobs");
export const usersCollection = collection(db, "users");

export const upsertUserProfile = async (profile: Omit<UserProfile, "createdAt">) => {
  await setDoc(
    doc(usersCollection, profile.id),
    {
      ...profile,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const getUserProfile = async (userId: string) => {
  const snapshot = await getDoc(doc(usersCollection, userId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as UserProfile;
};

export const createJob = async (job: Omit<Job, "id" | "createdAt">) => {
  const docRef = await addDoc(jobsCollection, { ...job, status: "open", createdAt: serverTimestamp() });
  return docRef.id;
};

export const fetchNearbyMasons = async (_location: { lat: number; lng: number }, _radiusKm = 20) => {
  // For production, use geohash library. This is placeholder.
  const q = query(usersCollection, where("role", "==", "mason"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as UserProfile[];
};

export const fetchJobsForRole = async (role: UserProfile["role"], userId?: string) => {
  const jobsQuery =
    role === "homeowner" && userId
      ? query(jobsCollection, where("homeownerId", "==", userId), orderBy("createdAt", "desc"))
      : query(jobsCollection, where("status", "==", "open"), orderBy("createdAt", "desc"));

  const snapshot = await getDocs(jobsQuery);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Job[];
};

export const listenMessages = (chatId: string, callback: (messages: ChatMessage[]) => void) => {
  const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })) as ChatMessage[]);
  });
};

export const sendMessage = (chatId: string, message: Omit<ChatMessage, "id" | "createdAt">) =>
  addDoc(collection(db, "chats", chatId, "messages"), { ...message, createdAt: serverTimestamp() });
