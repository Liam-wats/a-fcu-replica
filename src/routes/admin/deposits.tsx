import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  Smartphone, Loader2, RefreshCw, Search, X,
  CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp,
  Users, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAdminToken } from "@/routes/admin";

export const Route = createFileRoute("/admin/deposits")({
  component: AdminDepositsPage,
});

function getToken() {
  return getAdminToken();
}

function fmt(n: number) {
  return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

interface Deposit {
  id: number;
  login_id: string;
  amount: number;
  status: "submitted" | "approved" | "rejected";
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

type StatusFilter = "all" | "submitted" | "approved" | "rejected";

const STATUS_CONFIG = {
  submitted: { label: "Submitted", icon: Clock,        chip: "bg-amber-50 text-amber-700 border-amber-200" },
  approved:  { label: "Approved",  icon: CheckCircle2, chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected:  { label: "Rejected",  icon: XCircle,      chip: "bg-red-50 text-red-700 border-red-200" },
};

function StatusChip({ status }: { status: Deposit["status"] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.submitted;
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 border rounded-full", cfg.chip)}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
}

function ImageModal({ src, label, onClose }: { src: string; label: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative bg-white rounded shadow-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-800">{label}</span>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="p-4 bg-slate-50">
          <img src={src} alt={label} className="max-h-[70vh] w-full object-contain rounded" />
        </div>
      </div>
    </div>
  );
}

function DepositRow({
  deposit,
  onStatusChange,
}: {
  deposit: Deposit;
  onStatusChange: (id: number, status: Deposit["status"]) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<{ src: string; label: string } | null>(null);

  const imageUrl = (side: "front" | "back") =>
    `/api/admin/deposits/${deposit.id}/image/${side}?token=${encodeURIComponent(getToken())}`;

  const date = new Date(deposit.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  const time = new Date(deposit.created_at).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });

  const memberName = deposit.first_name
    ? `${deposit.first_name} ${deposit.last_name}`
    : deposit.login_id;

  const updateStatus = async (status: Deposit["status"]) => {
    if (saving || deposit.status === status) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/deposits/${deposit.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) onStatusChange(deposit.id, status);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {modal && <ImageModal src={modal.src} label={modal.label} onClose={() => setModal(null)} />}

      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        {/* Summary row */}
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors text-left gap-4 group"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-9 h-9 bg-brand-green/10 border border-brand-green/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-brand-green" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{memberName}</p>
              <p className="text-[11px] text-slate-400 truncate">
                {deposit.login_id} · {date} at {time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-base font-bold text-emerald-600">{fmt(deposit.amount)}</p>
              <StatusChip status={deposit.status} />
            </div>
            {expanded
              ? <ChevronUp className="w-4 h-4 text-slate-300" />
              : <ChevronDown className="w-4 h-4 text-slate-300" />}
          </div>
        </button>

        {/* Expanded detail */}
        {expanded && (
          <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-5 space-y-5">

            {/* Member info */}
            {deposit.email && (
              <div className="text-[12px] text-slate-500">
                <span className="font-semibold text-slate-700">{memberName}</span>
                {" · "}{deposit.email}
              </div>
            )}

            {/* Status controls */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {(["approved", "submitted", "rejected"] as const).map(s => {
                  const cfg = STATUS_CONFIG[s];
                  const active = deposit.status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={saving}
                      onClick={() => updateStatus(s)}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border rounded-full transition-all disabled:opacity-60",
                        active
                          ? cn(cfg.chip, "ring-2 ring-offset-1", s === "approved" ? "ring-emerald-400" : s === "rejected" ? "ring-red-400" : "ring-amber-400")
                          : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                      )}
                    >
                      {saving && deposit.status !== s ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : active ? (
                        <Check className="w-3 h-3" />
                      ) : null}
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Check images */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Check Images</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {(["front", "back"] as const).map(side => (
                  <div key={side} className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-slate-500 capitalize">{side} of Check</span>
                    <button
                      type="button"
                      onClick={() => setModal({ src: imageUrl(side), label: `${side === "front" ? "Front" : "Back"} of Check — ${memberName}` })}
                      className="group relative border border-slate-200 rounded overflow-hidden bg-white hover:border-brand-green transition-colors"
                    >
                      <img
                        src={imageUrl(side)}
                        alt={`${side} of check`}
                        className="w-full h-32 object-contain p-2"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-white text-slate-800 text-[11px] font-semibold px-2 py-1 rounded shadow transition-opacity">
                          View full size
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/deposits", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load.");
      setDeposits(data.deposits ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (id: number, status: Deposit["status"]) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const counts = deposits.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filtered = deposits.filter(d => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const name = `${d.first_name ?? ""} ${d.last_name ?? ""}`.toLowerCase();
    return name.includes(q) || d.login_id?.toLowerCase().includes(q) || d.email?.toLowerCase().includes(q);
  });

  const totalAmount = filtered.reduce((s, d) => s + Number(d.amount), 0);

  return (
    <div className="flex flex-col h-full">

      {/* Top bar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div>
          <h1 className="font-semibold text-slate-900 text-[15px]">Check Deposits</h1>
          <p className="text-[11px] text-slate-400">{deposits.length} total · {fmt(deposits.reduce((s, d) => s + Number(d.amount), 0))} submitted</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 px-3 py-1.5 border border-slate-200 rounded hover:border-slate-300 transition-all shrink-0"
        >
          <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 border-b border-slate-200 shrink-0">
        {[
          { label: "Total",    value: deposits.length,         icon: Users,        color: "text-slate-700" },
          { label: "Pending",  value: counts.submitted ?? 0,   icon: Clock,        color: "text-amber-600" },
          { label: "Approved", value: counts.approved ?? 0,    icon: CheckCircle2, color: "text-emerald-600" },
          { label: "Rejected", value: counts.rejected ?? 0,    icon: XCircle,      color: "text-red-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
            <Icon className={cn("w-5 h-5 shrink-0", color)} />
            <div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-none">{value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="px-4 sm:px-6 py-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search member name, login ID, email…"
            className="w-full pl-8 pr-8 py-2 text-sm border border-slate-200 rounded outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 transition-all placeholder:text-slate-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded p-0.5 overflow-x-auto">
          {(["all", "submitted", "approved", "rejected"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded transition-all capitalize whitespace-nowrap shrink-0",
                statusFilter === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s].label}
              {s !== "all" && <span className="ml-1.5 text-[10px] text-slate-400">{counts[s] ?? 0}</span>}
            </button>
          ))}
        </div>

        {filtered.length > 0 && (
          <p className="text-[12px] text-slate-500 shrink-0 ml-auto">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} · <span className="font-semibold text-slate-700">{fmt(totalAmount)}</span>
          </p>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 py-5">
        {loading ? (
          <div className="flex items-center justify-center h-64 gap-2 text-sm text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-sm text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-slate-400">
            <Smartphone className="w-8 h-8 opacity-30" />
            <p className="text-sm">{deposits.length === 0 ? "No deposits submitted yet" : "No deposits match your filters"}</p>
          </div>
        ) : (
          <div className="space-y-2 max-w-3xl">
            {filtered.map(d => (
              <DepositRow key={d.id} deposit={d} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
