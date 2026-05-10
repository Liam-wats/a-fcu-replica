import { AWARDS } from "@/data/site";

export function AwardsGrid() {
  return (
    <section className="container-x py-16">
      <h2 className="font-serif text-3xl md:text-4xl text-center max-w-3xl mx-auto leading-tight">
        When you work hard for your members, people notice.
      </h2>
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center">
        {AWARDS.map((src, i) => (
          <div key={i} className="flex items-center justify-center p-2">
            <img src={src} alt={`Award ${i + 1}`} className="max-h-24 w-auto object-contain" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}
