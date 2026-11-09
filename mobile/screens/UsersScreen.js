import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../components/AppText";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import { api, getErrorMessage } from "../api";
import { useAuth } from "../AuthContext";
import {
  avatarGradient,
  colors,
  fonts,
  formatDate,
  gradients,
  initials,
  radius,
  shadow,
} from "../theme";

function isToday(value) {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function UsersScreen({ navigation }) {
  const { token, user, signOut } = useAuth();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = useCallback(
    async (isRefresh = false) => {
      setError("");
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const { data } = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err?.response?.status === 401) {
          await signOut();
          return;
        }
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, signOut]
  );

  useEffect(() => {
    // نأجل التحميل للـ tick اللي بعده عشان نتفادى setState المتزامن جوه الـ effect
    const timer = setTimeout(loadUsers, 0);
    return () => clearTimeout(timer);
  }, [loadUsers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((item) =>
      [item.name, item.email, item.phone]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [users, query]);

  const todayCount = useMemo(
    () => users.filter((item) => isToday(item.createdAt)).length,
    [users]
  );
  const phoneCount = useMemo(
    () => users.filter((item) => Boolean(item.phone)).length,
    [users]
  );

  const heroBlock = (
    <View style={styles.hero}>
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={styles.heroDecor}>
        <View style={[styles.heroCircle, styles.heroCircleOne]} />
        <View style={[styles.heroCircle, styles.heroCircleTwo]} />
      </View>

      <View style={styles.heroInner}>
        <View style={styles.heroTop}>
          <View style={styles.heroText}>
            <Text style={styles.heroEyebrow}>MY COMMUNITY</Text>
            <Text style={styles.greeting} numberOfLines={1}>
              أهلاً {user?.name || "بيك"} 👋
            </Text>
            <Text style={styles.heroSub}>كل الناس اللي معاك في مكان واحد</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate("Profile")}
            style={({ pressed }) => [pressed && styles.pressed]}
            hitSlop={8}
          >
            <View style={styles.avatarRing}>
              <LinearGradient
                colors={avatarGradient(user?.name)}
                style={styles.heroAvatar}
              >
                <Text style={styles.heroAvatarText}>
                  {user?.avatar || initials(user?.name)}
                </Text>
              </LinearGradient>
            </View>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <Stat value={users.length} label="مستخدم" />
          <View style={styles.statDivider} />
          <Stat value={todayCount} label="انضموا النهاردة" />
          <View style={styles.statDivider} />
          <Stat value={phoneCount} label="عندهم تليفون" />
        </View>

        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="ابحث بالاسم أو الإيميل أو التليفون"
            placeholderTextColor="rgba(255,255,255,0.55)"
            autoCorrect={false}
          />
          {query ? (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Text style={styles.searchClear}>✕</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );

  const listHeadBlock = (
    <View style={styles.listHead}>
      <View>
        <Text style={styles.listTitle}>
          {query ? "نتائج البحث" : "المستخدمين"}
        </Text>
        <Text style={styles.listSub}>{filtered.length} حساب</Text>
      </View>
      <View style={styles.livePill}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>مباشر</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar style="light" />
      {loading ? (
        <View style={styles.loadingWrap}>
          <LinearGradient
            colors={gradients.hero}
            style={StyleSheet.absoluteFill}
          />
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>بنجيب بيانات المستخدمين…</Text>
        </View>
      ) : (
        <>
          {heroBlock}
          {listHeadBlock}
          <View style={styles.listWrap}>
            <FlatList
            data={filtered}
            keyExtractor={(item) => String(item._id || item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadUsers(true)}
                tintColor="#4F46E5"
                colors={["#4F46E5"]}
              />
            }
            ListEmptyComponent={
              <View style={styles.center}>
                {error ? (
                  <>
                    <Text style={styles.emptyEmoji}>⚠️</Text>
                    <Text style={styles.error}>{error}</Text>
                    <Pressable
                      onPress={() => loadUsers()}
                      style={({ pressed }) => [
                        styles.retry,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={styles.retryText}>حاول تاني</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Text style={styles.emptyEmoji}>🔎</Text>
                    <Text style={styles.empty}>
                      {query ? "مفيش نتائج مطابقة للبحث" : "مفيش مستخدمين لسه"}
                    </Text>
                  </>
                )}
              </View>
            }
            renderItem={({ item }) => {
              const mine = String(item._id || item.id) === String(user?.id);
              return (
                <Pressable
                  onPress={() => navigation.navigate("Profile", { user: item })}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && styles.rowPressed,
                  ]}
                >
                  <LinearGradient
                    colors={avatarGradient(item.name)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>
                      {item.avatar || initials(item.name)}
                    </Text>
                  </LinearGradient>

                  <View style={styles.rowText}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name} numberOfLines={1}>
                        {item.name}
                      </Text>
                      {mine ? (
                        <View style={styles.youBadge}>
                          <Text style={styles.youText}>أنت</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.email} numberOfLines={1}>
                      {item.email}
                    </Text>
                    <View style={styles.metaRow}>
                      {item.phone ? (
                        <Text style={styles.phoneChip}>📱 {item.phone}</Text>
                      ) : null}
                      <Text style={styles.date}>
                        {formatDate(item.createdAt)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.chevron}>‹</Text>
                </Pressable>
              );
            }}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  pressed: { opacity: 0.6 },
  hero: {
    overflow: "hidden",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroDecor: { ...StyleSheet.absoluteFillObject },
  heroCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  heroCircleOne: { width: 220, height: 220, top: -90, right: -60 },
  heroCircleTwo: {
    width: 160,
    height: 160,
    bottom: -60,
    left: -40,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  heroInner: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  heroTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  heroText: { flex: 1 },
  heroEyebrow: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    fontFamily: fonts.extrabold,
    letterSpacing: 2,
    textAlign: "right",
    marginBottom: 6,
  },
  greeting: { color: "#fff", fontSize: 24, fontFamily: fonts.extrabold, textAlign: "right" },
  heroSub: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    marginTop: 4,
    textAlign: "right",
  },
  avatarRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 3,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  heroAvatar: {
    flex: 1,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  heroAvatarText: { color: "#fff", fontSize: 20, fontFamily: fonts.extrabold },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: radius.lg,
    paddingVertical: 12,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: { color: "#fff", fontSize: 19, fontFamily: fonts.extrabold },
  statLabel: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 10,
    fontFamily: fonts.semibold,
    marginTop: 3,
  },
  statDivider: { width: 1, height: 26, backgroundColor: "rgba(255,255,255,0.18)" },
  searchWrap: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchIcon: { fontSize: 14, marginLeft: 8 },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    padding: 0,
    textAlign: "right",
    fontFamily: fonts.regular,
  },
  searchClear: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontFamily: fonts.extrabold,
    paddingHorizontal: 4,
  },
  list: { paddingBottom: 28, flexGrow: 1 },
  listWrap: {
    flex: 1,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  listHead: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  listTitle: { fontSize: 18, fontFamily: fonts.extrabold, color: colors.ink, textAlign: "right" },
  listSub: { fontSize: 12, color: colors.faint, marginTop: 2, textAlign: "right" },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  liveText: { color: colors.success, fontSize: 11, fontFamily: fonts.extrabold },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 13,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(232,236,244,0.8)",
    ...shadow.soft,
  },
  rowPressed: { opacity: 0.75, transform: [{ scale: 0.995 }] },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  avatarText: { color: "#fff", fontSize: 20, fontFamily: fonts.extrabold },
  rowText: { flex: 1 },
  nameRow: { flexDirection: "row-reverse", alignItems: "center" },
  name: {
    fontSize: 15,
    fontFamily: fonts.extrabold,
    color: colors.ink,
    maxWidth: "75%",
    textAlign: "right",
  },
  youBadge: {
    backgroundColor: colors.soft,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginRight: 6,
  },
  youText: { color: colors.primary, fontSize: 9, fontFamily: fonts.extrabold },
  email: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 3,
    textAlign: "right",
  },
  metaRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
  },
  phoneChip: {
    color: colors.primary,
    fontSize: 11,
    fontFamily: fonts.bold,
    backgroundColor: colors.soft,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
    overflow: "hidden",
  },
  date: { color: colors.faint, fontSize: 10 },
  chevron: {
    color: "#C3CBD9",
    fontSize: 22,
    fontFamily: fonts.bold,
    marginLeft: 4,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 12,
    fontFamily: fonts.semibold,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyEmoji: { fontSize: 34, marginBottom: 10 },
  empty: { color: colors.muted, fontSize: 14, fontFamily: fonts.semibold },
  error: {
    color: colors.danger,
    fontSize: 14,
    textAlign: "center",
    fontFamily: fonts.semibold,
  },
  retry: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: { color: "#fff", fontFamily: fonts.extrabold },
});
