import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";
import { LoanCard } from "@/components/loans/LoanCard";
import { LoanBenefits } from "@/components/loans/LoanBenefits";
import { HOME_LOAN_PRODUCTS, HOME_LOAN_RATES } from "@/data/loans";

export const Route = createFileRoute("/loans/home-loans")({
  head: () => ({
    meta: [
      { title: "Home Loans — A+ Federal Credit Union" },
      { name: "description", content: "A+FCU home loans: mortgage purchase, refinance, home equity, and HELOC. Competitive rates, local underwriting, and fast closings." },
    ],
  }),
  component: HomeLoansPage,
});

const MORTGAGE_CHECKLIST = [
  "Government-issued ID (driver's license or passport)",
  "Last 2 years of W-2s or tax returns",
  "Most recent 30 days of pay stubs",
  "Last 2 months of bank statements",
  "Current mortgage statement (if refinancing)",
  "Homeowners insurance information",
];

function HomeLoansPage() {
  return (
    <>
      <SplitHero
        eyebrow="Home Loans"
        title="Your Dream Home Starts with the Right Mortgage."
        body="A+FCU offers competitive home loan rates, local underwriting, and dedicated mortgage advisors — from your first home to your forever home."
      />

      <section className="bg-brand-yellow/20 border-b border-brand-yellow py-5">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-ink text-sm">
            🏠 <strong>Limited-Time Offer:</strong> Close on your new home by September 30 and get a $500 lender credit.*
          </p>
          <Link to="/join" className="shrink-0 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-5 py-2 font-semibold text-sm transition-colors">
            Get Pre-Approved <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Home Loan Products</p>
            <h2 className="font-serif text-3xl md:text-4xl">Every type of home financing, in one place.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOME_LOAN_PRODUCTS.map((product, i) => (
              <LoanCard key={product.id} {...product} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section id="rates" className="bg-brand-cream py-16">
        <div className="container-x max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Today's Rates</p>
            <h2 className="font-serif text-3xl md:text-4xl">Current Home Loan Rates</h2>
            <p className="text-muted-foreground mt-3 text-sm">Rates effective today. Subject to change without notice.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white shadow-sm">
              <thead>
                <tr className="bg-brand-green text-white">
                  <th className="text-left p-4 font-semibold">Product</th>
                  <th className="text-center p-4 font-semibold">Rate</th>
                  <th className="text-center p-4 font-semibold">APR</th>
                  <th className="text-center p-4 font-semibold">Points</th>
                  <th className="text-center p-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {HOME_LOAN_RATES.map((row, i) => (
                  <tr key={row.product} className={i % 2 === 0 ? "bg-white" : "bg-brand-cream/60"}>
                    <td className="p-4 font-medium text-ink">{row.product}</td>
                    <td className="p-4 text-center font-serif text-lg text-brand-green font-semibold">{row.rate}</td>
                    <td className="p-4 text-center text-muted-foreground">{row.apr}</td>
                    <td className="p-4 text-center text-muted-foreground">{row.points}</td>
                    <td className="p-4 text-center">
                      <Link to="/join" className="text-brand-green text-xs font-semibold underline underline-offset-4 hover:no-underline whitespace-nowrap">
                        Apply →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4 italic">
            *APR = Annual Percentage Rate. Rates shown are sample rates and subject to change without notice. All loans subject to credit approval. Lender credit offer valid for purchase loans closing by September 30.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-start max-w-5xl">
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Get Ready to Apply</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">What You'll Need for Your Mortgage Application</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Gathering these documents before you apply helps speed up the approval process and gets you to the closing table faster.
            </p>
            <ul className="space-y-3">
              {MORTGAGE_CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/join" className="mt-8 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm transition-colors">
              Start Your Application <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-brand-cream border border-border p-8">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-4">Mortgage Calculators</p>
            <div className="space-y-4">
              {[
                { title: "How Much Can I Afford?", desc: "Estimate the home price and monthly payment that fits your budget." },
                { title: "Mortgage Payment Calculator", desc: "Calculate your estimated monthly principal and interest payment." },
                { title: "Refinance Savings Calculator", desc: "See how much you could save by refinancing to a lower rate." },
                { title: "Home Equity Calculator", desc: "Find out how much equity you have and what you could borrow." },
              ].map(({ title, desc }) => (
                <a key={title} href="#" className="flex items-start justify-between gap-4 p-4 bg-white border border-border hover:border-brand-green group transition-colors">
                  <div>
                    <p className="font-semibold text-sm group-hover:text-brand-green transition-colors">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-green shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LoanBenefits />

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Speak with a Mortgage Advisor</h2>
          <p className="text-muted-foreground text-sm mb-6">Our local mortgage team is ready to guide you every step of the way — from pre-approval to closing day.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Apply Online <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              Schedule a Call
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
