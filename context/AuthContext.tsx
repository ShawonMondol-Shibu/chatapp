/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { loginUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  name?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => void; // mutation exposed
  logout: () => void;
  mutationLoading: boolean;
}

const defaultContext: AuthContextProps = {
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  mutationLoading: false,
};

const AuthContext = createContext<AuthContextProps>(defaultContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [, setCookie, removeCookie] = useCookies(["token"]);

  const [user, setUser] = useState<User | null>(null);

  /* -------------------------
        LOGIN MUTATION
  ------------------------- */
  const mutation = useMutation({
    mutationFn: (values: LoginPayload) => loginUser(values),

    onSuccess: (data) => {
      // Save cookies
      setCookie("token", data.access);

      // Save local storage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem(
        "chat_sessions",
        JSON.stringify(data.chat_sessions || [])
      );
      localStorage.setItem(
        "claim_uploads",
        JSON.stringify(data.claim_uploads || [])
      );

      // Update state
      setUser(data.user);

      toast.success("Login successful!");
      router.push("/");
    },

    onError: (err: any) => {
      toast.error(err.message || "Invalid credentials");
    },
  });

  useEffect(()=>{
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  },[])

  /* -------------------------
        EXPOSE MUTATION AS LOGIN
  ------------------------- */
  const login = (payload: LoginPayload) => {
    mutation.mutate(payload);
  };

  const logout = () => {
    removeCookie("token");
    localStorage.clear();
    setUser(null);
    router.push("/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login, // exposed mutation
        logout,
        mutationLoading: mutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
