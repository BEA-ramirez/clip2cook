"use client";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import {
  Camera,
  X,
  Tag as TagIcon,
  Clock,
  Timer,
  Thermometer,
  Utensils,
  MinusCircle,
  GripVertical,
  Plus,
  Trash2,
  CookingPot, // Equivalent to skillet
} from "lucide-react-native";

// Extracted from your Tailwind config
const Colors = {
  background: "#f8fafc",
  surface: "#f7f9fb",
  surface_container_lowest: "#ffffff",
  surface_container_highest: "#e0e3e5",
  surface_variant: "#e0e3e5",
  on_surface: "#191c1e",
  on_surface_variant: "#594139",
  primary: "#ab3500",
  primary_container: "#ff6b35",
  secondary: "#565e74",
  secondary_container: "#dae2fd",
  on_secondary_container: "#5c647a",
  outline: "#8d7168",
  outline_variant: "#e1bfb5",
  error: "#ba1a1a",
};

export default function EditRecipeScreen() {
  // Sample state for the dynamic lists
  const [tags, setTags] = useState(["Dinner", "Italian"]);
  const [equipment, setEquipment] = useState(["Baking Sheet", "Large Bowl"]);
  const [ingredients, setIngredients] = useState([
    { qty: "2", unit: "lbs", name: "Baby potatoes, halved", weight: "907" },
    { qty: "3", unit: "tbsp", name: "Olive oil", weight: "42" },
  ]);
  const [instructions, setInstructions] = useState([
    "Preheat oven to 400°F (200°C). Line a baking sheet with parchment paper.",
    "In a large bowl, toss the halved potatoes with olive oil, minced garlic, grated parmesan, salt, and pepper until evenly coated.",
  ]);

  return (
    <SafeAreaView style={styles.container}>
      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerButtonText}>CANCEL</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Recipe</Text>
        <TouchableOpacity>
          <Text
            style={[
              styles.headerButtonText,
              { color: Colors.primary_container, fontWeight: "bold" },
            ]}
          >
            SAVE
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* MEDIA PLACEHOLDER */}
          <TouchableOpacity activeOpacity={0.8} style={styles.imageSection}>
            <ImageBackground
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIbYbhnKFrKtIASsNk6ZLsObHZwZBe5VqOmikJT2gkDlk8nY2h6OOSJnPs3wAomoj-OG12TciffRevyEnqJ98i7MxeWX5MeVt5y6sapnHdKnxwKprOYLEFrjxatf2wFsKJ50AitlN-dui_RB47sjzcS1hBFi6c8IBaUcUws5tgRqKqMbJbAkTfvfT10xz0u2ukCiLrQfJHkV_18XlGdwkPXJ8hq5q55r2hc7WstFxn2Fp70waO7Pgmmw",
              }}
              style={styles.imageBackground}
            >
              <View style={styles.imageOverlay} />
              <View style={styles.changePhotoBox}>
                <Camera size={32} color="#ffffff" style={{ marginBottom: 4 }} />
                <Text style={styles.changePhotoText}>CHANGE PHOTO</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* BASIC INFO CARD */}
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Recipe Title</Text>
            <CustomInput
              defaultValue="Roasted Garlic Parmesan Potatoes"
              placeholder="e.g. Grandma's Apple Pie"
            />

            <Text style={[styles.inputLabel, { marginTop: 16 }]}>
              Recipe By
            </Text>
            <CustomInput placeholder="e.g. Chef John" />

            <Text style={[styles.inputLabel, { marginTop: 16 }]}>
              Description
            </Text>
            <CustomInput
              defaultValue="Crispy on the outside, fluffy on the inside. These roasted potatoes are tossed in a savory garlic parmesan coating."
              placeholder="A brief description..."
              multiline
            />

            <Text style={[styles.inputLabel, { marginTop: 16 }]}>Tags</Text>
            <View style={styles.chipRow}>
              {tags.map((tag, i) => (
                <TagChip key={i} text={tag} onRemove={() => {}} />
              ))}
            </View>
            <CustomInput
              icon={<TagIcon size={18} color={Colors.on_surface_variant} />}
              placeholder="Add a tag..."
            />

            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <Text style={styles.inputLabel}>Prep Time</Text>
                <CustomInput
                  icon={<Clock size={16} color={Colors.on_surface_variant} />}
                  defaultValue="45 mins"
                />
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.inputLabel}>Bake Time</Text>
                <CustomInput
                  icon={<Timer size={16} color={Colors.on_surface_variant} />}
                  placeholder="e.g. 20 mins"
                />
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <Text style={styles.inputLabel}>Temp/Heat</Text>
                <CustomInput
                  icon={
                    <Thermometer size={16} color={Colors.on_surface_variant} />
                  }
                  defaultValue="400°F"
                />
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.inputLabel}>Yield</Text>
                <CustomInput
                  icon={
                    <Utensils size={16} color={Colors.on_surface_variant} />
                  }
                  defaultValue="4 servings"
                />
              </View>
            </View>
          </View>

          {/* EQUIPMENT SECTION */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Equipment</Text>
            <View style={styles.chipRow}>
              {equipment.map((eq, i) => (
                <TagChip key={i} text={eq} onRemove={() => {}} />
              ))}
            </View>
            <CustomInput
              icon={<CookingPot size={18} color={Colors.on_surface_variant} />}
              placeholder="Add equipment..."
            />
          </View>

          {/* INGREDIENTS SECTION */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ingredients</Text>

            {ingredients.map((ing, index) => (
              <View key={index} style={styles.ingredientRow}>
                <TouchableOpacity style={styles.removeBtn}>
                  <MinusCircle size={20} color={Colors.error} />
                </TouchableOpacity>

                <View style={{ width: 50 }}>
                  <CustomInput
                    defaultValue={ing.qty}
                    placeholder="Qty"
                    textAlign="center"
                  />
                </View>
                <View style={{ width: 60 }}>
                  <CustomInput defaultValue={ing.unit} placeholder="Unit" />
                </View>
                <View style={{ flex: 1 }}>
                  <CustomInput defaultValue={ing.name} placeholder="Name" />
                </View>
                <View style={{ width: 55 }}>
                  <CustomInput
                    defaultValue={ing.weight}
                    placeholder="g"
                    textAlign="center"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.dragHandle}>
                  <GripVertical size={20} color={Colors.on_surface_variant} />
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton}>
              <Plus
                size={16}
                color={Colors.primary_container}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.addButtonText}>ADD INGREDIENT</Text>
            </TouchableOpacity>
          </View>

          {/* INSTRUCTIONS SECTION */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Instructions</Text>

            {instructions.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepNumberBox}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <CustomInput
                    defaultValue={step}
                    multiline
                    placeholder="Describe this step..."
                  />
                </View>
                <TouchableOpacity style={styles.stepRemoveBtn}>
                  <X size={14} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton}>
              <Plus
                size={16}
                color={Colors.primary_container}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.addButtonText}>ADD STEP</Text>
            </TouchableOpacity>
          </View>

          {/* DANGER ZONE */}
          <View style={styles.dangerZone}>
            <TouchableOpacity style={styles.deleteButton}>
              <Trash2
                size={20}
                color={Colors.error}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.deleteButtonText}>Delete Recipe</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- SMART REUSABLE COMPONENTS ---

