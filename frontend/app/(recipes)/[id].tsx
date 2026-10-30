import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import { Colors, Spacing, Typography, Radius } from "@/constants/theme";
import { useRecipeById, useDeleteRecipe } from "@/hooks/use-recipe";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useSnackbar } from "@/contexts/SnackbarContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const handleStartTimer = async (
  stepNumber: number,
  timerSeconds: string | number,
  recipeId: string,
  recipeTitle: string | undefined,
  activeTimer: any,
  setActiveTimer: Function,
  setCurrentTime: Function,
) => {
  const seconds = Number(timerSeconds);
  if (isNaN(seconds) || seconds <= 0) return;

  // COMMENTED OUT NOTIFICATION CANCEL LOGIC:

  if (activeTimer?.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(
      activeTimer.notificationId,
    );
  }

  let notificationId;
  // COMMENTED OUT NOTIFICATION SCHEDULE LOGIC:

  try {
    notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Step ${stepNumber} Timer Done!`,
        body: `Your timer for "${recipeTitle || "Recipe"}" has finished.`,
        sound: true,
        data: { recipeId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
        repeats: false,
        channelId: "default",
      },
    });
  } catch (e) {
    console.log("Error scheduling notification:", e);
  }

  const now = Date.now();
  setActiveTimer({
    stepNumber,
    endTime: now + seconds * 1000,
    total: seconds,
    notificationId,
  });
  setCurrentTime(now);
};

const handleResetTimer = async (
  activeTimer: any,
  recipeId: string,
  recipeTitle: string | undefined,
  setActiveTimer: Function,
  setCurrentTime: Function,
) => {
  if (!activeTimer) return;

  // COMMENTED OUT NOTIFICATION CANCEL LOGIC:

  if (activeTimer.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(
      activeTimer.notificationId,
    );
  }

  let notificationId;
  // COMMENTED OUT NOTIFICATION SCHEDULE LOGIC:

  try {
    notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Step ${activeTimer.stepNumber} Timer Done!`,
        body: `Your timer for "${recipeTitle || "Recipe"}" has finished.`,
        sound: true,
        data: { recipeId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: activeTimer.total,
        repeats: false,
        channelId: "default",
      },
    });
  } catch (e) {
    console.log("Error resetting notification:", e);
  }

  const now = Date.now();
  setActiveTimer({
    ...activeTimer,
    endTime: now + activeTimer.total * 1000,
    notificationId,
  });
  setCurrentTime(now);
};

