import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare, Send, Loader2, CheckCircle2,
  Clock, RefreshCw, User, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAdminToken } from "@/routes/admin";

export const Route = createFileRoute("/admin/chat")({
  component: AdminChatPage,
});

interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_type: "member" | "admin";
  message: string;
  created_at: string;
}

interface Conversation {
  id: number;
  login_id: string;
  member_name: string;
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  last_message: string | null;
  last_sender: "member" | "admin" | null;
  last_message_at: string | null;
}

function authHdr() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getAdminToken()}` };
}

function relativeTime(ts: string | null) {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fullTime(ts: string) {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("open");
  const bottomRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef<number | null>(null);
  selectedIdRef.current = selected?.id ?? null;

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chat/conversations", { headers: authHdr() });
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch {}
    setLoading(false);
  }, []);

  const fetchMessages = useCallback(async (convId: number) => {
    try {
      const res = await fetch(`/api/admin/chat/conversations/${convId}/messages`, { headers: authHdr() });
      const data = await res.json();
      if (selectedIdRef.current === convId) {
        setMessages(data.messages || []);
      }
    } catch {}
    setMsgLoading(false);
  }, []);

  useEffect(() => {
    fetchConversations();
    const id = setInterval(fetchConversations, 6000);
    return () => clearInterval(id);
  }, [fetchConversations]);

  useEffect(() => {
    if (!selected) return;
    setMsgLoading(true);
    fetchMessages(selected.id);
    const id = setInterval(() => fetchMessages(selected.id), 3000);
    return () => clearInterval(id);
  }, [selected?.id, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectConversation = (conv: Conversation) => {
    if (selected?.id === conv.id) return;
    setSelected(conv);
    setMessages([]);
    setInput("");
  };

  const sendReply = async () => {
    if (!input.trim() || !selected) return;
    setSending(true);
    const text = input.trim();
    setInput("");
    try {
      const res = await fetch(`/api/admin/chat/conversations/${selected.id}/messages`, {
        method: "POST",
        headers: authHdr(),
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        fetchConversations();
      }
    } catch {}
    setSending(false);
  };

  const updateStatus = async (convId: number, status: "open" | "closed") => {
    try {
      await fetch(`/api/admin/chat/conversations/${convId}/status`, {
        method: "PUT",
        headers: authHdr(),
        body: JSON.stringify({ status }),
      });
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, status } : c))
      );
      if (selected?.id === convId) {
        setSelected((prev) => (prev ? { ...prev, status } : null));
      }
    } catch {}
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  const unreadCount = conversations.filter(
    (c) => c.status === "open" && c.last_sender === "member"
  ).length;

  const filtered = conversations.filter((c) =>
    filter === "all" ? true : c.status === filter
  );

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Left panel: conversation list ── */}
      <div className="w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-4 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-semibold text-slate-900 text-[15px]">Live Chat</h1>
              <p className="text-[11px] text-slate-400">
                {unreadCount > 0 ? (
                  <span className="text-brand-green font-semibold">{unreadCount} awaiting reply</span>
                ) : (
                  `${conversations.length} total`
                )}
              </p>
            </div>
            <button
              onClick={fetchConversations}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            </button>
          </div>
          <div className="flex gap-0.5 bg-slate-100 rounded p-0.5">
            {(["open", "closed", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex-1 py-1 text-[11px] font-semibold rounded transition-all capitalize",
                  filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <MessageSquare className="w-8 h-8 opacity-20" />
              <p className="text-sm">No conversations</p>
            </div>
          ) : (
            filtered.map((conv) => {
              const isUnread = conv.status === "open" && conv.last_sender === "member";
              const isSelected = selected?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={cn(
                    "w-full text-left px-4 py-3.5 transition-colors",
                    isSelected
                      ? "bg-brand-green/8 border-l-2 border-l-brand-green"
                      : "hover:bg-slate-50 border-l-2 border-l-transparent"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-600 text-[12px] font-bold">
                      {conv.member_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className={cn(
                          "text-[13px] truncate",
                          isUnread ? "font-bold text-slate-900" : "font-semibold text-slate-700"
                        )}>
                          {conv.member_name}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {relativeTime(conv.last_message_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[12px] text-slate-400 truncate">
                          {conv.last_message
                            ? `${conv.last_sender === "admin" ? "You: " : ""}${conv.last_message}`
                            : "No messages yet"}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          {isUnread && (
                            <span className="w-2 h-2 bg-brand-green rounded-full" />
                          )}
                          {conv.status === "closed" && (
                            <span className="text-[9px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full font-semibold">
                              CLOSED
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right panel: active conversation ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
            <MessageSquare className="w-12 h-12 opacity-15" />
            <p className="text-sm font-semibold">Select a conversation to view</p>
            {unreadCount > 0 && (
              <p className="text-[12px] text-brand-green font-semibold">
                {unreadCount} conversation{unreadCount > 1 ? "s" : ""} waiting for a reply
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Conversation header */}
            <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                  {selected.member_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-[14px] leading-tight">
                    {selected.member_name}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">{selected.login_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border",
                    selected.status === "open"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  )}
                >
                  {selected.status === "open" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {selected.status === "open" ? "Open" : "Closed"}
                </span>
                <button
                  onClick={() =>
                    updateStatus(selected.id, selected.status === "open" ? "closed" : "open")
                  }
                  className="text-[12px] font-medium text-slate-500 hover:text-slate-900 px-2.5 py-1 border border-slate-200 rounded hover:border-slate-300 transition-all"
                >
                  {selected.status === "open" ? "Close" : "Reopen"}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {msgLoading && messages.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">No messages yet</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end gap-2",
                      msg.sender_type === "admin" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.sender_type === "member" && (
                      <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 text-[11px] font-bold shrink-0">
                        {selected.member_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[65%] px-4 py-2.5 text-[13px] leading-relaxed shadow-sm",
                        msg.sender_type === "admin"
                          ? "bg-brand-green text-white rounded-t-xl rounded-bl-xl"
                          : "bg-white text-slate-800 border border-slate-200 rounded-t-xl rounded-br-xl"
                      )}
                    >
                      <p>{msg.message}</p>
                      <p
                        className={cn(
                          "text-[10px] mt-1.5",
                          msg.sender_type === "admin"
                            ? "text-white/55 text-right"
                            : "text-slate-400"
                        )}
                      >
                        {msg.sender_type === "admin" ? "Support · " : ""}
                        {fullTime(msg.created_at)}
                      </p>
                    </div>
                    {msg.sender_type === "admin" && (
                      <div className="w-7 h-7 rounded-full bg-brand-green flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                        A+
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Reply box */}
            <div className="bg-white border-t border-slate-200 px-6 py-4 shrink-0">
              {selected.status === "closed" ? (
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-slate-400">This conversation is closed.</p>
                  <button
                    onClick={() => updateStatus(selected.id, "open")}
                    className="text-[12px] font-semibold text-brand-green hover:underline underline-offset-2"
                  >
                    Reopen to reply
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-3">
                  <textarea
                    rows={1}
                    placeholder="Type a reply… (Enter to send)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 resize-none text-slate-800 placeholder:text-slate-400"
                    style={{ maxHeight: "100px" }}
                  />
                  <button
                    onClick={sendReply}
                    disabled={!input.trim() || sending}
                    className="h-10 w-10 bg-brand-green hover:bg-brand-green-dark disabled:opacity-40 text-white rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
