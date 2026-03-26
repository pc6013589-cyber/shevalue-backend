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
import { createUserWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebaseConfig";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing details", "Please enter email and password.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await createUserWithEmailAndPassword(auth, email.trim(), password);

      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("signInMethod", "Email");
      await AsyncStorage.setItem("userEmail", email.trim());

      router.replace("/paywall");
    } catch (error: any) {
      console.log("SIGNUP ERROR:", error?.message);
      Alert.alert(
        "Sign up failed",
        error?.message || "Unable to create your account right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Join SheValue and protect your standards
      </Text>

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
        style={[styles.button, loading && styles.disabled]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
        <Text style={styles.login}>Already have an account? Sign in</Text>
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: 30,
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

  disabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  login: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});