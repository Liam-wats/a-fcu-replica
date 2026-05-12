import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { useState } from "react";
import { useJoin, type PersonalData, type AddressData } from "@/context/JoinContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/join/personal")({
  head: () => ({ meta: [{ title: "Join A+FCU — About You" }] }),
  component: AboutYouPage,
});

const US_STATES = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"],
  ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"],
  ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"],
  ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"],
  ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
  ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"],
  ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"],
  ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"],
  ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"],
  ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"],
  ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"],
  ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"],
  ["WI", "Wisconsin"], ["WY", "Wyoming"],
] as [string, string][];

type Errs = Partial<Record<keyof PersonalData | keyof AddressData, string>>;

function validate(p: PersonalData, a: AddressData): Errs {
  const e: Errs = {};
  if (!p.firstName.trim()) e.firstName = "First name is required";
  if (!p.lastName.trim()) e.lastName = "Last name is required";
  if (!p.email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) e.email = "Enter a valid email";
  if (!p.phone.trim()) e.phone = "Phone is required";
  if (!p.dob.trim()) e.dob = "Date of birth is required";
  if (!p.ssn.trim()) e.ssn = "SSN last 4 required";
  else if (!/^\d{4}$/.test(p.ssn)) e.ssn = "Must be 4 digits";
  if (!a.street.trim()) e.street = "Street is required";
  if (!a.city.trim()) e.city = "City is required";
  if (!a.state.trim()) e.state = "State is required";
  if (!a.zip.trim()) e.zip = "ZIP is required";
  else if (!/^\d{5}$/.test(a.zip)) e.zip = "5-digit ZIP required";
  return e;
}

const inputBase =
  "w-full border border-border px-3.5 py-3 text-base sm:text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all bg-white placeholder:text-muted-foreground/60";

function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function AboutYouPage() {
  const { personal, setPersonal, address, setAddress } = useJoin();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Errs>({});

  const setP = (key: keyof PersonalData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonal({ ...personal, [key]: e.target.value });
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };
  const setA = (key: keyof AddressData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [key]: e.target.value });
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const handleContinue = () => {
    const errs = validate(personal, address);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const first = document.querySelector<HTMLElement>("[data-error='true']");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    navigate({ to: "/join/account" });
  };

  const errBorder = (k: keyof Errs) =>
    errors[k] && "border-destructive focus:border-destructive focus:ring-destructive/10";

  return (
    <div>
      <div className="px-5 sm:px-8 pt-6 sm:pt-10 pb-5 sm:pb-6 border-b border-border">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-green mb-1">Step 2 of 4</p>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink mb-2">Tell us about yourself</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          We'll use this to verify your identity and set up your membership.
        </p>
      </div>

      <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-8">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <Field label="First Name" required error={errors.firstName}>
              <input className={cn(inputBase, errBorder("firstName"))} value={personal.firstName} onChange={setP("firstName")} placeholder="Jane" autoComplete="given-name" data-error={!!errors.firstName} />
            </Field>
            <Field label="Last Name" required error={errors.lastName}>
              <input className={cn(inputBase, errBorder("lastName"))} value={personal.lastName} onChange={setP("lastName")} placeholder="Smith" autoComplete="family-name" />
            </Field>
            <Field label="Email Address" required error={errors.email}>
              <input type="email" className={cn(inputBase, errBorder("email"))} value={personal.email} onChange={setP("email")} placeholder="jane@example.com" autoComplete="email" />
            </Field>
            <Field label="Phone Number" required error={errors.phone}>
              <input type="tel" className={cn(inputBase, errBorder("phone"))} value={personal.phone} onChange={setP("phone")} placeholder="(512) 555-0100" autoComplete="tel" />
            </Field>
            <Field label="Date of Birth" required error={errors.dob}>
              <input type="date" className={cn(inputBase, errBorder("dob"))} value={personal.dob} onChange={setP("dob")} autoComplete="bday" />
            </Field>
            <Field label="Last 4 of SSN" required hint="Used for identity verification only" error={errors.ssn}>
              <input type="password" inputMode="numeric" maxLength={4} className={cn(inputBase, errBorder("ssn"))} value={personal.ssn} onChange={setP("ssn")} placeholder="••••" />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Home Address
          </h2>
          <div className="flex flex-col gap-4 sm:gap-5">
            <Field label="Street Address" required error={errors.street}>
              <input className={cn(inputBase, errBorder("street"))} value={address.street} onChange={setA("street")} placeholder="123 Main Street" autoComplete="address-line1" />
            </Field>
            <Field label="Apt / Suite / Unit">
              <input className={inputBase} value={address.apt} onChange={setA("apt")} placeholder="Apartment 4B (optional)" autoComplete="address-line2" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <Field label="City" required error={errors.city}>
                <input className={cn(inputBase, errBorder("city"))} value={address.city} onChange={setA("city")} placeholder="Austin" autoComplete="address-level2" />
              </Field>
              <Field label="State" required error={errors.state}>
                <select className={cn(inputBase, "appearance-none cursor-pointer", errBorder("state"))} value={address.state} onChange={setA("state")} autoComplete="address-level1">
                  <option value="">Select state</option>
                  {US_STATES.map(([abbr, name]) => (
                    <option key={abbr} value={abbr}>{abbr} — {name}</option>
                  ))}
                </select>
              </Field>
              <Field label="ZIP Code" required error={errors.zip}>
                <input className={cn(inputBase, errBorder("zip"))} value={address.zip} onChange={setA("zip")} placeholder="78701" maxLength={5} inputMode="numeric" autoComplete="postal-code" />
              </Field>
            </div>
          </div>
        </section>

        <div className="flex items-start gap-3 bg-muted/40 border border-border p-4">
          <ShieldCheck className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your information is encrypted with 256-bit SSL and never shared with third parties. We perform a soft credit
            check that will not affect your credit score.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-6 border-t border-border">
          <button type="button" onClick={() => navigate({ to: "/join/goals" })}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-ink hover:text-brand-green transition-colors py-3 sm:py-0">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="text-xs text-muted-foreground hidden sm:inline">Step 2 of 4</span>
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
