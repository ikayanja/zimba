import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { fetchJobsForRole, fetchNearbyMasons } from "../services/firebase/firestore";
import MasonCard from "../components/common/MasonCard";
import { useAuth } from "../hooks/useAuth";
import JobCard from "../components/common/JobCard";
import type { Job, UserProfile } from "../utils/types";

export default function HomeScreen({ navigation }: any) {
  const [masons, setMasons] = useState<UserProfile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user, profile, role } = useAuth();

  useEffect(() => {
    const currentLocation = { lat: 0, lng: 0 }; // use geolocation hook
    if (role === "mason" && user) {
      fetchJobsForRole("mason", user.uid).then(setJobs);
      return;
    }

    fetchNearbyMasons(currentLocation).then(setMasons);
  }, [role, user]);

  const renderHomeownerView = () => (
    <>
      <TouchableOpacity onPress={() => navigation.navigate("PostJob")} style={{ marginTop: 12, padding: 12, backgroundColor: "#0055ff", borderRadius: 10 }}>
        <Text style={{ color: "white", textAlign: "center" }}>Post a Job</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 20, fontSize: 18 }}>Nearby Masons</Text>
      <FlatList data={masons} keyExtractor={(item) => item.id} renderItem={({ item }) => <MasonCard mason={item} />} />
    </>
  );

  const renderMasonView = () => (
    <>
      <Text style={{ marginTop: 20, fontSize: 18 }}>Open Jobs Nearby</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() =>
              navigation.navigate("JobChat", {
                chatId: `job-${item.id}`,
                title: item.title,
              })
            }
          />
        )}
      />
    </>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Welcome back{profile?.name ? `, ${profile.name}` : ""}</Text>
      <Text style={{ marginTop: 6, color: "#667085" }}>{role === "mason" ? "Review available jobs and respond fast." : "Find trusted local masons for your next repair."}</Text>
      {role === "mason" ? renderMasonView() : renderHomeownerView()}
    </View>
  );
}
