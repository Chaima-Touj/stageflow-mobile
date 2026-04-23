import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ───────── API INSTANCE ───────── */
const API = axios.create({
  baseURL: "http://10.6.50.33:5000/api",
  timeout: 15000,
});

/* 🔐 Inject Token */
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // multipart fix
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ❌ Error handling */
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Network Error";

    console.log("🔥 API ERROR:", message);

    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("token");
    }

    return Promise.reject(new Error(message));
  }
);

/* ───────── apiFetch (FIX HERE) ───────── */
export const apiFetch = async (url, options = {}) => {
  const method = options.method || "GET";

  try {
    const res = await API({
      url,
      method,
      data: options.body,
    });

    return res.data;
  } catch (err) {
    throw err;
  }
};

/* ───────── TOKEN HELPERS ───────── */
export const setToken = (token) =>
  AsyncStorage.setItem("token", token);

export const getToken = () =>
  AsyncStorage.getItem("token");

export const removeToken = () =>
  AsyncStorage.removeItem("token");

export default API;