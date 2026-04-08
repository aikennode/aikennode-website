import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { DisplayProject } from "@/components/projects/project-types";

export type { DisplayProject } from "@/components/projects/project-types";

function isLiveProjectLink(url?: string) {
  return Boolean(url && (url.startsWith("http://") || url.startsWith("https://")));
}

type ProjectCardProps = {
  project: DisplayProject;
  index: number;
  isInView: boolean;
  defaultGradient: string;
  onOpenDetails: (project: DisplayProject) => void;
};

export function ProjectCard({ project, index, isInView, defaultGradient, onOpenDetails }: ProjectCardProps) {
  const gradient = project.color ?? defaultGradient;
  const liveLink = isLiveProjectLink(project.link);
  const shellClass = `h-40 flex items-center justify-center relative overflow-hidden shrink-0 ${project.image ? "" : `bg-gradient-to-br ${gradient}`
    }`;

  const arrowClassName =
    "absolute right-1.5 top-1.5 z-10 flex h-9 w-9 items-center justify-center rounded-md border border-border/60 bg-background/90 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors duration-300 group-hover:border-primary/35 group-hover:text-primary";

  const body = (
    <div className="p-6 flex flex-col flex-1">
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {project.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed line-clamp-4">{project.description}</p>
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
  );

  const thumbnail = (
    <>
      {project.image ? (
        <>
          <img
            src={project.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent pointer-events-none" />
        </>
      ) : (
        <div className="text-4xl font-bold text-primary/30 group-hover:text-primary/50 transition-colors font-mono">
          {`0${index + 1}`}
        </div>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="group relative rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-500 overflow-hidden flex flex-col"
    >
      <button
        type="button"
        onClick={() => onOpenDetails(project)}
        className="flex flex-col flex-1 w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset rounded-2xl"
        aria-label={`View details: ${project.title}`}
      >
        <div className={`${shellClass} group/thumb`}>
          {thumbnail}
          {liveLink && project.link ? (
            <div className="absolute inset-0 z-20 translate-y-full bg-background/80 backdrop-blur-sm transition-transform duration-300 ease-out group-hover/thumb:translate-y-0 group-focus-within/thumb:translate-y-0">
              <div className="flex h-full w-full items-center justify-center">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/45 bg-background/95 px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
                  aria-label={`Open ${project.title} in a new tab`}
                >
                  Explore Project
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                </a>
              </div>
            </div>
          ) : null}
          {!liveLink ? (
            <span className={`${arrowClassName} pointer-events-none`} aria-hidden>
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
            </span>
          ) : null}
        </div>
        {body}
      </button>
    </motion.div>
  );
}
