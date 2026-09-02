import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ChefHat,
} from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import Toast from "react-native-toast-message";

import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as QueryParams from "expo-auth-session/build/QueryParams";

// This is required to make sure stray browser windows close properly
WebBrowser.maybeCompleteAuthSession();

// Extracted from your Tailwind config
const Colors = {
  background: "#f7f9fb",
  surface_container_lowest: "#ffffff",
  surface_container: "#eceef0",
  surface_container_low: "#f2f4f6",
  surface_dim: "#d8dadc",
  on_surface: "#191c1e",
  on_surface_variant: "#594139",
  primary: "#ab3500",
  primary_container: "#ff6b35",
  on_primary_container: "#5f1900", // Dark brown/red from your config
  secondary: "#565e74",
};

export default function LoginScreen() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const authMutation = useMutation({
    mutationFn: async () => {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }
      if (isLoginTab) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      if (isLoginTab) {
        Toast.show({
          type: "success",
          text1: "Welcome back Chef!",
          text2: "Loading your recipes...",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Account created!",
          text2: "Please check your email to verify your account.",
        });
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Authentication Failed",
        text2: error.message || "An unexpected error occurred.",
      });
    },
  });

  const googleMutation = useMutation({
    mutationFn: async () => {
      // Create the deep link back to our app (handles both Expo Go and compiled apps)
      const redirectUrl = Linking.createURL("/auth");
      console.log("MY EXPO REDIRECT URL:", redirectUrl);
      // Ask Supabase to generate the secure Google Login URL
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true, // Tell Supabase we are handling the browser natively
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("Could not get Google auth URL.");

      // Open the secure in-app browser to let the user sign in
      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      // Extract the tokens from the URL when the browser bounces back
      if (res.type === "success") {
        const { params, errorCode } = QueryParams.getQueryParams(res.url);

        if (errorCode) throw new Error(errorCode);
        if (!params.access_token) throw new Error("No access token found.");

        // Hand the extracted tokens to Supabase to establish the session locally
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        });
        if (sessionError) throw sessionError;
      } else {
        throw new Error("Sign-in was cancelled.");
      }
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Google Sign-In Successful!",
        text2: "Loading your cookbooks...",
      });
    },
    onError: (error: any) => {
      if (error.message !== "Sign-in was cancelled.") {
        Toast.show({
          type: "error",
          text1: "Google Sign-In Failed",
          text2: error.message,
        });
      }
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled={Platform.OS === "ios"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* MAIN CARD */}
          <View style={styles.cardShadow}>
            <View style={styles.cardContainer}>
              {/* TOP DECORATIVE GRADIENT */}
              <LinearGradient
                colors={[Colors.primary_container, Colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.topGradient}
              />

              {/* HEADER: LOGO & TAGLINE */}
              <View style={styles.header}>
                <View style={styles.logoRow}>
                  <ChefHat size={32} color={Colors.primary} />
                  <Text style={styles.logoText}>Clip2Cook</Text>
                </View>
                <Text style={styles.tagline}>
                  Effortless cooking, powered by AI.
                </Text>
              </View>

              {/* TABS (LOGIN / SIGN UP) */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    isLoginTab && styles.tabButtonActive,
                  ]}
                  onPress={() => setIsLoginTab(true)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.tabText, isLoginTab && styles.tabTextActive]}
                  >
                    Login
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    !isLoginTab && styles.tabButtonActive,
                  ]}
                  onPress={() => setIsLoginTab(false)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabText,
                      !isLoginTab && styles.tabTextActive,
                    ]}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {/* FORM SECTION */}
              <View style={styles.formContainer}>
                {/* Email Input */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                  <CustomInput
                    icon={<Mail size={20} color={Colors.secondary} />}
                    placeholder="chef@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputWrapper}>
                  <View style={styles.passwordHeader}>
                    <Text style={styles.inputLabel}>PASSWORD</Text>
                    {isLoginTab && (
                      <TouchableOpacity>
                        <Text style={styles.forgotPassword}>
                          Forgot password?
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <CustomInput
                    icon={<Lock size={20} color={Colors.secondary} />}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye size={20} color={Colors.secondary} />
                        ) : (
                          <EyeOff size={20} color={Colors.secondary} />
                        )}
                      </TouchableOpacity>
                    }
                  />
                </View>

                {/* Primary Button */}
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    authMutation.isPending && { opacity: 0.7 },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => authMutation.mutate()}
                  disabled={authMutation.isPending}
                >
                  <Text style={styles.primaryButtonText}>
                    {authMutation.isPending
                      ? "Please wait..."
                      : isLoginTab
                        ? "Login"
                        : "Sign Up"}
                  </Text>
                  {!authMutation.isPending && (
                    <ArrowRight size={20} color={Colors.on_primary_container} />
                  )}
                </TouchableOpacity>
              </View>

              {/* DIVIDER */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* SOCIAL LOGINS */}
              <View style={styles.socialRow}>
                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    googleMutation.isPending && { opacity: 0.7 },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => googleMutation.mutate()}
                  disabled={googleMutation.isPending}
                >
                  <GoogleIcon />
                  <Text style={styles.socialButtonText}>
                    {googleMutation.isPending ? "Connecting..." : "Google"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.7}
                >
                  <AppleIcon />
                  <Text style={styles.socialButtonText}>Apple</Text>
                </TouchableOpacity>
              </View>

              {/* GUEST LINK */}
              <TouchableOpacity style={styles.guestButton}>
                <Text style={styles.guestText}>Continue as Guest</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- SMART INPUT COMPONENT ---
