import { View, Text, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    console.log("🚀 Index screen mounted - navigating to tabs...");

    // Force navigation after a short delay
    const timer = setTimeout(() => {
      try {
        router.replace("/(tabs)");
      } catch (error) {
        console.error("Navigation failed:", error);
        // Fallback
        router.replace("/onboarding");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: "#000", 
      justifyContent: "center", 
      alignItems: "center" 
    }}>
      <ActivityIndicator size="large" color="#A4161A" />
      <Text style={{ color: "#fff", marginTop: 20, fontSize: 18 }}>
        Welcome to SheValue
      </Text>
      <Text style={{ color: "#666", marginTop: 10, fontSize: 14 }}>
        Loading...
      </Text>
    </View>
  );
}