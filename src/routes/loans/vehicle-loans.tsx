import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";
import { LoanCard } from "@/components/loans/LoanCard";
import { LoanBenefits } from "@/components/loans/LoanBenefits";
import { VEHICLE_LOAN_PRODUCTS, VEHICLE_LOAN_RATES } from "@/data/loans";

export const Route = createFileRoute("/loans/vehicle-loans")({
  head: () => ({
    meta: [
      { title: "Vehicle Loans — A+ Federal Credit Union" },
      { name: "description", content: "Finance or refinance your car, truck, RV, boat, or motorcycle with A+FCU vehicle loans. Rates as low as 5.49% APR, terms up to 84 months." },
    ],
  }),
  component: VehicleLoansPage,
});

const TIPS = [
  { title: "Get Pre-Approved First", desc: "Know your budget before you walk onto the lot. Pre-approval gives you the confidence to negotiate a better price." },
  { title: "Compare Total Cost, Not Just Payment", desc: "A longer term lowers your monthly payment but increases the total interest paid. Use our calculator to compare." },
  { title: "Consider GAP Coverage", desc: "If your vehicle is totaled, GAP coverage pays the difference between what you owe and what insurance covers." },
];

function VehicleLoansPage() {
  return (
    <>
      <SplitHero
        eyebrow="Vehicle Loans"
        title="Hit the Road with a Rate You'll Love."
        body="Whether you're buying new, used, or refinancing your current auto loan — A+FCU offers competitive rates and fast, local decisions."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Vehicle Loan Products</p>
            <h2 className="font-serif text-3xl md:text-4xl">Every ride. Every rate. Right here.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VEHICLE_LOAN_PRODUCTS.map((product, i) => (
              <LoanCard key={product.id} {...product} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Current Rates</p>
            <h2 className="font-serif text-3xl md:text-4xl">Vehicle Loan Rates</h2>
            <p className="text-muted-foreground mt-3 text-sm">Rates effective today. Subject to change without notice.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white shadow-sm">
              <thead>
                <tr className="bg-brand-green text-white">
                  <th className="text-left p-4 font-semibold">Product</th>
                  <th className="text-center p-4 font-semibold">As Low As APR</th>
                  <th className="text-center p-4 font-semibold">Max LTV</th>
                  <th className="text-center p-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {VEHICLE_LOAN_RATES.map((row, i) => (
                  <tr key={row.product} className={i % 2 === 0 ? "bg-white" : "bg-brand-cream/60"}>
                    <td className="p-4 font-medium text-ink">{row.product}</td>
                    <td className="p-4 text-center font-serif text-lg text-brand-green font-semibold">{row.apr}</td>
                    <td className="p-4 text-center text-muted-foreground">{row.ltv}</td>
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
            APR = Annual Percentage Rate. Rates shown are as low as and subject to change. All loans subject to credit approval. LTV = Loan-to-Value ratio.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/q2-personal-loan_may26_homepage-hero.webp"
            alt="Person financing a vehicle with A+FCU"
            className="w-full h-auto"
          />
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Smart Buying Tips</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Get More from Your Auto Loan</h2>
            <div className="space-y-6">
              {TIPS.map(({ title, desc }) => (
                <div key={title}>
                  <h3 className="font-semibold text-base mb-1.5">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <Link to="/join" className="mt-8 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm transition-colors">
              Get Pre-Approved <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <LoanBenefits />

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Ready to finance your next vehicle?</h2>
          <p className="text-muted-foreground text-sm mb-6">Apply online in minutes and get a decision fast — so you can focus on finding the right ride.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Apply for an Auto Loan <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              Auto Loan Calculator
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
