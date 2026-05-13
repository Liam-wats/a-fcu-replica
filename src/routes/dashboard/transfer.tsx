import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeftRight, ArrowLeft, Loader2, AlertCircle, Info,
  Building2, X, ChevronRight, ShieldCheck, XCircle, Plus,
  Pencil, Trash2, CheckCircle2,
} from "lucide-react";
import type { Session } from "@/routes/dashboard";
import { ACCOUNT_LABELS } from "@/routes/dashboard";
import { generateAccountNumber } from "@/lib/utils";
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

interface LinkedAccount {
  id: number;
  bank_name: string;
  account_number: string;
  routing_number: string;
  account_type: string;
  nickname: string | null;
}

interface LinkForm {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  nickname: string;
}

type Step = "form" | "failed";

const BLANK_FORM: LinkForm = {
  bankName: "", accountNumber: "", routingNumber: "",
  accountType: "Checking", nickname: "",
};

function TransferPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [balance, setBalance] = useState<{ available: number; current: number } | null>(null);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [sending, setSending] = useState(false);
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const [linked, setLinked] = useState<LinkedAccount | null>(null);
  const [linkedLoading, setLinkedLoading] = useState(true);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkForm, setLinkForm] = useState<LinkForm>(BLANK_FORM);
  const [linkError, setLinkError] = useState("");
  const [linkSaving, setLinkSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("apfcu_session");
    if (!raw) return;
    const s: Session = JSON.parse(raw);
    setSession(s);
    const headers = { Authorization: `Bearer ${getToken()}` };
    Promise.all([
      fetch(`/api/member/${s.loginId}/account`, { headers })
        .then(r => r.json()).then(d => setBalance(d.balance)).catch(() => {}),
      fetch(`/api/member/${s.loginId}/linked-account`, { headers })
        .then(r => r.json()).then(d => setLinked(d.account)).catch(() => {}),
    ]).finally(() => { setFetching(false); setLinkedLoading(false); });
  }, []);

  const openLinkModal = (prefill?: LinkedAccount) => {
    setLinkForm(prefill ? {
      bankName: prefill.bank_name,
      accountNumber: prefill.account_number,
      routingNumber: prefill.routing_number,
      accountType: prefill.account_type,
      nickname: prefill.nickname ?? "",
    } : BLANK_FORM);
    setLinkError("");
    setShowLinkModal(true);
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError("");
    if (!linkForm.bankName.trim()) return setLinkError("Bank name is required.");
    if (!/^\d{9}$/.test(linkForm.routingNumber)) return setLinkError("Routing number must be exactly 9 digits.");
    if (!/^\d{4,17}$/.test(linkForm.accountNumber)) return setLinkError("Account number must be 4–17 digits.");
    if (!session) return;
    setLinkSaving(true);
    try {
      const res = await fetch(`/api/member/${session.loginId}/linked-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          bankName: linkForm.bankName.trim(),
          accountNumber: linkForm.accountNumber.trim(),
          routingNumber: linkForm.routingNumber.trim(),
          accountType: linkForm.accountType,
          nickname: linkForm.nickname.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setLinkError(data.error || "Failed to save account.");
      setLinked(data.account);
      setShowLinkModal(false);
    } catch {
      setLinkError("Failed to save account. Please try again.");
    } finally {
      setLinkSaving(false);
    }
  };

  const handleDeleteLinked = async () => {
    if (!session) return;
    setDeleting(true);
    try {
      await fetch(`/api/member/${session.loginId}/linked-account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setLinked(null);
      setShowDeleteConfirm(false);
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const num = parseFloat(amount);
    if (!num || num <= 0) return setError("Please enter a valid amount.");
    if (balance && num > balance.available)
      return setError(`Amount exceeds your available balance of ${fmt(balance.available)}.`);
    if (!linked) return setError("Please link an external account before transferring.");
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
          message: `You requested a transfer of ${fmt(num)} to ${linked.bank_name}.\n\nYour one-time verification code is:\n\n${otp}\n\nThis code expires in 10 minutes. If you did not initiate this transfer, please contact us immediately at 512.302.6800.`,
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
  const parsedAmount = parseFloat(amount) || 0;
  const afterBalance = balance ? balance.available - parsedAmount : null;
  const displayName = linked?.nickname || linked?.bank_name || "";
  const last4 = linked?.account_number.slice(-4) ?? "";

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
              {/* From / To */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {/* FROM */}
                <div className="border border-brand-green/30 bg-brand-green/5 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1.5">From</p>
                  <p className="font-semibold text-ink text-sm">{accountLabel}</p>
                  <p className="text-[12px] font-mono text-ink/50 mt-0.5">••••  ••••  {acctNumber.slice(-4)}</p>
                  <p className="text-[12px] text-ink/50 mt-0.5">
                    {fetching ? "Loading…" : `Available: ${fmt(balance?.available ?? 0)}`}
                  </p>
                </div>

                {/* TO */}
                {linkedLoading ? (
                  <div className="border border-border bg-secondary/40 p-4 flex items-center gap-2 text-ink/40 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                  </div>
                ) : linked ? (
                  <div className="border border-border bg-secondary/40 p-4">
                    <div className="flex items-start justify-between mb-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">To</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openLinkModal(linked)}
                          className="text-ink/30 hover:text-brand-green transition-colors"
                          title="Edit account"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="text-ink/30 hover:text-red-500 transition-colors"
                          title="Remove account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="font-semibold text-ink text-sm">{displayName}</p>
                    <p className="text-[12px] font-mono text-ink/50 mt-0.5">
                      {linked.account_type} · ••••  {last4}
                    </p>
                    <p className="text-[12px] text-ink/40 mt-0.5">
                      Routing: {linked.routing_number}
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openLinkModal()}
                    className="border-2 border-dashed border-border hover:border-brand-green bg-secondary/20 hover:bg-brand-green/5 p-4 text-left transition-all group flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-8 h-8 border border-dashed border-ink/20 group-hover:border-brand-green/40 flex items-center justify-center rounded-full transition-colors">
                      <Plus className="w-4 h-4 text-ink/30 group-hover:text-brand-green transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm text-ink/50 group-hover:text-brand-green transition-colors">Link External Account</p>
                      <p className="text-[11px] text-ink/35 mt-0.5">Add a bank account to transfer to</p>
                    </div>
                  </button>
                )}
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
                  disabled={sending || fetching || !linked || !amount || parsedAmount <= 0 || (!!balance && parsedAmount > balance.available)}
                  className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
                >
                  {sending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  ) : (
                    <><ArrowLeftRight className="w-4 h-4" /> Confirm Withdrawal</>
                  )}
                </button>
                {!linked && !linkedLoading && (
                  <p className="text-[11px] text-center text-ink/40">Link an external account above to enable transfers.</p>
                )}
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

      {/* ── Link / Edit Account Modal ── */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLinkModal(false)} />
          <div className="relative bg-white w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-green" />
                <span className="font-bold text-sm text-ink">
                  {linked ? "Edit External Account" : "Link External Account"}
                </span>
              </div>
              <button onClick={() => setShowLinkModal(false)} className="text-ink/30 hover:text-ink transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="px-6 py-5 space-y-4">
              {linkError && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-[13px] px-4 py-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {linkError}
                </div>
              )}

              <div>
                <label className="block text-[12px] font-semibold text-ink mb-1.5">Bank Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Chase Bank"
                  className="w-full border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                  value={linkForm.bankName}
                  onChange={e => setLinkForm(f => ({ ...f, bankName: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-ink mb-1.5">Nickname <span className="text-ink/40 font-normal">(optional)</span></label>
                <input
                  type="text"
                  placeholder="e.g. My Savings"
                  maxLength={40}
                  className="w-full border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                  value={linkForm.nickname}
                  onChange={e => setLinkForm(f => ({ ...f, nickname: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-ink mb-1.5">Account Type <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                    value={linkForm.accountType}
                    onChange={e => setLinkForm(f => ({ ...f, accountType: e.target.value }))}
                  >
                    <option>Checking</option>
                    <option>Savings</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-ink mb-1.5">Routing Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="9 digits"
                    maxLength={9}
                    className="w-full border border-border bg-white px-3 py-2.5 text-sm font-mono text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                    value={linkForm.routingNumber}
                    onChange={e => setLinkForm(f => ({ ...f, routingNumber: e.target.value.replace(/\D/g, "").slice(0, 9) }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-ink mb-1.5">Account Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="4–17 digits"
                  maxLength={17}
                  className="w-full border border-border bg-white px-3 py-2.5 text-sm font-mono text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                  value={linkForm.accountNumber}
                  onChange={e => setLinkForm(f => ({ ...f, accountNumber: e.target.value.replace(/\D/g, "").slice(0, 17) }))}
                />
              </div>

              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 px-3 py-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Your account details are encrypted and stored securely. We never share your information.
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="flex-1 border border-border bg-secondary/40 hover:bg-secondary text-ink py-2.5 font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linkSaving}
                  className="flex-1 bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 text-white py-2.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
                >
                  {linkSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> {linked ? "Save Changes" : "Link Account"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-150 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-bold text-sm text-ink">Remove Linked Account?</p>
                <p className="text-[12px] text-ink/50">{linked?.nickname || linked?.bank_name}</p>
              </div>
            </div>
            <p className="text-[13px] text-ink/55 mb-5">
              This account will be unlinked. You can always add it back later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-border bg-secondary/40 hover:bg-secondary text-ink py-2.5 font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLinked}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-2.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Removing…</> : "Remove Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
