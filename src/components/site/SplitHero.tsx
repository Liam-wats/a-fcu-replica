import { Link } from "@tanstack/react-router";
import { ChevronRight, ArrowRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function SplitHero({
  eyebrow,
  title,
  body,
  image,
  imageAlt = "",
  cta,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  cta?: { label: string; href: string };
  crumbs?: Crumb[];
}) {
  return (
    <section className="bg-white border-b border-border">
      <div className="container-x pt-6 lg:pt-8">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5">
            {crumbs.map((c, i) => (
              <span key={`${c.label}-${i}`} className="inline-flex items-center gap-1.5">
                {c.href ? (
                  <Link to={c.href} className="hover:text-brand-green">{c.label}</Link>
                ) : (
                  <span className="text-ink/70">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <ChevronRight className="w-3 h-3 opacity-60" />}
              </span>
            ))}
          </nav>
        )}
      </div>
      <div className="container-x py-10 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div className="max-w-xl">
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-green mb-3">{eyebrow}</p>
          )}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05]">{title}</h1>
          {body && <p className="mt-5 text-lg text-ink/75 leading-relaxed">{body}</p>}
          {cta && (
            <Link
              to={cta.href}
              className="mt-7 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors"
            >
              {cta.label} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        {image && (
          <div className="order-first lg:order-last">
            <img src={image} alt={imageAlt} className="w-full h-auto object-cover aspect-[4/3] lg:aspect-[5/4]" loading="eager" />
          </div>
        )}
      </div>
    </section>
  );
}
