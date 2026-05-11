import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";
import { ProductCard } from "@/components/accounts/ProductCard";
import { BUSINESS_CHECKING_PRODUCTS, BUSINESS_SAVINGS_PRODUCTS, BUSINESS_WHY } from "@/data/business";

const COMPARE_ROWS = [
  { feature: "Monthly Fee", checking: "None*", interest: "None*", savings: "None", mm: "None*", cert: "None" },
  { feature: "Min. to Open", checking: "$100", interest: "$2,500", savings: "$25", mm: "$2,500", cert: "$500" },
  { feature: "Earns Dividends", checking: "—", interest: "✓", savings: "✓", mm: "✓", cert: "✓" },
  { feature: "Debit Card", checking: "✓", interest: "✓", savings: "—", mm: "—", cert: "—" },
  { feature: "Online Banking", checking: "✓", interest: "✓", savings: "✓", mm: "✓", cert: "✓" },
  { feature: "Bill Pay", checking: "✓", interest: "✓", savings: "—", mm: "—", cert: "—" },
  { feature: "NCUA Insured", checking: "✓", interest: "✓", savings: "✓", mm: "✓", cert: "✓" },
];

export const Route = createFileRoute("/business/accounts")({
  component: BusinessAccountsPage,
});

function BusinessAccountsPage() {
  return (
    <>
      <SplitHero
        eyebrow="Business Accounts"
        title="Accounts That Work as Hard as You Do."
        body="No hidden fees, no minimum balance surprises, and real dividends on your balance. A+FCU business accounts are built to support your bottom line."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Business Checking</p>
            <h2 className="font-serif text-3xl md:text-4xl">Everyday banking for your business.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {BUSINESS_CHECKING_PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} {...product} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Business Savings & Certificates</p>
            <h2 className="font-serif text-3xl md:text-4xl">Grow your business reserves.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {BUSINESS_SAVINGS_PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} {...product} featured={i === 2} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x max-w-5xl">
          <h2 className="font-serif text-3xl md:text-4xl mb-8 text-center">Compare Business Accounts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand-green text-white">
                  <th className="text-left p-3 font-semibold">Feature</th>
                  <th className="text-center p-3 font-semibold">Checking</th>
                  <th className="text-center p-3 font-semibold">Interest Checking</th>
                  <th className="text-center p-3 font-semibold">Savings</th>
                  <th className="text-center p-3 font-semibold">Money Market</th>
                  <th className="text-center p-3 font-semibold">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-brand-cream"}>
                    <td className="p-3 font-medium text-ink">{row.feature}</td>
                    <td className="p-3 text-center text-brand-green font-semibold">{row.checking}</td>
                    <td className="p-3 text-center text-brand-green font-semibold">{row.interest}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.savings}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.mm}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.cert}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 italic">*No monthly fee with qualifying average daily balance. See account disclosures for details.</p>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Why A+FCU for Business</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-6">A banking partner, not just a bank.</h2>
            <div className="space-y-5">
              {BUSINESS_WHY.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-brand-green mt-2 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-base text-ink mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_about-afcu_feb26.webp"
            alt="Business owner using A+FCU online banking"
            className="w-full h-auto"
          />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">What You Need to Open</p>
            <h2 className="font-serif text-3xl md:text-4xl">Opening is quick and easy.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="border border-border p-6">
              <h3 className="font-semibold text-base mb-4 text-ink">For Sole Proprietors</h3>
              <ul className="space-y-2.5">
                {["Government-issued photo ID", "Social Security Number or EIN", "Business name and address", "Opening deposit ($100 minimum for checking)", "DBA certificate (if operating under a trade name)"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ink/80">
                    <Check className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-border p-6">
              <h3 className="font-semibold text-base mb-4 text-ink">For LLCs, Corporations & Partnerships</h3>
              <ul className="space-y-2.5">
                {["Government-issued photo ID (all authorized signers)", "Employer Identification Number (EIN)", "Articles of Incorporation or Organization", "Operating Agreement or Partnership Agreement", "Business resolution authorizing the account"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ink/80">
                    <Check className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 italic text-center">Requirements may vary. Contact a member services representative if you have questions.</p>
        </div>
      </section>

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Ready to open your business account?</h2>
          <p className="text-muted-foreground text-sm mb-6">Visit any A+FCU branch or contact our business banking team to get started.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Open an Account <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              Talk to a Specialist
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
