import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";
import { LEADERSHIP_TEAM, TIMELINE, OPEN_POSITIONS, EMPLOYEE_BENEFITS, NEWSROOM_ITEMS } from "@/data/who-we-are";

const CATEGORY_LABELS: Record<string, string> = {
  Award: "bg-amber-100 text-amber-800",
  Community: "bg-green-100 text-green-800",
  Product: "bg-blue-100 text-blue-800",
  Growth: "bg-purple-100 text-purple-800",
};

export const Route = createFileRoute("/who-we-are/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <SplitHero
        eyebrow="About A+FCU"
        title="75 Years of Putting Members First."
        body="A+FCU was founded in 1949 by Austin educators who believed every person deserved access to fair, member-owned financial services. Today, we serve over 100,000 members across Central Texas."
      />

      <section className="bg-white py-20">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Our Story</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Started by Teachers. Built for Everyone.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In 1949, twelve Austin ISD teachers each contributed $5 to start a credit union for educators. Their vision was simple: a financial cooperative where members pool resources and share the benefits — better rates, lower fees, and real service from people who care.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Over the decades, that small group of teachers grew into one of the largest credit unions in Texas. A+FCU expanded membership to the broader Austin community in the 1990s and now serves anyone who lives, works, worships, or attends school in Central Texas.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              As a not-for-profit cooperative, every dollar A+FCU earns is returned to members in the form of higher savings rates, lower loan rates, and more services — not paid out to shareholders.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              {[
                { value: "1949", label: "Founded" },
                { value: "100K+", label: "Members" },
                { value: "$2B+", label: "Assets" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-serif text-3xl font-semibold text-brand-green">{value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_about-afcu_feb26.webp"
            alt="A+FCU history"
            className="w-full h-auto"
          />
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Our History</p>
            <h2 className="font-serif text-3xl md:text-4xl">75 years in the making.</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-brand-green/20 lg:left-1/2" />
            <div className="space-y-6">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className={`relative flex gap-6 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  <div className="lg:w-1/2 flex gap-4 items-start pl-10 lg:pl-0">
                    <div className={`flex-shrink-0 w-16 h-8 bg-brand-green text-white text-xs font-bold flex items-center justify-center ${i % 2 === 0 ? "lg:order-last lg:ml-4" : "lg:mr-4"}`}>
                      {item.year}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.event}</p>
                  </div>
                  <div className="hidden lg:block lg:w-1/2" />
                  <div className="absolute left-2.5 w-3 h-3 rounded-full bg-brand-green border-2 border-white shadow lg:left-1/2 lg:-translate-x-1.5 top-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Leadership</p>
            <h2 className="font-serif text-3xl md:text-4xl">Meet Our Leadership Team.</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm">Our senior leaders share a passion for serving members and strengthening the Austin community.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEADERSHIP_TEAM.map((person) => (
              <div key={person.name} className="border border-border hover:border-brand-green hover:shadow-sm transition-all">
                <div className="aspect-[4/3] overflow-hidden bg-brand-cream">
                  <img src={person.img} alt={person.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-base text-ink">{person.name}</h3>
                  <p className="text-sm text-brand-green mt-0.5">{person.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Newsroom</p>
            <h2 className="font-serif text-3xl md:text-4xl">Latest News & Announcements.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {NEWSROOM_ITEMS.map((item) => (
              <article key={item.headline} className="bg-white border border-border hover:border-brand-green hover:shadow-sm transition-all p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${CATEGORY_LABELS[item.category] ?? "bg-gray-100 text-gray-700"}`}>
                    {item.category}
                  </span>
                  <time className="text-xs text-muted-foreground">{item.date}</time>
                </div>
                <h3 className="font-serif text-lg text-ink mb-2 leading-snug">{item.headline}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.body}</p>
                <a href="#" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:underline">
                  Read Full Story <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Careers</p>
              <h2 className="font-serif text-3xl md:text-4xl mb-5">Join the A+FCU Team.</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Working at A+FCU means being part of a team that's genuinely committed to improving members' financial lives. We offer competitive pay, outstanding benefits, and a culture where your work makes a real difference in the Austin community.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We're always looking for talented, passionate people who share our belief that banking should be built around people — not profit.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {EMPLOYEE_BENEFITS.map((b) => (
                  <div key={b.title} className="bg-brand-cream border border-border p-4">
                    <div className="text-2xl mb-2">{b.icon}</div>
                    <h4 className="font-semibold text-sm mb-1 text-ink">{b.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-ink mb-5">Current Open Positions</h3>
              <div className="space-y-3">
                {OPEN_POSITIONS.map((pos) => (
                  <div key={pos.title} className="border border-border hover:border-brand-green transition-colors p-4 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-ink">{pos.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{pos.location} · {pos.type}</p>
                    </div>
                    <a href="#" className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-brand-green border border-brand-green px-3 py-1.5 hover:bg-brand-green hover:text-white transition-colors">
                      Apply <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
              <a href="#" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:underline">
                View All Open Positions <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
