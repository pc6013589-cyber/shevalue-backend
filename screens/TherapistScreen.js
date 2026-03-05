import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function TherapistScreen() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const handleChat = () => {
    setReply(
      "Thank you for sharing. Let’s slow down and think clearly about your value and boundaries."
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SheValue Therapist Mode</Text>

      <TextInput
        style={styles.input}
        placeholder="Talk to the therapist..."
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <Button title="Send" onPress={handleChat} />

      {reply !== "" && (
        <Text style={styles.reply}>
          {reply}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    height: 120,
    marginBottom: 20,
  },
  reply: {
    marginTop: 20,
    fontSize: 16,
    color: "black",
  },
});