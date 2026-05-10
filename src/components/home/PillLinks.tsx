const PILLS = [
  { label: "Join A+FCU", href: "/accounts" },
  { label: "Find Rates", href: "/guidance" },
  { label: "Make A Payment", href: "/services" },
  { label: "Get The App", href: "/services" },
  { label: "A+ Gives", href: "/who-we-are" },
  { label: "Careers", href: "/who-we-are" },
];

export function PillLinks() {
  return (
    <section className="bg-brand-green text-white py-10">
      <div className="container-x">
        <h2 className="font-serif text-2xl md:text-3xl text-white mb-6">Find out about…</h2>
        <div className="flex flex-wrap gap-3">
          {PILLS.map((p) => (
            <a key={p.label} href={p.href} className="bg-white text-brand-green hover:bg-brand-yellow hover:text-ink px-5 py-3 font-semibold transition-colors">
              {p.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
