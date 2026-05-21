import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import {
  useIAP,
  withIAPContext,
  requestSubscription,
  finishTransaction,
  IAPErrorCode,
} from "expo-iap";

const PRODUCT_IDS = [
  "shevalue_weekly",
  "shevalue_monthly",
  "shevalue_premium_yearly",
];

function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState("weekly");
  const [loading, setLoading] = useState(false);

  const {
    connected,
    currentPurchase,
    currentPurchaseError,
    getSubscriptions,
  } = useIAP();

  // Load subscriptions when connected
  useEffect(() => {
    if (connected) {
      getSubscriptions(PRODUCT_IDS).catch((e) =>
        console.log("Load subscriptions error:", e)
      );
    }
  }, [connected]);

  // Handle successful purchase
  useEffect(() => {
    async function handlePurchase() {
      if (currentPurchase) {
        try {
          await finishTransaction({
            purchase: currentPurchase,
            isConsumable: false,
          });
          Alert.alert("Success!", "Welcome to SheValue Premium!");
          router.replace("/(tabs)/analyzer");
        } catch (e) {
          console.log("Finish transaction error:", e);
        }
      }
    }
    handlePurchase();
  }, [currentPurchase]);

  // Handle purchase error
  useEffect(() => {
    if (currentPurchaseError) {
      if (currentPurchaseError.code !== IAPErrorCode.E_USER_CANCELLED) {
        Alert.alert(
          "Purchase Error",
          currentPurchaseError.message || "Something went wrong."
        );
      }
      setLoading(false);
    }
  }, [currentPurchaseError]);

  const handlePurchase = async () => {
    try {
      setLoading(true);

      let productId = "";
      if (selectedPlan === "weekly") productId = "shevalue_weekly";
      if (selectedPlan === "monthly") productId = "shevalue_monthly";
      if (selectedPlan === "yearly") productId = "shevalue_premium_yearly";

      await requestSubscription({ sku: productId });
    } catch (e: any) {
      console.log("Purchase error:", e);
      if (e.code !== IAPErrorCode.E_USER_CANCELLED) {
        Alert.alert("Error", e.message || "Purchase failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    { id: "weekly", title: "Weekly", price: "$3.99 / week", trial: "3 Days Free" },
    { id: "monthly", title: "Monthly", price: "$19.99 / month" },
    { id: "yearly", title: "Yearly", price: "$200 / year", highlight: "Best Value" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Start Your Free 3-Day Trial</Text>
      <Text style={styles.subtitle}>
        Unlock full access to SheValue and gain deeper relationship clarity.
      </Text>

      <View style={styles.features}>
        <Text style={styles.feature}>• Unlimited Message Analysis</Text>
        <Text style={styles.feature}>• AI Therapist Support</Text>
        <Text style={styles.feature}>• Detect Manipulation Instantly</Text>
        <Text style={styles.feature}>• Screenshot Analysis</Text>
      </View>

      <View style={styles.planContainer}>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[styles.planBox, selectedPlan === plan.id && styles.selectedPlan]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              {plan.highlight && <Text style={styles.highlight}>{plan.highlight}</Text>}
            </View>
            {plan.trial && <Text style={styles.trial}>{plan.trial}</Text>}
            <Text style={styles.planPrice}>{plan.price}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handlePurchase}
        disabled={loading || !connected}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Start Free Trial</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity disabled={loading}>
        <Text style={styles.restore}>Restore Purchases</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Subscription renews automatically unless canceled at least 24 hours before the end of the trial.
      </Text>
    </SafeAreaView>
  );
}

export default withIAPContext(PaywallScreen);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24, justifyContent: "center" },
  title: { color: "#fff", fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { color: "#aaa", textAlign: "center", marginBottom: 25 },
  features: { marginBottom: 25 },
  feature: { color: "#fff", fontSize: 15, marginBottom: 8 },
  planContainer: { marginBottom: 25 },
  planBox: { backgroundColor: "#111", borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#222" },
  selectedPlan: { borderColor: "#A4161A", backgroundColor: "#1a0d0d" },
  planTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  highlight: { color: "#A4161A", fontSize: 12 },
  trial: { color: "#A4161A", marginTop: 4 },
  planPrice: { color: "#fff", marginTop: 4 },
  button: { backgroundColor: "#A4161A", padding: 16, borderRadius: 30, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  restore: { color: "#aaa", textAlign: "center" },
  footer: { color: "#666", fontSize: 12, textAlign: "center", marginTop: 20 },
});