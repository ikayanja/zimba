import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { fetchJobsForRole, fetchNearbyMasons } from "../services/supabase/data";
import { useAuth } from "../hooks/useAuth";
import { glass, theme } from "../constants/theme";
import type { Job, UserProfile } from "../utils/types";

export default function HomeScreen({ navigation }: any) {
  const [masons, setMasons] = useState<UserProfile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user, profile, role } = useAuth();

  useEffect(() => {
    const currentLocation = { lat: 0, lng: 0 };
    if (role === "mason" && user) {
      fetchJobsForRole("mason", user.uid).then(setJobs);
      return;
    }

    fetchNearbyMasons(currentLocation).then(setMasons);
  }, [role, user]);

  const header = (
    <>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.kicker}>FixMate</Text>
          <Text style={styles.heading}>Welcome back{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search-outline" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        {role === "mason" ? "Review fresh repair requests and reply before anyone else does." : "Find reliable masons nearby and post your next repair in minutes."}
      </Text>

      <View style={styles.heroCard}>
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.heroLabel}>{role === "mason" ? "Available today" : "Active requests"}</Text>
            <Text style={styles.heroValue}>{role === "mason" ? jobs.length || 0 : masons.length || 0}</Text>
          </View>
          <View style={styles.heroPill}>
            <Ionicons name={role === "mason" ? "flash-outline" : "construct-outline"} size={16} color={theme.colors.text} />
            <Text style={styles.heroPillText}>{role === "mason" ? "Live jobs" : "Trusted pros"}</Text>
          </View>
        </View>
        <Text style={styles.heroCopy}>
          {role === "mason" ? "Stay sharp on new jobs, budgets, and response windows in your area." : "Browse skilled tradespeople with real profiles before you commit."}
        </Text>
        {role === "homeowner" ? (
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("PostJob")}>
            <Text style={styles.primaryButtonText}>Post a job</Text>
            <Ionicons name="arrow-forward" size={18} color="#152210" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{role === "mason" ? "Open jobs nearby" : "Nearby masons"}</Text>
        <Text style={styles.sectionMeta}>{role === "mason" ? jobs.length : masons.length} items</Text>
      </View>
    </>
  );

  return (
    <LinearGradient colors={[theme.colors.bgTop, "#f6f6f2", theme.colors.bgBottom]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      {role === "mason" ? (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={header}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("JobChat", {
                  chatId: `job-${item.id}`,
                  title: item.title,
                })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.cardBody} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardMeta}>Budget {(item.budget || "N/A").toString()}</Text>
                <Ionicons name="arrow-forward" size={18} color={theme.colors.textMuted} />
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={masons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={header}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name || "Mason"}</Text>
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.emerald} />
              </View>
              <Text style={styles.cardBody} numberOfLines={2}>
                {item.skills?.join(", ") || "General repairs"}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardMeta}>Experience {item.experience || "N/A"}</Text>
                <Ionicons name="arrow-forward" size={18} color={theme.colors.textMuted} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
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
  },
  kicker: {
    color: theme.colors.emerald,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  heading: {
    marginTop: 10,
    color: theme.colors.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    maxWidth: 280,
  },
  iconButton: {
    ...glass.soft,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    marginTop: 12,
    color: theme.colors.textSoft,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 330,
  },
  heroCard: {
    ...glass.card,
    marginTop: 24,
    borderRadius: theme.radius.xl,
    padding: 20,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroLabel: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  heroValue: {
    marginTop: 6,
    color: theme.colors.text,
    fontSize: 34,
    fontWeight: "800",
  },
  heroPill: {
    ...glass.soft,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroPillText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  heroCopy: {
    marginTop: 16,
    color: theme.colors.textSoft,
    fontSize: 15,
    lineHeight: 23,
  },
  primaryButton: {
    marginTop: 18,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.emerald,
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#152210",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionHeader: {
    marginTop: 26,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  sectionMeta: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  card: {
    ...glass.card,
    borderRadius: theme.radius.lg,
    padding: 18,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
    paddingRight: 10,
  },
  badge: {
    ...glass.soft,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: theme.colors.emerald,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  cardBody: {
    marginTop: 12,
    color: theme.colors.textSoft,
    fontSize: 15,
    lineHeight: 22,
  },
  cardFooter: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardMeta: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
});
