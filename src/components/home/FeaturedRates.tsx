import { ArrowRight, ExternalLink } from "lucide-react";
import { RATES } from "@/data/site";

export function FeaturedRates() {
  return (
    <section className="bg-secondary mt-16 py-16">
      <div className="container-x grid lg:grid-cols-[1fr_2fr] gap-12">
        <div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-ink">
            Today's Featured Rates
          </h2>
          <p className="mt-5 text-ink/80">Compare top rates for A+FCU products.</p>
          <a
            href="#"
            className="mt-6 inline-flex items-center gap-2 bg-brand-green text-white font-semibold px-6 py-3 hover:bg-brand-green/90 transition-colors"
          >
            View All Rates <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-xs text-ink/60 mt-8 max-w-xs italic">
            APR=Annual Percentage Rate. APY=Annual Percentage Yield. Rates and terms subject to change without notice.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
          {RATES.map((r) => {
            const showSplit = r.secondary && r.secondary.toUpperCase() !== "APR" && r.secondary.toUpperCase() !== "APY";
            const unit = r.secondary?.toUpperCase().includes("APY") ? "APY" : "APR";
            // For cards with two numbers, secondary like "6.042% APR" -> split into number + unit
            let secondaryNumber = "";
            if (showSplit) {
              const match = r.secondary.match(/([\d.]+%)/);
              secondaryNumber = match ? match[1] : r.secondary;
            }
            return (
              <div key={r.name} className="bg-white p-6 border border-border hover:shadow-md transition-shadow flex flex-col px-[24px]">
                <img src={r.icon} alt="" className="w-12 h-12 mb-4" />
                <a
                  href="#"
                  className="font-serif text-2xl text-ink hover:text-brand-green inline-flex items-center gap-2 group"
                >
                  {r.name}
                  <ArrowRight className="w-5 h-5 text-ink group-hover:translate-x-0.5 transition-transform" />
                </a>
                <p className="text-sm text-ink/70 mt-1">{r.term}</p>
                <div className="mt-5">
                  {r.primaryLabel && (
                    <p className="text-sm italic text-ink/70">{r.primaryLabel}</p>
                  )}
                  <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                    <span className="font-serif text-2xl md:text-[28px] text-ink leading-none">{r.primary}</span>
                    {showSplit && (
                      <>
                        <span className="text-ink/30 text-xl font-light">|</span>
                        <span className="font-serif text-2xl md:text-[28px] text-ink leading-none">{secondaryNumber}</span>
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-bold text-brand-green tracking-wide">{unit}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}