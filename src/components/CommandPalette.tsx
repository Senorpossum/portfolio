"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { siteConfig } from "@/config/site";
import { useToast } from "@/components/Toast";
import {
  SearchIcon,
  CommandIcon,
  XIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  CopyIcon,
  TerminalIcon,
  LayersIcon,
} from "@/components/Icons";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Projects" | "Actions";
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onSelectProject }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: "nav-projects",
        title: "Go to Featured Projects",
        category: "Navigation",
        icon: <LayersIcon className="w-3.5 h-3.5 text-slate-400" />,
        action: () => {
          onClose();
          window.location.hash = "#projects";
        },
      },
      {
        id: "nav-repos",
        title: "Go to Live GitHub Repositories",
        category: "Navigation",
        icon: <GithubIcon className="w-3.5 h-3.5 text-slate-400" />,
        action: () => {
          onClose();
          window.location.hash = "#repositories";
        },
      },
      {
        id: "nav-experience",
        title: "Go to Experience & Timeline",
        category: "Navigation",
        icon: <TerminalIcon className="w-3.5 h-3.5 text-slate-400" />,
        action: () => {
          onClose();
          window.location.hash = "#experience";
        },
      },
      {
        id: "nav-skills",
        title: "Go to Skills & Tools",
        category: "Navigation",
        icon: <LayersIcon className="w-3.5 h-3.5 text-slate-400" />,
        action: () => {
          onClose();
          window.location.hash = "#skills";
        },
      },
      {
        id: "nav-contact",
        title: "Go to Contact",
        category: "Navigation",
        icon: <MailIcon className="w-3.5 h-3.5 text-slate-400" />,
        action: () => {
          onClose();
          window.location.hash = "#contact";
        },
      },

      // Projects
      ...siteConfig.featuredProjects.map((p) => ({
        id: `project-${p.id}`,
        title: `Inspect ${p.title}`,
        category: "Projects" as const,
        icon: <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />,
        action: () => {
          onClose();
          if (onSelectProject) {
            onSelectProject(p.id);
          } else {
            window.location.hash = "#projects";
          }
        },
      })),

      // Actions
      {
        id: "action-copy-email",
        title: `Copy email (${siteConfig.email})`,
        category: "Actions",
        icon: <CopyIcon className="w-3.5 h-3.5 text-slate-400" />,
        shortcut: "Copy",
        action: () => {
          navigator.clipboard.writeText(siteConfig.email);
          showToast("Email address copied to clipboard");
          onClose();
        },
      },
      {
        id: "action-open-github",
        title: "Open GitHub Profile",
        category: "Actions",
        icon: <GithubIcon className="w-3.5 h-3.5 text-slate-400" />,
        shortcut: "↗",
        action: () => {
          window.open(siteConfig.socials.github, "_blank");
          onClose();
        },
      },
      {
        id: "action-open-linkedin",
        title: "Open LinkedIn Profile",
        category: "Actions",
        icon: <LinkedinIcon className="w-3.5 h-3.5 text-slate-400" />,
        shortcut: "↗",
        action: () => {
          window.open(siteConfig.socials.linkedin, "_blank");
          onClose();
        },
      },
    ],
    [onClose, onSelectProject, showToast]
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl bg-[#0c111e] border border-slate-800 shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800/80 bg-slate-900/50">
          <SearchIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, project or section..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-900/80">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-slate-400">
              No matching commands or projects found.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-colors ${
                    isSelected
                      ? "bg-slate-800/80 text-slate-100"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {item.category}
                    </span>
                    {item.shortcut && (
                      <span className="text-slate-400">{item.shortcut}</span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-900/70 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">↑↓</kbd> navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">↵</kbd> select</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">esc</kbd> close</span>
          </div>
          <div className="flex items-center gap-1">
            <CommandIcon className="w-3 h-3 text-slate-400" />
            <span>Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
}
