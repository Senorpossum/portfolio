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
          ? "bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-100 hover:text-white transition-colors"
        >
          {siteConfig.name}
          <span className="text-zinc-500 font-mono ml-1.5 font-normal text-xs">/ dev</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors font-medium"
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Open Command Palette (⌘K or Ctrl+K)"
            >
              <CommandIcon className="w-3 h-3 text-zinc-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="text-[10px] text-zinc-500 bg-zinc-950 px-1 py-0.2 rounded border border-zinc-800">
                ⌘K
              </kbd>
            </button>
          )}

          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded transition-colors"
            title="GitHub"
            aria-label="GitHub Profile"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-md transition-colors"
          >
            <MailIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Contact</span>
          </a>
        </div>
      </div>
    </header>
  );
}
