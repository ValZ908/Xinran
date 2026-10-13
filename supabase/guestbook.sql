-- Guestbook untuk xinran-app.
-- Jalankan sekali di Supabase Dashboard → SQL Editor.

create table if not exists public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 24),
  message text not null check (char_length(btrim(message)) between 1 and 200),
  color text not null default 'sun'
    check (color in ('sun', 'rose', 'sky', 'mint', 'lilac')),
  sticker text not null default '☀️' check (char_length(sticker) <= 8),
  likes integer not null default 0 check (likes >= 0),
  created_at timestamptz not null default now()
);

create index if not exists guestbook_messages_created_at_idx
  on public.guestbook_messages (created_at desc);

alter table public.guestbook_messages enable row level security;

-- Semua orang boleh membaca.
drop policy if exists "guestbook read" on public.guestbook_messages;
create policy "guestbook read" on public.guestbook_messages
  for select to anon, authenticated using (true);

-- Semua orang boleh menulis pesan baru, tapi likes harus mulai dari 0.
drop policy if exists "guestbook insert" on public.guestbook_messages;
create policy "guestbook insert" on public.guestbook_messages
  for insert to anon, authenticated with check (likes = 0);

-- Tidak ada policy update/delete: pengunjung tidak bisa mengubah atau
-- menghapus pesan. Like hanya lewat fungsi di bawah (+1 saja).
create or replace function public.like_guestbook_message(msg_id uuid)
returns integer
language sql
security definer
set search_path = public
as $$
  update public.guestbook_messages
  set likes = likes + 1
  where id = msg_id
  returning likes;
$$;

revoke all on function public.like_guestbook_message(uuid) from public;
grant execute on function public.like_guestbook_message(uuid) to anon, authenticated;

-- Supaya pesan baru & like muncul real-time di semua pengunjung.
do $$
begin
  alter publication supabase_realtime add table public.guestbook_messages;
exception when duplicate_object then null;
end $$;
