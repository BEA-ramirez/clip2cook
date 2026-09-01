import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Colors, Spacing, Typography, Radius } from "@/constants/theme";
import { Search, SlidersHorizontal } from "lucide-react-native";
import CategoryPillsV2 from "@/components/saved/category-pills-v2";
import { router, useRouter } from "expo-router";

export default function SavedRecipesScreen() {
  return (
    <ScrollView style={[styles.container]}>
      <Text style={styles.title}>My Cookbook</Text>
      <Text style={styles.subtitle}>
        Your personal collection of culinary inspirations.
      </Text>
      <View style={styles.cont2}>
        <View style={styles.input}>
          <Search size={20} color={Colors.on_surface_variant} />
          <TextInput
            placeholder="Search recipes..."
            style={styles.searchText}
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => router.push("/recipe/[slug]/edit")}
        >
          <SlidersHorizontal size={24} color={Colors.on_surface_variant} />
        </TouchableOpacity>
      </View>
      <CategoryPillsV2 />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  title: {
    ...Typography.display,
  },
  subtitle: {
    ...Typography.bodyMd,
    marginBottom: Spacing.lg,
    color: Colors.on_surface_variant,
  },
  cont2: {
    flexDirection: "row",
    gap: 20,
    marginBottom: Spacing.md,
  },
  input: {
    flexDirection: "row",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    width: "78%",
    gap: 4,
    borderRadius: Radius.md,
    borderColor: Colors.surface_dim,
    backgroundColor: Colors.on_primary,
  },
  searchText: {
    flex: 1,
    ...Typography.bodyMd,
  },
  filterBtn: {
    borderWidth: 1,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.md,
    borderColor: Colors.surface_dim,
    backgroundColor: Colors.on_primary,
  },
  categoryPills: {},
});
