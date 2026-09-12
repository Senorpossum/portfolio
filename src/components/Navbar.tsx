"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { GithubIcon, MailIcon } from "@/components/Icons";

export default function Navbar() {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
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
        <div className="flex items-center gap-3">
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
            <span>Contact</span>
          </a>
        </div>
      </div>
    </header>
  );
}
