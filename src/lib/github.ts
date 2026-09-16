import { Project, ArchitectureStep } from "@/config/site";

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  pushed_at?: string;
  created_at?: string;
  fork: boolean;
  archived: boolean;
}

export const FALLBACK_REPOS: GithubRepo[] = [
  {
    id: 101,
    name: "blink",
    full_name: "Senorpossum/blink",
    description:
      "A touchless vision controller for Linux workstations using MediaPipe and OpenCV.",
    html_url: "https://github.com/Senorpossum/blink",
    homepage: null,
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    topics: ["mediapipe", "opencv", "touchless", "linux", "fastapi"],
    updated_at: "2026-09-16T21:12:45Z",
    pushed_at: "2026-09-16T21:12:45Z",
    created_at: "2026-09-16T18:00:00Z",
    fork: false,
    archived: false,
  },
  {
    id: 102,
    name: "Uscan-WIP-",
    full_name: "Senorpossum/Uscan-WIP-",
    description:
      "High-speed asynchronous OSINT engine and digital footprint investigation suite.",
    html_url: "https://github.com/Senorpossum/Uscan-WIP-",
    homepage: null,
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    topics: ["osint", "reconnaissance", "fastapi", "asyncio", "playwright"],
    updated_at: "2026-09-16T21:01:58Z",
    pushed_at: "2026-09-16T21:01:58Z",
    created_at: "2026-09-16T17:30:00Z",
    fork: false,
    archived: false,
  },
  {
    id: 103,
    name: "NetScanAndroid-WIP-",
    full_name: "Senorpossum/NetScanAndroid-WIP-",
    description:
      "Offline-first Android network reconnaissance and Wi-Fi diagnostics suite.",
    html_url: "https://github.com/Senorpossum/NetScanAndroid-WIP-",
    homepage: null,
    stargazers_count: 0,
    forks_count: 0,
    language: "Kotlin",
    topics: ["android", "kotlin", "jetpack-compose", "networking", "sqlcipher"],
    updated_at: "2026-09-16T20:53:03Z",
    pushed_at: "2026-09-16T20:53:03Z",
    created_at: "2026-09-16T16:45:00Z",
    fork: false,
    archived: false,
  },
  {
    id: 104,
    name: "portfolio",
    full_name: "Senorpossum/portfolio",
    description:
      "Minimalist developer portfolio with live GitHub sync and interactive terminal navigation.",
    html_url: "https://github.com/Senorpossum/portfolio",
    homepage: null,
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    topics: ["nextjs", "react", "tailwindcss", "portfolio", "vercel"],
    updated_at: "2026-09-14T09:00:50Z",
    pushed_at: "2026-09-14T09:00:50Z",
    created_at: "2026-09-10T11:00:00Z",
    fork: false,
    archived: false,
  },
  {
    id: 105,
    name: "Spec2Test",
    full_name: "Senorpossum/Spec2Test",
    description:
      "Automated test suite generator from user stories and specification documents.",
    html_url: "https://github.com/Senorpossum/Spec2Test",
    homepage: null,
    stargazers_count: 1,
    forks_count: 0,
    language: "TypeScript",
    topics: ["cypress", "developer-tools", "jest", "playwright", "qa-automation", "test-generation", "testing"],
    updated_at: "2026-07-14T12:17:44Z",
    pushed_at: "2026-07-14T12:17:04Z",
    created_at: "2026-07-14T10:26:27Z",
    fork: false,
    archived: false,
  },
];

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Kotlin: "#A97BFF",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Java: "#b07219",
  Swift: "#F05138",
};

export const CURATED_PROJECT_DETAILS: Record<
  string,
  {
    title: string;
    tagline: string;
    problem: string;
    solution: string;
    stack: string[];
    metrics: string;
    liveUrl?: string;
    architectureFlow: ArchitectureStep[];
  }
