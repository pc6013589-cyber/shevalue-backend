import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FinishScreen() {
  const startApp = async () => {
    try {
      // Mark onboarding as completed
      await AsyncStorage.setItem("hasSeenOnboarding", "true");

      // Go to login screen instead of directly to the app
      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Storage error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>👑</Text>

        <Text style={styles.title}>You’re Ready</Text>

        <Text style={styles.subtitle}>
          Start analyzing messages, spotting intentions, and protecting your
          standards with SheValue.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={startApp}>
        <Text style={styles.buttonText}>Start Using SheValue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 40,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 70,
    marginBottom: 20,
  },

  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 16,
  },

  subtitle: {
    color: "#bbb",
    fontSize: 17,
    lineHeight: 26,
    textAlign: "center",
    maxWidth: 320,
  },

  button: {
    backgroundColor: "#8B0000",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});