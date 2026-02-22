import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
 TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function OTPScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  // Generate random 4-digit OTP
  const sendOtp = () => {
    if (phone.length < 10) {
      alert("Enter valid phone number");
      return;
    }

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);

    console.log("Generated OTP:", randomOtp); // ← shows in VS Code terminal
    alert("OTP sent! Check console.");
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      navigation.replace("CustomerHome");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Login</Text>

      {/* Phone input */}
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="number-pad"
        maxLength={10}
        value={phone}
        onChangeText={setPhone}
      />

      {/* Send OTP button */}
      <TouchableOpacity style={styles.button} onPress={sendOtp}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>

      {/* OTP input */}
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={4}
        value={otp}
        onChangeText={setOtp}
      />

      {/* Verify button */}
      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFC107",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
function alert(arg0: string) {
    throw new Error("Function not implemented.");
}

