import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  LogOut, Bell, Home, ArrowLeftRight, CreditCard,
  Smartphone, FileText, BookCheck, Phone, MapPin,
  User, ChevronRight, X, AlertCircle, Info, CheckCircle2,
  ShieldCheck, Mail, CreditCard as CardIcon, Settings,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";
import { ChatWidget } from "@/components/chat/ChatWidget";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

export interface Session {
  loginId: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  referenceNumber: string;
}

export const ACCOUNT_LABELS: Record<string, string> = {
  "cash-back-checking": "Cash-Back Checking",
  "free-checking":      "Free Checking",
  "regular-savings":    "Regular Savings",
  "money-market":       "Money Market Savings",
};

const NAV_ITEMS = [
  { label: "Overview",     href: "/dashboard",            icon: Home,           exact: true },
  { label: "Transfer",     href: "/dashboard/transfer",   icon: ArrowLeftRight, exact: false },
  { label: "Pay Bills",    href: "/dashboard/bills",      icon: CreditCard,     exact: false },
  { label: "Deposit",      href: "/dashboard/deposit",    icon: Smartphone,     exact: false },
  { label: "Statements",   href: "/dashboard/statements", icon: FileText,       exact: false },
  { label: "Order Checks", href: "/dashboard/checks",     icon: BookCheck,      exact: false },
];

interface Alert {
  id: number;
  title: string;
  message: string;
  alert_type: string;
}

function alertIcon(type: string) {
  if (type === "warning") return <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />;
  if (type === "success")  return <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />;
  return <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />;
}
function alertColors(type: string) {
  if (type === "warning") return "bg-amber-50 border-amber-200";
  if (type === "success")  return "bg-emerald-50 border-emerald-200";
  return "bg-blue-50 border-blue-200";
}

