// Variabel tersembunyi: tidak pernah ditampilkan ke pemain (kecuali panel debug).
export const vars = { trust: 0, courage: 0 };
export const flags = new Set();
export const seen = new Set(); // scene yang sudah pernah diputar
export const clock = { day: 1, slot: 0 }; // slot: indeks di SLOTS (data/schedule.js)

export function reset() {
  vars.trust = 0; vars.courage = 0;
  flags.clear(); seen.clear();
  clock.day = 1; clock.slot = 0;
}

// Muat dari save (sudah divalidasi oleh save.js)
export function restore(g) {
  reset();
  Object.assign(vars, g.vars);
  g.flags.forEach(f => flags.add(f));
  g.seen.forEach(s => seen.add(s));
  Object.assign(clock, g.clock);
}

// Terapkan efek dari baris cerita atau opsi pilihan: { add: { trust: 1 }, set: ["flag"] }
export function apply({ add = {}, set = [] }) {
  for (const [k, v] of Object.entries(add)) vars[k] = (vars[k] ?? 0) + v;
  for (const f of set) flags.add(f);
}

// Syarat: { min: {trust: 3}, max: {courage: 0}, flags: [...], notFlags: [...], seen: [...], notSeen: [...] }
export function check(w = {}) {
  const v = k => vars[k] ?? 0;
  return Object.entries(w.min ?? {}).every(([k, n]) => v(k) >= n)
    && Object.entries(w.max ?? {}).every(([k, n]) => v(k) <= n)
    && (w.flags ?? []).every(f => flags.has(f))
    && (w.notFlags ?? []).every(f => !flags.has(f))
    && (w.seen ?? []).every(s => seen.has(s))
    && (w.notSeen ?? []).every(s => !seen.has(s));
}
