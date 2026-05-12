import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { ShieldCheck, Check } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { JoinProvider, STEP_META } from "@/context/JoinContext";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/join")({
  component: JoinLayout,
});

function StepSidebar({ currentPath }: { currentPath: string }) {
  const currentStep = STEP_META.find((s) => currentPath.includes(s.slug));
  const currentId = currentStep?.id ?? 1;

  return (
    <aside className="lg:w-64 shrink-0">
      <div className="bg-white border border-border sticky top-6">
        <div className="px-6 py-5 border-b border-border">
          <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">
            Membership Application
          </p>
        </div>
        <ol className="px-6 py-5 flex flex-col gap-0">
          {STEP_META.map((step, i) => {
            const done = currentId > step.id;
            const active = currentId === step.id;
            const last = i === STEP_META.length - 1;
            return (
              <li key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold shrink-0 transition-all",
                      done && "bg-brand-green border-brand-green text-white",
                      active && "border-brand-green text-brand-green bg-brand-green/5",
                      !done && !active && "border-border text-muted-foreground bg-white"
                    )}
                  >
                    {done ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  {!last && (
                    <div className={cn("w-px flex-1 my-1.5 min-h-[28px]", done ? "bg-brand-green" : "bg-border")} />
                  )}
                </div>
                <div className="pb-7">
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
        <div className="px-6 pb-5 pt-0 border-t border-border space-y-2">
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-4">
            <Check className="w-3 h-3 text-brand-green" /> No application fee
          </p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Check className="w-3 h-3 text-brand-green" /> Soft credit check only
          </p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Check className="w-3 h-3 text-brand-green" /> Takes about 5 minutes
          </p>
        </div>
      </div>
    </aside>
  );
}

function JoinLayout() {
  const location = useLocation();
  const isConfirmation = location.pathname.includes("confirmation");

  return (
    <JoinProvider>
      <div className="min-h-screen bg-brand-cream flex flex-col">
        <header className="bg-white border-b border-border">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              <span>256-bit SSL Encrypted</span>
            </div>
          </div>
        </header>

        {isConfirmation ? (
          <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
            <Outlet />
          </main>
        ) : (
          <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
            <div className="flex flex-col lg:flex-row gap-8">
              <StepSidebar currentPath={location.pathname} />
              <div className="flex-1 min-w-0">
                <div className="bg-white border border-border">
                  <Outlet />
                </div>
              </div>
            </div>
          </main>
        )}

        <footer className="border-t border-border bg-white py-4">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} A+ Federal Credit Union · Federally insured by NCUA · Equal Housing Lender</span>
            <div className="flex gap-4">
              <Link to="/" className="hover:text-brand-green transition-colors">Privacy Policy</Link>
              <Link to="/" className="hover:text-brand-green transition-colors">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </JoinProvider>
  );
}
