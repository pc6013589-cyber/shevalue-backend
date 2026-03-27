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

function sanitizeTherapistReply(text: string) {
  if (!text) return "I'm here with you.";

  let cleaned = text;

  // Remove AI tone + branding
  cleaned = cleaned
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/A high-value feminine woman/gi, "You")
    .replace(/As a high-value feminine woman/gi, "You")
    .replace(/High-value women/gi, "You")
    .replace(/high-value women/gi, "you");

  // Fix broken grammar
  cleaned = cleaned
    .replace(/That can feel you’re going through/gi, "That can feel really confusing, especially when")
    .replace(/You understands/gi, "You understand")
    .replace(/You understands that/gi, "")
    .replace(/Here’s how you might interpret this situation:?/gi, "")
    .replace(/Possible Unhealthiness:?/gi, "")
    .replace(/This behavior may indicate/gi, "Sometimes it can mean")
    .replace(/It’s essential to consider how this aligns with your values/gi, "What matters is how this feels to you");

  // Replace robotic AI intros
  cleaned = cleaned
    .replace(/It sounds like you're feeling/gi, "That can feel")
    .replace(/It sounds like/gi, "That can feel")
    .replace(/you’re going through a confusing and possibly frustrating situation/gi, "really confusing and frustrating");

  // Remove list / structured AI output
  cleaned = cleaned
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*[-•]\s+/gm, "");

  // Remove AI endings
  cleaned = cleaned
    .replace(/Would you like to explore.*$/gim, "")
    .replace(/How does that resonate with you\??/gi, "How is that sitting with you?")
    .replace(/Would you like guidance.*$/gim, "Do you want help replying to him?");

  // Clean spacing
  cleaned = cleaned
    .replace(/\s+([.,!?])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Keep it SHORT (very important for your app style)
  const paragraphs = cleaned
    .split("\n")
    .map(p => p.trim())
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
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );

    const a1 = makeLoop(dot1, 0);
    const a2 = makeLoop(dot2, 150);
    const a3 = makeLoop(dot3, 300);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

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
  const [inputHeight, setInputHeight] = useState(24);
  const [typing, setTyping] = useState(false);

  const [pendingImageBase64, setPendingImageBase64] = useState<string | null>(
    null
  );
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);

  const drawerX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const flatListRef = useRef<FlatList>(null);

  const currentConversation = conversations.find((c) => c.id === currentId);

  const showToast = (text: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(text, ToastAndroid.SHORT);
    }
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

            if (parsed.length > 0) {
              setCurrentId(parsed[0].id);
            }
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
    const newConv = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setCurrentId(newConv.id);
    setTyping(false);
    setInput("");
    setPendingImageBase64(null);
    setPendingImageUri(null);
    setInputHeight(24);

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
      const newConv = {
        id: Date.now().toString(),
        title: "New Chat",
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setCurrentId(newConv.id);
      conv = newConv;
    }

    const currentInput = input.trim();
    const currentImageBase64 = pendingImageBase64;
    const currentImageUri = pendingImageUri;

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput || "[Image Uploaded]",
      imageUri: currentImageUri || null,
    };

    const updatedMessages = [...conv.messages, userMsg];

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conv!.id
          ? {
              ...c,
              title:
                conv!.messages.length === 0
                  ? (currentInput || "Image Chat").slice(0, 30)
                  : c.title,
              messages: updatedMessages,
            }
          : c
      )
    );

    setInput("");
    setInputHeight(24);
    setPendingImageBase64(null);
    setPendingImageUri(null);
    setTyping(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          image: currentImageBase64,
          relationship,
        }),
      });

      const rawText = await res.text();
      console.log("THERAPIST RAW RESPONSE:", rawText);

      let data: any;

      try {
        data = JSON.parse(rawText);
      } catch (error) {
        console.log("THERAPIST NOT JSON RESPONSE:", rawText);

        const aiMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: "Server returned invalid response. Please try again.",
        };

        setTyping(false);

        setConversations((prev) =>
          prev.map((c) =>
            c.id === conv!.id
              ? { ...c, messages: [...updatedMessages, aiMessage] }
              : c
          )
        );

        showToast("Server returned invalid response");
        return;
      }

      if (!res.ok) {
        console.log("Therapist backend error:", data);

        const aiMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: data?.error || "Something went wrong. Please try again.",
        };

        setTyping(false);

        setConversations((prev) =>
          prev.map((c) =>
            c.id === conv!.id
              ? { ...c, messages: [...updatedMessages, aiMessage] }
              : c
          )
        );

        showToast(data?.error || "Something went wrong");
        return;
      }

      const aiMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: sanitizeTherapistReply(
          data?.reply || "I'm here with you. Please try again."
        ),
      };

      setTyping(false);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conv!.id
            ? { ...c, messages: [...updatedMessages, aiMessage] }
            : c
        )
      );
    } catch (err) {
      console.log("Therapist error:", err);

      const aiMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Network or server error. Please try again.",
      };

      setTyping(false);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conv!.id
            ? { ...c, messages: [...updatedMessages, aiMessage] }
            : c
        )
      );

      showToast("Network or server error");
    }
  };

  const clearAllChats = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setConversations([]);
      setCurrentId(null);
      setTyping(false);
      setInput("");
      setPendingImageBase64(null);
      setPendingImageUri(null);
      setInputHeight(24);
      showToast("All chats cleared");
    } catch (err) {
      console.log("Clear chats error:", err);
    }
  };

  const messagesToRender =
    typing && currentConversation
      ? [
          ...currentConversation.messages,
          {
            id: "typing-indicator",
            role: "assistant",
            isTyping: true,
          },
        ]
      : currentConversation?.messages || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
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
          {["Married", "Dating", "Single Mother", "Single"].map((r) => {
            const isActive = relationship === r;
            return (
              <TouchableOpacity
                key={r}
                style={[styles.relButton, isActive && styles.relActive]}
                onPress={() => setRelationship(r)}
              >
                <Text
                  style={[styles.relText, isActive && styles.relTextActive]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={messagesToRender}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingTop: 10,
              paddingBottom: tabBarHeight + 108,
            }}
            showsVerticalScrollIndicator={false}
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
                    {item.imageUri ? (
                      <Image
                        source={{ uri: item.imageUri }}
                        style={styles.chatImage}
                      />
                    ) : null}

                    <Text style={styles.messageText}>{item.content}</Text>

                    {item.role === "assistant" && !item.isTyping ? (
                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() => copyMessage(item.content)}
                      >
                        <Text style={styles.copyButtonText}>Copy</Text>
                      </TouchableOpacity>
                    ) : null}
                  </>
                )}
              </View>
            )}
          />
        </View>

        <View style={styles.inputWrapper}>
          {pendingImageUri ? (
            <View style={styles.previewWrap}>
              <Image
                source={{ uri: pendingImageUri }}
                style={styles.previewImage}
              />
              <TouchableOpacity
                style={styles.removePreviewButton}
                onPress={removePendingImage}
              >
                <Text style={styles.removePreviewText}>×</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.bottomInputRow}>
            <TouchableOpacity onPress={pickImage} style={styles.attachButton}>
              <Text style={styles.attachText}>＋</Text>
            </TouchableOpacity>

            <View style={styles.inputBox}>
              <TextInput
                style={[
                  styles.input,
                  {
                    minHeight: 26,
                    height: Math.min(Math.max(26, inputHeight), 180),
                  },
                ]}
                value={input}
                onChangeText={setInput}
                placeholder="Message SheValue Therapist..."
                placeholderTextColor="#777"
                multiline
                scrollEnabled={false}
                textAlignVertical="top"
                onContentSizeChange={(e) =>
                  setInputHeight(e.nativeEvent.contentSize.height)
                }
                keyboardAppearance="dark"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                !input.trim() &&
                  !pendingImageBase64 &&
                  styles.sendButtonDisabled,
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

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: drawerX }] }]}
      >
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
  container: { flex: 1, backgroundColor: "#1e1e1e" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 10,
  },

  title: { color: "#fff", fontSize: 18, fontWeight: "600" },
  menu: { color: "#fff", fontSize: 22 },
  plus: { color: "#fff", fontSize: 24 },

  relationshipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    paddingBottom: 10,
    gap: 8,
  },

  relButton: {
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: "#111",
  },

  relActive: {
    backgroundColor: "#8B0000",
    borderColor: "#A4161A",
  },

  relText: { color: "#888", fontSize: 13 },
  relTextActive: { color: "#fff", fontWeight: "700" },

  bubble: {
    padding: 14,
    borderRadius: 18,
    marginVertical: 6,
    maxWidth: "85%",
  },

  userBubble: {
    backgroundColor: "#2f2f2f",
    alignSelf: "flex-end",
  },

  aiBubble: {
    backgroundColor: "#3a3a3a",
    alignSelf: "flex-start",
  },

  typingBubble: {
    opacity: 0.9,
    minWidth: 70,
  },

  typingDotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 20,
  },

  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },

  messageText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
  },

  chatImage: {
    width: 150,
    height: 150,
    borderRadius: 14,
    marginBottom: 10,
    resizeMode: "cover",
  },

  copyButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#2a2a2a",
  },

  copyButtonText: {
    color: "#bbb",
    fontSize: 12,
    fontWeight: "600",
  },

  inputWrapper: {
    backgroundColor: "#2a2a2a",
    borderRadius: 28,
    marginHorizontal: 14,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: "#313131",
  },

  previewWrap: {
    width: 110,
    height: 110,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
  },

  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  removePreviewButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },

  removePreviewText: {
    color: "#fff",
    fontSize: 20,
    lineHeight: 20,
    marginTop: -1,
  },

  bottomInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  attachButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    marginBottom: 4,
  },

  attachText: {
    color: "#888",
    fontSize: 26,
    lineHeight: 26,
    marginTop: -1,
  },

  inputBox: {
    flex: 1,
    justifyContent: "flex-end",
    minHeight: 26,
    paddingTop: 8,
    paddingBottom: 8,
  },

  input: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
    maxHeight: 180,
    paddingTop: 0,
    paddingBottom: 0,
    marginHorizontal: 4,
    textAlignVertical: "top",
  },

  sendButton: {
    backgroundColor: "#8B0000",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
    marginBottom: 4,
  },

  sendButtonDisabled: {
    backgroundColor: "#4d1b1b",
    opacity: 0.75,
  },

  sendText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: -2,
  },

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#111",
    paddingTop: 60,
    paddingHorizontal: 15,
  },

  drawerTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },

  newConversationText: {
    color: "#8B0000",
    paddingVertical: 12,
  },

  clearChatsText: {
    color: "#777",
    paddingVertical: 12,
  },

  convItem: {
    color: "#ccc",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#222",
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: DRAWER_WIDTH,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});