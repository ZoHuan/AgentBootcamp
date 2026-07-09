"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Message } from "@/lib/types";
import { parseResponse } from "@/lib/parser/parseResponse";

function AnswerCard({ content }: { content: string }) {
  const parsed = parseResponse(content);
  if (!parsed) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-zinc-900">
        {parsed.title}
      </h2>
      <p className="text-sm text-zinc-700">{parsed.summary}</p>
      {parsed.examples.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-zinc-500 mb-1.5">示例</h3>
          <ul className="space-y-1">
            {parsed.examples.map((ex, i) => (
              <li
                key={i}
                className="text-sm bg-white rounded border border-zinc-200 px-3 py-1.5 font-mono text-zinc-700"
              >
                {ex}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function MessageItem({
  message,
  isLoading,
}: {
  message: Message;
  isLoading?: boolean;
}) {
  const isStreaming = message.status === "streaming";
  const isAnswerCard =
    message.role === "assistant" && !isStreaming && parseResponse(message.content);

  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2 ${
          message.role === "user"
            ? "bg-zinc-900 text-white"
            : isAnswerCard
              ? "bg-zinc-100 text-zinc-900"
              : "bg-zinc-100 text-zinc-900 prose prose-sm prose-zinc max-w-none"
        }`}
      >
        {message.role === "user" ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : isAnswerCard ? (
          <AnswerCard content={message.content} />
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {message.content}
          </ReactMarkdown>
        )}
        {isLoading && isStreaming && (
          <span className="inline-block w-2 h-4 bg-zinc-400 animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  );
}
