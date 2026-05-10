import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Linkedin, Search } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-brand-green text-white">
      <div className="container-x py-14 grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
        <div>
          <div className="bg-white inline-block p-4">
            <Logo />
          </div>
          <p className="font-serif text-2xl mt-6 leading-snug">
            Banking on each other.
            <br />
            Building stronger communities.<sup className="text-sm">®</sup>
          </p>
          <div className="flex gap-3 mt-6">
            {[Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social" className="w-9 h-9 rounded-full border border-white/40 inline-flex items-center justify-center hover:bg-white hover:text-brand-green transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-2xl text-white mb-4">I'm looking for…</h3>
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="search"
              placeholder="Search for…"
              className="flex-1 bg-white text-ink px-4 py-3 outline-none"
              aria-label="Search"
            />
            <button type="submit" className="bg-white text-brand-green px-5 border-l border-border" aria-label="Submit search">
              <Search className="w-5 h-5" />
            </button>
          </form>
          <h4 className="font-sans uppercase text-sm font-bold tracking-wide mt-6 mb-3">Popular Searches:</h4>
          <ul className="space-y-2 text-[15px]">
            <li>Routing #314977104</li>
            <li><a href="#" className="underline underline-offset-4 hover:no-underline">Rates</a></li>
            <li><a href="#" className="underline underline-offset-4 hover:no-underline">Debit Cards</a></li>
            <li><a href="#" className="underline underline-offset-4 hover:no-underline">A+ Mobile App</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="container-x py-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-xs text-white/85">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-12 h-12 border border-white/40 text-[10px] text-center leading-tight">NCUA</span>
            <span className="inline-flex items-center justify-center w-12 h-12 border border-white/40 text-[10px] text-center leading-tight">Equal<br/>Housing</span>
            <p className="max-w-md">
              Your savings federally insured to at least $250,000 by the National Credit Union Administration, a U.S. Government Agency.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Disclosures</a>
            <a href="#" className="hover:underline">Accessibility</a>
            <a href="#" className="hover:underline">Site Map</a>
            <span>© {new Date().getFullYear()} A+ Federal Credit Union</span>
          </div>
        </div>
      </div>
    </footer>
  );
}