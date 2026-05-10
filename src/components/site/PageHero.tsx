export function PageHero({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="bg-brand-yellow">
      <div className="container-x py-16 lg:py-24 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.18em] font-semibold text-ink/70">{eyebrow}</p>
        <h1 className="font-serif text-4xl md:text-6xl mt-3 leading-[1.05]">{title}</h1>
        <p className="mt-5 text-lg text-ink/80">{body}</p>
      </div>
    </section>
  );
}