// 1. A Custom TextInput that automatically handles Focus rings and left-side icons!
function CustomInput({ icon, multiline, style, ...props }: any) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.inputContainer,
        isFocused && styles.inputFocused, // Applies orange border when tapped!
        multiline && {
          minHeight: 80,
          alignItems: "flex-start",
          paddingTop: 12,
        },
        style,
      ]}
    >
      {icon && <View style={styles.inputIcon}>{icon}</View>}
      <TextInput
        style={[
          styles.input,
          multiline && { minHeight: 60, textAlignVertical: "top" },
        ]}
        placeholderTextColor={Colors.secondary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={multiline}
        {...props}
      />
    </View>
  );
}

// 2. A reusable Tag Chip
function TagChip({ text, onRemove }: any) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{text}</Text>
      <TouchableOpacity onPress={onRemove} style={styles.chipRemove}>
        <X size={14} color={Colors.on_secondary_container} />
      </TouchableOpacity>
    </View>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: "rgba(247, 249, 251, 0.9)",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.primary,
  },
  headerButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    letterSpacing: 0.5,
    color: Colors.on_surface_variant,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 24, // Adds space between all cards
  },

  // Media Placeholder
  imageSection: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.surface_container_highest,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  changePhotoBox: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  changePhotoText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  // Cards & Layout
  card: {
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    color: Colors.on_surface,
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  gridItem: {
    flex: 1,
  },

  // Typography
  inputLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    letterSpacing: 0.5,
    color: Colors.on_surface_variant,
    marginBottom: 6,
    textTransform: "uppercase",
  },

  // Reusable Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline_variant,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputFocused: {
    borderColor: Colors.primary_container,
    backgroundColor: "#ffffff",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.on_surface,
  },

  // Tags/Chips
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary_container,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.on_secondary_container,
  },
  chipRemove: {
    marginLeft: 6,
  },

  // Complex Rows (Ingredients & Steps)
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  removeBtn: {
    padding: 4,
  },
  dragHandle: {
    padding: 4,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  stepNumberBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface_variant,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4, // Aligns it with the first line of text
  },
  stepNumberText: {
    fontSize: 12,
    fontFamily: "JetBrainsMono_500Medium",
    color: Colors.on_surface_variant,
  },
  stepRemoveBtn: {
    position: "absolute",
    right: -8,
    top: -8,
    backgroundColor: Colors.surface,
    borderRadius: 100,
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },

  // Add Buttons
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary_container + "1A", // 10% opacity using Hex trick!
  },
  addButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    letterSpacing: 0.5,
    color: Colors.primary_container,
  },

  // Danger Zone
  dangerZone: {
    paddingVertical: 24,
    alignItems: "center",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButtonText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.error,
  },
});
