import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

export default function SplashScreen({ navigation }: any) {
  // 1. Initial State for Animations
  // Start smaller for a bigger spring/bounce effect
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  // Start icons high up, ready to drop
  const iconTranslateY = useRef(new Animated.Value(-100)).current;
  // Start fully transparent for the logo and tagline
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 2. Enhanced Animation Sequence (Staggered/Chained for drama)
    const fadeInDuration = 1000;
    const staggerDelay = 150;

    // Phase 1: Icons drop in
    const iconDrop = Animated.timing(iconTranslateY, {
      toValue: 0,
      duration: fadeInDuration,
      useNativeDriver: true,
    });

    // Phase 2: Logo grows and fades in simultaneously (using spring for bounce)
    const logoEntrance = Animated.parallel([
      Animated.spring(scaleAnim, { 
        toValue: 1,
        friction: 5, // Controls bounciness (lower is bouncier)
        tension: 80, // Controls speed
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: fadeInDuration,
        useNativeDriver: true,
      }),
    ]);

    // Chain the animations: Icons drop, then the logo appears with a bounce
    Animated.sequence([
      iconDrop,
      Animated.delay(staggerDelay),
      logoEntrance,
    ]).start();

    // 3. Navigation Timer
    const totalDuration = 2500; // Time the complex animation
    const timer = setTimeout(() => {
      // Assuming 'Phone' is the next route name
      navigation.replace("PhoneEntry");
    }, totalDuration);

    return () => clearTimeout(timer);
  }, []);

  // Use a strong, construction-themed color palette
  const PRIMARY_BACKGROUND = "#FFC107"; // Bright, bold construction yellow
  const SECONDARY_TEXT_COLOR = "#212121"; // Near-black for maximum contrast

  return (
    // Replaced LinearGradient with a simple View using the strong yellow
    <View style={[styles.container, { backgroundColor: PRIMARY_BACKGROUND }]}>
      
      {/* Top Construction Icons (Animated Drop) */}
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

      {/* Strong Brand Name (Animated Scale & Opacity) */}
      <Animated.Text
        style={[
          styles.brandText,
          {
            color: SECONDARY_TEXT_COLOR,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        BRIK
      </Animated.Text>

      {/* Foundation Line (Subtitle) - Delayed Fade In */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            color: SECONDARY_TEXT_COLOR,
            opacity: opacityAnim,
          },
        ]}
      >
        BUILDING HOMES · BUILDING TRUST
      </Animated.Text>

      {/* Bottom Tools/Safety (Subtle contrast) */}
      <Text style={styles.bottomIconText}>
        👷 🪜 🧰
      </Text>
    </View>
  );
}

// StyleSheet for cleaner code and better structure
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  brandText: {
    fontSize: 70, // Bolder
    fontWeight: "900",
    // Note: 'sans-serif-condensed' is a specific Android font. 
    // It is used here for stylistic preference, but be aware of platform differences.
    fontFamily: "sans-serif-condensed", 
    letterSpacing: 4, 
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Subtle shadow for pop
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    textTransform: "uppercase",
  },
  tagline: {
    marginTop: 15,
    fontSize: 16, 
    fontWeight: "800", // Bolder
    fontFamily: "sans-serif",
    letterSpacing: 1.5,
  },
  bottomIconText: {
    fontSize: 28,
    marginTop: 25,
  }
});