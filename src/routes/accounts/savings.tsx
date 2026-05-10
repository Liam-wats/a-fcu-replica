import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/accounts/ProductCard";
import { AccountBenefits } from "@/components/accounts/AccountBenefits";
import { SAVINGS_PRODUCTS } from "@/data/accounts";

export const Route = createFileRoute("/accounts/savings")({
  head: () => ({
    meta: [
      { title: "Savings Accounts — A+ Federal Credit Union" },
      { name: "description", content: "Save smarter with A+FCU Regular Savings, Money Market, and Holiday & Vacation Club accounts. All earn dividends with no hidden fees." },
    ],
  }),
  component: SavingsPage,
});

const SAVINGS_TIPS = [
  {
    title: "Emergency Fund",
    desc: "Aim for 3–6 months of expenses in your Regular Savings account for unexpected costs.",
    icon: "🛡️",
  },
  {
    title: "Earn More on Large Balances",
    desc: "Once you've built up $2,500+, move to a Money Market account for higher tiered dividends.",
    icon: "📈",
  },
  {
    title: "Automate Holiday Savings",
    desc: "Set up a Holiday Club and automate small weekly transfers — you won't miss the money, but you'll love the December deposit.",
    icon: "🎄",
  },
];

function SavingsPage() {
  return (
    <>
      <PageHero
        eyebrow="Savings Accounts"
        title="Save Smarter, Earn More, Stress Less."
        body="Whether you're building an emergency fund, growing your nest egg, or saving for the holidays, A+FCU has a savings account designed for your goal."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Our Savings Products</p>
            <h2 className="font-serif text-3xl md:text-4xl">The right account for every savings goal.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SAVINGS_PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} {...product} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Savings Strategy</p>
            <h2 className="font-serif text-3xl md:text-4xl">How to make the most of your savings</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {SAVINGS_TIPS.map((tip) => (
              <div key={tip.title} className="bg-white border border-border p-6">
                <div className="text-3xl mb-4">{tip.icon}</div>
                <h3 className="font-semibold text-base mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Member-Owned Banking</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">When A+FCU Does Well, You Do Too.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a credit union, we return profits to our members in the form of better rates, lower fees, and higher dividends on savings. Your money grows because we grow together.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              All A+FCU deposits are federally insured up to $250,000 by the NCUA — your savings are safe, guaranteed.
            </p>
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors">
              Open a Savings Account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_about-afcu_feb26.webp"
            alt="A+FCU team members"
            className="w-full h-auto"
          />
        </div>
      </section>

      <AccountBenefits />

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Not sure which savings account is right for you?</h2>
          <p className="text-muted-foreground text-sm mb-6">A member services representative can help you find the best fit for your financial goals.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Open an Account <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              Talk to a Member Rep
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
