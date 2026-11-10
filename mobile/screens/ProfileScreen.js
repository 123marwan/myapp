import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import Text from "../components/AppText";
import ErrorBanner from "../components/ui/ErrorBanner";
import { GENDER_LABELS } from "../constants/genders";
import { useAuth } from "../context/AuthContext";
import { fetchCurrentUser } from "../services/authService";
import { getApiErrorMessage, isUnauthorizedError } from "../services/apiError";
import { colors, fonts, gradients, radius, shadow } from "../theme";
import { formatDate } from "../utils/format";
import { getAvatarGradient, getInitials, getUserId } from "../utils/user";

function InfoRow({ icon, label, value, tint, ink, last }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={[styles.rowIcon, { backgroundColor: tint }]}>
        <Text style={[styles.rowIconText, { color: ink }]}>{icon}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={1}>{value || "غير محدد"}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen({ route, navigation }) {
  const { token, user, updateUser, signOut } = useAuth();
  const routeUser = route.params?.user ?? null;
  const isOwnProfile = !routeUser || getUserId(routeUser) === getUserId(user);

  const [profile, setProfile] = useState(routeUser || user);
  const [loading, setLoading] = useState(isOwnProfile && !routeUser);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    if (!isOwnProfile) return;

    setError("");
    try {
      const data = await fetchCurrentUser(token);
      setProfile(data);
      await updateUser(data);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        await signOut();
        return;
      }
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isOwnProfile, token, updateUser, signOut]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProfile();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadProfile]);

  const displayName = profile?.name || "مستخدم";
  const displayGender = useMemo(() => GENDER_LABELS[profile?.gender] || "", [profile?.gender]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <View pointerEvents="none" style={styles.heroDecor}>
            <View style={[styles.heroCircle, styles.heroCircleOne]} />
            <View style={[styles.heroCircle, styles.heroCircleTwo]} />
            <View style={[styles.heroCircle, styles.heroCircleThree]} />
          </View>

          <View style={styles.heroInner}>
            <View style={styles.headerTop}>
              <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
                <Text style={styles.backText}>→</Text>
              </Pressable>
              <Text style={styles.headerTag}>ACCOUNT</Text>
              <View style={styles.verifiedPill}>
                <Text style={styles.verifiedIcon}>✓</Text>
                <Text style={styles.verifiedText}>موثّق</Text>
              </View>
            </View>

            <View style={styles.avatarRing}>
              <LinearGradient colors={getAvatarGradient(displayName)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
                <Text style={styles.avatarText}>{profile?.avatar || getInitials(displayName)}</Text>
              </LinearGradient>
            </View>

            <Text style={styles.eyebrow}>{isOwnProfile ? "ملفي الشخصي" : "بروفايل المستخدم"}</Text>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{profile?.email || ""}</Text>

            <View style={styles.memberPill}>
              <Text style={styles.memberIcon}>📅</Text>
              <Text style={styles.memberText}>عضو منذ {formatDate(profile?.createdAt)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.cardHead}>
              <View>
                <Text style={styles.sectionTitle}>البيانات الشخصية</Text>
                <Text style={styles.sectionSub}>جاية مباشرة من قاعدة البيانات</Text>
              </View>
              <View style={styles.dbBadge}>
                <View style={styles.dbDot} />
                <Text style={styles.dbText}>محدّثة</Text>
              </View>
            </View>

            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.loadingText}>بنجيب بياناتك…</Text>
              </View>
            ) : (
              <>
                <InfoRow icon="✉️" label="الإيميل" value={profile?.email} tint={colors.soft} ink={colors.primary} />
                <InfoRow icon="👤" label="الجندر" value={displayGender || "غير محدد"} tint={colors.pinkSoft} ink="#DB2777" />
                <InfoRow icon="📱" label="رقم التليفون" value={profile?.phone} tint={colors.skySoft} ink="#0284C7" />
                <InfoRow icon="🗓️" label="تاريخ التسجيل" value={formatDate(profile?.createdAt)} tint={colors.amberSoft} ink={colors.amber} last />
              </>
            )}
          </View>

          <ErrorBanner message={error} />

          {isOwnProfile ? (
            <Pressable onPress={signOut} style={({ pressed }) => [styles.logout, pressed && styles.pressed]}>
              <Text style={styles.logoutIcon}>⎋</Text>
              <Text style={styles.logoutText}>تسجيل الخروج</Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.backToList, pressed && styles.pressed]}>
              <Text style={styles.backToListText}>رجوع لقائمة المستخدمين</Text>
            </Pressable>
          )}

          <Text style={styles.footerNote}>🔒 بياناتك محفوظة ومشفّرة</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 30 },
  pressed: { opacity: 0.65 },
  hero: { overflow: "hidden", borderBottomLeftRadius: 34, borderBottomRightRadius: 34, paddingBottom: 40 },
  heroDecor: { ...StyleSheet.absoluteFillObject },
  heroCircle: { position: "absolute", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.06)" },
  heroCircleOne: { width: 240, height: 240, top: -110, right: -70 },
  heroCircleTwo: { width: 180, height: 180, bottom: -70, left: -50, backgroundColor: "rgba(255,255,255,0.05)" },
  heroCircleThree: { width: 90, height: 90, top: 70, left: 30, backgroundColor: "rgba(255,255,255,0.04)" },
  heroInner: { width: "100%", maxWidth: 520, alignSelf: "center", paddingHorizontal: 20, paddingTop: 10, alignItems: "center" },
  headerTop: { width: "100%", flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.14)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  backText: { color: "#fff", fontSize: 18, fontFamily: fonts.bold },
  headerTag: { color: "rgba(255,255,255,0.65)", fontSize: 11, fontFamily: fonts.extrabold, letterSpacing: 3 },
  verifiedPill: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(16,185,129,0.18)", borderWidth: 1, borderColor: "rgba(16,185,129,0.4)", borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5 },
  verifiedIcon: { color: "#6EE7B7", fontSize: 10, fontFamily: fonts.black },
  verifiedText: { color: "#A7F3D0", fontSize: 10, fontFamily: fonts.extrabold, marginLeft: 4 },
  avatarRing: { width: 120, height: 120, borderRadius: 60, padding: 4, backgroundColor: "rgba(255,255,255,0.2)", marginTop: 6 },
  avatar: { flex: 1, borderRadius: 56, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "rgba(255,255,255,0.9)" },
  avatarText: { color: "#fff", fontSize: 42, fontFamily: fonts.extrabold },
  eyebrow: { color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: fonts.semibold, marginTop: 14 },
  name: { color: "#fff", fontSize: 25, fontFamily: fonts.extrabold, marginTop: 4, textAlign: "center" },
  email: { color: "rgba(255,255,255,0.78)", fontSize: 13, marginTop: 5, textAlign: "center" },
  memberPill: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6, marginTop: 12 },
  memberIcon: { fontSize: 11, marginRight: 6 },
  memberText: { color: "rgba(255,255,255,0.85)", fontSize: 11, fontFamily: fonts.bold },
  body: { width: "100%", maxWidth: 520, alignSelf: "center", paddingHorizontal: 16, marginTop: -26 },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 18, borderWidth: 1, borderColor: "rgba(232,236,244,0.9)", ...shadow.card },
  cardHead: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontFamily: fonts.extrabold, color: colors.ink, textAlign: "right" },
  sectionSub: { fontSize: 11, color: colors.faint, marginTop: 3, textAlign: "right" },
  dbBadge: { flexDirection: "row", alignItems: "center", backgroundColor: colors.successSoft, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 4 },
  dbDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success, marginRight: 5 },
  dbText: { color: colors.success, fontSize: 10, fontFamily: fonts.extrabold },
  loadingBox: { paddingVertical: 30, alignItems: "center" },
  loadingText: { color: colors.muted, fontSize: 12, marginTop: 10 },
  row: { flexDirection: "row-reverse", alignItems: "center", paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  rowIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", marginLeft: 12 },
  rowIconText: { fontSize: 16, fontFamily: fonts.extrabold },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 11, color: colors.faint, textAlign: "right" },
  rowValue: { fontSize: 15, fontFamily: fonts.bold, color: colors.ink, marginTop: 3, textAlign: "right" },
  logout: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: 15, marginTop: 20, borderWidth: 1.5, borderColor: "#F3C7C7" },
  logoutIcon: { color: colors.danger, fontSize: 16, fontFamily: fonts.extrabold, marginLeft: 8 },
  logoutText: { color: colors.danger, fontSize: 15, fontFamily: fonts.extrabold },
  backToList: { backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: 15, alignItems: "center", marginTop: 20, borderWidth: 1.5, borderColor: colors.line },
  backToListText: { color: colors.primary, fontSize: 15, fontFamily: fonts.extrabold },
  footerNote: { color: colors.faint, fontSize: 11, fontFamily: fonts.semibold, textAlign: "center", marginTop: 16 },
});