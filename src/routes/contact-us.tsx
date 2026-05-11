import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MessageSquare, Hash, CalendarDays, ChevronDown, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us — A+ Federal Credit Union" },
      { name: "description", content: "Reach A+FCU by phone, mail, chat, or secure message. We're ready to help with your financial needs." },
    ],
  }),
  component: ContactPage,
});

const TOPICS = [
  { value: "", label: "Select Topic" },
  { value: "business-loans", label: "Business Loans" },
  { value: "consumer-loans", label: "Consumer Loans (Vehicle, RV/Boat/Motorcycle, Personal)" },
  { value: "debit-cards", label: "Debit Cards & ATMs" },
  { value: "insurance", label: "Insurance" },
  { value: "member-services", label: "Member Services" },
  { value: "mortgage-loans", label: "Mortgage Loans (Purchase, Refinance, Home Equity, HELOC, etc.)" },
  { value: "online-banking", label: "Online & Mobile Banking" },
];

const SUBTOPICS: Record<string, { value: string; label: string }[]> = {
  "business-loans": [
    { value: "", label: "Select Subtopic" },
    { value: "commercial", label: "Commercial/Investment Property Loans" },
    { value: "other-business", label: "Other Business Loans" },
    { value: "other", label: "Other Questions" },
  ],
  "consumer-loans": [
    { value: "", label: "Select Subtopic" },
    { value: "application", label: "Application Questions" },
    { value: "payment", label: "Set Up/Make A Payment" },
    { value: "difficulty", label: "Difficulty Making Payments" },
    { value: "title", label: "Title/Lien Questions" },
    { value: "other", label: "Other Questions" },
  ],
  "debit-cards": [
    { value: "", label: "Select Subtopic" },
    { value: "atm", label: "ATM Issues" },
    { value: "card-issues", label: "Issues With My Debit Card" },
    { value: "lost", label: "Lost A Debit Card" },
    { value: "other", label: "Other Questions" },
  ],
  "insurance": [
    { value: "", label: "Select Subtopic" },
    { value: "auto-insurance", label: "Auto Loan Insurance Requirements" },
    { value: "gap", label: "Guaranteed Asset Protection (GAP) Coverage" },
    { value: "mortgage-insurance", label: "Mortgage Loan Insurance Requirements" },
  ],
  "member-services": [
    { value: "", label: "Select Subtopic" },
    { value: "account", label: "Account Questions" },
    { value: "branch", label: "Branch Help" },
    { value: "checks", label: "Check Orders" },
    { value: "direct-deposit", label: "Direct Deposit/Payroll Deduction Questions" },
    { value: "join", label: "Looking To Join" },
    { value: "wire", label: "Wire Transfers" },
    { value: "other", label: "Other Questions" },
  ],
  "mortgage-loans": [
    { value: "", label: "Select Subtopic" },
    { value: "heloc", label: "Home Equity/HELOC Application Questions" },
    { value: "mortgage-insurance", label: "Mortgage Loan Insurance Requirements" },
    { value: "purchase", label: "Mortgage Purchase Application Questions" },
    { value: "refi", label: "Mortgage Refinance Applications Questions" },
    { value: "payment-setup", label: "Set Up/Make a Payment" },
    { value: "difficulty", label: "Difficulty Making Payments" },
    { value: "tax", label: "Tax/Escrow Questions" },
    { value: "other", label: "Other Questions" },
  ],
  "online-banking": [
    { value: "", label: "Select Subtopic" },
    { value: "bill-pay", label: "Bill Pay Questions/Issues" },
    { value: "access", label: "Trouble Accessing My Account" },
    { value: "enroll", label: "Trouble Enrolling In Online Banking" },
    { value: "other", label: "Other Questions" },
  ],
};

