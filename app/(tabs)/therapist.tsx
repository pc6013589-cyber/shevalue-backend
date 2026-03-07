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
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75;
const API_URL = "https://shevalue-backend-api-production.up.railway.app/chat";

export default function Therapist() {
  const tabBarHeight = useBottomTabBarHeight();

  const [conversations, setConversations] = useState<any[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [relationship, setRelationship] = useState("Single");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inputHeight, setInputHeight] = useState(44);

  const drawerX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const flatListRef = useRef<FlatList>(null);

  const currentConversation = conversations.find(c => c.id === currentId);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [currentConversation?.messages]);

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
    setConversations(prev => [newConv, ...prev]);
    setCurrentId(newConv.id);
    if (drawerOpen) toggleDrawer();
  };

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      const imageBase64 = result.assets[0].base64;

      let conv = currentConversation;
      if (!conv) {
        startNewConversation();
        return;
      }

      const userMsg = {
        id: Date.now().toString(),
        role: "user",
        content: "[Image Uploaded]",
      };

      const updatedMessages = [...conv.messages, userMsg];

      setConversations(prev =>
        prev.map(c =>
          c.id === conv.id ? { ...c, messages: updatedMessages } : c
        )
      );

      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          relationship,
          history: updatedMessages,
        }),
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    let conv = currentConversation;
    if (!conv) {
      startNewConversation();
      return;
    }

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    const updatedMessages = [...conv.messages, userMsg];

    setConversations(prev =>
      prev.map(c =>
        c.id === conv.id
          ? {
              ...c,
              title:
                conv.messages.length === 0
                  ? input.slice(0, 30)
                  : c.title,
              messages: updatedMessages,
            }
          : c
      )
    );

    setInput("");
    setInputHeight(44);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          relationship,
          history: updatedMessages,
        }),
      });

      const data = await res.json();

      const aiMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.reply,
      };

      setConversations(prev =>
        prev.map(c =>
          c.id === conv.id
            ? { ...c, messages: [...updatedMessages, aiMessage] }
            : c
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleDrawer}>
            <Text style={styles.menu}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.title}>SheValue Therapist</Text>
          <TouchableOpacity onPress={startNewConversation}>
            <Text style={styles.plus}>＋</Text>
          </TouchableOpacity>
        </View>

        {/* RELATIONSHIP */}
        <View style={styles.relationshipRow}>
          {["Married", "Dating", "Single Mother", "Single"].map(r => {
            const isActive = relationship === r;
            return (
              <TouchableOpacity
                key={r}
                style={[styles.relButton, isActive && styles.relActive]}
                onPress={() => setRelationship(r)}
              >
                <Text
                  style={[
                    styles.relText,
                    isActive && styles.relTextActive,
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CHAT AREA */}
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={currentConversation?.messages || []}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 15 }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.bubble,
                  item.role === "user"
                    ? styles.userBubble
                    : styles.aiBubble,
                ]}
              >
                <Text style={styles.messageText}>{item.content}</Text>
              </View>
            )}
          />
        </View>

        {/* CHAT INPUT */}
        <View style={styles.inputWrapper}>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.attachText}>＋</Text>
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { height: Math.max(44, inputHeight) }]}
            value={input}
            onChangeText={setInput}
            placeholder="Message SheValue Therapist..."
            placeholderTextColor="#777"
            multiline
            textAlignVertical="top"
            onContentSizeChange={e =>
              setInputHeight(e.nativeEvent.contentSize.height)
            }
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <Text style={styles.sendText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* DRAWER */}
      {drawerOpen && (
        <TouchableWithoutFeedback onPress={toggleDrawer}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: drawerX }] },
        ]}
      >
        <Text style={styles.drawerTitle}>Conversations</Text>

        <TouchableOpacity onPress={startNewConversation}>
          <Text style={{ color: "#8B0000", paddingVertical: 12 }}>
            + New Conversation
          </Text>
        </TouchableOpacity>

        {conversations.map(conv => (
          <TouchableOpacity
            key={conv.id}
            onPress={() => {
              setCurrentId(conv.id);
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

  messageText: { color: "#fff", fontSize: 15 },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#2a2a2a",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 15,
  },

  attachText: { color: "#888", fontSize: 22 },

  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    maxHeight: 140,
    marginHorizontal: 8,
  },

  sendButton: {
    backgroundColor: "#8B0000",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  sendText: { color: "#fff", fontSize: 18 },

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