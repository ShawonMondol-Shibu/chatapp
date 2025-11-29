/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import type { loginType, registerType } from "./types"

/* -------------------------------------------
   BASE CONFIG
-------------------------------------------- */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "allow" },
})

/* -------------------------------------------
   INTERCEPTOR → Add token automatically
-------------------------------------------- */
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

/* -------------------------------------------
   ERROR HANDLING
-------------------------------------------- */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        window.location.href = "/auth/login"
      }
    }
    return Promise.reject(error)
  },
)

/* -------------------------------------------
   GENERIC FETCH WRAPPER
-------------------------------------------- */
async function apiFetch<T>(path: string, options: any = {}): Promise<T> {
  try {
    const res = await axiosInstance({
      url: path,
      method: options.method || "GET",
      data: options.data,
      headers: options.headers,
      params: options.params,
    })
    return res.data
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message
    throw new Error(errorMessage || "An error occurred")
  }
}

/* -------------------------------------------
   TYPES
-------------------------------------------- */
// LOGIN RESPONSE
export interface LoginResponse {
  message: string
  access: string
  refresh: string
  user: {
    id: number
    full_name: string
    email: string
    phone_number: string
    address: string
  }
  chat_sessions: any[]
  claim_uploads: any[]
}

// REGISTER RESPONSE
export interface RegisterResponse {
  id: number
  full_name: string
  email: string
  phone_number: string
  address: string
}

export interface ChatMessage {
  id: number
  sender: "User" | "AI"
  content: string
  flagged: boolean
  flag_type: string | null
  timestamp: string
  session: number
  user: string
}

export interface ChatSession {
  session_id: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface ChatResponse {
  session: ChatSession
  user_message: ChatMessage
  ai_message: ChatMessage
  all_messages: ChatMessage[]
}

export interface ChatRequestPayload {
  content: string
  flagged?: boolean
  flag_type?: string
}

/* -------------------------------------------
   AUTH FUNCTIONS
-------------------------------------------- */
/** LOGIN */
export const loginUser = (data: loginType): Promise<LoginResponse> =>
  apiFetch<LoginResponse>("/login/", {
    method: "POST",
    data,
  })

/** REGISTER */
export const registerUser = (data: registerType): Promise<RegisterResponse> =>
  apiFetch<RegisterResponse>("/register/", {
    method: "POST",
    data,
  })

/* -------------------------------------------
   CHAT FUNCTIONS
-------------------------------------------- */
export const chatAPI = (data: ChatRequestPayload): Promise<ChatResponse> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

  if (!token) {
    throw new Error("No access token found. Please log in again.")
  }

  return apiFetch<ChatResponse>("/chat/", {
    method: "POST",
    data,
  })
}
