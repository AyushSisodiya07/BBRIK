import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

export default function SplashScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const iconTranslateY = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeInDuration = 1000;
    const staggerDelay = 150;

    const iconDrop = Animated.timing(iconTranslateY, {
      toValue: 0,
      duration: fadeInDuration,
      useNativeDriver: true,
    });

    const logoEntrance = Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: fadeInDuration,
        useNativeDriver: true,
      }),
    ]);

    Animated.sequence([
      iconDrop,
      Animated.delay(staggerDelay),
      logoEntrance,
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Login"); // ← changed to "Login"
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]); // ← added navigation dependency

  return (
    <View style={[styles.container, { backgroundColor: "#FFC107" }]}>
      <Animated.Text
        style={[
          styles.iconText,
          {
            transform: [{ translateY: iconTranslateY }],
            opacity: opacityAnim,
          },
        ]}
      >
        🧱 🏗️ 🚧
      </Animated.Text>

      <Animated.Text
        style={[
          styles.brandText,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        BRIK
      </Animated.Text>

      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        BUILDING HOMES · BUILDING TRUST
      </Animated.Text>

      <Text style={styles.bottomIconText}>👷 🪜 🧰</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: "bold",
  },
  brandText: {
    fontSize: 70,
    fontWeight: "900",
    letterSpacing: 4,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    textTransform: "uppercase",
  },
  tagline: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  bottomIconText: {
    fontSize: 28,
    marginTop: 25,
  },
});