"use client";

import { useState, useEffect, startTransition } from "react";
import { Message } from "@/lib/types";
import MessageList from "./message-list";
import ChatInput from "./chat-input";

const STORAGE_KEY = "ai-chat-messages";

function loadMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Message[];
    return parsed.map((m) => (m.id ? m : { ...m, id: crypto.randomUUID() }));
  } catch {
    return [];
  }
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = loadMessages();
    if (saved.length > 0) startTransition(() => setMessages(saved));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setInput("");
    setLoading(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      status: "done",
    };

    const withUser = [...messages, userMessage];
    setMessages(withUser);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: withUser }),
      });

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `出错了: ${res.status}`,
            status: "done",
          },
        ]);
        return;
      }

      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          status: "streaming",
        },
      ]);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant" && last.status === "streaming") {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + chunk,
            };
          }
          return updated;
        });
      }

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant" && last.status === "streaming") {
          updated[updated.length - 1] = { ...last, status: "done" };
        }
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto px-4">
      <div className="flex items-center justify-between py-3 border-b border-zinc-200">
        <h1 className="text-sm font-medium text-zinc-500">Mini ChatGPT</h1>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            清空记录
          </button>
        )}
      </div>

      <MessageList messages={messages} loading={loading} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={loading}
      />
    </div>
  );
}
