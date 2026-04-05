import { supabase } from "./config";
import type { ChatMessage, Job, UserProfile } from "../../utils/types";

const normalizeProfile = (row: Record<string, unknown>): UserProfile => ({
  id: String(row.id),
  name: String(row.name || ""),
  email: String(row.email || ""),
  phone: String(row.phone || ""),
  location: String(row.location || ""),
  description: typeof row.description === "string" ? row.description : "",
  avatar: typeof row.avatar === "string" ? row.avatar : "",
  role: (row.role as UserProfile["role"]) || "homeowner",
  skills: Array.isArray(row.skills) ? (row.skills as string[]) : [],
  experience: typeof row.experience === "string" ? row.experience : "",
  portfolio: Array.isArray(row.portfolio) ? (row.portfolio as string[]) : [],
  createdAt: row.created_at,
});

const normalizeJob = (row: Record<string, unknown>): Job => ({
  id: String(row.id),
  title: String(row.title || ""),
  description: String(row.description || ""),
  budget: typeof row.budget === "string" ? row.budget : "",
  images: Array.isArray(row.images) ? (row.images as string[]) : [],
  location: {
    lat: Number(row.location_lat || 0),
    lng: Number(row.location_lng || 0),
  },
  homeownerId: String(row.homeowner_id || ""),
  status: (row.status as Job["status"]) || "open",
  createdAt: row.created_at,
});

const normalizeMessage = (row: Record<string, unknown>): ChatMessage => ({
  id: String(row.id),
  text: String(row.text || ""),
  senderId: String(row.sender_id || ""),
  senderName: String(row.sender_name || ""),
  image: typeof row.image === "string" ? row.image : "",
  createdAt: row.created_at,
});

export const upsertUserProfile = async (profile: Omit<UserProfile, "createdAt">) => {
  const payload = {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    description: profile.description || "",
    avatar: profile.avatar || "",
    role: profile.role,
    skills: profile.skills || [],
    experience: profile.experience || "",
    portfolio: profile.portfolio || [],
  };

  const { error } = await supabase.from("users").upsert(payload);
  if (error) throw error;
};

export const updateUserProfileFields = async (userId: string, updates: Partial<Omit<UserProfile, "id" | "createdAt">>) => {
  const payload = {
    ...(updates.name !== undefined ? { name: updates.name } : {}),
    ...(updates.email !== undefined ? { email: updates.email } : {}),
    ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
    ...(updates.location !== undefined ? { location: updates.location } : {}),
    ...(updates.description !== undefined ? { description: updates.description } : {}),
    ...(updates.avatar !== undefined ? { avatar: updates.avatar } : {}),
    ...(updates.role !== undefined ? { role: updates.role } : {}),
    ...(updates.skills !== undefined ? { skills: updates.skills } : {}),
    ...(updates.experience !== undefined ? { experience: updates.experience } : {}),
    ...(updates.portfolio !== undefined ? { portfolio: updates.portfolio } : {}),
  };

  const { error } = await supabase.from("users").upsert({ id: userId, ...payload });
  if (error) throw error;
};

const uriToArrayBuffer = async (uri: string) => {
  const response = await fetch(uri);
  return response.arrayBuffer();
};

export const uploadProfileAvatar = async (userId: string, imageUri: string) => {
  const extension = imageUri.split(".").pop()?.split("?")[0] || "jpg";
  const path = `${userId}-${Date.now()}.${extension}`;
  const file = await uriToArrayBuffer(imageUri);

  const { error } = await supabase.storage.from("avatars").upload(path, file, {
    contentType: `image/${extension === "jpg" ? "jpeg" : extension}`,
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data ? normalizeProfile(data) : null;
};

export const createJob = async (job: Omit<Job, "id" | "createdAt">) => {
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      title: job.title,
      description: job.description,
      budget: job.budget || "",
      images: job.images,
      location_lat: job.location.lat,
      location_lng: job.location.lng,
      homeowner_id: job.homeownerId,
      status: job.status || "open",
    })
    .select("id")
    .single();

  if (error) throw error;
  return String(data.id);
};

export const fetchNearbyMasons = async (_location: { lat: number; lng: number }, _radiusKm = 20) => {
  const { data, error } = await supabase.from("users").select("*").eq("role", "mason");
  if (error) throw error;
  return (data || []).map((row) => normalizeProfile(row));
};

export const fetchJobsForRole = async (role: UserProfile["role"], userId?: string) => {
  let query = supabase.from("jobs").select("*").order("created_at", { ascending: false });

  query = role === "homeowner" && userId ? query.eq("homeowner_id", userId) : query.eq("status", "open");

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((row) => normalizeJob(row));
};

export const listenMessages = (chatId: string, callback: (messages: ChatMessage[]) => void) => {
  const loadMessages = async () => {
    const { data, error } = await supabase.from("messages").select("*").eq("chat_id", chatId).order("created_at", { ascending: true });
    if (error) return;
    callback((data || []).map((row) => normalizeMessage(row)));
  };

  loadMessages();

  const channel = supabase
    .channel(`messages:${chatId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` }, loadMessages)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const sendMessage = async (chatId: string, message: Omit<ChatMessage, "id" | "createdAt">) => {
  const { error } = await supabase.from("messages").insert({
    chat_id: chatId,
    text: message.text,
    sender_id: message.senderId,
    sender_name: message.senderName,
    image: message.image || "",
  });

  if (error) throw error;
};
