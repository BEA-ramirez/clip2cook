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
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Spacing, Typography, Radius } from "@/constants/theme";
import { RecipeFormSchema, RecipeFormValues } from "@/schemas/recipe-schema";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateRecipe,
  useUpdateRecipe,
  useRecipeById,
} from "@/hooks/use-recipe";

// THE WRAPPER COMPONENT
// handles fetching and waiting and blocks the form from rendering
// until the data is 100% ready
export default function RecipeFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditMode = !!id;

  const { data: existingRecipe, isLoading: isFetching } = useRecipeById(
    id || "",
  );

  // Show spinner while fetching. THE FORM DOES NOT MOUNT YET.
  if (isEditMode && isFetching) {
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

  // Once data arrives (or if creating new), format data
  const initialData =
    isEditMode && existingRecipe
      ? {
          title: existingRecipe.title || "",
          description: existingRecipe.description || "",
          notes: existingRecipe.notes || "",
          recipe_by: existingRecipe.recipe_by || "",
          platform: existingRecipe.platform || "",
          source_url: existingRecipe.source_url || "",
          prep_time: existingRecipe.prep_time || "",
          yield_amount: existingRecipe.yield_amount || "",
          tags: existingRecipe.tags?.map((t: any) => t.tag_name || t) || [],
          ingredients:
            existingRecipe.ingredients?.map((ing: any) => ({
              name: ing.name || "",
              qty: ing.qty || "",
              unit: ing.unit || "",
            })) || [],
          equipment:
            existingRecipe.equipment?.map((eq: any) => ({
              name: eq.name || "",
            })) || [],
          instructions:
            existingRecipe.instructions?.map((step: any) => ({
              step_number: step.step_number,
              description: step.description || "",
              timer_seconds: step.timer_seconds
                ? String(step.timer_seconds / 60)
                : "",
            })) || [],
        }
      : {
          // for create mode
          title: "",
          description: "",
          notes: "",
          recipe_by: "",
          platform: "",
          source_url: "",
          prep_time: "",
          yield_amount: "",
          ingredients: [],
          instructions: [],
          equipment: [],
          tags: [],
        };

  // Pass the flawless data down to the actual form
  return (
    <RecipeFormContent
      initialData={initialData}
      isEditMode={isEditMode}
      recipeId={id}
    />
  );
}

