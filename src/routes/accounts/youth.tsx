import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, Smartphone, TrendingUp } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";
import { ProductCard } from "@/components/accounts/ProductCard";
import { AccountBenefits } from "@/components/accounts/AccountBenefits";
import { YOUTH_PRODUCTS } from "@/data/accounts";

export const Route = createFileRoute("/accounts/youth")({
  head: () => ({
    meta: [
      { title: "Youth Accounts — A+ Federal Credit Union" },
      { name: "description", content: "A+FCU youth accounts for kids, teens, and students. Build lifelong financial habits with accounts designed for every stage of life." },
    ],
  }),
  component: YouthPage,
});

const MILESTONES = [
  { age: "0–12", label: "Kids", icon: "🐷", desc: "Open a savings account with $5. Start building the habit." },
  { age: "13–17", label: "Teen", icon: "💳", desc: "Add checking + a debit card. Learn real-world money skills." },
  { age: "18–25", label: "Student", icon: "🎓", desc: "Full membership with student perks and loan access." },
  { age: "25+", label: "Member", icon: "🏦", desc: "Transition to a full A+FCU membership — benefits for life." },
];

const RESOURCES = [
  {
    icon: GraduationCap,
    title: "Financial Literacy Workshops",
    desc: "Free workshops for members of all ages on budgeting, saving, credit, and more.",
  },
  {
    icon: Smartphone,
    title: "A+ Mobile App",
    desc: "Parents and teens can both view balances and transactions through the A+ Mobile App.",
  },
  {
    icon: TrendingUp,
    title: "Calculators & Tools",
    desc: "Use our free online calculators to plan savings goals and estimate how fast money grows.",
  },
];

function YouthPage() {
  return (
    <>
      <SplitHero
        eyebrow="Youth Accounts"
        title="Build Smart Money Habits That Last a Lifetime."
        body="From a first piggy bank to a student checking account — A+FCU has an account for every stage of the journey."
      />

      <section className="bg-white py-16">
        <div className="container-x max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">The Path to Financial Wellness</p>
            <h2 className="font-serif text-3xl md:text-4xl">Every stage of life, covered.</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-0">
            {MILESTONES.map((m, i) => (
              <div key={m.label} className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0 flex-1">
                <div className="flex sm:flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-brand-green/10 flex items-center justify-center text-2xl shrink-0">
                    {m.icon}
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div className="hidden sm:block h-0.5 bg-brand-green/30 w-full flex-1 mt-7" />
                  )}
                </div>
                <div className="sm:mt-4 sm:pr-4">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{m.age}</p>
                  <p className="font-semibold text-brand-green">{m.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Youth Account Options</p>
            <h2 className="font-serif text-3xl md:text-4xl">The right account for every age.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {YOUTH_PRODUCTS.map((product, i) => (
              <div key={product.id} className="flex flex-col">
                <div className="bg-brand-green/10 text-brand-green text-center py-2 text-xs font-bold uppercase tracking-wider border border-brand-green/20">
                  {product.ageRange}
                </div>
                <ProductCard {...product} featured={i === 0} />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-6 italic text-center">
            †While supplies last. Available at branch locations only.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <img
            src="https://aplusfcu.org/wp-content/uploads/blog/img/6-powerful-money-lessons-for-little-kids_may18_blog.jpg"
            alt="Parent teaching child about money"
            className="w-full h-auto"
          />
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Financial Education</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Tools to Grow Confident, Capable Savers.</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              A+FCU goes beyond banking. We provide free financial education resources to help young members understand budgeting, credit, and saving — skills that pay off for a lifetime.
            </p>
            <div className="space-y-5">
              {RESOURCES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 bg-brand-green/10 rounded flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">{title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/join" className="mt-8 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors text-sm">
              Open a Youth Account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <AccountBenefits />

      <section className="bg-brand-cream py-16">
        <div className="container-x grid sm:grid-cols-3 gap-6 max-w-3xl text-center">
          {[
            { stat: "$5", label: "Minimum to Open", note: "Any youth account" },
            { stat: "$0", label: "Monthly Fees", note: "Ever" },
            { stat: "18+", label: "Years of Service", note: "To Austin families" },
          ].map(({ stat, label, note }) => (
            <div key={label} className="bg-white border border-border p-8">
              <p className="font-serif text-5xl text-brand-green">{stat}</p>
              <p className="font-semibold text-sm mt-2">{label}</p>
              <p className="text-xs text-muted-foreground mt-1">{note}</p>
            </div>
          ))}
        </div>
        <div className="container-x text-center mt-10">
          <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 font-semibold transition-colors">
            Open a Youth Account Today <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
