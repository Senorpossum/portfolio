"use client";

import React, { useEffect } from "react";
import { Project } from "@/config/site";
import { useToast } from "@/components/Toast";
import {
  XIcon,
  GithubIcon,
  ArrowUpRightIcon,
  CopyIcon,
  LayersIcon,
} from "@/components/Icons";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { showToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const cloneCommand = `git clone ${project.githubUrl}.git`;

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCommand);
    showToast("Clone command copied to clipboard");
  };

  // Specific architectural steps for each project
  const getArchitectureFlow = (id: string) => {
    const normalizedId = id.toLowerCase().replace(/-wip-?$/i, "").replace(/_wip_?$/i, "");
    switch (normalizedId) {
      case "blink":
        return [
          { step: "01", title: "Video Capture Pipeline", desc: "OpenCV capture thread streams frames at 30-60 FPS into decoupled ring buffers" },
          { step: "02", title: "Dual Landmarker Engine", desc: "MediaPipe face blendshapes calculate Eye Aspect Ratio while hand landmarks track 21 3D joint coordinates" },
          { step: "03", title: "Spatial State Machine", desc: "Debounces micro-movements, tracks air mouse velocity vectors and classifies gestures through temporal state machines" },
          { step: "04", title: "Native Action Dispatcher", desc: "Dispatches keyboard shortcuts, mouse events and shell commands via native X11/Wayland with FastAPI WebSocket telemetry" },
        ];
      case "uscan":
        return [
          { step: "01", title: "Target Ingestion & Registry Sync", desc: "Normalizes usernames, emails or phone numbers against synced WhatsMyName, Maigret and Sherlock registries" },
          { step: "02", title: "Anti-Bot & WAF Stealth Stack", desc: "Applies curl_cffi for authentic JA3 and JA4 TLS fingerprints with dynamic proxy pools and adaptive jitter" },
          { step: "03", title: "Headless Escalation", desc: "Automatically delegates complex JavaScript challenges and clearance cookies to headless Playwright worker instances" },
          { step: "04", title: "Multi-Interface Presentation", desc: "Streams normalized intelligence dossiers to rich terminal summaries, Textual TUI dashboards or FastAPI Server-Sent Events" },
        ];
      case "netscanandroid":
      case "netscan":
        return [
          { step: "01", title: "Subnet & Socket Engine", desc: "Discovers active hosts via concurrent TCP socket probes, mDNS discovery and system ARP table sweeps" },
          { step: "02", title: "Signal Processing & Kalman Filter", desc: "Passes raw Wi-Fi RSSI signals through a 1D Kalman filter state estimator to eliminate noise on 2.4 GHz, 5 GHz and 6 GHz bands" },
          { step: "03", title: "Hardware-Accelerated UI", desc: "Renders custom Jetpack Compose Canvas frequency spectrum curves, force-directed topologies and IDW heatmaps" },
          { step: "04", title: "Hardware-Backed Security", desc: "Persists audit logs into SQLCipher AES-256 databases protected by Android KeyStore, StrongBox and biometric authentication" },
        ];
      case "portfolio":
      case "dev-portfolio":
        return [
          { step: "01", title: "Next.js App Router", desc: "Server components and static prerendering for sub-100ms load times" },
          { step: "02", title: "GitHub REST API Sync", desc: "Cached data fetching with live fallback for unauthenticated limits" },
          { step: "03", title: "Client Filtering", desc: "Instant search and language tag filtering with zero layout reflows" },
          { step: "04", title: "Vercel Edge Delivery", desc: "Automated git-push deployment with global edge CDN distribution" },
        ];
      case "spec2test":
        return [
          { step: "01", title: "User Story Ingestion", desc: "Parses markdown files, plain text specifications or Jira ticket bodies into structured UserStory AST objects" },
          { step: "02", title: "Codebase Analysis", desc: "Inspects project structure, existing testing patterns and framework conventions to guide assertion style" },
          { step: "03", title: "Test Suite Generation", desc: "Generates comprehensive unit and integration test suites covering happy paths, edge cases and security checks" },
          { step: "04", title: "File Output & Reporting", desc: "Emits idiomatic test files alongside test-suite-metadata.json and markdown coverage summaries" },
        ];
      default:
        return [
          { step: "01", title: "Input Interface", desc: "Validates incoming parameters and data structures" },
          { step: "02", title: "Core Logic", desc: "Processes operations with predictable memory usage" },
          { step: "03", title: "Automated Verification", desc: "Ensures behavioral correctness with automated tests" },
          { step: "04", title: "Output Delivery", desc: "Formats and delivers results via API or user interface" },
        ];
    }
  };

  const flow = project.architectureFlow || getArchitectureFlow(project.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c111e] border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <XIcon className="w-4 h-4" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400 mb-2">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              {project.year}
            </span>
            <span>&bull;</span>
            <span>Architecture Breakdown</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
            {project.title}
          </h2>
          <p className="text-sm font-mono text-slate-400 mt-1">
            {project.tagline}
          </p>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <LayersIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Execution Flow & Architecture</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {flow.map((item) => (
              <div
                key={item.step}
                className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800/80 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                    {item.step}
                  </span>
                  <span className="text-xs font-medium text-slate-200">
                    {item.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Context & What was Built */}
        <div className="space-y-4 text-xs leading-relaxed bg-slate-900/30 p-4 rounded-xl border border-slate-800/60">
          <div>
            <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
              Why I Built It
            </span>
            <p className="text-slate-300">{project.problem}</p>
          </div>
          <div>
            <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
              How It Works Under The Hood
            </span>
            <p className="text-slate-300">{project.solution}</p>
          </div>
          {project.metrics && (
            <div className="text-emerald-400 font-mono text-[11px] pt-1">
              Key takeaway: {project.metrics}
            </div>
          )}
        </div>

        {/* Quick Clone Snippet */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Clone Repository</span>
            <button
              onClick={handleCopyClone}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <CopyIcon className="w-3 h-3" />
              <span>Copy Command</span>
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 font-mono text-xs text-slate-300 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-emerald-400 shrink-0">$</span>
              <span className="truncate">{cloneCommand}</span>
            </div>
            <button
              onClick={handleCopyClone}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 shrink-0"
              title="Copy"
            >
              <CopyIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stack & Links */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-white text-slate-950 font-medium transition-colors"
              >
                <span>Live Site</span>
                <ArrowUpRightIcon className="w-3.5 h-3.5" />
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
