# Content Generation Dashboard

An AI-powered content automation frontend that lets you schedule topic research, filter ideas, generate platform-ready content, and publish it to your social media — all from one dashboard.

> **Note:** This repository is the **frontend only**. The backend (API, AI agents, scraping workers, queue system, and publishing integrations) is managed separately. This UI connects to the backend via environment variables configured in Settings.

---

## What Problem It Solves

Managing a content pipeline manually is slow. You browse for topics, write content, decide what to post, figure out the right platform format, and then schedule it — repeating this every day.

This dashboard automates the entire pipeline:

```
Schedule a Topic → AI Researches It → Ideas Generated → You Approve/Reject
→ Content Generated → Scheduled → Auto-Published on Time
```

Everything is tracked in one place so you always know what is being researched, what is waiting for approval, what is in the content queue, and what has already been published.

---

## How the Workflow Works

### Step 1 — Research (Researcher Tab)
Enter a topic and set your research criteria. The system sends a scrape job to the backend, which pulls relevant content from the web and processes it. You can see the processing status live in the dashboard. When done, the researched data moves automatically to the next step.

### Step 2 — Filter and Approve Ideas (Generate Ideas)
The AI analyses the research and generates a batch of content ideas for your topic. Each idea appears on the Ideas Board. You go through them and:
- **Approve** the ideas that fit your brand and audience
- **Reject** the ones that do not

Only approved ideas move forward to content generation. This keeps your content quality consistent without you having to write or curate everything manually.

### Step 3 — Content Generation (Creator Tab)
Approved ideas are sent as jobs to the content generation queue. You can track each job through its stages:
- **Queued** — waiting to be picked up
- **Generating Prompt** — AI is crafting the content brief
- **Prompt Ready** — brief is done, ready for generation
- **Selecting Model** — AI picks the right model for the content type
- **Generating** — content being written
- **Done** — content ready for publishing

You can also write a **Custom Prompt** for any idea if you want to guide the tone, angle, or format manually.

### Step 4 — Publish and Schedule (Publisher Tab)
Generated content is sent to the Publisher. From here you:
- Choose which platform to publish on
- Set the publish time (immediate or scheduled)
- Track status: **Pending → Scheduled → Published**

Supported platforms:
| Platform | Status |
|----------|--------|
| TikTok | Supported |
| Instagram | Supported |
| YouTube | Supported |
| Twitter / X | Supported |
| X Ads | Supported |
| Custom | Configurable |

Once scheduled, publishing happens automatically at the set time — no manual action needed.

---

## Dashboard Views

| Tab | What You Do Here |
|-----|-----------------|
| **Researcher** | Start new research jobs, monitor scraping progress, view raw research data |
| **Generate Ideas** | Review and approve/reject AI-generated content ideas from research |
| **Creator** | Monitor content generation jobs, add custom prompts, view generated drafts |
| **Publisher** | Schedule and track publishing across all platforms |
| **Settings** | Manage API keys and backend environment variables |

---

## Settings — API Keys

All backend connections are configured from the Settings tab inside the dashboard. No `.env` file editing needed. You add and manage keys directly from the UI:
- Backend API URL
- AI model keys (OpenRouter, OpenAI, etc.)
- Social platform credentials
- Scraping API keys

---

## Why This Helps Your Business

- **Save hours every week** — research and content writing happen automatically on your schedule
- **Consistent output** — content goes out on time, every time, without depending on manual effort
- **Quality control stays with you** — the approve/reject step means you always have final say before anything gets published
- **Full visibility** — every piece of content has a trackable status from research to publish
- **Scale without hiring** — one person can manage a multi-platform content operation that would otherwise need a team

---

## Tech Stack (Frontend)

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| React Router | Page navigation |
| Lucide Icons | Icon library |

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> Make sure the backend is running and your API keys are configured in the Settings tab before using the dashboard.

---

## Frontend-Only Notice

This repository contains **only the frontend UI**. It does not include:
- The AI research and scraping backend
- The content generation agent
- The publishing queue and scheduler
- Database or storage layer

The backend is maintained in a separate repository. This frontend connects to it via the base API URL configured in Settings.

