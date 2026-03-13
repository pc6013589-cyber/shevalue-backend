import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={["#000000", "#100000", "#000000"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to SheValue</Text>
          <Text style={styles.subtitle}>
            Analyze messages. Understand intentions. Protect your feminine value.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>What you can do</Text>
            <Text style={styles.cardText}>• Decode his messages</Text>
            <Text style={styles.cardText}>• Spot mixed signals</Text>
            <Text style={styles.cardText}>• Get classy replies</Text>
            <Text style={styles.cardText}>• Talk to your AI therapist</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/onboarding/features")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    color: "#bbb",
    fontSize: 17,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#8B0000",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  cardText: {
    color: "#ddd",
    fontSize: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#8B0000",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});