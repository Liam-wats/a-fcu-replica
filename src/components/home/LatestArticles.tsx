import { ArrowRight } from "lucide-react";
import { ARTICLES } from "@/data/site";

export function LatestArticles() {
  return (
    <section className="container-x py-16">
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <h2 className="font-serif text-3xl md:text-4xl">Latest Articles</h2>
        <a href="#" className="inline-flex items-center gap-2 text-brand-green font-semibold underline underline-offset-4 hover:no-underline">
          Visit Blog <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {ARTICLES.map((a) => (
          <article key={a.title} className="group">
            <a href="#" className="block overflow-hidden">
              <img src={a.image} alt="" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </a>
            <h3 className="font-serif text-xl mt-5 leading-snug">
              <a href="#" className="text-ink hover:text-brand-green">{a.title}</a>
            </h3>
            <p className="mt-3 text-ink/75 text-[15px] leading-relaxed">{a.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
