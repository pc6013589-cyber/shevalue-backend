import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={26} color="#fff" />
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>Peter</Text>
          <Text style={styles.email}>peter@email.com</Text>
        </View>
      </View>

      {/* Account Section */}
      <Text style={styles.sectionTitle}>Account</Text>

      <TouchableOpacity style={styles.item}>
        <View>
          <Text style={styles.itemText}>Relationship Status</Text>
          <Text style={styles.itemSubText}>Single</Text>
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

      {/* Legal Section */}
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

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
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