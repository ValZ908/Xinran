import { getSupabase } from "@/lib/supabase";

// ❤ untuk foto di galeri. Pakai Supabase kalau tersedia, kalau tidak
// disimpan di localStorage (mode demo).

const TABLE = "photo_likes";
const LOCAL_KEY = "xinran-photo-likes";
const LIKED_KEY = "xinran-photo-liked";

export type Counts = Record<string, number>;

function readLocal(key: string) {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function loadCounts(): Promise<Counts> {
  const sb = getSupabase();
  if (!sb) return readLocal(LOCAL_KEY) ?? {};
  const { data, error } = await sb.from(TABLE).select("photo_id, likes");
  if (error) throw error;
  return Object.fromEntries(data.map((r) => [r.photo_id, r.likes]));
}

export async function likePhoto(id: string): Promise<number | null> {
  const sb = getSupabase();
  if (!sb) {
    const counts: Counts = readLocal(LOCAL_KEY) ?? {};
    counts[id] = (counts[id] ?? 0) + 1;
    writeLocal(LOCAL_KEY, counts);
    return counts[id];
  }
  const { data, error } = await sb.rpc("like_photo", { p_id: id });
  if (error) throw error;
  return typeof data === "number" ? data : null;
}

export function subscribeCounts(onChange: (id: string, likes: number) => void) {
  const sb = getSupabase();
  if (!sb) return () => {};
  const channel = sb
    .channel("photo-likes")
    .on("postgres_changes", { event: "*", schema: "public", table: TABLE }, (p) => {
      const row = p.new as { photo_id?: string; likes?: number };
      if (row.photo_id && typeof row.likes === "number") onChange(row.photo_id, row.likes);
    })
    .subscribe();
  return () => {
    sb.removeChannel(channel);
  };
}

export const loadLikedPhotos = (): Set<string> => new Set(readLocal(LIKED_KEY) ?? []);
export const saveLikedPhotos = (ids: Set<string>) => writeLocal(LIKED_KEY, [...ids]);
