import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  Search, X, ChevronUp, ChevronDown, CheckCircle2,
  Clock, XCircle, AlertCircle, RefreshCw, Save,
  Loader2, MoreHorizontal, Users, FileText, Check,
  DollarSign, Trash2, Plus, Wallet, Bell, User, Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAdminToken } from "@/routes/admin";

interface AccountData {
  balance: { available: number; current: number };
  transactions: { id: number; txn_date: string; description: string; category: string; amount: number; txn_type: string }[];
  alerts: { id: number; title: string; message: string; alert_type: string }[];
}

const TX_CATEGORIES = ["Groceries","Dining","Utilities","Transportation","Healthcare","Entertainment","Shopping","Transfer","Bills","Deposit","Other"];
const ALERT_TYPES = [{ id: "info", label: "Info" }, { id: "warning", label: "Warning" }, { id: "success", label: "Success" }];

export const Route = createFileRoute("/admin/")({
  component: AdminApplicationsPage,
});

type Status = "submitted" | "pending" | "approved" | "rejected";

interface Application {
  id: number;
  reference_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  ssn_last4: string;
  street: string;
  apt: string | null;
  city: string;
  state: string;
  zip: string;
  account_type: string;
  login_id: string | null;
  status: Status;
  submitted_at: string;
}

const STATUS_CONFIG: Record<Status, { label: string; icon: typeof CheckCircle2; chip: string }> = {
  submitted: { label: "Submitted",  icon: FileText,     chip: "bg-blue-50 text-blue-700 border-blue-200" },
  pending:   { label: "Pending",    icon: Clock,         chip: "bg-amber-50 text-amber-700 border-amber-200" },
  approved:  { label: "Approved",   icon: CheckCircle2,  chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected:  { label: "Rejected",   icon: XCircle,       chip: "bg-red-50 text-red-700 border-red-200" },
};

const ACCOUNT_LABELS: Record<string, string> = {
  "cash-back-checking": "Cash-Back Checking",
  "free-checking":      "Free Checking",
  "regular-savings":    "Regular Savings",
  "money-market":       "Money Market",
};

const ALL_STATUSES: Status[] = ["submitted", "pending", "approved", "rejected"];

type SortKey = "submitted_at" | "first_name" | "status" | "account_type";

function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getAdminToken()}` };
}

function StatusChip({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.submitted;
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 border rounded-full", cfg.chip)}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{label}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label, name, value, onChange, type = "text", readOnly = false,
}: {
  label: string; name: string; value: string; onChange?: (name: string, val: string) => void;
  type?: string; readOnly?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">{label}</label>
      {readOnly ? (
        <p className="text-sm text-slate-800 font-mono bg-slate-50 px-2.5 py-1.5 border border-slate-200 rounded">{value || "—"}</p>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(name, e.target.value)}
          className="w-full text-sm text-slate-800 px-2.5 py-1.5 border border-slate-200 rounded outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 transition-all"
        />
      )}
    </div>
  );
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function EditDrawer({
  app,
  onClose,
  onSaved,
}: {
  app: Application;
  onClose: () => void;
  onSaved: (updated: Application) => void;
}) {
  const [form, setForm]       = useState<Application>({ ...app });
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [saved, setSaved]     = useState(false);
  const [tab, setTab]         = useState<"profile" | "account">("profile");

  // Track the "clean" server copy so dirty-check works correctly after save
  const [serverApp, setServerApp] = useState<Application>({ ...app });

  // Account data state
  const [acct, setAcct]               = useState<AccountData | null>(null);
  const [acctLoading, setAcctLoading] = useState(false);
  const [balAvail, setBalAvail]       = useState("");
  const [balCurrent, setBalCurrent]   = useState("");
  const [savingBal, setSavingBal]     = useState(false);
  const [balSaved, setBalSaved]       = useState(false);

  // New transaction form
  const [txForm, setTxForm] = useState({ txn_date: "", description: "", category: "Other", amount: "", txn_type: "debit" });
  const [addingTx, setAddingTx]   = useState(false);
  const [showTxForm, setShowTxForm] = useState(false);

  // Edit transaction
  const [editingTxId, setEditingTxId] = useState<number | null>(null);
  const [editTxForm, setEditTxForm] = useState({ txn_date: "", description: "", category: "Other", amount: "", txn_type: "debit" });
  const [savingTxId, setSavingTxId] = useState<number | null>(null);

  // New alert form
  const [alertForm, setAlertForm] = useState({ title: "", message: "", alert_type: "info" });
  const [addingAlert, setAddingAlert]   = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(false);

  // Edit alert
  const [editingAlertId, setEditingAlertId] = useState<number | null>(null);
  const [editAlertForm, setEditAlertForm] = useState({ title: "", message: "", alert_type: "info" });
  const [savingAlertId, setSavingAlertId] = useState<number | null>(null);

  const loginId = form.login_id;

  const loadAccountData = useCallback(async () => {
    if (!loginId) return;
    setAcctLoading(true);
    try {
      const res = await fetch(`/api/member/${loginId}/account-admin`, {
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      const data: AccountData = await res.json();
      setAcct(data);
      setBalAvail(data.balance.available.toFixed(2));
      setBalCurrent(data.balance.current.toFixed(2));
    } catch { /* silent */ }
    finally { setAcctLoading(false); }
  }, [loginId]);

  useEffect(() => { if (tab === "account") loadAccountData(); }, [tab, loadAccountData]);

  const dirty = JSON.stringify(form) !== JSON.stringify(serverApp);

  const set = (name: string, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          firstName: form.first_name, lastName: form.last_name,
          email: form.email, phone: form.phone,
          dob: form.date_of_birth || undefined, ssnLast4: form.ssn_last4 || undefined,
          street: form.street || undefined, apt: form.apt ?? "",
          city: form.city || undefined, state: form.state || undefined,
          zip: form.zip || undefined,
          accountType: form.account_type, loginId: form.login_id ?? "",
          status: form.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      const updated = data.application as Application;
      setSaved(true);
      setForm({ ...updated });
      setServerApp({ ...updated });
      onSaved(updated);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const saveBalance = async () => {
    if (!loginId) return;
    setSavingBal(true);
    try {
      await fetch(`/api/member/${loginId}/balance`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ available: parseFloat(balAvail), current: parseFloat(balCurrent) }),
      });
      setBalSaved(true);
      setTimeout(() => setBalSaved(false), 2500);
      if (acct) setAcct({ ...acct, balance: { available: parseFloat(balAvail), current: parseFloat(balCurrent) } });
    } catch { /* silent */ }
    finally { setSavingBal(false); }
  };

  const addTransaction = async () => {
    if (!loginId || !txForm.description || !txForm.amount || !txForm.txn_date) return;
    setAddingTx(true);
    try {
      const res = await fetch(`/api/member/${loginId}/transactions`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ ...txForm, amount: parseFloat(txForm.amount) }),
      });
      const data = await res.json();
      if (res.ok && acct) {
        setAcct({ ...acct, transactions: [data.transaction, ...acct.transactions] });
        setTxForm({ txn_date: "", description: "", category: "Other", amount: "", txn_type: "debit" });
        setShowTxForm(false);
      }
    } catch { /* silent */ }
    finally { setAddingTx(false); }
  };

  const startEditTx = (tx: AccountData["transactions"][0]) => {
    setEditingTxId(tx.id);
    setEditTxForm({
      txn_date: tx.txn_date,
      description: tx.description,
      category: tx.category,
      amount: String(Math.abs(tx.amount)),
      txn_type: tx.txn_type,
    });
  };

  const saveEditTx = async (id: number) => {
    if (!loginId) return;
    setSavingTxId(id);
    try {
      const res = await fetch(`/api/member/${loginId}/transactions/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ ...editTxForm, amount: parseFloat(editTxForm.amount) }),
      });
      const data = await res.json();
      if (res.ok && acct) {
        setAcct({
          ...acct,
          transactions: acct.transactions.map((t) => t.id === id ? data.transaction : t),
        });
        setEditingTxId(null);
      }
    } catch { /* silent */ }
    finally { setSavingTxId(null); }
  };

  const deleteTransaction = async (id: number) => {
    if (!loginId) return;
    await fetch(`/api/member/${loginId}/transactions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    if (acct) setAcct({ ...acct, transactions: acct.transactions.filter(t => t.id !== id) });
  };

  const addAlert = async () => {
    if (!loginId || !alertForm.title || !alertForm.message) return;
    setAddingAlert(true);
    try {
      const res = await fetch(`/api/member/${loginId}/alerts`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(alertForm),
      });
      const data = await res.json();
      if (res.ok && acct) {
        setAcct({ ...acct, alerts: [data.alert, ...acct.alerts] });
        setAlertForm({ title: "", message: "", alert_type: "info" });
        setShowAlertForm(false);
      }
    } catch { /* silent */ }
    finally { setAddingAlert(false); }
  };

  const startEditAlert = (alert: AccountData["alerts"][0]) => {
    setEditingAlertId(alert.id);
    setEditAlertForm({ title: alert.title, message: alert.message, alert_type: alert.alert_type });
  };

  const saveEditAlert = async (id: number) => {
    if (!loginId) return;
    setSavingAlertId(id);
    try {
      const res = await fetch(`/api/member/${loginId}/alerts/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(editAlertForm),
      });
      const data = await res.json();
      if (res.ok && acct) {
        setAcct({
          ...acct,
          alerts: acct.alerts.map((a) => a.id === id ? data.alert : a),
        });
        setEditingAlertId(null);
      }
    } catch { /* silent */ }
    finally { setSavingAlertId(null); }
  };

  const deleteAlert = async (id: number) => {
    if (!loginId) return;
    await fetch(`/api/member/${loginId}/alerts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    if (acct) setAcct({ ...acct, alerts: acct.alerts.filter(a => a.id !== id) });
  };

  const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-[1px]" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[520px] max-w-full bg-white z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono">{app.reference_number}</p>
              <h2 className="font-semibold text-slate-900 text-base mt-0.5">
                {app.first_name} {app.last_name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <StatusChip status={form.status} />
              <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-0 mt-4 border-b border-slate-100 -mb-4">
            {[
              { id: "profile" as const,  label: "Profile",      icon: User },
              { id: "account" as const,  label: "Account Data", icon: Wallet },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors",
                  tab === id ? "border-brand-green text-brand-green" : "border-transparent text-slate-400 hover:text-slate-700"
                )}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── PROFILE TAB ── */}
          {tab === "profile" && (
            <div className="px-6 py-5 space-y-7">
              <FieldGroup label="Application Status">
                <div className="flex gap-2 flex-wrap">
                  {ALL_STATUSES.map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    const active = form.status === s;
                    return (
                      <button key={s} type="button" onClick={() => set("status", s)}
                        className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border rounded-full transition-all",
                          active
                            ? cn(cfg.chip, "ring-2 ring-offset-1", s === "approved" ? "ring-emerald-400" : s === "rejected" ? "ring-red-400" : s === "pending" ? "ring-amber-400" : "ring-blue-400")
                            : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                        )}
                      >
                        {active && <Check className="w-3 h-3" />}
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </FieldGroup>

              <FieldGroup label="Personal Information">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name" name="first_name" value={form.first_name} onChange={set} />
                  <Field label="Last Name"  name="last_name"  value={form.last_name}  onChange={set} />
                </div>
                <Field label="Email Address" name="email" value={form.email} onChange={set} type="email" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Phone" name="phone" value={form.phone} onChange={set} />
                  <Field label="Date of Birth" name="date_of_birth" value={form.date_of_birth ?? ""} onChange={set} />
                </div>
                <Field label="SSN (last 4)" name="ssn_last4" value={form.ssn_last4 ?? ""} onChange={set} />
              </FieldGroup>

              <FieldGroup label="Home Address">
                <Field label="Street" name="street" value={form.street ?? ""} onChange={set} />
                <Field label="Apt / Suite" name="apt" value={form.apt ?? ""} onChange={set} />
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1"><Field label="City"  name="city"  value={form.city ?? ""}  onChange={set} /></div>
                  <div><Field label="State" name="state" value={form.state ?? ""} onChange={set} /></div>
                  <div><Field label="ZIP"   name="zip"   value={form.zip ?? ""}   onChange={set} /></div>
                </div>
              </FieldGroup>

              <FieldGroup label="Account Type">
                <div className="flex flex-col gap-1.5">
                  {Object.entries(ACCOUNT_LABELS).map(([id, label]) => (
                    <button key={id} type="button" onClick={() => set("account_type", id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 border rounded text-sm text-left transition-all",
                        form.account_type === id
                          ? "border-brand-green bg-brand-green/5 text-brand-green font-semibold"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                        form.account_type === id ? "border-brand-green bg-brand-green" : "border-slate-300"
                      )}>
                        {form.account_type === id && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      {label}
                    </button>
                  ))}
                </div>
              </FieldGroup>

              <FieldGroup label="Online Banking">
                <Field label="Login ID" name="login_id" value={form.login_id ?? ""} onChange={set} />
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Password hash is stored separately and cannot be viewed.
                </div>
              </FieldGroup>

              <FieldGroup label="Audit">
                <Field label="Reference #" name="reference_number" value={form.reference_number} readOnly />
                <Field label="Applied" name="submitted_at" value={new Date(form.submitted_at).toLocaleString()} readOnly />
              </FieldGroup>
            </div>
          )}

          {/* ── ACCOUNT DATA TAB ── */}
          {tab === "account" && (
            <div className="px-6 py-5 space-y-6">
              {!loginId ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                  <p className="text-sm font-semibold text-slate-700">No Login ID set</p>
                  <p className="text-[13px] text-slate-400">
                    Assign a Login ID on the Profile tab first before managing account data.
                  </p>
                </div>
              ) : acctLoading ? (
                <div className="flex items-center justify-center py-12 gap-2 text-slate-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading account data…
                </div>
              ) : (
                <>
                  {/* ── Balance ── */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-4 h-4 text-brand-green" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account Balance</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Available Balance</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                          <input
                            type="number" step="0.01" min="0"
                            className="w-full pl-6 pr-2.5 py-1.5 text-sm border border-slate-200 rounded outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
                            value={balAvail}
                            onChange={e => setBalAvail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Current Balance</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                          <input
                            type="number" step="0.01" min="0"
                            className="w-full pl-6 pr-2.5 py-1.5 text-sm border border-slate-200 rounded outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
                            value={balCurrent}
                            onChange={e => setBalCurrent(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={saveBalance}
                      disabled={savingBal}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-green text-white px-3 py-1.5 rounded hover:bg-brand-green-dark disabled:opacity-50 transition-colors"
                    >
                      {savingBal ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      {balSaved ? "Saved!" : "Save Balance"}
                    </button>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* ── Transactions ── */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-green" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Transactions ({acct?.transactions.length ?? 0})
                        </p>
                      </div>
                      <button
                        onClick={() => { setShowTxForm(v => !v); setEditingTxId(null); }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-green hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>

                    {showTxForm && (
                      <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Date</label>
                            <input
                              placeholder={todayStr}
                              className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-brand-green"
                              value={txForm.txn_date}
                              onChange={e => setTxForm(f => ({ ...f, txn_date: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Category</label>
                            <select
                              className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-brand-green bg-white"
                              value={txForm.category}
                              onChange={e => setTxForm(f => ({ ...f, category: e.target.value }))}
                            >
                              {TX_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Description</label>
                          <input
                            placeholder="e.g. Walmart Grocery"
                            className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-brand-green"
                            value={txForm.description}
                            onChange={e => setTxForm(f => ({ ...f, description: e.target.value }))}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Amount</label>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                              <input
                                type="number" step="0.01" min="0" placeholder="0.00"
                                className="w-full pl-5 pr-2 py-1.5 text-xs border border-slate-200 rounded outline-none focus:border-brand-green"
                                value={txForm.amount}
                                onChange={e => setTxForm(f => ({ ...f, amount: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Type</label>
                            <div className="flex gap-1">
                              {["debit", "credit"].map(t => (
                                <button key={t} type="button"
                                  onClick={() => setTxForm(f => ({ ...f, txn_type: t }))}
                                  className={cn("flex-1 text-[10px] font-semibold py-1.5 border rounded capitalize transition-all",
                                    txForm.txn_type === t
                                      ? t === "debit" ? "bg-red-50 border-red-300 text-red-600" : "bg-emerald-50 border-emerald-300 text-emerald-700"
                                      : "border-slate-200 text-slate-400 hover:border-slate-300"
                                  )}
                                >{t}</button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={addTransaction} disabled={addingTx}
                            className="text-xs font-semibold bg-brand-green text-white px-3 py-1.5 rounded hover:bg-brand-green-dark disabled:opacity-50 inline-flex items-center gap-1"
                          >
                            {addingTx ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                            Add Transaction
                          </button>
                          <button onClick={() => setShowTxForm(false)} className="text-xs text-slate-400 hover:text-slate-600 px-2">Cancel</button>
                        </div>
                      </div>
                    )}

                    {(acct?.transactions ?? []).length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">No transactions yet.</p>
                    ) : (
                      <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                        {(acct?.transactions ?? []).map(tx => (
                          <div key={tx.id}>
                            {editingTxId === tx.id ? (
                              <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Date</label>
                                    <input
                                      className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-brand-green"
                                      value={editTxForm.txn_date}
                                      onChange={e => setEditTxForm(f => ({ ...f, txn_date: e.target.value }))}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Category</label>
                                    <select
                                      className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-brand-green bg-white"
                                      value={editTxForm.category}
                                      onChange={e => setEditTxForm(f => ({ ...f, category: e.target.value }))}
                                    >
                                      {TX_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Description</label>
                                  <input
                                    className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-brand-green"
                                    value={editTxForm.description}
                                    onChange={e => setEditTxForm(f => ({ ...f, description: e.target.value }))}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Amount</label>
                                    <div className="relative">
                                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                      <input
                                        type="number" step="0.01" min="0"
                                        className="w-full pl-5 pr-2 py-1 text-xs border border-slate-200 rounded outline-none focus:border-brand-green"
                                        value={editTxForm.amount}
                                        onChange={e => setEditTxForm(f => ({ ...f, amount: e.target.value }))}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Type</label>
                                    <div className="flex gap-1">
                                      {["debit", "credit"].map(t => (
                                        <button key={t} type="button"
                                          onClick={() => setEditTxForm(f => ({ ...f, txn_type: t }))}
                                          className={cn("flex-1 text-[10px] font-semibold py-1 border rounded capitalize transition-all",
                                            editTxForm.txn_type === t
                                              ? t === "debit" ? "bg-red-50 border-red-300 text-red-600" : "bg-emerald-50 border-emerald-300 text-emerald-700"
                                              : "border-slate-200 text-slate-400 hover:border-slate-300"
                                          )}
                                        >{t}</button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2 pt-1">
                                  <button onClick={() => saveEditTx(tx.id)} disabled={savingTxId === tx.id}
                                    className="text-xs font-semibold bg-brand-green text-white px-3 py-1 rounded hover:bg-brand-green-dark disabled:opacity-50 inline-flex items-center gap-1"
                                  >
                                    {savingTxId === tx.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                    Save
                                  </button>
                                  <button onClick={() => setEditingTxId(null)} className="text-xs text-slate-400 hover:text-slate-600 px-2">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded px-3 py-2 group">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className={cn("w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full shrink-0",
                                    tx.txn_type === "debit" ? "bg-red-100 text-red-500" : "bg-emerald-100 text-emerald-600"
                                  )}>
                                    {tx.txn_type === "debit" ? "−" : "+"}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-800 truncate">{tx.description}</p>
                                    <p className="text-[10px] text-slate-400">{tx.category} · {tx.txn_date}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className={cn("text-xs font-bold tabular-nums",
                                    tx.txn_type === "debit" ? "text-slate-700" : "text-emerald-600"
                                  )}>
                                    {tx.txn_type === "debit" ? "−" : "+"}{fmt(Math.abs(tx.amount))}
                                  </span>
                                  <button
                                    onClick={() => startEditTx(tx)}
                                    className="p-0.5 text-slate-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Edit transaction"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => deleteTransaction(tx.id)}
                                    className="p-0.5 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete transaction"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* ── Alerts ── */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-brand-green" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Member Alerts ({acct?.alerts.length ?? 0})
                        </p>
                      </div>
                      <button
                        onClick={() => { setShowAlertForm(v => !v); setEditingAlertId(null); }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-green hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>

                    {showAlertForm && (
                      <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 space-y-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Title</label>
                          <input
                            placeholder="e.g. Low balance notice"
                            className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-brand-green"
                            value={alertForm.title}
                            onChange={e => setAlertForm(f => ({ ...f, title: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Message</label>
                          <textarea rows={2}
                            placeholder="Alert message text…"
                            className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-brand-green resize-none"
                            value={alertForm.message}
                            onChange={e => setAlertForm(f => ({ ...f, message: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Type</label>
                          <div className="flex gap-1.5">
                            {ALERT_TYPES.map(({ id, label }) => (
                              <button key={id} type="button"
                                onClick={() => setAlertForm(f => ({ ...f, alert_type: id }))}
                                className={cn("flex-1 text-[10px] font-semibold py-1.5 border rounded transition-all",
                                  alertForm.alert_type === id
                                    ? id === "warning" ? "bg-amber-50 border-amber-300 text-amber-700"
                                      : id === "success" ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                      : "bg-blue-50 border-blue-300 text-blue-700"
                                    : "border-slate-200 text-slate-400 hover:border-slate-300"
                                )}
                              >{label}</button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={addAlert} disabled={addingAlert}
                            className="text-xs font-semibold bg-brand-green text-white px-3 py-1.5 rounded hover:bg-brand-green-dark disabled:opacity-50 inline-flex items-center gap-1"
                          >
                            {addingAlert ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                            Add Alert
                          </button>
                          <button onClick={() => setShowAlertForm(false)} className="text-xs text-slate-400 hover:text-slate-600 px-2">Cancel</button>
                        </div>
                      </div>
                    )}

                    {(acct?.alerts ?? []).length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">No alerts for this member.</p>
                    ) : (
                      <div className="space-y-1">
                        {(acct?.alerts ?? []).map(alert => (
                          <div key={alert.id}>
                            {editingAlertId === alert.id ? (
                              <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 space-y-2">
                                <div>
                                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Title</label>
                                  <input
                                    className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-brand-green"
                                    value={editAlertForm.title}
                                    onChange={e => setEditAlertForm(f => ({ ...f, title: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Message</label>
                                  <textarea rows={2}
                                    className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-brand-green resize-none"
                                    value={editAlertForm.message}
                                    onChange={e => setEditAlertForm(f => ({ ...f, message: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Type</label>
                                  <div className="flex gap-1.5">
                                    {ALERT_TYPES.map(({ id, label }) => (
                                      <button key={id} type="button"
                                        onClick={() => setEditAlertForm(f => ({ ...f, alert_type: id }))}
                                        className={cn("flex-1 text-[10px] font-semibold py-1 border rounded transition-all",
                                          editAlertForm.alert_type === id
                                            ? id === "warning" ? "bg-amber-50 border-amber-300 text-amber-700"
                                              : id === "success" ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                              : "bg-blue-50 border-blue-300 text-blue-700"
                                            : "border-slate-200 text-slate-400 hover:border-slate-300"
                                        )}
                                      >{label}</button>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex gap-2 pt-1">
                                  <button onClick={() => saveEditAlert(alert.id)} disabled={savingAlertId === alert.id}
                                    className="text-xs font-semibold bg-brand-green text-white px-3 py-1 rounded hover:bg-brand-green-dark disabled:opacity-50 inline-flex items-center gap-1"
                                  >
                                    {savingAlertId === alert.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                    Save
                                  </button>
                                  <button onClick={() => setEditingAlertId(null)} className="text-xs text-slate-400 hover:text-slate-600 px-2">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <div className={cn(
                                "flex items-start justify-between rounded px-3 py-2 border group",
                                alert.alert_type === "warning" ? "bg-amber-50 border-amber-100"
                                  : alert.alert_type === "success" ? "bg-emerald-50 border-emerald-100"
                                  : "bg-blue-50 border-blue-100"
                              )}>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-slate-800">{alert.title}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{alert.message}</p>
                                </div>
                                <div className="flex items-center gap-0.5 ml-2 shrink-0">
                                  <button
                                    onClick={() => startEditAlert(alert)}
                                    className="p-0.5 text-slate-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Edit alert"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => deleteAlert(alert.id)}
                                    className="p-0.5 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete alert"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer — only show profile save on profile tab */}
        {tab === "profile" && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
            {error && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
            {!error && saved && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Saved successfully</p>}
            {!error && !saved && <span />}
            <div className="flex gap-2 ml-auto">
              <button type="button" onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded transition-all"
              >
                Cancel
              </button>
              <button type="button" onClick={handleSave} disabled={saving || !dirty}
                className="px-4 py-2 text-sm font-semibold bg-brand-green hover:bg-brand-green-dark disabled:opacity-40 text-white rounded inline-flex items-center gap-1.5 transition-colors"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("submitted_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Application | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/applications", {
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      const data = await res.json();
      setApps(data.applications ?? []);
    } catch {
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const quickStatus = async (id: number, status: Status) => {
    setOpenMenuId(null);
    const res = await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    }
  };

  const handleDrawerSave = (updated: Application) => {
    setApps((prev) => prev.map((a) => a.id === updated.id ? { ...updated } : a));
    setSelected(updated);
  };

  // Stats
  const counts = apps.reduce(
    (acc, a) => { acc[a.status] = (acc[a.status] ?? 0) + 1; return acc; },
    {} as Record<string, number>
  );

  // Filter + sort
  const filtered = apps
    .filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        `${a.first_name} ${a.last_name}`.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.reference_number?.toLowerCase().includes(q) ||
        a.login_id?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      return sortDir === "asc" ? av > bv ? 1 : -1 : av < bv ? 1 : -1;
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3 opacity-20" />
    );

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div>
          <h1 className="font-semibold text-slate-900 text-[15px]">Membership Applications</h1>
          <p className="text-[11px] text-slate-400">{apps.length} total records</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 px-3 py-1.5 border border-slate-200 rounded hover:border-slate-300 transition-all"
        >
          <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-px bg-slate-200 border-b border-slate-200 shrink-0">
        {[
          { label: "Total",    value: apps.length,           icon: Users,        color: "text-slate-700" },
          { label: "Pending",  value: (counts.pending ?? 0) + (counts.submitted ?? 0), icon: Clock,  color: "text-amber-600" },
          { label: "Approved", value: counts.approved ?? 0,  icon: CheckCircle2, color: "text-emerald-600" },
          { label: "Rejected", value: counts.rejected ?? 0,  icon: XCircle,      color: "text-red-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white px-6 py-4 flex items-center gap-3">
            <Icon className={cn("w-5 h-5", color)} />
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-3 shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, Login ID…"
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 transition-all placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded p-0.5">
          {(["all", ...ALL_STATUSES] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("px-3 py-1 text-xs font-medium rounded transition-all capitalize",
                statusFilter === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s].label}
              {s !== "all" && (
                <span className="ml-1.5 text-[10px] text-slate-400">
                  {s === "submitted" ? counts.submitted ?? 0 : counts[s] ?? 0}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64 gap-2 text-sm text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-sm text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-slate-400">
            <Users className="w-8 h-8 opacity-30" />
            <p className="text-sm">No applications found</p>
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                {[
                  { label: "Member",   key: "first_name"   as SortKey },
                  { label: "Login ID", key: null },
                  { label: "Account",  key: "account_type" as SortKey },
                  { label: "Status",   key: "status"       as SortKey },
                  { label: "Applied",  key: "submitted_at" as SortKey },
                  { label: "",         key: null },
                ].map(({ label, key }, i) => (
                  <th key={i} onClick={() => key && toggleSort(key)}
                    className={cn("text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 select-none",
                      key && "cursor-pointer hover:text-slate-700",
                      i === 0 && "pl-6"
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      {label}
                      {key && <SortIcon k={key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((app) => (
                <tr key={app.id} onClick={() => setSelected(app)}
                  className="bg-white hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="pl-6 pr-4 py-3">
                    <p className="font-medium text-slate-900">{app.first_name} {app.last_name}</p>
                    <p className="text-[12px] text-slate-400">{app.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {app.login_id ? (
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{app.login_id}</span>
                    ) : (
                      <span className="text-xs text-slate-300 italic">none</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-[13px]">
                    {ACCOUNT_LABELS[app.account_type] ?? app.account_type}
                  </td>
                  <td className="px-4 py-3"><StatusChip status={app.status} /></td>
                  <td className="px-4 py-3 text-[12px] text-slate-400 tabular-nums">
                    {new Date(app.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="relative inline-block">
                      <button onClick={() => setOpenMenuId(openMenuId === app.id ? null : app.id)}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenuId === app.id && (
                        <div className="absolute right-0 top-8 w-44 bg-white border border-slate-200 rounded shadow-lg z-20 py-1">
                          <button onClick={() => { setSelected(app); setOpenMenuId(null); }}
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            Edit Details
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button onClick={() => quickStatus(app.id, "approved")} className="w-full text-left px-3 py-2 text-xs text-emerald-700 hover:bg-emerald-50">✓ Approve</button>
                          <button onClick={() => quickStatus(app.id, "pending")} className="w-full text-left px-3 py-2 text-xs text-amber-700 hover:bg-amber-50">⏳ Mark Pending</button>
                          <button onClick={() => quickStatus(app.id, "rejected")} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50">✕ Reject</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <EditDrawer
          app={selected}
          onClose={() => setSelected(null)}
          onSaved={handleDrawerSave}
        />
      )}
    </div>
  );
}
