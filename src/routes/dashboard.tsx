import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  LogOut, CreditCard, Landmark, Activity, TrendingUp,
  ArrowUpRight, ArrowDownLeft, ChevronRight,
  Home, Car, GraduationCap, Briefcase, AlertTriangle,
  DollarSign, Calendar, CheckCircle2, ShieldCheck,
  Bell, Hash,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { getAdminUser, type AdminUser, type AdminAccount, type AdminLoan } from "@/data/admin-users";
import { getMemberSession, clearMemberSession } from "@/lib/session";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "My Account — A+ Federal Credit Union" }],
  }),
  component: DashboardPage,
});

function fmtCurrency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const LOAN_ICONS: Record<string, React.ElementType> = {
  Mortgage: Home, Auto: Car, Personal: DollarSign,
  Student: GraduationCap, "Credit Card": CreditCard, HELOC: Briefcase,
};

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

type Tab = "overview" | "accounts" | "loans" | "transactions";

function AccountCard({ acct }: { acct: AdminAccount }) {
  const typeColors: Record<string, string> = {
    Checking: "bg-brand-green",
    Savings: "bg-brand-green-dark",
    "Money Market": "bg-brand-green-darker",
    Certificate: "bg-ink",
    IRA: "bg-ink",
  };
  const bg = typeColors[acct.type] ?? "bg-brand-green";

  return (
    <div className="bg-white border border-border hover:shadow-md transition-shadow">
      <div className={`${bg} px-5 py-3 flex items-center justify-between`}>
        <span className="text-white text-xs font-semibold uppercase tracking-wider">{acct.type}</span>
        <Landmark className="w-4 h-4 text-white/60" />
      </div>
      <div className="p-5">
        <p className="font-semibold text-ink text-sm">{acct.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5 font-mono">{acct.accountNumber}</p>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-2xl font-serif font-semibold text-ink">{fmtCurrency(acct.balance)}</p>
          <p className="text-xs text-muted-foreground mt-1">Current balance</p>
          {acct.availableBalance !== acct.balance && (
            <p className="text-xs text-ink/60 mt-0.5">
              Available: <span className="font-medium text-ink">{fmtCurrency(acct.availableBalance)}</span>
            </p>
          )}
        </div>
        {acct.apy > 0 && (
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Annual Percentage Yield</span>
            <span className="text-sm font-bold text-brand-green">{acct.apy.toFixed(2)}% APY</span>
          </div>
        )}
        {acct.openDate && (
          <p className="text-xs text-muted-foreground mt-2">Opened {fmtDate(acct.openDate)}</p>
        )}
      </div>
    </div>
  );
}

function LoanCard({ loan }: { loan: AdminLoan }) {
  const Icon = LOAN_ICONS[loan.type] ?? CreditCard;
  const pct = loan.originalAmount > 0
    ? Math.min(100, Math.round(((loan.originalAmount - loan.balance) / loan.originalAmount) * 100))
    : 0;
  const due = daysUntil(loan.nextDueDate);
  const overdue = due < 0;
  const soon = due >= 0 && due <= 7;

  return (
    <div className="bg-white border border-border hover:shadow-md transition-shadow">
      <div className="bg-ink px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-white/70" />
          <span className="text-white text-xs font-semibold uppercase tracking-wider">{loan.type}</span>
        </div>
        {(overdue || soon) && (
          <span className={`text-xs font-semibold px-2 py-0.5 ${overdue ? "bg-red-500 text-white" : "bg-brand-yellow text-ink"}`}>
            {overdue ? "OVERDUE" : "DUE SOON"}
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="font-semibold text-ink text-sm">{loan.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5 font-mono">{loan.accountNumber}</p>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-2xl font-serif font-semibold text-ink">{fmtCurrency(loan.balance)}</p>
          <p className="text-xs text-muted-foreground mt-1">Remaining balance of {fmtCurrency(loan.originalAmount)}</p>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{pct}% paid off</span>
            <span>{loan.rate.toFixed(2)}% APR</span>
          </div>
          <div className="h-1.5 bg-border overflow-hidden">
            <div
              className="h-full bg-brand-green transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className={`mt-4 pt-4 border-t border-border flex items-start gap-2 text-xs ${overdue ? "text-red-600" : soon ? "text-amber-700" : "text-muted-foreground"}`}>
          <Calendar className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            Next payment of {fmtCurrency(loan.monthlyPayment)} due{" "}
            {new Date(loan.nextDueDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
            {loan.term && <> · {loan.term}</>}
          </span>
        </div>
      </div>
    </div>
  );
}

function TransactionTable({ user, limit }: { user: AdminUser; limit?: number }) {
  const txns = limit ? user.transactions.slice(0, limit) : user.transactions;
  return (
    <div className="bg-white border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-brand-cream">
            <th className="text-left px-5 py-3 text-xs uppercase tracking-[0.12em] font-semibold text-muted-foreground">Date</th>
            <th className="text-left px-5 py-3 text-xs uppercase tracking-[0.12em] font-semibold text-muted-foreground">Description</th>
            <th className="text-left px-5 py-3 text-xs uppercase tracking-[0.12em] font-semibold text-muted-foreground hidden md:table-cell">Account</th>
            <th className="text-right px-5 py-3 text-xs uppercase tracking-[0.12em] font-semibold text-muted-foreground">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {txns.map((tx) => {
            const acct = user.accounts.find((a) => a.id === tx.accountId);
            return (
              <tr key={tx.id} className="hover:bg-brand-cream/50 transition-colors">
                <td className="px-5 py-3.5 text-ink/70 whitespace-nowrap">{fmtDate(tx.date)}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 flex items-center justify-center shrink-0 ${tx.type === "credit" ? "bg-brand-green" : "bg-border"}`}>
                      {tx.type === "credit"
                        ? <ArrowDownLeft className="w-3.5 h-3.5 text-white" />
                        : <ArrowUpRight className="w-3.5 h-3.5 text-ink/50" />}
                    </div>
                    <span className="font-medium text-ink text-sm">{tx.description}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell text-xs">
                  {acct ? `${acct.name} ${acct.accountNumber}` : "—"}
                </td>
                <td className={`px-5 py-3.5 text-right font-semibold font-mono ${tx.type === "credit" ? "text-brand-green" : "text-ink"}`}>
                  {tx.type === "credit" ? "+" : "−"}{fmtCurrency(tx.amount)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    const id = getMemberSession();
    if (!id) { navigate({ to: "/login" }); return; }
    const found = getAdminUser(id);
    if (!found) { clearMemberSession(); navigate({ to: "/login" }); return; }
    setUser(found);
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const w = user.dashboardWidgets;
  const totalDeposits = user.accounts.reduce((s, a) => s + a.balance, 0);
  const totalLoans = user.loans.reduce((s, l) => s + l.balance, 0);
  const upcomingLoans = user.loans.filter((l) => { const d = daysUntil(l.nextDueDate); return d >= 0 && d <= 7; });

  const handleLogout = () => {
    clearMemberSession();
    navigate({ to: "/" });
  };

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "accounts", label: "My Accounts", icon: Landmark },
    { id: "loans", label: "My Loans", icon: CreditCard },
    { id: "transactions", label: "Transactions", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="container-x h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Logo />
            <div className="hidden md:block h-6 w-px bg-border" />
            <span className="hidden md:block text-sm font-semibold text-ink/60 uppercase tracking-widest">
              Online Banking
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-ink leading-tight">{user.name}</p>
              <p className="text-xs text-muted-foreground">Member #{user.memberNumber}</p>
            </div>
            <div className="w-9 h-9 bg-brand-green flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm leading-none">
                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-ink/60 hover:text-brand-green transition-colors border border-border px-3 py-2"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
            <button onClick={handleLogout} className="sm:hidden p-2 text-ink/60 hover:text-brand-green transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
      <div className="h-[3px] bg-brand-green" />

      <section className="bg-brand-yellow">
        <div className="container-x py-8 lg:py-12">
          <p className="text-sm uppercase tracking-[0.18em] font-semibold text-ink/60">
            Member since {new Date(user.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2 leading-snug">
            Welcome back, {user.name.split(" ")[0]}.
          </h1>
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-ink/70">
            <span className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> Member #{user.memberNumber}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure session active
            </span>
            <span className="flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5" />
              {user.accounts.length} account{user.accounts.length !== 1 ? "s" : ""},&nbsp;
              {user.loans.length} loan{user.loans.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      <div className="container-x py-8 flex-1">
        {w.showAlerts && upcomingLoans.length > 0 && (
          <div className="bg-white border border-amber-300 border-l-4 border-l-amber-500 px-5 py-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-ink text-sm">Upcoming loan payment{upcomingLoans.length > 1 ? "s" : ""}</p>
              {upcomingLoans.map((l) => (
                <p key={l.id} className="text-sm text-ink/70 mt-0.5">
                  {l.name} — {fmtCurrency(l.monthlyPayment)} due{" "}
                  {new Date(l.nextDueDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Deposits", value: fmtCurrency(totalDeposits), sub: `across ${user.accounts.length} accounts`, accent: false },
            { label: "Total Loans", value: fmtCurrency(totalLoans), sub: `${user.loans.length} active loans`, accent: false },
            { label: "Net Position", value: fmtCurrency(totalDeposits - totalLoans), sub: "deposits minus loans", accent: totalDeposits >= totalLoans },
            { label: "ABA Routing", value: "314977104", sub: "for wire & direct deposit", accent: false },
          ].map(({ label, value, sub, accent }) => (
            <div key={label} className="bg-white border border-border p-5">
              <p className="text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground mb-3">{label}</p>
              <p className={`text-xl font-serif font-semibold leading-tight ${accent ? "text-brand-green" : "text-ink"}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="border-b border-border mb-8">
          <nav className="flex gap-0 -mb-px overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  tab === id
                    ? "border-brand-green text-brand-green bg-white"
                    : "border-transparent text-muted-foreground hover:text-ink hover:border-border"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {tab === "overview" && (
          <div className="space-y-10">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl text-ink">Accounts</h2>
                <button onClick={() => setTab("accounts")} className="text-xs font-semibold text-brand-green hover:underline underline-offset-4 flex items-center gap-1">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {user.accounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No accounts on file.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.accounts.slice(0, 3).map((a) => <AccountCard key={a.id} acct={a} />)}
                </div>
              )}
            </section>

            {user.loans.length > 0 && w.showLoanProgress && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-2xl text-ink">Loans</h2>
                  <button onClick={() => setTab("loans")} className="text-xs font-semibold text-brand-green hover:underline underline-offset-4 flex items-center gap-1">
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.loans.slice(0, 3).map((l) => <LoanCard key={l.id} loan={l} />)}
                </div>
              </section>
            )}

            {w.showTransactions && user.transactions.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-2xl text-ink">Recent Transactions</h2>
                  <button onClick={() => setTab("transactions")} className="text-xs font-semibold text-brand-green hover:underline underline-offset-4 flex items-center gap-1">
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <TransactionTable user={user} limit={5} />
              </section>
            )}

            {w.showRates && (
              <section>
                <h2 className="font-serif text-2xl text-ink mb-4">Current Rates</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "30-Year Fixed Mortgage", rate: "5.990%", type: "APR" },
                    { label: "New Auto Loan", rate: "4.490%", type: "APR" },
                    { label: "12-Month Certificate", rate: "5.250%", type: "APY" },
                  ].map(({ label, rate, type }) => (
                    <div key={label} className="bg-white border border-border p-5">
                      <p className="text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground mb-3">{label}</p>
                      <p className="font-serif text-3xl font-semibold text-brand-green">{rate}</p>
                      <p className="text-xs text-muted-foreground mt-1">{type} as of today</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Rates subject to change.{" "}
                  <Link to="/guidance/rates" className="text-brand-green hover:underline underline-offset-4 font-medium">
                    View all current rates →
                  </Link>
                </p>
              </section>
            )}
          </div>
        )}

        {tab === "accounts" && (
          <div>
            <h2 className="font-serif text-2xl text-ink mb-6">My Accounts</h2>
            {user.accounts.length === 0 ? (
              <div className="bg-white border border-border p-12 text-center">
                <Landmark className="w-10 h-10 text-brand-green mx-auto mb-3 opacity-50" />
                <p className="font-semibold text-ink">No accounts on file</p>
                <p className="text-sm text-muted-foreground mt-1">Contact us to open an account today.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.accounts.map((a) => <AccountCard key={a.id} acct={a} />)}
              </div>
            )}
          </div>
        )}

        {tab === "loans" && (
          <div>
            <h2 className="font-serif text-2xl text-ink mb-6">My Loans</h2>
            {user.loans.length === 0 ? (
              <div className="bg-white border border-border p-12 text-center">
                <CheckCircle2 className="w-10 h-10 text-brand-green mx-auto mb-3 opacity-50" />
                <p className="font-semibold text-ink">No loans on file</p>
                <p className="text-sm text-muted-foreground mt-1">Looking to borrow? We offer competitive rates.</p>
                <Link to="/loans" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand-green hover:underline underline-offset-4">
                  Explore loan options <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.loans.map((l) => <LoanCard key={l.id} loan={l} />)}
              </div>
            )}
          </div>
        )}

        {tab === "transactions" && (
          <div>
            <h2 className="font-serif text-2xl text-ink mb-6">Transaction History</h2>
            {user.transactions.length === 0 ? (
              <div className="bg-white border border-border p-12 text-center text-muted-foreground text-sm">
                No transactions on record.
              </div>
            ) : (
              <TransactionTable user={user} />
            )}
          </div>
        )}
      </div>

      <footer className="border-t border-border bg-white mt-12">
        <div className="container-x py-5 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
            <span>256-bit SSL Encrypted Session</span>
          </div>
          <span>© {new Date().getFullYear()} A+ Federal Credit Union · Routing #314977104 · Federally insured by NCUA</span>
          <Link to="/" className="text-brand-green hover:underline underline-offset-4 font-medium">
            ← Back to A+FCU.org
          </Link>
        </div>
      </footer>
    </div>
  );
}
