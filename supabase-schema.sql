-- ═══════════════════════════════════════════════════════════
-- PETRICHOR — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ═══════════════════════════════════════════════════════════

-- ── Enable UUID extension ─────────────────────────────────
create extension if not exists "pgcrypto";

-- ── HABITS ───────────────────────────────────────────────
create table if not exists public.habits (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  label         text not null,
  icon_id       text not null default 'bolt',
  custom_emoji  text,
  color_id      text not null default 'gold',
  custom_color  text,
  category_id   text not null default 'health',
  goal          int  not null default 7,
  goal_type     text not null default 'days' check (goal_type in ('days','specific')),
  schedule_days int[] not null default '{0,1,2,3,4,5,6}',
  reminder_time text,
  reminder_on   boolean not null default false,
  position      int  not null default 0,
  archived      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── HABIT LOGS ───────────────────────────────────────────
create table if not exists public.habit_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  habit_id   uuid references public.habits(id) on delete cascade not null,
  date       date not null,
  done       boolean not null default false,
  skipped    boolean not null default false,
  note       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (habit_id, date)
);

-- ── DAY SUMMARIES (mood + journal) ───────────────────────
create table if not exists public.day_summaries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  date       date not null,
  mood       smallint check (mood between 0 and 4),
  journal    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

-- ── TODOS ────────────────────────────────────────────────
create table if not exists public.todos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  date       date,       -- null = general todo (not tied to a day)
  text       text not null,
  priority   text not null default 'none' check (priority in ('none','low','med','high')),
  done       boolean not null default false,
  position   int  not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════
create index if not exists habits_user_id_idx    on public.habits(user_id) where not archived;
create index if not exists logs_user_date_idx    on public.habit_logs(user_id, date desc);
create index if not exists logs_habit_date_idx   on public.habit_logs(habit_id, date desc);
create index if not exists summary_user_date_idx on public.day_summaries(user_id, date desc);
create index if not exists todos_user_date_idx   on public.todos(user_id, date);

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Users can only read/write their own data. Always.
-- ═══════════════════════════════════════════════════════════
alter table public.habits       enable row level security;
alter table public.habit_logs   enable row level security;
alter table public.day_summaries enable row level security;
alter table public.todos        enable row level security;

-- Habits
create policy "habits_own" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Habit logs
create policy "logs_own" on public.habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Day summaries
create policy "summaries_own" on public.day_summaries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Todos
create policy "todos_own" on public.todos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- AUTO-SET user_id FROM SESSION (so client never sends it)
-- ═══════════════════════════════════════════════════════════
create or replace function public.set_user_id()
returns trigger language plpgsql security definer as $$
begin
  new.user_id = auth.uid();
  return new;
end;
$$;

create or replace trigger habits_set_user
  before insert on public.habits
  for each row execute function public.set_user_id();

create or replace trigger logs_set_user
  before insert on public.habit_logs
  for each row execute function public.set_user_id();

create or replace trigger summaries_set_user
  before insert on public.day_summaries
  for each row execute function public.set_user_id();

create or replace trigger todos_set_user
  before insert on public.todos
  for each row execute function public.set_user_id();

-- ═══════════════════════════════════════════════════════════
-- AUTO-UPDATE updated_at
-- ═══════════════════════════════════════════════════════════
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger habits_updated_at
  before update on public.habits
  for each row execute function public.set_updated_at();

create or replace trigger logs_updated_at
  before update on public.habit_logs
  for each row execute function public.set_updated_at();

create or replace trigger summaries_updated_at
  before update on public.day_summaries
  for each row execute function public.set_updated_at();

create or replace trigger todos_updated_at
  before update on public.todos
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════
-- REALTIME
-- Enable realtime for all tables (used by hooks)
-- ═══════════════════════════════════════════════════════════
alter publication supabase_realtime add table public.habits;
alter publication supabase_realtime add table public.habit_logs;
alter publication supabase_realtime add table public.day_summaries;
alter publication supabase_realtime add table public.todos;
