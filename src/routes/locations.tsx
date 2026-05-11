import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { SplitHero } from "@/components/site/SplitHero";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations & ATMs — A+ Federal Credit Union" },
      { name: "description", content: "Find A+FCU branches and ATMs across Central Texas, plus 30,000+ surcharge-free CO-OP ATMs nationwide." },
      { property: "og:title", content: "Locations & ATMs — A+ Federal Credit Union" },
      { property: "og:description", content: "Find branches and ATMs across Central Texas." },
    ],
  }),
  component: LocationsPage,
});

const BRANCHES = [
  { name: "North Austin", address: "12700 Research Blvd, Austin, TX", phone: "512.302.6800" },
  { name: "South Austin", address: "4611 S Lamar Blvd, Austin, TX", phone: "512.302.6800" },
  { name: "Round Rock", address: "201 University Blvd, Round Rock, TX", phone: "512.302.6800" },
  { name: "Cedar Park", address: "1335 E Whitestone Blvd, Cedar Park, TX", phone: "512.302.6800" },
  { name: "Pflugerville", address: "1817 FM 685, Pflugerville, TX", phone: "512.302.6800" },
  { name: "San Marcos", address: "1340 Wonder World Dr, San Marcos, TX", phone: "512.302.6800" },
];

function LocationsPage() {
  return (
    <>
      <SplitHero
        eyebrow="Locations & ATMs"
        title="Banking Where You Are."
        body="Visit one of our 27 Central Texas branches or use 30,000+ surcharge-free CO-OP ATMs nationwide."
      />

      <section className="bg-white py-16">
        <div className="container-x">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl">Branch locations</h2>
            <Link to="/contact-us" className="text-brand-green font-semibold underline underline-offset-4">Contact us</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BRANCHES.map((b) => (
              <div key={b.name} className="border border-border p-6 hover:border-brand-green hover:shadow-md transition-all">
                <h3 className="font-serif text-xl mb-3">{b.name}</h3>
                <p className="text-sm text-muted-foreground inline-flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-brand-green shrink-0" /> {b.address}
                </p>
                <p className="text-sm text-muted-foreground inline-flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-brand-green" /> {b.phone}
                </p>
                <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-green" /> Mon–Fri 9am–6pm
                </p>
                <a href="#" className="mt-4 inline-flex items-center gap-1 text-brand-green text-sm font-semibold underline-offset-4 hover:underline">
                  Get directions <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
