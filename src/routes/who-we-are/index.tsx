import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

const CATEGORIES = [
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_personal-finances.svg",
    title: "About A+FCU",
    href: "/who-we-are/about",
    desc: "Founded by Austin teachers in 1949, A+FCU has grown to serve over 100,000 members. Learn our story, meet our leaders, and explore careers.",
    links: ["Our Story", "Leadership", "Careers", "Newsroom"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_home-loans.svg",
    title: "Community",
    href: "/who-we-are/community",
    desc: "We put people before profit — that means giving back to the community we've called home for over 75 years through grants, sponsorships, and volunteers.",
    links: ["A+ Gives", "Sponsorships", "Volunteering"],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_vehicle-loans.svg",
    title: "Membership",
    href: "/who-we-are/membership",
    desc: "Membership opens the door to better rates, fewer fees, and real service from people who care. See how to join and what you get as a member.",
    links: ["Join A+FCU", "Member Benefits", "Refer a Friend"],
  },
];

const STATS = [
  { value: "1949", label: "Year Founded" },
  { value: "100K+", label: "Members Served" },
  { value: "$2B+", label: "In Assets" },
  { value: "20+", label: "Branch Locations" },
];

export const Route = createFileRoute("/who-we-are/")({
  component: WhoWeArePage,
});

function WhoWeArePage() {
  return (
    <>
      <PageHero
        eyebrow="Who We Are"
        title="A Credit Union Built on People, Not Profit."
        body="A+FCU was founded in 1949 by Austin teachers who believed banking should work for the people it serves. Seventy-five years later, that belief still guides everything we do."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Explore Our Story</p>
            <h2 className="font-serif text-3xl md:text-4xl">More than a bank. A community.</h2>
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

      <section className="bg-brand-green py-16">
        <div className="container-x">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="font-serif text-5xl font-semibold mb-2">{value}</p>
                <p className="text-white/75 text-sm uppercase tracking-wider font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_about-afcu_feb26.webp"
            alt="A+FCU branch team members"
            className="w-full h-auto"
          />
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Our Difference</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Not-for-Profit Means Your Profits Come First.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a credit union, A+FCU is owned by our members — not shareholders. That means every dollar we earn goes back to you in the form of better rates, lower fees, and more services.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our mission has never changed: to improve the financial well-being of every member we serve. From our first 12 members in 1949 to more than 100,000 today, people always come first.
            </p>
            <Link to="/who-we-are/about" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors text-sm">
              Our Full Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-2xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Ready to become a member?</h2>
          <p className="text-muted-foreground mb-8">Joining A+FCU takes just a few minutes. Open your account today and start experiencing banking the way it should be.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 font-semibold transition-colors">
              Join A+FCU <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/who-we-are/membership" className="inline-flex items-center justify-center border border-border hover:border-brand-green text-ink px-8 py-3 font-semibold text-sm transition-colors">
              Learn About Membership
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
