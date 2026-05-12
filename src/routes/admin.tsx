import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Globe, ChevronRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV = [
  { label: "Applications", icon: LayoutDashboard, href: "/admin" },
];

function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#f2f4f5] overflow-hidden">

      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="w-60 shrink-0 flex flex-col bg-white border-r border-border shadow-sm">

        {/* Brand */}
        <div className="border-b border-border px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-green flex items-center justify-center text-white font-bold text-sm shrink-0">
              A+
            </div>
            <div>
              <p className="text-ink font-bold text-sm leading-none">A+ Federal</p>
              <p className="text-ink/40 text-[11px] leading-none mt-0.5">Credit Union</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-green bg-brand-green/8 border border-brand-green/20 px-2 py-0.5">
              Admin Console
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 px-3 mb-2">Management</p>
          {NAV.map(({ label, icon: Icon, href }) => {
            const active = location.pathname === href || (href !== "/admin" && location.pathname.startsWith(href));
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-[14px] font-semibold transition-colors",
                  active
                    ? "bg-brand-green/10 text-brand-green border-l-[3px] border-brand-green pl-[9px]"
                    : "text-ink/60 hover:text-ink hover:bg-secondary rounded"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-brand-green/60" />}
              </Link>
            );
          })}

          <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 px-3 mt-6 mb-2">Members</p>
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-semibold text-ink/60 hover:text-ink hover:bg-secondary rounded transition-colors"
          >
            <Users className="w-4 h-4 shrink-0" />
            All Members
          </Link>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border space-y-0.5">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded text-[14px] font-semibold text-ink/50 hover:text-brand-green hover:bg-brand-green/5 transition-colors"
          >
            <Globe className="w-4 h-4" />
            View Public Site
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-[14px] font-semibold text-ink/50 hover:text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <div className="px-3 pt-3 mt-2 border-t border-border">
            <p className="text-[10px] text-ink/30 leading-relaxed">
              © {new Date().getFullYear()} A+ Federal Credit Union<br />
              Federally insured by NCUA
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
