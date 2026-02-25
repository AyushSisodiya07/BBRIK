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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [role, setRole] = useState("Admin");
  const [menuVisible, setMenuVisible] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const roles = ["Admin", "Seller", "Truck", "Builder"];

  const selectRole = (selectedRole: string) => {
    setRole(selectedRole);
    setMenuVisible(false);
    setUserId("");
    setPassword("");
  };

  const handleLogin = async () => {
    if (!userId || !password) {
      Alert.alert("Error", "Please enter ID and Password");
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.25.91:5000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role,
            loginId: userId,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
        return;
      }

      // Save token & role
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("role", data.role);

      // Navigate based on returned role
      switch (data.role) {
        case "Admin":
          navigation.replace("AdminHome");
          break;
        case "Seller":
          navigation.replace("SellerHome");
          break;
        case "Truck":
          navigation.replace("TruckHome");
          break;
        case "Builder":
          navigation.replace("BuilderHome");
          break;
        default:
          Alert.alert("Error", "Unknown role received");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Role Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(!menuVisible)}
      >
        <Text style={styles.menuIcon}>⋮</Text>
      </TouchableOpacity>

      {/* Dropdown */}
      {menuVisible && (
        <View style={styles.dropdown}>
          {roles.map((item) => (
            <TouchableOpacity key={item} onPress={() => selectRole(item)}>
              <Text style={styles.dropdownItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>BRIK</Text>
        <Text style={styles.subtitle}>Login as {role}</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Back to customer */}
        <TouchableOpacity
          onPress={() => navigation.replace("PhoneEntry")}
          style={{ marginTop: 20 }}
        >
          <Text style={{ textAlign: "center", color: "#000" }}>
            ← Back to Customer
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFC107",
  },

  menuButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 20,
  },

  menuIcon: {
    fontSize: 28,
    fontWeight: "bold",
  },

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
});