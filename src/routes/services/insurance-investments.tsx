import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ShieldCheck, TrendingUp, PiggyBank } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";
import { ProductCard } from "@/components/accounts/ProductCard";
import { AccountBenefits } from "@/components/accounts/AccountBenefits";
import { INSURANCE_PRODUCTS } from "@/data/services";

export const Route = createFileRoute("/services/insurance-investments")({
  component: InsuranceInvestmentsPage,
});

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Protection",
    desc: "Insurance products designed to protect your family, home, and vehicle — at credit union rates through TruStage™.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    desc: "Work with licensed financial advisors to build a diversified investment portfolio tailored to your goals.",
  },
  {
    icon: PiggyBank,
    title: "Retirement",
    desc: "Traditional and Roth IRAs, IRA Certificates, and rollover services to fund the retirement you've planned for.",
  },
];

const RETIREMENT_OPTIONS = [
  {
    type: "Traditional IRA",
    benefit: "Tax-deductible contributions (income limits apply)",
    growth: "Tax-deferred until withdrawal",
    best: "Expect to be in a lower tax bracket in retirement",
  },
  {
    type: "Roth IRA",
    benefit: "After-tax contributions — no deduction",
    growth: "Tax-free growth and qualified withdrawals",
    best: "Expect to be in a higher bracket in retirement, or want flexibility",
  },
];

function InsuranceInvestmentsPage() {
  return (
    <>
      <SplitHero
        eyebrow="Insurance & Investments"
        title="Protect Today. Build for Tomorrow."
        body="From insurance that covers what matters most to investment and retirement planning guided by licensed professionals — A+FCU has the tools to help you achieve financial security."
      />

      <section className="bg-white py-16">
        <div className="container-x max-w-4xl">
          <div className="grid sm:grid-cols-3 gap-6">
            {PILLARS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-border p-8 text-center hover:border-brand-green hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-brand-green" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-ink">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Our Products</p>
            <h2 className="font-serif text-3xl md:text-4xl">Insurance, Investments & Retirement.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {INSURANCE_PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} {...product} featured={i === 2} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_about-afcu_feb26.webp"
            alt="Family protected by A+FCU insurance"
            className="w-full h-auto"
          />
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">TruStage™ Insurance</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Insurance Built for Credit Union Members.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              TruStage™ is the leading insurance provider for credit union members, offering competitive rates on auto, home, life, and more. As an A+FCU member, you have exclusive access to these member-focused products.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Every policy is backed by a top-rated insurance carrier, and coverage is available online in minutes — no agent appointment needed.
            </p>
            <ul className="space-y-2.5 mb-8">
              {[
                "Auto insurance — save vs. standard carriers",
                "Homeowners and renters insurance",
                "Life insurance — term and whole life",
                "AD&D coverage for members and families",
                "Loan protection insurance",
                "Identity theft protection",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-brand-green shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <a href="#" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors text-sm">
              Get an Insurance Quote <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Retirement Planning</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Traditional IRA vs. Roth IRA — Which Is Right for You?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Both accounts grow your retirement savings with tax advantages — but the difference lies in when you pay taxes. A+FCU offers both types, plus IRA Certificates and Money Market accounts for your IRA funds.
            </p>
            <div className="space-y-4 mb-8">
              {RETIREMENT_OPTIONS.map((opt) => (
                <div key={opt.type} className="bg-white border border-border p-5">
                  <h3 className="font-semibold text-base text-ink mb-2">{opt.type}</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-0.5">Contributions</span>
                      <span className="text-ink">{opt.benefit}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-0.5">Growth</span>
                      <span className="text-ink">{opt.growth}</span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-0.5">Best If You</span>
                      <span className="text-ink">{opt.best}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors text-sm">
              Open an IRA <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/q2-personal-loan_may26_homepage-hero.webp"
            alt="Couple planning for retirement"
            className="w-full h-auto"
          />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Investment Services</p>
            <h2 className="font-serif text-3xl md:text-4xl">Expert Guidance for Your Financial Future.</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Through CUNA Brokerage Services, A+FCU members have access to licensed financial advisors who can help build a personalized investment strategy.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Stocks & Bonds", desc: "Build a diversified portfolio with individual securities guided by your advisor." },
              { title: "Mutual Funds & ETFs", desc: "Broad market exposure with professional management and low minimums." },
              { title: "Annuities", desc: "Guaranteed income streams to supplement Social Security in retirement." },
              { title: "529 College Savings", desc: "Tax-advantaged saving for education expenses at any eligible institution." },
              { title: "Financial Planning", desc: "Comprehensive goal-setting, budgeting, and long-term wealth planning sessions." },
              { title: "Portfolio Reviews", desc: "Regular check-ins to rebalance your holdings as markets and goals change." },
            ].map((item) => (
              <div key={item.title} className="border border-border p-6 hover:border-brand-green hover:shadow-sm transition-all">
                <h3 className="font-semibold text-base mb-2 text-ink">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-brand-cream border border-border p-6 text-sm text-muted-foreground italic">
            Investment and insurance products are not deposits, are not insured by the NCUA or any federal government agency, are not guaranteed by A+FCU, and may go down in value. Securities offered through CUNA Brokerage Services, Inc., a registered broker/dealer.
          </div>
        </div>
      </section>

      <AccountBenefits />

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Ready to protect and grow your wealth?</h2>
          <p className="text-muted-foreground text-sm mb-6">Become an A+FCU member to access all our insurance and investment services.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Become a Member <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              Talk to an Advisor
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
