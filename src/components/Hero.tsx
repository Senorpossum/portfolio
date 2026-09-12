"use client";

import { siteConfig } from "@/config/site";
import { GithubIcon, ArrowUpRightIcon, MailIcon } from "@/components/Icons";

export default function Hero() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="space-y-6">
          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{siteConfig.status}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-100">
            {siteConfig.name}
            <span className="block text-zinc-400 font-normal text-xl sm:text-2xl mt-1.5">
              {siteConfig.title} &mdash; {siteConfig.location}
            </span>
          </h1>

          {/* Bio / Summary */}
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed font-normal">
            {siteConfig.bio}
          </p>

          {/* Actions & Links */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
            <a
              href="#projects"
              className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium px-4 py-2 rounded-md transition-colors"
            >
              <span>Selected Work</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </a>

            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-800 px-3.5 py-2 rounded-md transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>github.com/{siteConfig.githubUsername}</span>
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 px-2 py-2 transition-colors"
            >
              <MailIcon className="w-3.5 h-3.5" />
              <span>{siteConfig.email}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
