// API + Auth helpers for Azaadi Tales
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;
export const API = axios.create({ baseURL: `${BASE}/api`, timeout: 30000 });

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
