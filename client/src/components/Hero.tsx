import { useEffect } from "react";
import { OptimizedImage } from "./OptimizedImage";

interface HeroProps {
  title: string;
  subtitle?: React.ReactNode;
  fullHeight?: boolean;
  imageSrc: string;
  imageAlt?: string;
  children?: React.ReactNode;
}

export function Hero({ title, subtitle, fullHeight = true, imageSrc, imageAlt = "Amsterdam canal scene", children }: HeroProps) {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = imageSrc;
    link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, [imageSrc]);

  return (
    <section className={`relative ${fullHeight ? 'h-screen' : 'h-[60vh]'} -mt-24 px-6`}>
      {/* Background image with priority loading */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full"
          priority={true}
          sizes="100vw"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full pt-16 md:pt-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1
            data-testid="text-hero-title"
            className="text-4xl sm:text-5xl md:text-5xl font-light text-white leading-snug mb-5 md:mb-8 md:whitespace-nowrap"
          >
            {title}
          </h1>
          {subtitle && (
            <p
              data-testid="text-hero-subtitle"
              className="text-xl md:text-xl lg:text-2xl text-white max-w-2xl mx-auto font-normal tracking-wide mb-8"
            >
              {subtitle}
            </p>
          )}
          {children && (
            <div className="flex justify-center gap-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
