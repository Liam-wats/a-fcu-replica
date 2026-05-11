import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft, Save, User, CreditCard, Landmark, Activity,
  Plus, Trash2, Circle, CheckCircle, AlertTriangle, Edit3,
  DollarSign, Percent, Calendar, FileText, ToggleLeft, ToggleRight,
} from "lucide-react";
import {
  getAdminUser, updateAdminUser,
  type AdminUser, type AdminAccount, type AdminLoan,
} from "@/data/admin-users";

export const Route = createFileRoute("/admin/users/$userId")({
  component: UserEditor,
});

type Tab = "profile" | "accounts" | "loans" | "transactions" | "dashboard" | "notes";

const STATUS_CONFIG = {
  active: { color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", label: "Active" },
  suspended: { color: "text-red-400 bg-red-400/10 border-red-400/20", label: "Suspended" },
  pending: { color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", label: "Pending" },
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function totalDeposits(u: AdminUser) {
  return u.accounts.reduce((s, a) => s + a.balance, 0);
}
function totalLoans(u: AdminUser) {
  return u.loans.reduce((s, l) => s + l.balance, 0);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, type = "text",
}: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#0f1923] border border-white/10 text-white text-sm px-3 py-2 rounded focus:outline-none focus:border-brand-green placeholder:text-gray-600"
    />
  );
}

function NumberInput({
  value, onChange, prefix, step = "0.01",
}: { value: number; onChange: (v: number) => void; prefix?: string; step?: string }) {
  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{prefix}</span>}
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`w-full bg-[#0f1923] border border-white/10 text-white text-sm py-2 rounded focus:outline-none focus:border-brand-green ${prefix ? "pl-7 pr-3" : "px-3"}`}
      />
    </div>
  );
}

