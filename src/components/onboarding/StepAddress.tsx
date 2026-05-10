import { cn } from "@/lib/utils";

export interface AddressData {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

interface Props {
  data: AddressData;
  onChange: (data: AddressData) => void;
  errors: Partial<Record<keyof AddressData, string>>;
}

const inputClass =
  "border border-border px-3 py-2.5 text-sm outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 transition-colors";

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

export function StepAddress({ data, onChange, errors }: Props) {
  const set = (key: keyof AddressData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...data, [key]: e.target.value });

  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl mb-2">Where do you live?</h2>
      <p className="text-muted-foreground mb-8">A physical address is required for identity verification.</p>
      <div className="flex flex-col gap-5">
        <Field label="Street Address" required error={errors.street}>
          <input
            className={cn(inputClass, errors.street && "border-destructive")}
            value={data.street}
            onChange={set("street")}
            placeholder="123 Main St"
          />
        </Field>
        <Field label="Apt / Suite / Unit" error={errors.apt}>
          <input
            className={inputClass}
            value={data.apt}
            onChange={set("apt")}
            placeholder="Apt 4B (optional)"
          />
        </Field>
        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="City" required error={errors.city}>
            <input
              className={cn(inputClass, errors.city && "border-destructive")}
              value={data.city}
              onChange={set("city")}
              placeholder="Austin"
            />
          </Field>
          <Field label="State" required error={errors.state}>
            <select
              className={cn(inputClass, "bg-white cursor-pointer", errors.state && "border-destructive")}
              value={data.state}
              onChange={set("state")}
            >
              <option value="">Select</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="ZIP Code" required error={errors.zip}>
            <input
              className={cn(inputClass, errors.zip && "border-destructive")}
              value={data.zip}
              onChange={set("zip")}
              placeholder="78701"
              maxLength={5}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
