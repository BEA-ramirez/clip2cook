import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { Colors, Spacing, Typography, Radius } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { supabase } from "@/utils/supabase";
import * as Linking from "expo-linking";
import { apiClient } from "@/utils/api";
import { useMergeAnonymous } from "@/hooks/use-recipe";
import { useQueryClient } from "@tanstack/react-query";

type Theme = "system" | "light" | "dark";
type TextSize = "small" | "default" | "large";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { showSnackbar } = useSnackbar();
  const { user, isAnonymous, loading } = useAuth();
  const mergeAnonymous = useMergeAnonymous();
  const queryClient = useQueryClient();

  const [theme, setTheme] = useState<Theme>("system");
  const [textSize, setTextSize] = useState<TextSize>("default");
  const [haptics, setHaptics] = useState(true);
  const [backingUp, setBackingUp] = useState(false);

  // TODO: wire to Supabase linkIdentity
  const handleLinkGoogle = async () => {
    try {
      const redirectTo = makeRedirectUri({
        scheme: "clip2cook",
        path: "auth-callback",
      });

      const { data, error } = await supabase.auth.linkIdentity({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error) throw error;

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo,
      );

      if (result.type === "success") {
        const fragment = result.url.split("#")[1] ?? "";
        const params = new URLSearchParams(fragment);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
          showSnackbar("Google account linked!");
        } else {
          showSnackbar("No tokens returned from Google");
        }
      }
    } catch (e: any) {
      showSnackbar(e.message ?? "Failed to link account");
    }
  };

  const handleContinueWithGoogle = async () => {
    try {
      const redirectTo = makeRedirectUri({
        scheme: "clip2cook",
        path: "auth-callback",
      });

      // Capture the anonymous user ID BEFORE signing out
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const anonymousId = session?.user?.is_anonymous ? session.user.id : null;

      // Single OAuth flow — no linkIdentity, no double picker
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error) throw error;

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo,
      );
      if (result.type !== "success") return;

      const url = (result as any).url as string;
      const hashIndex = url.indexOf("#");
      const fragment = hashIndex >= 0 ? url.slice(hashIndex + 1) : "";
      const params = new URLSearchParams(fragment);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        showSnackbar("No tokens returned from Google");
        return;
      }

      await supabase.auth.setSession({ access_token, refresh_token });

      // Always merge if the previous session was anonymous
      if (anonymousId) {
        mergeAnonymous.mutate(anonymousId);
      } else {
        showSnackbar("Signed in successfully.");
      }
    } catch (e: any) {
      showSnackbar(e.message ?? "Sign-in failed");
    }
  };

  // TODO: wire to backup logic
  const handleBackup = async () => {
    setBackingUp(true);
    setTimeout(() => {
      setBackingUp(false);
      showSnackbar("Backup complete");
    }, 1200);
  };

  // TODO: wire to restore logic
  const handleRestore = () => showSnackbar("Restore not yet implemented");

  // TODO: wire to export logic
  const handleExport = () => showSnackbar("Export not yet implemented");

  // TODO: wire to import logic
  const handleImport = () => showSnackbar("Import not yet implemented");

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          // Re-enter guest mode immediately
          const { error } = await supabase.auth.signInAnonymously();
          if (error) {
            showSnackbar("Signed out, but could not start a guest session.");
          } else {
            showSnackbar("Signed out. You are now in guest mode.");
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
            queryClient.removeQueries({ queryKey: ["recipe"] });
          }
        },
      },
    ]);
  };

  // TODO: wire to account deletion logic
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "This will permanently remove your account and all recipes. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => showSnackbar("Delete not yet implemented"),
        },
      ],
    );
  };

  const renderSectionHeader = (label: string) => (
    <Text style={styles.sectionHeader}>{label}</Text>
  );

  const renderRow = ({
    icon,
    title,
    subtitle,
    right,
    onPress,
    destructive,
    disabled,
  }: {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
    onPress?: () => void;
    destructive?: boolean;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.row, disabled && { opacity: 0.4 }]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={styles.rowLeft}>
        <View
          style={[
            styles.iconWrap,
            destructive && { backgroundColor: Colors.error_container },
          ]}
        >
          <MaterialIcons
            name={icon}
            size={20}
            color={destructive ? Colors.error : Colors.on_surface}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.rowTitle, destructive && { color: Colors.error }]}
          >
            {title}
          </Text>
          {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {right ?? (
        <MaterialIcons
          name="chevron-right"
          size={20}
          color={Colors.text_muted}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >
        {/* ================= ACCOUNT ================= */}
        {renderSectionHeader("Account & Sync")}

        {isAnonymous ? (
          <View style={styles.card}>
            <View style={styles.guestHeader}>
              <View style={styles.guestIcon}>
                <MaterialIcons
                  name="person-outline"
                  size={24}
                  color={Colors.on_surface}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.badge}>
                  <View style={styles.badgeDot} />
                  <Text style={styles.badgeText}>Guest Mode</Text>
                </View>
                <Text style={styles.guestTitle}>Local-only session</Text>
                <Text style={styles.guestBody}>
                  Recipes are saved on this device only. Link an account to sync
                  across devices and prevent data loss.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleContinueWithGoogle}
              activeOpacity={0.85}
            >
              <MaterialIcons
                name="g-translate"
                size={18}
                color={Colors.on_primary}
              />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(user?.email?.[0] ?? "U").toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>
                  {user?.user_metadata?.full_name ?? "Signed in"}
                </Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.syncStatus}>
              <MaterialIcons
                name="cloud-done"
                size={18}
                color={Colors.primary}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.syncTitle}>Cloud synced & protected</Text>
                <Text style={styles.syncSubtitle}>
                  Last backup: {new Date().toLocaleDateString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
              <MaterialIcons
                name="logout"
                size={16}
                color={Colors.on_surface_variant}
              />
              <Text style={styles.signOutText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= DATA ================= */}
        {renderSectionHeader("Data Management")}
        <View style={styles.cardNoPad}>
          {renderRow({
            icon: "cloud-upload",
            title: "Back up now",
            subtitle: "Save latest recipes to cloud",
            onPress: handleBackup,
            disabled: isAnonymous,
            right: (
              <Text style={styles.badgeInline}>
                {backingUp
                  ? "Backing up..."
                  : isAnonymous
                    ? "Requires account"
                    : "Up to date"}
              </Text>
            ),
          })}
          <Divider />
          {renderRow({
            icon: "history",
            title: "Restore from backup",
            subtitle: "Revert from a previous snapshot",
            onPress: handleRestore,
            disabled: isAnonymous,
          })}
          <Divider />
          {renderRow({
            icon: "download",
            title: "Export recipes",
            subtitle: "Download as JSON or Markdown",
            onPress: handleExport,
          })}
          <Divider />
          {renderRow({
            icon: "upload-file",
            title: "Import recipes",
            subtitle: "Import from JSON or text clips",
            onPress: handleImport,
          })}
        </View>

        {/* ================= APPEARANCE ================= */}
        {renderSectionHeader("Appearance & Interaction")}
        <View style={styles.card}>
          <View style={styles.segmentRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Theme</Text>
              <Text style={styles.rowSubtitle}>Interface contrast</Text>
            </View>
            <View style={styles.segment}>
              {(["system", "light", "dark"] as Theme[]).map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.segmentBtn,
                    theme === opt && styles.segmentBtnActive,
                  ]}
                  onPress={() => setTheme(opt)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      theme === opt && styles.segmentTextActive,
                    ]}
                  >
                    {opt[0].toUpperCase() + opt.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Divider />

          <View style={styles.segmentRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Text size</Text>
              <Text style={styles.rowSubtitle}>
                Counter-distance readability
              </Text>
            </View>
            <View style={styles.segment}>
              {(["small", "default", "large"] as TextSize[]).map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.segmentBtn,
                    textSize === opt && styles.segmentBtnActive,
                  ]}
                  onPress={() => setTextSize(opt)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      textSize === opt && styles.segmentTextActive,
                    ]}
                  >
                    {opt[0].toUpperCase() + opt.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Divider />

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Haptic feedback</Text>
              <Text style={styles.rowSubtitle}>
                Vibrate on timer alerts & checklist taps
              </Text>
            </View>
            <Switch
              value={haptics}
              onValueChange={setHaptics}
              trackColor={{
                false: Colors.surface_container_highest,
                true: Colors.primary,
              }}
              thumbColor={Colors.on_primary}
            />
          </View>
        </View>

        {/* ================= ABOUT ================= */}
        {renderSectionHeader("About & Support")}
        <View style={styles.cardNoPad}>
          <View style={styles.versionRow}>
            <View style={styles.iconWrap}>
              <Text style={styles.versionBadge}>C2C</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Clip2Cook Mobile</Text>
              <Text style={styles.rowSubtitle}>v1.0.0</Text>
            </View>
          </View>
          <Divider />
          {renderRow({
            icon: "shield",
            title: "Privacy Policy",
            onPress: () => {},
          })}
          <Divider />
          {renderRow({
            icon: "description",
            title: "Terms of Service",
            onPress: () => {},
          })}
          <Divider />
          {renderRow({
            icon: "chat-bubble-outline",
            title: "Send feedback",
            onPress: () => {},
          })}
        </View>

        {/* ================= DANGER ================= */}
        {!isAnonymous && (
          <>
            {renderSectionHeader("Danger Zone")}
            <View style={styles.card}>
              <Text style={styles.rowTitle}>Delete account & data</Text>
              <Text style={styles.rowSubtitle}>
                Permanently remove your account, cloud credentials, and all
                recipes. This is irreversible.
              </Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleDeleteAccount}
              >
                <MaterialIcons
                  name="delete-forever"
                  size={16}
                  color={Colors.on_error}
                />
                <Text style={styles.deleteText}>Delete account</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    paddingHorizontal: Spacing.margin,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface_bright,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_default,
  },
  headerTitle: {
    ...Typography.headlineMd,
    color: Colors.on_surface,
  },
  content: {
    padding: Spacing.margin,
    gap: Spacing.lg,
  },
  sectionHeader: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    marginBottom: -Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border_default,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardNoPad: {
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border_default,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface_container,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    ...Typography.bodyMdBold,
    color: Colors.on_surface,
  },
  rowSubtitle: {
    ...Typography.bodySm,
    color: Colors.text_muted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surface_container_highest,
    marginHorizontal: Spacing.md,
  },
  badgeInline: {
    ...Typography.labelSm,
    color: Colors.text_muted,
    backgroundColor: Colors.surface_container_highest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },

  // Guest card
  guestHeader: {
    flexDirection: "row",
    gap: Spacing.md,
    alignItems: "flex-start",
  },
  guestIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface_container_highest,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.surface_container_high,
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    marginBottom: 4,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary,
  },
  badgeText: {
    ...Typography.labelSm,
    color: Colors.secondary,
  },
  guestTitle: {
    ...Typography.headlineSm,
    color: Colors.on_surface,
    marginTop: 4,
  },
  guestBody: {
    ...Typography.bodyMd,
    color: Colors.secondary,
    marginTop: 4,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    marginTop: Spacing.md,
  },
  googleBtnText: {
    ...Typography.labelLg,
    color: Colors.on_primary,
  },

  // Logged-in profile
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    ...Typography.headlineSm,
    color: Colors.on_primary,
  },
  profileName: {
    ...Typography.headlineSm,
    color: Colors.on_surface,
  },
  profileEmail: {
    ...Typography.bodySm,
    color: Colors.text_muted,
  },
  syncStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.surface_container_low,
    borderRadius: Radius.lg,
    marginTop: Spacing.md,
  },
  syncTitle: {
    ...Typography.labelMd,
    color: Colors.on_surface,
  },
  syncSubtitle: {
    ...Typography.bodySm,
    color: Colors.text_muted,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: Spacing.sm,
  },
  signOutText: {
    ...Typography.labelMd,
    color: Colors.on_surface_variant,
  },

  // Segmented + switches
  segmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: Colors.surface_container,
    borderRadius: Radius.lg,
    padding: 2,
  },
  segmentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.md,
  },
  segmentBtnActive: {
    backgroundColor: Colors.primary,
  },
  segmentText: {
    ...Typography.labelMd,
    color: Colors.text_muted,
  },
  segmentTextActive: {
    color: Colors.on_primary,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  // Version
  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.surface_container_low,
  },
  versionBadge: {
    ...Typography.labelSm,
    color: Colors.on_primary,
  },

  // Danger
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: Colors.error,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.lg,
    marginTop: Spacing.sm,
  },
  deleteText: {
    ...Typography.labelMd,
    color: Colors.on_error,
  },
});

const Divider = () => <View style={styles.divider} />;