function SelectInput({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#0f1923] border border-white/10 text-white text-sm px-3 py-2 rounded focus:outline-none focus:border-brand-green"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1a2535] border border-white/10 rounded-lg overflow-hidden">
      {title && (
        <div className="px-5 py-3.5 border-b border-white/10">
          <h3 className="text-white text-sm font-semibold">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 w-full group"
    >
      {checked
        ? <ToggleRight className="w-9 h-9 text-brand-green shrink-0" />
        : <ToggleLeft className="w-9 h-9 text-gray-600 shrink-0" />}
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
    </button>
  );
}

function UserEditor() {
  const { userId } = Route.useParams();
  const navigate = useNavigate();
  const original = getAdminUser(userId);

  const [user, setUser] = useState<AdminUser | null>(original ?? null);
  const [tab, setTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!original) navigate({ to: "/admin" });
  }, [original, navigate]);

  if (!user) return null;

  const update = (patch: Partial<AdminUser>) => {
    setUser((u) => u ? { ...u, ...patch } : u);
    setDirty(true);
    setSaved(false);
  };

  const handleSave = () => {
    if (!user) return;
    updateAdminUser(user);
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "accounts", label: "Accounts", icon: Landmark },
    { id: "loans", label: "Loans", icon: CreditCard },
    { id: "transactions", label: "Transactions", icon: Activity },
    { id: "dashboard", label: "Dashboard Widgets", icon: ToggleRight },
    { id: "notes", label: "Notes", icon: FileText },
  ];

  const statusCfg = STATUS_CONFIG[user.status];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{user.name}</h1>
          <p className="text-gray-500 text-sm">Member #{user.memberNumber} · Joined {new Date(user.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${statusCfg.color}`}>
          <Circle className="w-1.5 h-1.5 fill-current" />
          {statusCfg.label}
        </span>
        <button
          onClick={handleSave}
          disabled={!dirty}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded transition-colors ${
            saved
              ? "bg-emerald-600 text-white"
              : dirty
              ? "bg-brand-green hover:bg-brand-green-dark text-white"
              : "bg-white/5 text-gray-600 cursor-not-allowed"
          }`}
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Deposits", value: fmt(totalDeposits(user)), color: "text-emerald-400" },
          { label: "Total Loans", value: fmt(totalLoans(user)), color: "text-orange-400" },
          { label: "Accounts", value: user.accounts.length.toString(), color: "text-blue-400" },
          { label: "Loans", value: user.loans.length.toString(), color: "text-purple-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#1a2535] border border-white/10 rounded-lg px-4 py-3">
            <p className="text-gray-500 text-xs">{label}</p>
            <p className={`text-lg font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 mb-6 bg-[#1a2535] border border-white/10 p-1 rounded-lg overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              tab === id
                ? "bg-brand-green text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <ProfileTab user={user} update={update} />
      )}
      {tab === "accounts" && (
        <AccountsTab user={user} update={update} />
      )}
      {tab === "loans" && (
        <LoansTab user={user} update={update} />
      )}
      {tab === "transactions" && (
        <TransactionsTab user={user} />
      )}
      {tab === "dashboard" && (
        <DashboardWidgetsTab user={user} update={update} />
      )}
      {tab === "notes" && (
        <NotesTab user={user} update={update} />
      )}

      {dirty && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex items-center gap-3 bg-[#1a2535] border border-yellow-400/30 text-yellow-400 px-4 py-3 rounded-lg shadow-xl text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Unsaved changes
            <button onClick={handleSave} className="bg-brand-green text-white text-xs font-semibold px-3 py-1.5 rounded ml-2 hover:bg-brand-green-dark transition-colors">
              Save now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileTab({ user, update }: { user: AdminUser; update: (p: Partial<AdminUser>) => void }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name">
            <TextInput value={user.name} onChange={(v) => update({ name: v })} />
          </Field>
          <Field label="Email Address">
            <TextInput value={user.email} onChange={(v) => update({ email: v })} type="email" />
          </Field>
          <Field label="Phone Number">
            <TextInput value={user.phone} onChange={(v) => update({ phone: v })} />
          </Field>
          <Field label="Member Number">
            <TextInput value={user.memberNumber} onChange={(v) => update({ memberNumber: v })} />
          </Field>
          <Field label="Member Since">
            <TextInput value={user.memberSince} onChange={(v) => update({ memberSince: v })} type="date" />
          </Field>
          <Field label="Account Status">
            <SelectInput
              value={user.status}
              onChange={(v) => update({ status: v as AdminUser["status"] })}
              options={["active", "suspended", "pending"]}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Address">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Street Address">
            <TextInput value={user.address} onChange={(v) => update({ address: v })} />
          </Field>
          <Field label="City">
            <TextInput value={user.city} onChange={(v) => update({ city: v })} />
          </Field>
          <Field label="State">
            <TextInput value={user.state} onChange={(v) => update({ state: v })} />
          </Field>
          <Field label="ZIP Code">
            <TextInput value={user.zip} onChange={(v) => update({ zip: v })} />
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}

function AccountsTab({ user, update }: { user: AdminUser; update: (p: Partial<AdminUser>) => void }) {
  const updateAccount = (id: string, patch: Partial<AdminAccount>) => {
    update({
      accounts: user.accounts.map((a) => a.id === id ? { ...a, ...patch } : a),
    });
  };

  const addAccount = () => {
    const newAcct: AdminAccount = {
      id: `a_${Date.now()}`,
      type: "Checking",
      name: "New Account",
      accountNumber: "****0000",
      balance: 0,
      availableBalance: 0,
      apy: 0,
      openDate: new Date().toISOString().slice(0, 10),
    };
    update({ accounts: [...user.accounts, newAcct] });
  };

  const removeAccount = (id: string) => {
    update({ accounts: user.accounts.filter((a) => a.id !== id) });
  };

  return (
    <div className="space-y-4">
      {user.accounts.map((acct) => (
        <SectionCard key={acct.id}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-brand-green" />
              <span className="text-white text-sm font-semibold">{acct.name}</span>
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">{acct.accountNumber}</span>
            </div>
            <button onClick={() => removeAccount(acct.id)} className="text-gray-600 hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Account Type">
              <SelectInput
                value={acct.type}
                onChange={(v) => updateAccount(acct.id, { type: v as AdminAccount["type"] })}
                options={["Checking", "Savings", "Money Market", "Certificate", "IRA"]}
              />
            </Field>
            <Field label="Account Name">
              <TextInput value={acct.name} onChange={(v) => updateAccount(acct.id, { name: v })} />
            </Field>
            <Field label="Account Number">
              <TextInput value={acct.accountNumber} onChange={(v) => updateAccount(acct.id, { accountNumber: v })} />
            </Field>
            <Field label="Current Balance">
              <NumberInput value={acct.balance} onChange={(v) => updateAccount(acct.id, { balance: v })} prefix="$" />
            </Field>
            <Field label="Available Balance">
              <NumberInput value={acct.availableBalance} onChange={(v) => updateAccount(acct.id, { availableBalance: v })} prefix="$" />
            </Field>
            <Field label="APY (%)">
              <NumberInput value={acct.apy} onChange={(v) => updateAccount(acct.id, { apy: v })} step="0.01" />
            </Field>
            <Field label="Open Date">
              <TextInput value={acct.openDate} onChange={(v) => updateAccount(acct.id, { openDate: v })} type="date" />
            </Field>
          </div>
        </SectionCard>
      ))}
      <button
        onClick={addAccount}
        className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-white/10 rounded-lg text-gray-500 hover:text-brand-green hover:border-brand-green/30 transition-colors text-sm"
      >
        <Plus className="w-4 h-4" /> Add Account
      </button>
    </div>
  );
}

function LoansTab({ user, update }: { user: AdminUser; update: (p: Partial<AdminUser>) => void }) {
  const updateLoan = (id: string, patch: Partial<AdminLoan>) => {
    update({ loans: user.loans.map((l) => l.id === id ? { ...l, ...patch } : l) });
  };

  const addLoan = () => {
    const newLoan: AdminLoan = {
      id: `l_${Date.now()}`,
      type: "Personal",
      name: "New Loan",
      accountNumber: "****0000",
      balance: 0,
      originalAmount: 0,
      rate: 0,
      monthlyPayment: 0,
      nextDueDate: new Date().toISOString().slice(0, 10),
      term: "36 months",
    };
    update({ loans: [...user.loans, newLoan] });
  };

  const removeLoan = (id: string) => {
    update({ loans: user.loans.filter((l) => l.id !== id) });
  };

  return (
    <div className="space-y-4">
      {user.loans.length === 0 && (
        <div className="text-center py-10 text-gray-500 text-sm">No loans on record.</div>
      )}
      {user.loans.map((loan) => {
        const pct = loan.originalAmount > 0
          ? Math.round(((loan.originalAmount - loan.balance) / loan.originalAmount) * 100)
          : 0;
        return (
          <SectionCard key={loan.id}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-400" />
                <span className="text-white text-sm font-semibold">{loan.name}</span>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">{loan.accountNumber}</span>
              </div>
              <button onClick={() => removeLoan(loan.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Paid off</span>
                <span>{pct}% · {fmt(loan.originalAmount - loan.balance)} of {fmt(loan.originalAmount)}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-brand-green rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Loan Type">
                <SelectInput
                  value={loan.type}
                  onChange={(v) => updateLoan(loan.id, { type: v as AdminLoan["type"] })}
                  options={["Mortgage", "Auto", "Personal", "Student", "Credit Card", "HELOC"]}
                />
              </Field>
              <Field label="Loan Name">
                <TextInput value={loan.name} onChange={(v) => updateLoan(loan.id, { name: v })} />
              </Field>
              <Field label="Account Number">
                <TextInput value={loan.accountNumber} onChange={(v) => updateLoan(loan.id, { accountNumber: v })} />
              </Field>
              <Field label="Current Balance">
                <NumberInput value={loan.balance} onChange={(v) => updateLoan(loan.id, { balance: v })} prefix="$" />
              </Field>
              <Field label="Original Amount">
                <NumberInput value={loan.originalAmount} onChange={(v) => updateLoan(loan.id, { originalAmount: v })} prefix="$" />
              </Field>
              <Field label="Interest Rate (%)">
                <NumberInput value={loan.rate} onChange={(v) => updateLoan(loan.id, { rate: v })} step="0.01" />
              </Field>
              <Field label="Monthly Payment">
                <NumberInput value={loan.monthlyPayment} onChange={(v) => updateLoan(loan.id, { monthlyPayment: v })} prefix="$" />
              </Field>
              <Field label="Next Due Date">
                <TextInput value={loan.nextDueDate} onChange={(v) => updateLoan(loan.id, { nextDueDate: v })} type="date" />
              </Field>
              <Field label="Term">
                <TextInput value={loan.term} onChange={(v) => updateLoan(loan.id, { term: v })} placeholder="e.g. 60 months" />
              </Field>
            </div>
          </SectionCard>
        );
      })}
      <button
        onClick={addLoan}
        className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-white/10 rounded-lg text-gray-500 hover:text-orange-400 hover:border-orange-400/30 transition-colors text-sm"
      >
        <Plus className="w-4 h-4" /> Add Loan
      </button>
    </div>
  );
}

function TransactionsTab({ user }: { user: AdminUser }) {
  return (
    <SectionCard title="Recent Transactions">
      {user.transactions.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">No transactions on record.</p>
      ) : (
        <div className="divide-y divide-white/5">
          {user.transactions.map((tx) => {
            const account = user.accounts.find((a) => a.id === tx.accountId);
            return (
              <div key={tx.id} className="flex items-center gap-4 py-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === "credit" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                  <DollarSign className={`w-4 h-4 ${tx.type === "credit" ? "text-emerald-400" : "text-red-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{tx.description}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {account && <> · {account.name} {account.accountNumber}</>}
                  </p>
                </div>
                <p className={`text-sm font-semibold ${tx.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                  {tx.type === "credit" ? "+" : "-"}{fmt(tx.amount)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

function DashboardWidgetsTab({ user, update }: { user: AdminUser; update: (p: Partial<AdminUser>) => void }) {
  const w = user.dashboardWidgets;
  const setWidget = (key: keyof typeof w, val: boolean) => {
    update({ dashboardWidgets: { ...w, [key]: val } });
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Dashboard Widget Visibility">
        <p className="text-gray-500 text-sm mb-5">Control which sections appear on this member's dashboard.</p>
        <div className="space-y-4">
          <Toggle checked={w.showAlerts} onChange={(v) => setWidget("showAlerts", v)} label="Account Alerts & Notifications" />
          <Toggle checked={w.showTransactions} onChange={(v) => setWidget("showTransactions", v)} label="Recent Transactions" />
          <Toggle checked={w.showLoanProgress} onChange={(v) => setWidget("showLoanProgress", v)} label="Loan Progress Bars" />
          <Toggle checked={w.showRates} onChange={(v) => setWidget("showRates", v)} label="Current Rates Panel" />
        </div>
      </SectionCard>

      <SectionCard title="Dashboard Preview">
        <p className="text-gray-400 text-sm mb-4">What this member sees on their dashboard:</p>
        <div className="space-y-2">
          {[
            { key: "showAlerts", label: "Account Alerts" },
            { key: "showTransactions", label: "Recent Transactions" },
            { key: "showLoanProgress", label: "Loan Progress" },
            { key: "showRates", label: "Current Rates" },
          ].map(({ key, label }) => {
            const on = w[key as keyof typeof w];
            return (
              <div key={key} className={`flex items-center gap-3 px-3 py-2.5 rounded ${on ? "bg-brand-green/10 border border-brand-green/20" : "bg-white/[0.03] border border-white/5 opacity-40"}`}>
                {on
                  ? <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                  : <Circle className="w-4 h-4 text-gray-600 shrink-0" />}
                <span className={`text-sm ${on ? "text-white" : "text-gray-500"}`}>{label}</span>
                {on && <span className="ml-auto text-xs text-brand-green">Visible</span>}
                {!on && <span className="ml-auto text-xs text-gray-600">Hidden</span>}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

function NotesTab({ user, update }: { user: AdminUser; update: (p: Partial<AdminUser>) => void }) {
  return (
    <SectionCard title="Internal Notes">
      <p className="text-gray-500 text-sm mb-3">These notes are private and only visible to admins.</p>
      <textarea
        value={user.notes}
        onChange={(e) => update({ notes: e.target.value })}
        rows={8}
        placeholder="Add internal notes about this member (flags, compliance issues, special instructions)…"
        className="w-full bg-[#0f1923] border border-white/10 text-white text-sm px-4 py-3 rounded focus:outline-none focus:border-brand-green placeholder:text-gray-600 resize-y"
      />
    </SectionCard>
  );
}
