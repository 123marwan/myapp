import Constants from "expo-constants";

// في وضع التطوير بناخد IP جهاز الكمبيوتر تلقائيًا من سيرفر Expo
// (نفس الـ IP اللي الموبايل بيكلم بيه Expo)، فمش محتاج تعدّل حاجة لو الـ IP اتغير.
function getDevServerHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    "";
  const host = String(hostUri).split(":")[0];
  return /^[0-9a-zA-Z.-]+$/.test(host) ? host : null;
}

const devHost = getDevServerHost();

export const API_URL = devHost
  ? `http://${devHost}:5000/api`
  : "http://192.168.1.24:5000/api";
