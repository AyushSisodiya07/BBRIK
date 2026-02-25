import React from "react";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";

export default function HelpSupportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Customer Care</Text>
        <Text style={styles.value}>+91 98765 00000</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Email</Text>
        <Text style={styles.value}>support@bbrik.com</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Working Hours</Text>
        <Text style={styles.value}>Mon - Sat • 9 AM - 7 PM</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB", padding: 20 },
  title: { fontSize: 24, fontWeight: "900", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  label: { fontSize: 13, color: "#6B7280" },
  value: { fontSize: 16, fontWeight: "800", marginTop: 4 },
});