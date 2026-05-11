import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Building2, CreditCard, Landmark } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";
import { LoanBenefits } from "@/components/loans/LoanBenefits";
import { BUSINESS_LOAN_PRODUCTS } from "@/data/business";

const LOAN_ICONS = [CreditCard, Building2, Landmark];

const USE_CASES = [
  { title: "Equipment Financing", desc: "Purchase machinery, vehicles, computers, or any equipment your business relies on — without draining your operating cash." },
  { title: "Expansion & Renovation", desc: "Fund a new location, remodel your existing space, or build out for new capacity as your business grows." },
  { title: "Working Capital", desc: "Cover payroll, inventory orders, or seasonal cash flow gaps with a flexible line of credit." },
  { title: "Commercial Property", desc: "Stop paying rent and own the building your business occupies — or invest in income-producing commercial real estate." },
  { title: "Business Acquisition", desc: "Finance the purchase of an existing business or franchise with a structured term loan." },
  { title: "Debt Consolidation", desc: "Consolidate high-rate business debt into a single, lower monthly payment to simplify cash management." },
];

const PROCESS_STEPS = [
  { n: "1", title: "Apply Online or In Branch", desc: "Complete our business loan application with basic information about your business, finances, and financing needs." },
  { n: "2", title: "Work with a Local Lender", desc: "A dedicated A+FCU business lending officer reviews your application and contacts you — usually within 1–2 business days." },
  { n: "3", title: "Get a Decision", desc: "Because we underwrite locally, decisions are faster. Many loans close within 2–3 weeks of approval." },
  { n: "4", title: "Receive Your Funds", desc: "Funds are deposited directly to your A+FCU business account so you can put them to work immediately." },
];

const CRE_FEATURES = [
  "Owner-occupied and investment commercial properties",
  "Multi-family residential (5+ units)",
  "Office, retail, industrial, and mixed-use",
  "Construction and land development loans",
  "SBA 504 and SBA 7(a) programs available",
  "Competitive fixed and variable rate options",
  "Terms up to 25 years with amortization options",
  "Local underwriting for faster approvals",
  "Dedicated commercial real estate officer",
];

export const Route = createFileRoute("/business/lending")({
  component: BusinessLendingPage,
});

function BusinessLendingPage() {
  return (
    <>
      <SplitHero
        eyebrow="Business Lending"
        title="Capital to Grow Your Business, Your Way."
        body="From short-term lines of credit to long-term commercial real estate financing — A+FCU business loans are made by local lenders who understand the Austin market."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Lending Products</p>
            <h2 className="font-serif text-3xl md:text-4xl">Find the right financing for your goals.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {BUSINESS_LOAN_PRODUCTS.map((product, i) => {
              const Icon = LOAN_ICONS[i];
              return (
                <div key={product.id} className={`flex flex-col border-2 transition-shadow hover:shadow-lg ${i === 0 ? "border-brand-green" : "border-border"}`}>
                  {i === 0 ? (
                    <div className="px-6 py-2 bg-brand-green text-white text-xs font-bold uppercase tracking-wider">{product.badge}</div>
                  ) : (
                    <div className="h-[33px]" />
                  )}
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="w-12 h-12 bg-brand-green/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-brand-green" />
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl text-ink">{product.name}</h3>
                    <p className="mt-1.5 text-muted-foreground text-sm">{product.tagline}</p>
                    <div className="mt-5 grid grid-cols-2 gap-3 border-y border-border py-4">
                      {[
                        { label: "Starting APR", value: product.apr },
                        { label: "Term", value: product.term },
                      ].map(({ label, value }) => (
                        <div key={label} className="text-center">
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
                          <p className="font-serif text-base font-semibold text-brand-green mt-0.5">{value}</p>
                        </div>
                      ))}
                    </div>
                    <ul className="mt-5 space-y-2.5 flex-1">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-ink/80">
                          <Check className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#"
                      className={`mt-8 inline-flex items-center justify-center gap-2 py-3 px-6 font-semibold text-sm transition-colors ${i === 0 ? "bg-brand-green hover:bg-brand-green-dark text-white" : "border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white"}`}
                    >
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-6 italic text-center">Rates are subject to change. Credit approval required. Terms based on creditworthiness and collateral.</p>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Use Cases</p>
            <h2 className="font-serif text-3xl md:text-4xl">What will you do with your business loan?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {USE_CASES.map((item) => (
              <div key={item.title} className="bg-white border border-border p-6 hover:border-brand-green hover:shadow-sm transition-all">
                <h3 className="font-semibold text-base mb-2 text-ink">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">The Process</p>
            <h2 className="font-serif text-3xl md:text-4xl">Applying for a business loan is simple.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step) => (
              <div key={step.n} className="text-center bg-brand-cream border border-border p-6">
                <div className="w-12 h-12 rounded-full bg-brand-green text-white font-bold font-serif text-xl flex items-center justify-center mx-auto mb-4">
                  {step.n}
                </div>
                <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-start max-w-5xl">
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Commercial Real Estate</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Own the Space Where Your Business Thrives.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Owning your commercial property builds equity, eliminates rent uncertainty, and can generate tax benefits. A+FCU offers competitive commercial real estate financing for owner-occupied and investment properties throughout Austin and Central Texas.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Work directly with our local commercial lending officers — no waiting on decisions from out-of-state committees.
            </p>
            <ul className="space-y-2.5">
              {CRE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink/80">
                  <Check className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/q2-mortgage-purchase_may26_homepage-hero.webp"
            alt="Commercial building financed by A+FCU"
            className="w-full h-auto"
          />
        </div>
      </section>

      <LoanBenefits />

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Ready to talk about business financing?</h2>
          <p className="text-muted-foreground text-sm mb-6">Our business lending team is ready to help you find the right solution for your goals.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Apply for a Business Loan <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              Talk to a Lender
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
