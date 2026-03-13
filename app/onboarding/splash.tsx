import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { router } from "expo-router";

export default function SplashScreen() {

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding/welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoFlower}>🌺</Text>
      </View>

      <Text style={styles.title}>SheValue</Text>

      <Text style={styles.subtitle}>
        Understand men. Protect your standards.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#120000",
    justifyContent: "center",
    alignItems: "center",
  },

  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: "#8B0000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,

    shadowColor: "#A4161A",
    shadowOpacity: 0.7,
    shadowRadius: 20,
  },

  logoFlower: {
    fontSize: 48,
  },

  title: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
  },

  subtitle: {
    color: "#d6d6d6",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 24,
  },
});