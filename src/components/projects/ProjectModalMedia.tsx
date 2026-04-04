import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import type { DisplayProject } from "@/components/projects/project-types";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { getProjectGalleryUrls } from "@/utils/project-gallery";

const MEDIA_HEIGHT = "h-[min(34rem,54vh)]";

type LazyModalImageProps = {
  src: string;
  /** Card / CMS thumbnail — shown blurred under the spinner while the full image loads (skip if same URL as `src`). */
  placeholderSrc?: string;
  /** When true, load immediately (first visible slide / single image). */
  priority?: boolean;
  className?: string;
};

function LazyModalImage({ src, placeholderSrc, priority = false, className }: LazyModalImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const showBlurredThumb = Boolean(placeholderSrc) && placeholderSrc !== src;

  useEffect(() => {
    setStatus("loading");
  }, [src]);

  return (
    <div className="relative h-full w-full min-h-0">
      {status === "loading" ? (
        <>
          {showBlurredThumb ? (
            <div className="absolute inset-0 z-[1] overflow-hidden" aria-hidden>
              <img
                src={placeholderSrc}
                alt=""
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="h-full w-full scale-[1.08] object-cover object-center blur-2xl saturate-[0.85] brightness-[0.92]"
              />
              <div className="absolute inset-0 bg-background/35" />
            </div>
          ) : (
            <div
              className="absolute inset-0 z-[1] animate-pulse bg-gradient-to-br from-muted/90 to-muted/50"
              aria-hidden
            />
          )}
          <div
            className="absolute inset-0 z-[2] flex items-center justify-center"
            role="status"
            aria-live="polite"
            aria-label="Loading image"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-background/92 text-primary shadow-lg backdrop-blur-md">
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
            </span>
          </div>
        </>
      ) : null}
      <img
        src={src}
        alt=""
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
        className={cn(
          "relative z-[3] block h-full w-full object-fill object-center transition-opacity duration-500",
          status === "loaded" ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
      {status === "error" ? (
        <div
          className="absolute inset-0 z-[4] flex items-center justify-center bg-muted/50 text-center text-xs text-muted-foreground"
          role="status"
        >
          Image unavailable
        </div>
      ) : null}
    </div>
  );
}

type ProjectModalMediaProps = {
  project: DisplayProject;
  gradientClass: string;
};

export function ProjectModalMedia({ project, gradientClass }: ProjectModalMediaProps) {
  const urls = useMemo(() => getProjectGalleryUrls(project), [project]);
  const thumbPlaceholder = project.image;

  if (urls.length === 0) {
    return (
      <div
        className={cn(
          MEDIA_HEIGHT,
          "w-full shrink-0 bg-gradient-to-br",
          gradientClass,
        )}
      />
    );
  }

  if (urls.length === 1) {
    return (
      <div
        className={cn(
          MEDIA_HEIGHT,
          "relative w-full shrink-0 overflow-hidden bg-muted/10",
        )}
      >
        <LazyModalImage src={urls[0]} placeholderSrc={thumbPlaceholder} priority />
      </div>
    );
  }

  return (
    <ModalImageCarousel urls={urls} projectId={project.id} placeholderSrc={thumbPlaceholder} />
  );
}

function ModalImageCarousel({
  urls,
  projectId,
  placeholderSrc,
}: {
  urls: string[];
  projectId: string;
  placeholderSrc?: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const sync = () => setCurrent(api.selectedScrollSnap());
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  return (
    <div className={cn(MEDIA_HEIGHT, "relative w-full shrink-0 bg-muted/10")}>
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="h-full w-full [&>div]:h-full">
        <CarouselContent className="-ml-0 h-full">
          {urls.map((src, idx) => (
            <CarouselItem key={`${projectId}-${idx}-${src}`} className="h-full basis-full pl-0">
              <LazyModalImage src={src} placeholderSrc={placeholderSrc} priority={idx === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2 border-border bg-background/95 text-foreground shadow-md hover:bg-background" />
        <CarouselNext className="right-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2 border-border bg-background/95 text-foreground shadow-md hover:bg-background" />
      </Carousel>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-background/70 via-background/25 to-transparent pb-3 pt-8">
        <div className="pointer-events-auto flex items-center gap-2" role="tablist" aria-label="Slide indicators">
          {urls.map((_, i) => (
            <button
              key={`${projectId}-dot-${i}`}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Show image ${i + 1} of ${urls.length}`}
              className={cn(
                "size-2.5 shrink-0 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background/80",
                i === current
                  ? "bg-primary shadow-sm ring-2 ring-primary/40 ring-offset-2 ring-offset-background/90"
                  : "bg-background/90 ring-1 ring-border/80 hover:bg-muted hover:ring-border",
              )}
              onClick={() => api?.scrollTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
