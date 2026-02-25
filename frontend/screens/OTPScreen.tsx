import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";

type RootStackParamList = {
  Otp: { phone: string };
  CustomerHome: { token: string };
  Customer: {
    screen: string;
    params: { token: string };
  };
};

const OtpScreen = () => {
  const [otp, setOtp] = useState("");

  const route = useRoute<RouteProp<RootStackParamList, "Otp">>();
  const { phone } = route.params;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const verifyOtp = async () => {
    if (otp.length !== 4) {
      Alert.alert("Error", "Enter 4-digit OTP");
      return;
    }

    try {
      const res = await fetch(
        "http:// 192.168.25.128:5000/api/customer/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, otp }),
        }
      );

      const data = await res.json();

      if (data.success) {
        navigation.reset({
  index: 0,
  routes: [
    {
      name: "CustomerHome",
      
        params: { token: data.token },
      
    },
  ],
});

      } else {
        Alert.alert("Error", data.message || "Verification failed");
      }
    } catch {
      Alert.alert("Error", "Server not reachable");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>OTP Verification</Text>

        <Text style={styles.subtitle}>
          Enter the verification code sent to{"\n"}{phone}
        </Text>

        {/* Single OTP Input */}
        <TextInput
          style={styles.otpInput}
          keyboardType="number-pad"
          maxLength={4}
          value={otp}
          onChangeText={(text) =>
            setOtp(text.replace(/[^0-9]/g, ""))
          }
          placeholder="____"
          placeholderTextColor="#aaa"
        />

        {/* Verify Button */}
        <TouchableOpacity
          onPress={verifyOtp}
          disabled={otp.length !== 4}
          style={[
            styles.button,
            otp.length === 4 ? styles.active : styles.disabled,
          ]}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F7",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  otpInput: {
    borderWidth: 1.5,
    borderColor: "#E4572E",
    borderRadius: 10,
    height: 55,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 12,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundColor: "#E4572E",
  },
  disabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default OtpScreen;