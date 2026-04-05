import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { loginUser } from "../services/supabase/auth";
import { glass, theme } from "../constants/theme";

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<"email" | "phone">("email");

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await loginUser(email.trim().toLowerCase(), password);
    } catch (error) {
      Alert.alert("Login failed", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onSocialPress = (provider: string) => {
    Alert.alert(`${provider} sign in`, "Social sign in is not connected yet.");
  };

  return (
    <LinearGradient colors={[theme.colors.bgTop, "#f6f6f2", theme.colors.bgBottom]} start={{ x: 0.05, y: 0 }} end={{ x: 0.95, y: 1 }} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack?.()}>
        <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={styles.hero}>
        <View style={styles.kicker}>
          <View style={styles.kickerDot} />
          <Text style={styles.kickerText}>Trusted Mason Marketplace</Text>
        </View>
        <Text style={styles.subtitle}>Book trusted repair help fast and keep every job moving.</Text>
      </View>

      <View style={styles.modeTabs}>
        <TouchableOpacity style={[styles.modeChip, loginMode === "phone" && styles.modeChipActive]} onPress={() => setLoginMode("phone")}>
          <Text style={[styles.modeText, loginMode === "phone" && styles.modeTextActive]}>Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.modeChip, loginMode === "email" && styles.modeChipActive]} onPress={() => setLoginMode("email")}>
          <Text style={[styles.modeText, loginMode === "email" && styles.modeTextActive]}>Email</Text>
        </TouchableOpacity>
      </View>

      {loginMode === "phone" ? (
        <View style={styles.phoneRow}>
          <TouchableOpacity style={styles.countryPill} onPress={() => Alert.alert("Coming soon", "Country picker is not connected yet.")}>
            <Text style={styles.countryText}>UG (+256)</Text>
            <Ionicons name="chevron-down" size={16} color={theme.colors.textSoft} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.phoneField} onPress={() => Alert.alert("Coming soon", "Phone login is not connected yet.")}>
            <Text style={styles.placeholderText}>Phone number</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@example.com"
            keyboardType="email-address"
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            placeholderTextColor={theme.colors.textMuted}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSoft} />
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              onChangeText={setPassword}
              value={password}
              placeholderTextColor={theme.colors.textMuted}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color={theme.colors.textSoft} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.resetRow} onPress={() => Alert.alert("Reset password", "Password reset is not connected yet.")}>
            <Text style={styles.resetText}>Forgot password? </Text>
            <Text style={styles.resetLink}>Reset it</Text>
          </TouchableOpacity>
        </>
      )}

      <LinearGradient colors={[theme.colors.success, theme.colors.successDeep]} start={{ x: 0, y: 0.2 }} end={{ x: 1, y: 1 }} style={styles.button}>
        <TouchableOpacity style={styles.buttonInner} onPress={handleSignIn} disabled={loading || loginMode !== "email"}>
          <Text style={styles.buttonText}>{loading ? "Logging in..." : "Continue"}</Text>
          <Ionicons name="arrow-forward" size={18} color="#152210" style={styles.buttonIcon} />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.socialButton} onPress={() => onSocialPress("Apple")}>
        <FontAwesome name="apple" size={22} color={theme.colors.text} />
        <Text style={styles.socialText}>Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={() => onSocialPress("Google")}>
        <AntDesign name="google" size={20} color={theme.colors.text} />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkWrap} onPress={() => navigation.navigate("ChooseRole")}>
        <Text style={styles.link}>Create account</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        By continuing, you agree to our <Text style={styles.footerLink}>Terms of Service</Text> and <Text style={styles.footerLink}>Privacy Policy</Text>
      </Text>
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
    marginBottom: 24,
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
  subtitle: {
    marginTop: 2,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.textSoft,
    maxWidth: 280,
  },
  modeTabs: {
    flexDirection: "row",
    marginBottom: 18,
    gap: 10,
  },
  modeChip: {
    ...glass.card,
    borderRadius: theme.radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  modeChipActive: {
    backgroundColor: "rgba(31, 36, 24, 0.08)",
    borderColor: theme.colors.borderStrong,
  },
  modeText: {
    fontSize: 15,
    color: theme.colors.textMuted,
    fontWeight: "600",
  },
  modeTextActive: {
    color: "#000000",
  },
  phoneRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  countryPill: {
    ...glass.card,
    minHeight: 58,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  countryText: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  phoneField: {
    ...glass.card,
    flex: 1,
    minHeight: 58,
    borderRadius: theme.radius.md,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    ...glass.card,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontSize: 16,
    color: theme.colors.text,
  },
  placeholderText: {
    color: theme.colors.textMuted,
    fontSize: 16,
  },
  passwordWrapper: {
    ...glass.card,
    marginTop: 2,
    borderRadius: theme.radius.md,
    minHeight: 58,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  resetRow: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 22,
  },
  resetText: {
    color: theme.colors.textMuted,
    fontSize: 15,
  },
  resetLink: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "700",
  },
  button: {
    borderRadius: theme.radius.pill,
    marginTop: 4,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  buttonText: {
    color: "#152210",
    fontWeight: "700",
    fontSize: 17,
  },
  buttonIcon: {
    marginTop: 1,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  dividerText: {
    textAlign: "center",
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  socialButton: {
    ...glass.card,
    borderRadius: theme.radius.pill,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  socialText: {
    marginLeft: 18,
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  linkWrap: {
    marginTop: 20,
    alignSelf: "center",
  },
  link: {
    textAlign: "center",
    color: theme.colors.cyan,
    fontWeight: "600",
  },
  footer: {
    marginTop: "auto",
    paddingBottom: 22,
    textAlign: "center",
    color: theme.colors.textMuted,
    lineHeight: 22,
  },
  footerLink: {
    color: theme.colors.textSoft,
    textDecorationLine: "underline",
  },
});
