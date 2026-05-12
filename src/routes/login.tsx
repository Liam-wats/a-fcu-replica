import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck, BadgeDollarSign, Headphones } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Online Banking Login — A+FCU" }],
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
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginId.trim() || !password.trim()) {
      setError("Please enter your Login ID and password to continue.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setError(
        "Incorrect Login ID or password. Please check your credentials and try again."
      );
    }, 1400);
  };

  return (
    <div className="min-h-[calc(100vh-136px)] grid lg:grid-cols-[1fr_520px]">

      {/* ── LEFT — Brand panel ─────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between bg-brand-green px-14 py-16 relative overflow-hidden">

        {/* Decorative rings */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -top-20 -left-20 w-[340px] h-[340px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full border border-white/10 translate-x-1/3 translate-y-1/3" />

        {/* Top content */}
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

        {/* Bottom note */}
        <p className="relative z-10 text-white/40 text-xs leading-relaxed">
          © {new Date().getFullYear()} A+ Federal Credit Union<br />
          Federally insured by NCUA · Equal Housing Lender
        </p>
      </div>

      {/* ── RIGHT — Form panel ─────────────────────────────────── */}
      <div className="flex flex-col justify-center bg-[#FAFAF8] px-8 sm:px-14 py-16">
        <div className="w-full max-w-sm mx-auto">

          <div className="mb-8">
            <h1 className="font-serif text-ink text-3xl">Welcome back</h1>
            <p className="mt-1.5 text-sm text-ink/55">
              Sign in to your A+ Online Banking account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-[13px] px-4 py-3 leading-relaxed">
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
                type="text"
                autoComplete="username"
                spellCheck={false}
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
                <a href="#" className="text-[12px] text-brand-green hover:underline underline-offset-4">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
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
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Secondary links */}
          <div className="mt-5 pt-5 border-t border-border/60 flex flex-wrap gap-x-4 gap-y-2">
            {["Enroll in Online Banking", "Forgot ID?", "Unlock Account"].map((l) => (
              <a key={l} href="#" className="text-[12px] text-brand-green hover:underline underline-offset-4">
                {l}
              </a>
            ))}
          </div>

          {/* Divider */}
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
            <a href="tel:5123026800" className="text-brand-green hover:underline">
              (512) 302-6800
            </a>
            {" "}· Mon–Fri 8am–6pm CT
          </p>

        </div>
      </div>

    </div>
  );
}
