import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Colors, Spacing, Typography, Radius } from "@/constants/theme";
import { useExtractRecipe } from "@/hooks/use-extract";

export default function ExtractRecipeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [url, setUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const { mutate: extractRecipe, isPending: isExtracting } = useExtractRecipe();

  // Handle clipboard paste
  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setUrl(text.trim());
        setStatusMessage("Link detected from clipboard");
        setTimeout(() => setStatusMessage(null), 3500);
      }
    } catch (error) {
      console.log("Failed to read clipboard", error);
    }
  };

  const handleExtract = () => {
    if (!url.trim()) {
      setStatusMessage("Please enter or paste a URL first");
      setTimeout(() => setStatusMessage(null), 3500);
      return;
    }

    extractRecipe(url.trim());
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* CUSTOM HEADER */}
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
          {/* Top Info */}
          <View style={styles.pageHeader}>
            <View style={styles.pageHeaderTexts}>
              <Text style={styles.pageTitle}>Add Recipe</Text>
              <Text style={styles.pageDescription}>
                Paste a video or blog link to extract ingredients and
                instructions.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <MaterialIcons name="close" size={20} color={Colors.on_surface} />
            </TouchableOpacity>
          </View>

          {/* Primary Input Surface */}
          <View style={styles.inputSection}>
            <View style={styles.urlInputContainer}>
              <MaterialIcons
                name="link"
                size={22}
                color={Colors.text_muted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.urlInput}
                placeholder="Paste recipe link..."
                placeholderTextColor={Colors.text_muted}
                value={url}
                onChangeText={setUrl}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isExtracting}
              />
              <TouchableOpacity
                style={styles.pasteButton}
                onPress={handlePaste}
                disabled={isExtracting}
              >
                <MaterialIcons
                  name="content-paste"
                  size={18}
                  color={Colors.on_surface}
                />
                <Text style={styles.pasteButtonText}>Paste</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Feedback Banner */}
            {statusMessage && (
              <View style={styles.statusChip}>
                <MaterialIcons
                  name="check-circle"
                  size={16}
                  color={Colors.on_surface}
                />
                <Text style={styles.statusChipText}>{statusMessage}</Text>
              </View>
            )}

            {/* Extract Action */}
            <TouchableOpacity
              style={styles.importButton}
              onPress={handleExtract}
              disabled={isExtracting}
              activeOpacity={0.8}
            >
              {isExtracting ? (
                <ActivityIndicator color={Colors.on_primary} size="small" />
              ) : (
                <>
                  <Text style={styles.importButtonText}>Import Recipe</Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={20}
                    color={Colors.on_primary}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Manual Entry Action */}
          <TouchableOpacity
            style={styles.manualButton}
            onPress={() => router.push("/(recipes)/form")}
            activeOpacity={0.7}
          >
            <View style={styles.manualButtonLeft}>
              <View style={styles.manualIconContainer}>
                <MaterialIcons
                  name="edit-note"
                  size={22}
                  color={Colors.on_surface}
                />
              </View>
              <View>
                <Text style={styles.manualButtonTitle}>
                  Write Recipe Manually
                </Text>
                <Text style={styles.manualButtonDesc}>
                  Type ingredients, steps, and cookware
                </Text>
              </View>
            </View>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color={Colors.text_muted}
            />
          </TouchableOpacity>

          {/* Compatibility Note */}
          <View style={styles.compatibilitySection}>
            <View style={styles.compatibilityHeader}>
              <MaterialIcons
                name="info-outline"
                size={16}
                color={Colors.text_muted}
              />
              <Text style={styles.compatibilityTitle}>COMPATIBILITY</Text>
            </View>
            <Text style={styles.compatibilityDesc}>
              Supports YouTube, TikTok, Instagram, recipe websites, and blogs.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface, // Clean white background per design
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
    marginLeft: -Spacing.xs, // Offset visual alignment
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: "contain",
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
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.md,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  pageHeaderTexts: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  pageTitle: {
    ...Typography.headlineLgMobile, // Assuming sizes match HTML
    color: Colors.on_surface,
  },
  pageDescription: {
    ...Typography.bodySm,
    color: Colors.text_muted,
    marginTop: Spacing.xs,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface_container,
    borderWidth: 1,
    borderColor: Colors.border_default,
    justifyContent: "center",
    alignItems: "center",
  },
  inputSection: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  urlInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.border_default,
    borderRadius: Radius.xl,
    padding: Spacing.xs,
  },
  inputIcon: {
    paddingLeft: Spacing.sm,
    paddingRight: Spacing.xs,
  },
  urlInput: {
    flex: 1,
    ...Typography.bodyMd,
    color: Colors.on_surface,
    paddingVertical: 12,
    paddingHorizontal: Spacing.xs,
  },
  pasteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.surface_container,
    borderWidth: 1,
    borderColor: Colors.border_default,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    borderRadius: Radius.lg,
  },
  pasteButtonText: {
    ...Typography.labelSm,
    color: Colors.on_surface,
    textTransform: "none",
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surface_container,
    borderWidth: 1,
    borderColor: Colors.border_default,
    borderRadius: Radius.lg,
  },
  statusChipText: {
    ...Typography.labelSm,
    color: Colors.on_surface,
    textTransform: "none",
  },
  importButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.primary, // Black background
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
  },
  importButtonText: {
    ...Typography.headlineMd,
    color: Colors.on_primary, // White text
    fontSize: 16, // slightly smaller headline for buttons
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border_default,
  },
  dividerText: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    paddingHorizontal: Spacing.sm,
  },
  manualButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.border_default,
    borderRadius: Radius.xl,
    padding: Spacing.md,
  },
  manualButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  manualIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface_container,
    justifyContent: "center",
    alignItems: "center",
  },
  manualButtonTitle: {
    ...Typography.headlineSm,
    fontSize: 16,
    color: Colors.on_surface,
  },
  manualButtonDesc: {
    ...Typography.bodySm,
    color: Colors.text_muted,
    marginTop: 2,
  },
  compatibilitySection: {
    marginTop: Spacing.xl * 1.5,
    alignItems: "center",
  },
  compatibilityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  compatibilityTitle: {
    ...Typography.labelSm,
    color: Colors.text_muted,
  },
  compatibilityDesc: {
    ...Typography.bodySm,
    color: Colors.text_muted,
    textAlign: "center",
    maxWidth: 260,
    marginTop: Spacing.xs,
  },
});
