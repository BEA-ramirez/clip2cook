import { Platform } from "react-native";

export const Colors = {
  surface: "#f9f9ff",
  surface_dim: "#d3daef",
  surface_bright: "#f9f9ff",
  surface_container_lowest: "#ffffff",
  surface_container_low: "#f1f3ff",
  surface_container: "#e9edff",
  surface_container_high: "#e1e8fd",
  surface_container_highest: "#dce2f7",
  on_surface: "#141b2b",
  on_surface_variant: "#4c4546",
  inverse_surface: "#293040",
  inverse_on_surface: "#edf0ff",
  outline: "#7e7576",
  outline_variant: "#cfc4c5",
  surface_tint: "#5e5e5e",
  primary: "#000000",
  on_primary: "#ffffff",
  primary_container: "#1b1b1b",
  on_primary_container: "#848484",
  inverse_primary: "#c6c6c6",
  secondary: "#555f6d",
  on_secondary: "#ffffff",
  secondary_container: "#d6e0f1",
  on_secondary_container: "#596372",
  tertiary: "#000000",
  on_tertiary: "#ffffff",
  tertiary_container: "#1b1b1b",
  on_tertiary_container: "#848484",
  error: "#ba1a1a",
  on_error: "#ffffff",
  error_container: "#ffdad6",
  on_error_container: "#93000a",
  background: "#f9f9ff",
  on_background: "#141b2b",
  surface_variant: "#dce2f7",

  // Custom Semantic Borders from design guide
  border_default: "#E5E7EB",
  border_focus: "#111827",
  text_muted: "#6B7280",
};

export const Spacing = {
  xs: 4, // 0.25rem
  sm: 8, // 0.5rem
  md: 16, // 1rem
  lg: 24, // 1.5rem
  xl: 40, // 2.5rem
  gutter: 16,
  margin: 16,
};

export const Radius = {
  sm: 2, // 0.125rem
  DEFAULT: 4, // 0.25rem
  md: 6, // 0.375rem
  lg: 8, // 0.5rem
  xl: 12, // 0.75rem
  full: 9999,
};

// Design system deliberately eschews drop shadows for strict structural lines.
export const Borders = {
  card: {
    borderWidth: 1,
    borderColor: Colors.border_default,
  },
  focused: {
    borderWidth: 1,
    borderColor: Colors.border_focus,
  },
};

export const Typography = {
  display: {
    fontFamily: "Inter",
    fontSize: 48,
    fontWeight: "700" as const,
    lineHeight: 56,
    letterSpacing: -1.44,
  },
  displayMobile: {
    fontFamily: "Inter",
    fontSize: 36,
    fontWeight: "700" as const,
    lineHeight: 44,
    letterSpacing: -0.9,
  },
  headlineLg: {
    fontFamily: "Inter",
    fontSize: 32,
    fontWeight: "600" as const,
    lineHeight: 40,
    letterSpacing: -0.64,
  },
  headlineLgMobile: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 32,
    letterSpacing: -0.36,
  },
  headlineMd: {
    fontFamily: "Inter",
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  headlineSm: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
    letterSpacing: -0.18,
  },
  bodyLg: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 26,
    letterSpacing: 0,
  },
  bodyMd: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "600" as const,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodySm: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 18,
    letterSpacing: 0.12,
  },
  labelLg: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "600" as const,
    lineHeight: 20,
    letterSpacing: 0.14,
  },
  labelMd: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 16,
    letterSpacing: 0.24,
  },
  labelSm: {
    fontFamily: "Inter",
    fontSize: 11,
    fontWeight: "600" as const,
    lineHeight: 14,
    letterSpacing: 0.44,
    textTransform: "uppercase" as const,
  },
};
