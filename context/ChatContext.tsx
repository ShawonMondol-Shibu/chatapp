/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { chatAPI, type ChatMessage } from "@/lib/api";
import { toast } from "sonner";

interface ChatContextType {
  message: string;
  setMessage: (v: string) => void;

  history: ChatMessage[];
  sessionId: string | null;

  isLoading: boolean;

  sendMessage: () => Promise<void>;
  resetChat: () => void;
}

const defaultContext: ChatContextType = {
  message: "",
  setMessage: () => {},

  history: [],
  sessionId: null,

  isLoading: false,

  sendMessage: async () => {},
  resetChat: () => {},
};

const ChatContext = createContext<ChatContextType>(defaultContext);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chat_sessions");
    if (saved) {
      const data = JSON.parse(saved);
      setHistory(data.history || []);
      setSessionId(data.sessionId || null);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      "chat_sessions",
      JSON.stringify({ history, sessionId })
    );
  }, [history, sessionId]);

  const sendMessage = async () => {
    const content = message.trim();
    if (!content || isLoading) return;

    setMessage("");
    setIsLoading(true);
    console.log(message)

    try {
      const response = await chatAPI({ content });

      if (response.session?.session_id) {
        setSessionId(response.session.session_id);
      }

      if (response.all_messages && Array.isArray(response.all_messages)) {
        setHistory(response.all_messages);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setHistory([]);
    setSessionId(null);
    localStorage.removeItem("chat_sessions");
  };

  return (
    <ChatContext.Provider
      value={{
        message,
        setMessage,
        history,
        sessionId,
        isLoading,
        sendMessage,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => {
    return useContext(ChatContext)
}
