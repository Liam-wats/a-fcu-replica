import { ShieldCheck, Smartphone, HeadphonesIcon, Banknote } from "lucide-react";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "NCUA Insured",
    desc: "Your deposits are federally insured up to $250,000 by the National Credit Union Administration.",
  },
  {
    icon: Banknote,
    title: "No Hidden Fees",
    desc: "We believe in transparent banking. No surprise charges, ever.",
  },
  {
    icon: Smartphone,
    title: "Award-Winning App",
    desc: "Manage all your accounts on-the-go with the A+ Mobile App, named Best Mobile Banking App in North America.",
  },
  {
    icon: HeadphonesIcon,
    title: "Local Member Support",
    desc: "Talk to real people who care. Our member services team is always here to help.",
  },
];

export function AccountBenefits() {
  return (
    <section className="bg-brand-green py-16">
      <div className="container-x">
        <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-12">
          Every A+FCU Account Includes
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-white text-base mb-2">{title}</h3>
              <p className="text-white/75 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
