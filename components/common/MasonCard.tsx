import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { theme } from "../../constants/theme";

type MasonCardProps = {
  mason: any;
  onPress?: () => void;
};

export default function MasonCard({ mason, onPress }: MasonCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{mason.name || "Mason"}</Text>
        <Text numberOfLines={2}>{mason.skills?.join(", ") || "General repairs"}</Text>
        <Text style={styles.meta}>Experience: {mason.experience || "N/A"}</Text>
      </View>
      {mason.avatar ? <Image style={styles.image} source={{ uri: mason.avatar }} /> : null}
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
  image: { width: 50, height: 50, borderRadius: 25 },
});
