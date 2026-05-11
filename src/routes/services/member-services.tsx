import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, FileText, Zap } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/accounts/ProductCard";
import { AccountBenefits } from "@/components/accounts/AccountBenefits";
import { MEMBER_SERVICES_LIST, NOTARY_INFO } from "@/data/services";

export const Route = createFileRoute("/services/member-services")({
  component: MemberServicesPage,
});

const DIRECT_DEPOSIT_STEPS = [
  { n: "1", title: "Get Your Info", desc: "You'll need A+FCU's routing number (314977405) and your account number, found in Online Banking." },
  { n: "2", title: "Update Your Employer", desc: "Fill out your employer's direct deposit form or enter the details through their HR/payroll portal." },
  { n: "3", title: "Start Getting Paid Early", desc: "Once your employer activates it, funds can arrive up to 2 days before your scheduled payday.†" },
];

const WIRE_DETAILS = [
  { label: "Domestic Wire Fee (Outgoing)", value: "$20" },
  { label: "International Wire Fee (Outgoing)", value: "$35" },
  { label: "Incoming Wire (Domestic)", value: "$0" },
  { label: "Processing Time (Domestic)", value: "Same day*" },
  { label: "Processing Time (International)", value: "1–3 business days" },
  { label: "Cutoff Time", value: "2:00 PM CT" },
];

function MemberServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Member Services"
        title="Practical Services That Make Life Easier."
        body="Direct deposit, wire transfers, and free notary services — the everyday tools A+FCU members rely on."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Our Member Services</p>
            <h2 className="font-serif text-3xl md:text-4xl">Simple services that work for you.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {MEMBER_SERVICES_LIST.map((service, i) => (
              <ProductCard key={service.id} {...service} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Direct Deposit</p>
            <h2 className="font-serif text-3xl md:text-4xl">Get Paid Up to 2 Days Early.†</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              When your employer sends your payroll, A+FCU credits your account as soon as we receive the funds — not when the bank tells us to. That could mean getting paid up to 2 days before payday.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {DIRECT_DEPOSIT_STEPS.map((step) => (
              <div key={step.n} className="text-center bg-white border border-border p-8">
                <div className="w-12 h-12 rounded-full bg-brand-green text-white font-bold font-serif text-xl flex items-center justify-center mx-auto mb-4">
                  {step.n}
                </div>
                <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-brand-green text-white p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-semibold">A+FCU Routing Number: 314977405</p>
                <p className="text-sm text-white/75">Use this with your account number to set up direct deposit</p>
              </div>
            </div>
            <Link to="/join" className="shrink-0 inline-flex items-center gap-2 bg-white text-brand-green hover:bg-brand-cream px-5 py-2.5 font-semibold text-sm transition-colors">
              Open an Account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4 italic">
            †Early payment of funds is not guaranteed and is subject to when A+FCU receives the funds from the originator.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-start max-w-5xl">
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Wire Transfers</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Send Money Anywhere, Securely.</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              A+FCU wire transfers let you send funds directly from your account to any bank in the U.S. or internationally. Domestic wires are processed the same business day when submitted before our cutoff time.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              To initiate a wire, visit any A+FCU branch or call member services. You'll need the recipient's bank name, routing number, account number, and address.
            </p>
            <div className="overflow-x-auto border border-border">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-brand-green text-white">
                    <th className="text-left p-3 font-semibold">Service</th>
                    <th className="text-right p-3 font-semibold">Fee / Time</th>
                  </tr>
                </thead>
                <tbody>
                  {WIRE_DETAILS.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-brand-cream"}>
                      <td className="p-3 font-medium text-ink">{row.label}</td>
                      <td className="p-3 text-right text-brand-green font-semibold">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">*Domestic wires submitted before 2:00 PM CT on business days.</p>
          </div>
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_about-afcu_feb26.webp"
            alt="A+FCU member services team"
            className="w-full h-auto"
          />
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Notary Services</p>
              <h2 className="font-serif text-3xl md:text-4xl mb-5">{NOTARY_INFO.title} — Free for Members.</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{NOTARY_INFO.desc}</p>
              <ul className="space-y-3 mb-8">
                {NOTARY_INFO.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-brand-green shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors text-sm">
                Find a Branch Location <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="bg-white border border-border p-8">
              <div className="w-14 h-14 bg-brand-green/10 flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-brand-green" />
              </div>
              <h3 className="font-semibold text-lg mb-4">Common Documents We Notarize</h3>
              <ul className="space-y-2.5">
                {[
                  "Real estate documents and deeds",
                  "Power of attorney",
                  "Affidavits and statutory declarations",
                  "Trusts and wills",
                  "Loan documents",
                  "Vehicle title transfers",
                  "Business formation documents",
                  "School enrollment forms",
                  "Medical authorization forms",
                ].map((doc) => (
                  <li key={doc} className="flex items-center gap-2.5 text-sm text-ink/80">
                    <Check className="w-4 h-4 text-brand-green shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <AccountBenefits />

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Need help with a member service?</h2>
          <p className="text-muted-foreground text-sm mb-6">Our team is here to help. Visit a branch or contact us by phone.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Become a Member <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              Find a Branch
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
