# Career Command Center

A personal career management dashboard for active job seekers. Built for new grad software engineers navigating a technical job search.

## Features

- **Job Application Tracker** — Kanban board with drag-and-drop across stages (Interested → Applying → Applied → Online Assessment → Interview → Final Round → Offer / Rejected). Table view, full edit mode, and detail slide-over.
- **AI Career Assistant** — Chat with a Gemini-powered assistant that has context on your profile, skills, and active applications.
- **Insights** — Paste any job description to get an AI-generated analysis: skill match, keyword gaps, experience fit, cover letter hooks, and suggested next steps.
- **Profile** — Store your background, top skills, target roles, STAR interview stories, work preferences, and resume versions in one place.
- **Vault Search** — Browse and edit notes from an Obsidian vault directly in the app, with an "Open in Obsidian" deep link.
- **Onboarding** — Guided interview flow that builds your profile before you access the main app.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand 5 with `persist` |
| Animations | Framer Motion |
| Drag and drop | @dnd-kit |
| AI | Google Gemini (`gemini-3.1-flash-lite`) |
| Package manager | pnpm |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A [Google AI Studio](https://aistudio.google.com/) API key (free tier)

### Setup

```bash
git clone https://github.com/Christian-716/career-command-center.git
cd career-command-center
pnpm install
```

Create a `.env.local` file:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
SKIP_AUTH=true
```

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be guided through onboarding on first launch.

## Notes

- All application data is stored locally in `localStorage` via Zustand persist — no backend or database required.
- The free Gemini tier works fine for personal use. The confirmed working model for free accounts is `gemini-3.1-flash-lite`.
- Vault integration reads from mock data by default. Swap `lib/mock/vaultResults.ts` with real Obsidian vault data to use it live.
