import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PiggyBank, CreditCard, Home, Car, GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { useJoin } from "@/context/JoinContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/join/goals")({
  head: () => ({ meta: [{ title: "Join A+FCU — Your Goals" }] }),
  component: GoalsPage,
});

const GOALS = [
  {
    id: "checking",
    icon: CreditCard,
    label: "Checking Account",
    desc: "Everyday spending with cash back rewards",
    color: "text-emerald-600",
  },
  {
    id: "savings",
    icon: PiggyBank,
    label: "Savings Account",
    desc: "Build your emergency fund & earn dividends",
    color: "text-emerald-600",
  },
  {
    id: "home-loan",
    icon: Home,
    label: "Home Loan",
    desc: "Buy, build, or refinance your home",
    color: "text-emerald-600",
  },
  {
    id: "auto-loan",
    icon: Car,
    label: "Auto Loan",
    desc: "Finance a new or used vehicle",
    color: "text-emerald-600",
  },
  {
    id: "student",
    icon: GraduationCap,
    label: "Student Services",
    desc: "Education accounts & student loans",
    color: "text-emerald-600",
  },
  {
    id: "business",
    icon: Briefcase,
    label: "Business Banking",
    desc: "Accounts & lending for your business",
    color: "text-emerald-600",
  },
];

function GoalsPage() {
  const { goals, setGoals } = useJoin();
  const navigate = useNavigate();

  const toggle = (id: string) => {
    setGoals(goals.includes(id) ? goals.filter((g) => g !== id) : [...goals, id]);
  };

  const handleContinue = () => {
    if (goals.length > 0) navigate({ to: "/join/personal" });
  };

  return (
    <div>
      <div className="px-8 pt-10 pb-6 border-b border-border">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-green mb-1">Step 1 of 5</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">What brings you to A+FCU?</h1>
        <p className="text-muted-foreground">Select everything that applies — we'll tailor your membership.</p>
      </div>

      <div className="px-8 py-8">
        <div className="grid sm:grid-cols-2 gap-3">
          {GOALS.map(({ id, icon: Icon, label, desc }) => {
            const active = goals.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                className={cn(
                  "flex items-start gap-4 p-5 border-2 text-left transition-all hover:border-brand-green group",
                  active ? "border-brand-green bg-brand-green/5" : "border-border bg-white"
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 flex items-center justify-center shrink-0 transition-all",
                    active
                      ? "bg-brand-green text-white"
                      : "bg-muted text-muted-foreground group-hover:bg-brand-green/10 group-hover:text-brand-green"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className={cn("font-semibold text-sm", active ? "text-brand-green" : "text-ink")}>{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <div
                  className={cn(
                    "ml-auto w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all",
                    active ? "border-brand-green bg-brand-green" : "border-border"
                  )}
                >
                  {active && (
                    <svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {goals.length === 0 && (
          <p className="mt-5 text-sm text-destructive flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-destructive inline-block" />
            Please select at least one goal to continue.
          </p>
        )}

        <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
          <div />
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Step 1 of 5</span>
            <button
              type="button"
              onClick={handleContinue}
              disabled={goals.length === 0}
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
