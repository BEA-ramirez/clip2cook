import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  // Adding temporary styling to status boxes so you can read the backend output easily
  messageBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
  },
  successBox: { backgroundColor: "#dcfce3" },
  errorBox: { backgroundColor: "#fee2e2" },
  messageText: { fontSize: 14, fontWeight: "500" },
});

// Update this if your laptop's local IP changes
const BACKEND_URL = "http://192.168.254.110:8000/parse-recipe";

export default function CreateRecipeScreen() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleParse = async () => {
    if (!url) return;
    setStatus("loading");
    setMessage("");

    try {
      // Send the POST request to your FastAPI backend
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      });

      const json = await response.json();

      if (response.ok) {
        setStatus("success");
        // Check if it used the primary native captions path or fallback whisper path
        if (json.data.source === "native_captions") {
          setMessage(
            `Success! Found native captions.\nSnippet: ${json.data.raw_text}`,
          );
        } else {
          setMessage(`Success! ${json.data.message}`);
        }
      } else {
        setStatus("error");
        setMessage(json.detail || "The backend rejected the request.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        "Failed to reach the backend server. Make sure Uvicorn is running on your laptop and your phone is on the same Wi-Fi network.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clip2Cook</Text>
      <Text style={styles.subtitle}>Turn any YouTube video into a recipe</Text>

      <View style={{ marginTop: 20 }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
          }}
          placeholder="Paste YouTube Link here..."
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#3b82f6",
            padding: 12,
            alignItems: "center",
            borderRadius: 5,
          }}
          onPress={handleParse}
          disabled={!url || status === "loading"}
        >
          {status === "loading" ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Parse Recipe
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Show the status message container if it's not idle/loading */}
      {status !== "idle" && status !== "loading" && (
        <View
          style={[
            styles.messageBox,
            status === "success" ? styles.successBox : styles.errorBox,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: status === "success" ? "#166534" : "#991b1b" },
            ]}
          >
            {message}
          </Text>
        </View>
      )}
    </View>
  );
}
