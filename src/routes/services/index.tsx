import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { AccountBenefits } from "@/components/accounts/AccountBenefits";

const CATEGORIES = [
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_personal-finances.svg",
    title: "Online Banking",
    href: "/services/online-banking",
    desc: "Manage your accounts, pay bills, monitor your credit score, and control your cards — all from your browser.",
    links: ["A+ Online Banking", "Bill Pay", "Card Management", "Credit Score"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_vehicle-loans.svg",
    title: "Mobile Banking",
    href: "/services/mobile-banking",
    desc: "The award-winning A+ Mobile App puts your finances in your pocket. Deposit checks, pay anyone, and more.",
    links: ["A+ Mobile App", "Mobile Deposit", "Digital Wallets"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_home-loans.svg",
    title: "Member Services",
    href: "/services/member-services",
    desc: "Convenient, practical services to help your money move — direct deposit, wires, and in-branch notary.",
    links: ["Direct Deposit", "Wire Transfers", "Notary"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_home-equity.svg",
    title: "Insurance & Investments",
    href: "/services/insurance-investments",
    desc: "Protect your family and grow your wealth with insurance, investment, and retirement planning services.",
    links: ["Insurance", "Investments", "Retirement"],
  },
];

export const Route = createFileRoute("/services/")({
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Convenient Tools for Your Financial Life."
        body="From award-winning mobile banking to expert investment guidance, A+FCU gives you everything you need to manage, grow, and protect your money."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Our Services</p>
            <h2 className="font-serif text-3xl md:text-4xl">Everything your financial life needs.</h2>
          </div>
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

      <section className="bg-brand-cream py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_online-services_feb26.webp"
            alt="A+ Mobile App and Online Banking on devices"
            className="w-full h-auto"
          />
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Award-Winning Tech</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Recognized as the Best Mobile Banking App in North America</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The A+ Mobile App was named the 2025 Best Mobile Banking App in North America by Global Finance Magazine — and it's free for every member.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Deposit checks, pay bills, lock your card, check your credit score, and manage every account from one intuitive app on iOS or Android.
            </p>
            <Link
              to="/services/mobile-banking"
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors"
            >
              Explore Mobile Banking <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <AccountBenefits />

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-2xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Not a member yet?</h2>
          <p className="text-muted-foreground mb-8">Join A+FCU in minutes and unlock access to all our services — free for every member.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 font-semibold transition-colors">
              Become a Member <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green text-ink px-8 py-3 font-semibold text-sm transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
