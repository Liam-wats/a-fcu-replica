import { PersonalData } from "./StepPersonal";
import { AddressData } from "./StepAddress";

const ACCOUNT_NAMES: Record<string, string> = {
  "cash-back-checking": "Cash-Back Checking",
  "free-checking": "Free Checking",
  "regular-savings": "Regular Savings",
  "money-market": "Money Market",
};

const GOAL_LABELS: Record<string, string> = {
  checking: "Checking Account",
  savings: "Savings Account",
  "home-loan": "Home Loan",
  "auto-loan": "Auto Loan",
  student: "Student Services",
  business: "Business Banking",
};

interface Props {
  goals: string[];
  personal: PersonalData;
  address: AddressData;
  account: string;
  onEdit: (step: number) => void;
}

function Section({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-ink/60">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-brand-green text-sm font-semibold underline underline-offset-4 hover:no-underline"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-ink">{value || "—"}</span>
    </div>
  );
}

export function StepReview({ goals, personal, address, account, onEdit }: Props) {
  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl mb-2">Review your application</h2>
      <p className="text-muted-foreground mb-8">Make sure everything looks correct before submitting.</p>
      <div className="flex flex-col gap-4">
        <Section title="Your Goals" onEdit={() => onEdit(1)}>
          <div className="flex flex-wrap gap-2">
            {goals.map((g) => (
              <span key={g} className="bg-brand-green/10 text-brand-green text-xs font-semibold px-3 py-1">
                {GOAL_LABELS[g] ?? g}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Personal Information" onEdit={() => onEdit(2)}>
          <Row label="Full Name" value={`${personal.firstName} ${personal.lastName}`} />
          <Row label="Email" value={personal.email} />
          <Row label="Phone" value={personal.phone} />
          <Row label="Date of Birth" value={personal.dob} />
          <Row label="SSN (last 4)" value={personal.ssn ? `••••••••${personal.ssn}` : ""} />
        </Section>

        <Section title="Address" onEdit={() => onEdit(3)}>
          <Row label="Street" value={`${personal.firstName && address.street}${address.apt ? `, ${address.apt}` : ""}`} />
          <Row label="City / State / ZIP" value={`${address.city}, ${address.state} ${address.zip}`} />
        </Section>

        <Section title="First Account" onEdit={() => onEdit(4)}>
          <p className="text-sm font-semibold text-brand-green">{ACCOUNT_NAMES[account] ?? account}</p>
        </Section>
      </div>

      <div className="mt-6 bg-brand-cream border border-border p-4 text-xs text-muted-foreground leading-relaxed">
        By submitting this application you agree to A+FCU's{" "}
        <a href="#" className="text-brand-green underline">Membership Agreement</a>,{" "}
        <a href="#" className="text-brand-green underline">Privacy Policy</a>, and consent to a soft credit inquiry which will not affect your credit score.
      </div>
    </div>
  );
}
