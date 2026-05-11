import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";

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

function ContactUsPage() {
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
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="border border-border px-4 py-3" placeholder="First name" required />
              <input className="border border-border px-4 py-3" placeholder="Last name" required />
            </div>
            <input type="email" className="w-full border border-border px-4 py-3" placeholder="Email" required />
            <input className="w-full border border-border px-4 py-3" placeholder="Subject" required />
            <textarea className="w-full border border-border px-4 py-3 min-h-32" placeholder="Message" required />
            <button type="submit" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 font-semibold transition-colors">
              Send Message <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="mt-8 text-sm">
            Looking for a branch?{" "}
            <Link to="/locations" className="text-brand-green underline font-semibold">Find a location near you</Link>
          </p>
        </div>
      </section>
    </>
  );
}
