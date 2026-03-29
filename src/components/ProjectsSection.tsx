import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { PROJECTS_SECTION_SKELETON_COUNT } from "@/constants/projects-ui";
import { projectsFallback } from "@/data/projects.fallback";
import { usePortfolios } from "@/hooks/usePortfolios";
import { isContentfulConfigured } from "@/lib/contentful";
import type { PortfolioCard } from "@/lib/contentful-portfolio";

type ListSource = "cms" | "fallback" | "empty" | "loading";
type ProjectCard = PortfolioCard & { link?: string; color?: string };

const isLiveProjectLink = (url?: string) =>
  Boolean(url && (url.startsWith("http://") || url.startsWith("https://")));

const defaultGradient = "from-primary/20 to-accent/10";

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: cmsItems, isLoading, isError, isSuccess } = usePortfolios();

  const { projects, source } = useMemo((): { projects: ProjectCard[]; source: ListSource } => {
    if (!isContentfulConfigured()) {
      return { projects: projectsFallback, source: "fallback" };
    }
    if (isLoading) {
      return { projects: [], source: "loading" };
    }
    if (isError) {
      return { projects: projectsFallback, source: "fallback" };
    }
    if (isSuccess && cmsItems && cmsItems.length > 0) {
      return { projects: cmsItems, source: "cms" };
    }
    return { projects: [], source: "empty" };
  }, [cmsItems, isLoading, isError, isSuccess]);

  const showSkeleton = source === "loading";
  const skeletonKeys = useMemo(
    () => Array.from({ length: PROJECTS_SECTION_SKELETON_COUNT }, (_, i) => `project-skeleton-${i}`),
    [],
  );

  return (
    <section id="projects" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary font-mono text-sm tracking-wider uppercase">Projects</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-foreground">
            Featured <span className="gradient-text">Work</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {showSkeleton &&
            skeletonKeys.map((key) => (
              <div
                key={key}
                className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-muted/70" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-muted rounded w-2/3" />
                  <div className="h-12 bg-muted/70 rounded w-full" />
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-muted/60 rounded-md" />
                    <div className="h-6 w-16 bg-muted/60 rounded-md" />
                  </div>
                </div>
              </div>
            ))}

          {!showSkeleton && source === "empty" && (
            <p className="text-muted-foreground text-sm max-w-2xl md:col-span-2 lg:col-span-3">
              {import.meta.env.DEV ? (
                <>
                  No portfolio entries returned from Contentful. Confirm parent content type{" "}
                  <code className="font-mono text-xs">portfolios</code>, field{" "}
                  <code className="font-mono text-xs">name</code> is{" "}
                  <code className="font-mono text-xs">aichannode</code>, and referenced{" "}
                  <code className="font-mono text-xs">portfolio</code> items are published.
                </>
              ) : (
                <>Featured work will appear here once published in Contentful.</>
              )}
            </p>
          )}

          {!showSkeleton &&
            source !== "empty" &&
            projects.map((project, i) => {
              const live = isLiveProjectLink(project.link);
              const gradient = project.color ?? defaultGradient;
              const shellClass = `h-40 flex items-center justify-center relative overflow-hidden shrink-0 ${
                project.image ? "" : `bg-gradient-to-br ${gradient}`
              }`;
              const thumbnailInner = (
                <>
                  {project.image ? (
                    <>
                      <img
                        src={project.image}
                        alt=""
                        className={`absolute inset-0 w-full h-full object-cover ${
                          live ? "transition-transform duration-500 group-hover:scale-[1.03]" : ""
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent pointer-events-none" />
                    </>
                  ) : (
                    <div className="text-4xl font-bold text-primary/30 group-hover:text-primary/50 transition-colors font-mono">
                      {`0${i + 1}`}
                    </div>
                  )}
                </>
              );

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="group rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-500 overflow-hidden flex flex-col"
                >
                  {live ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${shellClass} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset`}
                      aria-label={`Open ${project.title}`}
                    >
                      {thumbnailInner}
                    </a>
                  ) : (
                    <div className={shellClass}>{thumbnailInner}</div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(project.skills ?? []).map((tag) => (
                        <span
                          key={`${project.id}-${tag}`}
                          className="px-2.5 py-1 rounded-md bg-secondary text-xs font-mono text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
