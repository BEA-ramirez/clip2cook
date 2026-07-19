import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import RecipeView from "@/components/recipe-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ViewRecipe() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{
        // apply the bottom home-bar height as padding to the bottom of the scroll content
        paddingBottom: insets.bottom + 40,
      }}
    >
      <RecipeView />
    </ScrollView>
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
