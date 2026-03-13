import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RelationshipScreen() {
  const [selected, setSelected] = useState("Single");

  const options = [
    "Single",
    "Dating",
    "In Relationship",
    "Married",
    "Single Mother",
  ];

  const continueNext = async () => {
    try {
      await AsyncStorage.setItem("relationshipType", selected);
      router.push("/onboarding/finish");
    } catch (error) {
      console.log("Save error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Relationship Situation</Text>
        <Text style={styles.subtitle}>
          This helps SheValue give you more personal guidance.
        </Text>

        <View style={styles.optionsWrap}>
          {options.map((item) => {
            const active = selected === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.option, active && styles.activeOption]}
                onPress={() => setSelected(item)}
              >
                <Text style={[styles.optionText, active && styles.activeText]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={continueNext}
        >
          <Text style={styles.primaryText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 14,
  },
  subtitle: {
    color: "#bbb",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 25,
    marginBottom: 28,
  },
  optionsWrap: {
    alignItems: "center",
  },
  option: {
    width: "100%",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 16,
    borderRadius: 18,
    marginBottom: 14,
    alignItems: "center",
  },
  activeOption: {
    backgroundColor: "#8B0000",
    borderColor: "#A4161A",
  },
  optionText: {
    color: "#ddd",
    fontSize: 16,
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#444",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginRight: 10,
  },
  secondaryText: {
    color: "#bbb",
    fontWeight: "600",
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#8B0000",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginLeft: 10,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "bold",
  },
});