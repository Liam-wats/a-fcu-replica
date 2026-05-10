import { ArrowRight } from "lucide-react";
import { ARTICLES } from "@/data/site";

export function LatestArticles() {
  const [feature, ...rest] = ARTICLES;
  return (
    <section className="container-x py-16">
      <h2 className="font-serif text-3xl md:text-5xl text-center text-ink">Latest Articles</h2>
      <div className="mt-10 grid lg:grid-cols-2 gap-10 lg:gap-16">
        <article className="group">
          <a href="#" className="block overflow-hidden">
            <img src={feature.image} alt="" className="w-full h-[280px] md:h-[340px] object-cover" loading="lazy" />
            <div className="h-1.5 bg-brand-yellow w-full" />
          </a>
          <h3 className="font-serif text-xl md:text-2xl mt-5 leading-snug">
            <a href="#" className="text-ink underline underline-offset-4 hover:text-brand-green hover:no-underline">
              {feature.title}
            </a>
          </h3>
          <p className="mt-3 text-ink/75 text-[15px] leading-relaxed">{feature.excerpt}</p>
        </article>
        <div className="space-y-8">
          {rest.map((a) => (
            <article key={a.title} className="grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] gap-5 items-start">
              <a href="#" className="block overflow-hidden">
                <img src={a.image} alt="" className="w-full h-[110px] md:h-[130px] object-cover" loading="lazy" />
                <div className="h-1.5 bg-brand-yellow w-full" />
              </a>
              <div>
                <h3 className="font-serif text-lg md:text-xl leading-snug">
                  <a href="#" className="text-ink underline underline-offset-4 hover:text-brand-green hover:no-underline">
                    {a.title}
                  </a>
                </h3>
                <p className="mt-2 text-ink/75 text-[14px] leading-relaxed">{a.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-12 flex justify-center">
        <a
          href="#"
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-7 py-3 font-semibold transition-colors"
        >
          Visit Blog <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
