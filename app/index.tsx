import React, { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  useEffect(() => {
    const init = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

        // First time user → onboarding
        if (hasSeenOnboarding !== "true") {
          router.replace("/onboarding");
          return;
        }

        // Logged in → go to app
        if (isLoggedIn === "true") {
          router.replace("/paywall");
          return;
        }

        // Not logged in → login screen
        router.replace("/(auth)/login");
      } catch (error) {
        console.log("App state error:", error);
        router.replace("/onboarding");
      }
    };

    init();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color="#A4161A" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});