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
import { useAuth } from "@/context/AuthContext";

const signInSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(8, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function Page() {
  const [showPassword, setShowPassword,] = useState(false);
  const { login, mutationLoading } = useAuth();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: SignInFormValues) {
    const payLoad = {
        email:values.email, password:values.password
    }
    login(payLoad);
  }

  return (
    <div className="m-auto px-4">
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
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="you@mail.com" />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-11 rounded-lg transition-colors"
              disabled={mutationLoading}
            >
              {mutationLoading? "Signing In...":"Sign In"}
            </Button>
          </form>
        </Form>

        {/* Links */}
        <div className="space-y-4 mt-4">
          <div className="text-right text-sm">
            <Link href="/auth/forgot-password">Forgot password?</Link>
          </div>

          <div className="text-center text-sm">
            <span>Don't have an account?</span>
            <Link href="/signup" className="text-teal-600 font-semibold ml-1">
              Sign Up
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
