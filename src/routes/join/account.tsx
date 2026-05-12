import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Star, TrendingUp } from "lucide-react";
import { useJoin } from "@/context/JoinContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/join/account")({
  head: () => ({ meta: [{ title: "Join A+FCU — Choose Your Account" }] }),
  component: AccountPage,
});

const ACCOUNTS = [
  {
    id: "cash-back-checking",
    name: "Cash-Back Checking",
    tagline: "Earn while you spend",
    badge: "Most Popular",
    badgeIcon: Star,
    highlight: "Up to 3% cash back",
    highlightColor: "text-brand-green",
    features: [
      "Up to 3% cash back on debit purchases",
      "No monthly service fee",
      "Get paid up to 2 days early†",
      "Free mobile deposit & online banking",
      "Free debit Mastercard®",
    ],
  },
  {
    id: "free-checking",
    name: "Free Checking",
    tagline: "Simple, no-frills banking",
    badge: null,
    badgeIcon: null,
    highlight: "No monthly fee",
    highlightColor: "text-brand-green",
    features: [
      "No minimum balance required",
      "Free debit card",
      "Online & mobile banking",
      "Unlimited transactions",
      "Free e-statements",
    ],
  },
  {
    id: "regular-savings",
    name: "Regular Savings",
    tagline: "Grow your nest egg",
    badge: null,
    badgeIcon: null,
    highlight: "Competitive APY",
    highlightColor: "text-brand-green",
    features: [
      "$5 minimum to open",
      "Monthly dividend earnings",
      "Free online account access",
      "NCUA insured up to $250,000",
      "Automatic savings transfers",
    ],
  },
  {
    id: "money-market",
    name: "Money Market",
    tagline: "Higher yields for larger balances",
    badge: "High Yield",
    badgeIcon: TrendingUp,
    highlight: "Tiered dividend rates",
    highlightColor: "text-brand-green",
    features: [
      "Higher dividend rates by balance tier",
      "Up to 6 withdrawals per month",
      "Online & mobile access",
      "NCUA insured up to $250,000",
      "Linked to your checking account",
    ],
  },
];

function AccountPage() {
  const { account, setAccount } = useJoin();
  const navigate = useNavigate();

  return (
    <div>
      <div className="px-8 pt-10 pb-6 border-b border-border">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-green mb-1">Step 4 of 5</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">Choose your first account</h1>
        <p className="text-muted-foreground">You can always open additional accounts after you become a member.</p>
      </div>

      <div className="px-8 py-8">
        <div className="grid sm:grid-cols-2 gap-4">
          {ACCOUNTS.map((acct) => {
            const active = account === acct.id;
            const BadgeIcon = acct.badgeIcon;
            return (
              <button
                key={acct.id}
                type="button"
                onClick={() => setAccount(acct.id)}
                className={cn(
                  "text-left p-5 border-2 transition-all relative hover:border-brand-green group flex flex-col",
                  active ? "border-brand-green bg-brand-green/5" : "border-border bg-white"
                )}
              >
                {acct.badge && BadgeIcon && (
                  <span className={cn(
                    "absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
                    active ? "bg-brand-yellow text-ink" : "bg-muted text-muted-foreground"
                  )}>
                    <BadgeIcon className="w-3 h-3" />
                    {acct.badge}
                  </span>
                )}

                <div className="flex items-center gap-3 mb-3 pr-20">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                      active ? "border-brand-green bg-brand-green" : "border-border group-hover:border-brand-green/50"
                    )}
                  >
                    {active && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className={cn("font-bold text-base leading-tight", active ? "text-brand-green" : "text-ink")}>
                      {acct.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{acct.tagline}</p>
                  </div>
                </div>

                <div className={cn("text-sm font-bold mb-4", acct.highlightColor)}>
                  {acct.highlight}
                </div>

                <ul className="flex flex-col gap-2 mt-auto">
                  {acct.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-brand-green mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {!account && (
          <p className="mt-5 text-sm text-destructive flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-destructive inline-block" />
            Please select an account to continue.
          </p>
        )}

        <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => navigate({ to: "/join/address" })}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand-green transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Step 4 of 5</span>
            <button
              type="button"
              onClick={() => account && navigate({ to: "/join/review" })}
              disabled={!account}
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed text-white px-7 py-3 font-semibold text-sm transition-colors"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