// THE FORM COMPONENT
// only mounts when initialData is fully prepared. useFieldArray
// will never glitch again because the data is there at the start
function RecipeFormContent({
  initialData,
  isEditMode,
  recipeId,
}: {
  initialData: any;
  isEditMode: boolean;
  recipeId?: string;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { mutate: addRecipe, isPending: isCreating } = useCreateRecipe();
  const { mutate: editRecipe, isPending: isUpdating } = useUpdateRecipe();
  const isSaving = isCreating || isUpdating;

  const [newTool, setNewTool] = useState("");
  const [newTag, setNewTag] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(RecipeFormSchema),
    defaultValues: initialData,
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: "ingredients" });
  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({ control, name: "instructions" });
  const {
    fields: equipmentFields,
    append: appendEquipment,
    remove: removeEquipment,
  } = useFieldArray({ control, name: "equipment" });

  const currentTags = watch("tags") || [];

  const handleAddTag = (newTag: string) => {
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      setValue("tags", [...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setValue(
      "tags",
      currentTags.filter((_, i) => i !== index),
    );
  };

  const handleAddEquipment = (newEquipment: string) => {
    if (newEquipment.trim()) {
      appendEquipment({ name: newEquipment.trim() });
      setNewTool("");
    }
  };

  const onSubmit = (validData: RecipeFormValues) => {
    const payloadForApi = {
      ...validData,
      instructions: validData.instructions.map((step) => {
        const totalSeconds = step.timer_seconds
          ? Number(step.timer_seconds) * 60
          : null;
        return { ...step, timer_seconds: totalSeconds };
      }),
    };

    console.log("Passed Zod Validation! Ready for API:", payloadForApi);

    if (isEditMode && recipeId) {
      editRecipe(
        { id: recipeId, data: payloadForApi as any },
        {
          onSuccess: () => router.back(),
          onError: (error: any) => {
            console.log(JSON.stringify(error.response?.data, null, 2));
          },
        },
      );
    } else {
      addRecipe(payloadForApi as any, { onSuccess: () => router.back() });
    }
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
            {isEditMode ? "Edit Recipe" : "New Recipe"}
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
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.titleInput}
                  placeholder="e.g. Butter Roast Chicken"
                  placeholderTextColor={Colors.outline_variant}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.title && (
              <Text style={{ color: "red", fontSize: 12 }}>
                {errors.title.message}
              </Text>
            )}

            <View style={styles.metaInputRow}>
              <View style={styles.metaInputBox}>
                <MaterialIcons
                  name="schedule"
                  size={16}
                  color={Colors.on_surface}
                />
                <Controller
                  control={control}
                  name="prep_time"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.metaInput}
                      placeholder="30 min"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
              <View style={styles.metaInputBox}>
                <MaterialIcons
                  name="group"
                  size={16}
                  color={Colors.on_surface}
                />
                <Controller
                  control={control}
                  name="yield_amount"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.metaInput}
                      placeholder="4 servings"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
              <View style={styles.metaInputBox}>
                <MaterialIcons
                  name="person"
                  size={16}
                  color={Colors.on_surface}
                />
                <Controller
                  control={control}
                  name="recipe_by"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.metaInput}
                      placeholder="Recipe by"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
              <View style={styles.metaInputBox}>
                <MaterialIcons
                  name="bookmark"
                  size={16}
                  color={Colors.on_surface}
                />
                <Controller
                  control={control}
                  name="platform"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.metaInput}
                      placeholder="Source"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
              <View style={styles.metaInputBox}>
                <MaterialIcons
                  name="link"
                  size={16}
                  color={Colors.on_surface}
                />
                <Controller
                  control={control}
                  name="source_url"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.metaInput}
                      placeholder="Url"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
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
                    {ingredientFields.length} items
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.sectionSubtitle}>
              Specify measurable amounts, prep states, or knife cuts.
            </Text>

            <View style={styles.listContainer}>
              {ingredientFields.map((ing, index) => (
                <View key={ing.id} style={styles.itemRow}>
                  <MaterialIcons
                    name="drag-indicator"
                    size={18}
                    color={Colors.outline_variant}
                  />
                  <View style={{ flex: 1, gap: 4 }}>
                    <View
                      style={{ flexDirection: "row", gap: 6, marginBottom: 4 }}
                    >
                      <Controller
                        control={control}
                        name={`ingredients.${index}.qty`}
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            style={styles.qtyInput}
                            placeholder="Qty"
                            value={value}
                            onChangeText={onChange}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`ingredients.${index}.unit`}
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            style={styles.qtyInput}
                            placeholder="Unit"
                            value={value}
                            onChangeText={onChange}
                          />
                        )}
                      />
                    </View>
                    <Controller
                      control={control}
                      name={`ingredients.${index}.name`}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          style={styles.descInput}
                          placeholder="Ingredient name"
                          value={value}
                          onChangeText={onChange}
                        />
                      )}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => removeIngredient(index)}
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
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => appendIngredient({ qty: "", unit: "", name: "" })}
            >
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
              {equipmentFields.map((tool, index) => (
                <View key={tool.id} style={styles.toolChip}>
                  <MaterialIcons
                    name="restaurant"
                    size={14}
                    color={Colors.on_surface}
                  />
                  <Text style={styles.toolChipText}>{tool.name}</Text>
                  <TouchableOpacity onPress={() => removeEquipment(index)}>
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
                  onSubmitEditing={() => handleAddEquipment(newTool)}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={styles.addToolBtn}
                  onPress={() => handleAddEquipment(newTool)}
                >
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
                    {instructionFields.length} steps
                  </Text>
                </View>
              </View>
              <Text style={styles.sectionSubtitleInline}>
                Step-by-step clarity
              </Text>
            </View>

            <View style={styles.listContainer}>
              {instructionFields.map((step, index) => (
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
                    <Controller
                      control={control}
                      name={`instructions.${index}.description`}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          style={styles.stepInput}
                          placeholder="Describe this step..."
                          value={value}
                          onChangeText={onChange}
                          multiline
                        />
                      )}
                    />
                    {errors.instructions?.[index]?.description && (
                      <Text style={{ color: "red", fontSize: 10 }}>
                        Required
                      </Text>
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 6,
                      }}
                    >
                      <MaterialIcons
                        name="timer"
                        size={16}
                        color={Colors.text_muted}
                      />
                      <Controller
                        control={control}
                        name={`instructions.${index}.timer_seconds`}
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            style={{
                              ...Typography.labelSm,
                              color: Colors.primary,
                              minWidth: 60,
                              paddingVertical: 2,
                              borderBottomWidth: 1,
                              borderBottomColor: Colors.border_default,
                            }}
                            placeholder="Mins (e.g. 15)"
                            placeholderTextColor={Colors.text_muted}
                            keyboardType="numeric"
                            value={value}
                            onChangeText={onChange}
                          />
                        )}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.stepDeleteBtn}
                    onPress={() => removeInstruction(index)}
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

            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                appendInstruction({
                  step_number: instructionFields.length + 1,
                  description: "",
                })
              }
            >
              <MaterialIcons name="add" size={18} color={Colors.on_surface} />
              <Text style={styles.addButtonText}>Add Step</Text>
            </TouchableOpacity>
          </View>

          {/* TAGS SECTION */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>TAGS</Text>
              <Text style={styles.sectionSubtitleInline}>Optional</Text>
            </View>

            <View style={styles.tagsContainer}>
              {currentTags.map((tag, index) => (
                <View key={index} style={styles.toolChip}>
                  <MaterialIcons
                    name="tag"
                    size={14}
                    color={Colors.on_surface}
                  />
                  <Text style={styles.toolChipText}>{tag}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(index)}>
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
                  placeholder="New tag..."
                  value={newTag}
                  onChangeText={setNewTag}
                  onSubmitEditing={() => handleAddTag(newTag)}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={styles.addToolBtn}
                  onPress={() => handleAddTag(newTag)}
                >
                  <MaterialIcons
                    name="add"
                    size={14}
                    color={Colors.on_surface}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* CHEF NOTES */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>KITCHEN NOTES & TIPS</Text>
              <Text style={styles.sectionSubtitleInline}>Linen margin</Text>
            </View>
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.notesInput}
                  placeholder="e.g. Do not stir after pouring vinegar to prevent raw acidity; let simmer naturally."
                  value={value}
                  onChangeText={onChange}
                  multiline
                />
              )}
            />
          </View>

          {/* ACTIONS */}
          <View style={styles.footerActions}>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSubmit(onSubmit)}
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
                  <Text style={styles.saveBtnText}>
                    {isEditMode ? "Update Recipe" : "Save to Notebook"}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.discardText}>Discard draft</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// Keep your identical StyleSheet below...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9FB" },
  keyboardView: { flex: 1 },
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
  headerLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.xs },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -Spacing.xs,
  },
  logo: { width: 28, height: 28, borderRadius: Radius.sm },
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
  content: { padding: Spacing.margin },
  contextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  contextLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.xs },
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
  badgeSolidText: { ...Typography.labelSm, color: Colors.on_surface },
  draftText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    textTransform: "none",
  },
  contextRight: { flexDirection: "row", alignItems: "center", gap: 4 },
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
  watermarkLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  watermarkLogo: { width: 16, height: 16, borderRadius: 2 },
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
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
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
  convertBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
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
  listContainer: { gap: 6, marginVertical: 4 },
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
  deleteBtn: { padding: 6 },
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
  addToolBtn: { padding: 6 },
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
  stepLeft: { alignItems: "center", gap: 6 },
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
  stepRight: { flex: 1, gap: 6 },
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
  stepActionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  stepActionBtnText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    textTransform: "none",
  },
  stepDeleteBtn: { padding: 4 },
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
  footerActions: { paddingTop: Spacing.sm, gap: Spacing.md },
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
  exportBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  discardText: {
    ...Typography.bodyMd,
    fontWeight: "500",
    color: Colors.text_muted,
  },
  dot: { color: Colors.border_default },
});
