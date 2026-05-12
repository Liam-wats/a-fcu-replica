import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FileText, ArrowLeft, Download, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import type { Session } from "@/routes/dashboard";
import { ACCOUNT_LABELS } from "@/routes/dashboard";

export const Route = createFileRoute("/dashboard/statements")({
  component: StatementsPage,
});

interface Txn {
  id: number; txn_date: string; description: string;
  category: string; amount: number; txn_type: string;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function groupByMonth(txns: Txn[]) {
  const map: Record<string, Txn[]> = {};
  txns.forEach(t => {
    const key = t.txn_date || "Unknown";
    if (!map[key]) map[key] = [];
    map[key].push(t);
  });
  return Object.entries(map);
}

function StatementsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [transactions, setTransactions] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    const raw = sessionStorage.getItem("apfcu_session");
    if (!raw) return;
    const s: Session = JSON.parse(raw);
    setSession(s);
    if (s.loginId) {
      fetch(`/api/member/${s.loginId}/account`)
        .then(r => r.json())
        .then(d => setTransactions(d.transactions ?? []))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  if (!session) return null;
  const accountLabel = ACCOUNT_LABELS[session.accountType] ?? session.accountType;
  const grouped = groupByMonth(transactions);

  const totalDebits = transactions.filter(t => t.txn_type === "debit").reduce((s, t) => s + t.amount, 0);
  const totalCredits = transactions.filter(t => t.txn_type === "credit").reduce((s, t) => s + t.amount, 0);

  const toggle = (key: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div className="container-x py-8 max-w-3xl">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] text-brand-green hover:underline underline-offset-4 mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
      </Link>

      <div className="bg-white border border-border shadow-sm">
        <div className="h-1 bg-brand-green" />
        <div className="px-8 py-6 border-b border-border flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-brand-green" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-green">Online Banking</span>
            </div>
            <h1 className="font-serif text-2xl text-ink">eStatements</h1>
            <p className="text-[13px] text-ink/50 mt-1">{accountLabel}</p>
          </div>
          <button className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-green border border-brand-green/40 px-4 py-2 hover:bg-brand-green/5 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export All
          </button>
        </div>

        {/* Summary row */}
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border border-b border-border">
          {[
            { label: "Total Transactions", value: transactions.length.toString() },
            { label: "Total Credits",  value: fmt(totalCredits) },
            { label: "Total Debits",   value: fmt(totalDebits) },
          ].map(({ label, value }) => (
            <div key={label} className="px-6 py-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink/35 mb-1">{label}</p>
              <p className="font-serif text-xl text-ink">{value}</p>
            </div>
          ))}
        </div>

        <div className="px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-ink/40 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading transactions…
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-ink/35">
              <FileText className="w-8 h-8 opacity-40" />
              <p className="text-sm">No transactions to show</p>
            </div>
          ) : (
            <div className="space-y-2">
              {grouped.map(([dateKey, txns]) => {
                const open = expanded.has(dateKey);
                const debits = txns.filter(t => t.txn_type === "debit").reduce((s, t) => s + t.amount, 0);
                const credits = txns.filter(t => t.txn_type === "credit").reduce((s, t) => s + t.amount, 0);
                return (
                  <div key={dateKey} className="border border-border">
                    <button
                      onClick={() => toggle(dateKey)}
                      className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="w-4 h-4 text-brand-green shrink-0" />
                        <div>
                          <p className="font-semibold text-ink text-sm">{dateKey}</p>
                          <p className="text-[11px] text-ink/45">{txns.length} transaction{txns.length !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden sm:flex gap-4 text-[13px]">
                          {credits > 0 && <span className="text-emerald-600 font-semibold">+{fmt(credits)}</span>}
                          {debits > 0 && <span className="text-ink font-semibold">−{fmt(debits)}</span>}
                        </div>
                        <button className="p-1 text-ink/40 hover:text-brand-green transition-colors">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        {open ? <ChevronUp className="w-4 h-4 text-ink/40" /> : <ChevronDown className="w-4 h-4 text-ink/40" />}
                      </div>
                    </button>

                    {open && (
                      <div className="border-t border-border divide-y divide-border">
                        {txns.map(tx => (
                          <div key={tx.id} className="flex items-center justify-between px-5 py-3 bg-secondary/20">
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold border shrink-0 ${
                                tx.txn_type === "debit" ? "bg-red-50 border-red-100 text-red-400" : "bg-emerald-50 border-emerald-100 text-emerald-500"
                              }`}>
                                {tx.txn_type === "debit" ? "−" : "+"}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-ink">{tx.description}</p>
                                <p className="text-[11px] text-ink/40">{tx.category}</p>
                              </div>
                            </div>
                            <p className={`text-sm font-bold tabular-nums ${tx.txn_type === "debit" ? "text-ink" : "text-emerald-600"}`}>
                              {tx.txn_type === "debit" ? "−" : "+"}{fmt(Math.abs(tx.amount))}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
