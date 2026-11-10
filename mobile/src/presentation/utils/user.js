export function getUserId(user) {
  if (!user) return null;
  return String(user.id ?? user._id ?? "");
}

export function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
}

const AVATAR_GRADIENTS = [
  ["#6366F1", "#8B5CF6"],
  ["#0EA5E9", "#6366F1"],
  ["#F59E0B", "#EF4444"],
  ["#10B981", "#0EA5E9"],
  ["#EC4899", "#8B5CF6"],
  ["#F97316", "#F43F5E"],
];

export function getAvatarGradient(name = "") {
  let hash = 0;
  const source = String(name);
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) % 100000;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}