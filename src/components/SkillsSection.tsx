"use client";

import { siteConfig } from "@/config/site";

export default function SkillsSection() {
  return (
    <section id="skills" className="py-16 border-t border-zinc-800/60">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold mb-2">
            Tooling
          </h2>
          <p className="text-xl font-medium text-zinc-100">
            Skills & Technical Proficiencies
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {siteConfig.skills.map((group, idx) => (
            <div
              key={idx}
              className="p-5 rounded-lg bg-zinc-900/20 border border-zinc-800/80 space-y-3"
            >
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                {group.category}
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
