import { View, Text, Pressable, StyleSheet, Image } from "react-native";

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
  container: { flexDirection: "row", borderRadius: 12, borderWidth: 1, padding: 12, marginVertical: 8, backgroundColor: "#fff" },
  textWrapper: { flex: 1, paddingRight: 8 },
  title: { fontWeight: "600", fontSize: 16 },
  meta: { marginTop: 6, color: "#555" },
  image: { width: 50, height: 50, borderRadius: 25 },
});