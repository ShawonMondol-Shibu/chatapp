/* eslint-disable @typescript-eslint/no-explicit-any */
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
  password: z.string().min(8, "Password must be at least 8 characters"),
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
      console.log(data);
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
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-teal-600">
            Create Your Account
          </h1>
         
    
        </div>

        {/* Card Container */}
        <Card className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* FULL NAME */}
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PHONE NUMBER */}
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ADDRESS */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your address"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="h-11 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
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

              {/* TERMS & CONDITIONS */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(Boolean(v))}
                      />
                    </FormControl>
                    <div className="text-sm text-gray-700 leading-tight">
                      I agree to the{" "}
                      <span className="text-teal-600 underline cursor-pointer">
                        privacy policy
                      </span>
                      .
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* SUBMIT */}
              <Button
                type="submit"
                className="w-full h-11 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </Form>

          {/* BOTTOM LINK */}
          <div className="text-center text-sm mt-6">
            <span className="text-gray-600">Already have an account?</span>
            <Link
              href="/signin"
              className="text-teal-600 font-semibold ml-1 hover:text-teal-700"
            >
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
