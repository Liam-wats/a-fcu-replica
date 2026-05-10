import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { LoanCard } from "@/components/loans/LoanCard";
import { LoanBenefits } from "@/components/loans/LoanBenefits";
import { PERSONAL_CREDIT_PRODUCTS } from "@/data/loans";

export const Route = createFileRoute("/loans/personal-credit")({
  head: () => ({
    meta: [
      { title: "Personal Credit — A+ Federal Credit Union" },
      { name: "description", content: "A+FCU personal loans, credit cards, and lines of credit. Rates as low as 9.49% APR, funds as fast as the next business day." },
    ],
  }),
  component: PersonalCreditPage,
});

const USE_CASES = [
  { icon: "🏠", label: "Home Improvement" },
  { icon: "🏥", label: "Medical Expenses" },
  { icon: "✈️", label: "Travel & Vacation" },
  { icon: "🎓", label: "Education Costs" },
  { icon: "💳", label: "Debt Consolidation" },
  { icon: "🎉", label: "Life Events" },
];

function PersonalCreditPage() {
  return (
    <>
      <PageHero
        eyebrow="Personal Credit"
        title="Get the Funds You Need. Fast."
        body="Personal loans, credit cards, and lines of credit with no collateral required — apply today, get funds as fast as tomorrow.†"
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Personal Credit Products</p>
            <h2 className="font-serif text-3xl md:text-4xl">Flexible credit built around your life.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PERSONAL_CREDIT_PRODUCTS.map((product, i) => (
              <LoanCard key={product.id} {...product} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Use It For Anything</p>
            <h2 className="font-serif text-3xl md:text-4xl">No restrictions on how you spend.</h2>
            <p className="text-muted-foreground mt-3">An A+FCU personal loan can be used for virtually any purpose.</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {USE_CASES.map(({ icon, label }) => (
              <div key={label} className="bg-white border border-border p-4 text-center hover:border-brand-green transition-colors">
                <div className="text-3xl mb-2">{icon}</div>
                <p className="text-xs font-semibold text-ink">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Personal Loan vs. Line of Credit</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Which one is right for you?</h2>
            <div className="space-y-4">
              <div className="border border-border p-5">
                <p className="font-semibold text-brand-green mb-2">Personal Loan — Best for one-time needs</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You know exactly how much you need. You get a lump sum, a fixed rate, and fixed monthly payments — no surprises, and a clear payoff date.
                </p>
              </div>
              <div className="border border-border p-5">
                <p className="font-semibold text-brand-green mb-2">Line of Credit — Best for ongoing needs</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You may need funds at different times in varying amounts. A line of credit lets you borrow what you need, repay, and borrow again — only paying interest on what's used.
                </p>
              </div>
              <div className="border border-border p-5">
                <p className="font-semibold text-brand-green mb-2">Credit Card — Best for everyday purchases</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Earn cash back on purchases you'd make anyway. Great for everyday spending, travel, and building credit.
                </p>
              </div>
            </div>
          </div>
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/q2-personal-loan_may26_homepage-hero.webp"
            alt="Person applying for a personal loan"
            className="w-full h-auto"
          />
        </div>
      </section>

      <LoanBenefits />

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Apply in minutes. Get funds fast.</h2>
          <p className="text-muted-foreground text-sm mb-2">Complete your application online today.</p>
          <p className="text-muted-foreground text-xs mb-6 italic">†Funds disbursement timing subject to underwriting approval and banking processing times.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Apply for a Personal Loan <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              Loan Calculator
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
