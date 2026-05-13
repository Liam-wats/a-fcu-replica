import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeftRight, CheckCircle2, ArrowLeft, Loader2, AlertCircle, Info } from "lucide-react";
import type { Session } from "@/routes/dashboard";
import { ACCOUNT_LABELS } from "@/routes/dashboard";

export const Route = createFileRoute("/dashboard/transfer")({
  component: TransferPage,
});

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function getToken() {
  return sessionStorage.getItem("apfcu_token") || "";
}

function TransferPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [balance, setBalance] = useState<{ available: number; current: number } | null>(null);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  useEffect(() => {
    const raw = sessionStorage.getItem("apfcu_session");
    if (!raw) return;
    const s: Session = JSON.parse(raw);
    setSession(s);
    if (s.loginId) {
      fetch(`/api/member/${s.loginId}/account`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
        .then(r => r.json())
        .then(d => setBalance(d.balance))
        .catch(() => {})
        .finally(() => setFetching(false));
    } else {
      setFetching(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const num = parseFloat(amount);
    if (!num || num <= 0) return setError("Please enter a valid amount.");
    if (balance && num > balance.available)
      return setError(`Amount exceeds your available balance of ${fmt(balance.available)}.`);
    if (!session?.loginId) return setError("Session expired. Please log in again.");

    setLoading(true);
    try {
      const newAvail = (balance?.available ?? 0) - num;
      const newCurrent = (balance?.current ?? 0) - num;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      };

      await fetch(`/api/member/${session.loginId}/balance`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ available: newAvail, current: newCurrent }),
      });

      await fetch(`/api/member/${session.loginId}/transactions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          txn_date: today,
          description: memo.trim() || "Transfer Out",
          category: "Transfer",
          amount: num,
          txn_type: "debit",
        }),
      });

      setBalance({ available: newAvail, current: newCurrent });
      setSuccess(true);
      setAmount("");
      setMemo("");
    } catch {
      setError("Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;
  const accountLabel = ACCOUNT_LABELS[session.accountType] ?? session.accountType;
  const parsedAmount = parseFloat(amount) || 0;
  const afterBalance = balance ? balance.available - parsedAmount : null;

  return (
    <div className="container-x py-8 max-w-2xl">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-[13px] text-brand-green hover:underline underline-offset-4 mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
      </Link>

      <div className="bg-white border border-border shadow-sm">
        <div className="h-1 bg-brand-green" />

        <div className="px-8 py-6 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <ArrowLeftRight className="w-4 h-4 text-brand-green" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-green">Online Banking</span>
          </div>
          <h1 className="font-serif text-2xl text-ink">Transfer Funds</h1>
          <p className="text-[13px] text-ink/50 mt-1">Withdraw or move money from your account.</p>
        </div>

        {/* Balance summary bar */}
        <div className="px-8 py-4 bg-secondary/40 border-b border-border flex flex-wrap gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/35 mb-0.5">Available Balance</p>
            {fetching ? (
              <div className="flex items-center gap-1.5 text-ink/40 text-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…
              </div>
            ) : (
              <p className="font-serif text-xl font-semibold text-ink">{fmt(balance?.available ?? 0)}</p>
            )}
          </div>
          {parsedAmount > 0 && balance && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink/35 mb-0.5">After Transfer</p>
              <p className={`font-serif text-xl font-semibold ${afterBalance! < 0 ? "text-red-500" : "text-brand-green"}`}>
                {fmt(afterBalance!)}
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-6">
          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 px-4 py-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-800 text-sm">Withdrawal Successful</p>
                <p className="text-[13px] text-emerald-700 mt-0.5">
                  {fmt(parseFloat(amount) || 0)} has been processed. Your updated balance is{" "}
                  <strong>{fmt(balance?.available ?? 0)}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* From / To */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="border border-brand-green/30 bg-brand-green/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1.5">From</p>
              <p className="font-semibold text-ink text-sm">{accountLabel}</p>
              <p className="text-[12px] text-ink/50 mt-0.5">
                {fetching ? "Loading…" : `Available: ${fmt(balance?.available ?? 0)}`}
              </p>
            </div>
            <div className="border border-border bg-secondary/40 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1.5">To</p>
              <p className="font-semibold text-ink text-sm">External Account</p>
              <p className="text-[12px] text-ink/50 mt-0.5">Linked Bank · ••••  6629</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border-l-4 border-red-500 text-red-700 text-[13px] px-4 py-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-ink mb-1.5">
                Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/50 font-semibold text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="w-full border border-border bg-white pl-8 pr-4 py-3 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              {balance && parsedAmount > 0 && parsedAmount > balance.available && (
                <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Exceeds available balance of {fmt(balance.available)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-ink mb-1.5">
                Memo <span className="font-normal text-ink/40">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rent payment"
                maxLength={80}
                className="w-full border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                value={memo}
                onChange={e => setMemo(e.target.value)}
              />
            </div>

            <div className="border border-border bg-secondary/30 px-4 py-3 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-ink/35 mt-0.5 shrink-0" />
              <p className="text-[12px] text-ink/55 leading-relaxed">
                Transfer date: <span className="font-semibold text-ink">{today}</span> ·
                Withdrawals are processed immediately and your balance will update at once.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || fetching || !amount || parsedAmount <= 0 || (!!balance && parsedAmount > balance.available)}
              className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              ) : (
                <><ArrowLeftRight className="w-4 h-4" /> Confirm Withdrawal</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
