import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";
import { AGIVES_PROGRAMS, SPONSORSHIPS } from "@/data/who-we-are";

const VOLUNTEER_WAYS = [
  { title: "Financial Literacy Workshops", desc: "Help teach community members how to budget, build credit, and plan for the future at schools, libraries, and community centers." },
  { title: "Habitat for Humanity Builds", desc: "A+FCU partners with Habitat for Humanity to send employee volunteer teams to help build affordable housing in Austin." },
  { title: "Food Bank Support", desc: "We partner with the Central Texas Food Bank to support hunger relief with both financial contributions and volunteer shifts." },
  { title: "Youth Mentorship", desc: "Our team members mentor students in financial literacy and career readiness through programs with Austin ISD and local nonprofits." },
];

const COMMUNITY_STATS = [
  { value: "$500K+", label: "Community Donations in 2025" },
  { value: "47", label: "Nonprofits Supported" },
  { value: "2,500+", label: "Employee Volunteer Hours" },
  { value: "50+", label: "Scholarships Awarded" },
];

export const Route = createFileRoute("/who-we-are/community")({
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <>
      <SplitHero
        eyebrow="Community"
        title="Rooted in Austin. Invested in People."
        body="As a not-for-profit credit union, A+FCU returns value to the communities we serve — through grants, scholarships, sponsorships, and thousands of volunteer hours each year."
      />

      <section className="bg-brand-green py-14">
        <div className="container-x">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {COMMUNITY_STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="font-serif text-4xl md:text-5xl font-semibold mb-2">{value}</p>
                <p className="text-white/75 text-sm uppercase tracking-wider font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">A+ Gives</p>
            <h2 className="font-serif text-3xl md:text-4xl">Our Giving Programs.</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm">A+FCU's community giving program — A+ Gives — supports education, housing, financial literacy, and community development across Central Texas.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {AGIVES_PROGRAMS.map((prog) => (
              <div key={prog.title} className="border border-border hover:border-brand-green hover:shadow-sm transition-all p-6 flex gap-5">
                <div className="text-4xl shrink-0">{prog.icon}</div>
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-serif text-xl text-ink">{prog.title}</h3>
                    <span className="text-xs font-bold text-brand-green bg-brand-green/10 px-2.5 py-1 shrink-0">{prog.amount}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{prog.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-brand-cream border border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-base text-ink mb-1">Apply for a Community Grant</h3>
              <p className="text-sm text-muted-foreground">Qualifying nonprofits serving Central Texas can apply for A+FCU community grants each year.</p>
            </div>
            <a href="#" className="shrink-0 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-5 py-2.5 font-semibold text-sm transition-colors">
              Apply for a Grant <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Sponsorships</p>
            <h2 className="font-serif text-3xl md:text-4xl">Where You'll Find Us Around Austin.</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm">A+FCU sponsors events, organizations, and venues that celebrate Austin's culture, diversity, and spirit.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPONSORSHIPS.map((s) => (
              <div key={s.name} className="bg-white border border-border hover:border-brand-green hover:shadow-sm transition-all p-5 flex items-center gap-4">
                <div className="text-3xl w-12 h-12 flex items-center justify-center bg-brand-cream shrink-0">{s.logo}</div>
                <div>
                  <h3 className="font-semibold text-sm text-ink">{s.name}</h3>
                  <p className="text-xs text-brand-green mt-0.5 font-medium">{s.type}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center italic">A+FCU sponsors many additional organizations, events, and causes throughout the year. Contact us for sponsorship inquiries.</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <img
              src="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_about-afcu_feb26.webp"
              alt="A+FCU volunteers in the community"
              className="w-full h-auto"
            />
            <div>
              <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Volunteering</p>
              <h2 className="font-serif text-3xl md:text-4xl mb-5">Our Team Gives More Than Money.</h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Every A+FCU employee receives paid volunteer days to give back to the causes they care about. Together, our team logged over 2,500 volunteer hours in Austin and Central Texas communities last year.
              </p>
              <div className="space-y-4">
                {VOLUNTEER_WAYS.map((v) => (
                  <div key={v.title} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                      <Heart className="w-4 h-4 text-brand-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-ink mb-0.5">{v.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#" className="mt-7 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm transition-colors">
                Volunteer With Us <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Want to partner with A+FCU?</h2>
          <p className="text-muted-foreground text-sm mb-6">Whether you're a nonprofit, employer, or event organizer, we'd love to explore how we can work together to serve the Austin community.</p>
          <a href="#" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-7 py-3 font-semibold text-sm transition-colors">
            Contact Our Community Team <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </>
  );
}
