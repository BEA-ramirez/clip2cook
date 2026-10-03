import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Spacing, Typography, Radius } from "@/constants/theme";

export default function RecipeFormScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // --- FORM STATE ---
  const [title, setTitle] = useState("Homestyle Chicken Adobo");
  const [time, setTime] = useState("45 min");
  const [servings, setServings] = useState("4 servings");
  const [source, setSource] = useState("Family Notebook");

  const [ingredients, setIngredients] = useState([
    { id: "1", qty: "500 g", desc: "Chicken thighs or drumsticks" },
    { id: "2", qty: "1/2 cup", desc: "Soy sauce (dark or regular)" },
    { id: "3", qty: "1/2 cup", desc: "Cane vinegar or white vinegar" },
    { id: "4", qty: "4 cloves", desc: "Garlic, crushed and peeled" },
  ]);

  const [equipment, setEquipment] = useState([
    { id: "1", name: "Deep pot or Dutch oven", icon: "cookie" as any },
    { id: "2", name: "Chef's knife", icon: "restaurant" as any },
    { id: "3", name: "Cutting board", icon: "grid-view" as any },
  ]);
  const [newTool, setNewTool] = useState("");

  const [steps, setSteps] = useState([
    {
      id: "1",
      text: "Cut chicken into serving pieces and pat dry thoroughly with paper towels.",
    },
    {
      id: "2",
      text: "In a bowl or pot, combine chicken, soy sauce, vinegar, garlic, bay leaf, and black peppercorns.",
    },
    {
      id: "3",
      text: "Bring to a boil over medium-high heat without stirring for 3 minutes.",
    },
  ]);

  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // --- HANDLERS ---
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), qty: "", desc: "" },
    ]);
  };

  const updateIngredient = (
    id: string,
    field: "qty" | "desc",
    value: string,
  ) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing,
      ),
    );
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const addTool = () => {
    if (newTool.trim()) {
      setEquipment([
        ...equipment,
        { id: Date.now().toString(), name: newTool.trim(), icon: "kitchen" },
      ]);
      setNewTool("");
    }
  };

  const removeTool = (id: string) => {
    setEquipment(equipment.filter((tool) => tool.id !== id));
  };

  const addStep = () => {
    setSteps([...steps, { id: Date.now().toString(), text: "" }]);
  };

  const updateStep = (id: string, text: string) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, text } : step)));
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API save
    setTimeout(() => {
      setIsSaving(false);
      router.back(); // Flow 2: Return to main page
    }, 1500);
  };

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
              uri: "https://lh3.googleusercontent.com/aida/AEtjO1XpeR65Nxgcw6kDBHZ_FkWrsGPI997WoCn5DipJ6xG9EdWA4DNcv9xGUFaXIM47nuxsGX92RMwNklR_GGJd1JKCpJoxopP-r_PeM0jzB5tAoh4zACx-bWUkUHvhqPz7WfbJNdDT35siiYXu5sF-W1VP4c0w1-EFAQudnl7Px3vUUCHeWLXNEHSYuAY4rN0AUTv7XxT_7HisxsyQzTcDHPPWzsCBhW_ReArYgjE2PtsawStZ615bwHC4vzA",
            }}
            style={styles.logo}
          />
          <Text style={styles.headerTitle} numberOfLines={1}>
            New Recipe
          </Text>
        </View>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={18} color={Colors.on_primary} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* TOP CONTEXT */}
          <View style={styles.contextRow}>
            <View style={styles.contextLeft}>
              <View style={styles.badgeSolid}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeSolidText}>MANUAL ENTRY</Text>
              </View>
              <Text style={styles.draftText}>· Draft Mode</Text>
            </View>
            <View style={styles.contextRight}>
              <MaterialIcons
                name="history-edu"
                size={16}
                color={Colors.text_muted}
              />
              <Text style={styles.contextRightText}>Kitchen Log No. 42</Text>
            </View>
          </View>

          {/* TITLE & META BLOCK */}
          <View style={styles.card}>
            <Text style={styles.inputLabel}>RECIPE TITLE</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="e.g. Grandma's Lemon Butter Roast Chicken"
              placeholderTextColor={Colors.outline_variant}
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.metaInputRow}>
              <View style={styles.metaInputBox}>
                <MaterialIcons
                  name="schedule"
                  size={16}
                  color={Colors.on_surface}
                />
                <TextInput
                  style={styles.metaInput}
                  placeholder="30 min"
                  value={time}
                  onChangeText={setTime}
                />
              </View>
              <View style={styles.metaInputBox}>
                <MaterialIcons
                  name="group"
                  size={16}
                  color={Colors.on_surface}
                />
                <TextInput
                  style={styles.metaInput}
                  placeholder="4 servings"
                  value={servings}
                  onChangeText={setServings}
                />
              </View>
              <View style={styles.metaInputBox}>
                <MaterialIcons
                  name="bookmark"
                  size={16}
                  color={Colors.on_surface}
                />
                <TextInput
                  style={styles.metaInput}
                  placeholder="Source"
                  value={source}
                  onChangeText={setSource}
                />
              </View>
            </View>
          </View>

          {/* WATERMARK RIBBON */}
          <View style={styles.watermarkRibbon}>
            <View style={styles.watermarkLeft}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida/AEtjO1XpeR65Nxgcw6kDBHZ_FkWrsGPI997WoCn5DipJ6xG9EdWA4DNcv9xGUFaXIM47nuxsGX92RMwNklR_GGJd1JKCpJoxopP-r_PeM0jzB5tAoh4zACx-bWUkUHvhqPz7WfbJNdDT35siiYXu5sF-W1VP4c0w1-EFAQudnl7Px3vUUCHeWLXNEHSYuAY4rN0AUTv7XxT_7HisxsyQzTcDHPPWzsCBhW_ReArYgjE2PtsawStZ615bwHC4vzA",
                }}
                style={styles.watermarkLogo}
              />
              <Text style={styles.watermarkText}>
                Clip2Cook Kitchen Journal
              </Text>
            </View>
            <Text style={styles.watermarkTimeText}>Autosaved just now</Text>
          </View>

          {/* INGREDIENTS SECTION */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.sectionTitle}>INGREDIENTS</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>
                    {ingredients.length} items
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.convertBtn}>
                <MaterialIcons
                  name="square-foot"
                  size={14}
                  color={Colors.on_surface}
                />
                <Text style={styles.convertBtnText}>Convert units</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Specify measurable amounts, prep states, or knife cuts.
            </Text>

            <View style={styles.listContainer}>
              {ingredients.map((ing) => (
                <View key={ing.id} style={styles.itemRow}>
                  <MaterialIcons
                    name="drag-indicator"
                    size={18}
                    color={Colors.outline_variant}
                  />
                  <TextInput
                    style={styles.qtyInput}
                    placeholder="Qty"
                    value={ing.qty}
                    onChangeText={(v) => updateIngredient(ing.id, "qty", v)}
                  />
                  <TextInput
                    style={styles.descInput}
                    placeholder="Ingredient description"
                    value={ing.desc}
                    onChangeText={(v) => updateIngredient(ing.id, "desc", v)}
                  />
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => removeIngredient(ing.id)}
                  >
                    <MaterialIcons
                      name="close"
                      size={16}
                      color={Colors.text_muted}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
              <MaterialIcons name="add" size={18} color={Colors.on_surface} />
              <Text style={styles.addButtonText}>Add Ingredient</Text>
            </TouchableOpacity>
          </View>

          {/* EQUIPMENT SECTION */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>EQUIPMENT & COOKWARE</Text>
              <Text style={styles.sectionSubtitleInline}>Optional</Text>
            </View>

            <View style={styles.tagsContainer}>
              {equipment.map((tool) => (
                <View key={tool.id} style={styles.toolChip}>
                  <MaterialIcons
                    name={tool.icon}
                    size={14}
                    color={Colors.on_surface}
                  />
                  <Text style={styles.toolChipText}>{tool.name}</Text>
                  <TouchableOpacity onPress={() => removeTool(tool.id)}>
                    <MaterialIcons
                      name="close"
                      size={14}
                      color={Colors.text_muted}
                    />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.addToolContainer}>
                <TextInput
                  style={styles.addToolInput}
                  placeholder="New tool..."
                  value={newTool}
                  onChangeText={setNewTool}
                  onSubmitEditing={addTool}
                  returnKeyType="done"
                />
                <TouchableOpacity style={styles.addToolBtn} onPress={addTool}>
                  <MaterialIcons
                    name="add"
                    size={14}
                    color={Colors.on_surface}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* INSTRUCTIONS SECTION */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.sectionTitle}>INSTRUCTIONS</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>
                    {steps.length} steps
                  </Text>
                </View>
              </View>
              <Text style={styles.sectionSubtitleInline}>
                Step-by-step clarity
              </Text>
            </View>

            <View style={styles.listContainer}>
              {steps.map((step, index) => (
                <View key={step.id} style={styles.stepRow}>
                  <View style={styles.stepLeft}>
                    <View style={styles.stepNumberDot}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <MaterialIcons
                      name="drag-indicator"
                      size={16}
                      color={Colors.outline_variant}
                    />
                  </View>
                  <View style={styles.stepRight}>
                    <TextInput
                      style={styles.stepInput}
                      placeholder="Describe this step..."
                      value={step.text}
                      onChangeText={(v) => updateStep(step.id, v)}
                      multiline
                    />
                    <View style={styles.stepActions}>
                      <TouchableOpacity style={styles.stepActionBtn}>
                        <MaterialIcons
                          name="timer"
                          size={14}
                          color={Colors.text_muted}
                        />
                        <Text style={styles.stepActionBtnText}>
                          Attach timer
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.stepDeleteBtn}
                        onPress={() => removeStep(step.id)}
                      >
                        <MaterialIcons
                          name="delete"
                          size={16}
                          color={Colors.text_muted}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.addButton} onPress={addStep}>
              <MaterialIcons name="add" size={18} color={Colors.on_surface} />
              <Text style={styles.addButtonText}>Add Step</Text>
            </TouchableOpacity>
          </View>

          {/* CHEF NOTES */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>KITCHEN NOTES & TIPS</Text>
              <Text style={styles.sectionSubtitleInline}>Linen margin</Text>
            </View>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g. Do not stir after pouring vinegar to prevent raw acidity; let simmer naturally."
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>

          {/* ACTIONS */}
          <View style={styles.footerActions}>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={Colors.on_primary} />
              ) : (
                <>
                  <MaterialIcons
                    name="check"
                    size={20}
                    color={Colors.on_primary}
                  />
                  <Text style={styles.saveBtnText}>Save to Notebook</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.discardText}>Discard draft</Text>
              </TouchableOpacity>
              <Text style={styles.dot}>·</Text>
              <TouchableOpacity style={styles.exportBtn}>
                <MaterialIcons
                  name="file-download"
                  size={16}
                  color={Colors.text_muted}
                />
                <Text style={styles.discardText}>Export as Markdown</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9FB",
  },
  keyboardView: {
    flex: 1,
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
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -Spacing.xs,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
  },
  headerTitle: {
    ...Typography.headlineMd,
    color: Colors.on_surface,
    marginLeft: 4,
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
  },
  contextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  contextLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  badgeSolid: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.surface_container,
    borderWidth: 1,
    borderColor: Colors.border_default,
    borderRadius: 2,
  },
  badgeDot: {
    width: 6,
    height: 6,
    backgroundColor: Colors.on_surface,
    borderRadius: Radius.full,
  },
  badgeSolidText: {
    ...Typography.labelSm,
    color: Colors.on_surface,
  },
  draftText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    textTransform: "none",
  },
  contextRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  contextRightText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    textTransform: "none",
  },
  card: {
    backgroundColor: Colors.surface_container_lowest,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border_default,
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    marginBottom: 6,
  },
  titleInput: {
    ...Typography.headlineLgMobile,
    color: Colors.on_surface,
    padding: 0,
    marginBottom: Spacing.sm,
  },
  metaInputRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.surface_container,
  },
  metaInputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border_default,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 2,
  },
  metaInput: {
    ...Typography.labelMd,
    color: Colors.on_surface,
    minWidth: 60,
    padding: 0,
  },
  watermarkRibbon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface_container,
    borderWidth: 1,
    borderColor: Colors.border_default,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    borderRadius: 2,
    marginBottom: Spacing.md,
  },
  watermarkLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  watermarkLogo: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  watermarkText: {
    ...Typography.labelSm,
    color: Colors.on_surface,
    textTransform: "none",
  },
  watermarkTimeText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    textTransform: "none",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    ...Typography.labelMd,
    fontWeight: "700",
    color: Colors.on_surface,
    textTransform: "uppercase",
  },
  countBadge: {
    backgroundColor: Colors.surface_container,
    borderWidth: 1,
    borderColor: Colors.border_default,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  countBadgeText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    textTransform: "none",
  },
  convertBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  convertBtnText: {
    ...Typography.labelSm,
    color: Colors.on_surface,
    textTransform: "none",
  },
  sectionSubtitle: {
    ...Typography.bodySm,
    color: Colors.text_muted,
    marginTop: -2,
    marginBottom: Spacing.sm,
  },
  sectionSubtitleInline: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    textTransform: "none",
  },
  listContainer: {
    gap: 6,
    marginVertical: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border_default,
    padding: 6,
    borderRadius: 2,
  },
  qtyInput: {
    ...Typography.labelMd,
    color: Colors.on_surface,
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.border_default,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 2,
    width: 70,
  },
  descInput: {
    flex: 1,
    ...Typography.bodyMd,
    color: Colors.on_surface,
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.border_default,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 2,
  },
  deleteBtn: {
    padding: 6,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.surface_container,
    borderWidth: 1,
    borderColor: Colors.border_default,
    paddingVertical: 8,
    borderRadius: 2,
    marginTop: Spacing.xs,
  },
  addButtonText: {
    ...Typography.bodyMd,
    fontWeight: "600",
    color: Colors.on_surface,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: Spacing.sm,
  },
  toolChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border_default,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 2,
  },
  toolChipText: {
    ...Typography.bodySm,
    fontWeight: "500",
    color: Colors.on_surface,
  },
  addToolContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface_container,
    borderWidth: 1,
    borderColor: Colors.border_default,
    borderStyle: "dashed",
    borderRadius: 2,
    paddingLeft: 10,
  },
  addToolInput: {
    ...Typography.bodySm,
    fontWeight: "600",
    color: Colors.on_surface,
    minWidth: 80,
    paddingVertical: 6,
  },
  addToolBtn: {
    padding: 6,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border_default,
    padding: 10,
    borderRadius: 2,
  },
  stepLeft: {
    alignItems: "center",
    gap: 6,
  },
  stepNumberDot: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Colors.on_surface,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    ...Typography.labelSm,
    color: Colors.surface_container_lowest,
    fontWeight: "700",
  },
  stepRight: {
    flex: 1,
    gap: 6,
  },
  stepInput: {
    ...Typography.bodyMd,
    color: Colors.on_surface,
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.border_default,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 2,
    minHeight: 60,
  },
  stepActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stepActionBtnText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    textTransform: "none",
  },
  stepDeleteBtn: {
    padding: 4,
  },
  notesInput: {
    ...Typography.bodySm,
    color: Colors.on_surface,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border_default,
    padding: 10,
    borderRadius: 2,
    minHeight: 70,
    marginTop: Spacing.sm,
  },
  footerActions: {
    paddingTop: Spacing.sm,
    gap: Spacing.md,
  },
  saveBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.lg,
  },
  saveBtnText: {
    ...Typography.headlineMd,
    fontSize: 16,
    color: Colors.on_primary,
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  discardText: {
    ...Typography.bodyMd,
    fontWeight: "500",
    color: Colors.text_muted,
  },
  dot: {
    color: Colors.border_default,
  },
});
