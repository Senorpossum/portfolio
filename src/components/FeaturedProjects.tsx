"use client";

import { siteConfig, Project } from "@/config/site";
import { GithubIcon, ArrowUpRightIcon, TerminalIcon } from "@/components/Icons";
import SpotlightCard from "@/components/SpotlightCard";

interface FeaturedProjectsProps {
  onSelectProject?: (project: Project) => void;
}

export default function FeaturedProjects({ onSelectProject }: FeaturedProjectsProps) {
  return (
    <section id="projects" className="py-16 border-t border-slate-800/60">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-10 gap-2">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-2">
              Featured Work
            </h2>
            <p className="text-xl font-medium text-slate-100">
              Projects I&apos;ve Built
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Click any project to inspect its architecture
          </span>
        </div>

        {/* Project List */}
        <div className="space-y-8">
          {siteConfig.featuredProjects.map((project) => (
            <SpotlightCard
              key={project.id}
              className="p-6 cursor-pointer hover:border-slate-700/90 transition-colors group shadow-lg shadow-black/20"
              onClick={() => onSelectProject?.(project)}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white transition-colors flex items-center gap-2">
                    <span>{project.title}</span>
                    <span className="text-xs font-mono text-cyan-400/70 opacity-0 group-hover:opacity-100 transition-opacity">
                      [inspect]
                    </span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    {project.year}
                  </span>
                </div>

                <div
                  className="flex items-center gap-3 text-xs font-mono"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onSelectProject?.(project)}
                    className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <TerminalIcon className="w-3.5 h-3.5" />
                    <span>Architecture</span>
                  </button>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                    >
                      <span>Live Site</span>
                      <ArrowUpRightIcon className="w-3 h-3" />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <GithubIcon className="w-3 h-3" />
                      <span>Code</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Tagline */}
              <p className="text-xs font-mono text-slate-400 mb-5">
                {project.tagline}
              </p>

              {/* Technical Breakdown */}
              <div className="space-y-3 text-sm leading-relaxed mb-6">
                <div>
                  <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-1">
                    Why I Built It
                  </span>
                  <p className="text-slate-300">{project.problem}</p>
                </div>

                <div>
                  <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-1">
                    How It Works
                  </span>
                  <p className="text-slate-300">{project.solution}</p>
                </div>

                {project.metrics && (
                  <div className="pt-1">
                    <span className="font-mono text-xs text-emerald-400">
                      Key takeaway: {project.metrics}
                    </span>
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/60">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
