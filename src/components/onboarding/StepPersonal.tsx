import { cn } from "@/lib/utils";

export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  ssn: string;
}

interface Props {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
  errors: Partial<Record<keyof PersonalData, string>>;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-ink">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}

const inputClass =
  "border border-border px-3 py-2.5 text-sm outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 transition-colors";

export function StepPersonal({ data, onChange, errors }: Props) {
  const set = (key: keyof PersonalData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [key]: e.target.value });

  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl mb-2">Tell us about yourself</h2>
      <p className="text-muted-foreground mb-8">We'll use this to set up your membership.</p>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="First Name" required error={errors.firstName}>
          <input
            className={cn(inputClass, errors.firstName && "border-destructive")}
            value={data.firstName}
            onChange={set("firstName")}
            placeholder="Jane"
          />
        </Field>
        <Field label="Last Name" required error={errors.lastName}>
          <input
            className={cn(inputClass, errors.lastName && "border-destructive")}
            value={data.lastName}
            onChange={set("lastName")}
            placeholder="Smith"
          />
        </Field>
        <Field label="Email Address" required error={errors.email}>
          <input
            type="email"
            className={cn(inputClass, errors.email && "border-destructive")}
            value={data.email}
            onChange={set("email")}
            placeholder="jane@example.com"
          />
        </Field>
        <Field label="Phone Number" required error={errors.phone}>
          <input
            type="tel"
            className={cn(inputClass, errors.phone && "border-destructive")}
            value={data.phone}
            onChange={set("phone")}
            placeholder="(512) 555-0100"
          />
        </Field>
        <Field label="Date of Birth" required error={errors.dob}>
          <input
            type="date"
            className={cn(inputClass, errors.dob && "border-destructive")}
            value={data.dob}
            onChange={set("dob")}
          />
        </Field>
        <Field label="Last 4 of SSN" required error={errors.ssn}>
          <input
            type="password"
            maxLength={4}
            className={cn(inputClass, errors.ssn && "border-destructive")}
            value={data.ssn}
            onChange={set("ssn")}
            placeholder="••••"
          />
        </Field>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Your information is protected with 256-bit SSL encryption and is never shared with third parties.
      </p>
    </div>
  );
}
