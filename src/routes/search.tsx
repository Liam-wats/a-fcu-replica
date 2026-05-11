import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Search, ArrowRight, X, FileText, Landmark, CreditCard, Briefcase, BookOpen, Wrench, Users, Info } from "lucide-react";
import { searchIndex, POPULAR_SEARCHES, CATEGORIES, type Category, type SearchResult } from "@/data/search-index";

const zodSearch = {
  q: { default: "" as string },
};

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: ({ search }) => ({
    meta: [
      { title: search?.q ? `Search: "${search.q}" — A+FCU` : "Search — A+ Federal Credit Union" },
    ],
  }),
  component: SearchPage,
});

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Accounts: <Landmark className="w-3.5 h-3.5" />,
  Loans: <CreditCard className="w-3.5 h-3.5" />,
  Services: <Wrench className="w-3.5 h-3.5" />,
  Business: <Briefcase className="w-3.5 h-3.5" />,
  Guidance: <BookOpen className="w-3.5 h-3.5" />,
  Articles: <FileText className="w-3.5 h-3.5" />,
  Workshops: <BookOpen className="w-3.5 h-3.5" />,
  Tools: <Wrench className="w-3.5 h-3.5" />,
  About: <Users className="w-3.5 h-3.5" />,
  "Quick Info": <Info className="w-3.5 h-3.5" />,
  Pages: <FileText className="w-3.5 h-3.5" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Accounts: "bg-blue-50 text-blue-700",
  Loans: "bg-emerald-50 text-emerald-700",
  Services: "bg-violet-50 text-violet-700",
  Business: "bg-amber-50 text-amber-800",
  Guidance: "bg-teal-50 text-teal-700",
  Articles: "bg-orange-50 text-orange-700",
  Workshops: "bg-pink-50 text-pink-700",
  Tools: "bg-indigo-50 text-indigo-700",
  About: "bg-slate-100 text-slate-700",
  "Quick Info": "bg-green-50 text-green-700",
  Pages: "bg-gray-100 text-gray-700",
};

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-brand-yellow/60 text-ink rounded-sm px-0.5">{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function ResultCard({ result, query }: { result: SearchResult; query: string }) {
  const badgeClass = CATEGORY_COLORS[result.category] ?? "bg-gray-100 text-gray-600";
  const icon = CATEGORY_ICONS[result.category];

  return (
    <Link
      to={result.href}
      className="group block bg-white border border-border hover:border-brand-green hover:shadow-sm transition-all p-5"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeClass}`}>
              {icon}
              {result.category}
            </span>
          </div>
          <h3 className="font-semibold text-[15px] text-ink group-hover:text-brand-green transition-colors leading-snug mb-1">
            {highlight(result.title, query)}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {highlight(result.description, query)}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-green shrink-0 mt-1 transition-colors" />
      </div>
    </Link>
  );
}

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });

  const [inputValue, setInputValue] = useState(q);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setInputValue(q);
  }, [q]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: { q: inputValue.trim() } });
    setActiveCategory("All");
  };

  const handleClear = () => {
    setInputValue("");
    navigate({ search: { q: "" } });
    inputRef.current?.focus();
  };

  const allResults = searchIndex(q);

  const filteredResults =
    activeCategory === "All"
      ? allResults
      : allResults.filter((r) => r.category === activeCategory);

  const categoryCounts = allResults.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});

  const availableCategories = CATEGORIES.filter(
    (c) => c === "All" || (categoryCounts[c] ?? 0) > 0
  );

  return (
    <>
      <section className="bg-brand-yellow">
        <div className="container-x py-12 lg:py-16 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.18em] font-semibold text-ink/70 mb-3">Search</p>
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/50 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search accounts, loans, rates, locations…"
              className="w-full pl-12 pr-24 py-4 text-base bg-white border-2 border-transparent focus:outline-none focus:border-brand-green text-ink placeholder:text-muted-foreground shadow-sm"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-[88px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-5 bg-brand-green hover:bg-brand-green-dark text-white font-semibold text-sm transition-colors"
            >
              Search
            </button>
          </form>

          {!q && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setInputValue(term);
                      navigate({ search: { q: term } });
                    }}
                    className="bg-white/80 hover:bg-white border border-border text-sm px-3 py-1.5 text-ink hover:text-brand-green transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-brand-cream min-h-[50vh] py-10">
        <div className="container-x max-w-5xl">
          {q ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <p className="text-sm text-muted-foreground">
                  {allResults.length === 0
                    ? <>No results for <strong className="text-ink">"{q}"</strong></>
                    : <><strong className="text-ink">{filteredResults.length}</strong> {filteredResults.length === 1 ? "result" : "results"} for <strong className="text-ink">"{q}"</strong></>}
                </p>
              </div>

              {allResults.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-7">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-sm px-4 py-1.5 font-medium border transition-colors ${
                        activeCategory === cat
                          ? "bg-brand-green text-white border-brand-green"
                          : "bg-white border-border text-ink hover:border-brand-green"
                      }`}
                    >
                      {cat}
                      {cat !== "All" && (
                        <span className="ml-1.5 text-xs opacity-70">
                          {categoryCounts[cat] ?? 0}
                        </span>
                      )}
                      {cat === "All" && (
                        <span className="ml-1.5 text-xs opacity-70">{allResults.length}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {filteredResults.length > 0 ? (
                <div className="space-y-3">
                  {filteredResults.map((result) => (
                    <ResultCard key={result.id} result={result} query={q} />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-border p-12 text-center">
                  <Search className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                  <p className="font-semibold text-lg mb-1">No results found</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Try a different search term or browse by category below.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setInputValue(term);
                          navigate({ search: { q: term } });
                          setActiveCategory("All");
                        }}
                        className="bg-brand-cream border border-border text-sm px-3 py-1.5 text-ink hover:text-brand-green hover:border-brand-green transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(
                [
                  { label: "Accounts", href: "/accounts", desc: "Checking, savings, certificates, youth" },
                  { label: "Loans", href: "/loans", desc: "Mortgage, auto, personal, student" },
                  { label: "Rates", href: "/guidance/rates", desc: "Current loan & deposit rates" },
                  { label: "Locations", href: "/locations", desc: "Find a branch or ATM near you" },
                  { label: "Services", href: "/services", desc: "Online banking, mobile app, bill pay" },
                  { label: "Business Banking", href: "/business", desc: "Accounts, lending, merchant services" },
                  { label: "Join A+FCU", href: "/join", desc: "Become a member in minutes" },
                  { label: "Financial Guidance", href: "/guidance", desc: "Workshops, tools, articles" },
                  { label: "Contact Us", href: "/contact-us", desc: "Phone, mail, chat, and more" },
                ] as const
              ).map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group bg-white border border-border hover:border-brand-green p-5 flex items-start justify-between gap-3 transition-all hover:shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-[15px] group-hover:text-brand-green transition-colors">{item.label}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-green shrink-0 mt-0.5 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
