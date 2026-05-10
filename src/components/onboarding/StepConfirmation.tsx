import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const ACCOUNT_NAMES: Record<string, string> = {
  "cash-back-checking": "Cash-Back Checking",
  "free-checking": "Free Checking",
  "regular-savings": "Regular Savings",
  "money-market": "Money Market",
};

interface Props {
  firstName: string;
  account: string;
}

export function StepConfirmation({ firstName, account }: Props) {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-brand-green" />
        </div>
      </div>
      <h2 className="font-serif text-3xl md:text-4xl mb-3">Welcome to A+FCU, {firstName}!</h2>
      <p className="text-muted-foreground text-lg mb-2">Your membership application has been submitted.</p>
      <p className="text-muted-foreground mb-10">
        We'll send a confirmation to your email shortly. Your{" "}
        <span className="font-semibold text-ink">{ACCOUNT_NAMES[account] ?? "account"}</span> will be ready within 1–2 business days.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
        {[
          { step: "1", title: "Check your email", desc: "Look for a welcome email with your next steps and temporary login credentials." },
          { step: "2", title: "Fund your account", desc: "Transfer $5 to activate your membership — the minimum required to open." },
          { step: "3", title: "Download the app", desc: "Get the A+ Mobile App to manage your account from anywhere." },
        ].map((item) => (
          <div key={item.step} className="border border-border p-4">
            <div className="w-7 h-7 bg-brand-green text-white rounded-full flex items-center justify-center text-sm font-bold mb-3">
              {item.step}
            </div>
            <p className="font-semibold text-sm mb-1">{item.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm transition-colors"
        >
          Go to Homepage <ArrowRight className="w-4 h-4" />
        </Link>
        <a
          href="#"
          className="inline-flex items-center justify-center gap-2 border border-border hover:border-brand-green text-ink px-6 py-3 font-semibold text-sm transition-colors"
        >
          Enroll in Online Banking
        </a>
      </div>
    </div>
  );
}
