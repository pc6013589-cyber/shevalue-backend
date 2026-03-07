import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ToastAndroid,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";

export default function AnalyzerScreen() {
  const relationships = [
    "Husband",
    "Fiancé",
    "Boyfriend",
    "Crush",
    "Ex",
    "Just Met",
  ];

  const [selectedRelation, setSelectedRelation] = useState("Husband");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [signal, setSignal] = useState("");
  const [reply, setReply] = useState("");
  const [needsTherapist, setNeedsTherapist] = useState(false);

  const showToast = (text: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(text, ToastAndroid.SHORT);
    }
  };

  const copyReply = async (textToCopy: string) => {
    if (!textToCopy) return;
    await Clipboard.setStringAsync(textToCopy);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showToast("Reply copied");
  };

  const analyzeMessage = async () => {
    if (!message.trim()) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const response = await fetch(
        "https://shevalue-backend-api-production.up.railway.app/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            relationshipStatus: selectedRelation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("Analyzer backend error:", data);
        showToast(data.error || "Analyzer failed");
        return;
      }

      if (
        data.feminine_score === undefined ||
        !data.signal ||
        !data.suggested_reply
      ) {
        console.log("Analyzer invalid response:", data);
        showToast("Analyzer returned incomplete data");
        return;
      }

      setScore(data.feminine_score);
      setSignal(data.signal);
      setReply(data.suggested_reply);

      setNeedsTherapist(
        data.risk_level === "medium" || data.risk_level === "high"
      );

      await copyReply(data.suggested_reply);
    } catch (error) {
      console.log("Analyzer error:", error);
      showToast("Network or server error");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>SheValue Analyzer</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {relationships.map((item) => {
            const isActive = selectedRelation === item;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setSelectedRelation(item)}
                style={[styles.pill, isActive && styles.activePill]}
              >
                <Text
                  style={[
                    styles.pillText,
                    isActive && styles.activePillText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TextInput
          style={styles.input}
          placeholder="Paste his message..."
          placeholderTextColor="#666"
          multiline
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity onPress={analyzeMessage}>
          <LinearGradient
            colors={["#5A0A0A", "#8B0000"]}
            style={styles.analyzeBtn}
          >
            <Text style={styles.analyzeText}>Analyze Message</Text>
          </LinearGradient>
        </TouchableOpacity>

        {score !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.score}>
              Feminine Value Score: {score}%
            </Text>

            <View style={styles.signalRow}>
              <Text style={styles.signalLabel}>Signal:</Text>
              <View style={styles.signalBadge}>
                <Text style={styles.signalText}>{signal}</Text>
              </View>
            </View>

            <Text style={styles.reply}>{reply}</Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={() => copyReply(reply)}>
                <Text style={styles.copy}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMessage("");
                  setScore(null);
                  setReply("");
                  setSignal("");
                  setNeedsTherapist(false);
                }}
              >
                <Text style={styles.clear}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {needsTherapist && (
          <TouchableOpacity
            style={styles.therapistBtn}
            onPress={() =>
              router.push({
                pathname: "/therapist",
                params: {
                  analyzedMessage: message,
                  suggestedReply: reply,
                  relationshipStatus: selectedRelation,
                },
              })
            }
          >
            <Text style={styles.therapistText}>
              Talk to Therapist for Clarity
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center",
  },
  pillsRow: {
    marginBottom: 20,
    paddingRight: 20,
  },
  pill: {
    backgroundColor: "#111",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  activePill: {
    backgroundColor: "#8B0000",
    borderColor: "#A4161A",
  },
  pillText: {
    color: "#fff",
  },
  activePillText: {
    fontWeight: "600",
  },
  input: {
    borderWidth: 2,
    borderColor: "#8B0000",
    borderRadius: 20,
    padding: 15,
    color: "#fff",
    minHeight: 120,
    marginBottom: 20,
  },
  analyzeBtn: {
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  analyzeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultCard: {
    borderWidth: 1,
    borderColor: "#8B0000",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  score: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  signalLabel: {
    color: "#A4161A",
    marginRight: 6,
    fontWeight: "bold",
  },
  signalBadge: {
    backgroundColor: "#1C1C1E",
    borderColor: "#A4161A",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  signalText: {
    color: "#A4161A",
    fontWeight: "600",
  },
  reply: {
    color: "#ddd",
    marginTop: 10,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  copy: {
    color: "#A4161A",
    fontWeight: "600",
  },
  clear: {
    color: "#777",
  },
  therapistBtn: {
    backgroundColor: "#8B0000",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 40,
  },
  therapistText: {
    color: "#fff",
    fontWeight: "bold",
  },
});