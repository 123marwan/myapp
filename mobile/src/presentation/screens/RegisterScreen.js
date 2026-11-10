import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import Text from "../components/AppText";
import ErrorBanner from "../components/ui/ErrorBanner";
import FormTextField from "../components/ui/FormTextField";
import PrimaryButton from "../components/ui/PrimaryButton";
import { AVATARS } from "../constants/avatars";
import { GENDERS } from "../constants/genders";
import { useAuth } from "../context/AuthContext";
import { colors, fonts, radius, shadow } from "../theme/tokens";
import { getPasswordScore, PASSWORD_STRENGTH } from "../utils/password";
import { getApiErrorMessage, registerUserUseCase } from "../../main/container";

export default function RegisterScreen({ navigation }) {
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male",
    avatar: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.password) {
      return "من فضلك اكمل كل الحقول";
    }
    if (!form.avatar) return "اختار الأفاتار بتاعك الأول";
    if (!/^[0-9]{7,15}$/.test(form.phone.trim())) return "رقم التليفون لازم يكون أرقام بس (7 لـ 15 رقم)";
    if (form.password.length < 6) return "الباسورد لازم يكون 6 حروف على الأقل";
    return "";
  }

  async function handleRegister() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const session = await registerUserUseCase.execute({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        gender: form.gender,
        avatar: form.avatar,
        password: form.password,
      });
      await signIn(session.token, session.user);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const passwordLevel = getPasswordScore(form.password);
  const strength = passwordLevel ? PASSWORD_STRENGTH[passwordLevel] : null;

  return (
    <SafeAreaView style={styles.safe}>
      <View pointerEvents="none" style={styles.blobs}>
        <LinearGradient colors={["rgba(124,58,237,0.18)", "rgba(124,58,237,0)"]} style={[styles.blob, styles.blobOne]} />
        <LinearGradient colors={["rgba(14,165,233,0.16)", "rgba(14,165,233,0)"]} style={[styles.blob, styles.blobTwo]} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.shell}>
            <View style={styles.topRow}>
              <Pressable onPress={() => navigation.goBack()} disabled={loading} hitSlop={10} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
                <Text style={styles.backArrow}>→</Text>
              </Pressable>
              <View style={styles.topText}>
                <Text style={styles.eyebrow}>خطوة 01</Text>
                <Text style={styles.title}>حساب جديد</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>املأ بياناتك وابدأ فورًا — كل حاجة بتتحفظ في الداتابيز.</Text>

            <View style={styles.card}>
              <FormTextField label="الاسم" icon="👤" value={form.name} onChangeText={(value) => updateField("name", value)} placeholder="اسمك بالكامل" autoCapitalize="words" editable={!loading} focused={focusedField === "name"} onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField("")} />

              <Text style={styles.label}>اختار الأفاتار</Text>
              <View style={styles.avatarGrid}>
                {AVATARS.map((emoji) => {
                  const active = form.avatar === emoji;
                  return (
                    <Pressable key={emoji} onPress={() => updateField("avatar", emoji)} disabled={loading} style={({ pressed }) => [styles.avatarChip, active && styles.avatarChipActive, pressed && styles.pressed]}>
                      <Text style={[styles.avatarEmoji, active && styles.avatarEmojiActive]}>{emoji}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={[styles.avatarHint, form.avatar && styles.avatarHintActive]}>
                {form.avatar ? "تمام! ده الأفاتار اللي هيظهر معاك 👌" : "لازم تختار أفاتار قبل إنشاء الحساب."}
              </Text>

              <FormTextField label="الإيميل" icon="@" value={form.email} onChangeText={(value) => updateField("email", value)} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" editable={!loading} focused={focusedField === "email"} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField("")} />
              <FormTextField label="رقم التليفون" icon="📱" value={form.phone} onChangeText={(value) => updateField("phone", value)} placeholder="01xxxxxxxxx" keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" maxLength={15} editable={!loading} focused={focusedField === "phone"} onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField("")} />

              <Text style={styles.label}>الجندر</Text>
              <View style={styles.genderRow}>
                {GENDERS.map((option) => {
                  const active = form.gender === option.key;
                  return (
                    <Pressable key={option.key} onPress={() => updateField("gender", option.key)} disabled={loading} style={({ pressed }) => [styles.genderChip, active && styles.genderChipActive, pressed && styles.pressed]}>
                      <Text style={[styles.genderIcon, active && styles.genderIconActive]}>{option.icon}</Text>
                      <Text style={[styles.genderText, active && styles.genderTextActive]}>{option.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <FormTextField label="الباسورد" icon="🔒" value={form.password} onChangeText={(value) => updateField("password", value)} placeholder="6 حروف على الأقل" secureTextEntry={!showPassword} textContentType="newPassword" autoComplete="new-password" editable={!loading} onSubmitEditing={handleRegister} focused={focusedField === "password"} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField("")} rightActionLabel={showPassword ? "إخفاء" : "عرض"} onRightActionPress={() => setShowPassword((value) => !value)} />

              {form.password && strength ? (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthTrack}>
                    {[1, 2, 3].map((step) => (
                      <View key={step} style={[styles.strengthBar, step <= passwordLevel && { backgroundColor: strength.color }]} />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
                </View>
              ) : null}

              <ErrorBanner message={error} />
              <PrimaryButton title="إنشاء الحساب" onPress={handleRegister} loading={loading} />

              <View style={styles.footer}>
                <Text style={styles.footerText}>عندك حساب بالفعل؟</Text>
                <Pressable onPress={() => navigation.goBack()} disabled={loading} hitSlop={8}>
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
  topRow: { flexDirection: "row-reverse", alignItems: "center", marginBottom: 8, gap: 12 },
  topText: { flex: 1 },
  backBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", ...shadow.soft },
  backArrow: { color: colors.ink, fontSize: 18, fontFamily: fonts.bold },
  eyebrow: { color: colors.primary, fontSize: 12, fontFamily: fonts.extrabold, letterSpacing: 1, textAlign: "right" },
  title: { fontSize: 26, fontFamily: fonts.extrabold, color: colors.ink, textAlign: "right", marginTop: 2 },
  subtitle: { fontSize: 14, color: colors.muted, textAlign: "right", lineHeight: 20, marginBottom: 12 },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 14, borderWidth: 1, borderColor: "rgba(232,236,244,0.9)", ...shadow.card },
  label: { fontSize: 13, fontFamily: fonts.bold, color: "#3F4756", marginBottom: 6, marginTop: 8, textAlign: "right" },
  avatarGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  avatarChip: { width: 40, height: 40, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#F7F9FD", borderWidth: 1.5, borderColor: colors.line },
  avatarChipActive: { backgroundColor: "#EEF2FF", borderColor: colors.primary, transform: [{ scale: 1.06 }] },
  avatarEmoji: { fontSize: 21, opacity: 0.55 },
  avatarEmojiActive: { opacity: 1 },
  avatarHint: { color: colors.faint, fontSize: 12, fontFamily: fonts.semibold, textAlign: "right", marginTop: 6 },
  avatarHintActive: { color: colors.success },
  genderRow: { flexDirection: "row", gap: 10 },
  genderChip: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 10, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.line, backgroundColor: "#F7F9FD" },
  genderChipActive: { backgroundColor: "#EEF2FF", borderColor: colors.primary },
  genderIcon: { fontSize: 19, color: colors.faint, fontFamily: fonts.extrabold },
  genderIconActive: { color: colors.primary },
  genderText: { fontSize: 15, fontFamily: fonts.bold, color: colors.muted },
  genderTextActive: { color: colors.primaryDark },
  pressed: { opacity: 0.7 },
  strengthRow: { flexDirection: "row-reverse", alignItems: "center", marginTop: 8, gap: 10 },
  strengthTrack: { flex: 1, flexDirection: "row-reverse", gap: 5 },
  strengthBar: { flex: 1, height: 5, borderRadius: 3, backgroundColor: "#E5E9F2" },
  strengthLabel: { fontSize: 11, fontFamily: fonts.bold },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10 },
  footerText: { color: colors.muted, fontSize: 14 },
  link: { color: colors.primary, fontSize: 14, fontFamily: fonts.extrabold },
});