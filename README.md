# Petrichor

> *The scent of rain on dry earth.*

A personal habit tracker. OLED dark neumorphic design. Built with Next.js 14 + Supabase.

---

## Setup (5 steps)

### 1. Create Supabase project
- Go to [supabase.com](https://supabase.com) → New project
- Copy your **Project URL** and **anon key** from Settings → API

### 2. Run the schema
- Supabase Dashboard → SQL Editor → paste contents of `supabase-schema.sql` → Run

### 3. Enable Google OAuth
- Supabase Dashboard → Authentication → Providers → Google → Enable
- Add OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
  - Authorised redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`

### 4. Configure environment
```bash
cp .env.example .env.local
# Fill in your values:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Install and run
```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Project structure

```
petrichor/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx       ← Google sign-in UI
│   │   └── callback/route.ts    ← OAuth redirect handler
│   ├── (app)/                   ← Protected routes (auth required)
│   │   ├── layout.tsx           ← Shared layout with BottomNav
│   │   ├── today/page.tsx       ← Main habits view
│   │   ├── tasks/page.tsx       ← Daily + general todos
│   │   ├── progress/page.tsx    ← Charts, streaks, heatmap
│   │   ├── reports/page.tsx     ← Weekly/monthly/milestones
│   │   └── settings/page.tsx    ← Notifications, data export
│   ├── layout.tsx               ← Root layout, fonts
│   ├── globals.css              ← Global styles, animations
│   └── page.tsx                 ← Redirects to /today or /auth/login
├── components/
│   ├── ui/
│   │   ├── Neu.tsx              ← Neumorphic primitives (Neu, NeuBtn, Ring…)
│   │   └── BottomNav.tsx        ← Tab navigation
│   ├── habits/
│   │   ├── HabitCard.tsx        ← Individual habit row
│   │   ├── HabitSheet.tsx       ← Add/edit habit bottom sheet
│   │   ├── NoteSheet.tsx        ← Per-habit daily note
│   │   └── EndDayModal.tsx      ← Mood + journal modal
│   ├── tasks/                   ← Todo components
│   └── progress/                ← Chart components
├── hooks/
│   ├── useHabits.ts             ← CRUD + realtime + optimistic updates
│   ├── useLogs.ts               ← Toggle/skip/note + realtime
│   └── useTodos.ts              ← Todo CRUD + realtime
├── lib/
│   ├── supabase.ts              ← Browser + server Supabase clients
│   ├── db.ts                    ← All DB queries
│   ├── types.ts                 ← TypeScript types mirroring DB schema
│   ├── utils.ts                 ← Date helpers, streak calc, data transforms
│   └── constants.ts             ← Colors, categories, templates, design tokens
├── middleware.ts                ← Auth guard for all routes
├── supabase-schema.sql          ← Run this in Supabase SQL Editor
└── .env.local                   ← Your secrets (never commit this)
```

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
# Add environment variables in Vercel dashboard
# Set NEXT_PUBLIC_APP_URL to your production URL
# Update Google OAuth redirect URI to production URL
```
