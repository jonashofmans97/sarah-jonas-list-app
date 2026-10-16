-- Run this in Supabase > SQL Editor
create table if not exists lists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  color text not null default '#3b82f6',
  icon text not null default 'shopping-cart',
  created_at timestamptz not null default now()
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references lists(id) on delete cascade,
  title text not null,
  description text,
  amount integer not null default 1,
  category text,
  checked boolean not null default false,
  position double precision not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists items_list_idx on items(list_id);

-- No login: the anon key may do everything. Security relies on nobody knowing your URL.
alter table lists enable row level security;
alter table items enable row level security;
create policy "open lists" on lists for all to anon using (true) with check (true);
create policy "open items" on items for all to anon using (true) with check (true);

-- Realtime (free)
alter publication supabase_realtime add table lists;
alter publication supabase_realtime add table items;
alter table items replica identity full;
alter table lists replica identity full;
