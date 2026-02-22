import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

/* ✅ Test Admin Credentials */
const TEST_ADMIN = {
  id: "admin123",
  password: "Admin@123",
};

export default function LoginScreen({ navigation }) {
  const [role, setRole] = useState("Customer");
  const [menuVisible, setMenuVisible] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    setMenuVisible(false);
    setUserId("");
    setPassword("");
  };

  const handleLogin = async () => {
    if (role === "Customer") {
      navigation.navigate("OTP");
      return;
    }

    try {
      if (role === "Admin") {
        // 🔐 Local admin login (no backend)
        if (userId === TEST_ADMIN.id && password === TEST_ADMIN.password) {
          navigation.replace("AdminHome");
        } else {
          Alert.alert("Login Failed", "Invalid Admin ID or Password");
        }
      } else if (role === "Seller") {
        navigation.replace("SellerHome");
      } else if (role === "Truck") {
        navigation.replace("TruckHome");
      } else if (role === "Builder") {
        navigation.replace("BuilderHome");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Three-dot menu */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(!menuVisible)}
      >
        <Text style={styles.menuIcon}>⋮</Text>
      </TouchableOpacity>

      {/* Dropdown menu */}
      {menuVisible && (
        <View style={styles.dropdown}>
          {["Customer", "Seller", "Admin", "Truck", "Builder"].map((item) => (
            <TouchableOpacity key={item} onPress={() => selectRole(item)}>
              <Text style={styles.dropdownItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>BRIK</Text>
        <Text style={styles.subtitle}>Login as {role}</Text>

        {/* Login inputs */}
        {role !== "Customer" && (
          <>
            <TextInput
              placeholder={`${role} ID`}
              style={styles.input}
              placeholderTextColor="#666"
              value={userId}
              onChangeText={setUserId}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
            />
          </>
        )}

        {/* Login button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* 🔐 Helper text for testing */}
        {role === "Admin" && (
          <Text style={styles.helper}>
            Test Admin → ID: admin123 | Pass: Admin@123
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFC107" },

  menuButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 20,
  },

  menuIcon: { fontSize: 28, fontWeight: "bold" },

  dropdown: {
    position: "absolute",
    top: 80,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 5,
    width: 140,
    elevation: 5,
    zIndex: 30,
  },

  dropdownItem: {
    padding: 12,
    fontSize: 16,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 48,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 25,
    fontSize: 16,
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    color: "#000",
  },

  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  helper: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 12,
    color: "#333",
  },
});