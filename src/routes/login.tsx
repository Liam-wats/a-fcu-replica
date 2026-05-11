import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shield, Eye, EyeOff, ArrowRight, Lock, Mail } from "lucide-react";
import { getAdminUsers } from "@/data/admin-users";
import { setMemberSession, getMemberSession } from "@/lib/session";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const existingSession = getMemberSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const users = getAdminUsers();
      const match = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!match) {
        setError("No account found with that email address. Try one from the list below.");
        setLoading(false);
        return;
      }
      if (match.status === "suspended") {
        setError("This account has been suspended. Please call (512) 302-6800 for assistance.");
        setLoading(false);
        return;
      }
      setMemberSession(match.id);
      navigate({ to: "/dashboard" });
    }, 800);
  };

  const users = getAdminUsers().filter((u) => u.status !== "suspended");

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-green-dark to-brand-green flex flex-col">
      <div className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
          ← Back to A+ FCU
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-white text-3xl font-bold font-serif">Online Banking</h1>
            <p className="text-white/70 text-sm mt-2">A+ Federal Credit Union</p>
          </div>

          {existingSession && (
            <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 mb-4 text-center">
              <p className="text-white/80 text-sm">You're already signed in.</p>
              <Link to="/dashboard" className="text-white font-semibold text-sm underline underline-offset-2 mt-1 inline-block">
                Go to My Dashboard →
              </Link>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-brand-cream px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-green" />
                <span className="text-sm font-semibold text-ink">Secure Member Login</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com"
                    className="w-full border border-border rounded pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-ink">Password</label>
                  <button type="button" className="text-xs text-brand-green hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Any password works (demo)"
                    className="w-full border border-border rounded pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  />
                  <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-3 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Not a member?{" "}
                <Link to="/join" className="text-brand-green hover:underline font-medium">Join A+FCU</Link>
              </p>
            </form>

            <div className="px-6 pb-5">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Demo — sign in as any member:</p>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => { setEmail(u.email); setPassword("password"); }}
                    className="w-full text-left text-xs px-3 py-2 bg-brand-cream hover:bg-brand-green/10 rounded transition-colors flex items-center justify-between group"
                  >
                    <span className="font-medium text-ink">{u.name}</span>
                    <span className="text-muted-foreground group-hover:text-brand-green">{u.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
