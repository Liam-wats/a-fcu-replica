import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AWARDS } from "@/data/site";

const PER_PAGE = 6;

export function AwardsGrid() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(AWARDS.length / PER_PAGE);
  const visible = AWARDS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="bg-brand-green pt-16 pb-20 relative">
      <div className="container-x">
        <h2 className="font-serif text-3xl md:text-5xl text-center text-white max-w-3xl mx-auto leading-tight">
          When you work hard for your members, people notice.
        </h2>
      </div>
      <div className="container-x mt-10">
        <div className="bg-white px-6 py-8 md:px-10 md:py-10">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center">
            {visible.map((src, i) => (
              <div key={i} className="flex items-center justify-center">
                <img src={src} alt={`Award ${page * PER_PAGE + i + 1}`} className="max-h-28 w-auto object-contain" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="container-x flex items-center justify-center gap-3 py-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous awards"
            className="w-10 h-10 inline-flex items-center justify-center bg-brand-green text-white disabled:opacity-40 hover:bg-brand-green-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            aria-label="Next awards"
            className="w-10 h-10 inline-flex items-center justify-center border border-border text-ink/70 disabled:opacity-40 hover:bg-secondary transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
