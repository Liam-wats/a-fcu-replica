import { PiggyBank, CreditCard, Home, Car, GraduationCap, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const GOALS = [
  { id: "checking", icon: CreditCard, label: "Checking Account", desc: "Everyday spending & cash back" },
  { id: "savings", icon: PiggyBank, label: "Savings Account", desc: "Build your emergency fund" },
  { id: "home-loan", icon: Home, label: "Home Loan", desc: "Buy or refinance a home" },
  { id: "auto-loan", icon: Car, label: "Auto Loan", desc: "Finance a new or used vehicle" },
  { id: "student", icon: GraduationCap, label: "Student Services", desc: "Education accounts & loans" },
  { id: "business", icon: Briefcase, label: "Business Banking", desc: "Accounts & lending for your business" },
];

interface Props {
  selected: string[];
  onChange: (goals: string[]) => void;
}

export function StepGoals({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((g) => g !== id) : [...selected, id]);
  };

  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl mb-2">What brings you to A+FCU?</h2>
      <p className="text-muted-foreground mb-8">Select everything that applies — we'll tailor your membership.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {GOALS.map(({ id, icon: Icon, label, desc }) => {
          const active = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={cn(
                "flex items-start gap-4 p-4 border-2 text-left transition-all hover:border-brand-green",
                active ? "border-brand-green bg-brand-green/5" : "border-border bg-white"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded flex items-center justify-center shrink-0",
                  active ? "bg-brand-green text-white" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className={cn("font-semibold text-sm", active ? "text-brand-green" : "text-ink")}>{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>
      {selected.length === 0 && (
        <p className="mt-4 text-sm text-destructive">Please select at least one goal to continue.</p>
      )}
    </div>
  );
}
