const CARDS = [
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_personal-finances.svg",
    title: "Accounts",
    href: "/accounts",
    body: "Discover a range of account options designed to meet your everyday banking needs and maximize your savings.",
    links: [
      { label: "Checking", href: "/accounts" },
      { label: "Savings", href: "/accounts" },
      { label: "Certificates", href: "/accounts" },
    ],
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_online-banking.svg",
    title: "Online Banking",
    href: "/services",
    body: "As your financial institution, we offer a variety of convenient services to simplify your financial needs.",
    links: [
      { label: "A+ Online Banking", href: "/services" },
      { label: "A+ Mobile App", href: "/services" },
      { label: "Bill Pay", href: "/services" },
    ],
  },
];

const HERO_IMG =
  "https://aplusfcu.org/wp-content/uploads/global/img/subpage-overview-cards-image-home-page_accounts-digital_sep22.jpg";

export function CategoryCards() {
  return (
    <section className="relative bg-white">
      <div
        className="h-[260px] md:h-[360px] bg-center bg-cover"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
        aria-hidden
      />
      <div className="container-x relative -mt-24 md:-mt-32 pb-12">
        <div className="grid md:grid-cols-2 gap-0 bg-white shadow-xl">
          {CARDS.map((c, i) => (
            <article
              key={c.title}
              className={`p-8 md:p-10 flex gap-5 ${i === 0 ? "md:border-r border-border" : ""}`}
            >
              <img src={c.icon} alt="" className="w-12 h-12 shrink-0 mt-1" />
              <div>
                <p className="text-sm font-bold text-brand-green tracking-wide">Products &amp; Services for:</p>
                <h3 className="font-serif text-3xl md:text-4xl mt-1">
                  <a href={c.href} className="text-ink hover:text-brand-green inline-flex items-center gap-2">
                    {c.title} <span aria-hidden>→</span>
                  </a>
                </h3>
                <p className="mt-4 text-ink/75 leading-relaxed">{c.body}</p>
                <ul className="mt-5 space-y-2">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-brand-green underline underline-offset-4 hover:no-underline font-semibold">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <p className="text-center text-xs italic text-ink/60 mt-10 max-w-3xl mx-auto">
          †Early payment of funds is not guaranteed and is subject to when A+FCU receives the funds from the originator.
        </p>
      </div>
    </section>
  );
}
