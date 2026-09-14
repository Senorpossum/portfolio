"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import {
  MailIcon,
  CopyIcon,
  GithubIcon,
  LinkedinIcon,
  ArrowUpRightIcon,
} from "@/components/Icons";
import { useToast } from "@/components/Toast";
import SpotlightCard from "@/components/SpotlightCard";

const TOPICS = [
  {
    id: "role",
    label: "Junior Role / Internship",
    subject: "Junior Developer Opportunity / Internship",
    template:
      "Hi Evan,\n\nI came across your portfolio and would like to discuss a potential junior software engineering opportunity or internship with our team.\n\nBest regards,",
  },
  {
    id: "freelance",
    label: "Freelance Project",
    subject: "Freelance Project Inquiry",
    template:
      "Hi Evan,\n\nI have a web application or automation project that I'd like to collaborate with you on.\n\nProject Overview:\n\nBest regards,",
  },
  {
    id: "collab",
    label: "Collaboration & Open Source",
    subject: "Developer Collaboration / Open Source",
    template:
      "Hi Evan,\n\nLoved your projects! Would love to connect and chat about software development or collaborate on an open-source project.\n\nCheers,",
  },
];

export default function ContactSection() {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [senderName, setSenderName] = useState("");
  const { showToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(siteConfig.email);
    showToast("Email copied to clipboard");
  };

  const mailtoBody = senderName
    ? selectedTopic.template.replace("Best regards,", `Best regards,\n${senderName}`).replace("Cheers,", `Cheers,\n${senderName}`)
    : selectedTopic.template;

  const mailtoUrl = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    selectedTopic.subject
  )}&body=${encodeURIComponent(mailtoBody)}`;

  return (
    <section id="contact" className="py-20 border-t border-slate-800/60">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-2">
            Get In Touch
          </h2>
          <p className="text-xl font-medium text-slate-100">
            Let&apos;s Connect
          </p>
          <p className="text-sm text-slate-400 max-w-lg mt-2">
            I&apos;m always excited to talk about code, collaborate on open-source projects or discuss junior engineering roles and internships.
          </p>
        </div>

        {/* Interactive Message Builder */}
        <SpotlightCard className="p-6 sm:p-8 space-y-6 shadow-xl shadow-black/20">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3">
              1. Select what you&apos;d like to discuss
            </span>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((topic) => {
                const isActive = selectedTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-colors text-left ${
                      isActive
                        ? "bg-slate-100 text-slate-950 font-semibold shadow"
                        : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {topic.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                2. Your Name or Company (Optional)
              </span>
            </div>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Alex from Acme Corp"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Drafted Preview */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              3. Message Preview
            </span>
            <div className="rounded-lg bg-slate-950/90 border border-slate-800/80 p-4 font-mono text-xs text-slate-300 space-y-2">
              <div className="text-slate-500 border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Subject:</span> {selectedTopic.subject}
              </div>
              <div className="whitespace-pre-line text-slate-400 leading-relaxed pt-1">
                {mailtoBody}
              </div>
            </div>
          </div>

          {/* Actions row */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <a
                href={mailtoUrl}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-white text-slate-950 font-medium px-4 py-2 rounded-lg text-xs transition-colors shadow"
              >
                <MailIcon className="w-3.5 h-3.5" />
                <span>Open in Email App</span>
                <ArrowUpRightIcon className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3.5 py-2 rounded-lg text-xs font-mono transition-colors"
              >
                <CopyIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Email</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-800 transition-colors"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-800 transition-colors"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
