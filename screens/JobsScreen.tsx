import { FlatList, View, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { fetchJobsForRole } from "../services/firebase/firestore";
import { useAuth } from "../hooks/useAuth";
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
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20 }}>{role === "mason" ? "Available Jobs" : "My Posted Jobs"}</Text>
      <FlatList
        data={jobs}
        keyExtractor={(job) => job.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 12, borderWidth: 1, borderRadius: 8, marginTop: 8 }}
            onPress={() =>
              navigation.navigate("JobChat", {
                chatId: `job-${item.id}`,
                title: item.title,
              })
            }
          >
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Budget: {item.budget || "N/A"}</Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
