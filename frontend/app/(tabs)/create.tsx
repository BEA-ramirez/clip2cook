import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Touchable,
} from "react-native";
import { Text } from "@/components/custom-text";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

// Update this if your laptop's local IP changes
const BACKEND_URL = "http://192.168.254.108:8000/parse-recipe";

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  grams_amount: number | null;
}

interface RecipeData {
  title: string;
  recipe_by: string;
  description: string;
  prep_time_minutes: number | null;
  bake_time_minutes: number | null;
  servings: number;
  yield_description: string | null;
  equipment: string[];
  temp_or_heat: string | null;
  ingredients: Ingredient[];
  instructions: string[];
  notes: string[] | null;
  image_url: string[] | null;
  source_url: string | null;
}

export default function CreateRecipeScreen() {
  // get exact measurements of the phone
  const insets = useSafeAreaInsets();

  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [mode, setMode] = useState<"link" | "add">("link");

  const handleParse = async () => {
    if (!url) return;
    setStatus("loading");
    setMessage("");
    setRecipe(null);

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
        if (json.data.source === "native_transcript") {
          setMessage(`Success! Found native captions.`);
        } else {
          setMessage(`Success! ${json.data.message}`);
        }
        setRecipe(json.data.recipe);
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

  console.log(JSON.stringify(recipe, null, 2));
  console.log("hello");

  return (
    <ScrollView
      style={[
        styles.container,
        // apply the top notch height as padding to the top of the screen
        { paddingTop: insets.top },
      ]}
      contentContainerStyle={{
        // apply the bottom home-bar height as padding to the bottom of the scroll content
        paddingBottom: insets.bottom + 40,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <View style={styles.switch}>
          <TouchableOpacity
            onPress={() => setMode("link")}
            style={[
              styles.mode,
              mode === "link" ? { backgroundColor: "grey" } : {},
            ]}
          >
            <AntDesign
              name="link"
              size={18}
              color={mode === "link" ? "white" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode("add")}
            style={[
              styles.mode,
              mode === "add" ? { backgroundColor: "grey" } : {},
            ]}
          >
            <AntDesign
              name="edit"
              size={18}
              color={mode === "add" ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {mode === "link" ? (
        <View>
          <Text style={styles.title}>Clip2Cook</Text>
          <Text style={styles.subtitle}>
            Turn any YouTube video into a recipe
          </Text>

          <View style={{ marginTop: 20 }}>
            <TextInput
              style={{
                borderWidth: 1.5,
                borderBottomWidth: 4,
                borderColor: "#221130",
                padding: 10,
                paddingTop: 13,
                paddingBottom: 13,
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
                backgroundColor: "#ff6f6b",
                padding: 13,
                alignItems: "center",
                borderRadius: 5,
              }}
              onPress={handleParse}
              disabled={!url || status === "loading"}
            >
              {status === "loading" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#221130", fontWeight: "bold" }}>
                  Parse Recipe
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.add}
              onPress={() => router.push("/add-recipe")}
            >
              <AntDesign name="plus" size={12} color="black" />
              <Text>Create own recipe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.add}
              onPress={() => router.push("/view-recipe")}
            >
              <AntDesign name="plus" size={12} color="black" />
              <Text>View recipe</Text>
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
      ) : (
        <View>
          <Text style={styles.title}>Add Recipe</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbeee7", //fbeee7, ffcfd7, faeadd, f6dddd
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#221130",
  },
  subtitle: {
    fontSize: 16,
    color: "#645663",
    textAlign: "center",
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
  switch: {
    flexDirection: "row",
    gap: 3,
    marginTop: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
  },
  mode: {
    padding: 4,
    borderRadius: 5,
  },
  add: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 3,
  },
});
