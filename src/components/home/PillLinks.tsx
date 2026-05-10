import { Handshake, LineChart, CreditCard, Smartphone, Gift, Briefcase, type LucideIcon } from "lucide-react";

const PILLS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Join A+FCU", href: "/accounts", Icon: Handshake },
  { label: "Find Rates", href: "/guidance", Icon: LineChart },
  { label: "Make A Payment", href: "/services", Icon: CreditCard },
  { label: "Get The App", href: "/services", Icon: Smartphone },
  { label: "A+ Gives", href: "/who-we-are", Icon: Gift },
  { label: "Careers", href: "/who-we-are", Icon: Briefcase },
];

export function PillLinks() {
  return (
    <section className="bg-secondary py-16">
      <div className="container-x">
        <h2 className="font-serif text-3xl md:text-4xl text-center text-ink">Find out about…</h2>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PILLS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              className="group flex flex-col items-center justify-end gap-4 px-4 py-6 transition-all hover:bg-white hover:shadow-sm"
            >
              <Icon className="w-12 h-12 stroke-[1.25] text-[#c9533c]" />
              <span className="text-ink underline underline-offset-4 group-hover:no-underline font-medium text-[15px] text-center">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
