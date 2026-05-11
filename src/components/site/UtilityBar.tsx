import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, User, ChevronDown, X, LayoutDashboard } from "lucide-react";
import { getMemberSession } from "@/lib/session";

const utilLinks = [
  { label: "Join", href: "/join" },
  { label: "Rates", href: "/guidance/rates" },
  { label: "Locations", href: "/locations" },
];

export function UtilityBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = !!getMemberSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate({ to: "/search", search: { q: query.trim() } });
      setSearchOpen(false);
      setQuery("");
    } else {
      navigate({ to: "/search", search: { q: "" } });
      setSearchOpen(false);
    }
  };

  return (
    <div className="hidden lg:block border-b border-border bg-white relative">
      <div className="w-full px-6 lg:px-10 flex items-center justify-end gap-6 h-10 text-sm">
        {utilLinks.map((l) => (
          <Link key={l.label} to={l.href} className="text-ink hover:text-brand-green transition-colors">
            {l.label}
          </Link>
        ))}
        <Link to="/contact-us" className="text-ink hover:text-brand-green transition-colors inline-flex items-center gap-1">
          Contact Us <ChevronDown className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={() => setSearchOpen((v) => !v)}
          className="text-ink hover:text-brand-green inline-flex items-center gap-1.5 transition-colors"
          aria-label="Open search"
        >
          Search <Search className="w-3.5 h-3.5" />
        </button>
        {isLoggedIn ? (
          <Link
            to="/dashboard"
            className="bg-brand-green hover:bg-brand-green-dark text-white inline-flex items-center gap-2 px-5 py-2.5 -my-px text-sm font-medium transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" /> My Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className="bg-brand-green hover:bg-brand-green-dark text-white inline-flex items-center gap-2 px-5 py-2.5 -my-px text-sm font-medium transition-colors"
          >
            <User className="w-4 h-4" /> Login
          </Link>
        )}
      </div>

      {searchOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setSearchOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 w-full max-w-xl bg-white border border-border shadow-xl px-4 py-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search accounts, loans, rates, locations…"
                className="flex-1 text-sm py-1 focus:outline-none text-ink placeholder:text-muted-foreground"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="text-muted-foreground hover:text-ink">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="bg-brand-green hover:bg-brand-green-dark text-white text-xs font-semibold px-3 py-1.5 transition-colors"
              >
                Go
              </button>
            </form>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Routing Number", "Mortgage Rates", "Auto Loan", "Locations", "Direct Deposit"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    navigate({ to: "/search", search: { q: term } });
                    setSearchOpen(false);
                    setQuery("");
                  }}
                  className="text-xs text-muted-foreground hover:text-brand-green bg-brand-cream px-2 py-1 rounded transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
