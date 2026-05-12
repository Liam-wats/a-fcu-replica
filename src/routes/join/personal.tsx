import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useJoin, type PersonalData } from "@/context/JoinContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/join/personal")({
  head: () => ({ meta: [{ title: "Join A+FCU — Personal Information" }] }),
  component: PersonalPage,
});

function validate(data: PersonalData): Partial<Record<keyof PersonalData, string>> {
  const errs: Partial<Record<keyof PersonalData, string>> = {};
  if (!data.firstName.trim()) errs.firstName = "First name is required";
  if (!data.lastName.trim()) errs.lastName = "Last name is required";
  if (!data.email.trim()) errs.email = "Email address is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Enter a valid email address";
  if (!data.phone.trim()) errs.phone = "Phone number is required";
  if (!data.dob.trim()) errs.dob = "Date of birth is required";
  if (!data.ssn.trim()) errs.ssn = "Last 4 digits of SSN are required";
  else if (!/^\d{4}$/.test(data.ssn)) errs.ssn = "Must be exactly 4 digits";
  return errs;
}

const inputBase =
  "w-full border border-border px-3.5 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all bg-white placeholder:text-muted-foreground/60";

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function PersonalPage() {
  const { personal, setPersonal } = useJoin();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({});

  const set = (key: keyof PersonalData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonal({ ...personal, [key]: e.target.value });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleContinue = () => {
    const errs = validate(personal);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    navigate({ to: "/join/address" });
  };

  return (
    <div>
      <div className="px-8 pt-10 pb-6 border-b border-border">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-green mb-1">Step 2 of 5</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">Tell us about yourself</h1>
        <p className="text-muted-foreground">We'll use this information to verify your identity and set up your membership.</p>
      </div>

      <div className="px-8 py-8">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="First Name" required error={errors.firstName}>
            <input
              className={cn(inputBase, errors.firstName && "border-destructive focus:border-destructive focus:ring-destructive/10")}
              value={personal.firstName}
              onChange={set("firstName")}
              placeholder="Jane"
              autoComplete="given-name"
            />
          </Field>

          <Field label="Last Name" required error={errors.lastName}>
            <input
              className={cn(inputBase, errors.lastName && "border-destructive focus:border-destructive focus:ring-destructive/10")}
              value={personal.lastName}
              onChange={set("lastName")}
              placeholder="Smith"
              autoComplete="family-name"
            />
          </Field>

          <Field label="Email Address" required error={errors.email}>
            <input
              type="email"
              className={cn(inputBase, errors.email && "border-destructive focus:border-destructive focus:ring-destructive/10")}
              value={personal.email}
              onChange={set("email")}
              placeholder="jane@example.com"
              autoComplete="email"
            />
          </Field>

          <Field label="Phone Number" required error={errors.phone}>
            <input
              type="tel"
              className={cn(inputBase, errors.phone && "border-destructive focus:border-destructive focus:ring-destructive/10")}
              value={personal.phone}
              onChange={set("phone")}
              placeholder="(512) 555-0100"
              autoComplete="tel"
            />
          </Field>

          <Field label="Date of Birth" required error={errors.dob}>
            <input
              type="date"
              className={cn(inputBase, errors.dob && "border-destructive focus:border-destructive focus:ring-destructive/10")}
              value={personal.dob}
              onChange={set("dob")}
              autoComplete="bday"
            />
          </Field>

          <Field
            label="Last 4 Digits of SSN"
            required
            hint="Used for identity verification only"
            error={errors.ssn}
          >
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              className={cn(inputBase, errors.ssn && "border-destructive focus:border-destructive focus:ring-destructive/10")}
              value={personal.ssn}
              onChange={set("ssn")}
              placeholder="••••"
            />
          </Field>
        </div>

        <div className="mt-6 flex items-start gap-3 bg-muted/40 border border-border p-4">
          <ShieldCheck className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your information is encrypted with 256-bit SSL and is never shared with third parties. We perform a soft
            credit check that will not affect your credit score.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => navigate({ to: "/join/goals" })}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand-green transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Step 2 of 5</span>
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-7 py-3 font-semibold text-sm transition-colors"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
