import axios from "axios";
import { supabase } from "./supabase";

// 👇 FIX: Changed 8081 to 8000
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.254.107:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// automatically inject the supabase jwt into any outgoing request
apiClient.interceptors.request.use(async (config) => {
  const { data, error } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  // ATTACH THE TOKEN FIRST
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // HEN LOG THE RESULTS
  // console.log("=== 🚀 OUTGOING NETWORK REQUEST ===");
  // console.log(
  //   " Supabase Auth Status:",
  //   token ? "TOKEN FOUND" : "NO TOKEN (User Logged Out)",
  // );
  if (error) console.log("Auth Error:", error.message);
  // console.log("URL:", config.url);
  // console.log("Headers:", JSON.stringify(config.headers, null, 2));
  // console.log("====================================");

  return config;
});
