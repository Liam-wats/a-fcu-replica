import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Smartphone, Camera, Wallet } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/accounts/ProductCard";
import { AccountBenefits } from "@/components/accounts/AccountBenefits";
import { MOBILE_FEATURES, DIGITAL_WALLETS } from "@/data/services";

export const Route = createFileRoute("/services/mobile-banking")({
  component: MobileBankingPage,
});

const APP_FEATURES = [
  "View balances and full transaction history",
  "Deposit checks with your phone camera",
  "Pay bills and transfer funds instantly",
  "Lock/unlock your debit card in seconds",
  "Get push notifications for every transaction",
  "Check your credit score every month",
  "Send money with Zelle® to anyone",
  "Find nearby branches and ATMs on the map",
  "Apply for loans directly from the app",
];

const APP_AWARDS = [
  { label: "Best Mobile Banking App — North America", year: "2025", org: "Global Finance Magazine" },
  { label: "Best-In-Class Digital Banking", year: "2025", org: "Cornerstone Advisors" },
  { label: "Best Mobile App", year: "2025", org: "Austin Community Awards" },
];

function MobileBankingPage() {
  return (
    <>
      <PageHero
        eyebrow="Mobile Banking"
        title="Award-Winning Banking in Your Pocket."
        body="The A+ Mobile App was recognized as the Best Mobile Banking App in North America. Free for every A+FCU member on iOS and Android."
      />

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Mobile Features</p>
            <h2 className="font-serif text-3xl md:text-4xl">Do more from your phone.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {MOBILE_FEATURES.map((feature, i) => (
              <ProductCard key={feature.id} {...feature} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center max-w-5xl">
          <img
            src="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_online-services_feb26.webp"
            alt="A+ Mobile App on iPhone"
            className="w-full h-auto"
          />
          <div>
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3">A+ Mobile App</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-5">Everything You Need, One Tap Away.</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The A+ Mobile App is more than a balance checker. It's a full financial command center — designed around how members actually use their money every day.
            </p>
            <ul className="space-y-2.5 mb-8">
              {APP_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-brand-green shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#" className="inline-flex items-center justify-center gap-2 bg-ink text-white px-5 py-3 font-semibold text-sm hover:bg-ink/90 transition-colors">
                <Smartphone className="w-4 h-4" /> App Store
              </a>
              <a href="#" className="inline-flex items-center justify-center gap-2 bg-ink text-white px-5 py-3 font-semibold text-sm hover:bg-ink/90 transition-colors">
                <Smartphone className="w-4 h-4" /> Google Play
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Awards & Recognition</p>
            <h2 className="font-serif text-3xl md:text-4xl">The app that keeps winning.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {APP_AWARDS.map((award) => (
              <div key={award.label} className="border border-border p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-yellow flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold font-serif text-ink">{award.year}</span>
                </div>
                <h3 className="font-semibold text-base mb-1 text-ink">{award.label}</h3>
                <p className="text-xs text-muted-foreground">{award.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Digital Wallets</p>
            <h2 className="font-serif text-3xl md:text-4xl">Tap to pay with your A+FCU card.</h2>
            <p className="mt-4 text-muted-foreground">Add your A+FCU debit card to any of these digital wallets for fast, contactless payments at millions of locations.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {DIGITAL_WALLETS.map((wallet) => (
              <div key={wallet.name} className="bg-white border border-border p-8 text-center hover:border-brand-green hover:shadow-md transition-all">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Wallet className="w-10 h-10 text-brand-green" />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-ink">{wallet.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{wallet.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-white border border-border p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Mobile Deposit</p>
                <h3 className="font-serif text-2xl mb-4">Deposit Checks Without Leaving Home.</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Take a photo of the front and back of any check and deposit it directly to your A+FCU account from anywhere — 24/7. Funds are typically available the next business day.
                </p>
                <ul className="space-y-2">
                  {["Available on iOS and Android", "Supports personal, business & government checks", "Instant confirmation when accepted", "Deposit history stored in app"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-brand-green shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-10 h-10 text-brand-green" />
                </div>
                <p className="font-semibold text-ink mb-1">How it works</p>
                <ol className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>1. Open the A+ Mobile App</li>
                  <li>2. Tap "Deposit Check"</li>
                  <li>3. Photograph front & back</li>
                  <li>4. Confirm amount & submit</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AccountBenefits />

      <section className="bg-brand-cream py-12">
        <div className="container-x text-center max-w-xl">
          <h2 className="font-serif text-2xl mb-3">Download the A+ Mobile App</h2>
          <p className="text-muted-foreground text-sm mb-6">Free for all A+FCU members. Become a member to get started.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm">
              Become a Member <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#" className="inline-flex items-center justify-center border border-border hover:border-brand-green px-6 py-3 font-semibold text-sm text-ink">
              Download the App
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
