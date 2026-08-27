import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { Link2, Wand2 } from "lucide-react-native";
import { Colors, Radius, Typography, Shadows } from "@/constants/theme";

const LOG_MESSAGES = [
  "> Locating ingredient list...",
  "> Found 12 ingredients.",
  "> Parsing measurements...",
  "> Staging instructional steps...",
  "> Normalizing quantities...",
  "> Formatting final recipe map...",
];

export default function ExtractLoadingPage() {
  const [logs, setLogs] = useState([
    "> Initializing AI Extractor...",
    "> Parsing DOM structure...",
  ]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [progressText, setProgressText] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 10800ms = 6 logs * 1.8 seconds each
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 10800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // false because animating 'width', not 'transform'
    }).start();

    // Listen to the animation as it runs and update our text number
    const listener = progressAnim.addListener(({ value }) => {
      setProgressText(Math.floor(value));
    });

    return () => {
      progressAnim.removeListener(listener);
    };
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Text updating effect
  useEffect(() => {
    let index = 0;
    const logInterval = setInterval(() => {
      if (index < LOG_MESSAGES.length) {
        setLogs((prevLogs) => {
          const newLogs = [...prevLogs, LOG_MESSAGES[index]];
          return newLogs.slice(-4); // Keep only the last 4 logs
        });
        index++;
      }
    }, 1800);
    return () => clearInterval(logInterval);
  }, []);

  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const scannerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createPulse = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
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

    const scanner = Animated.loop(
      Animated.timing(scannerAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    createPulse(pulseAnim1, 0).start();
    createPulse(pulseAnim2, 500).start();
    scanner.start();
  }, []);

  const getPulseStyle = (anim: Animated.Value) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 3],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [0.5, 0, 0],
    }),
  });

  return (
    <View style={styles.container}>
      {/* URL card */}
      <View style={styles.urlCard}>
        <View style={styles.iconBox}>
          <Link2 size={20} color={Colors.secondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.urlLabel}>TARGET SOURCE</Text>
          <Text style={styles.urlText} numberOfLines={1}>
            https://www.seriouseats.com/recipes/the-best-roast-potatoes
          </Text>
        </View>
      </View>

      {/* Radar */}
      <View style={styles.radarContainer}>
        {/* Pulse Rings */}
        <Animated.View style={[styles.pulseRing, getPulseStyle(pulseAnim1)]} />
        <Animated.View style={[styles.pulseRing, getPulseStyle(pulseAnim2)]} />

        {/* Core Icon */}
        <View style={styles.core}>
          <Wand2 size={40} color={Colors.primary} />

          {/* Scanning Line */}
          <Animated.View
            style={[
              styles.scannerLine,
              {
                transform: [
                  {
                    translateY: scannerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 128],
                    }),
                  },
                ],
                opacity: scannerAnim.interpolate({
                  inputRange: [0, 0.1, 0.9, 1],
                  outputRange: [0, 1, 1, 0],
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* Terminal log box */}
      <View style={styles.terminalBox}>
        <View style={styles.windowControls}>
          <View style={[styles.dot, { backgroundColor: "#ba1a1a" }]} />
          <View style={[styles.dot, { backgroundColor: Colors.surface_dim }]} />
          <View style={[styles.dot, { backgroundColor: Colors.surface_dim }]} />
        </View>

        <View style={styles.logContainer}>
          {logs.map((log, index) => {
            const isLast = index === logs.length - 1;
            return (
              <Text
                key={index}
                style={[
                  styles.logText,
                  isLast ? styles.logTextActive : styles.logTextInactive,
                ]}
              >
                {log}
                {isLast && cursorVisible ? "|" : ""}
              </Text>
            );
          })}
        </View>
      </View>
      <View style={styles.progressWrapper}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>PROCESSING</Text>
          <Text style={styles.progressNumber}>{progressText}%</Text>
        </View>

        {/* The grey background track */}
        <View style={styles.progressTrack}>
          {/* The colored animated fill */}
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* CANCEL BUTTON */}
      {/* <TouchableOpacity style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel Extraction</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: Colors.surface_container_high,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  urlCard: {
    width: "100%",
    backgroundColor: Colors.on_primary,
    padding: 16,
    borderRadius: Radius.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.surface_container,
    ...Shadows.level1,
  },
  urlLabel: {
    ...Typography.dataMono,
    color: Colors.primary,
    marginBottom: 4,
  },
  urlText: {
    ...Typography.bodySm,
    color: Colors.on_surface,
    width: 230,
  },
  radarContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  pulseRing: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.primary_container,
  },
  core: {
    width: 128,
    height: 128,
    backgroundColor: Colors.on_primary,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.surface_container_high,
    ...Shadows.level1,
  },
  scannerLine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 2,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  terminalBox: {
    width: "100%",
    backgroundColor: "#2d3133", // Dark inverse surface
    borderRadius: Radius.lg,
    padding: 20,
    ...Shadows.level1,
  },
  windowControls: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  logContainer: {
    gap: 8,
  },
  logText: {
    fontFamily: "JetBrainsMono_500Medium", // Ensure you have this font linked!
    fontSize: 13,
  },
  logTextInactive: {
    color: "#eff1f3",
    opacity: 0.7,
  },
  logTextActive: {
    color: Colors.primary_fixed || "#ffdbd0",
  },
  progressWrapper: {
    width: "100%",
    marginTop: 24,
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  progressLabel: {
    ...Typography.dataMono,
    fontSize: 12,
    color: Colors.on_surface_variant,
  },
  progressNumber: {
    ...Typography.dataMono,
    fontSize: 12,
    color: Colors.primary,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: Colors.surface_container_high,
    borderRadius: Radius.pill,
    overflow: "hidden", // Keeps the inner fill perfectly rounded
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary_container,
    borderRadius: Radius.pill,
  },

  // --- CANCEL BUTTON STYLES ---
  cancelButton: {
    marginTop: 32,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: Radius.md,
  },
  cancelButtonText: {
    ...Typography.bodyMdSb,
    color: Colors.on_surface_variant,
  },
});
