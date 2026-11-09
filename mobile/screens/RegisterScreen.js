import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../components/AppText";
import { LinearGradient } from "expo-linear-gradient";

import { api, getErrorMessage } from "../api";
import { useAuth } from "../AuthContext";
import { AVATARS, colors, fonts, gradients, radius, shadow } from "../theme";

const GENDERS = [
  { key: "male", label: "ذكر", icon: "♂" },
  { key: "female", label: "أنثى", icon: "♀" },
];

function passwordScore(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  return Math.min(3, Math.max(1, score - 1));
}

const STRENGTH = {
  1: { label: "ضعيف", color: "#EF4444" },
  2: { label: "متوسط", color: "#F59E0B" },
  3: { label: "قوي", color: "#10B981" },
};

export default function RegisterScreen({ navigation }) {
  const { signIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("male");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");

  async function handleRegister() {
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError("من فضلك اكمل كل الحقول");
      return;
    }
    if (!avatar) {
      setError("اختار الأفاتار بتاعك الأول");
      return;
    }
    if (!/^[0-9]{7,15}$/.test(phone.trim())) {
      setError("رقم التليفون لازم يكون أرقام بس (7 لـ 15 رقم)");
      return;
    }
    if (password.length < 6) {
      setError("الباسورد لازم يكون 6 حروف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/register", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender,
        avatar,
        password,
      });
      await signIn(data.token, data.user);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View pointerEvents="none" style={styles.blobs}>
        <LinearGradient
          colors={["rgba(124,58,237,0.18)", "rgba(124,58,237,0)"]}
          style={[styles.blob, styles.blobOne]}
        />
        <LinearGradient
          colors={["rgba(14,165,233,0.16)", "rgba(14,165,233,0)"]}
          style={[styles.blob, styles.blobTwo]}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.shell}>
            <View style={styles.topRow}>
              <Pressable
                onPress={() => navigation.goBack()}
                disabled={loading}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.backBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.backArrow}>→</Text>
              </Pressable>
              <View style={styles.topText}>
                <Text style={styles.eyebrow}>خطوة 01</Text>
                <Text style={styles.title}>حساب جديد</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>
              املأ بياناتك وابدأ فورًا — كل حاجة بتتحفظ في الداتابيز.
            </Text>

            <View style={styles.card}>
              <Text style={styles.label}>الاسم</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={[styles.input, focused === "name" && styles.inputFocused]}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused("")}
                  placeholder="اسمك بالكامل"
                  placeholderTextColor={colors.faint}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>

              <Text style={styles.label}>اختار الأفاتار</Text>
              <View style={styles.avatarGrid}>
                {AVATARS.map((emoji) => {
                  const active = avatar === emoji;
                  return (
                    <Pressable
                      key={emoji}
                      onPress={() => setAvatar(emoji)}
                      disabled={loading}
                      style={({ pressed }) => [
                        styles.avatarChip,
                        active && styles.avatarChipActive,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.avatarEmoji,
                          active && styles.avatarEmojiActive,
                        ]}
                      >
                        {emoji}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text
                style={[styles.avatarHint, avatar && styles.avatarHintActive]}
              >
                {avatar
                  ? "تمام! ده الأفاتار اللي هيظهر معاك 👌"
                  : "لازم تختار أفاتار قبل إنشاء الحساب."}
              </Text>

              <Text style={styles.label}>الإيميل</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>@</Text>
                <TextInput
                  style={[styles.input, focused === "email" && styles.inputFocused]}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.faint}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  editable={!loading}
                />
              </View>

              <Text style={styles.label}>رقم التليفون</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>📱</Text>
                <TextInput
                  style={[styles.input, focused === "phone" && styles.inputFocused]}
                  value={phone}
                  onChangeText={setPhone}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused("")}
                  placeholder="01xxxxxxxxx"
                  placeholderTextColor={colors.faint}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  maxLength={15}
                  editable={!loading}
                />
              </View>

              <Text style={styles.label}>الجندر</Text>
              <View style={styles.genderRow}>
                {GENDERS.map((option) => {
                  const active = gender === option.key;
                  return (
                    <Pressable
                      key={option.key}
                      onPress={() => setGender(option.key)}
                      disabled={loading}
                      style={({ pressed }) => [
                        styles.genderChip,
                        active && styles.genderChipActive,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.genderIcon,
                          active && styles.genderIconActive,
                        ]}
                      >
                        {option.icon}
                      </Text>
                      <Text
                        style={[
                          styles.genderText,
                          active && styles.genderTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.label}>الباسورد</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    focused === "password" && styles.inputFocused,
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  placeholder="6 حروف على الأقل"
                  placeholderTextColor={colors.faint}
                  secureTextEntry={!showPassword}
                  textContentType="newPassword"
                  autoComplete="new-password"
                  editable={!loading}
                  onSubmitEditing={handleRegister}
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={8}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeText}>
                    {showPassword ? "إخفاء" : "عرض"}
                  </Text>
                </Pressable>
              </View>

              {password ? (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthTrack}>
                    {[1, 2, 3].map((step) => (
                      <View
                        key={step}
                        style={[
                          styles.strengthBar,
                          step <= passwordScore(password) && {
                            backgroundColor: STRENGTH[passwordScore(password)].color,
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text
                    style={[
                      styles.strengthLabel,
                      { color: STRENGTH[passwordScore(password)].color },
                    ]}
                  >
                    {STRENGTH[passwordScore(password)].label}
                  </Text>
                </View>
              ) : null}

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorIcon}>!</Text>
                  <Text style={styles.error}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                onPress={handleRegister}
                disabled={loading}
                style={({ pressed }) => [
                  styles.ctaWrap,
                  pressed && styles.ctaPressed,
                ]}
              >
                <LinearGradient
                  colors={gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cta}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.ctaText}>إنشاء الحساب</Text>
                      <Text style={styles.ctaArrow}>←</Text>
                    </>
                  )}
                </LinearGradient>
              </Pressable>

              <View style={styles.footer}>
                <Text style={styles.footerText}>عندك حساب بالفعل؟</Text>
                <Pressable
                  onPress={() => navigation.goBack()}
                  disabled={loading}
                  hitSlop={8}
                >
                  <Text style={styles.link}> سجّل الدخول</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  blobs: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  blob: { position: "absolute", borderRadius: 999 },
  blobOne: { width: 300, height: 300, top: -140, right: -80 },
  blobTwo: { width: 240, height: 240, bottom: -100, left: -70 },
  scroll: { flexGrow: 1, paddingVertical: 10, paddingHorizontal: 20 },
  shell: { width: "100%", maxWidth: 430, alignSelf: "center" },
  topRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  topText: { flex: 1 },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.soft,
  },
  backArrow: { color: colors.ink, fontSize: 18, fontFamily: fonts.bold },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fonts.extrabold,
    letterSpacing: 1,
    textAlign: "right",
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.extrabold,
    color: colors.ink,
    textAlign: "right",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "right",
    lineHeight: 20,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(232,236,244,0.9)",
    ...shadow.card,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: "#3F4756",
    marginBottom: 6,
    marginTop: 6,
    textAlign: "right",
  },
  inputWrap: { position: "relative", justifyContent: "center" },
  inputIcon: {
    position: "absolute",
    right: 14,
    zIndex: 2,
    fontSize: 15,
    color: colors.primary,
    fontFamily: fonts.extrabold,
  },
  input: {
    backgroundColor: "#F7F9FD",
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingRight: 42,
    paddingLeft: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.text,
    textAlign: "right",
    fontFamily: fonts.regular,
  },
  passwordInput: { paddingLeft: 62 },
  strengthRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  strengthTrack: {
    flex: 1,
    flexDirection: "row-reverse",
    gap: 5,
  },
  strengthBar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E9F2",
  },
  strengthLabel: { fontSize: 11, fontFamily: fonts.bold },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: "#FFFFFF",
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  eyeButton: {
    position: "absolute",
    left: 6,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  eyeText: { color: colors.primary, fontSize: 13, fontFamily: fonts.extrabold },
  avatarGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 6,
  },
  avatarChip: {
    width: 40,
    height: 40,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F9FD",
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  avatarChipActive: {
    backgroundColor: "#EEF2FF",
    borderColor: colors.primary,
    transform: [{ scale: 1.06 }],
  },
  avatarEmoji: { fontSize: 21, opacity: 0.55 },
  avatarEmojiActive: { opacity: 1 },
  avatarHint: {
    color: colors.faint,
    fontSize: 12,
    fontFamily: fonts.semibold,
    textAlign: "right",
    marginTop: 6,
  },
  avatarHintActive: { color: colors.success },
  genderRow: { flexDirection: "row", gap: 10 },
  genderChip: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: "#F7F9FD",
  },
  genderChipActive: {
    backgroundColor: "#EEF2FF",
    borderColor: colors.primary,
  },
  genderIcon: { fontSize: 19, color: colors.faint, fontFamily: fonts.extrabold },
  genderIconActive: { color: colors.primary },
  genderText: { fontSize: 15, fontFamily: fonts.bold, color: colors.muted },
  genderTextActive: { color: colors.primaryDark },
  pressed: { opacity: 0.7 },
  errorBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FECDD3",
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  errorIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    color: "#fff",
    fontSize: 12,
    fontFamily: fonts.extrabold,
    textAlign: "center",
    lineHeight: 18,
    marginLeft: 8,
    overflow: "hidden",
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontFamily: fonts.semibold,
    flexShrink: 1,
    textAlign: "right",
  },
  ctaWrap: { marginTop: 16, borderRadius: radius.md, ...shadow.glow },
  ctaPressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  cta: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaText: { color: "#fff", fontSize: 16, fontFamily: fonts.extrabold },
  ctaArrow: { color: "#fff", fontSize: 20, fontFamily: fonts.bold },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  footerText: { color: colors.muted, fontSize: 14 },
  link: { color: colors.primary, fontSize: 14, fontFamily: fonts.extrabold },
});
