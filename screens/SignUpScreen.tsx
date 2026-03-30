import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { registerUser } from "../services/firebase/auth";
import { upsertUserProfile } from "../services/firebase/firestore";

export default function SignUpScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"homeowner" | "mason">("homeowner");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert("Validation", "All fields are required.");
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
        id: user.uid,
        name,
        email: email.trim().toLowerCase(),
        phone,
        location: "",
        role,
        avatar: user.photoURL || "",
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack?.()}>
        <Ionicons name="arrow-back" size={22} color="#111827" />
      </TouchableOpacity>

      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}>Create your FixMate account and choose how you’ll use the app.</Text>

      <Text style={styles.label}>Full name</Text>
      <TextInput style={styles.input} placeholder="Your full name" value={name} onChangeText={setName} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

      <Text style={styles.label}>Phone number</Text>
      <TextInput style={styles.input} placeholder="+256..." value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#111827" />
        <TextInput
          style={styles.passwordInput}
          placeholder="Create a password"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
          <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>I am joining as</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity style={[styles.roleButton, role === "homeowner" && styles.roleButtonActive]} onPress={() => setRole("homeowner")}>
          <Text style={[styles.roleTitle, role === "homeowner" && styles.roleTitleActive]}>Homeowner</Text>
          <Text style={[styles.roleDescription, role === "homeowner" && styles.roleDescriptionActive]}>Post jobs and hire local masons.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.roleButton, role === "mason" && styles.roleButtonActive]} onPress={() => setRole("mason")}>
          <Text style={[styles.roleTitle, role === "mason" && styles.roleTitleActive]}>Mason</Text>
          <Text style={[styles.roleDescription, role === "mason" && styles.roleDescriptionActive]}>Discover jobs and send offers.</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating account..." : "Create account"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
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
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    color: "#6b7280",
    fontSize: 15,
    lineHeight: 22,
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
  roleContainer: {
    marginTop: 4,
    marginBottom: 12,
    gap: 10,
  },
  roleButton: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  roleButtonActive: {
    borderColor: "#16a34a",
    backgroundColor: "#f0fdf4",
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  roleTitleActive: {
    color: "#166534",
  },
  roleDescription: {
    marginTop: 4,
    color: "#6b7280",
    lineHeight: 20,
  },
  roleDescriptionActive: {
    color: "#166534",
  },
  button: {
    backgroundColor: "#16a34a",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
  link: {
    marginTop: 20,
    color: "#2563eb",
    textAlign: "center",
    fontWeight: "600",
  },
});
