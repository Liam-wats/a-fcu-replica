import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, ChevronUp, CreditCard, Repeat, HelpCircle } from "lucide-react";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { FAQ_ITEMS, SWITCH_KIT_STEPS } from "@/data/guidance";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-brand-cream/50 transition-colors"
      >
        <span className="font-semibold text-sm text-ink">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-brand-green shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border bg-brand-cream/30">
          <p className="pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

const PAYMENT_OPTIONS = [
  { icon: "📱", title: "A+ Mobile App", desc: "Make transfers and loan payments instantly from your phone — available on iOS and Android.", cta: "Download the App", href: "/services/mobile-banking" },
  { icon: "💻", title: "A+ Online Banking", desc: "Log in to make a one-time or recurring loan payment, transfer funds, or pay a bill.", cta: "Log In to Online Banking", href: "#" },
  { icon: "📞", title: "Phone Payment", desc: "Call 1-800-252-8148 to make a payment by phone. Available 24/7 for automated payments.", cta: "Call 1-800-252-8148", href: "tel:18002528148" },
  { icon: "🏦", title: "Branch Payment", desc: "Visit any of our 20+ A+FCU branches to make a payment in person with a teller.", cta: "Find a Branch", href: "#" },
  { icon: "✉️", title: "Mail a Check", desc: "Mail a check to: A+FCU, PO Box 14867, Austin, TX 78761. Include your account number on the memo line.", cta: null, href: null },
];

export const Route = createFileRoute("/guidance/tools")({
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Tools & Support"
        title="Everything You Need to Bank With Ease."
        body="Make a payment, switch your banking to A+FCU, or get answers to your questions — we make it simple."
      />

      <section className="bg-white py-20">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Make a Payment</p>
            <h2 className="font-serif text-3xl md:text-4xl">Pay your way.</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm">Multiple ways to make loan payments, transfer funds, or pay bills — choose the one that's most convenient for you.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PAYMENT_OPTIONS.map((opt) => (
              <div key={opt.title} className="border border-border hover:border-brand-green hover:shadow-sm transition-all p-6 flex flex-col">
                <div className="text-3xl mb-3">{opt.icon}</div>
                <h3 className="font-semibold text-base text-ink mb-2">{opt.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{opt.desc}</p>
                {opt.cta && opt.href && (
                  <a
                    href={opt.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:underline"
                  >
                    {opt.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 bg-brand-cream border border-border p-5">
            <div className="flex items-start gap-4">
              <CreditCard className="w-5 h-5 text-brand-green mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-ink mb-1">Making a Payment from Another Bank?</h4>
                <p className="text-sm text-muted-foreground">Use A+FCU's routing number <strong className="text-ink">314977405</strong> along with your A+FCU account number to set up payments from an external bank account.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">Switch Kit</p>
              <h2 className="font-serif text-3xl md:text-4xl mb-5">Switching to A+FCU Is Easier Than You Think.</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Moving your banking to A+FCU can save you money and give you access to better rates and service — but the switching process can feel daunting. Our Switch Kit breaks it down into simple steps.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Use our free Switch Kit checklist to track your progress and make sure nothing gets missed when you move your accounts, direct deposit, and automatic payments.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm transition-colors"
              >
                <Repeat className="w-4 h-4" /> Download the Switch Kit
              </a>
            </div>
            <div className="space-y-4">
              {SWITCH_KIT_STEPS.map(({ n, title, desc }) => (
                <div key={n} className="bg-white border border-border p-5 flex gap-4">
                  <div className="w-9 h-9 rounded-full bg-brand-green text-white font-bold font-serif flex items-center justify-center shrink-0">
                    {n}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-ink mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
              <div className="bg-brand-green/10 border border-brand-green/30 p-4 text-sm text-ink/80">
                <strong className="text-ink">A+FCU Routing Number:</strong> 314977405 — You'll need this to update direct deposit and ACH payments.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">FAQ</p>
            <h2 className="font-serif text-3xl md:text-4xl">Frequently Asked Questions.</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm">Quick answers to the most common questions about A+FCU membership, accounts, and services.</p>
          </div>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
          <div className="mt-10 border border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-cream">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-brand-green shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-ink">Still have questions?</h4>
                <p className="text-sm text-muted-foreground">Our team is available by phone, chat, or at any branch.</p>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <a href="tel:18002528148" className="inline-flex items-center gap-1.5 bg-brand-green hover:bg-brand-green-dark text-white px-4 py-2 font-semibold text-sm transition-colors">
                Call Us
              </a>
              <a href="#" className="inline-flex items-center gap-1.5 border border-border hover:border-brand-green text-ink px-4 py-2 font-semibold text-sm transition-colors">
                Find a Branch
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
