import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { fetchJobsForRole } from "../services/supabase/data";
import { useAuth } from "../hooks/useAuth";
import { glass, theme } from "../constants/theme";
import type { Job } from "../utils/types";

export default function JobsScreen({ navigation }: any) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user, role } = useAuth();

  useEffect(() => {
    if (!role) return;
    const load = async () => setJobs(await fetchJobsForRole(role, user?.uid));
    load();
  }, [role, user]);

  return (
    <LinearGradient colors={[theme.colors.bgTop, "#f6f6f2", theme.colors.bgBottom]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(job) => job.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.topBar}>
              <View>
                <Text style={styles.kicker}>Job board</Text>
                <Text style={styles.heading}>{role === "mason" ? "Available jobs" : "My posted jobs"}</Text>
              </View>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="options-outline" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              {role === "mason" ? "Watch new requests, compare budgets, and jump into conversations fast." : "Track what you posted and open each job conversation from one place."}
            </Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={styles.summaryValue}>{jobs.length}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Open</Text>
                <Text style={styles.summaryValue}>{jobs.filter((job) => job.status === "open").length}</Text>
              </View>
            </View>
          </>
        }
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
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.cardBody} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="wallet-outline" size={15} color={theme.colors.textMuted} />
                <Text style={styles.metaText}>{item.budget || "Budget not set"}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="chatbubble-outline" size={15} color={theme.colors.textMuted} />
                <Text style={styles.metaText}>Open chat</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No jobs yet.</Text>}
      />
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
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
    marginBottom: 18,
  },
  summaryCard: {
    ...glass.card,
    flex: 1,
    borderRadius: theme.radius.lg,
    padding: 16,
  },
  summaryLabel: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  summaryValue: {
    marginTop: 8,
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  card: {
    ...glass.card,
    borderRadius: theme.radius.lg,
    padding: 18,
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    paddingRight: 12,
  },
  statusPill: {
    ...glass.soft,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
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
  metaRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  emptyText: {
    color: theme.colors.textMuted,
    textAlign: "center",
    marginTop: 20,
  },
});
