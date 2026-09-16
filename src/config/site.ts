export interface ArchitectureStep {
  step: string;
  title: string;
  desc: string;
}

export interface Project {
  id: string;
  title: string;
  year: string;
  tagline: string;
  problem: string;
  solution: string;
  stack: string[];
  githubUrl: string;
  liveUrl?: string;
  metrics?: string;
  architectureFlow?: ArchitectureStep[];
}

export interface Experience {
  period: string;
  role: string;
  organization: string;
  location: string;
  description: string[];
  skills: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export const siteConfig = {
  name: "Evan",
  title: "Student Software Developer",
  location: "United Kingdom",
  bio: "I'm an aspiring software developer with a genuine passion for building things that work well. I spend my time programming full-stack web applications, experimenting with automation and CLI utilities and learning how systems function under the hood. Always curious, constantly building and eager to learn from experienced developers.",
  status: "Open to junior roles, internships and freelance projects",
  githubUsername: "Senorpossum",
  email: "evan.flowsentinel@gmail.com",
  socials: {
    github: "https://github.com/Senorpossum",
    linkedin: "https://www.linkedin.com/in/evan-thompson-3a1816436",
    twitter: "https://x.com",
  },
  skills: [
    {
      category: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "Go", "SQL (PostgreSQL / SQLite)", "HTML/CSS"],
    },
    {
      category: "Frontend & Web",
      items: ["React", "Next.js (App Router)", "Tailwind CSS", "Responsive Design", "Web APIs"],
    },
    {
      category: "Backend & Systems",
      items: ["Node.js", "FastAPI", "REST APIs", "Relational Databases", "Async Programming"],
    },
    {
      category: "Tools & Workflow",
      items: ["Git & GitHub", "Vercel", "Docker Basics", "Linux & Bash", "Testing"],
    },
  ] as SkillGroup[],

  featuredProjects: [
    {
      id: "portfolio",
      title: "Developer Portfolio & Digital CV",
      year: "2026",
      tagline: "Minimalist developer portfolio with live GitHub synchronization and interactive terminal navigation",
      problem:
        "Student developer portfolios often rely on static copy that drifts from actual GitHub activity, creating maintenance overhead and failing to showcase genuine ongoing work.",
      solution:
        "Designed and built a fast Next.js 14 web app that connects directly to the GitHub REST API to pull the latest active repositories in real time, with Spotlight interactions, architecture breakdowns and zero-config Vercel edge deployment.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "GitHub API", "Vercel"],
      githubUrl: "https://github.com/Senorpossum/portfolio",
      liveUrl: "",
      metrics: "Live sync with GitHub repositories, search filtering and 100/100 performance",
      architectureFlow: [
        { step: "01", title: "Next.js App Router", desc: "Server components and static prerendering for sub-100ms load times" },
        { step: "02", title: "GitHub REST API Sync", desc: "Cached data fetching with live fallback for unauthenticated limits" },
        { step: "03", title: "Client Filtering", desc: "Instant search and language tag filtering with zero layout reflows" },
        { step: "04", title: "Vercel Edge Delivery", desc: "Automated git-push deployment with global edge CDN distribution" },
      ],
    },
    {
      id: "blink",
      title: "Blink",
      year: "2026",
      tagline: "Touchless vision controller for Linux workstations using MediaPipe and OpenCV",
      problem:
        "Controlling media playback, window navigation or presentation slides hands-free on Linux without cumbersome wearable devices or proprietary hardware was difficult.",
      solution:
        "Built a touchless vision controller in Python that processes webcam input via MediaPipe and OpenCV to track hand gestures, fingertip air mouse coordinates and blink/wink state machines, dispatching native Linux inputs, shell commands and mouse events with FastAPI telemetry.",
      stack: ["Python", "MediaPipe", "OpenCV", "FastAPI", "Linux", "WebSockets"],
      githubUrl: "https://github.com/Senorpossum/blink",
      liveUrl: "",
      metrics: "46 automated tests with sub-50ms gesture classification and zero proprietary hardware",
      architectureFlow: [
        { step: "01", title: "Video Capture Pipeline", desc: "OpenCV capture thread streams frames at 30-60 FPS into decoupled ring buffers" },
        { step: "02", title: "Dual Landmarker Engine", desc: "MediaPipe face blendshapes calculate Eye Aspect Ratio while hand landmarks track 21 3D joint coordinates" },
        { step: "03", title: "Spatial State Machine", desc: "Debounces micro-movements, tracks air mouse velocity vectors and classifies gestures through temporal state machines" },
        { step: "04", title: "Native Action Dispatcher", desc: "Dispatches keyboard shortcuts, mouse events and shell commands via native X11/Wayland with FastAPI WebSocket telemetry" },
      ],
    },
    {
      id: "uscan-wip-",
      title: "Uscan",
      year: "2026",
      tagline: "High-speed asynchronous OSINT engine and digital footprint investigation suite",
      problem:
        "Investigating digital footprints across hundreds of platforms requires querying disparate endpoints, but modern anti-bot systems, Cloudflare WAFs and rate limits frequently block naive scrapers and yield false positives.",
      solution:
        "Engineered an asynchronous reconnaissance tool in Python with JA3 and JA4 TLS browser fingerprint impersonation via curl_cffi, Playwright challenge escalation, dynamic proxy rotation and telecom wire center forensics across CLI, TUI and web interfaces.",
      stack: ["Python", "Playwright", "FastAPI", "Asyncio", "curl_cffi", "OSINT"],
      githubUrl: "https://github.com/Senorpossum/Uscan-WIP-",
      liveUrl: "",
      metrics: "Concurrent multi-platform footprinting with JA3 and JA4 bypass and 3 interface modes",
      architectureFlow: [
        { step: "01", title: "Target Ingestion & Registry Sync", desc: "Normalizes usernames, emails or phone numbers against synced WhatsMyName, Maigret and Sherlock registries" },
        { step: "02", title: "Anti-Bot & WAF Stealth Stack", desc: "Applies curl_cffi for authentic JA3 and JA4 TLS fingerprints with dynamic proxy pools and adaptive jitter" },
        { step: "03", title: "Headless Escalation", desc: "Automatically delegates complex JavaScript challenges and clearance cookies to headless Playwright worker instances" },
        { step: "04", title: "Multi-Interface Presentation", desc: "Streams normalized intelligence dossiers to rich terminal summaries, Textual TUI dashboards or FastAPI Server-Sent Events" },
      ],
    },
  ] as Project[],

  experience: [
    {
      period: "2026 — Present",
      role: "Student Developer & Independent Projects",
      organization: "Self-Directed Learning",
      location: "Remote",
      description: [
        "Building practical full-stack projects using TypeScript, React, Next.js and Python.",
        "Exploring automated testing, AST code parsing and CLI tool design.",
        "Actively learning best practices for Git workflows, code reviews and production deployment on Vercel.",
      ],
      skills: ["Next.js", "TypeScript", "Python", "Git", "REST APIs"],
    },
    {
      period: "2026",
      role: "Software Development Fundamentals & Exploration",
      organization: "Personal Studies & Practical Coding",
      location: "United Kingdom",
      description: [
        "Studied programming fundamentals, object-oriented principles and data structures.",
        "Built interactive frontends and backend services with SQL database persistence.",
        "Practiced working with Linux terminal environments, shell scripts and version control.",
      ],
      skills: ["JavaScript", "Python", "SQL", "HTML/CSS", "Linux Basics"],
    },
  ] as Experience[],
};
