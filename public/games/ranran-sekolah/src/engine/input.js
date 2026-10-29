import { toGame } from "./screen.js";

const KEYS = {
  ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down",
  ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right",
  KeyE: "act", Enter: "act", Escape: "pause",
  Backquote: "debug", // panel debug variabel tersembunyi (untuk pengembangan)
};
const held = new Set(), hit = new Set();
export const pointer = { x: -1, y: -1, moved: false }; // posisi mouse dalam piksel game

addEventListener("keydown", e => {
  const a = KEYS[e.code];
  if (!a) return;
  e.preventDefault();
  if (!e.repeat) hit.add(a);
  held.add(a);
});
addEventListener("keyup", e => { const a = KEYS[e.code]; if (a) held.delete(a); });
addEventListener("blur", () => held.clear());
addEventListener("mousemove", e => Object.assign(pointer, toGame(e.clientX, e.clientY), { moved: true }));
addEventListener("mousedown", e => {
  if (e.button !== 0) return;
  Object.assign(pointer, toGame(e.clientX, e.clientY));
  hit.add("click");
});

export const down = a => held.has(a);
export const pressed = a => hit.has(a); // hanya true di frame tombol ditekan
// E / Enter / klik kiri
export const confirm = () => hit.has("act") || hit.has("click");
export const endFrame = () => { hit.clear(); pointer.moved = false; };
