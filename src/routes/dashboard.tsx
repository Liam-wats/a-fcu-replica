import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight, ArrowLeftRight, FileText, Smartphone, CreditCard,
  Bell, ChevronRight, LogOut, Eye, EyeOff, TrendingUp,
  ShieldCheck, HelpCircle, MapPin, Phone, ExternalLink,
  Download, CheckCircle2, AlertCircle, Lock,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

interface Session {
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  referenceNumber: string;
}

const ACCOUNT_LABELS: Record<string, string> = {
  "cash-back-checking": "Cash-Back Checking",
  "free-checking": "Free Checking",
  "regular-savings": "Regular Savings",
  "money-market": "Money Market Savings",
};

const ACCOUNT_NUMBERS: Record<string, string> = {
  "cash-back-checking": "••••  ••••  4821",
  "free-checking": "••••  ••••  3304",
  "regular-savings": "••••  ••••  7719",
  "money-market": "••••  ••••  0256",
};

const BALANCES: Record<string, { available: string; current: string }> = {
  "cash-back-checking": { available: "$3,241.87", current: "$3,241.87" },
  "free-checking": { available: "$1,108.42", current: "$1,108.42" },
  "regular-savings": { available: "$8,500.00", current: "$8,500.00" },
  "money-market": { available: "$14,220.55", current: "$14,220.55" },
};

const TRANSACTIONS = [
  { id: 1, date: "May 10", desc: "HEB Grocery", category: "Shopping", amount: "-$67.43", debit: true },
  { id: 2, date: "May 09", desc: "Direct Deposit – Payroll", category: "Income", amount: "+$2,100.00", debit: false },
  { id: 3, date: "May 08", desc: "Netflix", category: "Entertainment", amount: "-$15.99", debit: true },
  { id: 4, date: "May 07", desc: "Shell Gas Station", category: "Transportation", amount: "-$54.20", debit: true },
  { id: 5, date: "May 06", desc: "Chick-fil-A", category: "Dining", amount: "-$12.87", debit: true },
  { id: 6, date: "May 05", desc: "A+FCU Transfer In", category: "Transfer", amount: "+$500.00", debit: false },
  { id: 7, date: "May 04", desc: "Amazon.com", category: "Shopping", amount: "-$38.99", debit: true },
  { id: 8, date: "May 03", desc: "AT&T Wireless", category: "Utilities", amount: "-$95.00", debit: true },
];

const QUICK_ACTIONS = [
  { icon: ArrowLeftRight, label: "Transfer\nFunds", href: "#" },
  { icon: CreditCard, label: "Pay\nBills", href: "#" },
  { icon: Smartphone, label: "Mobile\nDeposit", href: "#" },
  { icon: FileText, label: "e\nStatements", href: "#" },
  { icon: Download, label: "Order\nChecks", href: "#" },
];

function DashboardPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const raw = sessionStorage.getItem("apfcu_session");
    if (!raw) {
      navigate({ to: "/login" });
      return;
    }
    setSession(JSON.parse(raw));

    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");
  }, [navigate]);

  const handleSignOut = () => {
    sessionStorage.removeItem("apfcu_session");
    navigate({ to: "/" });
  };

  if (!session) return null;

  const accountLabel = ACCOUNT_LABELS[session.accountType] ?? session.accountType;
  const accountNumber = ACCOUNT_NUMBERS[session.accountType] ?? "••••  ••••  0000";
  const balance = BALANCES[session.accountType] ?? { available: "$0.00", current: "$0.00" };
  const isChecking = session.accountType.includes("checking");

  return (
    <div className="min-h-screen bg-[#f2f4f5] flex flex-col">

      {/* ── TOP HEADER ─────────────────────────────────────────────── */}
      <header className="bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)] sticky top-0 z-40">

        {/* Utility bar */}
        <div className="bg-[#f2f4f5] border-b border-border">
          <div className="container-x flex items-center justify-between h-9 text-[13px]">
            <div className="hidden md:flex items-center gap-5">
              <a href="tel:5123026800" className="flex items-center gap-1.5 text-ink/70 hover:text-brand-green transition-colors">
                <Phone className="w-3 h-3" /> (512) 302-6800
              </a>
              <Link to="/locations" className="flex items-center gap-1.5 text-ink/70 hover:text-brand-green transition-colors">
                <MapPin className="w-3 h-3" /> Locations & ATMs
              </Link>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <button className="flex items-center gap-1.5 text-ink/70 hover:text-brand-green transition-colors relative">
                <Bell className="w-3.5 h-3.5" />
                <span>Alerts</span>
                <span className="absolute -top-0.5 -right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button onClick={handleSignOut} className="flex items-center gap-1.5 text-ink/70 hover:text-brand-green transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main nav bar */}
        <div className="container-x flex items-center justify-between h-20">
          <Link to="/">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-[15px] font-semibold">
            {[
              { label: "Accounts", href: "/accounts" },
              { label: "Transfers", href: "#" },
              { label: "Payments", href: "#" },
              { label: "Services", href: "/services" },
            ].map(({ label, href }) => (
              <Link key={label} to={href} className="text-ink hover:text-brand-green transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-[13px] font-semibold text-ink leading-none">{session.firstName} {session.lastName}</p>
              <p className="text-[11px] text-ink/50 mt-0.5">{accountLabel}</p>
            </div>
            <div className="w-9 h-9 bg-brand-green text-white font-bold text-sm flex items-center justify-center rounded-full">
              {session.firstName[0]}{session.lastName[0]}
            </div>
          </div>
        </div>

        {/* Brand green accent bar */}
        <div className="h-[3px] bg-brand-green" />
      </header>

      {/* ── WELCOME BANNER ──────────────────────────────────────────── */}
      <div className="bg-brand-green text-white">
        <div className="container-x py-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/70 text-sm">{greeting},</p>
            <h1 className="font-serif text-2xl md:text-3xl mt-0.5">
              {session.firstName} {session.lastName}
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-2 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-white/80" />
            <span>Secured Session</span>
            <Lock className="w-3 h-3 text-white/60 ml-1" />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <main className="container-x py-8 flex-1 grid lg:grid-cols-[1fr_320px] gap-6">

        {/* LEFT COLUMN */}
        <div className="space-y-6 min-w-0">

          {/* Account Summary Card */}
          <div className="bg-white border border-border shadow-sm">

            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40">Primary Account</p>
                <h2 className="font-serif text-xl text-ink mt-0.5">{accountLabel}</h2>
              </div>
              <span className="text-[11px] font-semibold bg-brand-green/10 text-brand-green px-2.5 py-1 border border-brand-green/20">
                {isChecking ? "Checking" : "Savings"}
              </span>
            </div>

            {/* Balance display */}
            <div className="px-6 py-6 grid sm:grid-cols-3 gap-6 border-b border-border">
              <div>
                <p className="text-[11px] text-ink/50 font-semibold uppercase tracking-wide mb-1">Available Balance</p>
                <div className="flex items-center gap-2">
                  <p className="font-serif text-3xl text-ink font-semibold">
                    {showBalance ? balance.available : "••••••"}
                  </p>
                  <button
                    onClick={() => setShowBalance((v) => !v)}
                    className="text-ink/30 hover:text-ink/60 transition-colors"
                    aria-label="Toggle balance visibility"
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-ink/50 font-semibold uppercase tracking-wide mb-1">Current Balance</p>
                <p className="font-serif text-3xl text-ink font-semibold">
                  {showBalance ? balance.current : "••••••"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-ink/50 font-semibold uppercase tracking-wide mb-1">Account Number</p>
                <p className="font-mono text-base text-ink tracking-widest mt-2">{accountNumber}</p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="px-6 py-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40 mb-4">Quick Actions</p>
              <div className="flex flex-wrap gap-3">
                {QUICK_ACTIONS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="group flex flex-col items-center gap-2 w-[80px] text-center"
                  >
                    <div className="w-12 h-12 bg-secondary border border-border flex items-center justify-center group-hover:bg-brand-green group-hover:border-brand-green transition-all">
                      <Icon className="w-5 h-5 text-ink/60 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[11px] font-semibold text-ink/60 group-hover:text-brand-green leading-tight transition-colors whitespace-pre-line text-center">
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white border border-border shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40">Recent Activity</p>
                <h2 className="font-serif text-xl text-ink mt-0.5">{accountLabel}</h2>
              </div>
              <a href="#" className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-green hover:underline underline-offset-4">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="divide-y divide-border">
              {TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 flex items-center justify-center text-xs font-bold border ${
                      tx.debit
                        ? "bg-red-50 border-red-100 text-red-500"
                        : "bg-emerald-50 border-emerald-100 text-emerald-600"
                    }`}>
                      {tx.debit ? "−" : "+"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{tx.desc}</p>
                      <p className="text-[11px] text-ink/45">{tx.category} · {tx.date}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold tabular-nums ${tx.debit ? "text-ink" : "text-emerald-600"}`}>
                    {tx.amount}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-border bg-secondary/30">
              <a href="#" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-green hover:underline underline-offset-4">
                <FileText className="w-3.5 h-3.5" /> Download Statement
              </a>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-5">

          {/* Alert */}
          <div className="bg-brand-yellow/20 border border-brand-yellow/50 px-4 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-ink/60 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-ink">E-Statement Ready</p>
                <p className="text-[12px] text-ink/60 mt-0.5 leading-relaxed">Your April statement is available to view and download.</p>
                <a href="#" className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-brand-green hover:underline underline-offset-4">
                  View Statement <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Rates / Promo card */}
          <div className="bg-brand-green text-white p-5">
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest">Limited-Time Offer</p>
            <h3 className="font-serif text-xl mt-1 leading-snug">Low-rate auto loans starting at <span className="text-brand-yellow">4.99% APR</span></h3>
            <p className="text-white/70 text-[13px] mt-2 leading-relaxed">
              Finance your next vehicle with competitive rates and flexible terms.
            </p>
            <Link to="/loans/vehicle-loans" className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-yellow hover:opacity-80 transition-opacity">
              Apply Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Spend summary */}
          <div className="bg-white border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-brand-green" />
              <p className="text-[13px] font-bold text-ink">May Spending</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Shopping", pct: 65, amount: "$106.42" },
                { label: "Dining", pct: 22, amount: "$12.87" },
                { label: "Transport", pct: 30, amount: "$54.20" },
                { label: "Entertainment", pct: 18, amount: "$15.99" },
              ].map(({ label, pct, amount }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-ink/70">{label}</span>
                    <span className="text-[12px] font-semibold text-ink">{amount}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Membership Status */}
          <div className="bg-white border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <p className="text-[13px] font-bold text-ink">Membership Status</p>
            </div>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-ink/60">Member since</span>
                <span className="font-semibold text-ink">2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Reference #</span>
                <span className="font-mono text-[11px] text-ink">{session.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Status</span>
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
              <a href="tel:5123026800" className="flex items-center gap-2 text-ink/70 hover:text-brand-green transition-colors">
                <Phone className="w-3.5 h-3.5" /> (512) 302-6800
              </a>
              <Link to="/locations" className="flex items-center gap-2 text-ink/70 hover:text-brand-green transition-colors">
                <MapPin className="w-3.5 h-3.5" /> Find a Branch or ATM
              </Link>
              <a href="#" className="flex items-center gap-2 text-ink/70 hover:text-brand-green transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Live Chat Support
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* ── FOOTER STRIP ─────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-border mt-auto">
        <div className="container-x py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-ink/50">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span>Routing #314977104</span>
            <span className="hidden md:inline">|</span>
            <span className="font-semibold">Equal Housing Lender</span>
            <span className="hidden md:inline">|</span>
            <span>NMLS #405608</span>
            <span className="hidden md:inline">|</span>
            <a href="#" className="text-brand-green hover:underline underline-offset-4">Insured by NCUA</a>
          </div>
          <span>© {new Date().getFullYear()} A+ Federal Credit Union</span>
        </div>
      </footer>

    </div>
  );
}
