// ============================================================
// Design Tokens - Single source of truth for all design specs
// Swiss Life brand colors + custom theme
// ============================================================

export const colors = {
  // Swiss Life brand colors
  swissLifeRed: "#E2001A",
  swissLifeDark: "#1D1D1B",

  // Primary palette (Swiss Life inspired)
  primary: {
    50: "#FDE8EB",
    100: "#FAC5CC",
    200: "#F7929F",
    300: "#F35F72",
    400: "#EF3750",
    500: "#E2001A", // Swiss Life Red - main brand color
    600: "#C80017",
    700: "#A50013",
    800: "#82000F",
    900: "#5E000B",
  },

  // Neutral palette
  neutral: {
    0: "#FFFFFF",
    50: "#F5F5F5",
    100: "#ECECEC",
    200: "#D9D9D9",
    300: "#BFBFBF",
    400: "#A6A6A6",
    500: "#8C8C8C",
    600: "#737373",
    700: "#595959",
    800: "#404040",
    900: "#1D1D1B", // Swiss Life Dark
    950: "#141413",
  },

  // Accent (used for interactive elements, links)
  accent: {
    50: "#E8F4FD",
    100: "#C5E3FA",
    200: "#92CBF5",
    300: "#5FB2F0",
    400: "#379FEB",
    500: "#0077CC",
    600: "#0066B3",
    700: "#005599",
    800: "#004480",
    900: "#003366",
  },

  // Semantic colors
  success: "#2E7D32",
  warning: "#F9A825",
  error: "#D32F2F",
  info: "#0077CC",
} as const;

// Light and dark theme color mappings
// Change themes entirely from here
export const themes = {
  light: {
    background: colors.neutral[0],
    backgroundSecondary: colors.neutral[50],
    backgroundTertiary: colors.neutral[100],
    foreground: colors.neutral[900],
    foregroundSecondary: colors.neutral[600],
    foregroundMuted: colors.neutral[400],
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    primaryForeground: colors.neutral[0],
    accent: colors.accent[500],
    accentHover: colors.accent[600],
    accentForeground: colors.neutral[0],
    border: colors.neutral[200],
    borderLight: colors.neutral[100],
    inputBackground: colors.neutral[0],
    inputBorder: colors.neutral[300],
    inputBorderFocus: colors.primary[500],
    cardBackground: colors.neutral[50],
    navBackground: colors.neutral[0],
    successText: colors.success,
    errorText: colors.error,
  },
  dark: {
    background: colors.neutral[950],
    backgroundSecondary: colors.neutral[900],
    backgroundTertiary: colors.neutral[800],
    foreground: colors.neutral[50],
    foregroundSecondary: colors.neutral[300],
    foregroundMuted: colors.neutral[500],
    primary: colors.primary[400],
    primaryHover: colors.primary[300],
    primaryForeground: colors.neutral[0],
    accent: colors.accent[400],
    accentHover: colors.accent[300],
    accentForeground: colors.neutral[0],
    border: colors.neutral[700],
    borderLight: colors.neutral[800],
    inputBackground: colors.neutral[900],
    inputBorder: colors.neutral[600],
    inputBorderFocus: colors.primary[400],
    cardBackground: colors.neutral[900],
    navBackground: colors.neutral[950],
    successText: "#66BB6A",
    errorText: "#EF5350",
  },
} as const;

// Spacing scale (in px, used as rem in CSS)
export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

// Typography
export const typography = {
  fontFamily: {
    sans: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Geist Mono', monospace",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },
} as const;

// Border radius
export const borderRadius = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  full: "9999px",
} as const;

// Shadows
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
} as const;

// Breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const;

// Onboarding-specific tokens
export const onboarding = {
  navHeight: "64px",
  contentMaxWidth: "1280px",
  cardPadding: spacing[8],
  stepIndicatorSize: "24px",
} as const;
