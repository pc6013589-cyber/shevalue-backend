import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to let auth state settle after login
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: "#000", 
        justifyContent: "center", 
        alignItems: "center" 
      }}>
        <ActivityIndicator size="large" color="#A4161A" />
        <Text style={{ color: "#fff", marginTop: 20 }}>Welcome to SheValue</Text>
      </View>
    );
  }

  // Redirect to your main analyzer screen
  return <Redirect href="/(tabs)/analyzer" />;
}