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
  fork: boolean;
  archived: boolean;
}

export const FALLBACK_REPOS: GithubRepo[] = [
  {
    id: 101,
    name: "ecc-patcher",
    full_name: "evan/ecc-patcher",
    description:
      "Autonomous surgical code repair agent that diagnoses failing test suites and verifies fixes with instant rollback.",
    html_url: "https://github.com",
    homepage: null,
    stargazers_count: 14,
    forks_count: 3,
    language: "Python",
    topics: ["code-repair", "ast", "cli", "pytest", "automation"],
    updated_at: new Date().toISOString(),
    fork: false,
    archived: false,
  },
  {
    id: 102,
    name: "digital-cv-portfolio",
    full_name: "evan/digital-cv-portfolio",
    description:
      "High-performance developer portfolio with live GitHub sync, responsive sleek dark UI, and Vercel zero-config deploy.",
    html_url: "https://github.com",
    homepage: "https://portfolio.vercel.app",
    stargazers_count: 9,
    forks_count: 2,
    language: "TypeScript",
    topics: ["nextjs", "react", "tailwindcss", "portfolio", "vercel"],
    updated_at: new Date().toISOString(),
    fork: false,
    archived: false,
  },
  {
    id: 103,
    name: "data-scraper-engine",
    full_name: "evan/data-scraper-engine",
    description:
      "Resilient asynchronous web scraping pipeline with proxy rotation, schema validation, and SQL persistence.",
    html_url: "https://github.com",
    homepage: null,
    stargazers_count: 7,
    forks_count: 1,
    language: "Python",
    topics: ["playwright", "scraping", "fastapi", "docker"],
    updated_at: new Date().toISOString(),
    fork: false,
    archived: false,
  },
  {
    id: 104,
    name: "terminal-cli-utilities",
    full_name: "evan/terminal-cli-utilities",
    description:
      "Collection of fast, single-binary CLI tools for developer productivity, log streaming, and system metrics.",
    html_url: "https://github.com",
    homepage: null,
    stargazers_count: 5,
    forks_count: 0,
    language: "Go",
    topics: ["cli", "golang", "productivity", "terminal"],
    updated_at: new Date().toISOString(),
    fork: false,
    archived: false,
  },
];

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
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

export async function fetchUserRepos(username: string): Promise<{
  repos: GithubRepo[];
  isFallback: boolean;
  error?: string;
}> {
  if (!username || username === "your-github-username" || username === "evan") {
    // When default placeholder is used, still attempt to fetch if valid username, else fallback
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
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
