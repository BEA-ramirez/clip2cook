import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { Colors, Radius, Typography, Shadows } from "@/constants/theme";
import { Clock4, Sparkles } from "lucide-react-native";

type Recipe = {
  title: string;
  time: number;
  extractedBy: string;
  image: string;
};

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <TouchableOpacity style={styles.container}>
      <Image
        source={{
          uri: recipe.image,
        }}
        style={styles.recipeImage}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{recipe.title}</Text>
        <View style={styles.pills}>
          <View style={styles.timePill}>
            <Clock4 size={14} color={Colors.on_primary_container} />
            <Text style={styles.time}>{recipe.time}m</Text>
          </View>

          <View style={styles.aiPill}>
            <Sparkles size={14} color={Colors.primary_container} />
            <Text style={styles.ai}>
              {recipe.extractedBy ? "AI Extracted" : ""}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: Radius.md,
    borderColor: Colors.surface_variant,
    backgroundColor: Colors.on_primary,
    ...Shadows.level1,
  },
  recipeImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    resizeMode: "cover",
    backgroundColor: Colors.on_secondary_fixed_variant,
  },
  detailsContainer: {
    paddingHorizontal: 14,
    paddingVertical: 20,
    gap: 8,
  },
  title: {
    ...Typography.headlineLg,
  },
  pills: {
    flexDirection: "row",
    gap: 8,
  },
  timePill: {
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: 6,
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface_container_high,
  },
  time: {
    ...Typography.dataMono,
    color: Colors.on_primary_container,
  },
  ai: {
    ...Typography.dataMono,
    color: Colors.primary_container,
  },
  aiPill: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.primary_fixed_dim,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary_fixed,
  },
});
