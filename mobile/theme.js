// نظام التصميم الموحّد للتطبيق
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

// الأفاتارات المتاحة وقت إنشاء الحساب (نفس القائمة في السيرفر)
export const AVATARS = [
  "🦊",
  "🐼",
  "🐯",
  "🦁",
  "🐨",
  "🐸",
  "🦉",
  "🐙",
  "🦄",
  "🐳",
  "🐝",
  "🦋",
];

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

const AVATAR_GRADIENTS = [
  ["#6366F1", "#8B5CF6"],
  ["#0EA5E9", "#6366F1"],
  ["#F59E0B", "#EF4444"],
  ["#10B981", "#0EA5E9"],
  ["#EC4899", "#8B5CF6"],
  ["#F97316", "#F43F5E"],
];

export function avatarGradient(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 100000;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

export function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?"
  );
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}
