import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/accounts/ProductCard";
import { AccountBenefits } from "@/components/accounts/AccountBenefits";
import { CERTIFICATE_PRODUCTS, CERTIFICATE_RATES } from "@/data/accounts";

export const Route = createFileRoute("/accounts/certificates")({
  head: () => ({
    meta: [
      { title: "Share Certificates & IRA Certificates — A+ Federal Credit Union" },
      { name: "description", content: "Lock in a guaranteed rate with A+FCU Share Certificates and IRA Certificates. Terms from 3 to 60 months with competitive APY." },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  return (
    <>
      <PageHero
        eyebrow="Certificates"
        title="Lock In a Guaranteed Rate. Watch Your Money Grow."
        body="A+FCU Share Certificates offer competitive, fixed rates for terms from 3 to 60 months — with no market risk and NCUA-insured protection."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Certificate Products</p>
            <h2 className="font-serif text-3xl md:text-4xl">Guaranteed growth, zero market risk.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {CERTIFICATE_PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} {...product} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Current Rates</p>
            <h2 className="font-serif text-3xl md:text-4xl">Share Certificate Rates</h2>
            <p className="text-muted-foreground mt-3 text-sm">Rates effective as of today. Subject to change without notice.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white shadow-sm">
              <thead>
                <tr className="bg-brand-green text-white">
                  <th className="text-left p-4 font-semibold">Term</th>
                  <th className="text-center p-4 font-semibold">APY</th>
                  <th className="text-center p-4 font-semibold">Minimum Balance</th>
                  <th className="text-center p-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {CERTIFICATE_RATES.map((row, i) => (
                  <tr key={row.term} className={i % 2 === 0 ? "bg-white" : "bg-brand-cream/60"}>
                    <td className="p-4 font-semibold text-ink">{row.term}</td>
                    <td className="p-4 text-center font-serif text-xl text-brand-green font-semibold">{row.apy}</td>
                    <td className="p-4 text-center text-muted-foreground">{row.minBalance}</td>
                    <td className="p-4 text-center">
                      <Link to="/join" className="text-brand-green text-xs font-semibold underline underline-offset-4 hover:no-underline whitespace-nowrap">
                        Open Account →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4 italic">
            APY = Annual Percentage Yield. Early withdrawal penalties may apply. Rates are subject to change without notice. Minimum balance required to earn APY.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_online-services_feb26.webp"
            alt="Person using mobile banking app"
            className="w-full h-auto"
          />
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">IRA Certificates</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Plan for Retirement with Confidence.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              IRA Certificates combine the guaranteed returns of a certificate with the tax advantages of an Individual Retirement Account — giving your retirement savings a powerful boost.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Traditional IRA", desc: "Tax-deductible contributions, tax-deferred growth" },
                { label: "Roth IRA", desc: "After-tax contributions, tax-free qualified withdrawals" },
                { label: "NCUA Insured", desc: "Separately insured up to $250,000 from other accounts" },
                { label: "Fixed Rate", desc: "Guaranteed rate for the full certificate term" },
              ].map(({ label, desc }) => (
                <div key={label} className="border border-border p-4">
                  <p className="font-semibold text-sm text-brand-green mb-1">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold transition-colors">
              Open an IRA Certificate <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <AccountBenefits />

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Ready to lock in your rate?</h2>
          <p className="text-muted-foreground text-sm mb-6">Rates won't stay this high forever. Open your certificate today and secure your guaranteed return.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Open a Certificate <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              View All Rates
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
