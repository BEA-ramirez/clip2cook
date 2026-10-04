import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Colors, Spacing, Typography, Radius } from "@/constants/theme";
import { useRecipeById } from "@/hooks/use-recipe";

export default function RecipeDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { data: recipe, isLoading, isError } = useRecipeById(id as string);

  // Interactive States
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set(["7"]),
  ); // Initially checked oil for demo
  const [checkedEquipment, setCheckedEquipment] = useState<Set<number>>(
    new Set(),
  );
  const [showTimer, setShowTimer] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);

  const toggleIngredient = (ingId: string) => {
    const newSet = new Set(checkedIngredients);
    if (newSet.has(ingId)) newSet.delete(ingId);
    else newSet.add(ingId);
    setCheckedIngredients(newSet);
  };

  const toggleEquipment = (index: number) => {
    const newSet = new Set(checkedEquipment);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setCheckedEquipment(newSet);
  };

  const copyRecipe = async () => {
    const text = `Chicken Adobo:\n- 500g chicken\n- 1/2 cup soy sauce\n- 1/2 cup cane vinegar\n- 4 cloves garlic\n- 1 dried bay leaf\n- 1 tsp black peppercorns\n- 1 tbsp oil`;
    await Clipboard.setStringAsync(text);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError || !recipe) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "red" }}>Failed to load recipe.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        >
          <Text style={{ color: Colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={20}
              color={Colors.on_surface}
            />
          </TouchableOpacity>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida/AEtjO1VQ7f-rIFAEc_K5Z8M-M8bay0j_GH0Vxpd53dVhSaUZQdhcEXOkSNGo_KTt-oIuEVpnMPk_wxQ1rT6wMbPnslB3kwxIE129gLyLWiZ1zyI_1uYlvpZgq0r8e8EJl3nYxORLu33fTXsjhsQ1f8989rA_A1TPNpKe9Xt6E4Vu35uw8jZSY1GfDJprC1WufbsMfoOUO-FYEOaT0MmBMlfXdOBYzhbTtuS6Ma42FbcLUglJGb-FOEcNLMzTtgU",
            }}
            style={styles.logo}
          />
          <Text style={styles.headerTitle} numberOfLines={1}>
            Recipe Detail
          </Text>
        </View>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={18} color={Colors.on_primary} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >
        {/* TOP ACTION ROW */}
        <View style={styles.actionRowContainer}>
          <View style={styles.actionRowSpread}>
            <View style={styles.actionRowGroup}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() =>
                  router.push({ pathname: "/(recipes)/form", params: { id } })
                }
              >
                <MaterialIcons
                  name="edit"
                  size={16}
                  color={Colors.on_surface_variant}
                />
                <Text style={styles.secondaryBtnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={copyRecipe}
              >
                <MaterialIcons
                  name={copiedStatus ? "check" : "content-copy"}
                  size={16}
                  color={Colors.on_surface_variant}
                />
                <Text style={styles.secondaryBtnText}>
                  {copiedStatus ? "Copied!" : "Copy"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={() => setShowTimer(true)}
            >
              <MaterialIcons name="timer" size={16} color={Colors.on_primary} />
              <Text style={styles.primaryActionBtnText}>30m Quick Timer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NOTE HEADER SURFACE */}
        <View style={styles.surfaceCard}>
          <View style={styles.noteHeaderTop}>
            <View>
              <Text style={styles.eyebrow}>CULINARY NOTE #042</Text>
              <Text style={styles.recipeMainTitle}>{recipe?.title}</Text>
            </View>
            <View style={styles.pinDot} />
          </View>

          <View style={styles.metaLine}>
            <View style={styles.metaItem}>
              <MaterialIcons
                name="schedule"
                size={16}
                color={Colors.text_muted}
              />
              <Text style={styles.metaText}>{recipe?.prep_time || "--"}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <MaterialIcons name="group" size={16} color={Colors.text_muted} />
              <Text style={styles.metaText}>
                {recipe?.yield_amount || "--"}
              </Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaTextBold}>
                Source:{" "}
                {recipe?.platform || recipe?.recipe_by || "Manual Entry"}
              </Text>
              {recipe?.source_url ? (
                <MaterialIcons
                  name="north-east"
                  size={14}
                  color={Colors.text_muted}
                />
              ) : null}
            </View>
          </View>

          {recipe.tags && recipe.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {recipe?.tags.map((tag: any) => (
                <View key={tag.id} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.tag_name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ACTIVE TIMER (Conditional) */}
        {showTimer && (
          <View style={styles.timerStrip}>
            <View style={styles.timerLeft}>
              <MaterialIcons name="alarm" size={20} color={Colors.primary} />
              <View>
                <Text style={styles.timerLabel}>Step 4 Simmer Countdown</Text>
                <Text style={styles.timerDigits}>25:00 remaining</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setShowTimer(false)}
              style={styles.timerClose}
            >
              <MaterialIcons name="close" size={18} color={Colors.text_muted} />
            </TouchableOpacity>
          </View>
        )}

        {/* INGREDIENTS SECTION */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <View style={styles.surfaceCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionNotch} />
                <Text style={styles.sectionTitle}>INGREDIENTS</Text>
              </View>
              <Text style={styles.counterText}>
                {checkedIngredients.size} / {recipe?.ingredients.length} ready
              </Text>
            </View>
            <Text style={styles.sectionDesc}>
              Tap to check off as you prepare
            </Text>

            <View style={styles.listContainer}>
              {recipe?.ingredients.map((ing: any) => {
                const isChecked = checkedIngredients.has(ing.id);
                return (
                  <TouchableOpacity
                    key={ing.id}
                    style={styles.checkRow}
                    onPress={() => toggleIngredient(ing.id)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name={isChecked ? "check-box" : "check-box-outline-blank"}
                      size={20}
                      color={isChecked ? Colors.primary : Colors.text_muted}
                      style={styles.checkBoxIcon}
                    />
                    <View style={styles.checkTextContainer}>
                      <Text
                        style={[
                          styles.ingMainText,
                          isChecked && styles.textStrikethrough,
                        ]}
                      >
                        <Text
                          style={[
                            styles.ingQty,
                            isChecked && styles.textStrikethrough,
                          ]}
                        >
                          {ing.qty ? `${ing.qty} ` : ""}
                          {ing.unit ? `${ing.unit} ` : ""}
                        </Text>
                        {ing.name}
                      </Text>
                      {ing.note ? (
                        <Text
                          style={[
                            styles.ingNoteText,
                            isChecked && styles.textStrikethrough,
                          ]}
                        >
                          {ing.note}
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* EQUIPMENT SECTION */}
        {recipe.equipment && recipe.equipment.length > 0 && (
          <View style={styles.surfaceCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionNotch} />
                <Text style={styles.sectionTitle}>EQUIPMENT</Text>
              </View>
            </View>
            <Text style={styles.sectionDesc}>Ready station before heating</Text>

            <View style={styles.equipGrid}>
              {recipe?.equipment.map((item: any, idx: number) => {
                const isChecked = checkedEquipment.has(item.id);
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.equipBox}
                    onPress={() => toggleEquipment(idx)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name={isChecked ? "check-box" : "check-box-outline-blank"}
                      size={18}
                      color={isChecked ? Colors.primary : Colors.text_muted}
                    />
                    <Text
                      style={[
                        styles.equipText,
                        isChecked && styles.textStrikethrough,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* INSTRUCTIONS SECTION */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <View style={styles.surfaceCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionNotch} />
                <Text style={styles.sectionTitle}>INSTRUCTIONS</Text>
              </View>
              <Text style={styles.utilityText}>Step-by-step utility</Text>
            </View>

            <View style={styles.stepsContainer}>
              {[...recipe.instructions]
                .sort((a, b) => a.step_number - b.step_number)
                .map((step: any) => (
                  <View
                    key={step.id}
                    style={[
                      styles.stepCard,
                      step.isCrucial && styles.stepCardCrucial,
                    ]}
                  >
                    <View
                      style={[
                        styles.stepNumberDot,
                        step.isCrucial && styles.stepNumberDotCrucial,
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepNumberText,
                          step.isCrucial && styles.stepNumberTextCrucial,
                        ]}
                      >
                        {step.step_number}
                      </Text>
                    </View>
                    <View style={styles.stepTextContainer}>
                      <Text
                        style={[
                          styles.stepMainText,
                          step.isCrucial && styles.stepMainTextCrucial,
                        ]}
                      >
                        {step.description}
                      </Text>
                      {step.note ? (
                        <Text
                          style={[
                            styles.stepNoteText,
                            step.isCrucial && styles.stepNoteTextCrucial,
                          ]}
                        >
                          {step.note}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* CHEF'S NOTE */}
        {recipe.notes ? (
          <View style={styles.chefNoteCard}>
            <MaterialIcons
              name="sticky-note-2"
              size={20}
              color={Colors.primary}
              style={{ marginTop: 2 }}
            />
            <View style={styles.chefNoteContent}>
              <Text style={styles.chefNoteTitle}>Kitchen Notebook Tip</Text>
              <Text style={styles.chefNoteText}>{recipe.notes}</Text>
            </View>
          </View>
        ) : null}

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <MaterialIcons
              name="bookmark-added"
              size={16}
              color={Colors.text_muted}
            />
            <Text style={styles.footerText}>
              Recipe saved in Clip2Cook notebook · Source link available
            </Text>
          </View>
          <Text style={styles.footerUtilityText}>
            Offline ready · Monochrome utility theme enabled
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.margin,
    paddingBottom: Spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_default,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -Spacing.xs,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: Radius.lg,
  },
  headerTitle: {
    ...Typography.headlineMd,
    color: Colors.on_surface,
    maxWidth: 200,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: Spacing.margin,
    gap: Spacing.lg,
  },
  actionRowContainer: {
    gap: 10,
  },
  actionRowSpread: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionRowGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.border_default,
    borderRadius: Radius.lg,
  },
  secondaryBtnText: {
    ...Typography.labelMd,
    color: Colors.on_surface_variant,
    textTransform: "none",
  },
  primaryActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
  },
  primaryActionBtnText: {
    ...Typography.labelSm,
    color: Colors.on_primary,
    textTransform: "none",
  },
  surfaceCard: {
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.border_default,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  noteHeaderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eyebrow: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    marginBottom: 4,
  },
  recipeMainTitle: {
    ...Typography.displayMobileBold,
    fontSize: 26, // override to match HTML mapping exactly
    color: Colors.on_surface,
  },
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    marginTop: 8,
  },
  metaLine: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginTop: Spacing.sm,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    ...Typography.labelMd,
    color: Colors.text_muted,
    textTransform: "none",
  },
  metaTextBold: {
    ...Typography.labelSm,
    color: Colors.on_surface,
    textTransform: "none",
    fontWeight: "600",
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border_default,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.surface_bright,
    borderWidth: 1,
    borderColor: Colors.border_default,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.DEFAULT,
  },
  tagText: {
    ...Typography.labelSm,
    color: Colors.on_surface_variant,
    textTransform: "none",
  },
  timerStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface_container,
    borderWidth: 1,
    borderColor: Colors.border_default,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  timerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  timerLabel: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    textTransform: "none",
  },
  timerDigits: {
    ...Typography.labelMd,
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  timerClose: {
    padding: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  sectionNotch: {
    width: 6,
    height: 16,
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
  },
  sectionTitle: {
    ...Typography.headlineTitle,
    color: Colors.on_surface,
  },
  counterText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    textTransform: "none",
  },
  utilityText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
  },
  sectionDesc: {
    ...Typography.bodySm,
    color: Colors.text_muted,
    marginTop: 4,
    marginBottom: Spacing.sm,
  },
  listContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.surface_container,
    marginTop: Spacing.xs,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface_container,
  },
  checkBoxIcon: {
    marginTop: 2,
  },
  checkTextContainer: {
    flex: 1,
  },
  ingMainText: {
    ...Typography.bodyLg,
    color: Colors.on_surface,
  },
  ingQty: {
    fontWeight: "600",
    color: Colors.on_surface,
  },
  ingNoteText: {
    ...Typography.bodySm,
    color: Colors.text_muted,
    marginTop: 2,
  },
  textStrikethrough: {
    textDecorationLine: "line-through",
    color: Colors.text_muted,
  },
  equipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: Spacing.xs,
  },
  equipBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surface_bright,
    borderWidth: 1,
    borderColor: Colors.border_default,
    borderRadius: Radius.lg,
    padding: 12,
    width: "48%", // Approx 2 columns
  },
  equipText: {
    ...Typography.bodyMd,
    color: Colors.on_surface,
    fontWeight: "500",
    flex: 1,
  },
  stepsContainer: {
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    backgroundColor: Colors.surface_bright,
    borderWidth: 1,
    borderColor: Colors.border_default,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  stepCardCrucial: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    borderColor: Colors.border_default, // Top, right, bottom
  },
  stepNumberDot: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.border_default, // Light gray in standard
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  stepNumberDotCrucial: {
    backgroundColor: Colors.primary,
  },
  stepNumberText: {
    ...Typography.labelMd,
    color: Colors.on_surface,
    fontWeight: "700",
  },
  stepNumberTextCrucial: {
    color: Colors.on_primary,
  },
  stepTextContainer: {
    flex: 1,
    gap: 4,
  },
  stepMainText: {
    ...Typography.bodyLg,
    color: Colors.on_surface,
    lineHeight: 24,
  },
  stepMainTextCrucial: {
    fontWeight: "500",
  },
  stepNoteText: {
    ...Typography.bodySm,
    color: Colors.text_muted,
  },
  stepNoteTextCrucial: {
    backgroundColor: Colors.border_default,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    color: Colors.on_surface,
    fontWeight: "600",
    marginTop: 4,
  },
  chefNoteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    backgroundColor: Colors.surface_container,
    borderWidth: 1,
    borderColor: Colors.border_default,
    borderRadius: Radius.xl,
    padding: Spacing.md,
  },
  chefNoteContent: {
    flex: 1,
    gap: 2,
  },
  chefNoteTitle: {
    ...Typography.labelMd,
    color: Colors.on_surface,
    fontWeight: "600",
  },
  chefNoteText: {
    ...Typography.bodySm,
    color: Colors.on_surface_variant,
  },
  footer: {
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  footerText: {
    ...Typography.bodySm,
    color: Colors.text_muted,
  },
  footerUtilityText: {
    ...Typography.labelSm,
    color: Colors.border_default, // Or another faint color
    textTransform: "none",
  },
});
