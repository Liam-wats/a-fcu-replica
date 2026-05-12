import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ShieldCheck, User, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Online Banking Login — A+FCU" }],
  }),
  component: LoginPage,
});

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
      setError("Please enter your Login ID and password.");
      return;
    }
    setLoading(true);
    // Simulate auth attempt — in production this would call the banking API
    setTimeout(() => {
      setLoading(false);
      setError("Your Login ID or password is incorrect. Please try again or reset your credentials below.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <header className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white border border-border">
            <div className="bg-brand-green px-8 py-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">A+ Federal Credit Union</p>
                <h1 className="text-white font-serif text-2xl leading-tight">Online Banking</h1>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-8 flex flex-col gap-5">
              {error && (
                <div className="bg-destructive/5 border border-destructive/20 text-destructive text-sm px-4 py-3 leading-relaxed">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-ink" htmlFor="login-id">
                  Login ID <span className="text-destructive">*</span>
                </label>
                <input
                  id="login-id"
                  type="text"
                  autoComplete="username"
                  className="border border-border px-3.5 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                  placeholder="Enter your Login ID"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-ink" htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    className="w-full border border-border px-3.5 py-3 pr-11 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink transition-colors"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-60 text-white py-3.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
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
                  <>Log In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <div className="pt-2 border-t border-border flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <a href="#" className="text-brand-green underline underline-offset-4 hover:no-underline">
                  Enroll in Online Banking
                </a>
                <a href="#" className="text-brand-green underline underline-offset-4 hover:no-underline">
                  Forgot ID?
                </a>
                <a href="#" className="text-brand-green underline underline-offset-4 hover:no-underline">
                  Forgot Password?
                </a>
                <a href="#" className="text-brand-green underline underline-offset-4 hover:no-underline">
                  Unlock Account
                </a>
              </div>
            </form>
          </div>

          {/* Not a member */}
          <div className="mt-6 bg-white border border-border px-8 py-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm text-ink">Not a member yet?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Open an account in about 5 minutes.</p>
            </div>
            <Link
              to="/join"
              className="shrink-0 inline-flex items-center gap-2 border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-5 py-2.5 font-semibold text-sm transition-colors"
            >
              Join Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
            Having trouble? Call us at{" "}
            <a href="tel:5123026800" className="text-brand-green hover:underline">(512) 302-6800</a>
            {" "}· Mon–Fri 8am–6pm CT
          </p>
        </div>
      </main>

      <footer className="border-t border-border bg-white py-4">
        <div className="max-w-6xl mx-auto px-6 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} A+ Federal Credit Union · Federally insured by NCUA · Equal Housing Lender
        </div>
      </footer>
    </div>
  );
}
