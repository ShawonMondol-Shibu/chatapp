import { AuthProvider } from "@/context/AuthContext";
import Image from "next/image";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-white to-green-500/50 flex items-center justify-center px-4 py-10">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-10 md:gap-20 w-full max-w-6xl">

        {/* LEFT SIDE (FORM) */}
        <div className="w-full max-w-md">
          <AuthProvider>{children}</AuthProvider>

          {/* Footer Disclaimer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500 space-y-2">
            <p className="font-semibold text-teal-600">Disclaimer.</p>
            <p>
              I provide information only. For complex legal matters, please
              consult with our experts.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE — Hidden on mobile */}
        <div className="hidden md:block">
          <Image
            width={700}
            height={627}
            src="/images/auth-bg.png"
            alt="Authentication banner image"
            className="w-full h-auto max-w-[480px] lg:max-w-[700px]"
          />
        </div>
      </div>
    </div>
  );
}
