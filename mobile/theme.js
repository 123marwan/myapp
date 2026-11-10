import { AVATARS } from "./constants/avatars";
import { formatDate } from "./utils/format";
import { getAvatarGradient, getInitials } from "./utils/user";

// Design tokens
export const colors = {
  bg: "#F3F5FB",
  surface: "#FFFFFF",
  ink: "#0B1220",
  text: "#111827",
  muted: "#6B7280",
  faint: "#9CA3AF",
  line: "#E8ECF4",
  soft: "#EEF2FF",
  primary: "#4F46E5",
  primaryDark: "#3730A3",
  violet: "#7C3AED",
  cyan: "#06B6D4",
  success: "#059669",
  successSoft: "#D1FAE5",
  danger: "#DC2626",
  dangerSoft: "#FEE2E2",
  amber: "#D97706",
  amberSoft: "#FEF3C7",
  skySoft: "#E0F2FE",
  pinkSoft: "#FCE7F3",
  glass: "rgba(255,255,255,0.16)",
  glassLine: "rgba(255,255,255,0.28)",
};

export const fonts = {
  regular: "Cairo_400Regular",
  medium: "Cairo_500Medium",
  semibold: "Cairo_600SemiBold",
  bold: "Cairo_700Bold",
  extrabold: "Cairo_800ExtraBold",
  black: "Cairo_900Black",
};

export const gradients = {
  primary: ["#4F46E5", "#7C3AED"],
  primarySoft: ["#6366F1", "#8B5CF6"],
  hero: ["#1E1B4B", "#4338CA", "#6D28D9"],
  cool: ["#0EA5E9", "#6366F1"],
  danger: ["#F87171", "#DC2626"],
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: "#111C44",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  soft: {
    shadowColor: "#111C44",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  glow: {
    shadowColor: "#4F46E5",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
};

// Compatibility exports (prefer importing from utils/constants directly in new code)
export { AVATARS };
export const avatarGradient = getAvatarGradient;
export const initials = getInitials;
export { formatDate };