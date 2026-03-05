import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AnalyzerScreen from "./screens/AnalyzerScreen";
import TherapistScreen from "./screens/TherapistScreen";
import { AuthProvider } from "./context/AuthContext"; // ✅ ADD THIS LINE

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider> {/* ✅ WRAP EVERYTHING WITH THIS */}
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SheValue Analyzer" component={AnalyzerScreen} />
          <Stack.Screen name="SheValue Therapist" component={TherapistScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}