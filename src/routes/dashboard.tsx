import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LogOut, Bell, Home, ArrowLeftRight, CreditCard,
  Smartphone, FileText, BookCheck, Phone, MapPin,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

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
  "free-checking": "Free Checking",
  "regular-savings": "Regular Savings",
  "money-market": "Money Market Savings",
};

const NAV_ITEMS = [
  { label: "Overview",    href: "/dashboard",            icon: Home,          exact: true },
  { label: "Transfer",    href: "/dashboard/transfer",   icon: ArrowLeftRight, exact: false },
  { label: "Pay Bills",   href: "/dashboard/bills",      icon: CreditCard,    exact: false },
  { label: "Deposit",     href: "/dashboard/deposit",    icon: Smartphone,    exact: false },
  { label: "Statements",  href: "/dashboard/statements", icon: FileText,      exact: false },
  { label: "Order Checks",href: "/dashboard/checks",     icon: BookCheck,     exact: false },
];

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("apfcu_session");
    const token = sessionStorage.getItem("apfcu_token");

    if (!raw || !token) {
      navigate({ to: "/login" });
      return;
    }

    const parsed: Session = JSON.parse(raw);

    // Verify token with the server
    fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (!res.ok) {
        sessionStorage.removeItem("apfcu_session");
        sessionStorage.removeItem("apfcu_token");
        navigate({ to: "/login" });
        return;
      }
      // Session is missing loginId — repair it silently
      if (!parsed.loginId && parsed.referenceNumber) {
        fetch(`/api/session/repair?ref=${encodeURIComponent(parsed.referenceNumber)}`)
          .then((r) => r.json())
          .then((fresh) => {
            if (fresh.loginId) {
              const repaired = { ...parsed, loginId: fresh.loginId };
              sessionStorage.setItem("apfcu_session", JSON.stringify(repaired));
              setSession(repaired);
            } else {
              setSession(parsed);
            }
          })
          .catch(() => setSession(parsed));
      } else {
        setSession(parsed);
      }
    }).catch(() => {
      // Network error — allow session to continue using local data
      setSession(parsed);
    });
  }, [navigate]);

  const handleSignOut = () => {
    sessionStorage.removeItem("apfcu_session");
    sessionStorage.removeItem("apfcu_token");
    navigate({ to: "/" });
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#f2f4f5] flex flex-col">

      {/* ── Header ─────────────────────────────── */}
      <header className="bg-white sticky top-0 z-40 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="container-x flex items-center justify-between h-16">
          <Logo />

          <span className="hidden md:block text-[13px] text-ink/40 font-medium">Secure Online Banking</span>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-ink/40 hover:text-brand-green transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-brand-green text-white font-bold text-xs flex items-center justify-center rounded-full shrink-0">
                {session.firstName[0]}{session.lastName[0]}
              </div>
              <span className="hidden sm:block text-[13px] font-semibold text-ink">
                {session.firstName} {session.lastName}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-[13px] text-ink/50 hover:text-brand-green transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Sign Out</span>
            </button>
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
