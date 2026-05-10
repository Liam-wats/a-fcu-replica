import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { LoanCard } from "@/components/loans/LoanCard";
import { LoanBenefits } from "@/components/loans/LoanBenefits";
import { STUDENT_LOAN_PRODUCTS } from "@/data/loans";

export const Route = createFileRoute("/loans/student-loans")({
  head: () => ({
    meta: [
      { title: "Student Loans — A+ Federal Credit Union" },
      { name: "description", content: "A+FCU private student loans and refinancing. Competitive rates, no origination fees, and cosigner release options." },
    ],
  }),
  component: StudentLoansPage,
});

const REFI_REASONS = [
  "Your credit score has improved since you first borrowed",
  "You want to combine multiple loans into one payment",
  "You'd like to choose a new repayment term",
  "You want to remove a cosigner from your original loan",
  "Interest rates have dropped since you graduated",
];

const TIMELINE = [
  { step: "1", title: "Check Your Rate", desc: "See your estimated rate in minutes with no impact to your credit score." },
  { step: "2", title: "Submit Documents", desc: "Upload your school enrollment info, ID, and income verification securely online." },
  { step: "3", title: "Get Certified", desc: "Your school certifies the loan amount based on your cost of attendance." },
  { step: "4", title: "Funds Disbursed", desc: "Funds are sent directly to your school and applied to your account balance." },
];

function StudentLoansPage() {
  return (
    <>
      <PageHero
        eyebrow="Student Loans"
        title="Invest in Your Education Without the Stress."
        body="Private student loans and refinancing from A+FCU — competitive rates, no origination fees, and flexible repayment options."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Student Loan Options</p>
            <h2 className="font-serif text-3xl md:text-4xl">Borrow smarter. Repay on your terms.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {STUDENT_LOAN_PRODUCTS.map((product, i) => (
              <LoanCard key={product.id} {...product} featured={i === 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">How It Works</p>
            <h2 className="font-serif text-3xl md:text-4xl">Private Student Loan Process</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIMELINE.map(({ step, title, desc }) => (
              <div key={step} className="bg-white border border-border p-6 relative">
                <div className="w-9 h-9 bg-brand-green text-white rounded-full flex items-center justify-center font-bold text-sm mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-sm mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-start max-w-5xl">
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Should You Refinance?</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Signs It's Time to Refinance Your Student Loans</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Refinancing makes sense for many borrowers — especially those who've graduated, improved their credit, or want to simplify repayment. Consider refinancing if:
            </p>
            <ul className="space-y-3">
              {REFI_REASONS.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
            <div className="mt-8 bg-brand-yellow/20 border border-brand-yellow p-5">
              <p className="text-sm font-semibold text-ink mb-1">⚠️ Important: Federal Loan Benefits</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Refinancing federal student loans into a private loan means you'll lose access to federal programs like income-driven repayment, Public Service Loan Forgiveness, and federal deferment/forbearance. Make sure to weigh these factors carefully.
              </p>
            </div>
            <Link to="/join" className="mt-6 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm transition-colors">
              Check My Refinance Rate <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div>
            <img
              src="https://aplusfcu.org/wp-content/uploads/global/img/q2-personal-loan_may26_homepage-hero.webp"
              alt="Student working on laptop"
              className="w-full h-auto mb-6"
            />
            <div className="bg-brand-cream border border-border p-6">
              <p className="font-semibold text-sm mb-4 text-ink">Quick Eligibility Checklist</p>
              <ul className="space-y-2.5">
                {[
                  "U.S. citizen or eligible non-citizen",
                  "Enrolled at least half-time at an eligible school (new loans)",
                  "Good academic standing",
                  "Meet credit requirements (or apply with a creditworthy cosigner)",
                  "Income verification (for refinancing)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ink/80">
                    <Check className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <LoanBenefits />

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Ready to take the next step?</h2>
          <p className="text-muted-foreground text-sm mb-6">Apply online for a private student loan or refinance today. No origination fee, no prepayment penalty.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Apply for a Student Loan <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              Talk to a Loan Advisor
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
