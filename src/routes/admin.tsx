import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Users, LogOut, ChevronRight } from "lucide-react";
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
    <div className="flex h-screen bg-[#0f1117] overflow-hidden">
      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-white/[0.06]">
        {/* Brand */}
        <div className="h-14 flex items-center px-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-green flex items-center justify-center text-white font-bold text-sm">
              A+
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-none">A+FCU</p>
              <p className="text-white/35 text-[10px] leading-none mt-0.5">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ label, icon: Icon, href }) => {
            const active = location.pathname === href || (href !== "/admin" && location.pathname.startsWith(href));
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-40" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-0.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Users className="w-4 h-4" />
            View Site
          </Link>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f4f5f7]">
        <Outlet />
      </div>
    </div>
  );
}
