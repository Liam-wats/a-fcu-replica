import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

const CATEGORIES = [
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_personal-finances.svg",
    title: "Financial Education",
    href: "/guidance/financial-education",
    desc: "Free workshops, practical articles, and interactive calculators to help you make smarter financial decisions.",
    links: ["Workshops", "Calculators", "Articles"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_home-loans.svg",
    title: "Rates",
    href: "/guidance/rates",
    desc: "Up-to-date rates on all A+FCU loan and deposit products — from mortgages and auto loans to certificates and money markets.",
    links: ["All Rates", "Loan Rates", "Deposit Rates"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_vehicle-loans.svg",
    title: "Tools & Support",
    href: "/guidance/tools",
    desc: "Make a payment, download our switch kit to move your banking, or get answers to common questions in our FAQ.",
    links: ["Make a Payment", "Switch Kit", "FAQ"],
  },
];

const FEATURED = [
  { label: "Routing Number", value: "314977405", note: "For direct deposit & wire transfers" },
  { label: "24/7 Phone Support", value: "1-800-252-8148", note: "Lost/stolen cards & account support" },
  { label: "Best CD Rate", value: "4.33% APY", note: "12-Month Certificate — $500 min." },
];

export const Route = createFileRoute("/guidance/")({
  component: GuidancePage,
});

function GuidancePage() {
  return (
    <>
      <PageHero
        eyebrow="Guidance"
        title="Knowledge to Make Every Financial Decision with Confidence."
        body="Free workshops, interactive tools, current rates, and clear answers — everything you need to manage your money like a pro."
      />

      <section className="bg-brand-green py-12">
        <div className="container-x">
          <div className="grid sm:grid-cols-3 gap-6 text-white text-center">
            {FEATURED.map(({ label, value, note }) => (
              <div key={label} className="bg-white/10 px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1">{label}</p>
                <p className="font-serif text-2xl font-semibold">{value}</p>
                <p className="text-xs text-white/60 mt-1">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Guidance Resources</p>
            <h2 className="font-serif text-3xl md:text-4xl">Everything you need to bank smarter.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.title} className="border border-border hover:border-brand-green hover:shadow-md transition-all flex flex-col">
                <div className="p-6 flex-1">
                  <img src={cat.icon} alt="" className="w-12 h-12 mb-4" />
                  <Link to={cat.href} className="font-serif text-2xl text-ink hover:text-brand-green inline-flex items-center gap-2 group">
                    {cat.title} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
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
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_online-services_feb26.webp"
            alt="A+FCU financial education"
            className="w-full h-auto"
          />
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Free Workshops</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Expert-Led Financial Education — Always Free.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A+FCU offers free financial education workshops throughout the year on topics like homebuying, budgeting, credit building, investing, and retirement — both in-person and online.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-7">
              Our workshops are open to everyone in the community, not just members. Because we believe financial literacy is a right, not a privilege.
            </p>
            <Link
              to="/guidance/financial-education"
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors text-sm"
            >
              View Upcoming Workshops <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Have a question? We have answers.</h2>
          <p className="text-muted-foreground text-sm mb-6">Browse our FAQ for quick answers to the most common questions about A+FCU accounts, services, and policies.</p>
          <Link to="/guidance/tools" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-7 py-3 font-semibold text-sm transition-colors">
            Browse the FAQ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
