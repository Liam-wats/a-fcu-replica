import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import {
  ArrowLeftRight, CreditCard, Smartphone, FileText, BookCheck,
  Eye, EyeOff, TrendingUp, ShieldCheck, HelpCircle,
  MapPin, Phone, ExternalLink, ChevronRight, AlertCircle,
  CheckCircle2, Loader2, RefreshCw,
} from "lucide-react";
import type { Session } from "@/routes/dashboard";
import { ACCOUNT_LABELS } from "@/routes/dashboard";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

interface AccountData {
  balance: { available: number; current: number };
  transactions: {
    id: number; txn_date: string; description: string;
    category: string; amount: number; txn_type: string;
  }[];
  alerts: { id: number; title: string; message: string; alert_type: string }[];
}

const QUICK_ACTIONS = [
  { icon: ArrowLeftRight, label: "Transfer\nFunds",    href: "/dashboard/transfer" },
  { icon: CreditCard,     label: "Pay\nBills",         href: "/dashboard/bills" },
  { icon: Smartphone,     label: "Mobile\nDeposit",    href: "/dashboard/deposit" },
  { icon: FileText,       label: "e\nStatements",      href: "/dashboard/statements" },
  { icon: BookCheck,      label: "Order\nChecks",      href: "/dashboard/checks" },
];

