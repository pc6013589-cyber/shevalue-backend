import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";

const slides = [
  {
    icon: "💬",
    title: "Decode His Messages",
    text: "SheValue analyzes what he says and reveals the real intention behind it.",
  },
  {
    icon: "🧠",
    title: "Know His Intentions",
    text: "Detect manipulation, low effort, mixed signals, and genuine interest.",
  },
  {
    icon: "✨",
    title: "Get Classy Responses",
    text: "Receive confident, feminine replies that protect your standards.",
  },
];

export default function FeaturesScreen() {
  const [index, setIndex] = useState(0);

  const current = slides[index];

  const goNext = () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
    } else {
      router.push("/onboarding/relationship");
    }
  };

  const goBack = () => {
    if (index > 0) {
      setIndex(index - 1);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>{current.icon}</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.text}>{current.text}</Text>

        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={goBack}>
          <Text style={styles.secondaryText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtn} onPress={goNext}>
          <Text style={styles.primaryText}>
            {index === slides.length - 1 ? "Continue" : "Next"}
          </Text>
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
    alignItems: "center",
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  text: {
    color: "#bbb",
    fontSize: 17,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 320,
  },
  dotsRow: {
    flexDirection: "row",
    marginTop: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#8B0000",
    width: 24,
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