function JumpLinks() {
  const links = [
    { label: "Contact Info", href: "#contact-info" },
    { label: "Routing Number", href: "#routing-number" },
    { label: "Chat", href: "#chat" },
    { label: "Contact Form", href: "#contact-form" },
  ];
  return (
    <div className="bg-brand-cream border-b border-border">
      <div className="container-x max-w-5xl">
        <div className="flex flex-wrap gap-x-8 gap-y-2 py-3 text-sm">
          <span className="text-muted-foreground font-medium">Jump to:</span>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-brand-green font-semibold hover:underline">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border p-7">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
          {icon}
        </div>
        <h2 className="font-serif text-xl">{title}</h2>
      </div>
      <div className="text-sm text-ink/80 space-y-4 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function PhoneRow({ label, number, note }: { label: string; number: string; note?: string }) {
  return (
    <div>
      <p className="font-semibold text-ink text-[13px]">{label}</p>
      <a href={`tel:${number.replace(/\D/g, "")}`} className="text-brand-green font-bold hover:underline">
        {number}
      </a>
      {note && <p className="text-xs text-muted-foreground mt-0.5">{note}</p>}
    </div>
  );
}

function ContactForm() {
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtopicOptions = topic ? SUBTOPICS[topic] ?? [] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email.trim()) errs.email = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!topic) errs.topic = "Required";
    if (subtopicOptions.length > 1 && !subtopic) errs.subtopic = "Required";
    if (!form.message.trim()) errs.message = "Required";
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white border border-border p-10 text-center">
        <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto mb-4" />
        <h3 className="font-serif text-2xl mb-2">Message Sent!</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Thank you for contacting A+FCU. A team member will respond within 1–2 business days. For urgent matters, please call us at{" "}
          <a href="tel:15123026800" className="text-brand-green font-semibold hover:underline">512.302.6800</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white border border-border p-7 space-y-5">
      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded">
        Please <strong>do not include private account information</strong> in this form. For account-specific matters, log in to send a secure message.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5">First Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className={`w-full border px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green ${errors.firstName ? "border-red-400" : "border-border"}`}
          />
          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Last Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className={`w-full border px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green ${errors.lastName ? "border-red-400" : "border-border"}`}
          />
          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full border px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green ${errors.email ? "border-red-400" : "border-border"}`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Phone Number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`w-full border px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green ${errors.phone ? "border-red-400" : "border-border"}`}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5">Topic <span className="text-red-500">*</span></label>
        <div className="relative">
          <select
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setSubtopic(""); }}
            className={`w-full appearance-none border px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green bg-white pr-9 ${errors.topic ? "border-red-400" : "border-border"}`}
          >
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value} disabled={t.value === ""}>{t.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
        {errors.topic && <p className="text-xs text-red-500 mt-1">{errors.topic}</p>}
      </div>

      {subtopicOptions.length > 1 && (
        <div>
          <label className="block text-sm font-semibold mb-1.5">Subtopic <span className="text-red-500">*</span></label>
          {topic === "debit-cards" && (
            <p className="text-xs text-muted-foreground mb-2">
              To dispute a debit card transaction, call the A+ Debit Card Dispute Team 24/7/365 at <a href="tel:18003354583" className="text-brand-green font-semibold hover:underline">800.335.4583</a> → select your preferred language → press '4'.
            </p>
          )}
          <div className="relative">
            <select
              value={subtopic}
              onChange={(e) => setSubtopic(e.target.value)}
              className={`w-full appearance-none border px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green bg-white pr-9 ${errors.subtopic ? "border-red-400" : "border-border"}`}
            >
              {subtopicOptions.map((s) => (
                <option key={s.value} value={s.value} disabled={s.value === ""}>{s.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          {errors.subtopic && <p className="text-xs text-red-500 mt-1">{errors.subtopic}</p>}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1.5">
          Without including any private account information, how can we help? <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`w-full border px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green resize-none ${errors.message ? "border-red-400" : "border-border"}`}
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        className="bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 font-semibold text-sm transition-colors"
      >
        Submit
      </button>
    </form>
  );
}

function ContactPage() {
  return (
    <>
      <section className="bg-brand-yellow">
        <div className="container-x py-16 lg:py-24 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.18em] font-semibold text-ink/70">Who We Are</p>
          <h1 className="font-serif text-4xl md:text-6xl mt-3 leading-[1.05]">Contact Us</h1>
          <p className="mt-5 text-lg text-ink/80">
            Whenever you need help with your financial needs, plans, goals, or hopes and dreams, we're ready to help — with plenty of ways to get in touch.
          </p>
        </div>
      </section>

      <JumpLinks />

      <section id="contact-info" className="bg-white py-16 scroll-mt-28">
        <div className="container-x max-w-5xl">
          <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Contact Info</p>
          <h2 className="font-serif text-3xl mb-10">We're Here to Help</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <ContactCard icon={<Phone className="w-5 h-5" />} title="Phone">
              <div className="space-y-1 pb-3 border-b border-border">
                <p className="font-bold text-ink">Contact Center</p>
                <p className="text-xs text-muted-foreground">Monday – Friday: 8:30 AM – 6:00 PM</p>
                <p className="text-xs text-muted-foreground">Saturday: 9:00 AM – 1:00 PM</p>
                <div className="flex gap-4 mt-2">
                  <a href="tel:15123026800" className="text-brand-green font-bold hover:underline">512.302.6800</a>
                  <a href="tel:18002528148" className="text-brand-green font-bold hover:underline">800.252.8148</a>
                </div>
              </div>

              <PhoneRow
                label="AUDI — Automated Teller (24/7)"
                number="512.302.6800"
                note="Available around the clock, 7 days a week"
              />

              <div className="pb-3 border-b border-border space-y-3">
                <p className="font-bold text-ink text-[13px]">Cards — Activate, Report Lost or Stolen</p>
                <PhoneRow label="Debit Card" number="800.335.4583" />
                <PhoneRow label="Consumer Credit Card" number="800.558.3424" />
                <PhoneRow label="Business Credit Card" number="866.552.8855" />
              </div>

              <PhoneRow
                label="Dispute A Transaction (24/7/365)"
                number="800.335.4583"
                note="Select your preferred language → press '4'"
              />

              <PhoneRow
                label="Opt Out of Credit Card Offers"
                number="888.567.8688"
              />
            </ContactCard>

            <div className="flex flex-col gap-6">
              <ContactCard icon={<Mail className="w-5 h-5" />} title="Mail">
                <div>
                  <p className="font-semibold text-ink text-[13px] mb-1">General Mail</p>
                  <address className="not-italic text-ink/80">
                    A+ Federal Credit Union<br />
                    P.O. Box 14867<br />
                    Austin, TX 78761
                  </address>
                </div>
                <div>
                  <p className="font-semibold text-ink text-[13px] mb-1">Supervisory Committee</p>
                  <p className="text-xs text-muted-foreground mb-1">For questions about credit union policies and procedures</p>
                  <address className="not-italic text-ink/80">
                    Supervisory Committee<br />
                    P.O. Box 15102<br />
                    Austin, TX 78761
                  </address>
                </div>
                <div>
                  <p className="font-semibold text-ink text-[13px] mb-1">Administration</p>
                  <p className="text-xs text-muted-foreground">For comments, suggestions, praise, or concerns about service, staff, procedures, or policies, email:</p>
                  <a href="mailto:administration@aplusfcu.org" className="text-brand-green font-semibold hover:underline break-all">
                    administration@aplusfcu.org
                  </a>
                </div>
              </ContactCard>

              <ContactCard id="chat" icon={<MessageSquare className="w-5 h-5" />} title="Chat">
                <div>
                  <p className="font-semibold text-ink text-[13px] mb-1">A.P.R.I.L. — Virtual Chatbot (24/7)</p>
                  <p>
                    Get help any time from our virtual assistant A.P.R.I.L. She can answer frequently asked questions, help you find information, and tell you about our products and services.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-ink text-[13px] mb-1">Live Chat with A+ Team Members</p>
                  <p>
                    Available during business hours. Start a chat with A.P.R.I.L. and select <em>A+ Team Member</em> or type <em>representative</em> to connect with a live agent.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Click the <strong>Help?</strong> chat bubble in the bottom corner to get started.</p>
              </ContactCard>
            </div>
          </div>
        </div>
      </section>

      <section id="routing-number" className="bg-brand-cream py-14 scroll-mt-28">
        <div className="container-x max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-green flex items-center justify-center shrink-0">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-0.5">Routing Number</p>
                <p className="font-serif text-3xl font-semibold tracking-wider">314977104</p>
              </div>
            </div>
            <div className="md:border-l md:border-border md:pl-8 text-sm text-ink/80 max-w-xl">
              <p>
                Use this routing number for direct deposit, payroll deduction, wire transfers, and other bank-to-bank transactions. Not sure where to find your account number? Log in to A+ Online Banking or call us at{" "}
                <a href="tel:15123026800" className="text-brand-green font-semibold hover:underline">512.302.6800</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact-form" className="bg-white py-16 scroll-mt-28">
        <div className="container-x max-w-5xl">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Contact Form</p>
              <h2 className="font-serif text-3xl mb-2">How Can We Help You?</h2>
              <p className="text-sm text-muted-foreground mb-7">
                For more immediate assistance or to chat with a team member during business hours, we recommend using A.P.R.I.L., our virtual assistant.
              </p>
              <ContactForm />
            </div>

            <div className="space-y-6">
              <div className="bg-brand-cream border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CalendarDays className="w-5 h-5 text-brand-green shrink-0" />
                  <h3 className="font-serif text-lg">Make an Appointment</h3>
                </div>
                <p className="text-sm text-ink/80 mb-4">
                  Need to talk finances one-on-one? Schedule a time to visit us at one of our branch locations.
                </p>
                <a
                  href="/locations"
                  className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-5 py-2.5 font-semibold text-sm transition-colors w-full justify-center"
                >
                  Find a Branch
                </a>
              </div>

              <div className="bg-white border border-border p-6">
                <h3 className="font-semibold text-[15px] mb-3">Secure Messages</h3>
                <p className="text-sm text-ink/80 mb-4">
                  Already a member? Send us a secure message after logging in through A+ Online Banking or the A+ Mobile App.
                </p>
                <a
                  href="#login"
                  className="inline-flex items-center gap-2 border border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-5 py-2.5 font-semibold text-sm transition-colors w-full justify-center"
                >
                  Log In to Send Message
                </a>
              </div>

              <div className="bg-white border border-border p-6 text-sm text-ink/80">
                <p className="font-semibold text-ink mb-2">Media Inquiries</p>
                <p>
                  For press and media inquiries, please email{" "}
                  <a href="mailto:media@aplusfcu.org" className="text-brand-green font-semibold hover:underline">
                    media@aplusfcu.org
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
