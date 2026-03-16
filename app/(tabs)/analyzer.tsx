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
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";

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
  const [patternDetected, setPatternDetected] = useState("");
  const [reply, setReply] = useState("");
  const [needsTherapist, setNeedsTherapist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePicked, setImagePicked] = useState(false);

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

  const pickScreenshot = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showToast("Photo permission is needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      const base64 = result.assets[0].base64 || null;
      setImageBase64(base64);
      setImagePicked(true);
      showToast("Screenshot added");
    }
  };

  const clearAll = () => {
    setMessage("");
    setScore(null);
    setReply("");
    setSignal("");
    setPatternDetected("");
    setNeedsTherapist(false);
    setImageBase64(null);
    setImagePicked(false);
  };

  const analyzeMessage = async () => {
    if (!message.trim() && !imageBase64) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    try {
      const ANALYZE_URL = "https://shevalue-backend.vercel.app/analyze";
        
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          image: imageBase64,
          relationshipStatus: selectedRelation,
        }),
      });

      const rawText = await response.text();
console.log("RAW RESPONSE:", rawText);

let data;

try {
  data = JSON.parse(rawText);
} catch (error) {
  console.log("NOT JSON RESPONSE:", rawText);
  showToast("Server returned invalid response");
  setLoading(false);
  return;
}

      if (!response.ok) {
        console.log("Analyzer backend error:", data);
        showToast(data.error || "Analyzer failed");
        setLoading(false);
        return;
      }

      if (
        data.feminine_score === undefined ||
        !data.signal ||
        !data.suggested_reply
      ) {
        console.log("Analyzer invalid response:", data);
        showToast("Analyzer returned incomplete data");
        setLoading(false);
        return;
      }

      setScore(data.feminine_score);
      setSignal(data.signal);
      setPatternDetected(data.pattern_detected || "");
      setReply(data.suggested_reply);

      setNeedsTherapist(
        data.risk_level === "medium" || data.risk_level === "high"
      );

      await copyReply(data.suggested_reply);
    } catch (error) {
      console.log("Analyzer error:", error);
      showToast("Network or server error");
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>SheValue Analyzer</Text>

        <View style={styles.headerRightSpace} />
      </View>

      <ScrollView keyboardShouldPersistTaps="handled">
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

        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Paste his message..."
            placeholderTextColor="#666"
            multiline
            value={message}
            onChangeText={setMessage}
            keyboardAppearance="dark"
            textAlignVertical="top"
          />

          <View style={styles.inputBottomRow}>
            <TouchableOpacity style={styles.plusButton} onPress={pickScreenshot}>
              <Text style={styles.plusText}>＋</Text>
            </TouchableOpacity>

            {imagePicked && (
              <View style={styles.imageTagWrap}>
                <Text style={styles.imageTag}>Screenshot added</Text>

                <TouchableOpacity
                  onPress={() => {
                    setImageBase64(null);
                    setImagePicked(false);
                  }}
                >
                  <Text style={styles.removeTag}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={analyzeMessage}>
          <LinearGradient
            colors={["#5A0A0A", "#8B0000"]}
            style={styles.analyzeBtn}
          >
            <Text style={styles.analyzeText}>Analyze Message</Text>
          </LinearGradient>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#A4161A" />
            <Text style={styles.loadingText}>Analyzing message...</Text>
          </View>
        )}

        {score !== null && !loading && (
          <View style={styles.resultCard}>
            <Text style={styles.score}>Feminine Value Score: {score}%</Text>

            <View style={styles.signalRow}>
              <Text style={styles.signalLabel}>Signal:</Text>

              <View style={styles.signalBadge}>
                <Text style={styles.signalText}>{signal}</Text>
              </View>
            </View>

            {patternDetected ? (
              <View style={styles.signalRow}>
                <Text style={styles.signalLabel}>Pattern:</Text>

                <View style={styles.signalBadge}>
                  <Text style={styles.signalText}>{patternDetected}</Text>
                </View>
              </View>
            ) : null}

            <Text style={styles.reply}>{reply}</Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={() => copyReply(reply)}>
                <Text style={styles.copy}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={clearAll}>
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  headerRightSpace: {
    width: 24,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
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

  inputBox: {
    borderWidth: 2,
    borderColor: "#8B0000",
    borderRadius: 20,
    minHeight: 120,
    marginBottom: 20,
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 12,
  },

  input: {
    color: "#fff",
    minHeight: 80,
    fontSize: 16,
  },

  inputBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  plusButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#161616",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },

  plusText: {
    color: "#ddd",
    fontSize: 24,
    marginTop: -1,
  },

  imageTagWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    flexWrap: "wrap",
  },

  imageTag: {
    color: "#ddd",
    fontSize: 14,
    marginRight: 10,
  },

  removeTag: {
    color: "#A4161A",
    fontWeight: "600",
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

  loadingBox: {
    marginTop: 20,
    alignItems: "center",
  },

  loadingText: {
    color: "#aaa",
    marginTop: 10,
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
    textTransform: "capitalize",
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