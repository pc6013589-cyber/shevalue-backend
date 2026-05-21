import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function TherapistScreen() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [inputHeight, setInputHeight] = useState(40);

  const handleChat = () => {
    setReply(
      "Thank you for sharing. Let’s slow down and think clearly about your value and boundaries."
    );
    setMessage("");
    setInputHeight(40);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SheValue Therapist Mode</Text>

      <View style={styles.chatBox}>
        {reply !== "" && <Text style={styles.reply}>{reply}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              height: Math.min(Math.max(40, inputHeight), 150),
            },
          ]}
          placeholder="Talk to the therapist..."
          placeholderTextColor="#777"
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="top"
          scrollEnabled={false}
          onContentSizeChange={(e) =>
            setInputHeight(e.nativeEvent.contentSize.height)
          }
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleChat}>
          <Text style={styles.sendText}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1e1e1e",
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#fff",
  },

  chatBox: {
    flex: 1,
    marginBottom: 10,
  },

  reply: {
    fontSize: 16,
    color: "#fff",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#2a2a2a",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    paddingHorizontal: 10,
    maxHeight: 150,
  },

  sendButton: {
    backgroundColor: "#8B0000",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  sendText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});