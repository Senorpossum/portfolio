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
  title: "Software Engineer",
  location: "United Kingdom",
  bio: "Full-stack software engineer building reliable web applications, automation tooling, and developer infrastructure. Focused on clean system design, TypeScript, Python, and modern cloud deployment.",
  status: "Available for contract & full-time engineering roles",
  githubUsername: "evan", // Set your GitHub username here to load all your public repos
  email: "evan@example.com",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
  },
  skills: [
    {
      category: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "Go", "SQL (PostgreSQL / SQLite)", "HTML/CSS"],
    },
    {
      category: "Frontend",
      items: ["React", "Next.js (App Router)", "Tailwind CSS", "Web APIs", "State Management"],
    },
    {
      category: "Backend & Systems",
      items: ["Node.js", "FastAPI", "REST APIs", "Database Design", "Async Programming"],
    },
    {
      category: "DevOps & Infrastructure",
      items: ["Git & GitHub Workflows", "Vercel", "Docker", "Linux / Shell Scripting", "CI/CD Pipelines"],
    },
  ] as SkillGroup[],

  featuredProjects: [
    {
      id: "ecc-patcher",
      title: "ECC-Patcher",
      year: "2024",
      tagline: "Autonomous AST code repair & verification pipeline",
      problem:
        "Large language models often hallucinate entire files or introduce subtle regressions when editing large codebases, leading to high token burn and dirty repository states.",
      solution:
        "Built a surgical patch engine that parses Python AST trees to isolate only relevant failing frames, enforces strict search/replace block grammar, and verifies patches through a tiered lint/test runner with automatic git rollback on failure.",
      stack: ["Python", "AST Parsing", "Pytest", "Ruff", "Git Engine", "CLI"],
      githubUrl: "https://github.com",
      liveUrl: "",
      metrics: "Sub-20ms syntax validation and zero dirty-state compounding",
    },
    {
      id: "dev-portfolio",
      title: "Developer Portfolio & CV Engine",
      year: "2024",
      tagline: "High-performance digital CV with automated GitHub sync",
      problem:
        "Standard resume builders are static and disconnect from an engineer's daily open-source output and repository commits.",
      solution:
        "Architected a Next.js 14 web application featuring ISR (Incremental Static Regeneration) for the GitHub REST API, client-side repository filtering, and zero-config automated deployment on Vercel.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "GitHub REST API", "Vercel"],
      githubUrl: "https://github.com",
      liveUrl: "https://portfolio.vercel.app",
      metrics: "100/100 Lighthouse performance & live repo synchronization",
    },
    {
      id: "data-pipeline",
      title: "Resilient Data Extraction Service",
      year: "2024",
      tagline: "Concurrent asynchronous scraping and data normalization engine",
      problem:
        "Scraping dynamic web applications often fails due to aggressive rate-limits, shifting DOM structures, and unhandled network drops.",
      solution:
        "Designed a distributed ingestion service with rotating proxies, retry backoff with jitter, headless browser fallbacks via Playwright, and automated schema enforcement via Pydantic.",
      stack: ["Python", "FastAPI", "Playwright", "PostgreSQL", "Docker"],
      githubUrl: "https://github.com",
      liveUrl: "",
      metrics: "Processes 200+ concurrent requests with fault-tolerant recovery",
    },
  ] as Project[],

  experience: [
    {
      period: "2024 — Present",
      role: "Software Engineer (Open Source & Independent Projects)",
      organization: "Self-Employed",
      location: "Remote",
      description: [
        "Developing developer tools and web applications using TypeScript, React, Next.js, and Python.",
        "Engineering autonomous code generation and repair workflows with deterministic test harnesses.",
        "Contributing to open-source codebases, participating in bug bounties, and maintaining CI/CD pipelines.",
      ],
      skills: ["Next.js", "TypeScript", "Python", "Git", "API Engineering"],
    },
    {
      period: "2023 — 2024",
      role: "Full-Stack Development & Applied Systems",
      organization: "Technical Projects & Practical Research",
      location: "Remote",
      description: [
        "Built production-grade web interfaces and backend microservices with database persistence.",
        "Implemented authentication, schema validation, and REST API design patterns.",
        "Mastered Linux server environments, shell automation, and cloud deployment on Vercel.",
      ],
      skills: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "Linux"],
    },
  ] as Experience[],
};
