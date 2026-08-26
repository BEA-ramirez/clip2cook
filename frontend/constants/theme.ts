/**
 * Clip2Cook Design System Tokens
 * Extracted from design.md
 */

import { Platform } from "react-native";

// ___ COLORS ___
// We prioritize the "Brand & Style" core colors for primary usage,
// while keeping the extended palette available for specific states.

export const Colors = {
  surface: "#f7f9fb",
  surface_dim: "#d8dadc",
  surface_bright: "#f7f9fb",
  surface_container_lowest: "#fbfcfd",
  surface_container_low: "#f2f4f6",
  surface_container: "#eceef0",
  surface_container_high: "#e6e8ea",
  surface_container_highest: "#e0e3e5",
  on_surface: "#191c1e",
  on_surface_variant: "#594139",
  inverse_surface: "#2d3133",
  inverse_on_surface: "#eff1f3",
  outline: "#8d7168",
  outline_variant: "#e1bfb5",
  surface_tint: "#ab3500",
  primary: "#ab3500",
  on_primary: "#ffffff",
  primary_container: "#ff6b35",
  on_primary_container: "#5f1900",
  inverse_primary: "#ffb59d",
  secondary: "#565e74",
  on_secondary: "#ffffff",
  secondary_container: "#dae2fd",
  on_secondary_container: "#5c647a",
  tertiary: "#00677e",
  on_tertiary: "#ffffff",
  tertiary_container: "#00a7cb",
  on_tertiary_container: "#003744",
  error: "#ba1a1a",
  on_error: "#ffffff",
  error_container: "#ffdad6",
  on_error_container: "#93000a",
  primary_fixed: "#ffdbd0",
  primary_fixed_dim: "#ffb59d",
  on_primary_fixed: "#390c00",
  on_primary_fixed_variant: "#832600",
  secondary_fixed: "#dae2fd",
  secondary_fixed_dim: "#bec6e0",
  on_secondary_fixed: "#131b2e",
  on_secondary_fixed_variant: "#3f465c",
  tertiary_fixed: "#b5ebff",
  tertiary_fixed_dim: "#59d5fb",
  on_tertiary_fixed: "#001f28",
  on_tertiary_fixed_variant: "#004e60",
  background: "#f7f9fb",
  on_background: "#191c1e",
  surface_variant: "#e0e3e5",
};

// ___ SPACING ___
// Fluid_Fixed Hybrid model. All spacing is a multiple of 4px.
export const Spacing = {
  base: 4,
  xs: 8,
  sm: 12, // Elements within a component (icon to text)
  md: 16,
  lg: 30, // Spacing between major sections
  xl: 42,
  containerMargin: 20, // Mobile side margins
  gutter: 16,
};

// ___ SHAPES / BORDER RADIUS ___
// Friendly_Geometric shape language.
export const Radius = {
  sm: 4,
  DEFAULT: 8,
  md: 8,
  lg: 12, // Buttons & Inputs
  xl: 16, // Main Recipe Cards & Large Containers
  pill: 9999, // Chips, Tags, and circular elements
};

// ___ ELEVATION & DEPTH (SHADOWS) ___
// React Native requires distinct shadow properties instead of CSS box_shadows.
export const Shadows = {
  // Level 1: White surfaces with a very soft, diffused shadow
  // CSS: 0px 4px 12px rgba(15, 23, 42, 0.05)
  level1: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 4, // Android equivalent
  },
  // Level 2: Primary action buttons or active modals
  // CSS: 0px 8px 24px rgba(15, 23, 42, 0.08)
  level2: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5, // Android equivalent
  },
};

// ___ TYPOGRAPHY ___
// React Native requires exact font family names (loaded via expo_font)
// and numeric line heights (fontSize * CSS line_height multiplier).
export const Typography = {
  display: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    lineHeight: 38.4, // 32 * 1.2
    letterSpacing: -0.64, // 32 * _0.02
  },
  headlineLg: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 24,
    lineHeight: 31.2, // 24 * 1.3
  },
  headlineLgMobile: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    lineHeight: 26, // 20 * 1.3
  },
  bodyMd: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 25.6, // 16 * 1.6
  },
  bodyMdSb: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    lineHeight: 25.6, // 16 * 1.6
  },
  bodySm: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21, // 14 * 1.5
  },
  dataMono: {
    fontFamily: "JetBrainsMono_500Medium",
    fontSize: 14,
    lineHeight: 19.6, // 14 * 1.4
    letterSpacing: -0.14,
  },
  labelCaps: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    lineHeight: 12, // 12 * 1
    letterSpacing: 0.6, // 12 * 0.05
    textTransform: "uppercase" as const,
  },
};

// Keep the default Expo font fallbacks just in case you need system defaults
export const Fonts = Platform.select({
  ios: { sans: "system_ui", mono: "ui_monospace" },
  default: { sans: "normal", mono: "monospace" },
});
