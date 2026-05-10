import { Zap, PhoneCall, Lock, Award } from "lucide-react";

const BENEFITS = [
  {
    icon: Zap,
    title: "Fast Decisions",
    desc: "Apply online and get a lending decision — often the same day, sometimes in minutes.",
  },
  {
    icon: Lock,
    title: "No Hidden Fees",
    desc: "No origination fees, no prepayment penalties. The rate you see is the rate you get.",
  },
  {
    icon: PhoneCall,
    title: "Local Lending Team",
    desc: "Talk to real people who live and work in your community. We're always just a call away.",
  },
  {
    icon: Award,
    title: "Member-First Rates",
    desc: "As a credit union, we pass our savings directly to members in the form of lower loan rates.",
  },
];

export function LoanBenefits() {
  return (
    <section className="bg-brand-green py-16">
      <div className="container-x">
        <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-12">
          Why Borrow with A+FCU?
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
