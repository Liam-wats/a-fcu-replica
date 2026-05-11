import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ShieldCheck, Eye, EyeOff, ArrowRight, Lock,
  Smartphone, MessageSquare, Phone,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { getAdminUsers } from "@/data/admin-users";
import { setMemberSession, getMemberSession } from "@/lib/session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Online Banking Login — A+ Federal Credit Union" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const alreadyLoggedIn = !!getMemberSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email address and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const users = getAdminUsers();
      const match = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!match) {
        setError("We couldn't find an account with that email address. Please check your information and try again.");
        setLoading(false);
        return;
      }
      if (match.status === "suspended") {
        setError("This account has been suspended. Please call us at (512) 302-6800 for assistance.");
        setLoading(false);
        return;
      }
      setMemberSession(match.id);
      navigate({ to: "/dashboard" });
    }, 700);
  };

  const activeUsers = getAdminUsers().filter((u) => u.status !== "suspended");

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <header className="bg-white border-b border-border">
        <div className="container-x h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>
      </header>
      <div className="h-[3px] bg-brand-green" />

      <section className="bg-brand-yellow">
        <div className="container-x py-10 lg:py-14">
          <p className="text-sm uppercase tracking-[0.18em] font-semibold text-ink/60">Member Access</p>
          <h1 className="font-serif text-4xl md:text-5xl mt-2 leading-[1.08]">Online Banking</h1>
          <p className="mt-3 text-base text-ink/75 max-w-lg">
            Access your accounts, view balances, pay loans, and manage your finances — securely, anytime.
          </p>
        </div>
      </section>

      <main className="flex-1 container-x py-12">
        <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start max-w-5xl">
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-2xl text-ink mb-5">Everything you need, in one place</h2>
              <ul className="space-y-4">
                {[
                  { icon: ShieldCheck, title: "Secure account access", body: "Bank-grade 256-bit encryption protects every login and transaction." },
                  { icon: Smartphone, title: "Mobile & desktop ready", body: "Manage accounts from any device, any time of day." },
                  { icon: MessageSquare, title: "Secure messaging", body: "Send messages to our member services team directly from your account." },
                  { icon: Phone, title: "24/7 support available", body: "Reach us by phone at (512) 302-6800 if you ever need help." },
                ].map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex gap-4">
                    <div className="w-10 h-10 bg-brand-green shrink-0 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink text-sm">{title}</p>
                      <p className="text-sm text-ink/65 mt-0.5">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-border p-6">
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-muted-foreground mb-3">Not enrolled?</p>
              <p className="text-sm text-ink/80 mb-4">
                First-time users need to enroll in online banking. It only takes a few minutes and you'll need your member number.
              </p>
              <a href="#enroll" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:underline underline-offset-4">
                Enroll in online banking <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-ink/80">
                  Not yet a member?{" "}
                  <Link to="/join" className="font-semibold text-brand-green hover:underline underline-offset-4">
                    Join A+FCU today →
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {alreadyLoggedIn && (
              <div className="bg-brand-green/5 border border-brand-green/30 p-4">
                <p className="text-sm font-semibold text-brand-green">You're already signed in.</p>
                <Link to="/dashboard" className="text-sm text-brand-green underline underline-offset-4 mt-1 inline-block">
                  Go to My Account →
                </Link>
              </div>
            )}

            <div className="bg-white border border-border">
              <div className="px-6 py-4 border-b border-border bg-brand-cream">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand-green" />
                  <span className="text-sm font-semibold text-ink">Sign In to Your Account</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com"
                    className="w-full border border-border bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-ink">Password</label>
                    <button type="button" className="text-xs font-medium text-brand-green hover:underline underline-offset-4">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="Enter your password"
                      className="w-full border border-border bg-white px-3 py-2.5 pr-10 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent placeholder:text-muted-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink transition-colors"
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-60 text-white font-semibold py-3 text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Sign In to Online Banking <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <div className="flex items-center gap-2 pt-1">
                  <ShieldCheck className="w-4 h-4 text-brand-green shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Protected by 256-bit SSL encryption. Federally insured by NCUA.
                  </p>
                </div>
              </form>

              <div className="px-6 pb-5 border-t border-border pt-4">
                <p className="text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground mb-2.5">
                  Demo — select a member account:
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {activeUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => { setEmail(u.email); setPassword("password123"); }}
                      className="w-full text-left px-3 py-2 bg-brand-cream hover:bg-brand-green/5 border border-transparent hover:border-brand-green/20 transition-colors flex items-center justify-between group text-xs"
                    >
                      <span className="font-semibold text-ink">{u.name}</span>
                      <span className="text-muted-foreground group-hover:text-brand-green transition-colors truncate ml-2">{u.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-border p-4">
              <p className="text-xs font-semibold text-ink mb-2">Need help accessing your account?</p>
              <div className="flex gap-4 text-xs">
                <a href="tel:5123026800" className="text-brand-green hover:underline underline-offset-4 font-medium">
                  Call (512) 302-6800
                </a>
                <span className="text-border">|</span>
                <Link to="/contact-us" className="text-brand-green hover:underline underline-offset-4 font-medium">
                  Send a message
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-white py-4">
        <div className="container-x text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} A+ Federal Credit Union · Federally insured by NCUA · Equal Housing Lender · Routing #314977104
        </div>
      </footer>
    </div>
  );
}
