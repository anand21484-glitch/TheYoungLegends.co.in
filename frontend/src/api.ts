// API + Auth helpers for Azaadi Tales
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// CRITICAL: For native APK builds, EXPO_PUBLIC_* env vars must be baked in
// at BUILD time. If the build process missed the env file, this fallback
// guarantees the app still points to a real, publicly-reachable backend
// instead of silently building an invalid `undefined/api/...` URL.
const FALLBACK_BASE = "https://azaadi-stories.preview.emergentagent.com";
const RAW_BASE = process.env.EXPO_PUBLIC_BACKEND_URL;
export const BASE_URL: string =
  RAW_BASE && /^https?:\/\//i.test(RAW_BASE) ? RAW_BASE : FALLBACK_BASE;

// Log once at startup so debug builds + adb logcat can confirm which
// backend the APK is actually hitting.
// eslint-disable-next-line no-console
console.log("[Azaadi] API base URL =>", BASE_URL);

export const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper: produces a human-readable diagnostic for any Axios error.
// - Network errors (no response received) get a clear message + the URL.
// - HTTP errors include status code + server-provided detail (if any).
// - Timeouts are explicit.
export const describeApiError = (err: any): string => {
  if (!err) return "Unknown error";
  // Axios timeout
  if (err.code === "ECONNABORTED") {
    return `Request timed out after 30s.\nServer: ${BASE_URL}\nPlease check your internet connection.`;
  }
  // No response received => network / DNS / TLS failure
  if (err.request && !err.response) {
    return (
      `Cannot reach the server.\n\nURL: ${BASE_URL}\n\n` +
      `• Check that your phone has internet\n` +
      `• Confirm the backend URL is correct and live\n` +
      `• If you built the APK yourself, verify EXPO_PUBLIC_BACKEND_URL was set at build time`
    );
  }
  // HTTP error response
  if (err.response) {
    const status = err.response.status;
    const detail =
      err.response.data?.detail ||
      err.response.data?.message ||
      err.message ||
      "Server error";
    return `Error ${status}: ${detail}`;
  }
  return err.message || "Something went wrong";
};

export const saveAuth = async (token: string, user: any) => {
  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = async () => {
  await AsyncStorage.multiRemove(["token", "user"]);
};

export const getStoredUser = async () => {
  const raw = await AsyncStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const getStoredToken = async () => AsyncStorage.getItem("token");
