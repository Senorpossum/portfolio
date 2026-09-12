"use client";

import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-zinc-800/60 bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <div>
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>

        <div className="flex items-center gap-6">
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-200 transition-colors"
          >
            GitHub
          </a>
          <a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-200 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="#projects"
            className="hover:text-zinc-200 transition-colors"
          >
            Top &uarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
