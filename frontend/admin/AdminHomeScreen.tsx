import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const COLORS = {
  primary: "#FFC107",
  background: "#F6F7FB",
  card: "#FFFFFF",
  text: "#111827",
  subtext: "#6B7280",
};

export default function AdminDashboardScreen({ navigation }: any) {
  const Card = ({
    title,
    subtitle,
    onPress,
  }: {
    title: string;
    subtitle: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>
          Manage users, products and orders
        </Text> 
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* USER MANAGEMENT */}
        <Text style={styles.section}>User Management</Text>

        <Card
          title="Create New User"
          subtitle="Add Seller, Builder, Architect, Truck"
          onPress={() => navigation.navigate("CreateUser")}
        />

        <Card
          title="Manage Users"
          subtitle="View, block or delete users"
          onPress={() => navigation.navigate("ManageUsers")}
        />

        {/* PRODUCT */}
        <Text style={styles.section}>Product Management</Text>

        <Card
          title="Add Product"
          subtitle="Add new product to system"
          onPress={() => navigation.navigate("AddProduct")}
        />

        <Card
          title="Manage Products"
          subtitle="Edit or remove products"
          onPress={() => navigation.navigate("ManageProducts")}
        />

        {/* ORDERS */}
        <Text style={styles.section}>Orders</Text>

        <Card
          title="View Orders"
          subtitle="Check all customer orders"
          onPress={() => navigation.navigate("Orders")}
        />

        {/* SETTINGS */}
        <Text style={styles.section}>Settings</Text>

        <Card
          title="System Settings"
          subtitle="Update app configurations"
          onPress={() => navigation.navigate("Settings")}
        />

        <Card
          title="Logout"
          subtitle="Sign out from admin panel"
          onPress={() => navigation.replace("Login")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#000",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#333",
  },

  section: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 18,
    marginBottom: 12,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  cardSubtitle: {
    fontSize: 13,
    color: COLORS.subtext,
    marginTop: 4,
  },
});