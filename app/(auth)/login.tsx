import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const saveLoginState = async (
    method: string,
    userEmail?: string | null
  ) => {
    await AsyncStorage.setItem("isLoggedIn", "true");
    await AsyncStorage.setItem("signInMethod", method);
    await AsyncStorage.setItem("userEmail", userEmail || "");
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing details", "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email.trim(), password);
      await saveLoginState("Email", email.trim());

      router.replace("/paywall");
    } catch (error: any) {
      console.log("LOGIN ERROR:", error?.message);
      Alert.alert(
        "Sign in failed",
        error?.message || "Unable to sign in right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.subtitle}>
        Sign in to continue using SheValue
      </Text>

      {!showEmailLogin && (
        <TouchableOpacity
          style={styles.emailBtn}
          onPress={() => setShowEmailLogin(true)}
        >
          <Ionicons name="mail-outline" size={20} color="#fff" />
          <Text style={styles.emailText}>Continue with Email</Text>
        </TouchableOpacity>
      )}

      {showEmailLogin && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.signup}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 24,
    justifyContent: "center",
  },

  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: 30,
  },

  emailBtn: {
    backgroundColor: "#0d0d0d",
    padding: 14,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },

  emailText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 10,
  },

  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#222",
  },

  button: {
    backgroundColor: "#A4161A",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  signup: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});