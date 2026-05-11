import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Search, User, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { NAV } from "@/data/site";

const UTIL_LINKS = [
  { label: "Join", href: "/join" },
  { label: "Rates", href: "/guidance" },
  { label: "Locations", href: "/locations" },
];

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      {/* ── Main bar ── */}
      <div className="flex items-stretch">

        {/* Green left accent */}
        <div className="w-1.5 shrink-0 bg-brand-green" />

        {/* Logo */}
        <div className="flex items-center px-5 lg:px-8 border-r border-border shrink-0">
          <Logo />
        </div>

        {/* Center: utility row + nav row */}
        <div
          className="flex-1 flex flex-col min-w-0"
          onMouseLeave={() => setOpen(null)}
        >
          {/* ── Utility row ── */}
          <div className="hidden lg:flex items-center justify-end gap-5 px-6 lg:px-8 h-10 border-b border-border text-[13px] text-ink/80">
            {UTIL_LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className="hover:text-brand-green transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-0.5 hover:text-brand-green transition-colors"
            >
              Contact Us <ChevronDown className="w-3 h-3" />
            </Link>
            <button className="inline-flex items-center gap-1 hover:text-brand-green transition-colors">
              Search <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ── Nav row ── */}
          <nav className="hidden lg:flex items-center px-2 lg:px-4 h-14">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpen(item.label)}
              >
                <Link
                  to={item.href}
                  className="px-3.5 py-2 text-[14.5px] font-semibold text-ink hover:text-brand-green inline-flex items-center gap-1 whitespace-nowrap transition-colors"
                >
                  {item.label}
                  <svg className="w-3 h-3 opacity-50" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M2 4l4 4 4-4z" />
                  </svg>
                </Link>

                {open === item.label && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 z-50">
                    <div className="bg-white border border-border shadow-xl p-6 grid grid-cols-2 gap-x-8 gap-y-4 min-w-[480px]">
                      {item.columns.map((col) => (
                        <div key={col.title}>
                          <h4 className="text-sm font-bold text-brand-green mb-2 font-sans">
                            {col.title}
                          </h4>
                          <ul className="space-y-1.5">
                            {col.links.map((l) => {
                              const label = typeof l === "string" ? l : l.label;
                              const href = typeof l === "string" ? item.href : l.href;
                              return (
                                <li key={label}>
                                  <Link
                                    to={href}
                                    className="text-sm text-ink hover:text-brand-green hover:underline"
                                    onClick={() => setOpen(null)}
                                  >
                                    {label}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ── Mobile: single centered row ── */}
          <div className="flex lg:hidden items-center justify-between px-4 h-16">
            <Logo />
            <div className="flex items-center gap-2">
              <button aria-label="Search" className="p-2">
                <Search className="w-5 h-5" />
              </button>
              <button
                aria-label="Menu"
                className="p-2"
                onClick={() => setMobile(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Login button (right, full height) ── */}
        <a
          href="#login"
          className="hidden lg:flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 font-semibold text-sm transition-colors shrink-0 self-stretch"
        >
          <User className="w-4 h-4" />
          Login
        </a>
      </div>

      {/* ── Yellow accent strip ── */}
      <div className="h-1.5 bg-brand-yellow" />

      {/* ── Mobile drawer ── */}
      {mobile && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto lg:hidden">
          <div className="flex items-center justify-between px-4 h-16 border-b border-border">
            <Logo />
            <button aria-label="Close menu" onClick={() => setMobile(false)} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="h-1.5 bg-brand-yellow" />

          <nav className="px-4 py-6">
            {NAV.map((item) => (
              <details key={item.label} className="border-b border-border py-3">
                <summary className="flex items-center justify-between font-semibold text-lg cursor-pointer list-none">
                  {item.label}
                  <span className="text-brand-green text-xl leading-none">+</span>
                </summary>
                <div className="mt-3 pl-2 space-y-3">
                  {item.columns.map((col) => (
                    <div key={col.title}>
                      <h5 className="text-sm font-bold text-brand-green mb-1">{col.title}</h5>
                      <ul className="space-y-1">
                        {col.links.map((l) => {
                          const label = typeof l === "string" ? l : l.label;
                          const href = typeof l === "string" ? item.href : l.href;
                          return (
                            <li key={label}>
                              <Link
                                to={href}
                                onClick={() => setMobile(false)}
                                className="text-sm text-ink hover:text-brand-green"
                              >
                                {label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            ))}

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {UTIL_LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  onClick={() => setMobile(false)}
                  className="border border-border py-3 text-center hover:border-brand-green transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/contact-us"
                onClick={() => setMobile(false)}
                className="border border-border py-3 text-center hover:border-brand-green transition-colors"
              >
                Contact Us
              </Link>
              <a
                href="#login"
                onClick={() => setMobile(false)}
                className="bg-brand-green text-white py-3 text-center font-semibold"
              >
                Login
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
