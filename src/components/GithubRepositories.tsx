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
  CopyIcon,
  XIcon,
} from "@/components/Icons";
import { useToast } from "@/components/Toast";

interface GithubUserProfile {
  avatar_url: string;
  public_repos: number;
  followers: number;
  bio: string | null;
}

export default function GithubRepositories() {
  const [username, setUsername] = useState(siteConfig.githubUsername);
  const [activeUser, setActiveUser] = useState(siteConfig.githubUsername);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [userProfile, setUserProfile] = useState<GithubUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const { showToast } = useToast();

  // Filters
  const [query, setQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState<string>("all");
  const [hideForks, setHideForks] = useState<boolean>(true);

  const loadRepos = async (user: string) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      // Fetch repos
      const result = await fetchUserRepos(user);
      setRepos(result.repos);
      setIsFallback(result.isFallback);
      if (result.error) {
        setStatusMessage(result.error);
      }

      // Fetch user profile stats
      try {
        const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}`);
        if (userRes.ok) {
          const profileData = await userRes.json();
          setUserProfile({
            avatar_url: profileData.avatar_url,
            public_repos: profileData.public_repos,
            followers: profileData.followers,
            bio: profileData.bio,
          });
        }
      } catch {
        // Non-critical, fallback to null
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

  // Extract language counts
  const languageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach((r) => {
      if (r.language) {
        counts[r.language] = (counts[r.language] || 0) + 1;
      }
    });
    return counts;
  }, [repos]);

  const languages = useMemo(() => {
    const langs = Object.keys(languageCounts);
    return ["all", ...langs];
  }, [languageCounts]);

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
      .sort((a, b) => {
        const timeA = new Date(a.pushed_at || a.updated_at).getTime();
        const timeB = new Date(b.pushed_at || b.updated_at).getTime();
        return timeB - timeA;
      });
  }, [repos, hideForks, selectedLang, query]);

  const formatRelativeDate = (dateStr?: string) => {
    if (!dateStr) return "recently";
    try {
      const date = new Date(dateStr);
      const diff = Date.now() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days <= 0) return "updated today";
      if (days === 1) return "updated yesterday";
      if (days < 30) return `updated ${days}d ago`;
      const months = Math.floor(days / 30);
      if (months < 12) return `updated ${months}mo ago`;
      return `updated ${date.getFullYear()}`;
    } catch {
      return "recently";
    }
  };

  const handleCopyClone = (repoUrl: string, repoName: string) => {
    navigator.clipboard.writeText(`git clone ${repoUrl}.git`);
    showToast(`Copied clone command for ${repoName}`);
  };

  return (
    <section id="repositories" className="py-16 border-t border-slate-800/60">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-2">
              Source Repositories
            </h2>
            <p className="text-xl font-medium text-slate-100">
              Live GitHub Feed
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            {filtered.length} {filtered.length === 1 ? "repository" : "repositories"} shown
          </div>
        </div>

        {/* Sync Controls & Profile Card */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            {userProfile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userProfile.avatar_url}
                alt={activeUser}
                className="w-9 h-9 rounded-full border border-slate-700 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <GithubIcon className="w-4 h-4" />
              </div>
            )}
            <div className="text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-slate-100 font-semibold">@{activeUser}</span>
                {isFallback && (
                  <span className="text-[10px] text-slate-400 border border-slate-800 px-1.5 py-0.2 rounded bg-slate-900/60">
                    Showcase Mode
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {userProfile ? (
                  <span>{userProfile.public_repos} public repos &bull; {userProfile.followers} followers</span>
                ) : (
                  <span>Auto-sync enabled via GitHub REST API</span>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              placeholder="Enter GitHub user..."
              className="bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono w-40"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded font-mono transition-colors disabled:opacity-50"
            >
              <RefreshIcon className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              <span>Sync</span>
            </button>
          </form>
        </div>

        {statusMessage && (
          <p className="text-xs font-mono text-slate-400 mb-4">{statusMessage}</p>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Filter by repository name or topic..."
              className="w-full bg-slate-900/40 border border-slate-800 rounded-md pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700 font-mono"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 text-xs font-mono text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hideForks}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setHideForks(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
            />
            <span>Exclude Forks</span>
          </label>
        </div>

        {/* Languages tabs */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {languages.map((lang) => {
            const isSelected = selectedLang === lang;
            const count = lang === "all" ? repos.length : languageCounts[lang];
            return (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`text-xs font-mono px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-slate-100 text-slate-950 font-medium"
                    : "bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <span>{lang === "all" ? "All" : lang}</span>
                {count !== undefined && (
                  <span
                    className={`text-[10px] px-1 rounded ${
                      isSelected ? "bg-slate-300 text-slate-950" : "text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Repositories List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-slate-900/20 border border-slate-800/60 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400 rounded-lg border border-dashed border-slate-800">
            No matching repositories found.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 border-y border-slate-800/60">
            {filtered.map((repo) => {
              const langColor =
                (repo.language && LANGUAGE_COLORS[repo.language]) || "#71717a";

              return (
                <div
                  key={repo.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-900/30 px-2 -mx-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-slate-100 hover:text-white group-hover:underline flex items-center gap-1"
                      >
                        <span>{repo.name}</span>
                        <ArrowUpRightIcon className="w-3 h-3 text-slate-500 group-hover:text-slate-200" />
                      </a>
                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-slate-400 hover:text-slate-200"
                        >
                          [demo]
                        </a>
                      )}
                    </div>

                    {repo.description && (
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {repo.description}
                      </p>
                    )}

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {repo.topics.slice(0, 5).map((topic) => (
                          <span
                            key={topic}
                            className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Metadata & Actions */}
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400 shrink-0">
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
                      <StarIcon className="w-3 h-3 text-slate-500" />
                      <span>{repo.stargazers_count}</span>
                    </div>

                    {repo.forks_count > 0 && (
                      <div className="flex items-center gap-1" title="Forks">
                        <GitForkIcon className="w-3 h-3 text-slate-500" />
                        <span>{repo.forks_count}</span>
                      </div>
                    )}

                    <span className="text-[11px] text-slate-400">
                      {formatRelativeDate(repo.pushed_at || repo.updated_at)}
                    </span>

                    <button
                      onClick={() => handleCopyClone(repo.html_url, repo.name)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition-colors"
                      title="Copy clone command"
                    >
                      <CopyIcon className="w-3.5 h-3.5" />
                    </button>
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
