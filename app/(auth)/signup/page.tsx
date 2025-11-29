/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { registerUser } from "@/lib/api";
import { toast } from "sonner";
import { registerType } from "@/lib/types";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  full_name: z.string().min(2, "Please enter your full name"),
  phone_number: z.string().min(2, "Please enter your phone number"),
  address: z.string().min(2, "Please enter your address"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
   terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      address: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success("Account created successfully!");
      console.log("API Response:", data);
      router.push("/signin");
    },
    onError: (err: any) => {
      toast.error(err.message || "Registration failed");
    },
  });

  function onSubmit(data: SignInFormValues) {
    const payload: registerType = {
      full_name: data.full_name,
      phone_number: data.phone_number,
      email: data.email,
      address: data.address,
      password: data.password,
    };
    mutation.mutate(payload);
    console.log("Sign in with:", data);
  }

  return (
    <div>
      <div className="space-y-6 mb-8 text-center">
        <h1 className="text-4xl font-bold text-teal-600">
          Create Your Account
        </h1>
      </div>

      <Card className="w-lg bg-white rounded-2xl shadow-xl border-0 p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Full Name"
                      type="text"
                      {...field}
                      className="h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter you Phone Number"
                      type="text"
                      {...field}
                      className="h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Email Address"
                      type="email"
                      {...field}
                      className="h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Address"
                      type="text"
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

            {/* Checkbox */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => {
                        // onCheckedChange gives boolean | "indeterminate"
                        const checked = Boolean(v);
                        field.onChange(checked);
                      }}
                    />
                  </FormControl>

                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      You agree to our friendly privacy policy.
                    </FormLabel>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-11 rounded-lg transition-colors"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </Form>

        {/* Additional Links */}
        <div className="space-y-4 ">
          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              href="/signin"
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
