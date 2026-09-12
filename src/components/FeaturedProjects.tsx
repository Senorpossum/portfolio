"use client";

import { siteConfig } from "@/config/site";
import { GithubIcon, ArrowUpRightIcon } from "@/components/Icons";

export default function FeaturedProjects() {
  return (
    <section id="projects" className="py-16 border-t border-zinc-800/60">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Title */}
        <div className="mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold mb-2">
            Case Studies
          </h2>
          <p className="text-xl font-medium text-zinc-100">
            Selected Technical Projects
          </p>
        </div>

        {/* Project List */}
        <div className="space-y-12">
          {siteConfig.featuredProjects.map((project) => (
            <article
              key={project.id}
              className="p-6 rounded-lg bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {project.title}
                  </h3>
                  <span className="text-xs font-mono text-zinc-500">
                    {project.year}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
                    >
                      <span>Live Deployment</span>
                      <ArrowUpRightIcon className="w-3 h-3" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <GithubIcon className="w-3 h-3" />
                      <span>Source</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Tagline */}
              <p className="text-xs font-mono text-zinc-400 mb-5">
                {project.tagline}
              </p>

              {/* Technical Breakdown */}
              <div className="space-y-3 text-sm leading-relaxed mb-6">
                <div>
                  <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider block mb-1">
                    Problem & Context
                  </span>
                  <p className="text-zinc-300">{project.problem}</p>
                </div>

                <div>
                  <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider block mb-1">
                    Architecture & Implementation
                  </span>
                  <p className="text-zinc-300">{project.solution}</p>
                </div>

                {project.metrics && (
                  <div className="pt-1">
                    <span className="font-mono text-xs text-emerald-400">
                      Outcome: {project.metrics}
                    </span>
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-800/60">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/60 text-zinc-400 border border-zinc-700/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
