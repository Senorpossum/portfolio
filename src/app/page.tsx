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
import { fetchLatestProjects } from "@/lib/github";

export default function Home() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(siteConfig.featuredProjects);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);

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

  // Dynamically pull latest 3 projects from GitHub
  useEffect(() => {
    let isMounted = true;
    fetchLatestProjects(siteConfig.githubUsername, 3)
      .then((res) => {
        if (isMounted && res.projects && res.projects.length > 0) {
          setProjects(res.projects);
        }
      })
      .catch((err) => {
        console.error("Failed to load GitHub projects:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingProjects(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectProjectId = (id: string) => {
    const cleanId = id.toLowerCase().replace(/-wip-?$/i, "").replace(/_wip_?$/i, "");
    const found =
      projects.find(
        (p) =>
          p.id === id ||
          p.id.toLowerCase() === id.toLowerCase() ||
          p.id.toLowerCase().replace(/-wip-?$/i, "").replace(/_wip_?$/i, "") === cleanId
      ) ||
      siteConfig.featuredProjects.find(
        (p) =>
          p.id === id ||
          p.id.toLowerCase() === id.toLowerCase() ||
          p.id.toLowerCase().replace(/-wip-?$/i, "").replace(/_wip_?$/i, "") === cleanId
      );
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
        <FeaturedProjects
          projects={projects}
          isLoading={isLoadingProjects}
          onSelectProject={(project) => setSelectedProject(project)}
        />
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
        projects={projects}
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
