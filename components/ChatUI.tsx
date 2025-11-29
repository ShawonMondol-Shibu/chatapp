/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogOut, SendHorizontal, Loader2, UserCircle } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export function ChatUI() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { user } = useAuth();
  const { message, setMessage, history, isLoading, sendMessage } =
    useChatContext();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/signin");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("chat_sessions");
    toast.success("Logged out successfully");
    router.push("/signin");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  console.log(user);

  return (
    <main className="min-h-screen p-4 sm:p-10 flex flex-col bg-linear-to-br from-green-50 to-white">
      {/* Header */}
      <section className="mb-8 w-fit">
        <h1 className="text-3xl sm:text-4xl font-semibold text-green-700">
          Monica
        </h1>
        <p className="text-green-600 mt-2 text-sm sm:text-base">
          Your AI insurance claim assistant
        </p>
      </section>

      {/* Logout */}
      <div className="fixed w-fit right-4 top-4 sm:right-10 sm:top-10 group hover:drop-shadow-lg transition-all duration-300 ease-in-out ">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-white group-hover:text-white group-hover:bg-green-500">
            <div className="flex items-center justify-center gap-1">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <small className="capitalize font-semibold">{user?.full_name}</small>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Badge>{user?.is_subscription? "Premium": "Buy Subscription"}</Badge>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                onClick={handleLogout}
                variant="secondary"
                className=" gap-2 hover:bg-green-500 hover:text-white hover:cursor-pointer "
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2">
        {history.length === 0 && !isLoading && (
          <Card className="w-fit max-w-xs bg-gray-100 shadow-none border-0">
            <CardContent className="p-4">
              <p className="font-semibold text-gray-900">Monica</p>
              <p className="text-sm mt-2 text-gray-700">
                Hi! I'm Monica, your insurance claim assistant. How can I help?
              </p>
            </CardContent>
          </Card>
        )}

        {history.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "User" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                msg.sender === "User"
                  ? "bg-green-500 text-white rounded-br-none shadow-md"
                  : "bg-gray-200 text-gray-900 rounded-bl-none shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2 shadow w-fit rounded-full px-0.5 mb-1">
                <UserCircle size={16} />
                {msg.sender}
              </div>
              <p className="leading-relaxed">{msg.content}</p>

              {msg.flagged && (
                <p className="text-xs mt-2 opacity-80 font-medium">
                  ⚠️ {msg.flag_type || "Flagged"}
                </p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-2xl text-sm rounded-bl-none flex items-center gap-2 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Monica is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="w-full sticky bottom-10">
        <div className="flex items-center gap-3 bg-green-100 rounded-full px-5 py-3 shadow-lg border border-green-200">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading && message.trim()) {
                sendMessage();
              }
            }}
            disabled={isLoading}
            className="border-none bg-transparent shadow-none focus-visible:ring-0 text-gray-900 placeholder:text-gray-500 disabled:opacity-50"
          />

          <Button
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
            size="icon"
            className="rounded-full bg-green-500 hover:bg-green-600 text-white shrink-0 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
