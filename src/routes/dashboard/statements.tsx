import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  FileText, ArrowLeft, Download, Loader2,
  Search, X, TrendingUp, TrendingDown, ArrowLeftRight,
  ChevronDown, Calendar, Tag, Filter, ChevronUp,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { cn } from "@/lib/utils";
import type { Session } from "@/routes/dashboard";
import { ACCOUNT_LABELS } from "@/routes/dashboard";

export const Route = createFileRoute("/dashboard/statements")({
  component: StatementsPage,
});

interface Txn {
  id: number; txn_date: string; description: string;
  category: string; amount: number; txn_type: string;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function getToken() {
  return sessionStorage.getItem("apfcu_token") || "";
}

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function monthLabel(txn_date: string): string {
  const d = parseDate(txn_date);
  if (!d) return "Unknown Date";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function monthKey(txn_date: string): string {
  const d = parseDate(txn_date);
  if (!d) return "0000-00";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function categoryColor(cat: string): string {
  const map: Record<string, string> = {
    Transfer:    "bg-purple-50 text-purple-700 border-purple-200",
    Food:        "bg-orange-50 text-orange-700 border-orange-200",
    Shopping:    "bg-pink-50 text-pink-700 border-pink-200",
    Bills:       "bg-yellow-50 text-yellow-700 border-yellow-200",
    Income:      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Healthcare:  "bg-red-50 text-red-700 border-red-200",
    Travel:      "bg-sky-50 text-sky-700 border-sky-200",
  };
  return map[cat] ?? "bg-slate-50 text-slate-600 border-slate-200";
}

function exportCSV(txns: Txn[], label: string) {
  const rows = [
    ["Date", "Description", "Category", "Type", "Amount"],
    ...txns.map(t => [
      t.txn_date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      t.txn_type,
      (t.txn_type === "debit" ? -t.amount : t.amount).toFixed(2),
    ]),
  ];
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `${label.replace(/\s+/g, "_")}_transactions.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(txns: Txn[], label: string, totalCredits: number, totalDebits: number) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const margin = 48;
  const green: [number, number, number] = [0, 100, 60];
  const ink:   [number, number, number] = [30, 35, 40];
  const muted: [number, number, number] = [120, 130, 140];

  const generated = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  // ── Header bar ──
  doc.setFillColor(...green);
  doc.rect(0, 0, W, 72, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("A+ Federal Credit Union", margin, 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 235, 215);
  doc.text("Transaction Statement  ·  Online Banking", margin, 48);
  doc.text(`Generated ${generated}`, margin, 62);

  // ── Account info ──
  let y = 96;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...ink);
  doc.text(label, margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(`${txns.length} transaction${txns.length !== 1 ? "s" : ""}`, margin, y + 14);

  // ── Summary box ──
  y += 36;
  const boxH = 54;
  doc.setFillColor(248, 250, 248);
  doc.setDrawColor(220, 230, 224);
  doc.rect(margin, y, W - margin * 2, boxH, "FD");

  const colW = (W - margin * 2) / 3;

  const summaryItems = [
    { label: "Total Credits", value: `+${fmt(totalCredits)}`, color: [0, 130, 70] as [number,number,number] },
    { label: "Total Debits",  value: `−${fmt(totalDebits)}`,  color: ink },
    { label: "Net Flow",
      value: `${totalCredits - totalDebits >= 0 ? "+" : "−"}${fmt(Math.abs(totalCredits - totalDebits))}`,
      color: totalCredits - totalDebits >= 0 ? [0, 130, 70] as [number,number,number] : [180, 40, 40] as [number,number,number],
    },
  ];

  summaryItems.forEach(({ label: sl, value, color }, i) => {
    const cx = margin + i * colW + colW / 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(sl, cx, y + 18, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...color);
    doc.text(value, cx, y + 36, { align: "center" });
  });

  // ── Column headers ──
  y += boxH + 20;
  doc.setFillColor(...green);
  doc.rect(margin, y, W - margin * 2, 20, "F");

  const cols = [
    { label: "Date",        x: margin + 6,         w: 72 },
    { label: "Description", x: margin + 84,        w: 220 },
    { label: "Category",    x: margin + 310,       w: 90 },
    { label: "Type",        x: margin + 406,       w: 54 },
    { label: "Amount",      x: W - margin - 6,     w: 0, right: true },
  ];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  cols.forEach(c => {
    if (c.right) doc.text(c.label, c.x, y + 13, { align: "right" });
    else doc.text(c.label, c.x, y + 13);
  });

  y += 20;

  // ── Rows ──
  const rowH = 22;
  let rowIndex = 0;

  // Group by month for section headers
  const monthMap = new Map<string, { label: string; txns: Txn[] }>();
  txns.forEach(t => {
    const key = monthKey(t.txn_date);
    if (!monthMap.has(key)) {
      const d = parseDate(t.txn_date);
      const lbl = d ? d.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Unknown";
      monthMap.set(key, { label: lbl, txns: [] });
    }
    monthMap.get(key)!.txns.push(t);
  });

  const groups = Array.from(monthMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, v]) => v);

  function addPageIfNeeded() {
    if (y > H - 60) {
      doc.addPage();
      y = margin;
      // repeat header stripe
      doc.setFillColor(...green);
      doc.rect(margin, y, W - margin * 2, 20, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      cols.forEach(c => {
        if (c.right) doc.text(c.label, c.x, y + 13, { align: "right" });
        else doc.text(c.label, c.x, y + 13);
      });
      y += 20;
    }
  }

  groups.forEach(({ label: monthLbl, txns: mTxns }) => {
    addPageIfNeeded();
    // Month section header
    doc.setFillColor(240, 245, 242);
    doc.rect(margin, y, W - margin * 2, 18, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...green);
    doc.text(monthLbl.toUpperCase(), margin + 6, y + 12);
    y += 18;

    mTxns.forEach(tx => {
      addPageIfNeeded();
      const isCredit = tx.txn_type === "credit";
      // alternating row
      if (rowIndex % 2 === 1) {
        doc.setFillColor(250, 252, 251);
        doc.rect(margin, y, W - margin * 2, rowH, "F");
      }
      rowIndex++;

      const amount = (isCredit ? tx.amount : -tx.amount);
      const amtStr = `${isCredit ? "+" : "−"}${fmt(Math.abs(amount))}`;

      const desc = tx.description.length > 38
        ? tx.description.slice(0, 36) + "…"
        : tx.description;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...muted);
      doc.text(tx.txn_date, cols[0].x, y + 14);

      doc.setTextColor(...ink);
      doc.text(desc, cols[1].x, y + 14);

      doc.setTextColor(...muted);
      doc.text(tx.category ?? "", cols[2].x, y + 14);
      doc.text(tx.txn_type.charAt(0).toUpperCase() + tx.txn_type.slice(1), cols[3].x, y + 14);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...(isCredit ? ([0, 130, 70] as [number,number,number]) : ink));
      doc.text(amtStr, cols[4].x, y + 14, { align: "right" });

      y += rowH;
    });
  });

  // ── Footer ──
  const footerY = H - 28;
  doc.setDrawColor(...muted);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 8, W - margin, footerY - 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...muted);
  doc.text("A+ Federal Credit Union  ·  Member FDIC  ·  Equal Housing Lender", margin, footerY);
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, W - margin, footerY, { align: "right" });
  }

  doc.save(`${label.replace(/\s+/g, "_")}_statement.pdf`);
}

function StatementsPage() {
  const [session, setSession]           = useState<Session | null>(null);
  const [transactions, setTransactions] = useState<Txn[]>([]);
  const [loading, setLoading]           = useState(true);

  // Filters
  const [search, setSearch]     = useState("");
  const [typeFilter, setType]   = useState<"all" | "debit" | "credit">("all");
  const [catFilter, setCat]     = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showExportMenu) return;
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showExportMenu]);

  useEffect(() => {
    const raw = sessionStorage.getItem("apfcu_session");
    if (!raw) return;
    const s: Session = JSON.parse(raw);
    setSession(s);
    if (s.loginId) {
      fetch(`/api/member/${s.loginId}/account`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
        .then(r => r.json())
        .then(d => setTransactions(d.transactions ?? []))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const categories = useMemo(() => {
    const set = new Set(transactions.map(t => t.category).filter(Boolean));
    return Array.from(set).sort();
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (typeFilter !== "all" && t.txn_type !== typeFilter) return false;
      if (catFilter !== "all" && t.category !== catFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!t.description.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
      }
      if (dateFrom) {
        const d = parseDate(t.txn_date);
        if (!d || d < new Date(dateFrom)) return false;
      }
      if (dateTo) {
        const d = parseDate(t.txn_date);
        if (!d || d > new Date(dateTo + "T23:59:59")) return false;
      }
      return true;
    });
  }, [transactions, typeFilter, catFilter, search, dateFrom, dateTo]);

  // Group filtered txns by month
  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; txns: Txn[] }>();
    filtered.forEach(t => {
      const key = monthKey(t.txn_date);
      if (!map.has(key)) map.set(key, { label: monthLabel(t.txn_date), txns: [] });
      map.get(key)!.txns.push(t);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([, v]) => v);
  }, [filtered]);

  const totalCredits = filtered.filter(t => t.txn_type === "credit").reduce((s, t) => s + Number(t.amount), 0);
  const totalDebits  = filtered.filter(t => t.txn_type === "debit").reduce((s, t) => s + Number(t.amount), 0);
  const netFlow      = totalCredits - totalDebits;

  const hasFilters = search || typeFilter !== "all" || catFilter !== "all" || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch(""); setType("all"); setCat("all");
    setDateFrom(""); setDateTo("");
  };

  if (!session) return null;
  const accountLabel = ACCOUNT_LABELS[session.accountType] ?? session.accountType;

  return (
    <div className="container-x py-8 max-w-4xl">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] text-brand-green hover:underline underline-offset-4 mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
      </Link>

      <div className="bg-white border border-border shadow-sm">
        <div className="h-1 bg-brand-green" />

        {/* ── Header ── */}
        <div className="px-8 py-6 border-b border-border flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-brand-green" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-green">Online Banking</span>
            </div>
            <h1 className="font-serif text-2xl text-ink">Transaction History</h1>
            <p className="text-[13px] text-ink/50 mt-1">{accountLabel}</p>
          </div>
          <div ref={exportRef} className="relative">
            <button
              onClick={() => setShowExportMenu(v => !v)}
              disabled={filtered.length === 0}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-green border border-brand-green/40 px-4 py-2 hover:bg-brand-green/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors select-none"
            >
              <Download className="w-3.5 h-3.5" />
              Export
              {showExportMenu
                ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border shadow-lg z-20">
                <button
                  onClick={() => { exportCSV(filtered, accountLabel); setShowExportMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-ink hover:bg-secondary/60 transition-colors text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-brand-green shrink-0" />
                  <div>
                    <p className="font-semibold leading-none">CSV</p>
                    <p className="text-[11px] text-ink/40 mt-0.5">Spreadsheet format</p>
                  </div>
                </button>
                <div className="border-t border-border" />
                <button
                  onClick={() => { exportPDF(filtered, accountLabel, totalCredits, totalDebits); setShowExportMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-ink hover:bg-secondary/60 transition-colors text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <div>
                    <p className="font-semibold leading-none">PDF</p>
                    <p className="text-[11px] text-ink/40 mt-0.5">Printable statement</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Summary stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border border-b border-border">
          {[
            {
              label: "Transactions",
              value: filtered.length.toString(),
              icon: ArrowLeftRight,
              color: "text-ink",
            },
            {
              label: "Total Credits",
              value: fmt(totalCredits),
              icon: TrendingUp,
              color: "text-emerald-600",
            },
            {
              label: "Total Debits",
              value: fmt(totalDebits),
              icon: TrendingDown,
              color: "text-ink",
            },
            {
              label: "Net Flow",
              value: fmt(Math.abs(netFlow)),
              icon: netFlow >= 0 ? TrendingUp : TrendingDown,
              color: netFlow >= 0 ? "text-emerald-600" : "text-red-500",
              prefix: netFlow >= 0 ? "+" : "−",
            },
          ].map(({ label, value, icon: Icon, color, prefix }) => (
            <div key={label} className="px-5 py-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/35">{label}</p>
              </div>
              <p className={`font-serif text-xl font-semibold ${color}`}>
                {prefix}{value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="px-6 py-4 border-b border-border bg-secondary/30">
          {/* Search + toggle */}
          <div className="flex gap-3 items-center flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/30" />
              <input
                type="text"
                placeholder="Search transactions…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-[13px] border border-border bg-white outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(v => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold border transition-colors ${
                showFilters || hasFilters
                  ? "border-brand-green bg-brand-green/5 text-brand-green"
                  : "border-border bg-white text-ink/60 hover:border-brand-green/40 hover:text-ink"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
              {hasFilters && (
                <span className="bg-brand-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {[typeFilter !== "all", catFilter !== "all", !!dateFrom, !!dateTo].filter(Boolean).length}
                </span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-[12px] text-ink/45 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>

          {/* Expanded filter row */}
          {showFilters && (
            <div className="grid sm:grid-cols-4 gap-3 mt-3">
              {/* Type */}
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 mb-1 flex items-center gap-1">
                  <ArrowLeftRight className="w-3 h-3" /> Type
                </label>
                <div className="flex border border-border overflow-hidden">
                  {(["all", "credit", "debit"] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setType(v)}
                      className={`flex-1 py-1.5 text-[12px] font-semibold capitalize transition-colors ${
                        typeFilter === v
                          ? "bg-brand-green text-white"
                          : "bg-white text-ink/55 hover:bg-secondary"
                      }`}
                    >
                      {v === "all" ? "All" : v === "credit" ? "Credits" : "Debits"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Category
                </label>
                <div className="relative">
                  <select
                    value={catFilter}
                    onChange={e => setCat(e.target.value)}
                    className="w-full border border-border bg-white px-3 py-1.5 text-[13px] text-ink outline-none focus:border-brand-green appearance-none pr-8 transition-all"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/30 pointer-events-none" />
                </div>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-full border border-border bg-white px-3 py-1.5 text-[13px] text-ink outline-none focus:border-brand-green transition-all"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-full border border-border bg-white px-3 py-1.5 text-[13px] text-ink outline-none focus:border-brand-green transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Transaction list ── */}
        <div className="px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-ink/40 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading transactions…
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-ink/35">
              <FileText className="w-10 h-10 opacity-30" />
              <p className="text-sm font-semibold">No transactions yet</p>
              <p className="text-[12px] text-center">Your transaction history will appear here once activity begins.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-ink/35">
              <Search className="w-10 h-10 opacity-30" />
              <p className="text-sm font-semibold">No matching transactions</p>
              <p className="text-[12px]">Try adjusting your filters.</p>
              <button onClick={clearFilters} className="mt-1 text-[13px] text-brand-green font-semibold hover:underline underline-offset-4">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map(({ label, txns }) => {
                const mCredits = txns.filter(t => t.txn_type === "credit").reduce((s, t) => s + Number(t.amount), 0);
                const mDebits  = txns.filter(t => t.txn_type === "debit").reduce((s, t) => s + Number(t.amount), 0);
                return (
                  <div key={label}>
                    {/* Month header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-brand-green" />
                        <span className="text-[12px] font-bold text-ink uppercase tracking-wider">{label}</span>
                        <span className="text-[11px] text-ink/35">· {txns.length} transaction{txns.length !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="hidden sm:flex items-center gap-4 text-[12px]">
                        {mCredits > 0 && (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <TrendingUp className="w-3 h-3" /> +{fmt(mCredits)}
                          </span>
                        )}
                        {mDebits > 0 && (
                          <span className="flex items-center gap-1 text-ink/60 font-semibold">
                            <TrendingDown className="w-3 h-3" /> −{fmt(mDebits)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rows */}
                    <div className="border border-border divide-y divide-border">
                      {txns.map(tx => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/40 transition-colors"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold border shrink-0 ${
                              tx.txn_type === "debit"
                                ? "bg-red-50 border-red-100 text-red-400"
                                : "bg-emerald-50 border-emerald-100 text-emerald-500"
                            }`}>
                              {tx.txn_type === "debit" ? "−" : "+"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-ink truncate">{tx.description}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-ink/40">{tx.txn_date}</span>
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 border rounded-sm ${categoryColor(tx.category)}`}>
                                  {tx.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className={`text-[14px] font-bold tabular-nums shrink-0 ml-4 ${
                            tx.txn_type === "debit" ? "text-ink" : "text-emerald-600"
                          }`}>
                            {tx.txn_type === "debit" ? "−" : "+"}{fmt(Math.abs(Number(tx.amount)))}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Footer count */}
              <p className="text-center text-[12px] text-ink/35 pt-2">
                Showing {filtered.length} of {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
