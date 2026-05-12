import { createFileRoute, Outlet, useLocation, Link } from "@tanstack/react-router";
import { ShieldCheck, Check } from "lucide-react";
import { JoinProvider, STEP_META } from "@/context/JoinContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/join")({
  component: JoinLayout,
});

function getCurrentId(path: string) {
  const s = STEP_META.find((s) => path.includes(s.slug));
  return s?.id ?? 1;
}

function MobileStepBar({ currentId }: { currentId: number }) {
  const total = STEP_META.length;
  const current = STEP_META.find((s) => s.id === currentId);
  const pct = (currentId / total) * 100;
  return (
    <div className="lg:hidden bg-white border border-border">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] uppercase tracking-widest font-bold text-brand-green">
            Step {currentId} of {total}
          </p>
          <p className="text-[11px] text-muted-foreground">{current?.label}</p>
        </div>
        <div className="h-1.5 bg-muted overflow-hidden">
          <div className="h-full bg-brand-green transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <ol className="flex justify-between mt-3" aria-label="Application steps">
          {STEP_META.map((s) => {
            const done = currentId > s.id;
            const active = currentId === s.id;
            return (
              <li key={s.id} className="flex flex-col items-center gap-1 flex-1">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all",
                  done && "bg-brand-green border-brand-green text-white",
                  active && "border-brand-green text-brand-green bg-brand-green/5",
                  !done && !active && "border-border text-muted-foreground bg-white"
                )} aria-current={active ? "step" : undefined}>
                  {done ? <Check className="w-3 h-3" /> : s.id}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function StepSidebar({ currentId }: { currentId: number }) {
  return (
    <aside className="hidden lg:block lg:w-64 shrink-0">
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
                    aria-current={active ? "step" : undefined}
                  >
                    {done ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  {!last && (
                    <div className={cn("w-px flex-1 my-1.5 min-h-[28px]", done ? "bg-brand-green" : "bg-border")} />
                  )}
                </div>
                <div className="pb-7">
                  <p className={cn("text-sm font-semibold leading-8",
                    active ? "text-brand-green" : done ? "text-ink" : "text-muted-foreground")}>
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
            <Check className="w-3 h-3 text-brand-green" /> Takes about 4 minutes
          </p>
        </div>
      </div>
    </aside>
  );
}

function JoinLayout() {
  const location = useLocation();
  const isConfirmation = location.pathname.includes("confirmation");
  const currentId = getCurrentId(location.pathname);

  return (
    <JoinProvider>
      <div className="min-h-screen bg-brand-cream flex flex-col">
        <header className="bg-white border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-end">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              <span className="hidden sm:inline">256-bit SSL Encrypted</span>
              <span className="sm:hidden">Secure</span>
            </div>
          </div>
        </header>

        {isConfirmation ? (
          <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
            <Outlet />
          </main>
        ) : (
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-10">
            <div className="lg:hidden mb-4">
              <MobileStepBar currentId={currentId} />
            </div>
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <StepSidebar currentId={currentId} />
              <div className="flex-1 min-w-0">
                <div className="bg-white border border-border">
                  <Outlet />
                </div>
              </div>
            </div>
          </main>
        )}

        <footer className="border-t border-border bg-white py-4 mt-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground text-center sm:text-left">
            <span>© {new Date().getFullYear()} A+FCU · Federally insured by NCUA · Equal Housing Lender</span>
            <div className="flex gap-4">
              <Link to="/" className="hover:text-brand-green transition-colors">Privacy</Link>
              <Link to="/" className="hover:text-brand-green transition-colors">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </JoinProvider>
  );
}
