export type UserRole = "homeowner" | "mason";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  role: UserRole;
  skills?: string[];
  experience?: string;
  portfolio?: string[];
  createdAt?: unknown;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  budget?: string;
  images: string[];
  location: {
    lat: number;
    lng: number;
  };
  homeownerId: string;
  status: "open" | "assigned" | "completed";
  createdAt?: unknown;
};

export type ChatMessage = {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  image?: string;
  createdAt?: unknown;
};
