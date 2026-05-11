import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Clock, Phone, ExternalLink, Search, ChevronDown } from "lucide-react";
import { BRANCHES, type Branch } from "@/data/locations";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Find a Branch or ATM — A+ Federal Credit Union" },
      { name: "description", content: "Find A+FCU branches and ATMs across Central Texas. 20+ locations in Austin, Cedar Park, Georgetown, Round Rock, San Marcos, and more." },
    ],
  }),
  component: LocationsPage,
});

const FILTER_OPTIONS = ["All Branches", "Full-Service", "High School"] as const;
type FilterOption = (typeof FILTER_OPTIONS)[number];

function getBadge(type: Branch["type"]) {
  if (type === "high-school") return { label: "High School Branch", color: "bg-amber-100 text-amber-800" };
  return { label: "Full-Service", color: "bg-green-100 text-green-800" };
}

function BranchCard({ branch }: { branch: Branch }) {
  const badge = getBadge(branch.type);
  return (
    <div className="bg-white border border-border p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${badge.color}`}>
            {badge.label}
          </span>
          <h3 className="font-serif text-lg leading-snug">A+FCU — {branch.name} Branch</h3>
        </div>
        <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-1" />
      </div>

      <div className="space-y-1.5 text-sm text-ink/80">
        <p className="font-medium">{branch.address}</p>
        <p>{branch.city}, {branch.state} {branch.zip}</p>
      </div>

      <div className="space-y-1 text-sm text-ink/70">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
          <div>
            <p>{branch.hours.weekdays}</p>
            {branch.hours.saturday && <p>{branch.hours.saturday}</p>}
            {!branch.hours.saturday && <p className="text-muted-foreground">Closed Saturday</p>}
          </div>
        </div>
        {branch.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-green shrink-0" />
            <p>{branch.phone}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-1 mt-auto border-t border-border">
        <a
          href={branch.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:underline"
        >
          Get Directions <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function LocationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("All Branches");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = BRANCHES.filter((b) => {
    const matchesSearch =
      !search.trim() ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase()) ||
      b.zip.includes(search);

    const matchesFilter =
      filter === "All Branches" ||
      (filter === "Full-Service" && b.type === "full-service") ||
      (filter === "High School" && b.type === "high-school");

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <section className="bg-brand-yellow">
        <div className="container-x py-16 lg:py-24 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.18em] font-semibold text-ink/70">Locations</p>
          <h1 className="font-serif text-4xl md:text-6xl mt-3 leading-[1.05]">Find Your Branch.</h1>
          <p className="mt-5 text-lg text-ink/80">
            With 20+ branches across Central Texas — plus thousands of surcharge-free ATMs nationwide — A+FCU is always close by.
          </p>
        </div>
      </section>

      <section className="bg-brand-green py-10">
        <div className="container-x">
          <div className="grid sm:grid-cols-3 gap-5 text-center text-white">
            {[
              { label: "Branches", value: "22+", note: "Across Central Texas" },
              { label: "Surcharge-Free ATMs", value: "30,000+", note: "Nationwide via CO-OP Network" },
              { label: "Shared Branching", value: "5,000+", note: "Credit union locations nationwide" },
            ].map(({ label, value, note }) => (
              <div key={label} className="bg-white/10 px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1">{label}</p>
                <p className="font-serif text-3xl font-semibold">{value}</p>
                <p className="text-xs text-white/60 mt-1">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-x max-w-6xl">
          <div className="mb-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-1">Branch Locator</p>
              <h2 className="font-serif text-3xl">Find a Branch Near You</h2>
            </div>
            <a
              href="https://co-opcreditunions.org/locator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-5 py-2.5 font-semibold text-sm transition-colors"
            >
              Find an ATM <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by city, branch name, or ZIP code"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border text-sm focus:outline-none focus:border-brand-green"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilter((v) => !v)}
                className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-sm font-medium hover:border-brand-green transition-colors min-w-[160px] justify-between"
              >
                {filter} <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              {showFilter && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-border shadow-lg z-10 min-w-[160px]">
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setFilter(opt); setShowFilter(false); }}
                      className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-brand-cream transition-colors ${filter === opt ? "font-semibold text-brand-green" : "text-ink"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-lg">No branches found</p>
              <p className="text-sm mt-1">Try a different search term or filter.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-5">
                Showing <span className="font-semibold text-ink">{filtered.length}</span> {filtered.length === 1 ? "branch" : "branches"}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((branch) => (
                  <BranchCard key={branch.id} branch={branch} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="bg-brand-cream py-14">
        <div className="container-x max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">ATM Access</p>
              <h2 className="font-serif text-2xl md:text-3xl mb-3">30,000+ Surcharge-Free ATMs</h2>
              <p className="text-sm text-ink/80 leading-relaxed mb-4">
                As an A+FCU member, you have fee-free access to over 30,000 CO-OP Network ATMs across the country — at major retailers, credit unions, and convenient locations near you.
              </p>
              <a
                href="https://co-opcreditunions.org/locator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-5 py-2.5 font-semibold text-sm transition-colors"
              >
                Find a CO-OP ATM <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div>
              <p className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Shared Branching</p>
              <h2 className="font-serif text-2xl md:text-3xl mb-3">Bank at 5,000+ Credit Unions</h2>
              <p className="text-sm text-ink/80 leading-relaxed mb-4">
                Through the CO-OP Shared Branch network, A+FCU members can perform most transactions at over 5,000 participating credit union locations nationwide — just like banking at home.
              </p>
              <a
                href="https://co-opcreditunions.org/locator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border hover:border-brand-green text-ink px-5 py-2.5 font-semibold text-sm transition-colors"
              >
                Find Shared Branching <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-x max-w-4xl">
          <div className="border border-border p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div>
              <h3 className="font-serif text-xl mb-1">Have questions? We're here to help.</h3>
              <p className="text-sm text-muted-foreground">Call us 24/7 at <a href="tel:15123026800" className="text-brand-green font-semibold hover:underline">(512) 302-6800</a> or visit any branch during business hours.</p>
            </div>
            <a
              href="/join"
              className="shrink-0 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 font-semibold text-sm transition-colors"
            >
              Become a Member
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
