import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  LogOut, CreditCard, Landmark, Activity, TrendingUp,
  Bell, ArrowUpRight, ArrowDownLeft, ChevronRight,
  Home, Car, GraduationCap, Briefcase, AlertTriangle,
  DollarSign, Percent, Calendar, CheckCircle,
} from "lucide-react";
import { getAdminUser, type AdminUser, type AdminAccount, type AdminLoan } from "@/data/admin-users";
import { getMemberSession, clearMemberSession } from "@/lib/session";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function fmt(n: number, compact = false) {
  if (compact && Math.abs(n) >= 1000) {
    return "$" + (n / 1000).toFixed(1) + "k";
  }
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const LOAN_ICONS: Record<string, React.ElementType> = {
  Mortgage: Home,
  Auto: Car,
  Personal: DollarSign,
  Student: GraduationCap,
  "Credit Card": CreditCard,
  HELOC: Briefcase,
};

const ACCOUNT_COLORS: Record<string, string> = {
  Checking: "bg-blue-500",
  Savings: "bg-emerald-500",
  "Money Market": "bg-purple-500",
  Certificate: "bg-orange-500",
  IRA: "bg-pink-500",
};

function AccountCard({ acct }: { acct: AdminAccount }) {
  const color = ACCOUNT_COLORS[acct.type] ?? "bg-brand-green";
  return (
    <div className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Landmark className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs text-muted-foreground bg-brand-cream px-2 py-1 rounded font-medium">{acct.type}</span>
      </div>
      <p className="text-sm font-medium text-ink mb-1">{acct.name}</p>
      <p className="text-xs text-muted-foreground mb-3">{acct.accountNumber}</p>
      <p className="text-2xl font-bold text-ink">{fmt(acct.balance)}</p>
      {acct.balance !== acct.availableBalance && (
        <p className="text-xs text-muted-foreground mt-1">
          Available: <span className="text-ink font-medium">{fmt(acct.availableBalance)}</span>
        </p>
      )}
      {acct.apy > 0 && (
        <div className="flex items-center gap-1 mt-2">
          <Percent className="w-3 h-3 text-brand-green" />
          <span className="text-xs text-brand-green font-semibold">{acct.apy.toFixed(2)}% APY</span>
        </div>
      )}
    </div>
  );
}

function LoanCard({ loan }: { loan: AdminLoan }) {
  const Icon = LOAN_ICONS[loan.type] ?? CreditCard;
  const pct = loan.originalAmount > 0
    ? Math.round(((loan.originalAmount - loan.balance) / loan.originalAmount) * 100)
    : 0;
  const dueDate = new Date(loan.nextDueDate);
  const today = new Date();
  const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const dueSoon = daysUntil <= 7;

  return (
    <div className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-orange-600" />
        </div>
        <span className="text-xs text-muted-foreground bg-brand-cream px-2 py-1 rounded font-medium">{loan.type}</span>
      </div>
      <p className="text-sm font-medium text-ink mb-1">{loan.name}</p>
      <p className="text-xs text-muted-foreground mb-3">{loan.accountNumber}</p>
      <p className="text-2xl font-bold text-ink">{fmt(loan.balance)}</p>
      <p className="text-xs text-muted-foreground mt-1">of {fmt(loan.originalAmount)} original</p>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{pct}% paid off</span>
          <span>{fmt(loan.rate, false)}% rate</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-green rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className={`flex items-center gap-2 mt-3 text-xs ${dueSoon ? "text-orange-600" : "text-muted-foreground"}`}>
        <Calendar className="w-3 h-3" />
        <span>
          Next payment {fmt(loan.monthlyPayment)} due{" "}
          {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          {dueSoon && " — due soon!"}
        </span>
      </div>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [tab, setTab] = useState<"overview" | "accounts" | "loans" | "transactions">("overview");

  useEffect(() => {
    const sessionId = getMemberSession();
    if (!sessionId) {
      navigate({ to: "/login" });
      return;
    }
    const found = getAdminUser(sessionId);
    if (!found) {
      clearMemberSession();
      navigate({ to: "/login" });
      return;
    }
    setUser(found);
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const w = user.dashboardWidgets;
  const totalDeposits = user.accounts.reduce((s, a) => s + a.balance, 0);
  const totalLoans = user.loans.reduce((s, l) => s + l.balance, 0);
  const netWorth = totalDeposits - totalLoans;

  const handleLogout = () => {
    clearMemberSession();
    navigate({ to: "/" });
  };

  const TABS = [
    { id: "overview" as const, label: "Overview", icon: TrendingUp },
    { id: "accounts" as const, label: "Accounts", icon: Landmark },
    { id: "loans" as const, label: "Loans", icon: CreditCard },
    { id: "transactions" as const, label: "Transactions", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <header className="bg-brand-green sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white/20 rounded px-2 py-1">
                <span className="text-white font-black text-lg leading-none">A+</span>
              </div>
              <span className="text-white font-semibold text-sm hidden sm:block">Federal Credit Union</span>
            </Link>
            <span className="text-white/40 hidden sm:block">|</span>
            <span className="text-white/80 text-sm hidden sm:block">Online Banking</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-white font-semibold text-sm">{user.name}</p>
              <p className="text-white/60 text-xs">Member #{user.memberNumber}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">{user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors border border-white/20 hover:border-white/40 px-3 py-1.5 rounded"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-ink">Good morning, {user.name.split(" ")[0]}!</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Member since {new Date(user.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

        {w.showAlerts && user.loans.some(l => {
          const days = Math.ceil((new Date(l.nextDueDate).getTime() - Date.now()) / 86400000);
          return days <= 7;
        }) && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-800">Upcoming Payment Due</p>
              {user.loans.filter(l => Math.ceil((new Date(l.nextDueDate).getTime() - Date.now()) / 86400000) <= 7).map(l => (
                <p key={l.id} className="text-sm text-orange-700 mt-0.5">
                  {l.name} — {fmt(l.monthlyPayment)} due {new Date(l.nextDueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Deposits", value: fmt(totalDeposits, true), sub: `${user.accounts.length} accounts`, color: "text-emerald-600" },
            { label: "Total Loans", value: fmt(totalLoans, true), sub: `${user.loans.length} loans`, color: "text-orange-500" },
            { label: "Net Position", value: fmt(netWorth, true), sub: "deposits minus loans", color: netWorth >= 0 ? "text-brand-green" : "text-red-500" },
            { label: "Routing Number", value: "314977104", sub: "ABA / wire transfers", color: "text-ink" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 mb-6 bg-white border border-border p-1 rounded-xl overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                tab === id
                  ? "bg-brand-green text-white shadow-sm"
                  : "text-ink hover:bg-brand-cream"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-ink">My Accounts</h2>
                <button onClick={() => setTab("accounts")} className="text-xs text-brand-green hover:underline flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></button>
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
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-ink">My Loans</h2>
                  <button onClick={() => setTab("loans")} className="text-xs text-brand-green hover:underline flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.loans.slice(0, 3).map((l) => <LoanCard key={l.id} loan={l} />)}
                </div>
              </section>
            )}

            {w.showTransactions && user.transactions.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-ink">Recent Transactions</h2>
                  <button onClick={() => setTab("transactions")} className="text-xs text-brand-green hover:underline flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></button>
                </div>
                <TransactionList user={user} limit={5} />
              </section>
            )}

            {w.showRates && (
              <section className="bg-brand-green/5 border border-brand-green/20 rounded-xl p-5">
                <h2 className="font-bold text-ink mb-3">Current Rates</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "30-Yr Mortgage", rate: "5.990%" },
                    { label: "Auto Loan", rate: "4.490%" },
                    { label: "12-Mo Certificate", rate: "5.250%" },
                  ].map(({ label, rate }) => (
                    <div key={label} className="bg-white rounded-lg p-3 border border-border">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-xl font-bold text-brand-green">{rate}</p>
                      <p className="text-xs text-muted-foreground">APR / APY</p>
                    </div>
                  ))}
                </div>
                <Link to="/guidance/rates" className="inline-flex items-center gap-1 text-xs text-brand-green hover:underline mt-3">
                  View all rates <ChevronRight className="w-3 h-3" />
                </Link>
              </section>
            )}
          </div>
        )}

        {tab === "accounts" && (
          <div>
            <h2 className="font-bold text-ink mb-4">All Accounts</h2>
            {user.accounts.length === 0 ? (
              <div className="bg-white border border-border rounded-xl p-12 text-center text-muted-foreground">No accounts on file.</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.accounts.map((a) => <AccountCard key={a.id} acct={a} />)}
              </div>
            )}
          </div>
        )}

        {tab === "loans" && (
          <div>
            <h2 className="font-bold text-ink mb-4">All Loans</h2>
            {user.loans.length === 0 ? (
              <div className="bg-white border border-border rounded-xl p-12 text-center">
                <CheckCircle className="w-10 h-10 text-brand-green mx-auto mb-3" />
                <p className="font-semibold text-ink">No loans on file</p>
                <p className="text-sm text-muted-foreground mt-1">Looking to borrow? We have great rates.</p>
                <Link to="/loans" className="inline-flex items-center gap-1 text-sm text-brand-green hover:underline mt-3">
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
            <h2 className="font-bold text-ink mb-4">Transaction History</h2>
            {user.transactions.length === 0 ? (
              <div className="bg-white border border-border rounded-xl p-12 text-center text-muted-foreground">No transactions on record.</div>
            ) : (
              <TransactionList user={user} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionList({ user, limit }: { user: AdminUser; limit?: number }) {
  const txns = limit ? user.transactions.slice(0, limit) : user.transactions;
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="divide-y divide-border">
        {txns.map((tx) => {
          const acct = user.accounts.find((a) => a.id === tx.accountId);
          return (
            <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-cream/50 transition-colors">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tx.type === "credit" ? "bg-emerald-100" : "bg-red-50"}`}>
                {tx.type === "credit"
                  ? <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                  : <ArrowUpRight className="w-4 h-4 text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {acct && <> · {acct.name}</>}
                </p>
              </div>
              <p className={`text-sm font-semibold shrink-0 ${tx.type === "credit" ? "text-emerald-600" : "text-ink"}`}>
                {tx.type === "credit" ? "+" : "–"}{fmt(tx.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
