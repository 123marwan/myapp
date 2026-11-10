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
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService";
import { getApiErrorMessage } from "../services/apiError";
import { colors, fonts, gradients, radius, shadow } from "../theme";

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("من فضلك اكتب الإيميل والباسورد");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const session = await login({ email: trimmedEmail, password });
      await signIn(session.token, session.user);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View pointerEvents="none" style={styles.blobs}>
        <LinearGradient
          colors={["rgba(99,102,241,0.22)", "rgba(99,102,241,0)"]}
          style={[styles.blob, styles.blobOne]}
        />
        <LinearGradient
          colors={["rgba(6,182,212,0.18)", "rgba(6,182,212,0)"]}
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
            <View style={styles.brandRow}>
              <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logo}>
                <Text style={styles.logoText}>م</Text>
              </LinearGradient>
              <View>
                <Text style={styles.brandName}>myapp</Text>
                <Text style={styles.brandTag}>حسابك في مكان واحد</Text>
              </View>
            </View>

            <Text style={styles.title}>أهلاً بيك 👋</Text>
            <Text style={styles.subtitle}>سجّل الدخول علشان تكمل من غير ما تفقد بياناتك.</Text>

            <View style={styles.card}>
              <FormTextField
                label="الإيميل"
                icon="@"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                autoComplete="email"
                editable={!loading}
                focused={focusedField === "email"}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
              />

              <FormTextField
                label="الباسورد"
                icon="🔒"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                textContentType="password"
                autoComplete="current-password"
                editable={!loading}
                onSubmitEditing={handleLogin}
                focused={focusedField === "password"}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                rightActionLabel={showPassword ? "إخفاء" : "عرض"}
                onRightActionPress={() => setShowPassword((value) => !value)}
              />

              <ErrorBanner message={error} />

              <PrimaryButton title="تسجيل الدخول" onPress={handleLogin} loading={loading} />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>جديد هنا؟</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                onPress={() => navigation.navigate("Register")}
                disabled={loading}
                style={({ pressed }) => [styles.ghostBtn, pressed && styles.ghostPressed]}
              >
                <Text style={styles.ghostText}>اعمل حساب جديد</Text>
              </Pressable>
            </View>

            <View style={styles.perksRow}>
              <View style={styles.perk}>
                <Text style={styles.perkIcon}>🔒</Text>
                <Text style={styles.perkText}>تشفير كامل</Text>
              </View>
              <View style={styles.perkDivider} />
              <View style={styles.perk}>
                <Text style={styles.perkIcon}>⚡</Text>
                <Text style={styles.perkText}>دخول سريع</Text>
              </View>
              <View style={styles.perkDivider} />
              <View style={styles.perk}>
                <Text style={styles.perkIcon}>🛡️</Text>
                <Text style={styles.perkText}>بيانات آمنة</Text>
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
  blobOne: { width: 320, height: 320, top: -150, right: -90 },
  blobTwo: { width: 260, height: 260, bottom: -110, left: -80 },
  scroll: { flexGrow: 1, paddingVertical: 28, paddingHorizontal: 20 },
  shell: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  brandRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 26,
    gap: 12,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.glow,
  },
  logoText: { color: "#fff", fontSize: 24, fontFamily: fonts.extrabold },
  brandName: {
    color: colors.ink,
    fontSize: 18,
    fontFamily: fonts.extrabold,
    letterSpacing: 0.3,
    textAlign: "right",
  },
  brandTag: { color: colors.muted, fontSize: 12, marginTop: 2, textAlign: "right" },
  title: {
    fontSize: 32,
    fontFamily: fonts.extrabold,
    color: colors.ink,
    textAlign: "right",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: "right",
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(232,236,244,0.9)",
    ...shadow.card,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 14,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerText: {
    color: colors.faint,
    fontSize: 12,
    fontFamily: fonts.bold,
    marginHorizontal: 12,
  },
  ghostBtn: {
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#DDE3F0",
    backgroundColor: "#FBFCFE",
  },
  ghostPressed: { opacity: 0.7 },
  ghostText: { color: colors.primary, fontSize: 15, fontFamily: fonts.extrabold },
  perksRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  perk: { flex: 1, alignItems: "center", gap: 3 },
  perkIcon: { fontSize: 13 },
  perkText: { color: colors.muted, fontSize: 10, fontFamily: fonts.semibold },
  perkDivider: { width: 1, height: 22, backgroundColor: colors.line },
});