> = {
  blink: {
    title: "Blink",
    tagline: "Touchless vision controller for Linux workstations using MediaPipe and OpenCV",
    problem:
      "Controlling media playback, window navigation or presentation slides hands-free on Linux without cumbersome wearable devices or proprietary hardware was difficult.",
    solution:
      "Built a touchless vision controller in Python that processes webcam input via MediaPipe and OpenCV to track hand gestures, fingertip air mouse coordinates and blink/wink state machines, dispatching native Linux inputs, shell commands and mouse events with FastAPI telemetry.",
    stack: ["Python", "MediaPipe", "OpenCV", "FastAPI", "Linux", "WebSockets"],
    metrics: "46 automated tests with sub-50ms gesture classification and zero proprietary hardware",
    liveUrl: "",
    architectureFlow: [
      { step: "01", title: "Video Capture Pipeline", desc: "OpenCV capture thread streams frames at 30-60 FPS into decoupled ring buffers" },
      { step: "02", title: "Dual Landmarker Engine", desc: "MediaPipe face blendshapes calculate Eye Aspect Ratio while hand landmarks track 21 3D joint coordinates" },
      { step: "03", title: "Spatial State Machine", desc: "Debounces micro-movements, tracks air mouse velocity vectors and classifies gestures through temporal state machines" },
      { step: "04", title: "Native Action Dispatcher", desc: "Dispatches keyboard shortcuts, mouse events and shell commands via native X11/Wayland with FastAPI WebSocket telemetry" },
    ],
  },
  uscan: {
    title: "Uscan",
    tagline: "High-speed asynchronous OSINT engine and digital footprint investigation suite",
    problem:
      "Investigating digital footprints across hundreds of platforms requires querying disparate endpoints, but modern anti-bot systems, Cloudflare WAFs and rate limits frequently block naive scrapers and yield false positives.",
    solution:
      "Engineered an asynchronous reconnaissance tool in Python with JA3 and JA4 TLS browser fingerprint impersonation via curl_cffi, Playwright challenge escalation, dynamic proxy rotation and telecom wire center forensics across CLI, TUI and web interfaces.",
    stack: ["Python", "Playwright", "FastAPI", "Asyncio", "curl_cffi", "OSINT"],
    metrics: "Concurrent multi-platform footprinting with JA3 and JA4 bypass and 3 interface modes",
    liveUrl: "",
    architectureFlow: [
      { step: "01", title: "Target Ingestion & Registry Sync", desc: "Normalizes usernames, emails or phone numbers against synced WhatsMyName, Maigret and Sherlock registries" },
      { step: "02", title: "Anti-Bot & WAF Stealth Stack", desc: "Applies curl_cffi for authentic JA3 and JA4 TLS fingerprints with dynamic proxy pools and adaptive jitter" },
      { step: "03", title: "Headless Escalation", desc: "Automatically delegates complex JavaScript challenges and clearance cookies to headless Playwright worker instances" },
      { step: "04", title: "Multi-Interface Presentation", desc: "Streams normalized intelligence dossiers to rich terminal summaries, Textual TUI dashboards or FastAPI Server-Sent Events" },
    ],
  },
  netscanandroid: {
    title: "NetScan Android",
    tagline: "Offline-first Android network reconnaissance and Wi-Fi diagnostics suite",
    problem:
      "Most mobile network diagnostic tools bury basic telemetry behind subscriptions, upload discovery logs to cloud servers or fail to provide low-level socket inspection on mobile devices.",
    solution:
      "Created an offline-first Android application in Kotlin and Jetpack Compose featuring subnet sweeps, port scanning, raw socket probing, 1D Kalman filter RSSI smoothing, custom Canvas spectrum visualizers and hardware-backed SQLCipher encryption.",
    stack: ["Kotlin", "Jetpack Compose", "Coroutines", "SQLCipher", "Android SDK", "Networking"],
    metrics: "100% offline-first local network audit engine with hardware-backed KeyStore security",
    liveUrl: "",
    architectureFlow: [
      { step: "01", title: "Subnet & Socket Engine", desc: "Discovers active hosts via concurrent TCP socket probes, mDNS discovery and system ARP table sweeps" },
      { step: "02", title: "Signal Processing & Kalman Filter", desc: "Passes raw Wi-Fi RSSI signals through a 1D Kalman filter state estimator to eliminate noise on 2.4 GHz, 5 GHz and 6 GHz bands" },
      { step: "03", title: "Hardware-Accelerated UI", desc: "Renders custom Jetpack Compose Canvas frequency spectrum curves, force-directed topologies and IDW heatmaps" },
      { step: "04", title: "Hardware-Backed Security", desc: "Persists audit logs into SQLCipher AES-256 databases protected by Android KeyStore, StrongBox and biometric authentication" },
    ],
  },
  portfolio: {
    title: "Developer Portfolio & Digital CV",
    tagline: "Minimalist developer portfolio with live GitHub synchronization and interactive terminal navigation",
    problem:
      "Student developer portfolios often rely on static copy that drifts from actual GitHub activity, creating maintenance overhead and failing to showcase genuine ongoing work.",
    solution:
      "Designed and built a fast Next.js 14 web app that connects directly to the GitHub REST API to pull the latest active repositories in real time, with Spotlight interactions, architecture breakdowns and zero-config Vercel edge deployment.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "GitHub API", "Vercel"],
    metrics: "Live sync with GitHub repositories, search filtering and 100/100 performance",
    liveUrl: "",
    architectureFlow: [
      { step: "01", title: "Next.js App Router", desc: "Server components and static prerendering for sub-100ms load times" },
      { step: "02", title: "GitHub REST API Sync", desc: "Cached data fetching with live fallback for unauthenticated limits" },
      { step: "03", title: "Client Filtering", desc: "Instant search and language tag filtering with zero layout reflows" },
      { step: "04", title: "Vercel Edge Delivery", desc: "Automated git-push deployment with global edge CDN distribution" },
    ],
  },
  spec2test: {
    title: "Spec2Test",
    tagline: "Automated test suite generator from user stories and specification documents",
    problem:
      "Writing comprehensive unit, integration and edge-case tests from software requirements is repetitive, often leading to missing test coverage for critical user scenarios.",
    solution:
      "Created a TypeScript CLI and library that parses markdown or Jira user stories, inspects codebase patterns via AST analysis and generates complete test suites for Jest, Vitest, Playwright and Cypress with coverage metadata.",
    stack: ["TypeScript", "Node.js", "Jest", "Playwright", "AST Parsing", "CLI"],
    metrics: "Automates test generation across 4 test frameworks with acceptance criteria mapping",
    liveUrl: "",
    architectureFlow: [
      { step: "01", title: "User Story Ingestion", desc: "Parses markdown files, plain text specifications or Jira ticket bodies into structured UserStory AST objects" },
      { step: "02", title: "Codebase Analysis", desc: "Inspects project structure, existing testing patterns and framework conventions to guide assertion style" },
      { step: "03", title: "Test Suite Generation", desc: "Generates comprehensive unit and integration test suites covering happy paths, edge cases and security checks" },
      { step: "04", title: "File Output & Reporting", desc: "Emits idiomatic test files alongside test-suite-metadata.json and markdown coverage summaries" },
    ],
  },
};

