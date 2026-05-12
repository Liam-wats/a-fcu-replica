import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, Mail, DollarSign, Smartphone } from "lucide-react";
import { useJoin } from "@/context/JoinContext";
import { useEffect } from "react";

export const Route = createFileRoute("/join/confirmation")({
  head: () => ({ meta: [{ title: "Join A+FCU — Welcome!" }] }),
  component: ConfirmationPage,
});

const ACCOUNT_NAMES: Record<string, string> = {
  "cash-back-checking": "Cash-Back Checking",
  "free-checking": "Free Checking",
  "regular-savings": "Regular Savings",
  "money-market": "Money Market",
};

const NEXT_STEPS = [
  {
    icon: Mail,
    step: "1",
    title: "Check your email",
    desc: "Look for a welcome email with your confirmation and temporary online banking credentials.",
  },
  {
    icon: DollarSign,
    step: "2",
    title: "Fund your account",
    desc: "Transfer a minimum of $5 to activate your membership and open your first account.",
  },
  {
    icon: Smartphone,
    step: "3",
    title: "Download the app",
    desc: "Get the A+ Mobile Banking app to manage your account, deposit checks, and more.",
  },
];

function ConfirmationPage() {
  const { personal, account, reset } = useJoin();

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="py-12 px-6 md:px-0">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-brand-green/10 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-brand-green" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
              <span className="text-ink text-xs font-bold">✓</span>
            </div>
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-3">
          Welcome to A+FCU{personal.firstName ? `, ${personal.firstName}` : ""}!
        </h1>
        <p className="text-muted-foreground text-lg mb-2">Your membership application has been submitted.</p>
        {account && (
          <p className="text-muted-foreground">
            Your{" "}
            <span className="font-semibold text-brand-green">{ACCOUNT_NAMES[account] ?? "account"}</span> will be
            ready within 1–2 business days.
          </p>
        )}
      </div>

      <div className="bg-white border border-border mb-8">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">What happens next</h2>
        </div>
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {NEXT_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-green text-white flex items-center justify-center shrink-0 font-bold text-sm">
                    {item.step}
                  </div>
                  <Icon className="w-5 h-5 text-brand-green" />
                </div>
                <p className="font-semibold text-sm text-ink">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-brand-cream border border-border p-6 mb-8 text-center">
        <p className="text-sm text-muted-foreground mb-1">Member application reference number</p>
        <p className="font-mono font-bold text-lg text-ink tracking-widest">
          APFCU-{Math.random().toString(36).substring(2, 8).toUpperCase()}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Keep this for your records. A copy was sent to {personal.email || "your email"}.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3.5 font-semibold text-sm transition-colors"
        >
          Go to Homepage <ArrowRight className="w-4 h-4" />
        </Link>
        <a
          href="#"
          className="inline-flex items-center justify-center gap-2 border-2 border-border hover:border-brand-green text-ink hover:text-brand-green px-8 py-3.5 font-semibold text-sm transition-colors"
        >
          Enroll in Online Banking
        </a>
      </div>
    </div>
  );
}
