import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  SafeAreaView,
  ToastAndroid,
  StatusBar,
  Image,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75;
const BASE_URL = "https://shevalue-backend.vercel.app/api";
const API_URL = `${BASE_URL}/chat`;
const STORAGE_KEY = "shevalue_conversations";

const MIN_INPUT_HEIGHT = 52;
const MAX_INPUT_HEIGHT = 180;

function sanitizeTherapistReply(text: string) {
  if (!text) return "I'm here with you.";

  let cleaned = text;

  cleaned = cleaned
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/A high-value feminine woman/gi, "You")
    .replace(/As a high-value feminine woman/gi, "You")
    .replace(/A high-value woman/gi, "You")
    .replace(/As a high-value woman/gi, "You")
    .replace(/High-value women/gi, "You")
    .replace(/high-value women/gi, "you");

  cleaned = cleaned
    .replace(
      /That can feel that situation might have left you feeling confused or uncertain/gi,
      "That can feel really confusing and unsettling"
    )
    .replace(/That can feel that situation might have left you feeling/gi, "That can feel")
    .replace(/That can feel you[’']?re navigating a tricky situation/gi, "That can feel really confusing and unsettling")
    .replace(/It sounds like you[’']?re navigating a tricky situation/gi, "That can feel really confusing and unsettling")
    .replace(/It sounds like you[’']?re feeling unsettled by/gi, "That can feel really unsettling, especially with")
    .replace(/It sounds like you[’']?re feeling confused by/gi, "That can feel really confusing, especially with")
    .replace(/It sounds like you[’']?re feeling hurt by/gi, "That can feel really hurtful, especially with")
    .replace(/It sounds like you[’']?re feeling/gi, "That can feel")
    .replace(/It sounds like you[’']?re experiencing/gi, "That can feel")
    .replace(/It sounds like/gi, "That can feel")
    .replace(/^That can feel unsettled\b/gi, "That can feel really unsettling")
    .replace(/^That can feel confused\b/gi, "That can feel really confusing")
    .replace(/^That can feel hurt\b/gi, "That can feel really hurtful")
    .replace(/^That can feel that\b/gi, "That can feel")
    .replace(/^That can feel you\b/gi, "That can feel");

  cleaned = cleaned
    .replace(/You recognizes/gi, "You deserve")
    .replace(/You understands/gi, "You understand")
    .replace(/You deserve her worth/gi, "You know your worth")
    .replace(/You deserve your worth/gi, "You know your worth")
    .replace(/Like yourself/gi, "")
    .replace(/You like yourself deserves/gi, "You deserve")
    .replace(/someone like yourself deserves/gi, "you deserve")
    .replace(/does not tolerate inconsistency/gi, "and shouldn't accept inconsistency")
    .replace(/You deserve that (her|your) time and energy are precious and deserves a partner who values (her|you) consistently\./gi, "You deserve someone who values your time and energy consistently.")
    .replace(/You deserve that (her|your) time and energy are precious\./gi, "Your time and energy matter.")
    .replace(/You deserve clarity and consistency in (their|your) relationships?/gi, "You deserve clarity and consistency.")
    .replace(/You recognize(s)? (your|their) worth and understand that you deserve/gi, "You deserve")
    .replace(/You deserve someone who honors your time and emotions\.\s*You deserve/gi, "You deserve")
    .replace(/You know your worth and shouldn't accept inconsistency\./gi, "You deserve consistency and respect.");

  cleaned = cleaned
    .replace(/Here are a few things to consider:?/gi, "")
    .replace(/A grounded next step could be:?/gi, "")
    .replace(/Consider reflecting on:?/gi, "")
    .replace(/Possible Unhealthiness:?/gi, "")
    .replace(/Here’s how you might interpret this situation:?/gi, "")
    .replace(/Here's how you might interpret this situation:?/gi, "")
    .replace(/This behavior could indicate/gi, "Sometimes it can mean")
    .replace(/This behavior may indicate/gi, "Sometimes it can mean")
    .replace(/It[’']s important to consider how this aligns.*?\./gi, "What matters is how this feels to you.");

  cleaned = cleaned
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*[-•]\s+/gm, "");

  cleaned = cleaned
    .replace(/Would you like to explore.*$/gim, "")
    .replace(/How does that resonate with you\??/gi, "How is that sitting with you?")
    .replace(/Would you like guidance on how to phrase that message\??/gi, "Do you want help wording a reply?")
    .replace(/Would you like guidance.*$/gim, "Do you want help wording a reply?")
    .replace(/Would you like to talk about.*$/gim, "How is that sitting with you?");

  cleaned = cleaned
    .replace(/possibly hurt\b/gi, "hurtful")
    .replace(/You understand her worth/gi, "You know your worth")
    .replace(/You understand your worth/gi, "You know your worth")
    .replace(/To interpret this wisely,?/gi, "")
    .replace(/consider how it makes you feel:?/gi, "")
    .replace(/Do you feel valued and respected\?/gi, "")
    .replace(/Does this behavior align with the kind of relationship you want\?/gi, "");

  cleaned = cleaned.replace(
    /(You know your worth.*?communication in any relationship\.)/gi,
    "You know your worth, and you deserve something that feels steady and clear."
  );

  if (!cleaned.match(/\?$/)) {
    cleaned += "\n\nHow is that sitting with you?";
  }

  cleaned = cleaned
    .replace(/\s+([.,!?])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const paragraphs = cleaned
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs.slice(0, 3).join("\n\n") || "I'm here with you.";
}

function TypingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const makeLoop = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ])
      );

    const a1 = makeLoop(dot1, 0);
    const a2 = makeLoop(dot2, 150);
    const a3 = makeLoop(dot3, 300);

    a1.start(); a2.start(); a3.start();

    return () => {
      a1.stop(); a2.stop(); a3.stop();
    };
  }, []);

  return (
    <View style={styles.typingDotsRow}>
      <Animated.View style={[styles.typingDot, { opacity: dot1 }]} />
      <Animated.View style={[styles.typingDot, { opacity: dot2 }]} />
      <Animated.View style={[styles.typingDot, { opacity: dot3 }]} />
    </View>
  );
}

export default function Therapist() {
  const tabBarHeight = useBottomTabBarHeight();

  const [conversations, setConversations] = useState<any[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [relationship, setRelationship] = useState("Single");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
  const [typing, setTyping] = useState(false);

  const [pendingImageBase64, setPendingImageBase64] = useState<string | null>(null);
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);

  const drawerX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const flatListRef = useRef<FlatList>(null);

  const currentConversation = conversations.find((c) => c.id === currentId);

  const showToast = (text: string) => {
    if (Platform.OS === "android") ToastAndroid.show(text, ToastAndroid.SHORT);
  };

  const copyMessage = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      showToast("Message copied");
    } catch (err) {
      console.log("Copy error:", err);
    }
  };

  useEffect(() => {
    const loadSavedConversations = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setConversations(parsed);
            if (parsed.length > 0) setCurrentId(parsed[0].id);
          }
        }
      } catch (err) {
        console.log("Load conversations error:", err);
      }
    };
    loadSavedConversations();
  }, []);

  useEffect(() => {
    const saveConversations = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      } catch (err) {
        console.log("Save conversations error:", err);
      }
    };
    saveConversations();
  }, [conversations]);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [currentConversation?.messages, typing]);

  const toggleDrawer = () => {
    Animated.timing(drawerX, {
      toValue: drawerOpen ? -DRAWER_WIDTH : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setDrawerOpen(!drawerOpen);
  };

  const startNewConversation = () => {
    const newConv = { id: Date.now().toString(), title: "New Chat", messages: [] };
    setConversations((prev) => [newConv, ...prev]);
    setCurrentId(newConv.id);
    setInput("");
    setInputHeight(MIN_INPUT_HEIGHT);
    setPendingImageBase64(null);
    setPendingImageUri(null);
    setTyping(false);
    if (drawerOpen) toggleDrawer();
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      const asset = result.assets[0];
      setPendingImageBase64(asset.base64 || null);
      setPendingImageUri(asset.uri || null);
      showToast("Image added");
    }
  };

  const removePendingImage = () => {
    setPendingImageBase64(null);
    setPendingImageUri(null);
  };

  const sendMessage = async () => {
    if (!input.trim() && !pendingImageBase64) return;

    let conv = currentConversation;
    if (!conv) {
      const newConv = { id: Date.now().toString(), title: "New Chat", messages: [] };
      setConversations((prev) => [newConv, ...prev]);
      setCurrentId(newConv.id);
      conv = newConv;
    }

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim() || "[Image Uploaded]",
      imageUri: pendingImageUri || null,
    };

    const updatedMessages = [...conv.messages, userMsg];

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conv!.id
          ? {
              ...c,
              title: conv!.messages.length === 0 ? (input.trim() || "Image Chat").slice(0, 30) : c.title,
              messages: updatedMessages,
            }
          : c
      )
    );

    const currentInput = input.trim();
    const currentImageBase64 = pendingImageBase64;
    const currentImageUri = pendingImageUri;

    setInput("");
    setInputHeight(MIN_INPUT_HEIGHT);
    setPendingImageBase64(null);
    setPendingImageUri(null);
    setTyping(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, image: currentImageBase64, relationship }),
      });

      const rawText = await res.text();
      let data;

      try {
        data = JSON.parse(rawText);
      } catch {
        const aiMessage = { id: Date.now().toString(), role: "assistant", content: "Server returned invalid response." };
        setTyping(false);
        setConversations((prev) =>
          prev.map((c) => (c.id === conv!.id ? { ...c, messages: [...updatedMessages, aiMessage] } : c))
        );
        return;
      }

      const aiMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: sanitizeTherapistReply(data?.reply || "I'm here with you."),
      };

      setTyping(false);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conv!.id ? { ...c, messages: [...updatedMessages, aiMessage] } : c
        )
      );
    } catch (err) {
      console.log("Therapist error:", err);
      const aiMessage = { id: Date.now().toString(), role: "assistant", content: "Network error. Please try again." };
      setTyping(false);
      setConversations((prev) =>
        prev.map((c) => (c.id === conv!.id ? { ...c, messages: [...updatedMessages, aiMessage] } : c))
      );
    }
  };

  const clearAllChats = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setConversations([]);
      setCurrentId(null);
      setInput("");
      setInputHeight(MIN_INPUT_HEIGHT);
      setPendingImageBase64(null);
      setPendingImageUri(null);
      showToast("All chats cleared");
    } catch (err) {
      console.log("Clear chats error:", err);
    }
  };

  const messagesToRender = typing && currentConversation
    ? [...currentConversation.messages, { id: "typing-indicator", role: "assistant", isTyping: true }]
    : currentConversation?.messages || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleDrawer}>
            <Text style={styles.menu}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.title}>SheValue Therapist</Text>
          <TouchableOpacity onPress={startNewConversation}>
            <Text style={styles.plus}>＋</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.relationshipRow}>
          {["Married", "Dating", "Single Mother", "Single"].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.relButton, relationship === r && styles.relActive]}
              onPress={() => setRelationship(r)}
            >
              <Text style={[styles.relText, relationship === r && styles.relTextActive]}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
          <FlatList
            ref={flatListRef}
            data={messagesToRender}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingTop: 10,
              paddingBottom: tabBarHeight + 140,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <View
                style={[
                  styles.bubble,
                  item.role === "user" ? styles.userBubble : styles.aiBubble,
                  item.isTyping && styles.typingBubble,
                ]}
              >
                {item.isTyping ? (
                  <TypingDots />
                ) : (
                  <>
                    {item.imageUri && (
                      <Image source={{ uri: item.imageUri }} style={styles.chatImage} />
                    )}
                    <Text style={styles.messageText}>{item.content}</Text>
                    {item.role === "assistant" && (
                      <TouchableOpacity style={styles.copyButton} onPress={() => copyMessage(item.content)}>
                        <Text style={styles.copyButtonText}>Copy</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            )}
          />
        </View>

        {/* Input Area */}
        <View style={styles.composerOuter}>
          {pendingImageUri && (
            <View style={styles.previewWrap}>
              <Image source={{ uri: pendingImageUri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removePreviewButton} onPress={removePendingImage}>
                <Text style={styles.removePreviewText}>×</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputShell}>
            <TouchableOpacity onPress={pickImage} style={styles.attachButton}>
              <Text style={styles.attachText}>＋</Text>
            </TouchableOpacity>

            <View style={styles.textInputHolder}>
              <TextInput
                style={[styles.input, { maxHeight: MAX_INPUT_HEIGHT }]}
                value={input}
                onChangeText={setInput}
                placeholder="Message SheValue Therapist..."
                placeholderTextColor="#666"
                multiline
                scrollEnabled
                textAlignVertical="top"
                keyboardAppearance="dark"
                onContentSizeChange={(e) => {
                  const contentHeight = e.nativeEvent.contentSize.height;
                  const newHeight = Math.max(
                    MIN_INPUT_HEIGHT,
                    Math.min(MAX_INPUT_HEIGHT, contentHeight + 8)
                  );
                  setInputHeight(newHeight);
                }}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                !input.trim() && !pendingImageBase64 && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!input.trim() && !pendingImageBase64}
            >
              <Text style={styles.sendText}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {drawerOpen && (
        <TouchableWithoutFeedback onPress={toggleDrawer}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerX }] }]}>
        <Text style={styles.drawerTitle}>Conversations</Text>
        <TouchableOpacity onPress={startNewConversation}>
          <Text style={styles.newConversationText}>+ New Conversation</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearAllChats}>
          <Text style={styles.clearChatsText}>Clear All Chats</Text>
        </TouchableOpacity>

        {conversations.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            onPress={() => {
              setCurrentId(conv.id);
              setTyping(false);
              toggleDrawer();
            }}
          >
            <Text style={styles.convItem}>{conv.title}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" }, // Deep black

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: "#0A0A0A",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "600" },
  menu: { color: "#fff", fontSize: 22 },
  plus: { color: "#fff", fontSize: 24 },

  relationshipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    paddingBottom: 12,
    gap: 8,
    backgroundColor: "#0A0A0A",
  },
  relButton: {
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: "#1A1A1A",
  },
  relActive: { backgroundColor: "#8B0000", borderColor: "#A4161A" },
  relText: { color: "#aaa", fontSize: 13 },
  relTextActive: { color: "#fff", fontWeight: "700" },

  bubble: { 
    padding: 14, 
    borderRadius: 18, 
    marginVertical: 6, 
    maxWidth: "85%" 
  },
  userBubble: { 
    backgroundColor: "#1F1F1F", // Slightly lighter for user
    alignSelf: "flex-end" 
  },
  aiBubble: { 
    backgroundColor: "#171717", // Deep dark for therapist messages
    alignSelf: "flex-start" 
  },
  typingBubble: { opacity: 0.9, minWidth: 70 },

  typingDotsRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 20 },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#888" },

  messageText: { color: "#fff", fontSize: 15, lineHeight: 22 },
  chatImage: { width: 150, height: 150, borderRadius: 14, marginBottom: 10, resizeMode: "cover" },
  copyButton: { 
    alignSelf: "flex-end", 
    marginTop: 10, 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 12, 
    backgroundColor: "#222" 
  },
  copyButtonText: { color: "#bbb", fontSize: 12, fontWeight: "600" },

  composerOuter: { 
    marginHorizontal: 14, 
    marginBottom: 12,
    backgroundColor: "#0A0A0A",
  },

  inputShell: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#1A1A1A", // Dark input background
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: MIN_INPUT_HEIGHT,
  },

  textInputHolder: {
    flex: 1,
    marginRight: 8,
  },

  input: {
    width: "100%",
    color: "#fff",
    fontSize: 17,
    lineHeight: 22,
    paddingTop: 6,
    paddingBottom: 6,
    maxHeight: MAX_INPUT_HEIGHT,
  },

  attachButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 2,
  },
  attachText: { color: "#777", fontSize: 26, lineHeight: 26 },

  sendButton: {
    backgroundColor: "#8B0000",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  sendButtonDisabled: { backgroundColor: "#4d1b1b", opacity: 0.75 },
  sendText: { color: "#fff", fontSize: 20, fontWeight: "700", marginTop: -2 },

  previewWrap: {
    width: 110,
    height: 110,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
  },
  previewImage: { width: "100%", height: "100%", resizeMode: "cover" },
  removePreviewButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  removePreviewText: { color: "#fff", fontSize: 20, lineHeight: 20 },

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#0A0A0A",
    paddingTop: 60,
    paddingHorizontal: 15,
  },
  drawerTitle: { color: "#fff", fontSize: 16, marginBottom: 20 },
  newConversationText: { color: "#8B0000", paddingVertical: 12 },
  clearChatsText: { color: "#777", paddingVertical: 12 },
  convItem: { color: "#ccc", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#222" },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: DRAWER_WIDTH,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
});