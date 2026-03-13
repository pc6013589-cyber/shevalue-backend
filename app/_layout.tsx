import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Home / route controller */}
      <Stack.Screen name="index" />

      {/* Onboarding flow */}
      <Stack.Screen name="onboarding" />

      {/* Main app tabs */}
      <Stack.Screen name="(tabs)" />

      {/* Other pages */}
      <Stack.Screen name="settings" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="privacy" />
    </Stack>
  );
}