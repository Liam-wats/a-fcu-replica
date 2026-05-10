import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { AccountBenefits } from "@/components/accounts/AccountBenefits";

export const Route = createFileRoute("/accounts/")({
  head: () => ({
    meta: [
      { title: "Accounts — A+ Federal Credit Union" },
      { name: "description", content: "Explore A+FCU checking, savings, certificates, and youth accounts — all with no hidden fees and real member benefits." },
    ],
  }),
  component: AccountsPage,
});

const CATEGORIES = [
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_personal-finances.svg",
    title: "Checking",
    href: "/accounts/checking",
    desc: "Everyday spending made rewarding. Earn cash back, get paid early, and pay zero monthly fees.",
    links: ["Cash-Back Checking", "Free Checking", "Compare Checking"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_home-equity.svg",
    title: "Savings",
    href: "/accounts/savings",
    desc: "Build your financial cushion with accounts that earn dividends and grow with you.",
    links: ["Regular Savings", "Money Market", "Holiday & Vacation Club"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_home-refinance.svg",
    title: "Certificates",
    href: "/accounts/certificates",
    desc: "Lock in a guaranteed rate and maximize your savings with our Share and IRA Certificates.",
    links: ["Share Certificates", "IRA Certificates", "View All Rates"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_vehicle-loans.svg",
    title: "Youth Accounts",
    href: "/accounts/youth",
    desc: "Start the next generation off right with accounts built for kids, teens, and students.",
    links: ["Kids Accounts (0–12)", "Teen Accounts (13–17)", "Student Accounts"],
  },
];

function AccountsPage() {
  return (
    <>
      <PageHero
        eyebrow="Accounts"
        title="Banking Built for Members, Not Profits."
        body="Every A+FCU account comes with no hidden fees, real dividends, and the peace of mind that comes with NCUA-insured deposits."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <AccountBenefits />

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-2xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Ready to become a member?</h2>
          <p className="text-muted-foreground mb-8">Open your A+FCU account in minutes — no application fee, just a $5 deposit to start.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 font-semibold transition-colors">
              Join A+FCU <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green text-ink px-8 py-3 font-semibold text-sm transition-colors">
              Compare All Accounts
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
