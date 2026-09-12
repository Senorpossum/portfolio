"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { MailIcon, CopyIcon, CheckIcon, GithubIcon, ArrowUpRightIcon } from "@/components/Icons";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-20 border-t border-zinc-800/60">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold mb-2">
            Get In Touch
          </h2>
          <p className="text-xl font-medium text-zinc-100">
            Let&apos;s Connect
          </p>
          <p className="text-sm text-zinc-400 max-w-lg mt-2">
            I&apos;m always excited to talk about code, collaborate on open-source projects, or discuss junior engineering roles and internships.
          </p>
        </div>

        <div className="p-6 rounded-lg bg-zinc-900/30 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
              Direct Email
            </span>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-base font-mono text-zinc-100 hover:underline flex items-center gap-2"
            >
              <MailIcon className="w-4 h-4 text-zinc-400" />
              <span>{siteConfig.email}</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 px-3.5 py-2 rounded transition-colors"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Email Copied</span>
                </>
              ) : (
                <>
                  <CopyIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Address</span>
                </>
              )}
            </button>

            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium px-4 py-2 rounded transition-colors"
            >
              <span>Say Hello</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </a>

            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 p-2 rounded transition-colors"
              title="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
