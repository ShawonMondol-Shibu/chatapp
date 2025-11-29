import { AuthProvider } from "@/context/AuthContext";
import Image from "next/image";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-white to-green-500/50 flex items-center justify-center">
      <div className="flex items-center flex-wrap justify-center gap-20 ">
        <div>
          <AuthProvider>{children}</AuthProvider>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500 space-y-2">
            <p className="font-semibold text-teal-600">Disclaimer.</p>
            <p>
              I provide information only. For complex legal matters, please
              consult with our experts.
            </p>
          </div>
        </div>
        <Image
          width={700}
          height={627.25}
          src={"/images/auth-bg.png"}
          alt="authencation banner image"
        />
      </div>
    </div>
  );
}
