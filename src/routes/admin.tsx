import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Globe, ChevronRight, Users, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV = [
  { label: "Applications", icon: LayoutDashboard, href: "/admin" },
];

const SESSION_KEY = "apfcu_admin_session";
const TOKEN_KEY = "apfcu_admin_token";

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY) || "";
}

function AdminLoginGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password.trim()) {
      setError("Please enter the admin password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem(SESSION_KEY, "1");
        sessionStorage.setItem(TOKEN_KEY, data.token);
        onAuth();
      } else {
        setError(data.error || "Access denied.");
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f4f5] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">

        {/* Brand mark */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-green flex items-center justify-center text-white font-bold text-base">
            A+
          </div>
          <div>
            <p className="text-ink font-bold text-sm leading-none">A+ Federal Credit Union</p>
            <p className="text-ink/40 text-[11px] leading-none mt-0.5">Admin Console</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-border shadow-sm">

          {/* Green top bar */}
          <div className="h-1 bg-brand-green" />

          <div className="px-8 py-8">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-brand-green" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-green">Restricted Area</span>
            </div>
            <h1 className="font-serif text-2xl text-ink mt-1">Staff Sign In</h1>
            <p className="text-[13px] text-ink/50 mt-1">
              Enter your admin password to access the console.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-[13px] px-4 py-3 leading-relaxed">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="admin-pw" className="text-[13px] font-semibold text-ink tracking-wide">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    id="admin-pw"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    autoFocus
                    className="w-full border border-border bg-white px-4 py-3 pr-11 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                    placeholder="Enter password"
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
                    Verifying…
                  </>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Trust note */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-ink/40">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Access is logged and monitored · A+FCU Internal Use Only</span>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-[12px] text-brand-green hover:underline underline-offset-4">
            ← Return to public site
          </Link>
        </div>

      </div>
    </div>
  );
}

function AdminLayout() {
  const location = useLocation();
  const [authed, setAuthed] = useState(() => {
    const hasSession = sessionStorage.getItem(SESSION_KEY) === "1";
    const hasToken = !!sessionStorage.getItem(TOKEN_KEY);
    return hasSession && hasToken;
  });

  const handleSignOut = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLoginGate onAuth={() => setAuthed(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#f2f4f5] overflow-hidden">

      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="w-60 shrink-0 flex flex-col bg-white border-r border-border shadow-sm">

        {/* Brand */}
        <div className="border-b border-border px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-green flex items-center justify-center text-white font-bold text-sm shrink-0">
              A+
            </div>
            <div>
              <p className="text-ink font-bold text-sm leading-none">A+ Federal</p>
              <p className="text-ink/40 text-[11px] leading-none mt-0.5">Credit Union</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-green bg-brand-green/8 border border-brand-green/20 px-2 py-0.5">
              Admin Console
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 px-3 mb-2">Management</p>
          {NAV.map(({ label, icon: Icon, href }) => {
            const active = location.pathname === href || (href !== "/admin" && location.pathname.startsWith(href));
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-[14px] font-semibold transition-colors",
                  active
                    ? "bg-brand-green/10 text-brand-green border-l-[3px] border-brand-green pl-[9px]"
                    : "text-ink/60 hover:text-ink hover:bg-secondary rounded"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-brand-green/60" />}
              </Link>
            );
          })}

          <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 px-3 mt-6 mb-2">Members</p>
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-semibold text-ink/60 hover:text-ink hover:bg-secondary rounded transition-colors"
          >
            <Users className="w-4 h-4 shrink-0" />
            All Members
          </Link>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border space-y-0.5">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded text-[14px] font-semibold text-ink/50 hover:text-brand-green hover:bg-brand-green/5 transition-colors"
          >
            <Globe className="w-4 h-4" />
            View Public Site
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-[14px] font-semibold text-ink/50 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <div className="px-3 pt-3 mt-2 border-t border-border">
            <p className="text-[10px] text-ink/30 leading-relaxed">
              © {new Date().getFullYear()} A+ Federal Credit Union<br />
              Federally insured by NCUA
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
