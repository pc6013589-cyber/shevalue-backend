import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Privacy Policy</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.text}>
SheValue respects your privacy. This Privacy Policy explains how we collect, use,
and protect information when you use the SheValue mobile application.

Information We Collect

• Messages submitted for analysis
• Relationship status selected in the app
• Screenshots uploaded for analysis
• Basic account information such as name and email

How We Use Information

The information provided is used to generate AI-powered relationship insights
through the SheValue Analyzer and Therapist features.

Third-Party Services

SheValue may use third-party AI services to process message analysis. These
services process only the information necessary to generate responses.

Data Security

We take reasonable measures to protect user data from unauthorized access.

User Control

Users can clear messages or analysis results inside the app at any time.

Children's Privacy

SheValue is not intended for users under the age of 13.

Updates

We may update this Privacy Policy from time to time.

Contact

support@shevalue.app
        </Text>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#000",
    padding:20
  },

  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:20
  },

  title:{
    color:"#fff",
    fontSize:20,
    fontWeight:"bold"
  },

  text:{
    color:"#ddd",
    fontSize:15,
    lineHeight:22
  }

});