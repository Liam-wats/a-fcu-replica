import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Users, DollarSign, CreditCard, TrendingUp, ChevronRight, Circle } from "lucide-react";
import { getAdminUsers, type AdminUser } from "@/data/admin-users";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const STATUS_COLORS = {
  active: "text-emerald-400 bg-emerald-400/10",
  suspended: "text-red-400 bg-red-400/10",
  pending: "text-yellow-400 bg-yellow-400/10",
};

const STATUS_LABELS = {
  active: "Active",
  suspended: "Suspended",
  pending: "Pending",
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function totalDeposits(user: AdminUser) {
  return user.accounts.reduce((s, a) => s + a.balance, 0);
}
function totalLoans(user: AdminUser) {
  return user.loans.reduce((s, l) => s + l.balance, 0);
}

function AdminDashboard() {
  const [users] = useState(getAdminUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "pending">("all");

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.memberNumber.includes(q);
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalMembers = users.length;
  const activeMembers = users.filter((u) => u.status === "active").length;
  const allDeposits = users.reduce((s, u) => s + totalDeposits(u), 0);
  const allLoans = users.reduce((s, u) => s + totalLoans(u), 0);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Member Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">View and manage member accounts and dashboard content.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Members", value: totalMembers, sub: `${activeMembers} active`, icon: Users, color: "text-blue-400" },
          { label: "Total Deposits", value: fmt(allDeposits), sub: "across all accounts", icon: DollarSign, color: "text-emerald-400" },
          { label: "Total Loans", value: fmt(allLoans), sub: "outstanding balance", icon: CreditCard, color: "text-orange-400" },
          { label: "Avg Deposits", value: fmt(allDeposits / totalMembers), sub: "per member", icon: TrendingUp, color: "text-purple-400" },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-[#1a2535] border border-white/10 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{label}</p>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-white text-xl font-bold leading-tight">{value}</p>
            <p className="text-gray-500 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1a2535] border border-white/10 rounded-lg">
        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email, member number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f1923] border border-white/10 text-white text-sm pl-9 pr-4 py-2.5 rounded focus:outline-none focus:border-brand-green placeholder:text-gray-600"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "suspended", "pending"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-xs font-medium rounded transition-colors capitalize ${
                  statusFilter === s
                    ? "bg-brand-green text-white"
                    : "bg-[#0f1923] text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-500">No members found.</div>
          )}
          {filtered.map((user) => (
            <div key={user.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group">
              <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0">
                <span className="text-brand-green font-semibold text-sm">{user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-medium text-sm">{user.name}</p>
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[user.status]}`}>
                    <Circle className="w-1.5 h-1.5 fill-current" />
                    {STATUS_LABELS[user.status]}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5 truncate">{user.email} · #{user.memberNumber}</p>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-x-6 text-right shrink-0">
                <div>
                  <p className="text-white text-sm font-semibold">{fmt(totalDeposits(user))}</p>
                  <p className="text-gray-500 text-xs">{user.accounts.length} acct{user.accounts.length !== 1 ? "s" : ""}</p>
                </div>
                <div>
                  <p className="text-orange-300 text-sm font-semibold">{fmt(totalLoans(user))}</p>
                  <p className="text-gray-500 text-xs">{user.loans.length} loan{user.loans.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <Link
                to="/admin/users/$userId"
                params={{ userId: user.id }}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-green transition-colors bg-white/5 hover:bg-white/10 px-3 py-2 rounded shrink-0"
              >
                View <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-white/10">
          <p className="text-gray-500 text-xs">Showing {filtered.length} of {totalMembers} members</p>
        </div>
      </div>
    </div>
  );
}
