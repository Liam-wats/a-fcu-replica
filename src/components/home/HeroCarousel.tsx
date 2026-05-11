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
              className="relative shrink-0 grow-0 basis-full bg-white"
            >
              <div className="grid lg:grid-cols-2 items-stretch min-h-[460px] lg:min-h-[560px]">
                <div className="relative z-10 flex items-center px-6 lg:px-10 py-12 lg:py-20">
                  <div className="max-w-xl">
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink">
                      {slide.title}
                    </h1>
                    <p className="mt-5 text-lg text-ink/80 max-w-md italic">{slide.body}</p>
                    <a
                      href={slide.ctaHref}
                      className="mt-8 inline-flex items-center gap-3 bg-brand-green hover:bg-brand-green-dark text-white px-7 py-3.5 font-semibold transition-colors"
                    >
                      {slide.ctaLabel}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="relative bg-brand-yellow">
                  <img
                    src={ANGLE_OVERLAY}
                    alt=""
                    aria-hidden="true"
                    className="hidden lg:block absolute inset-y-0 -left-px h-full pointer-events-none"
                  />
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="relative w-full h-[280px] md:h-[380px] lg:h-full object-contain"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-4 bottom-4 lg:right-10 lg:bottom-10 z-20 flex items-center gap-2">
        <button onClick={() => emblaApi?.scrollPrev()} aria-label="Previous slide" className="bg-white border-2 border-brand-green p-2.5 hover:bg-brand-green/5 transition-colors">
          <ChevronLeft className="w-4 h-4 text-brand-green" />
        </button>
        <div className="bg-white border-2 border-brand-green w-11 h-11 flex items-center justify-center text-sm tabular-nums text-ink font-semibold">
          {selected + 1}/{HERO_SLIDES.length}
        </div>
        <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="bg-white border-2 border-brand-green p-2.5 hover:bg-brand-green/5 transition-colors">
          {playing ? <Pause className="w-4 h-4 text-brand-green" /> : <Play className="w-4 h-4 text-brand-green" />}
        </button>
        <button onClick={() => emblaApi?.scrollNext()} aria-label="Next slide" className="bg-white border-2 border-brand-green p-2.5 hover:bg-brand-green/5 transition-colors">
          <ChevronRight className="w-4 h-4 text-brand-green" />
        </button>
      </div>
    </section>
  );
}