import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { WORKSHOPS, ARTICLES, CALCULATORS } from "@/data/guidance";

const CATEGORY_COLORS: Record<string, string> = {
  Homeownership: "bg-blue-100 text-blue-800",
  Credit: "bg-purple-100 text-purple-800",
  Budgeting: "bg-green-100 text-green-800",
  Investing: "bg-amber-100 text-amber-800",
  Retirement: "bg-orange-100 text-orange-800",
  Security: "bg-red-100 text-red-800",
};

export const Route = createFileRoute("/guidance/financial-education")({
  component: FinancialEducationPage,
});

function FinancialEducationPage() {
  return (
    <>
      <PageHero
        eyebrow="Financial Education"
        title="Free Knowledge for Every Stage of Your Financial Life."
        body="From first-time homebuyers to seasoned investors — A+FCU's free workshops, calculators, and articles give you the tools to make smarter financial decisions."
      />

      <section className="bg-white py-20">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Upcoming Workshops</p>
            <h2 className="font-serif text-3xl md:text-4xl">Free workshops, open to everyone.</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm">All workshops are free and open to the public — you don't need to be an A+FCU member to attend.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {WORKSHOPS.map((w) => (
              <div key={w.title} className="border border-border hover:border-brand-green hover:shadow-sm transition-all p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[w.category] ?? "bg-gray-100 text-gray-700"}`}>
                    {w.category}
                  </span>
                  {w.free && <span className="text-xs font-bold text-brand-green bg-brand-green/10 px-2.5 py-0.5 rounded-full">FREE</span>}
                </div>
                <h3 className="font-serif text-xl text-ink mb-2">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{w.desc}</p>
                <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border pt-4">
                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-brand-green" />{w.date}</div>
                  <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-brand-green" />{w.time}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-brand-green" />{w.location}</div>
                </div>
                <a href="#" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:underline">
                  Register Free <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:underline">
              View Full Workshop Calendar <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Calculators</p>
            <h2 className="font-serif text-3xl md:text-4xl">Run the numbers before you decide.</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm">Our free calculators help you estimate payments, plan savings goals, and compare financial options in seconds.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CALCULATORS.map((calc) => (
              <a
                key={calc.title}
                href={calc.href}
                className="bg-white border border-border hover:border-brand-green hover:shadow-sm transition-all p-5 flex flex-col group"
              >
                <div className="text-3xl mb-3">{calc.icon}</div>
                <h3 className="font-semibold text-sm text-ink mb-1.5 group-hover:text-brand-green transition-colors">{calc.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{calc.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-green">
                  Open Calculator <ArrowRight className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Articles</p>
            <h2 className="font-serif text-3xl md:text-4xl">Practical advice from A+FCU experts.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((article) => (
              <article key={article.title} className="border border-border hover:border-brand-green hover:shadow-sm transition-all flex flex-col overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden bg-brand-cream">
                  <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category] ?? "bg-gray-100 text-gray-700"}`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  </div>
                  <h3 className="font-serif text-lg text-ink leading-snug mb-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{article.excerpt}</p>
                  <a href="#" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:underline">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="#" className="inline-flex items-center gap-2 border border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-7 py-3 font-semibold text-sm transition-colors">
              View All Articles <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Want to bring a workshop to your organization?</h2>
          <p className="text-muted-foreground text-sm mb-6">We partner with employers, schools, and nonprofits to deliver custom financial education workshops for your team or community.</p>
          <a href="#" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-7 py-3 font-semibold text-sm transition-colors">
            Request a Workshop <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </>
  );
}
