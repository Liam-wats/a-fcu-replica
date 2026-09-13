import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, Eye, EyeOff, Lock, ShieldCheck,
  BadgeDollarSign, Headphones, Globe, AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Online Banking Login — A+ Federal Credit Union" },
      { name: "description", content: "Sign in to A+ Federal Credit Union online banking. Federally insured by NCUA." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Bank-grade security",
    body: "256-bit SSL encryption protects every session.",
  },
  {
    icon: BadgeDollarSign,
    title: "NCUA insured",
    body: "Your deposits are federally insured up to $250,000.",
  },
  {
    icon: Headphones,
    title: "24/7 support",
    body: "Our member care team is always here for you.",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId]   = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginId.trim() || !password.trim()) {
      setError("Please enter your Login ID and password to continue.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: loginId.trim(), password }),
      });
      const data = await res.json();

      if (res.status === 429) {
        setError("Too many login attempts. Please wait 15 minutes before trying again.");
        return;
      }
      if (res.ok && data.success) {
        sessionStorage.setItem("apfcu_session", JSON.stringify({
          ...data.member,
          loginId: data.member.loginId ?? loginId.trim(),
        }));
        sessionStorage.setItem("apfcu_token", data.token);
        navigate({ to: "/dashboard" });
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentDomain = typeof window !== "undefined" ? window.location.hostname : "aplusfcu.org";
  const isHttps = typeof window !== "undefined" ? window.location.protocol === "https:" : true;

  return (
    <div className="min-h-[calc(100vh-136px)] flex flex-col">

      {/* ── Domain verification strip ─────────────────────────────── */}
      <div className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-[11px] font-semibold border-b ${
        isHttps
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : "bg-amber-50 border-amber-200 text-amber-700"
      }`}>
        {isHttps ? (
          <Lock className="w-3 h-3 shrink-0" />
        ) : (
          <AlertTriangle className="w-3 h-3 shrink-0" />
        )}
        <span>
          {isHttps ? "Secure connection" : "Connection not encrypted"} ·{" "}
          <span className="font-bold">{currentDomain}</span>
          {isHttps && " · Verified A+ Federal Credit Union"}
        </span>
        <Globe className="w-3 h-3 shrink-0 ml-1" />
      </div>

      <div className="flex-1 grid lg:grid-cols-[1fr_520px]">

        {/* ── LEFT — Brand panel ─────────────────────────────────── */}
        <div className="hidden lg:flex flex-col justify-between bg-brand-green px-14 py-16 relative overflow-hidden">

          {/* Decorative rings */}
          <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -top-20 -left-20 w-[340px] h-[340px] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full border border-white/10 translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1.5 mb-10">
              <Lock className="w-3 h-3" />
              Secure Online Banking
            </div>
            <h2 className="font-serif text-white text-4xl xl:text-5xl leading-[1.08] max-w-xs">
              Banking that works as hard as you do.
            </h2>
            <p className="mt-5 text-white/70 text-[15px] leading-relaxed max-w-[320px]">
              Access your accounts, pay bills, transfer funds, and manage your finances — all in one place.
            </p>
          </div>

          {/* Trust signals */}
          <div className="relative z-10 space-y-6">
            {TRUST_ITEMS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mt-0.5">
                  <Icon className="w-4 h-4 text-white/90" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-white/60 text-xs mt-0.5 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="relative z-10 text-white/40 text-xs leading-relaxed">
            © {new Date().getFullYear()} A+ Federal Credit Union<br />
            Federally insured by NCUA · Equal Housing Lender
          </p>
        </div>

        {/* ── RIGHT — Form panel ─────────────────────────────────── */}
        <div className="flex flex-col justify-center bg-[#FAFAF8] px-8 sm:px-14 py-16">
          <div className="w-full max-w-sm mx-auto">

            {/* Official site notice */}
            <div className="mb-6 flex items-start gap-2.5 bg-white border border-border rounded px-3.5 py-3 text-[12px] text-ink/60 leading-snug">
              <ShieldCheck className="w-4 h-4 text-brand-green shrink-0 mt-px" />
              <div>
                <span className="font-semibold text-ink">Official A+FCU member portal.</span>{" "}
                Never share your credentials by phone or email. We will never ask for your full password.
              </div>
            </div>

            <div className="mb-8">
              <h1 className="font-serif text-ink text-3xl">Welcome back</h1>
              <p className="mt-1.5 text-sm text-ink/55">
                Sign in to your A+ Online Banking account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

              {error && (
                <div role="alert" className="bg-red-50 border-l-4 border-red-500 text-red-700 text-[13px] px-4 py-3 leading-relaxed">
                  {error}
                </div>
              )}

              {/* Login ID */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-id" className="text-[13px] font-semibold text-ink tracking-wide">
                  Login ID
                </label>
                <input
                  id="login-id"
                  name="username"
                  type="text"
                  autoComplete="username"
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/35 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                  placeholder="Your Login ID"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-[13px] font-semibold text-ink tracking-wide">
                    Password
                  </label>
                  <a href="tel:689318829" className="text-[12px] text-brand-green hover:underline underline-offset-4">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    className="w-full border border-border bg-white px-4 py-3 pr-11 text-sm text-ink placeholder:text-ink/35 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink transition-colors"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-60 text-white py-3.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors mt-1"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Secondary links */}
            <div className="mt-5 pt-5 border-t border-border/60 flex flex-wrap gap-x-4 gap-y-2">
              <Link to="/join" className="text-[12px] text-brand-green hover:underline underline-offset-4">
                Enroll in Online Banking
              </Link>
              <a href="tel:689318829" className="text-[12px] text-brand-green hover:underline underline-offset-4">
                Forgot ID?
              </a>
              <a href="tel:689318829" className="text-[12px] text-brand-green hover:underline underline-offset-4">
                Unlock Account
              </a>
            </div>

            {/* Open account CTA */}
            <div className="mt-8 pt-8 border-t border-border/60">
              <p className="text-[13px] font-semibold text-ink mb-3">Not a member yet?</p>
              <Link
                to="/join"
                className="w-full inline-flex items-center justify-center gap-2 border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white py-3 font-semibold text-sm transition-colors"
              >
                Open an Account <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-3 text-[11px] text-ink/40 text-center">Membership is open to the Texas community</p>
            </div>

            {/* Help line */}
            <p className="mt-8 text-center text-[11px] text-ink/40 leading-relaxed">
              Need help? Call{" "}
               <a href="tel:689318829" className="text-brand-green hover:underline">
                 689318829
              </a>
              {" "}· Mon–Fri 8am–6pm CT
            </p>

            {/* Regulatory footer */}
            <div className="mt-8 pt-6 border-t border-border/40 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10px] text-ink/30 uppercase tracking-wide font-semibold text-center">
              <span>Member NCUA</span>
              <span aria-hidden>·</span>
              <span>Equal Housing Lender</span>
              <span aria-hidden>·</span>
              <span>Federally Chartered</span>
              <span aria-hidden>·</span>
              <a href="/.well-known/security.txt" className="hover:text-ink/50 transition-colors">Security Policy</a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
