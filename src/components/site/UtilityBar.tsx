import { Link } from "@tanstack/react-router";
import { Search, User, ChevronDown } from "lucide-react";

const utilLinks = [
  { label: "Join", href: "/join" },
  { label: "Rates", href: "/guidance" },
  { label: "Locations", href: "/locations" },
];

export function UtilityBar() {
  return (
    <div className="hidden lg:block border-b border-border bg-white">
      <div className="w-full px-6 lg:px-10 flex items-center justify-end gap-6 h-10 text-sm">
        {utilLinks.map((l) => (
          <Link key={l.label} to={l.href} className="text-ink hover:text-brand-green transition-colors">
            {l.label}
          </Link>
        ))}
        <Link to="/contact-us" className="text-ink hover:text-brand-green transition-colors inline-flex items-center gap-1">
          Contact Us <ChevronDown className="w-3.5 h-3.5" />
        </Link>
        <button className="text-ink hover:text-brand-green inline-flex items-center gap-1.5">
          Search <Search className="w-3.5 h-3.5" />
        </button>
        <Link
          to="/login"
          className="bg-brand-green hover:bg-brand-green-dark text-white inline-flex items-center gap-2 px-5 py-2.5 -my-px text-sm font-medium transition-colors"
        >
          <User className="w-4 h-4" /> Login
        </Link>
      </div>
    </div>
  );
}