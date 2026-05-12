import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { HERO_SLIDES, ANGLE_OVERLAY } from "@/data/site";

export function HeroCarousel() {
  const autoplay = Autoplay({ delay: 6000, stopOnInteraction: false });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;
    const onSel = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSel);
    onSel();
  }, [emblaApi]);

  const togglePlay = useCallback(() => {
    const ap = emblaApi?.plugins()?.autoplay as ReturnType<typeof Autoplay> | undefined;
    if (!ap) return;
    if (playing) ap.stop();
    else ap.play();
    setPlaying((p) => !p);
  }, [emblaApi, playing]);

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {HERO_SLIDES.map((slide, i) => (
            <div key={i} className="relative shrink-0 grow-0 basis-full bg-white">
              <div className="grid lg:grid-cols-[1fr_1.1fr] min-h-[420px] lg:min-h-[500px]">

                {/* Left — text content */}
                <div className="relative z-10 flex items-center px-8 lg:px-12 xl:px-16 py-12 lg:py-16 bg-white">
                  <div className="max-w-md">
                    {slide.eyebrow && (
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3">
                        {slide.eyebrow}
                      </p>
                    )}
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05] text-ink">
                      {slide.title}
                    </h1>
                    <p className="mt-4 text-base text-ink/75 max-w-sm italic">{slide.body}</p>
                    <a
                      href={slide.ctaHref}
                      className="mt-8 inline-flex items-center gap-3 bg-brand-green hover:bg-brand-green-dark text-white px-7 py-3.5 font-semibold transition-colors"
                    >
                      {slide.ctaLabel}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Right — yellow panel with embedded image */}
                <div className="relative bg-brand-yellow overflow-hidden flex flex-col">
                  {/* Diagonal white wedge on left edge */}
                  <img
                    src={ANGLE_OVERLAY}
                    alt=""
                    aria-hidden="true"
                    className="hidden lg:block absolute inset-y-0 -left-px h-full pointer-events-none z-10"
                  />

                  {/* Image embedded inside yellow — constrained height so yellow frames the bottom */}
                  <div className="relative z-0 flex-1 flex items-start">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full object-cover object-top"
                      style={{ height: "calc(100% - 3rem)" }}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>

                  {/* Yellow footer strip visible below image */}
                  <div className="h-12 bg-brand-yellow shrink-0" />
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-4 bottom-4 lg:right-10 lg:bottom-4 z-20 flex items-center gap-1.5">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous slide"
          className="bg-white border-2 border-brand-green p-2.5 hover:bg-brand-green/5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-brand-green" />
        </button>
        <div className="bg-white border-2 border-brand-green w-11 h-11 flex items-center justify-center text-sm tabular-nums text-ink font-semibold">
          {selected + 1}/{HERO_SLIDES.length}
        </div>
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="bg-white border-2 border-brand-green p-2.5 hover:bg-brand-green/5 transition-colors"
        >
          {playing ? <Pause className="w-4 h-4 text-brand-green" /> : <Play className="w-4 h-4 text-brand-green" />}
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Next slide"
          className="bg-white border-2 border-brand-green p-2.5 hover:bg-brand-green/5 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-brand-green" />
        </button>
      </div>
    </section>
  );
}
