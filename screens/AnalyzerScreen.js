import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function AnalyzerScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SheValue Analyzer</Text>

      <Text style={styles.subtitle}>
        Analyze relationship messages or go to Therapist Mode.
      </Text>

      <Button
        title="Go To Therapist"
        onPress={() => navigation.navigate("SheValue Therapist")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
});