const ACCOUNT_NUMBERS: Record<string, string> = {
  "cash-back-checking": "••••  ••••  4821",
  "free-checking":      "••••  ••••  3304",
  "regular-savings":    "••••  ••••  7719",
  "money-market":       "••••  ••••  0256",
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function DashboardOverview() {
  const [session, setSession] = useState<Session | null>(null);
  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");

    const raw = sessionStorage.getItem("apfcu_session");
    if (!raw) return;
    const parsed: Session = JSON.parse(raw);

    // Session is missing loginId (logged in before server update) — repair it silently
    if (!parsed.loginId && parsed.referenceNumber) {
      fetch(`/api/session/repair?ref=${encodeURIComponent(parsed.referenceNumber)}`)
        .then(r => r.json())
        .then(fresh => {
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
  }, []);

  const fetchData = useCallback(async (loginId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/member/${loginId}/account`);
      const json = await res.json();
      setData(json);
      setLastRefreshed(new Date());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  const handleRefresh = useCallback(async () => {
    if (!session?.loginId || refreshing) return;
    setRefreshing(true);
    try {
      const res = await fetch(`/api/member/${session.loginId}/account`);
      const json = await res.json();
      setData(json);
      setLastRefreshed(new Date());
    } catch { /* silent */ }
    finally { setRefreshing(false); }
  }, [session, refreshing]);

  useEffect(() => {
    if (session?.loginId) fetchData(session.loginId);
    else if (session) setLoading(false);
  }, [session, fetchData]);

  if (!session) return null;

  const accountLabel  = ACCOUNT_LABELS[session.accountType] ?? session.accountType;
  const accountNumber = ACCOUNT_NUMBERS[session.accountType] ?? "••••  ••••  0000";
  const isChecking    = session.accountType.includes("checking");
  const available     = data?.balance.available ?? 0;
  const current       = data?.balance.current ?? 0;

  const spendMap: Record<string, number> = {};
  (data?.transactions ?? []).filter(t => t.txn_type === "debit").forEach(t => {
    spendMap[t.category] = (spendMap[t.category] ?? 0) + Math.abs(t.amount);
  });
  const spendEntries = Object.entries(spendMap).slice(0, 4);
  const maxSpend = Math.max(...spendEntries.map(([, v]) => v), 1);

  return (
    <div className="container-x py-8 grid lg:grid-cols-[1fr_308px] gap-6">

      {/* LEFT */}
      <div className="space-y-6 min-w-0">

        {/* Welcome */}
        <div className="bg-brand-green text-white px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/60 text-[13px]">{greeting},</p>
            <h1 className="font-serif text-2xl mt-0.5">{session.firstName} {session.lastName}</h1>
          </div>
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-white/70" />
            Secured Session
          </div>
        </div>

        {/* Account card */}
        <div className="bg-white border border-border shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink/35">Primary Account</p>
              <h2 className="font-serif text-xl text-ink mt-0.5">{accountLabel}</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                title="Refresh balance"
                className="flex items-center gap-1.5 text-[12px] font-semibold text-ink/45 hover:text-brand-green disabled:opacity-40 transition-colors group"
              >
                <RefreshCw className={`w-3.5 h-3.5 transition-transform ${refreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                {lastRefreshed
                  ? <span className="hidden sm:inline">Updated {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  : <span className="hidden sm:inline">Refresh</span>
                }
              </button>
              <span className="text-[11px] font-semibold bg-brand-green/10 text-brand-green px-2.5 py-1 border border-brand-green/20">
                {isChecking ? "Checking" : "Savings"}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-24 gap-2 text-sm text-ink/40">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading account…
            </div>
          ) : (
            <div className="px-6 py-5 grid sm:grid-cols-3 gap-6 border-b border-border">
              <div>
                <p className="text-[11px] text-ink/45 font-semibold uppercase tracking-wide mb-1">Available Balance</p>
                <div className="flex items-center gap-2">
                  <p className="font-serif text-3xl text-ink font-semibold">
                    {showBalance ? fmt(available) : "••••••"}
                  </p>
                  <button onClick={() => setShowBalance(v => !v)} className="text-ink/25 hover:text-ink/60 transition-colors">
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-ink/45 font-semibold uppercase tracking-wide mb-1">Current Balance</p>
                <p className="font-serif text-3xl text-ink font-semibold">
                  {showBalance ? fmt(current) : "••••••"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-ink/45 font-semibold uppercase tracking-wide mb-1">Account Number</p>
                <p className="font-mono text-base text-ink tracking-widest mt-2">{accountNumber}</p>
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="px-6 py-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink/35 mb-4">Quick Actions</p>
            <div className="flex flex-wrap gap-3">
              {QUICK_ACTIONS.map(({ icon: Icon, label, href }) => (
                <Link
                  key={href}
                  to={href}
                  className="group flex flex-col items-center gap-2 w-[76px] text-center"
                >
                  <div className="w-12 h-12 bg-secondary border border-border flex items-center justify-center group-hover:bg-brand-green group-hover:border-brand-green transition-all">
                    <Icon className="w-5 h-5 text-ink/50 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-semibold text-ink/55 group-hover:text-brand-green leading-tight transition-colors whitespace-pre-line">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white border border-border shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink/35">Recent Activity</p>
              <h2 className="font-serif text-xl text-ink mt-0.5">{accountLabel}</h2>
            </div>
            <Link to="/dashboard/statements" className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-green hover:underline underline-offset-4">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-24 gap-2 text-sm text-ink/40">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : (data?.transactions ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-ink/35">
              <FileText className="w-8 h-8 opacity-40" />
              <p className="text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {(data?.transactions ?? []).slice(0, 8).map(tx => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 flex items-center justify-center text-xs font-bold border shrink-0 ${
                      tx.txn_type === "debit"
                        ? "bg-red-50 border-red-100 text-red-500"
                        : "bg-emerald-50 border-emerald-100 text-emerald-600"
                    }`}>
                      {tx.txn_type === "debit" ? "−" : "+"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{tx.description}</p>
                      <p className="text-[11px] text-ink/40">{tx.category} · {tx.txn_date}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold tabular-nums shrink-0 ${tx.txn_type === "debit" ? "text-ink" : "text-emerald-600"}`}>
                    {tx.txn_type === "debit" ? "−" : "+"}{fmt(Math.abs(tx.amount))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="space-y-5">

        {/* Alerts */}
        {(data?.alerts ?? []).length > 0 && (data?.alerts ?? []).map(alert => (
          <div key={alert.id} className={`border px-4 py-4 ${
            alert.alert_type === "warning" ? "bg-brand-yellow/15 border-brand-yellow/40" :
            alert.alert_type === "success" ? "bg-emerald-50 border-emerald-200" :
            "bg-blue-50 border-blue-200"
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-ink/50 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-ink">{alert.title}</p>
                <p className="text-[12px] text-ink/60 mt-0.5 leading-relaxed">{alert.message}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Promo */}
        <div className="bg-brand-green text-white p-5">
          <p className="text-white/55 text-[11px] font-bold uppercase tracking-widest">Limited-Time Offer</p>
          <h3 className="font-serif text-xl mt-1 leading-snug">
            Auto loans starting at <span className="text-brand-yellow">4.99% APR</span>
          </h3>
          <p className="text-white/65 text-[13px] mt-2 leading-relaxed">
            Competitive rates and flexible terms on your next vehicle.
          </p>
          <Link to="/loans/vehicle-loans" className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-yellow hover:opacity-80 transition-opacity">
            Apply Now <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Spending */}
        {spendEntries.length > 0 && (
          <div className="bg-white border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-brand-green" />
              <p className="text-[13px] font-bold text-ink">Spending Summary</p>
            </div>
            <div className="space-y-3">
              {spendEntries.map(([cat, amt]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-ink/65">{cat}</span>
                    <span className="text-[12px] font-semibold text-ink">{fmt(amt)}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green rounded-full" style={{ width: `${(amt / maxSpend) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Membership Status */}
        <div className="bg-white border border-border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <p className="text-[13px] font-bold text-ink">Membership Status</p>
          </div>
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="text-ink/55">Member since</span>
              <span className="font-semibold text-ink">2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/55">Reference #</span>
              <span className="font-mono text-[11px] text-ink">{session.referenceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/55">Status</span>
              <span className="text-emerald-600 font-semibold">Active</span>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="bg-white border border-border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-brand-green" />
            <p className="text-[13px] font-bold text-ink">Need Help?</p>
          </div>
          <div className="space-y-2.5 text-[13px]">
            <a href="tel:5123026800" className="flex items-center gap-2 text-ink/60 hover:text-brand-green transition-colors">
              <Phone className="w-3.5 h-3.5" /> (512) 302-6800
            </a>
            <Link to="/locations" className="flex items-center gap-2 text-ink/60 hover:text-brand-green transition-colors">
              <MapPin className="w-3.5 h-3.5" /> Find a Branch or ATM
            </Link>
            <a href="#" className="flex items-center gap-2 text-ink/60 hover:text-brand-green transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Live Chat Support
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
