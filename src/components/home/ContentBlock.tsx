import { ArrowRight } from "lucide-react";

export function ContentBlock({
  image, imageAlt, icon, eyebrow, title, body, links, flip = false, bg = "white",
}: {
  image: string; imageAlt: string; icon?: string; eyebrow: string; title: string; body: string;
  links: { label: string; href: string }[]; flip?: boolean; bg?: "white" | "cream";
}) {
  return (
    <section className={bg === "cream" ? "bg-brand-cream" : "bg-white"}>
      <div className="relative overflow-hidden">
        {/* Large faded A+ watermark */}
        <span
          aria-hidden
          className={`pointer-events-none select-none absolute top-1/2 -translate-y-1/2 font-serif italic text-[18rem] leading-none text-ink/[0.06] ${
            flip ? "right-[-3rem]" : "left-[-3rem]"
          }`}
        >
          A+
        </span>
        <div
          className={`container-x py-20 grid lg:grid-cols-2 gap-10 lg:gap-20 items-center relative ${
            flip ? "lg:[&>div:first-child]:order-2" : ""
          }`}
        >
          <div className="relative">
            <img src={image} alt={imageAlt} className="w-full h-auto block" loading="lazy" />
            <div className="h-2 bg-brand-yellow w-[85%] ml-auto" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-green tracking-wide">{eyebrow}</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-[1.1] text-ink">{title}</h2>
            <p className="mt-6 text-ink/75 leading-relaxed max-w-xl">{body}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="group flex flex-col justify-between bg-brand-green text-white hover:bg-brand-green/90 transition-colors px-6 py-5 min-w-[150px] min-h-[110px] font-semibold text-base leading-tight"
                >
                  <span>{l.label}</span>
                  <ArrowRight className="w-5 h-5 mt-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
