import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { LoanBenefits } from "@/components/loans/LoanBenefits";

export const Route = createFileRoute("/loans/")({
  head: () => ({
    meta: [
      { title: "Loans — A+ Federal Credit Union" },
      { name: "description", content: "Home loans, auto loans, personal loans, and student loans from A+FCU. Competitive rates, fast decisions, and local service." },
    ],
  }),
  component: LoansPage,
});

const CATEGORIES = [
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_home-loans.svg",
    title: "Home Loans",
    href: "/loans/home-loans",
    desc: "From purchase to refinance to home equity — we'll help you find the right mortgage for your situation.",
    rate: "From 5.990% APR",
    links: ["Mortgage Purchase", "Mortgage Refinance", "Home Equity", "HELOC"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_vehicle-loans.svg",
    title: "Vehicle Loans",
    href: "/loans/vehicle-loans",
    desc: "Drive home in your new car, truck, boat, or RV with competitive rates and terms up to 84 months.",
    rate: "From 5.49% APR",
    links: ["Auto Purchase", "Auto Refinance", "RV & Boat", "Motorcycle"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_personal-finances.svg",
    title: "Personal Credit",
    href: "/loans/personal-credit",
    desc: "Get the funds you need fast — personal loans, credit cards, and lines of credit with no collateral required.",
    rate: "From 9.49% APR",
    links: ["Personal Loans", "Credit Cards", "Lines of Credit"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_home-refinance.svg",
    title: "Student Loans",
    href: "/loans/student-loans",
    desc: "Private student loans and refinancing options to help you invest in your education without the stress.",
    rate: "From 5.49% APR",
    links: ["Private Student Loans", "Refinance Student Loans"],
  },
];

const PROCESS_STEPS = [
  { n: "1", title: "Apply Online", desc: "Complete our secure application in minutes. No branch visit required." },
  { n: "2", title: "Get a Decision", desc: "We'll review your application and provide a decision — often the same day." },
  { n: "3", title: "Sign & Close", desc: "Sign your documents electronically and receive your funds or keys." },
];

function LoansPage() {
  return (
    <>
      <PageHero
        eyebrow="Loans"
        title="The Right Loan for Your Life."
        body="Whether you're buying a home, financing a vehicle, or consolidating debt — A+FCU offers competitive rates, local decisions, and no hidden fees."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Our Loan Products</p>
            <h2 className="font-serif text-3xl md:text-4xl">Find the loan that fits your needs.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.title} className="border border-border hover:border-brand-green hover:shadow-md transition-all flex flex-col">
                <div className="p-6 flex-1">
                  <img src={cat.icon} alt="" className="w-12 h-12 mb-4" />
                  <Link to={cat.href} className="font-serif text-2xl text-ink hover:text-brand-green inline-flex items-center gap-2 group">
                    {cat.title} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <p className="mt-1 text-xs font-semibold text-brand-green">{cat.rate}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
                  <ul className="mt-4 space-y-1.5">
                    {cat.links.map((l) => (
                      <li key={l}>
                        <Link to={cat.href} className="text-sm text-brand-green underline underline-offset-4 hover:no-underline font-medium">
                          {l}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to={cat.href}
                  className="block bg-brand-green/5 hover:bg-brand-green hover:text-white transition-colors text-brand-green font-semibold text-sm text-center py-3 border-t border-border"
                >
                  Explore {cat.title} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">How It Works</p>
            <h2 className="font-serif text-3xl md:text-4xl">Applying is simple.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {PROCESS_STEPS.map((step) => (
              <div key={step.n} className="text-center bg-white border border-border p-8">
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

      <LoanBenefits />

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-2xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Ready to apply?</h2>
          <p className="text-muted-foreground mb-8">Become a member in minutes and apply for any A+FCU loan product online.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 font-semibold transition-colors">
              Apply Online <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green text-ink px-8 py-3 font-semibold text-sm transition-colors">
              View All Rates
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-6 italic">
            APR = Annual Percentage Rate. Rates shown are as low as and subject to change. Credit approval required. Rates and terms based on creditworthiness.
          </p>
        </div>
      </section>
    </>
  );
}
