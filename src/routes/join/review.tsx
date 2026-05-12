import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Pencil, ShieldCheck } from "lucide-react";
import { useJoin } from "@/context/JoinContext";

export const Route = createFileRoute("/join/review")({
  head: () => ({ meta: [{ title: "Join A+FCU — Review Application" }] }),
  component: ReviewPage,
});

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

function Section({
  title,
  editPath,
  children,
}: {
  title: string;
  editPath: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <div className="border border-border">
      <div className="flex items-center justify-between px-5 py-3.5 bg-muted/30 border-b border-border">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
        <button
          type="button"
          onClick={() => navigate({ to: editPath as any })}
          className="inline-flex items-center gap-1.5 text-brand-green text-xs font-semibold hover:text-brand-green-dark transition-colors"
        >
          <Pencil className="w-3 h-3" /> Edit
        </button>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline text-sm py-2 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-ink text-right ml-4">{value || "—"}</span>
    </div>
  );
}

function ReviewPage() {
  const { goals, personal, address, account } = useJoin();
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate({ to: "/join/confirmation" });
  };

  return (
    <div>
      <div className="px-8 pt-10 pb-6 border-b border-border">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-green mb-1">Step 6 of 6</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">Review your application</h1>
        <p className="text-muted-foreground">Please confirm your information is accurate before submitting.</p>
      </div>

      <div className="px-8 py-8">
        <div className="flex flex-col gap-4">
          <Section title="Your Goals" editPath="/join/goals">
            <div className="flex flex-wrap gap-2">
              {goals.map((g) => (
                <span key={g} className="bg-brand-green/10 text-brand-green text-xs font-semibold px-3 py-1.5">
                  {GOAL_LABELS[g] ?? g}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Personal Information" editPath="/join/personal">
            <Row label="Full Name" value={`${personal.firstName} ${personal.lastName}`} />
            <Row label="Email Address" value={personal.email} />
            <Row label="Phone Number" value={personal.phone} />
            <Row label="Date of Birth" value={personal.dob} />
            <Row label="SSN (last 4)" value={personal.ssn ? `••• – •• – ••${personal.ssn}` : ""} />
          </Section>

          <Section title="Home Address" editPath="/join/address">
            <Row
              label="Street"
              value={`${address.street}${address.apt ? `, ${address.apt}` : ""}`}
            />
            <Row label="City / State / ZIP" value={`${address.city}, ${address.state} ${address.zip}`} />
          </Section>

          <Section title="First Account" editPath="/join/account">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-green" />
              <p className="text-sm font-semibold text-brand-green">{ACCOUNT_NAMES[account] ?? account}</p>
            </div>
          </Section>
        </div>

        <div className="mt-5 flex items-start gap-3 bg-muted/40 border border-border p-4">
          <ShieldCheck className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            By submitting this application you agree to A+FCU's{" "}
            <a href="#" className="text-brand-green underline underline-offset-2 hover:no-underline">
              Membership Agreement
            </a>{" "}
            and{" "}
            <a href="#" className="text-brand-green underline underline-offset-2 hover:no-underline">
              Privacy Policy
            </a>
            , and consent to a soft credit inquiry which will not affect your credit score.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => navigate({ to: "/join/credentials" })}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand-green transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Step 6 of 6</span>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-7 py-3 font-semibold text-sm transition-colors"
            >
              Submit Application <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
