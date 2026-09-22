# ArticleApply 🚀

> **AI-Powered Cold Email Outreach SaaS with High Deliverability Guarantee**
> Automated personalized email sequences via native Gmail API, Google Gemini AI copywriting, Supabase Realtime tracking, and BullMQ + Redis rate-limited queuing (2 emails/second).

---

## 🌟 Key Features

1. **Native Gmail API Integration**
   - Direct inbox delivery via Google OAuth (`https://www.googleapis.com/auth/gmail.send`).
   - Automatically handles token refreshing using offline consent tokens (`access_type: 'offline'`, `prompt: 'consent'`).
   - Base64 URL-encoded MIME message construction complying with RFC 2822.

2. **Google Gemini AI Email Crafter**
   - Live AI copywriting using `@google/genai` (model: `gemini-2.5-flash`).
   - Generates high-converting subject line suggestions.
   - Preserves personalization variable pills (`{{first_name}}`, `{{company}}`, `{{role}}`).
   - Tone switcher: Persuasive, Executive concise (<80 words), Casual & warm, Direct value-driven.

3. **Rate-Limited Anti-Spam Queue (BullMQ + Redis)**
   - Strict rate limiting: **2 emails / second** (1,000ms window).
   - Prevents Google API rate limit errors (HTTP 429) and email provider spam triggers.
   - Exponential backoff retries and job status tracking.

4. **Supabase PostgreSQL & Realtime Subscriptions**
   - Secure Row Level Security (RLS) policies for user data isolation.
   - WebSocket Realtime channels on `contacts` and `campaigns` tables for live animated progress updates without manual polling.

5. **Intuitive Dark-Themed SaaS UI**
   - Multi-step Campaign Builder (Setup → AI Crafter → CSV Import → Rate-Limited Launch).
   - PapaParse CSV importer with auto-detection of email and contact fields.
   - Live Queue Monitor with progress bars, throughput metrics, and real-time activity stream.
   - Contacts directory, analytics breakdown, and system connection health monitor.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/) + React 18 + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Dark Mode with glassmorphic accents) + [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, RLS, Realtime)
- **Background Jobs**: [BullMQ](https://bullmq.io/) + [IORedis](https://github.com/luin/ioredis)
- **Email Delivery**: [googleapis](https://github.com/googleapis/google-api-nodejs-client) (Gmail API v1)
- **AI Copywriting**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (`gemini-2.5-flash`)
- **CSV Parsing**: [PapaParse](https://www.papaparse.com/)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Docker** (optional for local Redis) or an Upstash/Cloud Redis instance

### 2. Installation
```bash
# Clone or navigate to the repository
cd artiapply

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration details:
```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google OAuth & Gmail API
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# BullMQ Redis
REDIS_URL=redis://localhost:6379
```

> **Note**: ArticleApply features a built-in **interactive demo fallback mode**. If any credentials are omitted, the web application runs smoothly with simulated queues, smart template generators, and demo contacts.

### 4. Database Setup (Supabase)
Run the migration script located at `supabase/migrations/0001_initial_schema.sql` in your Supabase SQL Editor:
- Creates `public.users`, `public.campaigns`, and `public.contacts`.
- Applies Row Level Security (RLS) policies.
- Enables `supabase_realtime` on `contacts` and `campaigns`.

### 5. Running the Application
```bash
# Start Redis (via Docker Compose)
docker-compose up -d

# Start the Next.js Dev Server (runs on http://localhost:3000)
npm run dev

# Start the Standalone BullMQ Worker Process (in a separate terminal)
npm run worker
```

---

## 📁 Project Architecture

```
artiapply/
├── docker-compose.yml              # Redis container setup
├── supabase/
│   └── migrations/
│       └── 0001_initial_schema.sql # PostgreSQL schema & RLS policies
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/enhance/route.ts       # Gemini AI copywriting API
│   │   │   ├── auth/google/route.ts      # Google OAuth initiation (Gmail send scopes)
│   │   │   ├── campaigns/launch/route.ts # Campaign launch & BullMQ enqueuing
│   │   │   ├── campaigns/route.ts        # List/delete campaigns
│   │   │   └── queue/status/route.ts     # Redis & queue metrics
│   │   ├── auth/callback/route.ts        # OAuth callback & token storage
│   │   ├── globals.css                   # Custom dark mode & glassmorphism
│   │   ├── layout.tsx                    # Root layout & SEO tags
│   │   └── page.tsx                      # Main dashboard shell & realtime coordinator
│   ├── components/
│   │   ├── Sidebar.tsx                   # Main navigation & system status
│   │   ├── Dashboard.tsx                 # KPIs, live queue monitor & activity feed
│   │   ├── CampaignBuilder.tsx           # Multi-step wizard with Gemini AI
│   │   ├── CampaignsList.tsx             # Filterable campaign sequences
│   │   ├── ContactsDirectory.tsx         # Contacts list with status badges
│   │   ├── AnalyticsView.tsx             # Hourly throughput & deliverability
│   │   └── SettingsView.tsx              # Integrations health check
│   ├── hooks/
│   │   └── useRealtimeCampaign.ts        # Supabase Realtime channel subscription
│   ├── lib/
│   │   ├── gmail/service.ts              # OAuth2 client, MIME builder, Gmail send
│   │   ├── queue/
│   │   │   ├── client.ts                 # BullMQ queue & Redis connection
│   │   │   └── worker.ts                 # BullMQ worker (rate limit: 2/sec)
│   │   └── supabase/
│   │       ├── client.ts                 # Browser client
│   │       ├── server.ts                 # SSR server client (cookies)
│   │       └── admin.ts                  # Service role client
│   └── types/
│       └── database.ts                   # TypeScript interfaces
└── scripts/
    └── run-worker.ts                     # Standalone worker runner
```

---

## 🛡 Anti-Spam & Deliverability Architecture

- **Pacing**: BullMQ rate limiter is strictly set to `max: 2, duration: 1000ms`.
- **Authenticity**: Sends through the user's authentic Gmail account via OAuth rather than untrusted SMTP relays.
- **Dynamic Content**: Personalized variables (`{{first_name}}`, `{{company}}`, etc.) avoid identical hash signatures.
- **Fail-Safe**: Realtime status tracking allows instant pausing if deliverability flags occur.
