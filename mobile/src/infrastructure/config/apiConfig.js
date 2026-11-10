import Constants from "expo-constants";

function getDevServerHost() {
  const hostUri = Constants.expoConfig?.hostUri || Constants.expoGoConfig?.debuggerHost || "";
  const host = String(hostUri).split(":")[0];
  return /^[0-9a-zA-Z.-]+$/.test(host) ? host : null;
}

const devHost = getDevServerHost();

export const API_URL = devHost ? `http://${devHost}:5000/api` : "http://192.168.1.24:5000/api";