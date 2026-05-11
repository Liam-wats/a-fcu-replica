import { useState, useEffect } from "react";
import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Shield, Users, LayoutDashboard, LogOut, ChevronRight, Menu, X } from "lucide-react";
import { ADMIN_PASSWORD, ADMIN_AUTH_KEY } from "@/data/admin-users";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function isAuthed(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

function AdminLogin({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
      onAuth();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1923] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-green rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">A+ Federal Credit Union</p>
        </div>

        <div className={`bg-[#1a2535] border border-white/10 p-8 rounded-lg ${shaking ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Admin Password</label>
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Enter password"
                className={`w-full bg-[#0f1923] border ${error ? "border-red-500" : "border-white/10"} text-white px-4 py-2.5 rounded focus:outline-none focus:border-brand-green text-sm`}
              />
              {error && <p className="text-red-400 text-xs mt-1.5">Incorrect password. Try again.</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-2.5 rounded transition-colors text-sm"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-gray-500 text-xs mt-4">Hint: admin1234</p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          <Link to="/" className="hover:text-gray-400 transition-colors">← Back to main site</Link>
        </p>
      </div>
    </div>
  );
}

function AdminLayout() {
  const [authed, setAuthed] = useState(isAuthed);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setAuthed(false);
    navigate({ to: "/admin" });
  };

  if (!authed) {
    return <AdminLogin onAuth={() => setAuthed(true)} />;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Members", href: "/admin/users", icon: Users },
  ];

  const isActive = (href: string) =>
    href === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#0f1923] flex">
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#1a2535] border-r border-white/10 flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-green rounded flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">Admin Panel</p>
              <p className="text-gray-400 text-xs">A+ Federal Credit Union</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                isActive(href)
                  ? "bg-brand-green text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-3">
            <ChevronRight className="w-3 h-3 rotate-180" /> Main site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#1a2535] border-b border-white/10">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-white text-sm font-semibold">Admin Panel</span>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
