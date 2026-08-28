import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import {
  Wand2,
  Flame,
  UtensilsCrossed,
  Refrigerator,
} from "lucide-react-native";
import { Colors, Radius, Typography, Shadows } from "@/constants/theme"; // Assuming your theme file
import { useRouter } from "expo-router";

const STATUS_MSGS = [
  "Crafting custom recipe",
  "Balancing flavor profiles",
  "Calculating cooking times",
  "Plating the final dish",
];

const INGREDIENTS = [
  "Chicken Breast",
  "Broccoli",
  "Soy Sauce",
  "Garlic",
  "Ginger",
];

export default function GenerateRecipeLoadingPage() {
  const router = useRouter();

  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState("");

  // message cycle every 3 seconds
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MSGS.length);
    }, 3000);
    return () => clearInterval(messageInterval);
  }, []);

  // animate the dot ellipsis every 400ms
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 400);
    return () => clearInterval(dotsInterval);
  }, []);

  // animation init
  const pingAnim1 = useRef(new Animated.Value(0)).current;
  const pingAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const chipAnims = useRef(
    INGREDIENTS.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    // ping rings, expanding and fading out
    const createPing = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
            delay: delay,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    // center icon pulse
    const iconPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    // fade in for ingredient chips
    const chipAnimations = chipAnims.map((anim) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    );

    createPing(pingAnim1, 0).start();
    createPing(pingAnim2, 1000).start();
    iconPulse.start();

    Animated.stagger(100, chipAnimations).start();
  }, []);

  const getPingStyle = (anim: Animated.Value) => ({
    transform: [
      {
        scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 2] }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [0.8, 0, 0],
    }),
  });

  return (
    <View style={styles.container}>
      {/* CENTRAL CHEF/SPARKLES GRAPHIC */}
      <View style={styles.graphicContainer}>
        {/* Pinging Outer Rings */}
        <Animated.View style={[styles.pingRing, getPingStyle(pingAnim1)]} />
        <Animated.View
          style={[
            styles.pingRing,
            { width: 140, height: 140 },
            getPingStyle(pingAnim2),
          ]}
        />

        {/* Center Pulsing Icon */}
        <Animated.View
          style={[
            styles.centerIconBox,
            {
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1.1],
                  }),
                },
              ],
            },
          ]}
        >
          <Wand2 size={48} color={Colors.primary_container} />

          {/* Mini Floating Icons */}
          <View style={styles.floatingIcon1}>
            <Flame size={20} color={Colors.primary_fixed_dim} />
          </View>
          <View style={styles.floatingIcon2}>
            <UtensilsCrossed
              size={20}
              color={Colors.tertiary_fixed_dim || "#59d5fb"}
            />
          </View>
        </Animated.View>
      </View>

      {/* DYNAMIC TEXT */}
      <View style={styles.textContainer}>
        <Text style={styles.statusTitle}>
          {STATUS_MSGS[messageIndex]}
          {dots}
        </Text>
        <Text style={styles.statusSubtitle}>
          Our AI chef is reviewing your pantry.
        </Text>
      </View>

      {/* PANTRY INGREDIENTS LIST */}
      <View style={styles.pantryCard}>
        <View style={styles.pantryHeader}>
          <Refrigerator size={16} color={Colors.secondary} />
          <Text style={styles.pantryTitle}>YOUR PANTRY</Text>
        </View>

        <View style={styles.chipRow}>
          {INGREDIENTS.map((ingredient, index) => (
            <Animated.View
              key={index}
              style={[
                styles.chip,
                {
                  opacity: chipAnims[index],
                  transform: [
                    {
                      translateY: chipAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [15, 0], // Slide up from 15px below
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.chipText}>{ingredient}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* CANCEL BUTTON */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()} // Safely go back to the previous screen!
      >
        <Text style={styles.cancelText}>Cancel Generation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  graphicContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 48,
  },
  pingRing: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: Colors.primary_container + "33", // hex alpha for 20% opacity
  },
  centerIconBox: {
    width: 128,
    height: 128,
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.level2,
  },
  floatingIcon1: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  floatingIcon2: {
    position: "absolute",
    bottom: 16,
    left: 8,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
    minHeight: 60, // Prevents layout jumping when text changes length
  },
  statusTitle: {
    ...Typography.headlineLgMobile,
    color: Colors.on_surface,
    marginBottom: 8,
    textAlign: "left", // Keep left aligned so the dots don't wiggle the text
    width: 260, // Fixed width prevents the text from re-centering when dots are added
  },
  statusSubtitle: {
    ...Typography.bodySm,
    color: Colors.on_surface_variant,
  },
  pantryCard: {
    width: "100%",
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: Radius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.surface_container,
    marginBottom: 32,
    ...Shadows.level1,
  },
  pantryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  pantryTitle: {
    ...Typography.dataMono,
    fontSize: 12,
    color: Colors.secondary,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap", // The magic trick you learned earlier!
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface_container,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.surface_dim,
  },
  chipText: {
    ...Typography.dataMono,
    fontSize: 12,
    color: Colors.on_surface,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Radius.pill,
  },
  cancelText: {
    ...Typography.bodyMdSb,
    color: Colors.secondary,
  },
});
