import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Search, User } from "lucide-react";
import { Logo } from "./Logo";
import { UtilityBar } from "./UtilityBar";
import { NAV } from "@/data/site";

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <UtilityBar />
      <div className="container-x flex items-center justify-between h-20 lg:h-24">
        <Logo />

        <nav
          className="hidden lg:flex items-center gap-1"
          onMouseLeave={() => setOpen(null)}
        >
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpen(item.label)}
            >
              <Link
                to={item.href}
                className="px-4 py-3 text-[15px] font-semibold text-ink hover:text-brand-green inline-flex items-center gap-1"
              >
                {item.label}
                <svg className="w-3 h-3 opacity-60" viewBox="0 0 12 12" fill="currentColor"><path d="M2 4l4 4 4-4z"/></svg>
              </Link>
              {open === item.label && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1">
                  <div className="bg-white border border-border shadow-xl p-6 grid grid-cols-2 gap-x-8 gap-y-4 min-w-[480px]">
                    {item.columns.map((col) => (
                      <div key={col.title}>
                        <h4 className="text-sm font-bold text-brand-green mb-2 font-sans">{col.title}</h4>
                        <ul className="space-y-1.5">
                          {col.links.map((l) => (
                            <li key={l}>
                              <Link to={item.href} className="text-sm text-ink hover:text-brand-green hover:underline">
                                {l}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="lg:hidden flex items-center gap-3">
          <button aria-label="Search" className="p-2"><Search className="w-5 h-5" /></button>
          <a href="#login" aria-label="Login" className="p-2 bg-brand-green text-white"><User className="w-5 h-5" /></a>
          <button aria-label="Menu" className="p-2" onClick={() => setMobile(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="h-[3px] bg-brand-green" />

      {mobile && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto lg:hidden">
          <div className="container-x flex items-center justify-between h-20">
            <Logo />
            <button aria-label="Close menu" onClick={() => setMobile(false)} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="h-[3px] bg-brand-green" />
          <nav className="container-x py-6">
            {NAV.map((item) => (
              <details key={item.label} className="border-b border-border py-3">
                <summary className="flex items-center justify-between font-semibold text-lg cursor-pointer list-none">
                  {item.label}
                  <span className="text-brand-green">+</span>
                </summary>
                <div className="mt-3 pl-2 space-y-3">
                  {item.columns.map((col) => (
                    <div key={col.title}>
                      <h5 className="text-sm font-bold text-brand-green mb-1">{col.title}</h5>
                      <ul className="space-y-1">
                        {col.links.map((l) => (
                          <li key={l}><Link to={item.href} onClick={() => setMobile(false)} className="text-sm">{l}</Link></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            ))}
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Link to="/accounts" onClick={() => setMobile(false)} className="border border-border py-3 text-center">Join</Link>
              <Link to="/guidance" onClick={() => setMobile(false)} className="border border-border py-3 text-center">Rates</Link>
              <Link to="/locations" onClick={() => setMobile(false)} className="border border-border py-3 text-center">Locations</Link>
              <Link to="/contact-us" onClick={() => setMobile(false)} className="border border-border py-3 text-center">Contact</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}