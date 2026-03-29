import { useState, useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function LazyImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px", threshold: 0 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}

interface PhotoCarouselProps {
  images: { src: string; alt: string }[];
}

export function PhotoCarousel({ images }: PhotoCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: true });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const scrollNext = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        scrollNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext]);

  return (
    <div className="w-full">
      {/* Main Carousel */}
      <div className="relative mb-6">
        <div className="overflow-hidden rounded-lg shadow-lg" ref={emblaMainRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0"
                data-testid={`carousel-image-${index}`}
              >
                <LazyImage
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-[350px] md:h-[400px] lg:h-[450px] xl:h-[550px]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Desktop Only */}
        <Button
          variant="outline"
          size="icon"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-2"
          onClick={scrollPrev}
          data-testid="carousel-prev"
          aria-label="Vorige foto"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-2"
          onClick={scrollNext}
          data-testid="carousel-next"
          aria-label="Volgende foto"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium shadow-md">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="overflow-hidden px-2" ref={emblaThumbsRef}>
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onThumbClick(index)}
              className={`flex-[0_0_auto] w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-md overflow-hidden transition-all shadow-sm ${
                index === selectedIndex
                  ? "ring-4 ring-primary opacity-100 scale-105"
                  : "opacity-60 hover:opacity-90 hover:scale-105"
              }`}
              data-testid={`carousel-thumb-${index}`}
            >
              <img
                src={image.src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
