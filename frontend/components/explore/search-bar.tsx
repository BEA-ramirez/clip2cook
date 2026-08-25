import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Search, Sparkles } from "lucide-react-native";
import { Colors, Radius, Typography, Spacing } from "@/constants/theme";

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.search}>
        <Search size={20} color={Colors.on_primary_container} />
      </TouchableOpacity>
      <TextInput
        placeholder="Search recipes, ingredients, or paste url"
        style={styles.input}
      />
      <TouchableOpacity style={styles.ai}>
        <Sparkles size={20} color={Colors.on_primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 2,
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.outline_variant,
    width: "100%",
    padding: 6,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
  },
  search: {
    color: Colors.on_primary_container,
    padding: 4,
  },
  input: {
    width: "75%",
    ...Typography.bodyMd,
  },
  ai: {
    borderRadius: Radius.md,
    backgroundColor: Colors.primary_container,
    padding: 10,
    paddingTop: 12,
  },
});
