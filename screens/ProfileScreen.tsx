import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function ProfileScreen() {
  const { profile, role } = useAuth();

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>{profile?.name || "Profile"}</Text>
      <Text style={{ marginTop: 8 }}>Role: {role || "Unknown"}</Text>
      <Text style={{ marginTop: 8 }}>Email: {profile?.email || "N/A"}</Text>
      <Text style={{ marginTop: 8 }}>Phone: {profile?.phone || "N/A"}</Text>
      <Text style={{ marginTop: 8 }}>Location: {profile?.location || "Set your location"}</Text>
      {role === "mason" ? <Text style={{ marginTop: 8 }}>Skills: {profile?.skills?.join(", ") || "Add your skills"}</Text> : null}
    </View>
  );
}
