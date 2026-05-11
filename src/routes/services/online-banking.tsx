import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, CreditCard, BarChart3, Receipt, Lock } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";
import { ProductCard } from "@/components/accounts/ProductCard";
import { AccountBenefits } from "@/components/accounts/AccountBenefits";
import { ONLINE_BANKING_FEATURES, CARD_MANAGEMENT_FEATURES } from "@/data/services";

export const Route = createFileRoute("/services/online-banking")({
  component: OnlineBankingPage,
});

const TOOLS = [
  {
    icon: Receipt,
    title: "Bill Pay",
    desc: "Pay any business or individual in the U.S. Schedule one-time or recurring payments and receive eBills electronically — all at no charge.",
  },
  {
    icon: CreditCard,
    title: "Card Management",
    desc: "Lock and unlock your debit card instantly, set spending controls by category or location, and get real-time transaction alerts on every purchase.",
  },
  {
    icon: BarChart3,
    title: "Credit Score",
    desc: "Monitor your VantageScore credit score for free — updated monthly inside Online Banking. See what's impacting your score and track changes over time.",
  },
  {
    icon: Lock,
    title: "Account Alerts",
    desc: "Stay on top of your finances with customizable text and email alerts for deposits, withdrawals, low balances, and suspicious activity.",
  },
];

function OnlineBankingPage() {
  return (
    <>
      <SplitHero
        eyebrow="Online Banking"
        title="Your Full Financial Picture, Anytime You Need It."
        body="A+ Online Banking gives you instant, secure access to all your accounts from any browser — pay bills, manage cards, check your credit, and more."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Online Banking Features</p>
            <h2 className="font-serif text-3xl md:text-4xl">Everything you need in one secure portal.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {ONLINE_BANKING_FEATURES.map((feature, i) => (
              <ProductCard key={feature.id} {...feature} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Included Tools</p>
            <h2 className="font-serif text-3xl md:text-4xl">More ways to stay in control.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOOLS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-border p-6 flex flex-col">
                <div className="w-12 h-12 bg-brand-green/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-brand-green" />
                </div>
                <h3 className="font-semibold text-base mb-2 text-ink">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_online-services_feb26.webp"
            alt="A+ Online Banking on a laptop"
            className="w-full h-auto"
          />
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Card Management</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">You're in Control of Your Card.</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With A+FCU Card Management, you have instant control over your debit card right from Online Banking or the A+ Mobile App. No more calling to report a lost card or waiting days for a freeze — do it yourself in seconds.
            </p>
            <ul className="space-y-3 mb-8">
              {CARD_MANAGEMENT_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-brand-green shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors">
              Enroll in Online Banking <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Free Credit Score</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Know Your Score. Build Your Future.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your VantageScore credit score is updated every month inside A+ Online Banking — completely free. See what factors are helping or hurting your score, and track your progress over time.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Understanding your credit is the first step toward better rates on loans, credit cards, and more.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Score Updates", value: "Monthly" },
                { label: "Cost", value: "Free" },
                { label: "Impact on Score", value: "None" },
                { label: "Credit Bureau", value: "TransUnion" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white border border-border p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                  <p className="font-serif text-lg font-semibold text-brand-green">{value}</p>
                </div>
              ))}
            </div>
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/q2-personal-loan_may26_homepage-hero.webp"
            alt="Person checking credit score on laptop"
            className="w-full h-auto"
          />
        </div>
      </section>

      <AccountBenefits />

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Ready to access Online Banking?</h2>
          <p className="text-muted-foreground text-sm mb-6">Enroll in minutes once you open your A+FCU account — or log in now if you're already a member.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Become a Member <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              Log In to Online Banking
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
