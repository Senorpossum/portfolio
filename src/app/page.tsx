"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import GithubRepositories from "@/components/GithubRepositories";
import TimelineSection from "@/components/TimelineSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import ProjectModal from "@/components/ProjectModal";
import InteractiveBackground from "@/components/InteractiveBackground";
import { siteConfig, Project } from "@/config/site";

export default function Home() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Global Command+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectProjectId = (id: string) => {
    const found = siteConfig.featuredProjects.find((p) => p.id === id);
    if (found) {
      setSelectedProject(found);
    }
  };

  return (
    <main className="min-h-screen bg-[#080b14] text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Dynamic 60fps Mouse-Interactive Background with Ambient Aura & Particle Grid */}
      <InteractiveBackground />

      {/* Primary Page Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
        <Hero />
        <FeaturedProjects onSelectProject={(project) => setSelectedProject(project)} />
        <GithubRepositories />
        <TimelineSection />
        <SkillsSection />
        <ContactSection />
        <Footer />
      </div>

      {/* Interactive Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectProject={handleSelectProjectId}
      />

      {/* Interactive Project Architecture Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </main>
  );
}
