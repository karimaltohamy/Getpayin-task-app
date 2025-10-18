// Color Palette - Light Theme
export const LightColors = {
  primary: "#007AFF",
  primaryDark: "#0051D5",
  secondary: "#5856D6",

  // Semantic Colors
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B10",
  info: "#5AC8FA",

  // Text Colors
  text: {
    primary: "#000000",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
    inverse: "#FFFFFF",
  },

  // Background Colors
  background: {
    primary: "#FFFFFF",
    secondary: "#F3F4F6",
    tertiary: "#E5E7EB",
  },

  // Border Colors
  border: {
    primary: "#D1D5DB",
    light: "#E5E7EB",
    medium: "#D1D5DB",
    dark: "#9CA3AF",
  },

  // UI Elements
  card: "#FFFFFF",
  shadow: "#000000",
  overlay: "rgba(0, 0, 0, 0.5)",
  disabled: "#D1D5DB",
} as const;

// Color Palette - Dark Theme
export const DarkColors = {
  primary: "#0A84FF",
  primaryDark: "#0969DA",
  secondary: "#5E5CE6",

  // Semantic Colors
  success: "#30D158",
  warning: "#FF9F0A",
  error: "#FF453A",
  info: "#64D2FF",

  // Text Colors
  text: {
    primary: "#FFFFFF",
    secondary: "#98989D",
    tertiary: "#636366",
    inverse: "#000000",
  },

  // Background Colors
  background: {
    primary: "#010101",
    secondary: "#0A0A0A",
    tertiary: "#1C1C1E",
  },

  // Border Colors
  border: {
    primary: "#38383A",
    light: "#2C2C2E",
    medium: "#38383A",
    dark: "#48484A",
  },

  // UI Elements
  card: "rgba(25, 25, 25, 0.52)",
  shadow: "#000000",
  overlay: "rgba(0, 0, 0, 0.52)",
  disabled: "#48484A",
} as const;

// Default export for backward compatibility (Light theme)
export const Colors = LightColors;

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Typography
export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  // Text Styles
  heading1: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
  },
  heading2: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 32,
  },
  heading3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
} as const;

// Border Radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Shadows
export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;
