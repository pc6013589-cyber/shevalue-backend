import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          elevation: 0,
        },
        tabBarActiveTintColor: "#A4161A",
        tabBarInactiveTintColor: "#555",
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
          fontWeight: "600",
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="analyzer"
        options={{
          title: "Analyzer",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? "rgba(164,22,26,0.15)"
                  : "transparent",
                padding: 8,
                borderRadius: 20,
              }}
            >
              <Ionicons
                name="analytics"
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="therapist"
        options={{
          title: "Therapist",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? "rgba(164,22,26,0.15)"
                  : "transparent",
                padding: 8,
                borderRadius: 20,
              }}
            >
              <Ionicons
                name="chatbubbles"
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}