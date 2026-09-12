"use client";

import { useState, useEffect, useMemo, FormEvent, ChangeEvent } from "react";
import { siteConfig } from "@/config/site";
import {
  GithubRepo,
  LANGUAGE_COLORS,
  FALLBACK_REPOS,
  fetchUserRepos,
} from "@/lib/github";
import {
  GithubIcon,
  StarIcon,
  GitForkIcon,
  SearchIcon,
  ArrowUpRightIcon,
  RefreshIcon,
} from "@/components/Icons";

export default function GithubRepositories() {
  const [username, setUsername] = useState(siteConfig.githubUsername);
  const [activeUser, setActiveUser] = useState(siteConfig.githubUsername);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filters
  const [query, setQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState<string>("all");
  const [hideForks, setHideForks] = useState<boolean>(true);

  const loadRepos = async (user: string) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const result = await fetchUserRepos(user);
      setRepos(result.repos);
      setIsFallback(result.isFallback);
      if (result.error) {
        setStatusMessage(result.error);
      }
    } catch {
      setRepos(FALLBACK_REPOS);
      setIsFallback(true);
      setStatusMessage("Using showcase repositories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepos(activeUser);
  }, [activeUser]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setActiveUser(username.trim());
    }
  };

  const languages = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((r) => {
      if (r.language) set.add(r.language);
    });
    return ["all", ...Array.from(set)];
  }, [repos]);

  const filtered = useMemo(() => {
    return repos
      .filter((r) => {
        if (hideForks && r.fork) return false;
        if (selectedLang !== "all" && r.language?.toLowerCase() !== selectedLang.toLowerCase()) {
          return false;
        }
        if (query.trim()) {
          const q = query.toLowerCase();
          const matchName = r.name.toLowerCase().includes(q);
          const matchDesc = r.description?.toLowerCase().includes(q);
          const matchTopic = r.topics?.some((t) => t.toLowerCase().includes(q));
          return matchName || matchDesc || matchTopic;
        }
        return true;
      })
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [repos, hideForks, selectedLang, query]);

  const formatRelativeDate = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days <= 0) return "today";
      if (days === 1) return "yesterday";
      if (days < 30) return `${days}d ago`;
      const months = Math.floor(days / 30);
      return `${months}mo ago`;
    } catch {
      return "recently";
    }
  };

  return (
    <section id="repositories" className="py-16 border-t border-zinc-800/60">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold mb-2">
              Source Repositories
            </h2>
            <p className="text-xl font-medium text-zinc-100">
              Live GitHub Feed
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-400">
            {filtered.length} {filtered.length === 1 ? "repository" : "repositories"} shown
          </div>
        </div>

        {/* Sync Controls */}
        <div className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
            <GithubIcon className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>Target GitHub Account:</span>
            <span className="text-zinc-100 font-semibold">@{activeUser}</span>
            {isFallback && (
              <span className="text-[10px] text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded">
                Showcase Mode
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              placeholder="Enter GitHub user..."
              className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 font-mono w-40"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-2.5 py-1 rounded font-mono transition-colors disabled:opacity-50"
            >
              <RefreshIcon className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              <span>Sync</span>
            </button>
          </form>
        </div>

        {statusMessage && (
          <p className="text-xs font-mono text-zinc-500 mb-4">{statusMessage}</p>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Filter by repository name or topic..."
              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 font-mono"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-mono text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hideForks}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setHideForks(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-900 text-zinc-100 focus:ring-0"
            />
            <span>Exclude Forks</span>
          </label>
        </div>

        {/* Languages tabs */}
        <div className="flex flex-wrap gap-1 mb-6">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`text-xs font-mono px-2.5 py-1 rounded transition-colors ${
                selectedLang === lang
                  ? "bg-zinc-100 text-zinc-950 font-medium"
                  : "bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              }`}
            >
              {lang === "all" ? "All" : lang}
            </button>
          ))}
        </div>

        {/* Repositories List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-zinc-900/20 border border-zinc-800/60 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-zinc-500 rounded-lg border border-dashed border-zinc-800">
            No matching repositories found.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60 border-y border-zinc-800/60">
            {filtered.map((repo) => {
              const langColor =
                (repo.language && LANGUAGE_COLORS[repo.language]) || "#71717a";

              return (
                <div
                  key={repo.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-zinc-100 hover:text-white group-hover:underline flex items-center gap-1"
                      >
                        <span>{repo.name}</span>
                        <ArrowUpRightIcon className="w-3 h-3 text-zinc-500 group-hover:text-zinc-200" />
                      </a>
                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200"
                        >
                          [demo]
                        </a>
                      )}
                    </div>

                    {repo.description && (
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {repo.description}
                      </p>
                    )}

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {repo.topics.slice(0, 5).map((topic) => (
                          <span
                            key={topic}
                            className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.2 rounded border border-zinc-800"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 shrink-0">
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: langColor }}
                        />
                        <span>{repo.language}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1" title="Stars">
                      <StarIcon className="w-3 h-3 text-zinc-500" />
                      <span>{repo.stargazers_count}</span>
                    </div>

                    {repo.forks_count > 0 && (
                      <div className="flex items-center gap-1" title="Forks">
                        <GitForkIcon className="w-3 h-3 text-zinc-500" />
                        <span>{repo.forks_count}</span>
                      </div>
                    )}

                    <span className="text-[11px] text-zinc-400">
                      {formatRelativeDate(repo.updated_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
