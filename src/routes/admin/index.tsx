import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  Search, X, ChevronUp, ChevronDown, CheckCircle2,
  Clock, XCircle, AlertCircle, RefreshCw, Save,
  Loader2, MoreHorizontal, Users, FileText, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

function EditDrawer({
  app,
  onClose,
  onSaved,
}: {
  app: Application;
  onClose: () => void;
  onSaved: (updated: Application) => void;
}) {
  const [form, setForm] = useState<Application>({ ...app });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(app);

  const set = (name: string, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName:   form.first_name,
          lastName:    form.last_name,
          email:       form.email,
          phone:       form.phone,
          dob:         form.date_of_birth,
          ssnLast4:    form.ssn_last4,
          street:      form.street,
          apt:         form.apt ?? "",
          city:        form.city,
          state:       form.state,
          zip:         form.zip,
          accountType: form.account_type,
          loginId:     form.login_id ?? "",
          status:      form.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSaved(true);
      onSaved(data.application as Application);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[480px] max-w-full bg-white z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
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

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">

          {/* Status control */}
          <FieldGroup label="Application Status">
            <div className="flex gap-2 flex-wrap">
              {ALL_STATUSES.map((s) => {
                const cfg = STATUS_CONFIG[s];
                const active = form.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("status", s)}
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

          {/* Personal */}
          <FieldGroup label="Personal Information">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name"  name="first_name"   value={form.first_name}   onChange={set} />
              <Field label="Last Name"   name="last_name"    value={form.last_name}    onChange={set} />
            </div>
            <Field label="Email Address" name="email"        value={form.email}        onChange={set} type="email" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone"       name="phone"        value={form.phone}        onChange={set} />
              <Field label="Date of Birth" name="date_of_birth" value={form.date_of_birth ?? ""} onChange={set} />
            </div>
            <Field label="SSN (last 4)"  name="ssn_last4"   value={form.ssn_last4 ?? ""} onChange={set} />
          </FieldGroup>

          {/* Address */}
          <FieldGroup label="Home Address">
            <Field label="Street"        name="street"      value={form.street}       onChange={set} />
            <Field label="Apt / Suite"   name="apt"         value={form.apt ?? ""}    onChange={set} />
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <Field label="City"      name="city"        value={form.city}         onChange={set} />
              </div>
              <div>
                <Field label="State"     name="state"       value={form.state}        onChange={set} />
              </div>
              <div>
                <Field label="ZIP"       name="zip"         value={form.zip}          onChange={set} />
              </div>
            </div>
          </FieldGroup>

          {/* Account */}
          <FieldGroup label="Account Type">
            <div className="flex flex-col gap-1.5">
              {Object.entries(ACCOUNT_LABELS).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => set("account_type", id)}
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

          {/* Online Banking */}
          <FieldGroup label="Online Banking">
            <Field label="Login ID" name="login_id" value={form.login_id ?? ""} onChange={set} />
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Password hash is stored separately and cannot be viewed.
            </div>
          </FieldGroup>

          {/* Audit */}
          <FieldGroup label="Audit">
            <Field label="Reference #"   name="reference_number" value={form.reference_number} readOnly />
            <Field label="Applied"       name="submitted_at"     value={new Date(form.submitted_at).toLocaleString()} readOnly />
          </FieldGroup>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
          {error && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {error}
            </p>
          )}
          {!error && saved && (
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Saved successfully
            </p>
          )}
          {!error && !saved && <span />}
          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !dirty}
              className="px-4 py-2 text-sm font-semibold bg-brand-green hover:bg-brand-green-dark disabled:opacity-40 text-white rounded inline-flex items-center gap-1.5 transition-colors"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
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
      const res = await fetch("/api/applications");
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    }
  };

  const handleDrawerSave = (updated: Application) => {
    setApps((prev) => prev.map((a) => a.id === updated.id ? { ...a, ...updated } : a));
    setSelected((s) => s ? { ...s, ...updated } : s);
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
        <button
          onClick={load}
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
        {/* Search */}
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

        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-slate-100 rounded p-0.5">
          {(["all", ...ALL_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded transition-all capitalize",
                statusFilter === s
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
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
                  { label: "Member",       key: "first_name"   as SortKey },
                  { label: "Login ID",     key: null },
                  { label: "Account",      key: "account_type" as SortKey },
                  { label: "Status",       key: "status"       as SortKey },
                  { label: "Applied",      key: "submitted_at" as SortKey },
                  { label: "",             key: null },
                ].map(({ label, key }, i) => (
                  <th
                    key={i}
                    onClick={() => key && toggleSort(key)}
                    className={cn(
                      "text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 select-none",
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
                <tr
                  key={app.id}
                  onClick={() => setSelected(app)}
                  className="bg-white hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="pl-6 pr-4 py-3">
                    <p className="font-medium text-slate-900">{app.first_name} {app.last_name}</p>
                    <p className="text-[12px] text-slate-400">{app.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {app.login_id ? (
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {app.login_id}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300 italic">none</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-[13px]">
                    {ACCOUNT_LABELS[app.account_type] ?? app.account_type}
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-400 tabular-nums">
                    {new Date(app.submitted_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </td>
                  <td
                    className="px-4 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === app.id ? null : app.id)}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenuId === app.id && (
                        <div className="absolute right-0 top-8 w-44 bg-white border border-slate-200 rounded shadow-lg z-20 py-1">
                          <button
                            onClick={() => { setSelected(app); setOpenMenuId(null); }}
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            Edit Details
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button onClick={() => quickStatus(app.id, "approved")}
                            className="w-full text-left px-3 py-2 text-xs text-emerald-700 hover:bg-emerald-50">
                            ✓ Approve
                          </button>
                          <button onClick={() => quickStatus(app.id, "pending")}
                            className="w-full text-left px-3 py-2 text-xs text-amber-700 hover:bg-amber-50">
                            ⏳ Mark Pending
                          </button>
                          <button onClick={() => quickStatus(app.id, "rejected")}
                            className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50">
                            ✕ Reject
                          </button>
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

      {/* Row count footer */}
      {!loading && !error && (
        <div className="px-6 py-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <p className="text-[11px] text-slate-400">
            Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{" "}
            <span className="font-semibold text-slate-600">{apps.length}</span> applications
          </p>
        </div>
      )}

      {/* Edit drawer */}
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
