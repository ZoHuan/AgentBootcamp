export type Message = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  status?: "streaming" | "done";
};
