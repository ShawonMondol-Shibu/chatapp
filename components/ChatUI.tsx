"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, LogOut, SendHorizontalIcon } from "lucide-react";
// import { useChat } from "@/hooks/useChat";

export function ChatUI() {
  //   const chat = useChat();
  const [message, setMessage] = useState("");
  //   const [history, setHistory] = useState<
  //     { sender: "user" | "bot"; text: string }[]
  //   >([]);

  //   const sendMessage = async () => {
  //     if (!message.trim()) return;

  //     const userMsg = message;
  //     setHistory((h) => [...h, { sender: "user", text: userMsg }]);
  //     setMessage("");

  //     try {
  //       const res = await chat.mutateAsync(userMsg);
  //       setHistory((h) => [
  //         ...h,
  //         {
  //           sender: "bot",
  //           text: res.flagged
  //             ? `${res.content} ⚠️ [${res.flag_type}]`
  //             : res.content,
  //         },
  //       ]);
  //     } catch (err: any) {
  //       setHistory((h) => [...h, { sender: "bot", text: err.message }]);
  //     }
  //   };

  return (
    <main className="min-h-screen p-10 flex flex-col">
      {/* Header */}
      <section className="mb-20">
        <h1 className="text-4xl font-semibold text-green-700">
          Introducing Monica
        </h1>
        <p className="text-green-600 mt-2">
          “Ask me about lifestyle, wellbeing, or legal support…”
        </p>
      </section>

    <Button variant={'secondary'} className="absolute right-10 top-10 hover:cursor-pointer shadow hover:bg-green-500 hover:text-white">
        <LogOut/>
    </Button>
      {/* Chat Bubbles */}
      <div className="flex-1 relative">
        {/* Static Left Bubble */}
        <Card className="absolute left-0 top-0 w-72 bg-gray-200 shadow-none">
          <CardContent className="p-4">
            <p className="font-medium">ConvergeAI</p>
            <p className="text-sm mt-1 text-gray-600">
              Hi! I am ConvergeAI. Ask me anything — I can draft, summarize,
              brainstorm, and more.
            </p>
          </CardContent>
        </Card>

        {/* Dynamic Chat Messages */}
        {/* <div className="mt-40 space-y-4">
          {history.map((msg, i) => (
            <div
              key={i}
              className={`w-fit px-4 py-2 rounded-xl text-sm ${
                msg.sender === "user" ? "ml-auto bg-green-200" : "bg-gray-200"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div> */}
      </div>

      {/* Input Bar */}
      <div className="w-full mt-auto">
        <div className="flex items-center bg-green-100 rounded-full px-6 py-3 shadow-sm">
          <Input
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border-none bg-transparent shadow-none focus-visible:ring-0"
          />
          <Button
            onClick={() => {
              // sendMessage
            }}
            size="icon"
            className="rounded-full bg-green-500 hover:bg-green-600 ml-3 text-white"
          >
            <SendHorizontalIcon />
          </Button>
        </div>
      </div>
    </main>
  );
}
