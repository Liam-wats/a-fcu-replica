import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Gift, Users } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";
import { MEMBER_BENEFITS, ELIGIBILITY_GROUPS } from "@/data/who-we-are";

const HOW_TO_JOIN = [
  { n: "1", title: "Check Your Eligibility", desc: "Confirm you qualify for A+FCU membership — if you live, work, worship, or attend school in Central Texas, you're eligible." },
  { n: "2", title: "Open a Savings Account", desc: "A $5 deposit into a Basic Savings account establishes your membership and makes you a part-owner of the credit union." },
  { n: "3", title: "Add Your Accounts", desc: "Open checking, apply for a loan, set up direct deposit, or download the app — all within minutes of joining." },
  { n: "4", title: "Enjoy Member Benefits", desc: "Access better rates, no-fee banking, 85,000+ ATMs, award-winning mobile banking, and much more — for life." },
];

const REFER_PERKS = [
  { icon: "🎁", title: "$50 for You", desc: "Earn a $50 bonus deposited into your A+FCU account when your referral opens a qualifying account." },
  { icon: "💚", title: "$50 for Your Friend", desc: "Your friend also receives $50 when they open a qualifying checking account with direct deposit." },
  { icon: "∞", title: "No Limit", desc: "There's no cap — refer as many people as you like and earn a bonus for each one who joins." },
];

const COMPARE = [
  { feature: "Monthly Checking Fee", credit_union: "None", big_bank: "Up to $15/mo" },
  { feature: "ATM Fee Rebates", credit_union: "85,000+ Free ATMs", big_bank: "Limited network" },
  { feature: "Loan APR (Auto)", credit_union: "As low as 5.49%", big_bank: "Often 8%+" },
  { feature: "Savings APY", credit_union: "Competitive, tiered rates", big_bank: "0.01%–0.10%" },
  { feature: "Ownership", credit_union: "You own a share", big_bank: "Profit for shareholders" },
  { feature: "Customer Service", credit_union: "Local, personal service", big_bank: "Call centers" },
  { feature: "Profit Distribution", credit_union: "Returned to members", big_bank: "Paid to shareholders" },
];

export const Route = createFileRoute("/who-we-are/membership")({
  component: MembershipPage,
});

function MembershipPage() {
  return (
    <>
      <SplitHero
        eyebrow="Membership"
        title="Better Banking Starts With Membership."
        body="As an A+FCU member, you're not a customer — you're an owner. That means every service we offer, every rate we set, and every decision we make is in your best interest."
      />

      <section className="bg-white py-20">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Member Benefits</p>
            <h2 className="font-serif text-3xl md:text-4xl">What you get as a member.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MEMBER_BENEFITS.map((b) => (
              <div key={b.title} className="border border-border hover:border-brand-green hover:shadow-sm transition-all p-6">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-semibold text-base text-ink mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Credit Union vs. Big Bank</p>
            <h2 className="font-serif text-3xl md:text-4xl">Why a credit union just makes sense.</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand-green text-white">
                  <th className="text-left p-3 font-semibold">Feature</th>
                  <th className="text-center p-3 font-semibold">A+FCU (Credit Union)</th>
                  <th className="text-center p-3 font-semibold">Typical Big Bank</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-brand-cream"}>
                    <td className="p-3 font-medium text-ink">{row.feature}</td>
                    <td className="p-3 text-center text-brand-green font-semibold">{row.credit_union}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.big_bank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">How to Join</p>
              <h2 className="font-serif text-3xl md:text-4xl mb-5">Joining Takes About 5 Minutes.</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Membership is open to anyone who lives, works, worships, or attends school in Travis, Williamson, Hays, Bastrop, or Caldwell County. That covers most of Austin and Central Texas.
              </p>
              <div className="bg-brand-cream border border-border p-5 mb-6">
                <h3 className="font-semibold text-sm text-ink mb-3">Who's Eligible?</h3>
                <ul className="space-y-2">
                  {ELIGIBILITY_GROUPS.map((g) => (
                    <li key={g} className="flex items-start gap-2.5 text-sm text-ink/80">
                      <Check className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-5">
                {HOW_TO_JOIN.map(({ n, title, desc }) => (
                  <div key={n} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-brand-green text-white font-bold font-serif flex items-center justify-center shrink-0 text-base">
                      {n}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-ink mb-0.5">{title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/join"
                className="mt-8 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-7 py-3 font-semibold transition-colors"
              >
                Open My Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div>
              <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Refer a Friend</p>
              <h2 className="font-serif text-3xl md:text-4xl mb-5">Earn $50. Give $50. Repeat.</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Know someone who could benefit from A+FCU membership? Refer them and you'll both earn a $50 bonus when they join with a qualifying account and direct deposit.
              </p>
              <div className="space-y-4 mb-8">
                {REFER_PERKS.map((p) => (
                  <div key={p.title} className="border border-border bg-brand-cream p-5 flex gap-4 items-start">
                    <div className="text-3xl shrink-0">{p.icon}</div>
                    <div>
                      <h3 className="font-semibold text-sm text-ink mb-1">{p.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#" className="inline-flex items-center gap-2 border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-7 py-3 font-semibold transition-colors">
                <Gift className="w-4 h-4" /> Refer a Friend
              </a>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Referral bonuses paid after referred member opens a qualifying checking account with qualifying direct deposit. See program terms for full details.
              </p>

              <div className="mt-10 border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-brand-green" />
                  <h3 className="font-semibold text-base text-ink">Select Employee Groups (SEGs)</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Does your employer have a relationship with A+FCU? Employees of our partner SEGs may be eligible for membership even if they live outside our standard service area.
                </p>
                <a href="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:underline">
                  Search for Your Employer <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Ready to join A+FCU?</h2>
          <p className="text-muted-foreground text-sm mb-6">Open your account in minutes online or visit any of our 20+ Austin-area branch locations.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-7 py-3 font-semibold text-sm transition-colors">
              Join Online Now <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green text-ink px-7 py-3 font-semibold text-sm transition-colors">
              Find a Branch
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
