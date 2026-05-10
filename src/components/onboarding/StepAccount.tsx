import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const ACCOUNTS = [
  {
    id: "cash-back-checking",
    name: "Cash-Back Checking",
    badge: "Most Popular",
    rate: "Up to 3% cash back",
    features: ["No monthly fee", "Up to 3% cash back on debit card purchases", "Get paid up to 2 days early†", "Free mobile app with deposit"],
  },
  {
    id: "free-checking",
    name: "Free Checking",
    badge: null,
    rate: "0% monthly fee",
    features: ["No minimum balance", "Free debit card", "Online & mobile banking", "Unlimited transactions"],
  },
  {
    id: "regular-savings",
    name: "Regular Savings",
    badge: null,
    rate: "Competitive APY",
    features: ["$5 minimum to open", "Earns dividends monthly", "Free online access", "NCUA insured up to $250K"],
  },
  {
    id: "money-market",
    name: "Money Market",
    badge: "High Yield",
    rate: "Higher dividends",
    features: ["Higher dividend tiers", "Limited transactions per month", "Online & mobile access", "NCUA insured up to $250K"],
  },
];

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

export function StepAccount({ selected, onChange }: Props) {
  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl mb-2">Choose your first account</h2>
      <p className="text-muted-foreground mb-8">You can always add more products after joining.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {ACCOUNTS.map((acct) => {
          const active = selected === acct.id;
          return (
            <button
              key={acct.id}
              type="button"
              onClick={() => onChange(acct.id)}
              className={cn(
                "text-left p-5 border-2 transition-all relative hover:border-brand-green",
                active ? "border-brand-green bg-brand-green/5" : "border-border bg-white"
              )}
            >
              {acct.badge && (
                <span className="absolute top-3 right-3 bg-brand-yellow text-ink text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                  {acct.badge}
                </span>
              )}
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 mb-3 flex items-center justify-center",
                  active ? "border-brand-green bg-brand-green" : "border-border"
                )}
              >
                {active && <Check className="w-3 h-3 text-white" />}
              </div>
              <p className={cn("font-semibold text-base", active ? "text-brand-green" : "text-ink")}>{acct.name}</p>
              <p className="text-xs text-brand-green font-semibold mt-0.5 mb-3">{acct.rate}</p>
              <ul className="space-y-1.5">
                {acct.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-brand-green mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
      {!selected && (
        <p className="mt-4 text-sm text-destructive">Please select an account to continue.</p>
      )}
    </div>
  );
}
