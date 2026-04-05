import React from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../hooks/useAuth";
import { logout, updateAuthProfile } from "../services/supabase/auth";
import { updateUserProfileFields, uploadProfileAvatar } from "../services/supabase/data";
import { glass, theme } from "../constants/theme";

const formatCurrencyStat = (role: "homeowner" | "mason" | null) => {
  return role === "mason" ? "$12.4K earned" : "$3.8K spent";
};

const getInitials = (name?: string) => {
  if (!name) return "FM";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default function ProfileScreen() {
  const { user, profile, role, updateProfileState } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftName, setDraftName] = React.useState(profile?.name || "");
  const [draftLocation, setDraftLocation] = React.useState(profile?.location || "");
  const [draftDescription, setDraftDescription] = React.useState(profile?.description || "");
  const [avatarUrl, setAvatarUrl] = React.useState(profile?.avatar || "");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setDraftName(profile?.name || "");
    setDraftLocation(profile?.location || "");
    setDraftDescription(profile?.description || "");
    setAvatarUrl(profile?.avatar || "");
  }, [profile?.description, profile?.location, profile?.name, profile?.avatar]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert("Logout failed", (error as Error).message);
    }
  };

  const handlePickAvatar = async () => {
    if (!user) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo library access to update your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;

    try {
      setSaving(true);
      const avatarUrl = await uploadProfileAvatar(user.uid, result.assets[0].uri);
      await updateUserProfileFields(user.uid, { avatar: avatarUrl });
      await updateAuthProfile({ avatar_url: avatarUrl, name: draftName || profile?.name || user.displayName || "" });
      setAvatarUrl(avatarUrl);
      updateProfileState({ avatar: avatarUrl });
    } catch (error) {
      Alert.alert("Profile photo failed", (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const nextName = draftName.trim();
    const nextLocation = draftLocation.trim();
    const nextDescription = draftDescription.trim();

    if (!nextName) {
      Alert.alert("Validation", "Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      await updateUserProfileFields(user.uid, {
        name: nextName,
        location: nextLocation,
        description: nextDescription,
      });
      await updateAuthProfile({
        name: nextName,
        avatar_url: avatarUrl || profile?.avatar || user.photoURL || "",
      });
      updateProfileState({
        name: nextName,
        location: nextLocation,
        description: nextDescription,
        avatar: avatarUrl || profile?.avatar,
      });
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Profile update failed", (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: "Jobs", value: role === "mason" ? "28" : "14" },
    { label: role === "mason" ? "Rating" : "Completed", value: role === "mason" ? "4.9" : "11" },
    { label: role === "mason" ? "Earnings" : "Budget", value: formatCurrencyStat(role) },
  ];
  const aboutEmail = profile?.email || user?.email || "Not set";
  const aboutPhone = profile?.phone || "Not set";
  const aboutLocation = draftLocation || profile?.location || "Set your location";
  const profileDescription =
    draftDescription ||
    profile?.description ||
    (role === "mason"
      ? `Helping homeowners with ${profile?.skills?.join(", ").toLowerCase() || "repairs"} and clean finishes across the city.`
      : "Booking trusted repair help fast and keeping every project moving smoothly.");

  return (
    <LinearGradient colors={[theme.colors.bgTop, "#f6f6f2", theme.colors.bgBottom]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={18} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.followChip}>
              <Text style={styles.followText}>{role === "mason" ? "Available" : "Homeowner"}</Text>
              <Ionicons name="checkmark" size={16} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.avatar}>
          <TouchableOpacity onPress={handlePickAvatar} disabled={saving} activeOpacity={0.85} style={styles.avatarTouch}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <LinearGradient colors={["#c9f4a3", "#97e56f"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatarGradient}>
                <Text style={styles.avatarText}>{getInitials(profile?.name)}</Text>
              </LinearGradient>
            )}
            <View style={styles.avatarEditBadge}>
              <Ionicons name="camera-outline" size={14} color={theme.colors.text} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.identityBlock}>
          <View style={styles.nameRow}>
            {isEditing ? (
              <TextInput
                value={draftName}
                onChangeText={setDraftName}
                placeholder="Your name"
                placeholderTextColor={theme.colors.textMuted}
                style={styles.nameInput}
              />
            ) : (
              <>
                <Text style={styles.name}>{profile?.name || user?.displayName || "Profile"}</Text>
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.plum} />
              </>
            )}
          </View>
          <Text style={styles.handle}>@{(profile?.name || "fixmate").toLowerCase().replace(/\s+/g, "")} · {role === "mason" ? "Mason" : "Homeowner"}</Text>
          <View style={styles.editActions}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={styles.secondaryAction}
                  onPress={() => {
                    setDraftName(profile?.name || "");
                    setDraftLocation(profile?.location || "");
                    setDraftDescription(profile?.description || "");
                    setAvatarUrl(profile?.avatar || "");
                    setIsEditing(false);
                  }}
                >
                  <Text style={styles.secondaryActionText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryAction} onPress={handleSaveProfile} disabled={saving}>
                  <Text style={styles.primaryActionText}>{saving ? "Saving..." : "Save profile"}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.primaryAction} onPress={() => setIsEditing(true)}>
                <Text style={styles.primaryActionText}>Edit profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.statRow}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statItem}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {isEditing ? (
          <View style={styles.editCard}>
            <Text style={styles.editLabel}>Description</Text>
            <TextInput
              value={draftDescription}
              onChangeText={setDraftDescription}
              placeholder="Tell people about yourself"
              placeholderTextColor={theme.colors.textMuted}
              multiline
              style={styles.descriptionInput}
            />
          </View>
        ) : (
          <Text style={styles.bio}>{profileDescription}</Text>
        )}

        <View style={styles.tabRow}>
          <Text style={[styles.tabText, styles.tabTextActive]}>Profile</Text>
          <Text style={styles.tabText}>Activity</Text>
          <Text style={styles.tabText}>Stats</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{aboutEmail}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{aboutPhone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            {isEditing ? (
              <TextInput
                value={draftLocation}
                onChangeText={setDraftLocation}
                placeholder="Enter your location"
                placeholderTextColor={theme.colors.textMuted}
                style={styles.inlineInput}
              />
            ) : (
              <Text style={styles.infoValue}>{aboutLocation}</Text>
            )}
          </View>
        </View>

        {role === "mason" ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Trade profile</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoValue}>{profile?.experience || "Add experience"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Skills</Text>
              <Text style={styles.infoValue}>{profile?.skills?.join(", ") || "Add your skills"}</Text>
            </View>
            <View style={styles.infoRowLast}>
              <Text style={styles.infoLabel}>Portfolio</Text>
              <Text style={styles.infoValue}>{profile?.portfolio?.length || 0} items</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgBottom,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 120,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    ...glass.soft,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  followChip: {
    ...glass.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  followText: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: 15,
  },
  avatar: {
    marginBottom: 18,
  },
  avatarTouch: {
    width: 74,
    height: 74,
  },
  avatarGradient: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#08110f",
    fontSize: 24,
    fontWeight: "800",
  },
  avatarImage: {
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  avatarEditBadge: {
    ...glass.card,
    position: "absolute",
    right: -4,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  identityBlock: {
    marginBottom: 18,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    color: theme.colors.text,
    fontSize: 31,
    fontWeight: "800",
  },
  nameInput: {
    ...glass.card,
    flex: 1,
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "700",
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  handle: {
    marginTop: 8,
    color: theme.colors.textMuted,
    fontSize: 16,
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  editCard: {
    ...glass.card,
    borderRadius: theme.radius.lg,
    padding: 18,
    marginBottom: 24,
  },
  editLabel: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginBottom: 10,
  },
  primaryAction: {
    ...glass.card,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.emerald,
  },
  primaryActionText: {
    color: "#152210",
    fontWeight: "700",
  },
  secondaryAction: {
    ...glass.soft,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryActionText: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  statRow: {
    flexDirection: "row",
    marginBottom: 18,
    gap: 18,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    marginTop: 4,
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  bio: {
    color: theme.colors.textSoft,
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 24,
    maxWidth: 340,
  },
  tabRow: {
    flexDirection: "row",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    marginBottom: 18,
  },
  tabText: {
    color: theme.colors.textMuted,
    fontSize: 16,
    paddingBottom: 14,
    marginRight: 28,
  },
  tabTextActive: {
    color: theme.colors.text,
    borderBottomColor: theme.colors.emerald,
    borderBottomWidth: 2,
  },
  card: {
    ...glass.card,
    borderRadius: theme.radius.lg,
    padding: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  infoRowLast: {
    paddingVertical: 12,
  },
  infoLabel: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginBottom: 6,
  },
  infoValue: {
    color: theme.colors.textSoft,
    fontSize: 16,
    lineHeight: 22,
  },
  inlineInput: {
    ...glass.soft,
    color: theme.colors.text,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  descriptionInput: {
    ...glass.soft,
    minHeight: 120,
    color: theme.colors.text,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    lineHeight: 22,
    textAlignVertical: "top",
  },
});
