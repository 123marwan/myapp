import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export async function getStoredSession() {
  try {
    const [[, token], [, rawUser]] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
    if (!token) return { token: null, user: null };

    let user = null;
    if (rawUser) {
      try {
        user = JSON.parse(rawUser);
      } catch {
        user = null;
      }
    }

    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export async function persistSession(token, user) {
  try {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user ?? null)],
    ]);
  } catch {
    // Persistence is best-effort; auth can still work in-memory.
  }
}

export async function clearSession() {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch {
    // Ignore storage cleanup errors.
  }
}

export async function persistUser(user) {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user ?? null));
  } catch {
    // Ignore storage errors.
  }
}