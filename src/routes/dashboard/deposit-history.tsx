import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Smartphone, Loader2, FileText,
  CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp, X,
} from "lucide-react";
import type { Session } from "@/routes/dashboard";

export const Route = createFileRoute("/dashboard/deposit-history")({
  component: DepositHistoryPage,
});

function getToken() {
  return sessionStorage.getItem("apfcu_token") || "";
}

function fmt(n: number) {
  return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

interface Deposit {
  id: number;
  amount: number;
  status: string;
  created_at: string;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle2 className="w-3 h-3" /> Approved
    </span>
  );
  if (status === "rejected") return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
      <XCircle className="w-3 h-3" /> Rejected
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
      <Clock className="w-3 h-3" /> Submitted
    </span>
  );
}

function ImageModal({ src, label, onClose }: { src: string; label: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded shadow-2xl max-w-2xl w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold text-ink">{label}</span>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded transition-colors">
            <X className="w-4 h-4 text-ink/50" />
          </button>
        </div>
        <div className="p-4 bg-secondary/30">
          <img src={src} alt={label} className="max-h-[70vh] w-full object-contain rounded" />
        </div>
      </div>
    </div>
  );
}

function DepositRow({ deposit, loginId }: { deposit: Deposit; loginId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [modal, setModal] = useState<{ src: string; label: string } | null>(null);

  const imageUrl = (side: "front" | "back") =>
    `/api/member/${loginId}/deposits/${deposit.id}/image/${side}?token=${encodeURIComponent(getToken())}`;

  const date = new Date(deposit.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  const time = new Date(deposit.created_at).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <>
      {modal && (
        <ImageModal src={modal.src} label={modal.label} onClose={() => setModal(null)} />
      )}

      <div className="bg-white border border-border shadow-sm overflow-hidden">
        {/* Summary row */}
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors text-left gap-4"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-9 h-9 bg-brand-green/10 border border-brand-green/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-brand-green" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">Mobile Check Deposit</p>
              <p className="text-[11px] text-ink/45">{date} at {time}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="text-base font-bold text-emerald-600">{fmt(deposit.amount)}</p>
              <StatusBadge status={deposit.status} />
            </div>
            {expanded
              ? <ChevronUp className="w-4 h-4 text-ink/30" />
              : <ChevronDown className="w-4 h-4 text-ink/30" />}
          </div>
        </button>

        {/* Expanded check images */}
        {expanded && (
          <div className="border-t border-border bg-secondary/20 px-5 py-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink/35 mb-3">Check Images</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {(["front", "back"] as const).map(side => (
                <div key={side} className="flex flex-col gap-2">
                  <span className="text-[12px] font-semibold text-ink/60 capitalize">{side} of Check</span>
                  <button
                    type="button"
                    onClick={() => setModal({ src: imageUrl(side), label: `${side === "front" ? "Front" : "Back"} of Check` })}
                    className="group relative border border-border rounded overflow-hidden bg-white hover:border-brand-green transition-colors"
                  >
                    <img
                      src={imageUrl(side)}
                      alt={`${side} of check`}
                      className="w-full h-32 object-contain p-2"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white text-ink text-[11px] font-semibold px-2 py-1 rounded shadow transition-opacity">
                        View full size
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function DepositHistoryPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("apfcu_session");
    if (!raw) return;
    const s: Session = JSON.parse(raw);
    setSession(s);

    if (!s.loginId) { setLoading(false); return; }

    fetch(`/api/member/${s.loginId}/deposits`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setDeposits(d.deposits ?? []);
      })
      .catch(err => setError(err.message || "Failed to load deposit history."))
      .finally(() => setLoading(false));
  }, []);

  if (!session) return null;

  return (
    <div className="container-x py-8 max-w-2xl">
      <Link
        to="/dashboard/deposit"
        className="inline-flex items-center gap-1.5 text-[13px] text-brand-green hover:underline underline-offset-4 mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Mobile Deposit
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Smartphone className="w-4 h-4 text-brand-green" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-green">Online Banking</span>
        </div>
        <h1 className="font-serif text-2xl text-ink">Deposit History</h1>
        <p className="text-[13px] text-ink/50 mt-1">
          Your last {deposits.length > 0 ? deposits.length : ""} mobile check deposits. Click any entry to view check images.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-sm text-ink/40">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading deposit history…
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded">
          {error}
        </div>
      ) : deposits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-ink/35 bg-white border border-border shadow-sm">
          <FileText className="w-10 h-10 opacity-30" />
          <p className="text-sm font-semibold">No deposits yet</p>
          <p className="text-[13px]">Deposits you submit will appear here.</p>
          <Link
            to="/dashboard/deposit"
            className="mt-2 text-[13px] font-semibold text-brand-green hover:underline underline-offset-4"
          >
            Make your first deposit →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {deposits.map(d => (
            <DepositRow key={d.id} deposit={d} loginId={session.loginId} />
          ))}
        </div>
      )}
    </div>
  );
}
