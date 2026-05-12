import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";
import { useState } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_qkfr2cn";
const EMAILJS_TEMPLATE_ID = "template_wvtlxvb";
const EMAILJS_PUBLIC_KEY = "Q46p2-WKKDd4yU00l";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us — A+ Federal Credit Union" },
      { name: "description", content: "Reach A+FCU by phone, message, or in person. We're here to help with accounts, loans, and member services." },
      { property: "og:title", content: "Contact Us — A+ Federal Credit Union" },
      { property: "og:description", content: "Reach A+FCU by phone, message, or in person." },
    ],
  }),
  component: ContactUsPage,
});

const CHANNELS = [
  { icon: Phone, title: "Call Us", lines: ["512.302.6800", "Toll-Free 800.252.8148"] },
  { icon: Mail, title: "Message Us", lines: ["Send a secure message", "from Online Banking"] },
  { icon: MapPin, title: "Visit Us", lines: ["27 branches across", "Central Texas"] },
  { icon: Clock, title: "Hours", lines: ["Mon–Fri 9am–6pm", "Sat 9am–1pm"] },
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface FieldError {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
}

function validateForm(form: FormState): FieldError {
  const errors: FieldError = {};
  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!form.message.trim()) errors.message = "Message is required.";
  else if (form.message.trim().length < 10) errors.message = "Message must be at least 10 characters.";
  return errors;
}

function ContactUsPage() {
  const [form, setForm] = useState<FormState>({
    firstName: "", lastName: "", email: "", subject: "", message: "",
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field as keyof FieldError]) {
      setErrors((err) => ({ ...err, [field]: undefined }));
    }
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const fieldErrors = validateForm(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          reply_to: form.email,
          subject: form.subject || "(No subject)",
          message: form.message,
          time: new Date().toLocaleString("en-US", {
            weekday: "long", year: "numeric", month: "long",
            day: "numeric", hour: "2-digit", minute: "2-digit",
            timeZoneName: "short",
          }),
        },
        EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
      setForm({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    } catch {
      setServerError("Unable to send your message. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SplitHero
        eyebrow="Contact Us"
        title="We're Here To Help."
        body="Reach our member services team by phone, secure message, or visit one of our Central Texas branches."
      />

      <section className="bg-white py-16">
        <div className="container-x">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CHANNELS.map((c) => (
              <div key={c.title} className="border border-border p-6 hover:border-brand-green hover:shadow-md transition-all">
                <c.icon className="w-8 h-8 text-brand-green mb-3" />
                <h3 className="font-serif text-xl mb-2">{c.title}</h3>
                {c.lines.map((l) => (
                  <p key={l} className="text-sm text-muted-foreground">{l}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="container-x max-w-2xl">
          <h2 className="font-serif text-3xl mb-2">Send us a message</h2>
          <p className="text-muted-foreground mb-8">For account-specific questions, please log in and use secure messaging instead.</p>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 px-6 py-8 flex flex-col items-center text-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              <h3 className="font-serif text-xl text-emerald-900">Message Sent!</h3>
              <p className="text-sm text-emerald-700 max-w-md leading-relaxed">
                Thank you for reaching out. We've received your message and will get back to you within one business day.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-sm font-semibold text-brand-green hover:underline underline-offset-4"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>

              {serverError && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-[13px] px-4 py-3 flex items-start gap-2 leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {serverError}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input
                    className={`w-full border px-4 py-3 text-sm outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 ${errors.firstName ? "border-red-400 bg-red-50" : "border-border bg-white"}`}
                    placeholder="First name *"
                    value={form.firstName}
                    onChange={set("firstName")}
                    autoComplete="given-name"
                  />
                  {errors.firstName && <p className="text-red-600 text-[11px] mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <input
                    className={`w-full border px-4 py-3 text-sm outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 ${errors.lastName ? "border-red-400 bg-red-50" : "border-border bg-white"}`}
                    placeholder="Last name *"
                    value={form.lastName}
                    onChange={set("lastName")}
                    autoComplete="family-name"
                  />
                  {errors.lastName && <p className="text-red-600 text-[11px] mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <input
                  type="email"
                  className={`w-full border px-4 py-3 text-sm outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 ${errors.email ? "border-red-400 bg-red-50" : "border-border bg-white"}`}
                  placeholder="Email address *"
                  value={form.email}
                  onChange={set("email")}
                  autoComplete="email"
                />
                {errors.email && <p className="text-red-600 text-[11px] mt-1">{errors.email}</p>}
              </div>

              <input
                className="w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                placeholder="Subject (optional)"
                value={form.subject}
                onChange={set("subject")}
              />

              <div>
                <textarea
                  className={`w-full border px-4 py-3 text-sm min-h-32 resize-y outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 ${errors.message ? "border-red-400 bg-red-50" : "border-border bg-white"}`}
                  placeholder="Your message *"
                  value={form.message}
                  onChange={set("message")}
                />
                {errors.message && <p className="text-red-600 text-[11px] mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark disabled:opacity-60 text-white px-8 py-3 font-semibold transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

          <p className="mt-8 text-sm">
            Looking for a branch?{" "}
            <Link to="/locations" className="text-brand-green underline font-semibold">Find a location near you</Link>
          </p>
        </div>
      </section>
    </>
  );
}
