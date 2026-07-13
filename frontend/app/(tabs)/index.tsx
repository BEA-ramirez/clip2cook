import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const BACKEND_URL = "http://192.168.254.110:8000/";

export default function Clip2CookScreen() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleParse = () => {
    if (!url) return;
    setStatus("loading");

    // We will replace this with your actual FastAPI POST request in the next step!
    setTimeout(() => {
      setStatus("success");
      setMessage("Ready to send to FastAPI!");
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Clip2Cook</Text>
        <Text style={styles.subtitle}>
          Turn any YouTube video into a recipe
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Paste YouTube Link here..."
          placeholderTextColor="#94a3b8"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.button, !url && styles.buttonDisabled]}
          onPress={handleParse}
          disabled={!url || status === "loading"}
        >
          {status === "loading" ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Parse Recipe</Text>
          )}
        </TouchableOpacity>
      </View>

      {status === "success" && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 24,
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  successBox: {
    marginTop: 24,
    backgroundColor: "#dcfce3",
    borderColor: "#86efac",
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  successText: {
    color: "#166534",
    fontWeight: "600",
  },
});