export default function RecipeDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();
  const { showSnackbar } = useSnackbar();
  const { id } = useLocalSearchParams();
  const { data: recipe, isLoading, isError } = useRecipeById(id as string);
  const { mutate: deleteRecipe } = useDeleteRecipe();

  // Interactive States
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set(),
  );
  const [checkedEquipment, setCheckedEquipment] = useState<Set<number>>(
    new Set(),
  );

  // Timer State with Timestamping & Notification ID tracking
  const [activeTimer, setActiveTimer] = useState<{
    stepNumber: number;
    endTime: number;
    total: number;
    notificationId?: string;
  } | null>(null);

  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [copiedStatus, setCopiedStatus] = useState(false);

  // COMMENTED OUT NOTIFICATION HANDLER & PERMISSION SETUP:

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    const setupNotifications = async () => {
      // android requires notif channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Timer Notifications",
          importance: 5, // 5 = MAX importance (replaces AndroidImportance.MAX)
          vibrationPattern: [0, 250, 250, 250],
          sound: "timer_chime.wav",
        });
      }

      // permission check
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    };

    setupNotifications();
  }, []);

  // Tick interval to update current time for accurate countdown display
  useEffect(() => {
    if (!activeTimer) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  // COMMENTED OUT NOTIFICATION RESPONSE LISTENER:

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as {
          recipeId?: string;
        };
        const targetRecipeId = data?.recipeId;

        if (targetRecipeId) {
          // Navigate back to this exact recipe detail screen
          router.push({
            pathname: "/(recipes)/[id]",
            params: { id: targetRecipeId },
          });
        }
      },
    );

    return () => subscription.remove();
  }, [router]);

  const remainingSeconds = activeTimer
    ? Math.max(0, Math.ceil((activeTimer.endTime - currentTime) / 1000))
    : 0;

  // track whether the zero-alert has already fired for the current timer session
  const hasAlertedRef = useRef(false);

  // watch for when remainingSeconds hits 0 while app is active
  useEffect(() => {
    if (!activeTimer) {
      hasAlertedRef.current = false;
      return;
    }

    if (remainingSeconds === 0 && !hasAlertedRef.current) {
      hasAlertedRef.current = true;

      // Trigger strong haptic feedback / vibration pattern
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (remainingSeconds > 0 && hasAlertedRef.current) {
      // Reset alert flag if timer is restarted or reset
      hasAlertedRef.current = false;
    }
  }, [remainingSeconds, activeTimer]);

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
    if (!recipe) return;
    const text = `${recipe.title}:\n${recipe.ingredients?.map((i: any) => `- ${i.qty || ""} ${i.unit || ""} ${i.name}`).join("\n")}\n\nInstructions:\n${recipe.instructions?.map((step: any) => `${step.step_number}. ${step.description}`).join("\n")}`;
    await Clipboard.setStringAsync(text);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const handleDeletePress = () => {
    const options = ["Delete Recipe", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: "Delete Recipe",
        message:
          "This will permanently remove this recipe from your kitchen journal.",
      },
      (selectedIndex) => {
        if (selectedIndex === destructiveButtonIndex) {
          deleteRecipe(id as string);
          showSnackbar("Recipe deleted successfully.");
          router.back();
        }
      },
    );
  };

  const startTimer = (stepNumber: number, timerSeconds: string | number) => {
    handleStartTimer(
      stepNumber,
      timerSeconds,
      id as string,
      recipe?.title,
      activeTimer,
      setActiveTimer,
      setCurrentTime,
    );
  };

  const resetTimer = () => {
    handleResetTimer(
      activeTimer,
      id as string,
      recipe?.title,
      setActiveTimer,
      setCurrentTime,
    );
  };

  const cancelTimer = async () => {
    // COMMENTED OUT NOTIFICATION CANCEL LOGIC:

    if (activeTimer?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        activeTimer.notificationId,
      );
    }

    setActiveTimer(null);
  };

  const formatCountdown = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
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
  //console.log(JSON.stringify(recipe, null, 2));
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
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={handleDeletePress}
              >
                <MaterialIcons
                  name="delete"
                  size={16}
                  color={Colors.on_surface_variant}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* NOTE HEADER SURFACE */}
        <View style={styles.surfaceCard}>
          <View style={styles.noteHeaderTop}>
            <View>
              <Text style={styles.eyebrow}>
                CULINARY NOTE ID #{recipe?.id.slice(0, 8)}
              </Text>
              <Text style={styles.recipeMainTitle}>{recipe?.title}</Text>
              <Text style={styles.metaText}>{recipe?.description}</Text>
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
              <MaterialCommunityIcons
                name="pot-steam-outline"
                size={16}
                color={Colors.text_muted}
              />
              <Text style={styles.metaText}>{recipe?.bake_time || "--"}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="chef-hat"
                size={16}
                color={Colors.text_muted}
              />
              <Text style={styles.metaText}>{recipe?.recipe_by || "--"}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="cookie"
                size={16}
                color={Colors.text_muted}
              />
              <Text style={styles.metaText}>
                {recipe?.yield_amount || "--"}
              </Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <MaterialIcons
                name="branding-watermark"
                size={16}
                color={Colors.text_muted}
              />
              <Text style={styles.metaText}>{recipe?.platform || "--"}</Text>
            </View>
            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <Text
                style={[styles.metaTextBold, { width: "80%" }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Source: {recipe?.source_url || "Manual Entry"}
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
              {recipe.tags.map((tag: any, index: number) => {
                const displayTag =
                  typeof tag === "object" ? tag?.tag_name : tag;
                return (
                  <View key={tag?.id || index} style={styles.tag}>
                    <Text style={styles.tagText}>{displayTag}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* INGREDIENTS SECTION */}
        {recipe.ingredients &&
          recipe.ingredients.length > 0 &&
          (() => {
            const groupedIngredients = recipe.ingredients.reduce(
              (acc: Record<string, any[]>, ing: any) => {
                const group =
                  ing.group_name && ing.group_name.trim() !== ""
                    ? ing.group_name
                    : "Ingredients";
                if (!acc[group]) {
                  acc[group] = [];
                }
                acc[group].push(ing);
                return acc;
              },
              {},
            );

            return (
              <View style={styles.surfaceCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <View style={styles.sectionNotch} />
                    <Text style={styles.sectionTitle}>INGREDIENTS</Text>
                  </View>
                  <Text style={styles.counterText}>
                    {checkedIngredients.size} / {recipe.ingredients.length}{" "}
                    ready
                  </Text>
                </View>
                <Text style={styles.sectionDesc}>
                  Tap to check off as you prepare
                </Text>

                {(
                  Object.entries(groupedIngredients) as unknown as [
                    string,
                    any[],
                  ][]
                ).map(([groupName, items]) => (
                  <View key={groupName} style={{ marginTop: 8 }}>
                    {groupName !== "Ingredients" && (
                      <Text style={styles.subSectionHeader}>{groupName}</Text>
                    )}

                    <View style={styles.listContainer}>
                      {items.map((ing: any) => {
                        const isChecked = checkedIngredients.has(ing.id);
                        return (
                          <TouchableOpacity
                            key={ing.id}
                            style={styles.checkRow}
                            onPress={() => toggleIngredient(ing.id)}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons
                              name={
                                isChecked
                                  ? "check-box"
                                  : "check-box-outline-blank"
                              }
                              size={20}
                              color={
                                isChecked ? Colors.primary : Colors.text_muted
                              }
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
                                {ing.weight_grams
                                  ? ` (${ing.weight_grams}g)`
                                  : ""}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            );
          })()}

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
              {recipe?.equipment.map((item: any) => {
                const isChecked = checkedEquipment.has(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.equipBox}
                    onPress={() => toggleEquipment(item.id)}
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
                      {step.timer_seconds ? (
                        <View style={styles.timerBlock}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <MaterialIcons
                              name="timer"
                              size={16}
                              color={Colors.text_muted}
                            />
                            <Text
                              style={{
                                ...Typography.labelSm,
                                fontFamily:
                                  Platform.OS === "ios" ? "Menlo" : "monospace",
                                fontWeight: "500",
                                color: Colors.on_surface,
                              }}
                            >
                              {step.timer_seconds
                                ? step.timer_seconds < 60
                                  ? `${step.timer_seconds} sec Timer`
                                  : `${Math.floor(Number(step.timer_seconds / 60))} min Timer`
                                : null}
                            </Text>
                          </View>
                          <View
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: Colors.border_default,
                            }}
                          />
                          <TouchableOpacity
                            style={{
                              height: 26,
                              paddingHorizontal: 10,
                              borderRadius: Radius.sm,
                              backgroundColor: Colors.primary,
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4,
                            }}
                            onPress={() => {
                              startTimer(step.step_number, step.timer_seconds);
                            }}
                          >
                            <MaterialIcons
                              name="play-arrow"
                              size={14}
                              color={Colors.on_primary}
                            />
                            <Text
                              style={{
                                ...Typography.labelSm,
                                color: Colors.on_primary,
                              }}
                            >
                              Start
                            </Text>
                          </TouchableOpacity>
                        </View>
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

      {activeTimer && (
        <View style={[styles.floatingTimer, { bottom: insets.bottom + 20 }]}>
          <View style={styles.timerContainer}>
            <View style={styles.timerContent}>
              <MaterialIcons
                name={remainingSeconds === 0 ? "done" : "timer"}
                size={20}
                color={Colors.on_primary}
              />
            </View>
            <View>
              <Text style={{ ...Typography.labelSm, color: Colors.text_muted }}>
                Step {activeTimer.stepNumber} Timer
              </Text>
              <Text
                style={{
                  ...Typography.headlineMd,
                  fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                  color:
                    remainingSeconds === 0 ? Colors.primary : Colors.on_surface,
                  marginTop: -2,
                }}
              >
                {formatCountdown(remainingSeconds)}
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={resetTimer}
              style={{
                padding: 8,
                backgroundColor: Colors.surface,
                borderRadius: Radius.full,
              }}
            >
              <MaterialIcons
                name="refresh"
                size={20}
                color={Colors.on_surface_variant}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={cancelTimer}
              style={{
                padding: 8,
                backgroundColor: Colors.surface,
                borderRadius: Radius.full,
              }}
            >
              <MaterialIcons
                name="close"
                size={20}
                color={Colors.on_surface_variant}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    fontSize: 26,
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
  subSectionHeader: {
    ...Typography.labelSm,
    color: Colors.primary,
    fontWeight: "600",

    marginTop: 12,
    marginBottom: 4,
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
    ...Typography.bodyMd,
    color: Colors.on_surface,
  },
  ingQty: {
    ...Typography.bodyMdBold,
    color: Colors.on_surface,
  },
  textStrikethrough: {
    textDecorationLine: "line-through",
    color: Colors.text_muted,
  },
  equipGrid: {
    flexDirection: "column",
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
  },
  equipText: {
    ...Typography.bodyMd,
    color: Colors.on_surface,
  },
  stepsContainer: {
    gap: 12,
    marginTop: Spacing.sm,
  },
  stepCard: {
    flexDirection: "row",
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surface_bright,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border_default,
  },
  stepCardCrucial: {
    borderColor: Colors.primary,
  },
  stepNumberDot: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface_container,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberDotCrucial: {
    backgroundColor: Colors.primary,
  },
  stepNumberText: {
    ...Typography.labelSm,
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
    ...Typography.bodyMd,
    color: Colors.on_surface,
  },
  stepMainTextCrucial: {
    fontWeight: "600",
  },
  stepNoteText: {
    ...Typography.bodySm,
    color: Colors.text_muted,
  },
  stepNoteTextCrucial: {
    color: Colors.on_surface_variant,
  },
  timerBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    padding: 8,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border_default,
  },
  chefNoteCard: {
    flexDirection: "row",
    gap: Spacing.md,
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.border_default,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  chefNoteContent: {
    flex: 1,
    gap: 4,
  },
  chefNoteTitle: {
    ...Typography.labelMd,
    color: Colors.on_surface,
    fontWeight: "700",
  },
  chefNoteText: {
    ...Typography.bodySm,
    color: Colors.text_muted,
  },
  footer: {
    alignItems: "center",
    gap: 4,
    paddingVertical: Spacing.md,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
  },
  footerUtilityText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    fontSize: 11,
  },
  floatingTimer: {
    position: "absolute",
    left: Spacing.margin,
    right: Spacing.margin,
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.border_default,
    borderRadius: Radius.full,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timerContent: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
