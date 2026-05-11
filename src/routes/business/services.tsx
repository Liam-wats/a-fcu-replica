import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Users, BarChart3, ShieldCheck, Clock } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";
import { ProductCard } from "@/components/accounts/ProductCard";
import { AccountBenefits } from "@/components/accounts/AccountBenefits";
import { BUSINESS_SERVICES_FEATURES, PAYROLL_FEATURES } from "@/data/business";

const MERCHANT_TYPES = [
  { icon: "🏪", title: "Retail", desc: "Countertop terminals, receipt printers, and PIN pads for brick-and-mortar stores." },
  { icon: "🌐", title: "E-Commerce", desc: "Secure payment gateway integration for your website or online store." },
  { icon: "📱", title: "Mobile", desc: "Accept payments on the go with a mobile card reader and smartphone app." },
  { icon: "☎️", title: "Virtual Terminal", desc: "Take phone or mail orders by manually keying card details from any browser." },
];

const ONLINE_BANKING_EXTRAS = [
  { icon: Users, title: "Multi-User Access", desc: "Add employees as authorized users with customizable permissions — view only, initiate transfers, approve payments, and more." },
  { icon: BarChart3, title: "ACH Origination", desc: "Send and receive ACH transfers for payroll, vendor payments, and collections directly from your business account." },
  { icon: ShieldCheck, title: "Positive Pay", desc: "Protect against check fraud with positive pay — review and approve checks before they clear your account." },
  { icon: Clock, title: "Same-Day ACH", desc: "Initiate same-day ACH transfers for time-sensitive payments to vendors, contractors, and employees." },
];

const PAYROLL_PLANS = [
  { name: "Core Payroll", price: "Starting at $39/mo", desc: "Full-service payroll processing + tax filing", best: "1–10 employees" },
  { name: "Complete Payroll", price: "Starting at $69/mo", desc: "Core + HR tools, time tracking, onboarding", best: "11–50 employees" },
  { name: "Enterprise", price: "Custom Pricing", desc: "Fully customized solution with dedicated support", best: "50+ employees" },
];

export const Route = createFileRoute("/business/services")({
  component: BusinessServicesPage,
});

function BusinessServicesPage() {
  return (
    <>
      <SplitHero
        eyebrow="Business Services"
        title="Tools to Run Your Business Smarter."
        body="Business Online Banking, merchant payment processing, and full-service payroll — everything you need to operate efficiently, all in one place."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Digital Banking</p>
            <h2 className="font-serif text-3xl md:text-4xl">Full-featured online banking, built for business.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {BUSINESS_SERVICES_FEATURES.map((feature, i) => (
              <ProductCard key={feature.id} {...feature} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Business Online Banking Features</p>
            <h2 className="font-serif text-3xl md:text-4xl">More control for your business finances.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ONLINE_BANKING_EXTRAS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-border p-6">
                <div className="w-12 h-12 bg-brand-green/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-brand-green" />
                </div>
                <h3 className="font-semibold text-base mb-2 text-ink">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-start max-w-5xl">
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Merchant Services</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Accept Every Payment, Every Way.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A+FCU Merchant Services lets your business accept credit and debit cards in person, online, or on the go — with next-day or same-day funding right to your A+FCU business account.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We work with top-tier processors to give you competitive rates, transparent pricing, and 24/7 support for your terminals and gateway.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {MERCHANT_TYPES.map((type) => (
                <div key={type.title} className="border border-border p-4">
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <h3 className="font-semibold text-sm mb-1 text-ink">{type.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{type.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-brand-cream border border-border p-5 mb-6">
              <h4 className="font-semibold text-sm text-ink mb-3">What's Included with Merchant Services</h4>
              <ul className="space-y-2">
                {["Next-day or same-day funding to your A+FCU account", "PCI-compliant, secure card processing", "Detailed transaction reporting & analytics", "Accept contactless, chip, swipe, and digital wallets", "Chargeback management assistance", "24/7 technical support"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-ink/80">
                    <Check className="w-3.5 h-3.5 text-brand-green shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <a href="#" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors text-sm">
              Get Merchant Services <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/q2-personal-loan_may26_homepage-hero.webp"
            alt="Business owner using card terminal"
            className="w-full h-auto"
          />
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Payroll Services</p>
              <h2 className="font-serif text-3xl md:text-4xl mb-5">Full-Service Payroll, Handled for You.</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A+FCU partners with a trusted payroll provider to offer full-service payroll processing for businesses of any size. Pay your team accurately and on time — every time — while we handle the taxes, filings, and compliance.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Direct deposit funds go directly to your employees' accounts, including any A+FCU accounts — with the option for early direct deposit for A+FCU members.
              </p>
              <ul className="space-y-2.5 mb-8">
                {PAYROLL_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink/80">
                    <Check className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm transition-colors">
                Get Payroll Services <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-ink mb-6">Payroll Plans</h3>
              {PAYROLL_PLANS.map((plan) => (
                <div key={plan.name} className="bg-white border border-border p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-base text-ink">{plan.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Best for: {plan.best}</p>
                    </div>
                    <span className="font-serif text-brand-green font-semibold text-sm shrink-0 ml-4">{plan.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.desc}</p>
                  <a href="#" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:underline">
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
              <p className="text-xs text-muted-foreground italic">Pricing shown is a starting point. Final pricing depends on number of employees and features needed. Contact us for a custom quote.</p>
            </div>
          </div>
        </div>
      </section>

      <AccountBenefits />

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Ready to add business services?</h2>
          <p className="text-muted-foreground text-sm mb-6">Talk to a business banking specialist to set up online banking, merchant services, or payroll for your business.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/business/accounts" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Open a Business Account <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              Talk to a Specialist
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
