# Engineer Portfolio & Digital CV

A high-performance, minimalist developer portfolio and digital CV designed for software engineers. Built with Next.js 14, TypeScript, Tailwind CSS, and the GitHub REST API.

---

## What Makes This Different

- **Substance Over Gimmicks**: Clean, restrained editorial aesthetic inspired by senior engineering sites (Linear, Paco, Vercel). No cheesy animated terminal text or neon gradients.
- **Real Technical Case Studies**: Projects are presented with problem statements, architectural decisions, and verifiable outcomes rather than generic descriptions.
- **Live GitHub Synchronization**: Auto-fetches and displays your public GitHub repositories in real-time with search, language filters, star counts, and direct links.
- **Digital CV / Resume**: Structured chronology highlighting ownership, technical competencies, and impact.
- **Zero-Config Vercel Deployment**: Ready to deploy in seconds on the Vercel free tier.

---

## 1. Quick Setup & Customization

All personal information, featured projects, skills, and experience live in a single file:

```typescript
// Edit this file to customize your portfolio:
src/config/site.ts
```

Key fields to update:
- `name`: Your full name.
- `title`: e.g. "Software Engineer", "Full-Stack Developer".
- `githubUsername`: Your actual GitHub username (this syncs your repositories live!).
- `email`: Your professional email for contact inquiries.
- `featuredProjects`: Highlight your top 2–4 flagship projects with architecture details.
- `experience`: Your milestones, open-source work, or education.

---

## 2. Run Locally

```bash
cd portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Deploying to Vercel (Free)

### Method A: Via GitHub (Recommended)

1. Create a new empty repository on [github.com](https://github.com/new) named `portfolio`.
2. Push your code:
   ```bash
   cd portfolio
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/portfolio.git
   git push -u origin main
   ```
3. Go to [vercel.com/new](https://vercel.com/new).
4. Select your `portfolio` repository and click **Deploy**.
5. Your site is live! Any future `git push` automatically redeploys your portfolio.

### Method B: Via Vercel CLI

```bash
cd portfolio
npx vercel
```
Follow the interactive prompts to deploy directly from your terminal.

---

## 4. Branch Protection & CI/CD

To safeguard the main branch from accidental deletion, history rewrites, and broken builds:

- **CI/CD Pipeline**: Automated GitHub Actions workflow (`.github/workflows/ci.yml`) runs ESLint and Next.js production builds on every push and pull request.
- **Local Pre-Push Hook**: Configured in `.githooks/pre-push` to block `git push origin --delete main` and non-fast-forward force-pushes locally.
- **GitHub Branch Rulesets**: Detailed setup instructions for GitHub repository rulesets (blocking deletions and requiring status checks) can be found in [docs/BRANCH_PROTECTION.md](docs/BRANCH_PROTECTION.md).