export function formatProjectTitle(rawName: string): string {
  const clean = rawName.replace(/-wip-?$/i, "").replace(/_wip_?$/i, "");
  const lower = clean.toLowerCase();
  if (lower === "blink") return "Blink";
  if (lower === "uscan") return "Uscan";
  if (lower === "netscanandroid" || lower === "netscan") return "NetScan Android";
  if (lower === "spec2test") return "Spec2Test";
  if (lower === "portfolio") return "Developer Portfolio & Digital CV";

  return clean
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function mapGithubRepoToProject(repo: GithubRepo): Project {
  const normKey = repo.name.toLowerCase().replace(/-wip-?$/i, "").replace(/_wip_?$/i, "");
  const curated =
    CURATED_PROJECT_DETAILS[normKey] ||
    CURATED_PROJECT_DETAILS[repo.name.toLowerCase()];

  const year = repo.pushed_at || repo.updated_at
    ? new Date(repo.pushed_at || repo.updated_at).getFullYear().toString()
    : "2026";

  if (curated) {
    return {
      id: repo.name.toLowerCase(),
      title: curated.title,
      year,
      tagline: repo.description || curated.tagline,
      problem: curated.problem,
      solution: curated.solution,
      stack: curated.stack,
      githubUrl: repo.html_url,
      liveUrl: repo.homepage || curated.liveUrl || "",
      metrics:
        repo.stargazers_count > 0
          ? `${curated.metrics} (${repo.stargazers_count} star${repo.stargazers_count === 1 ? "" : "s"})`
          : curated.metrics,
      architectureFlow: curated.architectureFlow,
    };
  }

  const title = formatProjectTitle(repo.name);
  const lang = repo.language || "TypeScript";
  const topics = repo.topics || [];
  const stack = [lang, ...topics.slice(0, 5)].filter(Boolean);

  return {
    id: repo.name.toLowerCase(),
    title,
    year,
    tagline: repo.description || `Autonomous ${lang} project built on GitHub`,
    problem: `Built to explore ${lang} system design, automated testing and practical workflows in real codebases.`,
    solution: `Implemented in ${lang} with modular architecture, clean git history and reproducible tests.`,
    stack: stack.length > 0 ? stack : [lang, "Git", "GitHub"],
    githubUrl: repo.html_url,
    liveUrl: repo.homepage || "",
    metrics:
      repo.stargazers_count > 0
        ? `${repo.stargazers_count} GitHub star${repo.stargazers_count === 1 ? "" : "s"} &bull; Actively maintained`
        : "Active GitHub repository with clean test suites",
    architectureFlow: [
      { step: "01", title: "Input Interface", desc: `Validates incoming data structures and configuration parameters for ${title}` },
      { step: "02", title: "Core Execution Engine", desc: `Executes primary ${lang} domain logic with deterministic resource bounds` },
      { step: "03", title: "Automated Verification", desc: "Guarantees behavioral correctness through continuous automated test suites" },
      { step: "04", title: "Delivery & Output", desc: "Formats and exports execution results or terminal interfaces cleanly" },
    ],
  };
}

export async function fetchUserRepos(username: string): Promise<{
  repos: GithubRepo[];
  isFallback: boolean;
  error?: string;
}> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Developer-Portfolio-App",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return {
        repos: FALLBACK_REPOS,
        isFallback: true,
        error: `GitHub API status ${res.status}: Using showcase data. Update username in site.ts.`,
      };
    }

    const data: GithubRepo[] = await res.json();
    return { repos: data, isFallback: false };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    return {
      repos: FALLBACK_REPOS,
      isFallback: true,
      error: `${message}. Displaying showcase repositories.`,
    };
  }
}

export async function fetchLatestProjects(
  username: string = "Senorpossum",
  limit: number = 3
): Promise<{
  projects: Project[];
  isFallback: boolean;
  error?: string;
}> {
  const result = await fetchUserRepos(username);

  // Filter out forks, archived repositories and GitHub profile README repo
  const validRepos = result.repos.filter((repo) => {
    if (repo.fork) return false;
    if (repo.archived) return false;
    if (repo.name.toLowerCase() === username.toLowerCase()) return false;
    return true;
  });

  // Sort by latest pushed_at or updated_at date descending
  const sorted = [...validRepos].sort((a, b) => {
    const timeA = new Date(a.pushed_at || a.updated_at).getTime();
    const timeB = new Date(b.pushed_at || b.updated_at).getTime();
    return timeB - timeA;
  });

  const topRepos = sorted.slice(0, limit);
  const projects = topRepos.map(mapGithubRepoToProject);

  return {
    projects,
    isFallback: result.isFallback,
    error: result.error,
  };
}

