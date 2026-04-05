import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { theme } from "../../constants/theme";

type JobCardProps = {
  job: any;
  onPress?: () => void;
};

export default function JobCard({ job, onPress }: JobCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{job.title}</Text>
        <Text numberOfLines={2}>{job.description}</Text>
        <Text style={styles.meta}>Budget: {job.budget || "Not set"}</Text>
      </View>
      {job.images?.[0] ? <Image style={styles.image} source={{ uri: job.images[0] }} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    marginVertical: 8,
    backgroundColor: theme.colors.surface,
  },
  textWrapper: { flex: 1, paddingRight: 8 },
  title: { fontWeight: "600", fontSize: 16, color: theme.colors.text },
  meta: { marginTop: 6, color: theme.colors.textMuted },
  image: { width: 70, height: 70, borderRadius: 8 },
});
