import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useJoin } from "@/context/JoinContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/join/credentials")({
  head: () => ({ meta: [{ title: "Join A+FCU — Create Online Banking Login" }] }),
  component: CredentialsPage,
});

function rule(label: string, ok: boolean) {
  return (
    <li className={cn("flex items-center gap-1.5 text-xs transition-colors", ok ? "text-brand-green" : "text-ink/40")}>
      <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0", ok ? "text-brand-green" : "text-ink/20")} />
      {label}
    </li>
  );
}

function CredentialsPage() {
  const { credentials, setCredentials } = useJoin();
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

  const valid = loginIdOk && pwLength && pwUpper && pwNumber && pwMatch;

  const handleContinue = () => {
    setTouched(true);
    if (!valid) return;
    setCredentials({ loginId, password });
    navigate({ to: "/join/review" });
  };

  return (
    <div>
      <div className="px-8 pt-10 pb-6 border-b border-border">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-green mb-1">Step 5 of 6</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">Create your online banking login</h1>
        <p className="text-muted-foreground">You'll use these credentials to access A+ Online Banking after your membership is approved.</p>
      </div>

      <div className="px-8 py-8">
        <div className="max-w-md flex flex-col gap-6">

          {/* Login ID */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-id" className="text-sm font-semibold text-ink">
              Login ID
            </label>
            <input
              id="login-id"
              type="text"
              autoComplete="username"
              spellCheck={false}
              maxLength={20}
              className={cn(
                "border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-green/10 transition-all",
                touched && !loginIdOk
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-brand-green"
              )}
              placeholder="e.g. jsmith92"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
            <p className="text-[11px] text-ink/45">6–20 characters. Letters, numbers, periods, hyphens and underscores only.</p>
            {touched && !loginIdOk && (
              <p className="text-[11px] text-destructive">Please enter a valid Login ID (6–20 alphanumeric characters).</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pw" className="text-sm font-semibold text-ink">Password</label>
            <div className="relative">
              <input
                id="pw"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                className={cn(
                  "w-full border px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-brand-green/10 transition-all",
                  touched && !pwLength
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-brand-green"
                )}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink transition-colors"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength rules */}
            <ul className="mt-1.5 flex flex-col gap-1">
              {rule("At least 8 characters", pwLength)}
              {rule("At least one uppercase letter", pwUpper)}
              {rule("At least one number", pwNumber)}
            </ul>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pw-confirm" className="text-sm font-semibold text-ink">Confirm Password</label>
            <div className="relative">
              <input
                id="pw-confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                className={cn(
                  "w-full border px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-brand-green/10 transition-all",
                  touched && !pwMatch
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-brand-green"
                )}
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink transition-colors"
                aria-label={showConfirm ? "Hide" : "Show"}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {touched && !pwMatch && confirm.length > 0 && (
              <p className="text-[11px] text-destructive">Passwords do not match.</p>
            )}
            {touched && confirm.length === 0 && (
              <p className="text-[11px] text-destructive">Please confirm your password.</p>
            )}
          </div>

          <div className="flex items-start gap-3 bg-brand-green/5 border border-brand-green/20 p-4">
            <ShieldCheck className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
            <p className="text-xs text-ink/65 leading-relaxed">
              Your credentials are encrypted and stored securely. Never share your Login ID or password with anyone, including A+FCU staff.
            </p>
          </div>

        </div>

        <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => navigate({ to: "/join/account" })}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand-green transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Step 5 of 6</span>
            <button
              type="button"
              onClick={handleContinue}
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
