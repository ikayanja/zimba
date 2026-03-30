import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { loginUser } from "../services/firebase/auth";

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
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack?.()}>
        <Ionicons name="arrow-back" size={22} color="#111827" />
      </TouchableOpacity>

      <Text style={styles.title}>Log in</Text>

      <View style={styles.modeTabs}>
        <TouchableOpacity style={styles.modeTab} onPress={() => setLoginMode("email")}>
          <Text style={[styles.modeText, loginMode === "email" && styles.modeTextActive]}>Email</Text>
          {loginMode === "email" ? <View style={styles.modeUnderline} /> : null}
        </TouchableOpacity>
        <TouchableOpacity style={styles.modeTab} onPress={() => setLoginMode("phone")}>
          <Text style={[styles.modeText, loginMode === "phone" && styles.modeTextActive]}>Phone number</Text>
          {loginMode === "phone" ? <View style={styles.modeUnderline} /> : null}
        </TouchableOpacity>
      </View>

      {loginMode === "email" ? (
        <>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@example.com"
            keyboardType="email-address"
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Phone number</Text>
          <TouchableOpacity style={styles.inputDisabled} onPress={() => Alert.alert("Coming soon", "Phone login is not connected yet.")}>
            <Text style={styles.placeholderText}>Phone login coming soon</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#111827" />
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
          <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.resetRow} onPress={() => Alert.alert("Reset password", "Password reset is not connected yet.")}>
        <Text style={styles.resetText}>Forgot password? </Text>
        <Text style={styles.resetLink}>Reset it</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading || loginMode !== "email"}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Log in"}</Text>
      </TouchableOpacity>

      <Text style={styles.dividerText}>or</Text>

      <TouchableOpacity style={styles.socialButton} onPress={() => onSocialPress("Apple")}>
        <FontAwesome name="apple" size={22} color="#111827" />
        <Text style={styles.socialText}>Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={() => onSocialPress("Google")}>
        <AntDesign name="google" size={20} color="#EA4335" />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={() => onSocialPress("Facebook")}>
        <FontAwesome name="facebook-square" size={20} color="#1877F2" />
        <Text style={styles.socialText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.link}>Create account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    backgroundColor: "#fcfcfb",
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 28,
    color: "#111827",
  },
  modeTabs: {
    flexDirection: "row",
    marginBottom: 18,
  },
  modeTab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
  },
  modeText: {
    fontSize: 16,
    color: "#9ca3af",
    fontWeight: "500",
  },
  modeTextActive: {
    color: "#111827",
    fontWeight: "600",
  },
  modeUnderline: {
    marginTop: 12,
    height: 2,
    width: "100%",
    backgroundColor: "#111827",
    borderRadius: 999,
  },
  label: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputDisabled: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    backgroundColor: "#f4f4f5",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  placeholderText: {
    color: "#9ca3af",
    fontSize: 16,
  },
  passwordWrapper: {
    marginTop: 2,
    borderWidth: 2,
    borderColor: "#111827",
    borderRadius: 14,
    backgroundColor: "#fff",
    minHeight: 56,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  resetRow: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 18,
  },
  resetText: {
    color: "#4b5563",
    fontSize: 15,
  },
  resetLink: {
    color: "#16a34a",
    fontSize: 15,
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#16a34a",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
  dividerText: {
    textAlign: "center",
    color: "#6b7280",
    marginVertical: 16,
    fontSize: 14,
  },
  socialButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ececec",
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  socialText: {
    marginLeft: 18,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#2563eb",
    fontWeight: "600",
  },
});
