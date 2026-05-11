import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Search, User, ArrowRight, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { UtilityBar } from "./UtilityBar";
import { NAV, type NavColumn, type NavItem } from "@/data/site";

const OPEN_DELAY = 80;
const CLOSE_DELAY = 180;

function ColumnBlock({ col }: { col: NavColumn }) {
  if (!col.title) return <div />;
  return (
    <div>
      <Link
        to={col.href || "/"}
        className="group flex items-center justify-between gap-2 pb-2 mb-3 border-b border-border text-ink hover:text-brand-green"
      >
        <span className="font-sans font-bold text-[15px] tracking-tight">{col.title}</span>
        <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
      </Link>
      <ul className="space-y-2.5">
        {col.links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.href}
              className="text-[15px] text-ink hover:text-brand-green hover:underline underline-offset-4"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MegaPanel({ item }: { item: NavItem }) {
  const cols = item.rows[0]?.length ?? 3;
  const gridCols =
    cols === 4 ? "grid-cols-4" : cols === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div
      className="absolute left-0 right-0 top-full bg-white border-t border-border shadow-[0_18px_30px_-18px_rgba(0,0,0,0.18)] animate-in fade-in-0 slide-in-from-top-1 duration-150"
      role="menu"
    >
      <div className="w-full px-6 lg:px-10 py-8 grid grid-cols-[1fr_320px] gap-10">
        <div className="space-y-8">
          {item.rows.map((row, ri) => (
            <div key={ri} className={`grid ${gridCols} gap-x-10 gap-y-2`}>
              {row.map((col, ci) => (
                <ColumnBlock key={`${ri}-${ci}-${col.title}`} col={col} />
              ))}
            </div>
          ))}
        </div>

        <div className="bg-brand-green p-4">
          <Link
            to={item.featured.href}
            className="group block bg-white overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-[16/9] overflow-hidden bg-muted">
              <img
                src={item.featured.image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="font-serif text-[19px] leading-snug text-ink">
                {item.featured.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/70">
                {item.featured.body}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-green uppercase tracking-wide">
                Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const scheduleOpen = (i: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => setOpenIdx(i), OPEN_DELAY);
  };
  const scheduleClose = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenIdx(null), CLOSE_DELAY);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <UtilityBar />

      <div
        className="relative"
        onMouseLeave={scheduleClose}
      >
        <div className="w-full px-6 lg:px-10 flex items-center justify-between h-20 lg:h-24">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {NAV.map((item, i) => {
              const isOpen = openIdx === i;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => scheduleOpen(i)}
                  onFocus={() => scheduleOpen(i)}
                >
                  <Link
                    to={item.href}
                    className={`px-4 py-3 text-[16px] font-bold inline-flex items-center gap-1.5 transition-colors ${
                      isOpen ? "text-brand-green" : "text-ink hover:text-brand-green"
                    }`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 opacity-70 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Link>
                  {/* Active caret indicator */}
                  {isOpen && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-[2px] z-50"
                    >
                      <span className="block w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white" />
                    </span>
                  )}
                </div>
              );
            })}
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

        {openIdx !== null && (
          <div
            onMouseEnter={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
            }}
            onMouseLeave={scheduleClose}
          >
            <MegaPanel item={NAV[openIdx]} />
          </div>
        )}
      </div>

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
              <details key={item.label} className="border-b border-border py-3 group">
                <summary className="flex items-center justify-between font-semibold text-lg cursor-pointer list-none">
                  {item.label}
                  <span className="text-brand-green text-2xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="mt-3 pl-2 space-y-4">
                  {item.rows.flat().filter((c) => c.title).map((col) => (
                    <div key={col.title}>
                      <Link
                        to={col.href || "/"}
                        onClick={() => setMobile(false)}
                        className="block text-sm font-bold text-brand-green mb-1.5 border-b border-border pb-1"
                      >
                        {col.title}
                      </Link>
                      <ul className="space-y-1.5 pt-1">
                        {col.links.map((l) => (
                          <li key={l.label}>
                            <Link
                              to={l.href}
                              onClick={() => setMobile(false)}
                              className="text-sm text-ink"
                            >
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            ))}
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Link to="/join" onClick={() => setMobile(false)} className="border border-border py-3 text-center">Join</Link>
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
