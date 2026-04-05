import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { registerUser } from "../services/supabase/auth";
import { upsertUserProfile } from "../services/supabase/data";
import { glass, theme } from "../constants/theme";

export default function SignUpScreen({ navigation, route }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const role = (route?.params?.role as "homeowner" | "mason" | undefined) ?? "homeowner";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRule = /^(?=.*[A-Z])(?=.*\d).{8}$/;

  const handleSignUp = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert("Validation", "All fields are required.");
      return;
    }

    if (!passwordRule.test(password)) {
      Alert.alert("Validation", "Password must be 8 characters and contain at least one capital letter and a number.");
      return;
    }

    setLoading(true);
    try {
      const user = await registerUser({
        name,
        email: email.trim().toLowerCase(),
        password,
        phone,
        location: "",
        role,
      });
      await upsertUserProfile({
        id: user.id,
        name,
        email: email.trim().toLowerCase(),
        phone,
        location: "",
        role,
        avatar: ((user.user_metadata?.avatar_url as string | undefined) ?? ""),
        skills: role === "mason" ? ["Plastering", "Bricklaying"] : [],
        experience: role === "mason" ? "2+ years" : "",
        portfolio: [],
      });
      Alert.alert("Success", "Account created. Please login.");
      navigation.navigate("SignIn");
    } catch (error) {
      Alert.alert("Sign up failed", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[theme.colors.bgTop, "#f6f6f2", theme.colors.bgBottom]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack?.()}>
            <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>

          <View style={styles.hero}>
            <View style={styles.kicker}>
              <View style={styles.kickerDot} />
              <Text style={styles.kickerText}>Build your profile</Text>
            </View>
            <Text style={styles.subtitleStandalone}>Book trusted repair help fast and keep every job moving.</Text>
          </View>

          <Text style={styles.label}>Full name</Text>
          <TextInput style={styles.input} placeholder="Your full name" value={name} onChangeText={setName} placeholderTextColor={theme.colors.textMuted} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={theme.colors.textMuted}
          />

          <Text style={styles.label}>Phone number</Text>
          <TextInput style={styles.input} placeholder="+256..." value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={theme.colors.textMuted} />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSoft} />
            <TextInput
              style={styles.passwordInput}
              placeholder="Create a password"
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              placeholderTextColor={theme.colors.textMuted}
              maxLength={8}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color={theme.colors.textSoft} />
            </TouchableOpacity>
          </View>
          <Text style={styles.passwordHint}>Password must be 8 characters and contain at least one capital letter and a number.</Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeLabel}>Signing up as</Text>
            <Text style={styles.roleBadgeValue}>{role === "mason" ? "Mason" : "Homeowner"}</Text>
          </View>

          <LinearGradient colors={[theme.colors.success, theme.colors.successDeep]} start={{ x: 0, y: 0.2 }} end={{ x: 1, y: 1 }} style={styles.button}>
            <TouchableOpacity style={styles.buttonInner} onPress={handleSignUp} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? "Creating account..." : "Create account"}</Text>
              <Ionicons name="arrow-forward" size={18} color="#152210" style={styles.buttonIcon} />
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity style={styles.linkWrap} onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.link}>Already have an account? Sign in</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            By continuing, you agree to our <Text style={styles.footerLink}>Terms of Service</Text> and <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgTop,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40,
    flexGrow: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },
  hero: {
    marginTop: 18,
    marginBottom: 18,
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
    backgroundColor: theme.colors.cyan,
  },
  kickerText: {
    color: theme.colors.textSoft,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  subtitle: {
    marginTop: 10,
    color: theme.colors.textSoft,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 290,
  },
  subtitleStandalone: {
    marginTop: 2,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.textSoft,
    maxWidth: 280,
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
  passwordHint: {
    marginTop: 8,
    color: theme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  roleBadge: {
    ...glass.card,
    marginTop: 10,
    marginBottom: 14,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roleBadgeLabel: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  roleBadgeValue: {
    color: theme.colors.success,
    fontWeight: "700",
  },
  button: {
    borderRadius: theme.radius.pill,
    marginTop: 8,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  buttonInner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  linkWrap: {
    marginTop: 20,
    alignSelf: "center",
  },
  link: {
    color: theme.colors.cyan,
    textAlign: "center",
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
