import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CreditCard, ArrowLeft, CheckCircle2, Loader2, AlertCircle, Plus, Trash2 } from "lucide-react";
import type { Session } from "@/routes/dashboard";
import { ACCOUNT_LABELS } from "@/routes/dashboard";

export const Route = createFileRoute("/dashboard/bills")({
  component: BillsPage,
});

interface Biller { id: string; name: string; account: string; }

const DEFAULT_BILLERS: Biller[] = [
  { id: "1", name: "AT&T Wireless", account: "•••• 8821" },
  { id: "2", name: "City of Austin – Electric", account: "•••• 0044" },
  { id: "3", name: "Spectrum Internet", account: "•••• 2209" },
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function BillsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [balance, setBalance] = useState<{ available: number; current: number } | null>(null);
  const [billers, setBillers] = useState<Biller[]>(DEFAULT_BILLERS);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState<string | null>(null);
  const [paid, setPaid] = useState<Set<string>>(new Set());
  const [error, setError] = useState<Record<string, string>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAccount, setNewAccount] = useState("");
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  useEffect(() => {
    const raw = sessionStorage.getItem("apfcu_session");
    if (!raw) return;
    const s: Session = JSON.parse(raw);
    setSession(s);
    if (s.loginId) {
      fetch(`/api/member/${s.loginId}/account`)
        .then(r => r.json())
        .then(d => setBalance(d.balance));
    }
  }, []);

  const payBill = async (biller: Biller) => {
    setError(prev => ({ ...prev, [biller.id]: "" }));
    const num = parseFloat(amounts[biller.id] || "");
    if (!num || num <= 0) return setError(prev => ({ ...prev, [biller.id]: "Enter a valid amount." }));
    if (balance && num > balance.available) return setError(prev => ({ ...prev, [biller.id]: `Exceeds available balance (${fmt(balance.available)}).` }));
    if (!session?.loginId) return;

    setPaying(biller.id);
    try {
      const newAvail = (balance?.available ?? 0) - num;
      const newCurrent = (balance?.current ?? 0) - num;
      await fetch(`/api/member/${session.loginId}/balance`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: newAvail, current: newCurrent }),
      });
      await fetch(`/api/member/${session.loginId}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txn_date: today,
          description: biller.name,
          category: "Bills",
          amount: num,
          txn_type: "debit",
        }),
      });
      setBalance({ available: newAvail, current: newCurrent });
      setPaid(prev => new Set([...prev, biller.id]));
      setAmounts(prev => ({ ...prev, [biller.id]: "" }));
    } catch {
      setError(prev => ({ ...prev, [biller.id]: "Payment failed. Try again." }));
    } finally {
      setPaying(null);
    }
  };

  const addBiller = () => {
    if (!newName.trim()) return;
    setBillers(prev => [...prev, {
      id: Date.now().toString(),
      name: newName.trim(),
      account: newAccount.trim() || "•••• ----",
    }]);
    setNewName("");
    setNewAccount("");
    setShowAdd(false);
  };

  if (!session) return null;
  const accountLabel = ACCOUNT_LABELS[session.accountType] ?? session.accountType;

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
              <CreditCard className="w-4 h-4 text-brand-green" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-green">Online Banking</span>
            </div>
            <h1 className="font-serif text-2xl text-ink">Pay Bills</h1>
            <p className="text-[13px] text-ink/50 mt-1">
              {accountLabel} · {balance ? `Available: ${fmt(balance.available)}` : "Loading…"}
            </p>
          </div>
          <button
            onClick={() => setShowAdd(v => !v)}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-green border border-brand-green/40 px-4 py-2 hover:bg-brand-green/5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Biller
          </button>
        </div>

        {showAdd && (
          <div className="px-8 py-5 border-b border-border bg-secondary/30">
            <p className="text-[13px] font-semibold text-ink mb-3">New Biller</p>
            <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3">
              <input
                placeholder="Biller name"
                className="border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-green transition-all"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
              <input
                placeholder="Account # (optional)"
                className="border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-green transition-all"
                value={newAccount}
                onChange={e => setNewAccount(e.target.value)}
              />
              <button
                onClick={addBiller}
                className="bg-brand-green text-white px-4 py-2.5 text-sm font-semibold hover:bg-brand-green-dark transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-border">
          {billers.map(biller => (
            <div key={biller.id} className="px-8 py-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-ink text-sm">{biller.name}</p>
                  <p className="text-[12px] text-ink/45 mt-0.5">Account {biller.account}</p>
                  {paid.has(biller.id) && (
                    <p className="text-[12px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Payment sent
                    </p>
                  )}
                  {error[biller.id] && (
                    <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {error[biller.id]}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      className="w-28 border border-border bg-white pl-7 pr-3 py-2 text-sm outline-none focus:border-brand-green transition-all"
                      value={amounts[biller.id] ?? ""}
                      onChange={e => setAmounts(prev => ({ ...prev, [biller.id]: e.target.value }))}
                      disabled={paid.has(biller.id)}
                    />
                  </div>
                  <button
                    onClick={() => payBill(biller)}
                    disabled={paying === biller.id || paid.has(biller.id)}
                    className="bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 text-white px-4 py-2 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
                  >
                    {paying === biller.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    {paid.has(biller.id) ? "Paid" : "Pay"}
                  </button>
                  <button
                    onClick={() => setBillers(prev => prev.filter(b => b.id !== biller.id))}
                    className="p-2 text-ink/30 hover:text-red-400 transition-colors"
                    title="Remove biller"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
