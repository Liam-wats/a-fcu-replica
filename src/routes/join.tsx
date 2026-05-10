import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { StepProgress } from "@/components/onboarding/StepProgress";
import { StepGoals } from "@/components/onboarding/StepGoals";
import { StepPersonal, type PersonalData } from "@/components/onboarding/StepPersonal";
import { StepAddress, type AddressData } from "@/components/onboarding/StepAddress";
import { StepAccount } from "@/components/onboarding/StepAccount";
import { StepReview } from "@/components/onboarding/StepReview";
import { StepConfirmation } from "@/components/onboarding/StepConfirmation";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join A+FCU — Become a Member" },
      { name: "description", content: "Open your A+ Federal Credit Union membership in minutes." },
    ],
  }),
  component: JoinPage,
});

const EMPTY_PERSONAL: PersonalData = {
  firstName: "", lastName: "", email: "", phone: "", dob: "", ssn: "",
};

const EMPTY_ADDRESS: AddressData = {
  street: "", apt: "", city: "", state: "", zip: "",
};

function validate<T extends object>(data: T, required: (keyof T)[]): Partial<Record<keyof T, string>> {
  const errs: Partial<Record<keyof T, string>> = {};
  for (const key of required) {
    if (!String(data[key]).trim()) errs[key] = "This field is required";
  }
  return errs;
}

function JoinPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [goals, setGoals] = useState<string[]>([]);
  const [personal, setPersonal] = useState<PersonalData>(EMPTY_PERSONAL);
  const [address, setAddress] = useState<AddressData>(EMPTY_ADDRESS);
  const [account, setAccount] = useState("");

  const [personalErrors, setPersonalErrors] = useState<Partial<Record<keyof PersonalData, string>>>({});
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof AddressData, string>>>({});

  const canAdvance = (): boolean => {
    if (step === 1) return goals.length > 0;
    if (step === 4) return !!account;
    return true;
  };

  const handleNext = () => {
    if (step === 2) {
      const errs = validate(personal, ["firstName", "lastName", "email", "phone", "dob", "ssn"]);
      setPersonalErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    if (step === 3) {
      const errs = validate(address, ["street", "city", "state", "zip"]);
      setAddressErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    if (step === 5) {
      setSubmitted(true);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const renderStep = () => {
    switch (step) {
      case 1: return <StepGoals selected={goals} onChange={setGoals} />;
      case 2: return <StepPersonal data={personal} onChange={setPersonal} errors={personalErrors} />;
      case 3: return <StepAddress data={address} onChange={setAddress} errors={addressErrors} />;
      case 4: return <StepAccount selected={account} onChange={setAccount} />;
      case 5: return (
        <StepReview
          goals={goals}
          personal={personal}
          address={address}
          account={account}
          onEdit={(s) => setStep(s)}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <header className="bg-white border-b border-border">
        <div className="container-x h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      {submitted ? (
        <main className="flex-1 container-x py-12 max-w-3xl">
          <StepConfirmation firstName={personal.firstName} account={account} />
        </main>
      ) : (
        <main className="flex-1 container-x py-10 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="lg:w-56 shrink-0">
              <div className="bg-white border border-border p-6 sticky top-6">
                <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-5">
                  Membership Application
                </p>
                <StepProgress current={step} />
                <div className="mt-6 pt-5 border-t border-border text-xs text-muted-foreground space-y-1.5">
                  <p>✓ No application fee</p>
                  <p>✓ Soft credit check only</p>
                  <p>✓ Takes ~5 minutes</p>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="bg-white border border-border p-6 md:p-10">
                {renderStep()}

                <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand-green transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      Step {step} of 5
                    </span>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!canAdvance()}
                      className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 font-semibold text-sm transition-colors"
                    >
                      {step === 5 ? "Submit Application" : "Continue"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      <footer className="border-t border-border bg-white py-4">
        <div className="container-x text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} A+ Federal Credit Union · Federally insured by NCUA · Equal Housing Lender
        </div>
      </footer>
    </div>
  );
}
