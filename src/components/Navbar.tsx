"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { GithubIcon, MailIcon, CommandIcon } from "@/components/Icons";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export default function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Projects", href: "#projects" },
    { name: "Repositories", href: "#repositories" },
    { name: "Experience", href: "#experience" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        scrolled
          ? "bg-[#080b14]/85 backdrop-blur-md border-b border-slate-800/80 shadow-sm shadow-black/30 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-slate-100 hover:text-white transition-colors"
        >
          {siteConfig.name}
          <span className="text-slate-500 font-mono ml-1.5 font-normal text-xs">/ dev</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs text-slate-400 hover:text-slate-100 transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {/* Command Palette Trigger */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors"
              title="Open Command Palette (⌘K or Ctrl+K)"
            >
              <CommandIcon className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="text-[10px] text-slate-500 bg-slate-950 px-1 py-0.2 rounded border border-slate-800">
                ⌘K
              </kbd>
            </button>
          )}

          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded transition-colors"
            title="GitHub"
            aria-label="GitHub Profile"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-md transition-colors"
          >
            <MailIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Contact</span>
          </a>
        </div>
      </div>
    </header>
  );
}
