/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios";
import { loginType, registerType } from "./types";

/* -------------------------------------------
   BASE CONFIG
-------------------------------------------- */
export const API_BASE = "https://api.winaclaim.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

/* -------------------------------------------
   INTERCEPTOR → Add token automatically
-------------------------------------------- */
axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = {
        ...(config.headers as any),
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});

/* -------------------------------------------
   GENERIC FETCH WRAPPER
-------------------------------------------- */
async function apiFetch<T>(path: string, options: AxiosRequestConfig = {}): Promise<T> {
  try {
    const res = await axiosInstance({
      url: path,
      method: options.method || "GET",
      data: options.data ?? options.body,
      headers: options.headers,
      params: options.params,
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.data) throw err.response.data;
    throw err;
  }
}

/* -------------------------------------------
   TYPES
-------------------------------------------- */

// LOGIN RESPONSE
export interface LoginResponse {
  claim_uploads(claim_uploads: any): string;
  chat_sessions(chat_sessions: any): string;
  message: string;
  access: string;
  refresh: string;
  user: {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
  };
}

// REGISTER RESPONSE
export interface RegisterResponse {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
}

// CHAT RESPONSE
export interface ChatResponse {
  content: string;
  flagged: boolean;
  flag_type: string;
}

/* -------------------------------------------
   AUTH FUNCTIONS
-------------------------------------------- */

/** LOGIN */
export const loginUser = (data:loginType): Promise<LoginResponse> =>
  apiFetch<LoginResponse>("/login/", {
    method: "POST",
    data,
  });

/** REGISTER */
export const registerUser = (data: registerType): Promise<RegisterResponse> =>
  apiFetch<RegisterResponse>("/register/", {
    method: "POST",
    data,
  });

/* -------------------------------------------
   CHAT FUNCTIONS
-------------------------------------------- */

/** Send message to chat with Authorization header from localStorage */
export const chatAPI = (data:ChatResponse): Promise<ChatResponse> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) throw new Error("No access token found");

  return apiFetch<ChatResponse>("/chat/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Explicitly set for chatAPI
    },
    data,
  });
};
