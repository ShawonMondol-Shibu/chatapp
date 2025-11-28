/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogOut, SendHorizontal, Loader2 } from "lucide-react"
import { chatAPI, type ChatMessage } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function ChatUI() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/signin")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userContent = message
    setMessage("")
    setIsLoading(true)

    try {
      console.log("Sending message:", userContent)

      const response = await chatAPI({
        content: userContent,
      })

      console.log(" Chat response:", response)

      if (response.session?.session_id) {
        setSessionId(response.session.session_id)
      }

      if (response.all_messages && Array.isArray(response.all_messages)) {
        setHistory(response.all_messages)
      }
    } catch (err: any) {
      console.error("Chat error:", err)
      const errorMsg = err.message || "Failed to send message"
      toast.error(errorMsg)

      if (errorMsg.includes("access token")) {
        router.push("/signin")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    localStorage.removeItem("chat_sessions")
    localStorage.removeItem("claim_uploads")
    toast.success("Logged out successfully")
    router.push("/signin")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    )
  }

  return (
    <main className="min-h-screen p-4 sm:p-10 flex flex-col bg-linear-to-br from-green-50 to-white">
      
      {/* Header */}
      <section className="mb-8 w-fit">
        <h1 className="text-3xl sm:text-4xl font-semibold text-green-700">Monica</h1>
        <p className="text-green-600 mt-2 text-sm sm:text-base">Your AI insurance claim assistant</p>
      </section>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="secondary"
        className="sticky w-fit right-4 top-4 sm:right-10 sm:top-10 gap-2 shadow-lg"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2">
        {/* Initial AI greeting */}
        {history.length === 0 && !isLoading && (
          <Card className="w-fit max-w-xs bg-gray-100 shadow-none border-0">
            <CardContent className="p-4">
              <p className="font-semibold text-gray-900">Monica</p>
              <p className="text-sm mt-2 text-gray-700">
                Hi! I'm Monica, your insurance claim assistant. Ask me anything about your claims, policies, or the
                claims process. I'm here to help!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Chat Messages */}
        {history.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "User" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm wrap-break-word ${
                msg.sender === "User"
                  ? "bg-green-500 text-white rounded-br-none shadow-md"
                  : "bg-gray-200 text-gray-900 rounded-bl-none shadow-sm"
              }`}
            >
            <span>{msg.user}</span>
              <p className="leading-relaxed">{msg.content}</p>
              {msg.flagged && <p className="text-xs mt-2 opacity-80 font-medium">⚠️ {msg.flag_type || "Flagged"}</p>}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-2xl text-sm rounded-bl-none flex items-center gap-2 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Monica is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="w-full sticky bottom-10">
        <div className="flex items-center gap-3 bg-green-100 rounded-full px-5 py-3 shadow-lg border border-green-200">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading && message.trim()) {
                sendMessage()
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
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </main>
  )
}
