-- ❤ foto galeri untuk xinran-app.
-- Jalankan sekali di Supabase Dashboard → SQL Editor (setelah guestbook.sql).

create table if not exists public.photo_likes (
  photo_id text primary key check (char_length(photo_id) between 1 and 64),
  likes integer not null default 0 check (likes >= 0)
);

alter table public.photo_likes enable row level security;

-- Semua orang boleh membaca. Menulis hanya lewat fungsi di bawah (+1 saja).
drop policy if exists "photo likes read" on public.photo_likes;
create policy "photo likes read" on public.photo_likes
  for select to anon, authenticated using (true);

create or replace function public.like_photo(p_id text)
returns integer
language sql
security definer
set search_path = public
as $$
  insert into public.photo_likes (photo_id, likes)
  values (p_id, 1)
  on conflict (photo_id) do update set likes = photo_likes.likes + 1
  returning likes;
$$;

revoke all on function public.like_photo(text) from public;
grant execute on function public.like_photo(text) to anon, authenticated;

do $$
begin
  alter publication supabase_realtime add table public.photo_likes;
exception when duplicate_object then null;
end $$;
