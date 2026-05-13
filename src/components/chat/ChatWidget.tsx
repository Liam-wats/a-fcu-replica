import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Session } from "@/routes/dashboard";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_qkfr2cn";
const EMAILJS_TEMPLATE_ID = "template_wvtlxvb";
const EMAILJS_PUBLIC_KEY  = "Q46p2-WKKDd4yU00l";

function sendChatNotification(memberName: string, message: string, type: string) {
  const [firstName, ...rest] = memberName.split(" ");
  const lastName = rest.join(" ") || "";
  emailjs
    .send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        first_name: firstName,
        last_name:  lastName,
        email:      "noreply@apfcu.org",
        reply_to:   "noreply@apfcu.org",
        subject:    `[Live Chat] ${type}`,
        message:    message,
        time: new Date().toLocaleString("en-US", {
          weekday: "long", year: "numeric", month: "long",
          day: "numeric", hour: "2-digit", minute: "2-digit",
          timeZoneName: "short",
        }),
      },
      EMAILJS_PUBLIC_KEY
    )
    .catch((err) => console.error("[ChatWidget] EmailJS error:", err));
}

interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_type: "member" | "admin";
  message: string;
  created_at: string;
}

interface Conversation {
  id: number;
  status: string;
}

export function ChatWidget({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [starting, setStarting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastReadIdRef = useRef<number>(0);
  const openRef = useRef(false);
  openRef.current = open;

  const token = () => sessionStorage.getItem("apfcu_token") || "";

  const fetchConversation = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/conversation", {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setConversation(data.conversation);
      const msgs: ChatMessage[] = data.messages || [];
      setMessages(msgs);
      if (!openRef.current && msgs.length > 0) {
        const newAdmin = msgs.filter(
          (m) => m.sender_type === "admin" && m.id > lastReadIdRef.current
        );
        if (newAdmin.length > 0) setUnread(newAdmin.length);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConversation();
    const id = setInterval(fetchConversation, 4000);
    return () => clearInterval(id);
  }, [fetchConversation]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      if (messages.length > 0) {
        lastReadIdRef.current = Math.max(...messages.map((m) => m.id));
      }
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
    }
  }, [messages, open]);

  const startConversation = async () => {
    if (!input.trim()) return;
    setStarting(true);
    try {
      const res = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({
          message: input.trim(),
          memberName: `${session.firstName} ${session.lastName}`,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setConversation(data.conversation);
        setMessages([data.message]);
        setInput("");
        lastReadIdRef.current = data.message.id;
        sendChatNotification(
          `${session.firstName} ${session.lastName}`,
          input.trim(),
          "New chat conversation started"
        );
      }
    } catch {}
    setStarting(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversation) return;
    setSending(true);
    const text = input.trim();
    setInput("");
    // Notify admin only when member replies after an admin message (avoids spam on rapid follow-ups)
    const lastMsg = messages[messages.length - 1];
    const shouldNotify = !lastMsg || lastMsg.sender_type === "admin";
    try {
      const res = await fetch(`/api/chat/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        lastReadIdRef.current = data.message.id;
        if (shouldNotify) {
          sendChatNotification(
            `${session.firstName} ${session.lastName}`,
            text,
            "Member replied to chat"
          );
        }
      }
    } catch {}
    setSending(false);
  };

  const closeConversation = async () => {
    if (!conversation) return;
    try {
      const res = await fetch(`/api/chat/conversations/${conversation.id}/close`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) setConversation((c) => c ? { ...c, status: "closed" } : c);
    } catch {}
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      conversation ? sendMessage() : startConversation();
    }
  };

  const fmtTime = (ts: string) =>
    new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <>
      {open && (
        <div
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-80 sm:w-[360px] bg-white border border-border shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-200"
          style={{ maxHeight: "70vh" }}
        >
          <div className="bg-brand-green px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <MessageSquare className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-[13px] leading-tight">Support Chat</p>
                <p className="text-white/65 text-[10px]">A+ Federal Credit Union</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 bg-slate-50">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-ink/30">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-ink/15 mx-auto mb-2" />
                <p className="text-[13px] font-semibold text-ink/60">Start a conversation</p>
                <p className="text-[12px] text-ink/35 mt-1 leading-relaxed">
                  Our support team typically replies within minutes.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex", msg.sender_type === "member" ? "justify-end" : "justify-start")}
                >
                  {msg.sender_type === "admin" && (
                    <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-1 mr-2">
                      A+
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[78%] px-3 py-2 text-[13px] leading-relaxed shadow-sm",
                      msg.sender_type === "member"
                        ? "bg-brand-green text-white rounded-t-xl rounded-bl-xl"
                        : "bg-white text-ink border border-border rounded-t-xl rounded-br-xl"
                    )}
                  >
                    <p>{msg.message}</p>
                    <p
                      className={cn(
                        "text-[10px] mt-1 text-right",
                        msg.sender_type === "member" ? "text-white/55" : "text-ink/35"
                      )}
                    >
                      {fmtTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
            {conversation?.status === "closed" ? (
              <p className="text-center text-[11px] text-ink/35 pt-2 pb-1">
                This conversation is closed. Start typing to open a new one.
              </p>
            ) : conversation && messages.length > 0 && (
              <div className="flex justify-center pt-1">
                <button
                  onClick={closeConversation}
                  className="text-[11px] text-ink/35 hover:text-red-400 transition-colors underline underline-offset-2"
                >
                  Mark as resolved
                </button>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {(!conversation || conversation.status === "open") && (
            <div className="border-t border-border p-3 bg-white shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  placeholder="Type a message…"
                  className="flex-1 text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-brand-green resize-none text-ink placeholder:text-ink/35"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  style={{ maxHeight: "80px" }}
                />
                <button
                  onClick={() => (conversation ? sendMessage() : startConversation())}
                  disabled={!input.trim() || sending || starting}
                  className="w-9 h-9 bg-brand-green hover:bg-brand-green-dark disabled:opacity-40 text-white rounded-lg flex items-center justify-center shrink-0 transition-colors"
                >
                  {sending || starting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 w-13 h-13 bg-brand-green hover:bg-brand-green-dark text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{ width: 52, height: 52 }}
        aria-label="Open support chat"
      >
        {open ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-150">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