function DashboardLayout() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [session, setSession]             = useState<Session | null>(null);
  const [alerts, setAlerts]               = useState<Alert[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile]     = useState(false);
  const profileRef  = useRef<HTMLDivElement>(null);
  const notifRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw   = sessionStorage.getItem("apfcu_session");
    const token = sessionStorage.getItem("apfcu_token");
    if (!raw || !token) { navigate({ to: "/login" }); return; }

    const parsed: Session = JSON.parse(raw);

    fetch("/api/auth/verify", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) {
          sessionStorage.removeItem("apfcu_session");
          sessionStorage.removeItem("apfcu_token");
          navigate({ to: "/login" });
          return;
        }
        if (!parsed.loginId && parsed.referenceNumber) {
          fetch(`/api/session/repair?ref=${encodeURIComponent(parsed.referenceNumber)}`)
            .then(r => r.json())
            .then(fresh => {
              const s = fresh.loginId ? { ...parsed, loginId: fresh.loginId } : parsed;
              sessionStorage.setItem("apfcu_session", JSON.stringify(s));
              setSession(s);
            })
            .catch(() => setSession(parsed));
        } else {
          setSession(parsed);
        }
      })
      .catch(() => setSession(parsed));
  }, [navigate]);

  // Fetch alerts for notification bell
  useEffect(() => {
    if (!session?.loginId) return;
    const token = sessionStorage.getItem("apfcu_token") || "";
    fetch(`/api/member/${session.loginId}/account`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setAlerts(d.alerts ?? []))
      .catch(() => {});
  }, [session]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem("apfcu_session");
    sessionStorage.removeItem("apfcu_token");
    setShowProfile(false);
    navigate({ to: "/login" });
  };

  if (!session) return null;

  const initials     = `${session.firstName[0]}${session.lastName[0]}`;
  const accountLabel = ACCOUNT_LABELS[session.accountType] ?? session.accountType;
  const unreadCount  = alerts.length;

  return (
    <div className="min-h-screen bg-[#f2f4f5] flex flex-col">

      {/* ── Header ─────────────────────────────── */}
      <header className="bg-white sticky top-0 z-40 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="container-x flex items-center justify-between h-16">
          <Logo />
          <span className="hidden md:block text-[13px] text-ink/40 font-medium">Secure Online Banking</span>

          <div className="flex items-center gap-1">

            {/* ── Notification Bell ── */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotifications(v => !v); setShowProfile(false); }}
                className="relative p-2.5 text-ink/40 hover:text-brand-green hover:bg-secondary transition-colors rounded"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-border shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-brand-green" />
                      <span className="text-[13px] font-bold text-ink">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="bg-brand-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <button onClick={() => setShowNotifications(false)} className="text-ink/30 hover:text-ink transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="max-h-[340px] overflow-y-auto">
                    {alerts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-2 text-ink/30">
                        <Bell className="w-7 h-7 opacity-30" />
                        <p className="text-[13px]">No new notifications</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {alerts.map(a => (
                          <div key={a.id} className={`px-4 py-3.5 ${alertColors(a.alert_type)}`}>
                            <div className="flex items-start gap-2.5">
                              {alertIcon(a.alert_type)}
                              <div className="min-w-0">
                                <p className="text-[13px] font-semibold text-ink leading-snug">{a.title}</p>
                                <p className="text-[12px] text-ink/60 mt-0.5 leading-relaxed">{a.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-2.5 border-t border-border bg-secondary/40">
                    <p className="text-[11px] text-ink/35 text-center">Alerts are managed by your branch</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Profile Button ── */}
            <div className="relative ml-1" ref={profileRef}>
              <button
                onClick={() => { setShowProfile(v => !v); setShowNotifications(false); }}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-1.5 rounded transition-colors",
                  showProfile ? "bg-secondary" : "hover:bg-secondary"
                )}
              >
                <div className="w-7 h-7 bg-brand-green text-white font-bold text-xs flex items-center justify-center rounded-full shrink-0">
                  {initials}
                </div>
                <span className="hidden sm:block text-[13px] font-semibold text-ink">
                  {session.firstName} {session.lastName}
                </span>
                <ChevronRight className={`hidden sm:block w-3 h-3 text-ink/30 transition-transform ${showProfile ? "rotate-90" : ""}`} />
              </button>

              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-border shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">

                  {/* Profile header */}
                  <div className="px-5 py-4 bg-brand-green text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 border border-white/30 text-white font-bold text-sm flex items-center justify-center rounded-full shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[14px] leading-tight truncate">
                          {session.firstName} {session.lastName}
                        </p>
                        <p className="text-white/65 text-[11px] truncate mt-0.5">{session.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account info */}
                  <div className="px-5 py-3 border-b border-border space-y-2.5">
                    <div className="flex items-center gap-2.5 text-[12px]">
                      <CardIcon className="w-3.5 h-3.5 text-ink/35 shrink-0" />
                      <span className="text-ink/50">Account</span>
                      <span className="ml-auto font-semibold text-ink truncate">{accountLabel}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[12px]">
                      <Mail className="w-3.5 h-3.5 text-ink/35 shrink-0" />
                      <span className="text-ink/50">Email</span>
                      <span className="ml-auto font-semibold text-ink truncate">{session.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[12px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-ink/35 shrink-0" />
                      <span className="text-ink/50">Member #</span>
                      <span className="ml-auto font-mono text-[11px] text-ink">{session.referenceNumber}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="py-1.5">
                    <Link
                      to="/dashboard/profile"
                      search={{ tab: "security" } as never}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-[13px] text-ink/65 hover:bg-secondary hover:text-ink transition-colors"
                      onClick={() => setShowProfile(false)}
                    >
                      <Settings className="w-3.5 h-3.5 shrink-0" />
                      Account Settings
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-[13px] text-ink/65 hover:bg-secondary hover:text-ink transition-colors"
                      onClick={() => setShowProfile(false)}
                    >
                      <User className="w-3.5 h-3.5 shrink-0" />
                      Update Contact Info
                    </Link>
                    <Link
                      to="/contact-us"
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-[13px] text-ink/65 hover:bg-secondary hover:text-ink transition-colors"
                      onClick={() => setShowProfile(false)}
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      Contact Support
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-border px-5 py-2.5">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 py-2 text-[13px] font-semibold text-red-500 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 shrink-0" />
                      Sign Out
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>

        {/* Green bar */}
        <div className="h-[3px] bg-brand-green" />

        {/* Tab nav */}
        <div className="bg-white border-b border-border overflow-x-auto">
          <div className="container-x flex items-center">
            {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
              const active = exact
                ? location.pathname === href
                : location.pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-[13px] font-semibold border-b-2 whitespace-nowrap transition-colors shrink-0",
                    active
                      ? "border-brand-green text-brand-green"
                      : "border-transparent text-ink/55 hover:text-ink hover:border-border"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Page content ───────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      <ChatWidget session={session} />

      {/* ── Footer strip ───────────────────────── */}
      <footer className="bg-white border-t border-border mt-auto">
        <div className="container-x py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-ink/45 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="tel:5123026800" className="flex items-center gap-1 hover:text-brand-green transition-colors">
              <Phone className="w-3 h-3" /> (512) 302-6800
            </a>
            <Link to="/locations" className="flex items-center gap-1 hover:text-brand-green transition-colors">
              <MapPin className="w-3 h-3" /> Locations
            </Link>
            <span>Routing #314977104</span>
            <span className="font-semibold">Equal Housing Lender</span>
            <a href="#" className="text-brand-green hover:underline underline-offset-4">Insured by NCUA</a>
          </div>
          <span>© {new Date().getFullYear()} A+ Federal Credit Union</span>
        </div>
      </footer>
    </div>
  );
}
