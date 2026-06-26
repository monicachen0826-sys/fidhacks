-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query).

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null default '',
  bio text not null default '',
  linkedin_url text not null default '',
  github_url text not null default '',
  portfolio_url text not null default '',
  website_url text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references profiles(id) on delete cascade,
  recipient_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique (requester_id, recipient_id)
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  category text not null check (category in ('professional', 'personal', 'both')),
  date date not null,
  description text not null default '',
  significance smallint not null default 3,
  visibility text not null default 'private' check (visibility in ('private', 'connections', 'public')),
  skills text[] not null default '{}',
  ai_summary text,
  created_at timestamptz not null default now()
);

create table if not exists sub_events (
  id uuid primary key default gen_random_uuid(),
  parent_event_id uuid not null references events(id) on delete cascade,
  title text not null,
  date date not null,
  description text not null default '',
  why_it_mattered text,
  significance smallint not null default 3,
  skill_tags text[] not null default '{}',
  ai_summary text,
  evidence_url text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table connections enable row level security;
alter table events enable row level security;
alter table sub_events enable row level security;

-- profiles: anyone signed in can read any profile (needed for username search + public pages);
-- only the owner can write their own.
create policy "profiles are readable by authenticated users" on profiles
  for select using (auth.role() = 'authenticated');
create policy "users manage their own profile" on profiles
  for insert with check (auth.uid() = id);
create policy "users update their own profile" on profiles
  for update using (auth.uid() = id);

-- connections: a user can see a connection row if they're either party.
create policy "view own connections" on connections
  for select using (auth.uid() = requester_id or auth.uid() = recipient_id);
create policy "create requests as requester" on connections
  for insert with check (auth.uid() = requester_id);
create policy "recipient or requester can update status" on connections
  for update using (auth.uid() = requester_id or auth.uid() = recipient_id);
create policy "requester can delete pending request" on connections
  for delete using (auth.uid() = requester_id);

-- events: owner has full access; others can read if visibility allows it.
create policy "owner manages own events" on events
  for all using (auth.uid() = user_id);
create policy "public events readable by anyone authenticated" on events
  for select using (
    visibility = 'public' and auth.role() = 'authenticated'
  );
create policy "connection events readable by accepted connections" on events
  for select using (
    visibility = 'connections'
    and exists (
      select 1 from connections c
      where c.status = 'accepted'
        and ((c.requester_id = auth.uid() and c.recipient_id = events.user_id)
          or (c.recipient_id = auth.uid() and c.requester_id = events.user_id))
    )
  );

-- sub_events inherit visibility from their parent event.
create policy "owner manages own sub_events" on sub_events
  for all using (
    exists (
      select 1 from events e where e.id = sub_events.parent_event_id and e.user_id = auth.uid()
    )
  );
create policy "sub_events readable when parent event is readable" on sub_events
  for select using (
    exists (
      select 1 from events e
      where e.id = sub_events.parent_event_id
        and (
          e.user_id = auth.uid()
          or (e.visibility = 'public' and auth.role() = 'authenticated')
          or (
            e.visibility = 'connections'
            and exists (
              select 1 from connections c
              where c.status = 'accepted'
                and ((c.requester_id = auth.uid() and c.recipient_id = e.user_id)
                  or (c.recipient_id = auth.uid() and c.requester_id = e.user_id))
            )
          )
        )
    )
  );
