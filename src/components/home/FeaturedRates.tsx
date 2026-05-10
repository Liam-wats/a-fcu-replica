import { ExternalLink } from "lucide-react";
import { RATES } from "@/data/site";

export function FeaturedRates() {
  return (
    <section className="bg-secondary mt-16 py-16">
      <div className="container-x grid lg:grid-cols-[1fr_2fr] gap-10">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl">Today's Featured Rates</h2>
          <p className="mt-4 text-ink/75">Compare top rates for A+FCU products.</p>
          <a href="#" className="mt-5 inline-flex items-center gap-2 text-brand-green font-semibold underline underline-offset-4 hover:no-underline">
            View All Rates <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-xs text-ink/60 mt-6 max-w-xs">
            APR=Annual Percentage Rate. APY=Annual Percentage Yield. Rates and terms subject to change without notice.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RATES.map((r) => (
            <div key={r.name} className="bg-white p-5 border border-border hover:shadow-md transition-shadow">
              <img src={r.icon} alt="" className="w-10 h-10 mb-3" />
              <a href="#" className="font-serif text-xl text-brand-green hover:underline">{r.name}</a>
              <p className="text-sm text-ink/70 mt-1">{r.term}</p>
              <div className="mt-4 pt-4 border-t border-border">
                {r.primaryLabel && <p className="text-xs text-ink/60 uppercase tracking-wide">{r.primaryLabel}</p>}
                <p className="font-serif text-3xl text-ink">{r.primary}</p>
                <p className="text-sm text-ink/60 mt-0.5">{r.secondary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}