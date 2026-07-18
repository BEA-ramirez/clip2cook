import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/custom-text";
import RecipeView from "@/components/recipe-view";
import Feather from "@expo/vector-icons/Feather";

export default function ViewRecipe() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          {/* <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity> */}
        </View>
        <RecipeView />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20 },
  button: {
    padding: 10,
    backgroundColor: "grey",
    borderRadius: "100%",
  },
  text: {
    fontSize: 16,
    fontWeight: "semibold",
  },
});
