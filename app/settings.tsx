import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const [userName, setUserName] = useState("SheValue User");
  const [userEmail, setUserEmail] = useState("No email available");
  const [signInMethod, setSignInMethod] = useState("Email");

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem("userEmail");
      const savedMethod = await AsyncStorage.getItem("signInMethod");

      if (savedEmail) {
        setUserEmail(savedEmail);

        const nameFromEmail = savedEmail.split("@")[0];
        const cleanName =
          nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        setUserName(cleanName);
      }

      if (savedMethod) {
        setSignInMethod(savedMethod);
      }
    } catch (error) {
      console.log("Load user info error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("isLoggedIn");
      await AsyncStorage.removeItem("signInMethod");
      await AsyncStorage.removeItem("userEmail");

      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Sign out error:", error);
      Alert.alert("Error", "Unable to sign out right now.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Settings</Text>

          <View style={{ width: 26 }} />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={26} color="#fff" />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.email}>{userEmail}</Text>
            <Text style={styles.provider}>Signed in with {signInMethod}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.item}>
          <View>
            <Text style={styles.itemText}>Relationship Status</Text>
            <Text style={styles.itemSubText}>Single</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <View>
            <Text style={styles.itemText}>Sign-In Method</Text>
            <Text style={styles.itemSubText}>{signInMethod}</Text>
          </View>
          <Ionicons
            name={
              signInMethod === "Apple"
                ? "logo-apple"
                : signInMethod === "Google"
                ? "logo-google"
                : "mail-outline"
            }
            size={20}
            color="#666"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <View>
            <Text style={styles.itemText}>Connected Accounts</Text>
            <Text style={styles.itemSubText}>
              Apple, Google, or Email login
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push("/notifications")}
        >
          <View>
            <Text style={styles.itemText}>Notifications</Text>
            <Text style={styles.itemSubText}>Manage app alerts</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Legal</Text>

        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push("/privacy")}
        >
          <View>
            <Text style={styles.itemText}>Privacy Policy</Text>
            <Text style={styles.itemSubText}>Read how your data is handled</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Membership</Text>

        <TouchableOpacity style={styles.item}>
          <View>
            <Text style={styles.itemText}>Current Plan</Text>
            <Text style={styles.itemSubText}>3-Day Free Trial</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8B0000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },

  email: {
    color: "#888",
    fontSize: 14,
    marginBottom: 4,
  },

  provider: {
    color: "#A4161A",
    fontSize: 13,
    fontWeight: "600",
  },

  sectionTitle: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  item: {
    backgroundColor: "#0d0d0d",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1a1a1a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  itemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 3,
  },

  itemSubText: {
    color: "#777",
    fontSize: 13,
  },

  logoutButton: {
    marginTop: 24,
    backgroundColor: "#140909",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3a1010",
  },

  logoutText: {
    color: "#A4161A",
    fontSize: 16,
    fontWeight: "700",
  },
});