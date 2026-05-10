import { ArrowRight } from "lucide-react";

const CARDS = [
  {
    image: "https://aplusfcu.org/wp-content/uploads/global/img/subpage-overview-cards-image-home-page_accounts-digital_sep22.jpg",
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_personal-finances.svg",
    title: "Accounts",
    body: "Discover a range of account options designed to meet your everyday banking needs and maximize your savings.",
    links: [
      { label: "Checking", href: "/accounts" },
      { label: "Savings", href: "/accounts" },
      { label: "Certificates", href: "/accounts" },
    ],
  },
  {
    image: "https://aplusfcu.org/wp-content/uploads/global/img/subpage-overview-cards-image-home-page_accounts-digital_sep22.jpg",
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_online-banking.svg",
    title: "Online Banking",
    body: "As your financial institution, we offer a variety of convenient services to simplify your financial needs.",
    links: [
      { label: "A+ Online Banking", href: "/services" },
      { label: "A+ Mobile App", href: "/services" },
      { label: "Bill Pay", href: "/services" },
    ],
  },
];

export function CategoryCards() {
  return (
    <section className="bg-brand-cream py-16">
      <div className="container-x grid md:grid-cols-2 gap-8">
        {CARDS.map((c) => (
          <article key={c.title} className="bg-white border border-border overflow-hidden flex flex-col">
            <img src={c.image} alt="" className="w-full h-56 object-cover" loading="lazy" />
            <div className="p-7 flex-1 flex flex-col">
              <img src={c.icon} alt="" className="w-10 h-10 mb-3" />
              <p className="text-xs uppercase tracking-[0.15em] text-ink/60 font-semibold">Products & Services for:</p>
              <h3 className="font-serif text-3xl mt-2"><a href="#" className="text-brand-green hover:underline">{c.title}</a></h3>
              <p className="mt-3 text-ink/75">{c.body}</p>
              <ol className="mt-5 space-y-2 list-decimal list-inside">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-brand-green underline underline-offset-4 hover:no-underline font-medium">{l.label}</a>
                  </li>
                ))}
              </ol>
              <a href="#" className="mt-6 inline-flex items-center gap-2 text-brand-green font-semibold">
                Learn More <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
