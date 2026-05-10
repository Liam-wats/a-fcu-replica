import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/accounts/ProductCard";
import { AccountBenefits } from "@/components/accounts/AccountBenefits";
import { CHECKING_PRODUCTS } from "@/data/accounts";

export const Route = createFileRoute("/accounts/checking")({
  head: () => ({
    meta: [
      { title: "Checking Accounts — A+ Federal Credit Union" },
      { name: "description", content: "Open a no-fee checking account with A+FCU. Earn up to 3% cash back on debit card purchases and get paid 2 days early." },
    ],
  }),
  component: CheckingPage,
});

const COMPARE_ROWS = [
  { feature: "Monthly Fee", cashBack: "None", free: "None" },
  { feature: "Minimum Balance", cashBack: "None", free: "None" },
  { feature: "Cash Back on Debit", cashBack: "Up to 3%", free: "—" },
  { feature: "Early Direct Deposit", cashBack: "Up to 2 days†", free: "Standard" },
  { feature: "Free Debit Card", cashBack: "✓", free: "✓" },
  { feature: "Mobile Deposit", cashBack: "✓", free: "✓" },
  { feature: "Bill Pay", cashBack: "✓", free: "✓" },
  { feature: "Credit Score Updates", cashBack: "Monthly", free: "—" },
  { feature: "Overdraft Protection", cashBack: "✓", free: "✓" },
  { feature: "85,000+ Free ATMs", cashBack: "✓", free: "✓" },
];

function CheckingPage() {
  return (
    <>
      <PageHero
        eyebrow="Checking Accounts"
        title="Your Money Should Work as Hard as You Do."
        body="Earn cash back on everyday purchases, get paid up to two days early, and pay zero monthly fees — ever."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Choose Your Account</p>
            <h2 className="font-serif text-3xl md:text-4xl">Both are free. Only one pays you back.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {CHECKING_PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} {...product} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-4xl">
          <h2 className="font-serif text-3xl md:text-4xl mb-8 text-center">Side-by-Side Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand-green text-white">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Cash-Back Checking</th>
                  <th className="text-center p-4 font-semibold">Free Checking</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-brand-cream"}>
                    <td className="p-4 font-medium text-ink">{row.feature}</td>
                    <td className="p-4 text-center text-brand-green font-semibold">{row.cashBack}</td>
                    <td className="p-4 text-center text-muted-foreground">{row.free}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4 italic">
            †Early payment of funds is not guaranteed and is subject to when A+FCU receives the funds from the originator.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/q2-checking-accounts_may26_homepage-hero_v1-1400x950.webp"
            alt="A+ Mobile App showing cash back earned with a debit card in front"
            className="w-full h-auto"
          />
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Cash-Back Checking</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Over $25 Million Earned in Cash Back</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              A+FCU members are already earning real cash back just by using their debit card for everyday purchases — groceries, gas, dining, and more. Join the movement and keep more of what you earn.
            </p>
            <ul className="space-y-3 mb-8">
              {["No enrollment required — it's automatic", "Earn on every qualifying debit card purchase", "Cash back deposited directly to your account", "No cap on how much you can earn"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-brand-green shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors">
              Open Cash-Back Checking <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <AccountBenefits />

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Questions about checking accounts?</h2>
          <p className="text-muted-foreground text-sm mb-6">Our member services team is happy to help you choose the right account.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Open an Account <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
