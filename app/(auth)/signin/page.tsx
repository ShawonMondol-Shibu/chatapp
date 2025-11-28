/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {useCookies} from "react-cookie"

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [,setCookie]= useCookies(['token'])
    const router = useRouter()
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

const mutation = useMutation({
  mutationFn: loginUser,
  onSuccess: (data) => {
    setCookie('token', data.access)
    // Save tokens
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    // Save user info
    localStorage.setItem("user", JSON.stringify(data.user));

    // Save chat sessions (if any)
    localStorage.setItem("chat_sessions", JSON.stringify(data.chat_sessions));

    // Save claim uploads
    localStorage.setItem("claim_uploads", JSON.stringify(data.claim_uploads));

    toast.success(data.message || "Login successful!");

    router.push("/"); // redirect to chat page
  },
  onError: (err: any) => {
    alert(err.message || "Invalid credentials");
  },
});

  function onSubmit(data: SignInFormValues) {
   
    mutation.mutate(data);
  }

  return (
    <div>
      <div className="space-y-6 mb-8 text-center">
        <h1 className="text-4xl font-bold text-teal-600">
          Sign in to your account
        </h1>
      </div>

      <Card className="w-lg bg-white rounded-2xl shadow-xl border-0 p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@email.com"
                      type="email"
                      {...field}
                      className="h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className="h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-11 rounded-lg transition-colors"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        {/* Additional Links */}
        <div className="space-y-4 ">
          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-600 hover:text-teal-600 transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              href="/signup"
              className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
