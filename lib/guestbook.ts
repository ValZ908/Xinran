import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ENABLED, getSupabase } from "@/lib/supabase";

export const NOTE_COLORS = {
  sun: { swatch: "#fde68a", card: "bg-amber-200 text-amber-950" },
  rose: { swatch: "#fecdd3", card: "bg-rose-200 text-rose-950" },
  sky: { swatch: "#bae6fd", card: "bg-sky-200 text-sky-950" },
  mint: { swatch: "#a7f3d0", card: "bg-emerald-200 text-emerald-950" },
  lilac: { swatch: "#ddd6fe", card: "bg-violet-200 text-violet-950" },
} as const;

export type NoteColor = keyof typeof NOTE_COLORS;

export const STICKERS = ["☀️", "🌸", "💖", "⭐", "🍊", "🎤", "🌈", "🐰"] as const;

export const NAME_MAX = 24;
export const MESSAGE_MAX = 200;

export type Note = {
  id: string;
  name: string;
  message: string;
  color: NoteColor;
  sticker: string;
  likes: number;
  created_at: string;
};

export type NewNote = Pick<Note, "name" | "message" | "color" | "sticker">;

export type GuestbookBackend = {
  /** true kalau tersambung ke Supabase, false kalau mode demo (localStorage). */
  live: boolean;
  list(): Promise<Note[]>;
  add(note: NewNote): Promise<Note>;
  like(id: string): Promise<number | null>;
  /** Dipanggil setiap ada pesan baru / jumlah like berubah dari orang lain. */
  subscribe(onChange: (note: Note) => void): () => void;
};

const TABLE = "guestbook_messages";

function supabaseBackend(sb: SupabaseClient): GuestbookBackend {
  return {
    live: true,
    async list() {
      const { data, error } = await sb
        .from(TABLE)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as Note[];
    },
    async add(note) {
      const { data, error } = await sb.from(TABLE).insert(note).select().single();
      if (error) throw error;
      return data as Note;
    },
    async like(id) {
      const { data, error } = await sb.rpc("like_guestbook_message", { msg_id: id });
      if (error) throw error;
      return typeof data === "number" ? data : null;
    },
    subscribe(onChange) {
      const channel = sb
        .channel("guestbook")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: TABLE },
          (payload) => {
            if (payload.new && "id" in payload.new) onChange(payload.new as Note);
          },
        )
        .subscribe();
      return () => {
        sb.removeChannel(channel);
      };
    },
  };
}

// Mode demo: disimpan di localStorage. Tab lain di browser yang sama ikut
// ter-update lewat event "storage".
function localBackend(): GuestbookBackend {
  const KEY = "xinran-guestbook";
  const load = (): Note[] => {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {
      return [];
    }
  };
  const save = (notes: Note[]) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(notes.slice(0, 100)));
    } catch {}
  };

  return {
    live: false,
    async list() {
      return load();
    },
    async add(input) {
      const note: Note = {
        ...input,
        id: crypto.randomUUID(),
        likes: 0,
        created_at: new Date().toISOString(),
      };
      save([note, ...load()]);
      return note;
    },
    async like(id) {
      const notes = load();
      const note = notes.find((n) => n.id === id);
      if (!note) return null;
      note.likes += 1;
      save(notes);
      return note.likes;
    },
    subscribe(onChange) {
      const onStorage = (e: StorageEvent) => {
        if (e.key !== KEY) return;
        for (const note of load()) onChange(note);
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    },
  };
}

export const GUESTBOOK_LIVE = SUPABASE_ENABLED;

let backend: GuestbookBackend | null = null;

export function getGuestbook(): GuestbookBackend {
  const sb = getSupabase();
  backend ??= sb ? supabaseBackend(sb) : localBackend();
  return backend;
}

// Ingat pesan mana yang sudah di-like di browser ini (1 like per pesan).
const LIKED_KEY = "xinran-guestbook-liked";

export function loadLiked(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export function saveLiked(ids: Set<string>) {
  try {
    localStorage.setItem(LIKED_KEY, JSON.stringify([...ids]));
  } catch {}
}
