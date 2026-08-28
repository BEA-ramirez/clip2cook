"use client";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
} from "@/constants/theme";
import {
  Earth,
  Icon,
  CirclePlus,
  ShieldPlus,
  Check,
  ListPlus,
  Sparkles,
  ArrowRight,
} from "lucide-react-native";
import { useState } from "react";
import { refrigeratorFreezer } from "@lucide/lab";
import { useRouter } from "expo-router";

const foodTypeChoices = [
  "Italian",
  "Asian",
  "Mexican",
  "Mediterranean",
  "American",
  "Any",
];
const allergiesRestrictions = [
  "Gluten-Free",
  "Nut-Free",
  "Vegetarian",
  "Dairy-Free",
  "Vegan",
  "Keto",
];

export default function GenerateRecipePage() {
  const [foodType, setFoodType] = useState("");
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headerText}>Pantry Chef</Text>
        <Text style={styles.desc}>
          Tell us what&apos;s in your fridge, and our AI will craft the perfect
          recipe.
        </Text>
        {/* Food Type */}
        <View style={styles.foodTypeBox}>
          <View style={styles.foodTypeHeader}>
            <Earth color={Colors.secondary} size={22} />
            <Text style={styles.typeText}>Type of Food</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {foodTypeChoices.map((ft, ind) => (
              <TouchableOpacity
                key={ind}
                style={[styles.ftsButton, foodType === ft && styles.activeType]}
                onPress={() => {
                  if (foodType === ft) {
                    setFoodType("");
                    return;
                  }
                  setFoodType(ft);
                }}
              >
                <Text
                  style={[styles.fts, foodType === ft && styles.activeTypeText]}
                >
                  {ft}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* List of Ingredients */}
        <View style={styles.foodTypeBox}>
          <View style={styles.foodTypeHeader}>
            <Icon
              iconNode={refrigeratorFreezer}
              color={Colors.secondary}
              size={22}
            />
            <Text style={styles.typeText}>List of Ingredients</Text>
          </View>
          <Text style={{ ...Typography.bodyMd, marginBottom: Spacing.sm }}>
            Type an ingredient and press enter or comma to add.
          </Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="e.g. Chicken breast, tomatoes..."
              style={styles.input}
              placeholderTextColor={Colors.secondary_fixed_dim}
            />
            <CirclePlus color={Colors.primary} />
          </View>
        </View>
        {/* Allergies & Restrictions */}
        <View style={styles.foodTypeBox}>
          <View style={styles.foodTypeHeader}>
            <ShieldPlus color={Colors.secondary} size={22} />
            <Text style={styles.typeText}>Allergies &amp; Restrictions</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            {allergiesRestrictions.map((allergy, ind) => (
              <View key={ind} style={styles.checkBox}>
                <View
                  style={{
                    backgroundColor: Colors.primary,
                    padding: 3,
                    borderRadius: Radius.sm,
                  }}
                >
                  <Check size={14} color={Colors.background} strokeWidth={3} />
                </View>
                <Text style={styles.allergyText}>{allergy}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Additional Details */}
        <View style={styles.foodTypeBox}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.foodTypeHeader}>
              <ListPlus color={Colors.secondary} size={22} />
              <Text style={styles.typeText}>Additional Details</Text>
            </View>
            <Text style={{ ...Typography.dataMono, color: Colors.secondary }}>
              Optional
            </Text>
          </View>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="e.g. Make it spicy, Keep it under 500 calories, or Surprise me"
              style={[styles.input, styles.details]}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={Colors.secondary_fixed_dim}
            />
          </View>
        </View>
        {/* AI Button */}
        <View style={[styles.foodTypeBox, { marginBottom: 60 }]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Sparkles size={16} color={Colors.primary} strokeWidth={2} />
            <Text
              style={{
                ...Typography.dataMono,
                color: Colors.primary,
              }}
            >
              AI LOGIC READY
            </Text>
          </View>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => router.push("/loading/generate-loading")}
          >
            <Text
              style={{
                ...Typography.bodyMdSb,
                color: Colors.on_primary_container,
              }}
            >
              Generate Recipe
            </Text>
            <ArrowRight color={Colors.on_primary_container} size={20} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "flex-end",
  },
  headerText: {
    ...Typography.headlineLg,
    color: Colors.on_surface,
    marginBottom: Spacing.md,
  },
  desc: {
    ...Typography.bodyMd,
    color: Colors.secondary,
    marginBottom: Spacing.lg,
  },
  foodTypeBox: {
    padding: 22,
    backgroundColor: Colors.on_primary,
    width: "100%",
    borderRadius: Radius.lg,
    ...Shadows.level1,
    marginBottom: Spacing.lg,
  },
  foodTypeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: Spacing.md,
  },
  typeText: {
    ...Typography.bodyMdSb,
    color: Colors.on_surface,
  },
  fts: {
    ...Typography.bodyMd,
    color: Colors.secondary,
  },
  ftsButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    borderColor: Colors.surface_variant,
    backgroundColor: Colors.surface,
  },
  activeType: {
    backgroundColor: Colors.primary_container,
    borderColor: Colors.on_primary,
  },
  activeTypeText: {
    color: Colors.on_primary_container,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderColor: Colors.surface_variant,
    borderRadius: Radius.md,
  },
  input: {
    flex: 1,
    color: Colors.on_surface,
    ...Typography.bodyMd,
  },
  checkBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderRadius: Radius.md,
    width: "47%",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderColor: Colors.surface_variant,
    backgroundColor: Colors.background,
  },
  allergyText: {
    ...Typography.bodyMd,
    color: Colors.on_surface,
  },
  details: {
    minHeight: 120,
  },
  generateButton: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.md,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: Colors.primary_container,
    marginTop: Spacing.md,
  },
});
