import { Check, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  badge?: string | null;
  tagline: string;
  rate: string;
  minOpen: string;
  monthlyFee: string;
  features: string[];
  featured?: boolean;
  joinHref?: string;
}

export function ProductCard({
  name, badge, tagline, rate, minOpen, monthlyFee, features, featured = false, joinHref = "/join",
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col border-2 transition-shadow hover:shadow-lg",
        featured ? "border-brand-green" : "border-border"
      )}
    >
      {badge ? (
        <div className={cn("px-6 py-2 text-xs font-bold uppercase tracking-wider", featured ? "bg-brand-green text-white" : "bg-brand-yellow text-ink")}>
          {badge}
        </div>
      ) : (
        <div className="h-[33px]" />
      )}

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <h3 className="font-serif text-2xl md:text-3xl text-ink">{name}</h3>
        <p className="mt-1.5 text-muted-foreground text-sm">{tagline}</p>

        <div className="mt-5 grid grid-cols-3 gap-3 border-y border-border py-4">
          {[
            { label: "Rate / Return", value: rate },
            { label: "Min. to Open", value: minOpen },
            { label: "Monthly Fee", value: monthlyFee },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
              <p className="font-serif text-base font-semibold text-brand-green mt-0.5 leading-tight">{value}</p>
            </div>
          ))}
        </div>

        <ul className="mt-5 space-y-2.5 flex-1">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-ink/80">
              <Check className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <Link
          to={joinHref}
          className={cn(
            "mt-8 inline-flex items-center justify-center gap-2 py-3 px-6 font-semibold text-sm transition-colors",
            featured
              ? "bg-brand-green hover:bg-brand-green-dark text-white"
              : "border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
          )}
        >
          Open Account <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
