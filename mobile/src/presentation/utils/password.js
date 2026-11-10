export function getPasswordScore(password = "") {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  return Math.min(3, Math.max(1, score - 1));
}

export const PASSWORD_STRENGTH = {
  1: { label: "ضعيف", color: "#EF4444" },
  2: { label: "متوسط", color: "#F59E0B" },
  3: { label: "قوي", color: "#10B981" },
};