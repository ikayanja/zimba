import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

export default function AuthLoadingScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 12 }}>Checking authentication ...</Text>
    </View>
  );
}
