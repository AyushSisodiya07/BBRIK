import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function PhoneScreen({ navigation }: any) {
  const [phone, setPhone] = useState("");

  const sendOtp = async () => {
    if (phone.length !== 10) return;

    try {
      await fetch("http://192.168.25.77:5000/api/customer/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      navigation.navigate("OTP", { phone });
    } catch (error) {
      alert("Failed to send OTP. Please try again.");
    }
  };

  const continueAsGuest = () => {
    navigation.navigate("CustomerHome");
  };

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F5F6FA",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      {/* Hidden Admin Access Button */}
      <TouchableOpacity
        onPress={goToLogin}
        activeOpacity={0.6}
        style={{
          position: "absolute",
          top: 50,
          left: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "#C5C5C5", // very light grey (not noticeable)
            fontWeight: "400",
          }}
        >
          ?
        </Text>
      </TouchableOpacity>

      {/* Heading */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          marginBottom: 6,
          color: "#111",
        }}
      >
        Login
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#666",
          marginBottom: 24,
        }}
      >
        Please enter your phone number
      </Text>

      {/* Phone Input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 10,
          paddingHorizontal: 12,
          height: 52,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginRight: 8,
          }}
        >
          +91
        </Text>

        <TextInput
          placeholder="Phone number"
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={(text) =>
            setPhone(text.replace(/[^0-9]/g, ""))
          }
          style={{
            flex: 1,
            fontSize: 16,
          }}
        />
      </View>

      {/* Send OTP Button */}
      <TouchableOpacity
        onPress={sendOtp}
        disabled={phone.length !== 10}
        activeOpacity={0.8}
        style={{
          height: 52,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: phone.length === 10 ? "#E4572E" : "#ccc",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Send OTP
        </Text>
      </TouchableOpacity>

      {/* Continue as Guest */}
      <TouchableOpacity
        onPress={continueAsGuest}
        activeOpacity={0.6}
        style={{
          marginTop: 12,
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            color: "#007BFF",
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          Continue as Guest
        </Text>
      </TouchableOpacity>

      {/* Info */}
      <Text
        style={{
          marginTop: 14,
          fontSize: 12,
          color: "#666",
        }}
      >
        🔒 We will send you a one-time verification code
      </Text>
    </View>
  );
}

function alert(arg0: string) {
  throw new Error("Function not implemented.");
}
