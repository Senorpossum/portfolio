"use client";

import { siteConfig } from "@/config/site";

export default function TimelineSection() {
  return (
    <section id="experience" className="py-16 border-t border-slate-800/60 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-2">
            Timeline
          </h2>
          <p className="text-xl font-medium text-slate-100">
            My Journey & Background
          </p>
        </div>

        {/* Experience List */}
        <div className="space-y-10">
          {siteConfig.experience.map((exp, idx) => (
            <div
              key={idx}
              className="relative pl-6 border-l border-slate-800 space-y-2 group"
            >
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-600 group-hover:bg-cyan-400 transition-colors shadow-sm" />

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <h3 className="text-base font-semibold text-slate-100">
                  {exp.role}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {exp.period}
                </span>
              </div>

              <div className="text-xs font-mono text-slate-400">
                {exp.organization} &bull; {exp.location}
              </div>

              <ul className="list-disc list-outside pl-4 space-y-1.5 pt-2 text-sm text-slate-300 leading-relaxed">
                {exp.description.map((bullet, bIdx) => (
                  <li key={bIdx}>{bullet}</li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 pt-3">
                {exp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800"
                  >
                    {skill}
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
