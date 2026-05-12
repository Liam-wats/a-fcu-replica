import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";
import { useJoin, type AddressData } from "@/context/JoinContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/join/address")({
  head: () => ({ meta: [{ title: "Join A+FCU — Your Address" }] }),
  component: AddressPage,
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

function validate(data: AddressData): Partial<Record<keyof AddressData, string>> {
  const errs: Partial<Record<keyof AddressData, string>> = {};
  if (!data.street.trim()) errs.street = "Street address is required";
  if (!data.city.trim()) errs.city = "City is required";
  if (!data.state.trim()) errs.state = "State is required";
  if (!data.zip.trim()) errs.zip = "ZIP code is required";
  else if (!/^\d{5}$/.test(data.zip)) errs.zip = "Enter a valid 5-digit ZIP code";
  return errs;
}

const inputBase =
  "w-full border border-border px-3.5 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all bg-white placeholder:text-muted-foreground/60";

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
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function AddressPage() {
  const { address, setAddress } = useJoin();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<Record<keyof AddressData, string>>>({});

  const set = (key: keyof AddressData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [key]: e.target.value });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleContinue = () => {
    const errs = validate(address);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    navigate({ to: "/join/account" });
  };

  return (
    <div>
      <div className="px-8 pt-10 pb-6 border-b border-border">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-green mb-1">Step 3 of 5</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">Where do you live?</h1>
        <p className="text-muted-foreground">A physical address is required for identity verification and account setup.</p>
      </div>

      <div className="px-8 py-8">
        <div className="flex flex-col gap-5">
          <Field label="Street Address" required error={errors.street}>
            <input
              className={cn(inputBase, errors.street && "border-destructive focus:border-destructive focus:ring-destructive/10")}
              value={address.street}
              onChange={set("street")}
              placeholder="123 Main Street"
              autoComplete="address-line1"
            />
          </Field>

          <Field label="Apt / Suite / Unit" error={errors.apt}>
            <input
              className={inputBase}
              value={address.apt}
              onChange={set("apt")}
              placeholder="Apartment 4B (optional)"
              autoComplete="address-line2"
            />
          </Field>

          <div className="grid sm:grid-cols-3 gap-5">
            <Field label="City" required error={errors.city}>
              <input
                className={cn(inputBase, errors.city && "border-destructive focus:border-destructive focus:ring-destructive/10")}
                value={address.city}
                onChange={set("city")}
                placeholder="Austin"
                autoComplete="address-level2"
              />
            </Field>

            <Field label="State" required error={errors.state}>
              <select
                className={cn(
                  inputBase,
                  "cursor-pointer appearance-none",
                  errors.state && "border-destructive focus:border-destructive focus:ring-destructive/10"
                )}
                value={address.state}
                onChange={set("state")}
                autoComplete="address-level1"
              >
                <option value="">Select state</option>
                {US_STATES.map(([abbr, name]) => (
                  <option key={abbr} value={abbr}>{abbr} — {name}</option>
                ))}
              </select>
            </Field>

            <Field label="ZIP Code" required error={errors.zip}>
              <input
                className={cn(inputBase, errors.zip && "border-destructive focus:border-destructive focus:ring-destructive/10")}
                value={address.zip}
                onChange={set("zip")}
                placeholder="78701"
                maxLength={5}
                inputMode="numeric"
                autoComplete="postal-code"
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 bg-muted/40 border border-border p-4">
          <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Membership is available to individuals who live, work, worship, or attend school in the A+FCU service area,
            and their family members.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => navigate({ to: "/join/personal" })}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand-green transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Step 3 of 5</span>
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
