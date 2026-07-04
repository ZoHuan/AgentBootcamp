"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/lib/types";
import MessageItem from "./message-item";

export default function MessageList({
  messages,
  loading,
}: {
  messages: Message[];
  loading: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-4">
      {messages.length === 0 && (
        <p className="text-center text-zinc-400 mt-20">
          输入你的第一个问题，开始对话
        </p>
      )}
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} isLoading={loading} />
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="bg-zinc-100 text-zinc-500 rounded-lg px-4 py-2 text-sm animate-pulse">
            AI 正在思考...
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
