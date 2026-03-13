import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

export default function Paywall() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Start Your 3-Day Free Trial</Text>

      <Text style={styles.subtitle}>
        Unlock full access to SheValue and gain deeper relationship clarity.
      </Text>

      {/* Benefits */}
      <View style={styles.features}>
        <Text style={styles.feature}>• Unlimited Message Analysis</Text>
        <Text style={styles.feature}>• Unlimited AI Therapist Support</Text>
        <Text style={styles.feature}>• Detect Manipulation Instantly</Text>
        <Text style={styles.feature}>• Screenshot Analysis</Text>
      </View>

      {/* Price Box */}
      <View style={styles.priceBox}>
        <Text style={styles.free}>3 Days Free</Text>
        <Text style={styles.price}>Then $3.99 / week</Text>
        <Text style={styles.cancel}>Cancel anytime</Text>
      </View>

      {/* Start Trial */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/(tabs)/analyzer")}
      >
        <Text style={styles.buttonText}>Start Free Trial</Text>
      </TouchableOpacity>

      {/* Restore */}
      <TouchableOpacity>
        <Text style={styles.restore}>Restore Purchases</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        Subscription renews automatically unless canceled at least 24 hours
        before the end of the trial.
      </Text>
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

  features: {
    marginBottom: 30,
  },

  feature: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },

  priceBox: {
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#222",
  },

  free: {
    color: "#A4161A",
    fontSize: 22,
    fontWeight: "bold",
  },

  price: {
    color: "#fff",
    marginTop: 6,
  },

  cancel: {
    color: "#777",
    marginTop: 4,
  },

  button: {
    backgroundColor: "#A4161A",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 16,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  restore: {
    color: "#aaa",
    textAlign: "center",
  },

  footer: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
  },
});