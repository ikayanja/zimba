import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { glass, theme } from "../constants/theme";

type Role = "homeowner" | "mason";

export default function ChooseRoleScreen({ navigation }: any) {
  const goToSignUp = (role: Role) => {
    navigation.navigate("SignUp", { role });
  };

  return (
    <LinearGradient colors={[theme.colors.bgTop, "#f6f6f2", theme.colors.bgBottom]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack?.()}>
        <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={styles.hero}>
        <View style={styles.kicker}>
          <View style={styles.kickerDot} />
          <Text style={styles.kickerText}>Choose your role</Text>
        </View>
        <Text style={styles.title}>How are you joining?</Text>
        <Text style={styles.subtitle}>Pick the experience that fits you best. You can tailor your profile after sign up.</Text>
      </View>

      <View style={styles.roleContainer}>
        <TouchableOpacity style={styles.roleButton} onPress={() => goToSignUp("homeowner")}>
          <View style={styles.roleHeader}>
            <Ionicons name="home-outline" size={20} color="#000000" />
            <Text style={styles.roleTitle}>Homeowner</Text>
          </View>
          <Text style={styles.roleDescription}>Post jobs, compare local masons, and hire the right person for the repair.</Text>
          <View style={styles.roleFooter}>
            <Text style={styles.roleCta}>Continue as homeowner</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.colors.text} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.roleButton} onPress={() => goToSignUp("mason")}>
          <View style={styles.roleHeader}>
            <Ionicons name="construct-outline" size={20} color={theme.colors.cyan} />
            <Text style={styles.roleTitle}>Mason</Text>
          </View>
          <Text style={styles.roleDescription}>Discover nearby work, send offers, and grow your reputation with completed jobs.</Text>
          <View style={styles.roleFooter}>
            <Text style={styles.roleCta}>Continue as mason</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.colors.text} />
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    backgroundColor: theme.colors.bgTop,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },
  hero: {
    marginTop: 18,
    marginBottom: 28,
  },
  kicker: {
    ...glass.soft,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: theme.radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  kickerDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.success,
  },
  kickerText: {
    color: theme.colors.textSoft,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    maxWidth: 260,
  },
  subtitle: {
    marginTop: 10,
    color: theme.colors.textSoft,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 310,
  },
  roleContainer: {
    gap: 14,
  },
  roleButton: {
    ...glass.card,
    borderRadius: theme.radius.lg,
    padding: 18,
  },
  roleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  roleTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  roleDescription: {
    marginTop: 12,
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  roleFooter: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roleCta: {
    color: theme.colors.text,
    fontWeight: "600",
  },
});
