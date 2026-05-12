import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Star, TrendingUp, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useJoin } from "@/context/JoinContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/join/account")({
  head: () => ({ meta: [{ title: "Join A+FCU — Account & Login" }] }),
  component: AccountPage,
});

const ACCOUNTS = [
  { id: "cash-back-checking", name: "Cash-Back Checking", tagline: "Earn while you spend", badge: "Most Popular", badgeIcon: Star, highlight: "Up to 3% cash back",
    features: ["Up to 3% cash back on debit purchases", "No monthly service fee", "Get paid up to 2 days early†", "Free mobile deposit"] },
  { id: "free-checking", name: "Free Checking", tagline: "Simple, no-frills banking", badge: null, badgeIcon: null, highlight: "No monthly fee",
    features: ["No minimum balance", "Free debit card", "Online & mobile banking", "Unlimited transactions"] },
  { id: "regular-savings", name: "Regular Savings", tagline: "Grow your nest egg", badge: null, badgeIcon: null, highlight: "Competitive APY",
    features: ["$5 minimum to open", "Monthly dividend earnings", "Free online access", "NCUA insured up to $250K"] },
  { id: "money-market", name: "Money Market", tagline: "Higher yields, larger balances", badge: "High Yield", badgeIcon: TrendingUp, highlight: "Tiered dividend rates",
    features: ["Higher dividend rates by tier", "Up to 6 withdrawals per month", "Online & mobile access", "NCUA insured up to $250K"] },
];

function rule(label: string, ok: boolean) {
  return (
    <li className={cn("flex items-center gap-1.5 text-xs transition-colors", ok ? "text-brand-green" : "text-ink/40")}>
      <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0", ok ? "text-brand-green" : "text-ink/20")} />
      {label}
    </li>
  );
}

const inputBase =
  "w-full border px-4 py-3 text-base sm:text-sm outline-none focus:ring-2 focus:ring-brand-green/10 transition-all";

function AccountPage() {
  const { account, setAccount, credentials, setCredentials } = useJoin();
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState(credentials.loginId);
  const [password, setPassword] = useState(credentials.password);
  const [confirm, setConfirm] = useState(credentials.password);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState(false);

  const loginIdOk = /^[a-zA-Z0-9._-]{6,20}$/.test(loginId);
  const pwLength = password.length >= 8;
  const pwUpper = /[A-Z]/.test(password);
  const pwNumber = /[0-9]/.test(password);
  const pwMatch = password === confirm && confirm.length > 0;
  const valid = !!account && loginIdOk && pwLength && pwUpper && pwNumber && pwMatch;

  const handleContinue = () => {
    setTouched(true);
    if (!valid) return;
    setCredentials({ loginId, password });
    navigate({ to: "/join/review" });
  };

  return (
    <div>
      <div className="px-5 sm:px-8 pt-6 sm:pt-10 pb-5 sm:pb-6 border-b border-border">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-green mb-1">Step 3 of 4</p>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink mb-2">Choose your account & login</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Pick your first account and create your online banking credentials.</p>
      </div>

      <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-8">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">First Account</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {ACCOUNTS.map((acct) => {
              const active = account === acct.id;
              const BadgeIcon = acct.badgeIcon;
              return (
                <button key={acct.id} type="button" onClick={() => setAccount(acct.id)}
                  className={cn("text-left p-4 sm:p-5 border-2 transition-all relative hover:border-brand-green group flex flex-col min-h-[64px]",
                    active ? "border-brand-green bg-brand-green/5" : "border-border bg-white")}>
                  {acct.badge && BadgeIcon && (
                    <span className={cn("absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
                      active ? "bg-brand-yellow text-ink" : "bg-muted text-muted-foreground")}>
                      <BadgeIcon className="w-3 h-3" />{acct.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-2 pr-20">
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      active ? "border-brand-green bg-brand-green" : "border-border")}>
                      {active && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className={cn("font-bold text-sm sm:text-base leading-tight", active ? "text-brand-green" : "text-ink")}>{acct.name}</p>
                      <p className="text-xs text-muted-foreground">{acct.tagline}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-brand-green mb-3">{acct.highlight}</div>
                  <ul className="flex flex-col gap-1.5 mt-auto">
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
          {touched && !account && (
            <p className="mt-3 text-sm text-destructive">Please select an account.</p>
          )}
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Online Banking Login</h2>
          <div className="max-w-md flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-id" className="text-sm font-semibold text-ink">Login ID</label>
              <input id="login-id" type="text" autoComplete="username" spellCheck={false} maxLength={20}
                className={cn(inputBase, touched && !loginIdOk ? "border-destructive focus:border-destructive" : "border-border focus:border-brand-green")}
                placeholder="e.g. jsmith92" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
              <p className="text-[11px] text-ink/45">6–20 characters. Letters, numbers, periods, hyphens, underscores.</p>
              {touched && !loginIdOk && <p className="text-[11px] text-destructive">Enter a valid Login ID.</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pw" className="text-sm font-semibold text-ink">Password</label>
              <div className="relative">
                <input id="pw" type={showPw ? "text" : "password"} autoComplete="new-password"
                  className={cn(inputBase, "pr-11", touched && !pwLength ? "border-destructive focus:border-destructive" : "border-border focus:border-brand-green")}
                  placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink p-1"
                  aria-label={showPw ? "Hide password" : "Show password"}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <ul className="mt-1.5 flex flex-col gap-1">
                {rule("At least 8 characters", pwLength)}
                {rule("At least one uppercase letter", pwUpper)}
                {rule("At least one number", pwNumber)}
              </ul>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pw-confirm" className="text-sm font-semibold text-ink">Confirm Password</label>
              <div className="relative">
                <input id="pw-confirm" type={showConfirm ? "text" : "password"} autoComplete="new-password"
                  className={cn(inputBase, "pr-11", touched && !pwMatch ? "border-destructive focus:border-destructive" : "border-border focus:border-brand-green")}
                  placeholder="Re-enter your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink p-1"
                  aria-label={showConfirm ? "Hide" : "Show"}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched && !pwMatch && <p className="text-[11px] text-destructive">Passwords do not match.</p>}
            </div>

            <div className="flex items-start gap-3 bg-brand-green/5 border border-brand-green/20 p-4">
              <ShieldCheck className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
              <p className="text-xs text-ink/65 leading-relaxed">
                Never share your Login ID or password with anyone, including A+FCU staff.
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-6 border-t border-border">
          <button type="button" onClick={() => navigate({ to: "/join/personal" })}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-ink hover:text-brand-green transition-colors py-3 sm:py-0">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="text-xs text-muted-foreground hidden sm:inline">Step 3 of 4</span>
            <button type="button" onClick={handleContinue}
              className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 sm:px-7 py-3 font-semibold text-sm transition-colors w-full sm:w-auto min-h-[44px]">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
