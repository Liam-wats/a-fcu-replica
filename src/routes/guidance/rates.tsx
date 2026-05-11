import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { LOAN_RATES, DEPOSIT_RATES } from "@/data/guidance";

export const Route = createFileRoute("/guidance/rates")({
  component: RatesPage,
});

function RatesPage() {
  return (
    <>
      <PageHero
        eyebrow="Rates"
        title="Competitive Rates, Updated Daily."
        body="A+FCU offers some of the best rates in Central Texas on loans and deposits. As a not-for-profit credit union, we pass our earnings back to you."
      />

      <section className="bg-brand-green py-10">
        <div className="container-x">
          <div className="grid sm:grid-cols-3 gap-5 text-center text-white">
            {[
              { label: "Best Mortgage Rate", value: "5.990% APR", note: "30-Year Fixed" },
              { label: "Best Auto Loan Rate", value: "5.49% APR", note: "New Auto, up to 36 mo" },
              { label: "Best CD Rate", value: "4.33% APY", note: "12-Month Certificate" },
            ].map(({ label, value, note }) => (
              <div key={label} className="bg-white/10 px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1">{label}</p>
                <p className="font-serif text-2xl font-semibold">{value}</p>
                <p className="text-xs text-white/60 mt-1">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-x max-w-4xl">
          <div className="mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Loan Rates</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-2">Borrow at rates that work for you.</h2>
            <p className="text-muted-foreground text-sm">Rates effective as of May 2026. Credit approval required. Rates subject to change without notice.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand-green text-white">
                  <th className="text-left p-3 font-semibold">Product</th>
                  <th className="text-center p-3 font-semibold">Rate</th>
                  <th className="text-center p-3 font-semibold">APR</th>
                  <th className="text-center p-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {LOAN_RATES.map((row, i) => (
                  <tr key={row.product} className={i % 2 === 0 ? "bg-white" : "bg-brand-cream"}>
                    <td className="p-3 font-medium text-ink">{row.product}</td>
                    <td className="p-3 text-center font-semibold text-brand-green">{row.rate}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.apr}</td>
                    <td className="p-3 text-center">
                      {row.notes && <span className="text-xs text-muted-foreground italic">{row.notes}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 italic">
            *APR = Annual Percentage Rate. Rates shown are the lowest available and are based on creditworthiness, loan term, and collateral. Actual rate may vary.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/loans/" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-5 py-2.5 font-semibold text-sm transition-colors">
              Apply for a Loan <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/accounts/" className="inline-flex items-center gap-2 border border-border hover:border-brand-green text-ink px-5 py-2.5 font-semibold text-sm transition-colors">
              View Accounts
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-4xl">
          <div className="mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Deposit Rates</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-2">Earn more on every dollar you save.</h2>
            <p className="text-muted-foreground text-sm">Rates effective as of May 2026. APY = Annual Percentage Yield. Rates subject to change without notice.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand-green text-white">
                  <th className="text-left p-3 font-semibold">Product</th>
                  <th className="text-center p-3 font-semibold">Rate</th>
                  <th className="text-center p-3 font-semibold">APY</th>
                  <th className="text-center p-3 font-semibold">Min. Balance</th>
                  <th className="text-center p-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {DEPOSIT_RATES.map((row, i) => (
                  <tr key={row.product} className={i % 2 === 0 ? "bg-white" : "bg-brand-cream"}>
                    <td className="p-3 font-medium text-ink">{row.product}</td>
                    <td className="p-3 text-center font-semibold text-brand-green">{row.rate}</td>
                    <td className="p-3 text-center font-semibold text-brand-green">{row.apy}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.minBalance}</td>
                    <td className="p-3 text-center">
                      {row.notes && <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{row.notes}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 italic">
            Dividends compounded and credited monthly. Fees may reduce earnings. Early withdrawal penalties apply on certificates.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/accounts/" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-5 py-2.5 font-semibold text-sm transition-colors">
              Open a Savings Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/accounts/certificates" className="inline-flex items-center gap-2 border border-border hover:border-brand-green text-ink px-5 py-2.5 font-semibold text-sm transition-colors">
              View Certificates
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Ready to lock in a great rate?</h2>
          <p className="text-muted-foreground text-sm mb-6">Apply for a loan or open a certificate today. Rates are subject to change — act now to secure the current rate.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/loans/" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-7 py-3 font-semibold text-sm transition-colors">
              Apply for a Loan <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/join" className="inline-flex items-center justify-center border border-border hover:border-brand-green text-ink px-7 py-3 font-semibold text-sm transition-colors">
              Become a Member
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
