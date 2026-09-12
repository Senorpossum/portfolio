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
  title: "Passionate Student Software Developer",
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
      id: "ecc-patcher",
      title: "ECC-Patcher",
      year: "2026",
      tagline: "Autonomous AST code repair & verification pipeline",
      problem:
        "When using AI coding assistants on real codebases, whole-file rewrites often cause syntax errors and waste tokens. I wanted to build a tool that makes precise, surgical changes.",
      solution:
        "Built a CLI in Python that inspects failing test tracebacks, uses Python's AST parser to isolate only the relevant code frames, enforces strict search/replace block grammar and automatically rolls back changes via Git if linting or pytest fails.",
      stack: ["Python", "AST", "Pytest", "Ruff", "Git", "CLI"],
      githubUrl: "https://github.com/Senorpossum/portfolio",
      liveUrl: "",
      metrics: "Surgical AST frame isolation with automatic git rollbacks on failure",
    },
    {
      id: "dev-portfolio",
      title: "Personal Portfolio & Digital CV",
      year: "2026",
      tagline: "Minimalist portfolio with live GitHub repository synchronization",
      problem:
        "I wanted a digital CV that reflects my actual active work on GitHub without having to manually copy-paste repository updates every time I start a new project.",
      solution:
        "Designed and built a fast Next.js 14 web app that connects directly to the GitHub REST API to fetch and filter my public repositories in real time, with zero-config continuous deployment on Vercel.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "GitHub API", "Vercel"],
      githubUrl: "https://github.com/Senorpossum/portfolio",
      liveUrl: "",
      metrics: "Live sync with GitHub repositories, search filtering and 100/100 performance",
    },
    {
      id: "data-pipeline",
      title: "Resilient Data Extraction Service",
      year: "2026",
      tagline: "Concurrent asynchronous scraping and data normalization engine",
      problem:
        "Extracting data from dynamic web pages often breaks when connections drop or rate limits kick in. I wanted to learn how to build a resilient, fault-tolerant scraper.",
      solution:
        "Created an asynchronous data scraper in Python utilizing Playwright and FastAPI, featuring exponential backoff retries, schema validation with Pydantic and export to structured database formats.",
      stack: ["Python", "FastAPI", "Playwright", "PostgreSQL", "Docker"],
      githubUrl: "https://github.com/Senorpossum/portfolio",
      liveUrl: "",
      metrics: "Handles concurrent scraping with automated retry logic and validated schemas",
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
