"use client";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-zinc-200 py-4">
      <div className="flex gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你的问题... (Shift+Enter 换行)"
          disabled={disabled}
          rows={1}
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:opacity-50"
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="rounded-lg bg-zinc-900 text-white px-6 py-2 hover:bg-zinc-700 disabled:opacity-50 transition-colors self-end"
        >
          发送
        </button>
      </div>
    </div>
  );
}