// Automatically handles the orange border focus state!
function CustomInput({ icon, rightIcon, style, ...props }: any) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.inputBox, isFocused && styles.inputBoxFocused, style]}>
      {icon && <View style={styles.inputIconLeft}>{icon}</View>}
      <TextInput
        style={styles.inputField}
        placeholderTextColor={Colors.surface_dim}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {rightIcon && <View style={styles.inputIconRight}>{rightIcon}</View>}
    </View>
  );
}

// --- SVG ICONS ---
const GoogleIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill={Colors.on_surface}>
    <Path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
  </Svg>
);

const AppleIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill={Colors.on_surface}>
    <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.85 1.76-1.55 3.12-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </Svg>
);

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },

  // Outer shadow wrapper (Required because overflow:"hidden" cuts off shadows on iOS)
  cardShadow: {
    width: "100%",
    maxWidth: 420,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  cardContainer: {
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: 16,
    padding: 32,
    position: "relative",
    overflow: "hidden", // Ensures the top gradient stays inside the rounded corners
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    opacity: 0.8,
  },

  // Header Section
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 8,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  logoText: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.on_surface_variant,
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.surface_container,
    borderRadius: 100,
    padding: 4,
    marginBottom: 32,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: Colors.surface_container_lowest,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.on_surface_variant,
  },
  tabTextActive: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.on_surface,
  },

  // Form Section
  formContainer: {
    gap: 20,
  },
  inputWrapper: {
    gap: 6,
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: Colors.on_surface_variant,
    letterSpacing: 0.5,
  },
  forgotPassword: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.primary_container,
  },

  // Custom Input
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.surface_dim,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputBoxFocused: {
    borderColor: Colors.primary_container,
  },
  inputIconLeft: {
    marginRight: 10,
  },
  inputIconRight: {
    marginLeft: 10,
    padding: 4,
  },
  inputField: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.on_surface,
    height: "100%",
  },

  // Primary Action
  primaryButton: {
    backgroundColor: Colors.primary_container,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 8,
    marginTop: 8,
  },
  primaryButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.on_primary_container,
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.surface_dim,
  },
  dividerText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.secondary,
    letterSpacing: 0.5,
  },

  // Social Buttons
  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.surface_dim,
    borderRadius: 8,
    backgroundColor: Colors.surface_container_lowest,
  },
  socialButtonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.on_surface,
  },

  // Guest Link
  guestButton: {
    alignItems: "center",
  },
  guestText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.secondary,
  },
});
