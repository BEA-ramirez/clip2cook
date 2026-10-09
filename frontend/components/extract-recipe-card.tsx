import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type ExtractingRecipeCardProps = {
  platformName?: string;
};

export default function ExtractingRecipeCard({
  platformName = "Web",
}: ExtractingRecipeCardProps) {
  // Use lazy-initialized useState to fix the strict mode linter error
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [progress]);

  const widthInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["20%", "85%"],
  });

  return (
    <View style={styles.card}>
      <View style={styles.rowStart}>
        <View style={styles.flex1}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <ActivityIndicator size="small" color="#000000" />
            <Text style={styles.title} numberOfLines={1}>
              Analyzing Recipe...
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Extracting</Text>
            </View>
          </View>

          {/* Subtext Row */}
          <View style={styles.subtextRow}>
            <Text style={styles.subtextBlack}>
              Reading ingredients & steps...
            </Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.subtextDarkGray}>AI Processing</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.subtextLightGray}>{platformName}</Text>
          </View>
        </View>

        <View style={styles.iconContainer}>
          <MaterialIcons name="hourglass-top" size={18} color="#9ca3af" />
        </View>
      </View>

      {/* Animated Progress Bar */}
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[styles.progressBarFill, { width: widthInterpolation }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 12,
    // Soft shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  rowStart: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  title: {
    color: "#000000",
    fontWeight: "600",
    fontSize: 18,
    flex: 1,
  },
  badge: {
    backgroundColor: "#000000",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "500",
  },
  subtextRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 8,
    marginTop: 4,
  },
  subtextBlack: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 12,
  },
  dot: {
    color: "#9ca3af",
    fontSize: 12,
  },
  subtextDarkGray: {
    color: "#4b5563",
    fontSize: 12,
  },
  subtextLightGray: {
    color: "#6b7280",
    fontSize: 12,
  },
  iconContainer: {
    marginTop: 4,
  },
  progressBarBackground: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    height: 6,
    borderRadius: 9999,
    marginTop: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  progressBarFill: {
    backgroundColor: "#000000",
    height: "100%",
    borderRadius: 9999,
  },
});
