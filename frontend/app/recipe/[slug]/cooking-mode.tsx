import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from "react-native";
import { Sun, X, Timer, Utensils, Check } from "lucide-react-native";
import { useRouter } from "expo-router";

// I extracted the colors from your Tailwind config so this works instantly!
const Colors = {
  surface: "#f7f9fb",
  surface_container_lowest: "#ffffff",
  surface_container: "#eceef0",
  surface_variant: "#e0e3e5",
  on_surface: "#191c1e",
  on_surface_variant: "#594139",
  primary: "#ab3500",
  primary_container: "#ff6b35", // The bright orange
  outline: "#8d7168",
  outline_variant: "#e1bfb5",
};

export default function CookingModeScreen() {
  const router = useRouter();
  // Tracks which step card is currently highlighted
  const [activeStep, setActiveStep] = useState(1);

  // --- SCREEN AWAKE PULSE ANIMATION ---
  const pulseAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* TOP ACTION BAR */}
      <View style={styles.header}>
        <Animated.View style={[styles.awakeStatus, { opacity: pulseAnim }]}>
          <Sun size={18} color={Colors.primary_container} />
          <Text style={styles.awakeText}>SCREEN AWAKE</Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={20} color={Colors.on_surface} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* RECIPE TITLE & META */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Creamy Garlic Parmesan Pasta</Text>

          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Timer size={16} color={Colors.on_surface_variant} />
              <Text style={styles.badgeText}>20 mins</Text>
            </View>
            <View style={styles.badge}>
              <Utensils size={16} color={Colors.on_surface_variant} />
              <Text style={styles.badgeText}>4 Servings</Text>
            </View>
          </View>
        </View>

        {/* INGREDIENTS SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>

          <IngredientItem text="1 lb Fettuccine pasta" />
          <IngredientItem text="4 cloves Garlic, minced" />
          <IngredientItem text="1 cup Heavy cream" />
        </View>

        {/* STEPS SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>

          <StepCard
            stepNum={1}
            text="Boil a large pot of salted water. Add pasta and cook until al dente, about 8-10 minutes. Reserve 1/2 cup pasta water before draining."
            isActive={activeStep === 1}
            onPress={() => setActiveStep(1)}
          />
          <StepCard
            stepNum={2}
            text="In a large skillet, melt butter over medium heat. Add minced garlic and cook until fragrant, about 1 minute."
            isActive={activeStep === 2}
            onPress={() => setActiveStep(2)}
          />
          <StepCard
            stepNum={3}
            text="Stir in heavy cream and grated parmesan cheese. Simmer for 2-3 minutes until the sauce thickens slightly. Season with salt and black pepper."
            isActive={activeStep === 3}
            onPress={() => setActiveStep(3)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- SUB-COMPONENTS ---

// 1. Reusable Ingredient Checkbox Row
function IngredientItem({ text }: { text: string }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.ingredientRow, isChecked && styles.ingredientRowChecked]}
      onPress={() => setIsChecked(!isChecked)}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
        {isChecked && <Check size={14} color="#ffffff" />}
      </View>
      <Text
        style={[styles.ingredientText, isChecked && styles.textStrikethrough]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

// 2. Reusable Step Card
function StepCard({ stepNum, text, isActive, onPress }: any) {
  const [isChecked, setIsChecked] = useState(false);

  // When clicking the card, we want it to become active.
  // If we specifically click the circle, we want to toggle the checkbox.
  const handleCirclePress = () => {
    setIsChecked(!isChecked);
    onPress(); // Also make it the active step
  };

  return (
    <TouchableOpacity
      style={[
        styles.stepCard,
        isActive ? styles.stepCardActive : styles.stepCardInactive,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <TouchableOpacity
        style={[
          styles.stepCircle,
          isActive && !isChecked ? styles.stepCircleActiveBorder : null,
          isChecked ? styles.stepCircleChecked : null,
        ]}
        onPress={handleCirclePress}
      >
        {isChecked ? (
          <Check size={16} color="#ffffff" />
        ) : (
          <Text
            style={[
              styles.stepNumber,
              isActive ? styles.stepNumberActive : null,
            ]}
          >
            {stepNum}
          </Text>
        )}
      </TouchableOpacity>

      <Text
        style={[
          styles.stepText,
          isChecked ? styles.textStrikethrough : null,
          !isActive && !isChecked ? { opacity: 0.8 } : null,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface_variant,
    backgroundColor: "rgba(247, 249, 251, 0.9)", // slightly transparent surface
  },
  awakeStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  awakeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: Colors.primary_container,
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface_variant,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 80,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: Colors.surface_container,
    borderWidth: 1,
    borderColor: Colors.outline_variant,
  },
  badgeText: {
    fontFamily: "JetBrainsMono_500Medium",
    fontSize: 14,
    color: Colors.on_surface_variant,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    color: Colors.on_surface,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface_variant,
  },

  // --- INGREDIENT STYLES ---
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.surface_variant,
  },
  ingredientRowChecked: {
    borderColor: Colors.outline_variant,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.outline,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    borderColor: Colors.primary_container,
    backgroundColor: Colors.primary_container,
  },
  ingredientText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.on_surface,
    flex: 1,
  },

  // --- STEP CARD STYLES ---
  stepCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  stepCardInactive: {
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.surface_variant,
  },
  stepCardActive: {
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.primary_container, // Orange highlight
    transform: [{ scale: 1.02 }], // Gives it that popped-out effect
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface_container_lowest,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    marginTop: 2,
  },
  stepCircleActiveBorder: {
    borderColor: Colors.primary_container,
  },
  stepCircleChecked: {
    borderColor: Colors.primary_container,
    backgroundColor: Colors.primary_container,
  },
  stepNumber: {
    fontFamily: "JetBrainsMono_500Medium",
    fontSize: 14,
    color: Colors.on_surface_variant,
  },
  stepNumberActive: {
    color: Colors.primary_container,
  },
  stepText: {
    fontFamily: "Inter_400Regular",
    fontSize: 18, // Slightly larger for readability while cooking
    lineHeight: 26,
    color: Colors.on_surface,
    flex: 1,
  },

  // SHARED STYLES
  textStrikethrough: {
    textDecorationLine: "line-through",
    color: Colors.on_surface_variant,
    opacity: 0.6,
  },
});
