import { ArrowRight } from "lucide-react";

export function ContentBlock({
  image, imageAlt, icon, eyebrow, title, body, links, flip = false, bg = "white",
}: {
  image: string; imageAlt: string; icon?: string; eyebrow: string; title: string; body: string;
  links: { label: string; href: string }[]; flip?: boolean; bg?: "white" | "cream";
}) {
  return (
    <section className={bg === "cream" ? "bg-brand-cream" : "bg-white"}>
      <div className={`container-x py-16 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${flip ? "lg:[&>div:first-child]:order-2" : ""}`}>
        <div>
          <img src={image} alt={imageAlt} className="w-full h-auto" loading="lazy" />
        </div>
        <div>
          {icon && <img src={icon} alt="" className="w-10 h-10 mb-3 opacity-70" />}
          <p className="text-sm uppercase tracking-[0.15em] text-ink/60 font-semibold">{eyebrow}</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-3 leading-[1.15]">{title}</h2>
          <p className="mt-5 text-ink/75 leading-relaxed">{body}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {links.map((l) => (
              <a key={l.label} href={l.href} className="inline-flex items-center gap-2 border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-5 py-2.5 text-sm font-semibold transition-colors">
                {l.label} <ArrowRight className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
