import React, { createContext, useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Radius, Typography } from "@/constants/theme"; // Adjust your imports

// 1. Define what our context looks like
interface SnackbarContextType {
  showSnackbar: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

// 2. The Provider component that wraps your app
export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showSnackbar = (msg: string) => {
    setMessage(msg);
    setIsVisible(true);
  };

  // =========================================================================
  // 🧠 YOUR CHALLENGE: THE AUTO-DISMISS LOGIC
  // If `isVisible` becomes true, how do you set it back to false after 3000ms?
  // Hint: You'll need `setTimeout` and a cleanup function inside this useEffect!
  // =========================================================================
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {/* The Actual Snackbar UI */}
      {isVisible && (
        <View style={styles.snackbar}>
          <Text style={styles.text}>{message}</Text>
        </View>
      )}
    </SnackbarContext.Provider>
  );
};

// 3. A custom hook so other screens can easily use it
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  return context;
};

const styles = StyleSheet.create({
  snackbar: {
    position: "absolute",
    bottom: 40, // Sits comfortably above the bottom edge
    alignSelf: "center",
    backgroundColor: Colors.surface_container_highest, // Dark contrast works best
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.sm,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    minWidth: 200,
  },
  text: {
    ...Typography.bodyMd,
    color: Colors.on_surface,
    textAlign: "center",
  },
});
