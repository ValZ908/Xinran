"use client";

import Link from "next/link";
import { useState } from "react";

const OPTIONS = [
  { label: "Main Sekarang", href: "#games" },
  { label: "Buka Fan Site", href: "/fansite" },
];

/** Dua tombol hero sebagai toggle liquid glass: gelembungnya ikut ke pilihan yang disorot. */
export default function HeroSwitch() {
  const [active, setActive] = useState(0);

  return (
    <div className="glass relative mt-10 inline-grid grid-cols-2 rounded-full p-1.5" onMouseLeave={() => setActive(0)}>
      <span
        aria-hidden
        className="glass-thumb absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full transition-transform duration-500 ease-[cubic-bezier(.3,1.4,.4,1)]"
        style={{ transform: `translateX(${active * 100}%)` }}
      />
      {OPTIONS.map((o, i) => (
        <Link
          key={o.href}
          href={o.href}
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          className={`relative rounded-full px-5 py-3 text-sm font-semibold transition-colors sm:px-8 sm:text-base ${
            active === i ? "text-white pink:text-rose-700" : "text-zinc-400 pink:text-rose-900/60"
          }`}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}
