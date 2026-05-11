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
    const ap = emblaApi?.plugins()?.autoplay;
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
            <div
              key={i}
              className={`relative shrink-0 grow-0 basis-full ${
                slide.bg === "yellow" ? "bg-brand-yellow" : "bg-white"
              }`}
            >
              <div className="container-x grid lg:grid-cols-2 items-center gap-8 py-14 lg:py-24 min-h-[520px] lg:min-h-[600px]">
                <div className="relative z-10 max-w-xl">
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink">
                    {slide.title}
                  </h1>
                  <p className="mt-5 text-lg text-ink/80 max-w-md">{slide.body}</p>
                  <a
                    href={slide.ctaHref}
                    className="mt-8 inline-flex items-center gap-3 bg-brand-green hover:bg-brand-green-dark text-white px-7 py-3.5 font-semibold transition-colors"
                  >
                    {slide.ctaLabel}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                <div className="relative">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-[280px] md:h-[380px] lg:h-[500px] object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>
              </div>
              {slide.bg === "yellow" && (
                <img
                  src={ANGLE_OVERLAY}
                  alt=""
                  aria-hidden="true"
                  className="hidden lg:block absolute inset-y-0 left-1/2 h-full pointer-events-none -translate-x-[55%]"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-4 bottom-4 lg:right-10 lg:bottom-10 z-20 flex items-center gap-2 bg-white/95 border border-border">
        <button onClick={() => emblaApi?.scrollPrev()} aria-label="Previous slide" className="p-3 hover:bg-secondary">
          <ChevronLeft className="w-4 h-4 text-brand-green" />
        </button>
        <span className="text-sm tabular-nums text-ink/70 px-1">{selected + 1}/{HERO_SLIDES.length}</span>
        <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="p-3 hover:bg-secondary">
          {playing ? <Pause className="w-4 h-4 text-brand-green" /> : <Play className="w-4 h-4 text-brand-green" />}
        </button>
        <button onClick={() => emblaApi?.scrollNext()} aria-label="Next slide" className="p-3 hover:bg-secondary">
          <ChevronRight className="w-4 h-4 text-brand-green" />
        </button>
      </div>
    </section>
  );
}