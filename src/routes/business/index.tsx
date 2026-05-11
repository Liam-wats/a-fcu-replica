import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Banknote, TrendingUp, Settings, Users } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { BUSINESS_WHY } from "@/data/business";

const CATEGORIES = [
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_personal-finances.svg",
    title: "Business Accounts",
    href: "/business/accounts",
    desc: "Checking, savings, and certificate accounts built for businesses — with the same no-fee, member-first philosophy.",
    links: ["Business Checking", "Business Savings", "Business Certificates"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_home-loans.svg",
    title: "Business Lending",
    href: "/business/lending",
    desc: "Term loans, lines of credit, and commercial real estate financing with local decisions and competitive rates.",
    links: ["Business Term Loans", "Lines of Credit", "Commercial Real Estate"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_vehicle-loans.svg",
    title: "Business Services",
    href: "/business/services",
    desc: "Online banking, merchant services, and payroll solutions to run your business more efficiently.",
    links: ["Business Online Banking", "Merchant Services", "Payroll"],
  },
];

const STEPS = [
  { n: "1", icon: Banknote, title: "Open a Business Account", desc: "Start with a Business Savings and Checking account — your foundation for all A+FCU business services." },
  { n: "2", icon: TrendingUp, title: "Access Capital", desc: "Apply for a business loan or line of credit when you're ready to grow, expand, or bridge a cash flow gap." },
  { n: "3", icon: Settings, title: "Streamline Operations", desc: "Add merchant services, payroll, and online banking to keep your day-to-day running smoothly." },
  { n: "4", icon: Users, title: "Grow Together", desc: "Your A+FCU relationship manager grows with your business — available every step of the way." },
];

export const Route = createFileRoute("/business/")({
  component: BusinessPage,
});

function BusinessPage() {
  return (
    <>
      <PageHero
        eyebrow="Business Banking"
        title="Banking Built for Austin Businesses."
        body="A+FCU gives local businesses access to the same competitive rates, personal service, and no-fee philosophy that our individual members have trusted for decades."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Business Solutions</p>
            <h2 className="font-serif text-3xl md:text-4xl">Everything your business needs, under one roof.</h2>
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
        <div className="container-x max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Getting Started</p>
            <h2 className="font-serif text-3xl md:text-4xl">How to bank your business with A+FCU.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="bg-white border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-brand-green text-white font-bold font-serif flex items-center justify-center shrink-0">
                    {n}
                  </div>
                  <Icon className="w-5 h-5 text-brand-green" />
                </div>
                <h3 className="font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_about-afcu_feb26.webp"
            alt="A+FCU business team"
            className="w-full h-auto"
          />
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Why A+FCU for Business</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-6">A credit union that works as hard as you do.</h2>
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
        </div>
      </section>

      <section className="bg-brand-green py-16">
        <div className="container-x">
          <div className="grid sm:grid-cols-3 gap-8 text-center text-white">
            {[
              { value: "$500M+", label: "In Business Loans Funded" },
              { value: "10,000+", label: "Local Business Members" },
              { value: "Since 1949", label: "Serving Austin Businesses" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-serif text-5xl font-semibold mb-2">{value}</p>
                <p className="text-white/75 text-sm uppercase tracking-wider font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-2xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Ready to open a business account?</h2>
          <p className="text-muted-foreground mb-8">Talk to a business banking specialist or open your account online today.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/business/accounts" className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 font-semibold transition-colors">
              Open a Business Account <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green text-ink px-8 py-3 font-semibold text-sm transition-colors">
              Talk to a Specialist
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
