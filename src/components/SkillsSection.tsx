"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import SpotlightCard from "@/components/SpotlightCard";
import { CpuIcon } from "@/components/Icons";

export default function SkillsSection() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  return (
    <section id="skills" className="py-16 border-t border-slate-800/60 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-10 gap-2">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-2">
              Tooling
            </h2>
            <p className="text-xl font-medium text-slate-100">
              Skills & Technical Proficiencies
            </p>
          </div>
          {activeSkill && (
            <div className="text-xs font-mono text-cyan-400 animate-in fade-in">
              Active filter: <span className="underline">{activeSkill}</span>
              <button
                onClick={() => setActiveSkill(null)}
                className="ml-2 text-slate-500 hover:text-slate-300"
              >
                (clear)
              </button>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {siteConfig.skills.map((group, idx) => (
            <SpotlightCard
              key={idx}
              className="p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <CpuIcon className="w-3.5 h-3.5 text-slate-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  {group.category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => {
                  const isSelected = activeSkill === item;
                  return (
                    <button
                      key={item}
                      onClick={() => setActiveSkill(isSelected ? null : item)}
                      className={`text-xs font-mono px-2.5 py-1 rounded transition-colors text-left ${
                        isSelected
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                          : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
