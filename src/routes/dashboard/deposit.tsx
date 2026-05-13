import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Smartphone, CheckCircle2, ArrowLeft, Loader2, AlertCircle, Upload, X } from "lucide-react";
import type { Session } from "@/routes/dashboard";
import { ACCOUNT_LABELS } from "@/routes/dashboard";

export const Route = createFileRoute("/dashboard/deposit")({
  component: DepositPage,
});

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function getToken() {
  return sessionStorage.getItem("apfcu_token") || "";
}

interface ImageFile {
  file: File;
  preview: string;
}

function CheckImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ImageFile | null;
  onChange: (img: ImageFile | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const preview = URL.createObjectURL(file);
    onChange({ file, preview });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const handleRemove = () => {
    if (value) URL.revokeObjectURL(value.preview);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      {value ? (
        <div className="relative border-2 border-brand-green rounded overflow-hidden bg-brand-green/5">
          <img
            src={value.preview}
            alt={label}
            className="w-full h-36 object-contain p-2"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1.5 right-1.5 bg-white border border-border rounded-full p-0.5 shadow hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-ink/60" />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-t border-brand-green/20 bg-brand-green/10">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0" />
            <span className="text-[12px] font-semibold text-brand-green truncate">{value.file.name}</span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border hover:border-brand-green/50 rounded p-6 flex flex-col items-center gap-2 transition-all text-center cursor-pointer bg-secondary/30 hover:bg-brand-green/5"
        >
          <Upload className="w-6 h-6 text-ink/30" />
          <span className="text-[13px] font-semibold text-ink/50">Upload {label}</span>
          <span className="text-[11px] text-ink/35">Click to browse or drag &amp; drop</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

function DepositPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [balance, setBalance] = useState<{ available: number; current: number } | null>(null);
  const [amount, setAmount] = useState("");
  const [frontImage, setFrontImage] = useState<ImageFile | null>(null);
  const [backImage, setBackImage]   = useState<ImageFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successAmount, setSuccessAmount] = useState("");

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
        .then(d => setBalance(d.balance));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const num = parseFloat(amount);
    if (!num || num <= 0) return setError("Please enter a valid deposit amount.");
    if (!frontImage) return setError("Please upload the front of the check.");
    if (!backImage)  return setError("Please upload the back of the check.");
    if (!session?.loginId) return setError("Session expired. Please log in again.");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("amount", String(num));
      formData.append("front", frontImage.file);
      formData.append("back",  backImage.file);

      const res = await fetch(`/api/member/${session.loginId}/deposit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deposit failed.");

      setSuccessAmount(fmt(num));
      setBalance(data.newBalance);
      setSuccess(true);
      setAmount("");
      setFrontImage(null);
      setBackImage(null);
    } catch (err: any) {
      setError(err.message || "Deposit failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;
  const accountLabel = ACCOUNT_LABELS[session.accountType] ?? session.accountType;

  return (
    <div className="container-x py-8 max-w-2xl">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] text-brand-green hover:underline underline-offset-4 mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
      </Link>

      <div className="bg-white border border-border shadow-sm">
        <div className="h-1 bg-brand-green" />
        <div className="px-8 py-6 border-b border-border flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="w-4 h-4 text-brand-green" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-green">Online Banking</span>
            </div>
            <h1 className="font-serif text-2xl text-ink">Mobile Check Deposit</h1>
            <p className="text-[13px] text-ink/50 mt-1">Take a photo of your check to deposit it instantly.</p>
          </div>
          <Link
            to="/dashboard/deposit-history"
            className="shrink-0 text-[12px] font-semibold text-brand-green hover:underline underline-offset-4 mt-1"
          >
            View History →
          </Link>
        </div>

        <div className="px-8 py-6">
          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 px-4 py-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-800 text-sm">Deposit Submitted</p>
                <p className="text-[13px] text-emerald-700 mt-0.5">
                  Your deposit of {successAmount} has been accepted. Funds will be available by end of business day.
                </p>
              </div>
            </div>
          )}

          <div className="border border-border bg-secondary/40 p-4 mb-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40 mb-1">Deposit To</p>
            <p className="font-semibold text-ink text-sm">{accountLabel}</p>
            {balance && <p className="text-[12px] text-ink/50 mt-0.5">Current balance: {fmt(balance.available)}</p>}
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border-l-4 border-red-500 text-red-700 text-[13px] px-4 py-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-ink mb-1.5">Check Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/50 font-semibold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="5000"
                  placeholder="0.00"
                  className="w-full border border-border bg-white pl-8 pr-4 py-3 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <CheckImageUpload label="Front of Check" value={frontImage} onChange={setFrontImage} />
              <CheckImageUpload label="Back of Check"  value={backImage}  onChange={setBackImage} />
            </div>

            <div className="border border-border bg-secondary/30 px-4 py-3">
              <p className="text-[12px] text-ink/55">
                Daily mobile deposit limit: <span className="font-semibold text-ink">$5,000</span> ·
                Funds available by <span className="font-semibold text-ink">end of business day</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-60 text-white py-3.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : <>
                <Smartphone className="w-4 h-4" /> Submit Deposit
              </>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
