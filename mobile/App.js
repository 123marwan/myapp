import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_800ExtraBold,
  Cairo_900Black,
} from "@expo-google-fonts/cairo";

import { AuthContext } from "./context/AuthContext";
import { clearSession, getStoredSession, persistSession, persistUser } from "./storage/sessionStorage";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UsersScreen from "./screens/UsersScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  const [fontsLoaded, fontError] = useFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Cairo_800ExtraBold,
    Cairo_900Black,
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      const session = await getStoredSession();
      if (!mounted) return;
      setToken(session.token);
      setUser(session.user);
      setBooting(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const auth = useMemo(
    () => ({
      token,
      user,
      signIn: async (nextToken, nextUser) => {
        setToken(nextToken);
        setUser(nextUser);
        await persistSession(nextToken, nextUser);
      },
      signOut: async () => {
        setToken(null);
        setUser(null);
        await clearSession();
      },
      updateUser: async (nextUser) => {
        setUser(nextUser);
        await persistUser(nextUser);
      },
    }),
    [token, user]
  );

  if (booting || (!fontsLoaded && !fontError)) {
    return (
      <LinearGradient
        colors={["#1E1B4B", "#4338CA", "#6D28D9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.splash}
      >
        <View pointerEvents="none" style={styles.splashDecor}>
          <View style={[styles.splashCircle, styles.splashCircleOne]} />
          <View style={[styles.splashCircle, styles.splashCircleTwo]} />
        </View>
        <View style={styles.splashLogo}>
          <Text style={styles.splashLogoText}>م</Text>
        </View>
        <Text style={styles.splashName}>myapp</Text>
        <Text style={styles.splashTag}>حسابك في مكان واحد</Text>
        <ActivityIndicator size="small" color="rgba(255,255,255,0.9)" style={styles.splashSpinner} />
      </LinearGradient>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={auth}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {token ? (
              <>
                <Stack.Screen name="Users" component={UsersScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E1B4B",
  },
  splashDecor: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  splashCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  splashCircleOne: { width: 320, height: 320, top: -120, right: -100 },
  splashCircleTwo: { width: 240, height: 240, bottom: -100, left: -80 },
  splashLogo: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  splashLogoText: {
    color: "#fff",
    fontSize: 34,
    fontFamily: "Cairo_800ExtraBold",
  },
  splashName: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "Cairo_800ExtraBold",
    marginTop: 16,
    letterSpacing: 0.5,
  },
  splashTag: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontFamily: "Cairo_400Regular",
    marginTop: 4,
  },
  splashSpinner: { marginTop: 26 },
});