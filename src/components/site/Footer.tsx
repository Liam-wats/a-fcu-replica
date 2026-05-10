import { Facebook, Instagram, Linkedin, Apple, Smartphone } from "lucide-react";
import { Logo } from "./Logo";

const PRIMARY_LINKS = [
  "Fee Schedule",
  "Careers",
  "Blog",
  "Recognition",
  "Site Map",
  "Accessibility Statement",
  "Privacy Policy",
];

export function Footer() {
  return (
    <footer className="bg-white">
      {/* Green banner */}
      <div className="bg-secondary pt-12">
        <div className="container-x">
          <div className="bg-brand-green text-white inline-block px-8 py-7 max-w-xl">
            <p className="font-serif text-2xl md:text-3xl leading-snug">
              Banking on each other.
              <br />
              Building stronger communities.<sup className="text-sm">®</sup>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-secondary pt-10 pb-12">
        <div className="container-x grid lg:grid-cols-[1.4fr_1fr] gap-10">
          <div>
            <div className="flex items-start gap-8 flex-wrap">
              <Logo />
              <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                {PRIMARY_LINKS.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-brand-green underline underline-offset-4 hover:no-underline font-semibold text-[15px]">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-ink/70 mt-8 max-w-lg italic leading-relaxed">
              If you're using a screen reader and are having problems using this website, please call{" "}
              <a href="tel:5123026800" className="underline">512.302.6800</a> for assistance.
            </p>
            <p className="text-xs text-ink/70 mt-3 max-w-lg italic leading-relaxed">
              Since changes may be made to the info on our website without advance notice, for the most up-to-date information, please call{" "}
              <a href="tel:5123026800" className="underline">512.302.6800</a>.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-ink mb-3">Download The A+ Mobile App</h4>
            <div className="flex gap-3">
              <a href="#" aria-label="Apple App Store" className="w-10 h-10 border border-ink/30 inline-flex items-center justify-center hover:bg-white">
                <Apple className="w-5 h-5 text-ink" />
              </a>
              <a href="#" aria-label="Google Play" className="w-10 h-10 border border-ink/30 inline-flex items-center justify-center hover:bg-white">
                <Smartphone className="w-5 h-5 text-ink" />
              </a>
            </div>
            <h4 className="font-bold text-ink mt-7 mb-3">Connect With Us</h4>
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social"
                  className="w-10 h-10 border border-ink/30 inline-flex items-center justify-center hover:bg-white"
                >
                  <Icon className="w-5 h-5 text-ink" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-secondary border-t border-border">
        <div className="container-x py-6 flex flex-col md:flex-row gap-4 items-center justify-center text-xs text-ink/70">
          <span>Routing #314977104</span>
          <span className="hidden md:inline">|</span>
          <span className="font-semibold">Equal Housing LENDER</span>
          <span className="hidden md:inline">|</span>
          <span>NMLS #405608</span>
          <span className="hidden md:inline">|</span>
          <a href="#" className="text-brand-green underline underline-offset-4 hover:no-underline">Insured by NCUA</a>
        </div>
        <div className="container-x pb-6 text-center text-xs text-ink/60">
          © {new Date().getFullYear()} A+ Federal Credit Union
        </div>
      </div>
    </footer>
  );
}
