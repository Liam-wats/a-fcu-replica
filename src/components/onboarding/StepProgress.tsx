import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const STEPS = [
  { id: 1, label: "Your Goals" },
  { id: 2, label: "Personal Info" },
  { id: 3, label: "Address" },
  { id: 4, label: "Account" },
  { id: 5, label: "Review" },
];

export function StepProgress({ current }: { current: number }) {
  return (
    <ol className="flex flex-col gap-0">
      {STEPS.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        const last = i === STEPS.length - 1;
        return (
          <li key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold shrink-0 transition-colors",
                  done && "bg-brand-green border-brand-green text-white",
                  active && "border-brand-green text-brand-green bg-white",
                  !done && !active && "border-border text-muted-foreground bg-white"
                )}
              >
                {done ? <Check className="w-4 h-4" /> : step.id}
              </div>
              {!last && (
                <div
                  className={cn(
                    "w-0.5 flex-1 my-1 min-h-[2rem]",
                    done ? "bg-brand-green" : "bg-border"
                  )}
                />
              )}
            </div>
            <div className="pb-6">
              <p
                className={cn(
                  "text-sm font-semibold leading-8",
                  active ? "text-brand-green" : done ? "text-ink" : "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
