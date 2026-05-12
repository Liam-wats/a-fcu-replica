import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BookCheck, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import type { Session } from "@/routes/dashboard";

export const Route = createFileRoute("/dashboard/checks")({
  component: ChecksPage,
});

const STYLES = [
  { id: "classic", label: "Classic Blue", desc: "Traditional A+FCU design" },
  { id: "scenic", label: "Scenic Texas", desc: "Texas landscapes" },
  { id: "personal", label: "Personal Photo", desc: "Upload your own image" },
];

const QUANTITIES = ["1 box (150 checks)", "2 boxes (300 checks)", "4 boxes (600 checks)"];

function ChecksPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [style, setStyle] = useState("classic");
  const [qty, setQty] = useState(QUANTITIES[0]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("apfcu_session");
    if (!raw) return;
    setSession(JSON.parse(raw));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  if (!session) return null;

  return (
    <div className="container-x py-8 max-w-2xl">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] text-brand-green hover:underline underline-offset-4 mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
      </Link>

      <div className="bg-white border border-border shadow-sm">
        <div className="h-1 bg-brand-green" />
        <div className="px-8 py-6 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <BookCheck className="w-4 h-4 text-brand-green" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-green">Online Banking</span>
          </div>
          <h1 className="font-serif text-2xl text-ink">Order Checks</h1>
          <p className="text-[13px] text-ink/50 mt-1">Personalized checks shipped to your door.</p>
        </div>

        <div className="px-8 py-6">
          {submitted ? (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 flex items-center justify-center rounded-full">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-ink">Order Placed!</h2>
                <p className="text-[13px] text-ink/55 mt-1 leading-relaxed max-w-xs mx-auto">
                  Your {qty} ({style} style) will arrive within 7–10 business days at your registered address.
                </p>
              </div>
              <Link to="/dashboard" className="mt-2 text-[13px] font-semibold text-brand-green hover:underline underline-offset-4">
                Return to Overview
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Style selection */}
              <div>
                <label className="block text-[13px] font-semibold text-ink mb-2">Check Style</label>
                <div className="space-y-2">
                  {STYLES.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 border text-left transition-all ${
                        style === s.id
                          ? "border-brand-green bg-brand-green/5"
                          : "border-border hover:border-brand-green/40"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        style === s.id ? "border-brand-green" : "border-slate-300"
                      }`}>
                        {style === s.id && <div className="w-2 h-2 rounded-full bg-brand-green" />}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${style === s.id ? "text-brand-green" : "text-ink"}`}>{s.label}</p>
                        <p className="text-[12px] text-ink/45">{s.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-[13px] font-semibold text-ink mb-2">Quantity</label>
                <select
                  className="w-full border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand-green transition-all"
                  value={qty}
                  onChange={e => setQty(e.target.value)}
                >
                  {QUANTITIES.map(q => <option key={q}>{q}</option>)}
                </select>
              </div>

              {/* Shipping */}
              <div>
                <label className="block text-[13px] font-semibold text-ink mb-1.5">
                  Shipping Address <span className="font-normal text-ink/40">(leave blank to use address on file)</span>
                </label>
                <textarea
                  placeholder="123 Main St, Austin, TX 78701"
                  rows={2}
                  className="w-full border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand-green transition-all resize-none"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>

              <div className="border border-border bg-secondary/30 px-4 py-3">
                <p className="text-[12px] text-ink/55">
                  Standard shipping: <span className="font-semibold text-ink">7–10 business days</span> ·
                  Processing fee may apply. Check your account agreement.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-60 text-white py-3.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order…</> : <>
                  <BookCheck className="w-4 h-4" /> Place Order
                </>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
