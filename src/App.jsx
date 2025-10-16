import React, { useEffect, useState } from "react";

// --- Config ---
const ADVENT_YEAR = 2025; // target year for unlocking
const RED_DAYS = new Set([5, 10, 15, 20, 24]);

// --- Time (Brussels) helpers ---
function nowBrussels() {
  const n = new Date();
  const s = n.toLocaleString("en-US", { timeZone: "Europe/Brussels" });
  return new Date(s);
}
function isDoorOpen(day, n = nowBrussels()) {
  const unlock = new Date(ADVENT_YEAR, 11, day, 0, 0, 0); // December
  return n >= unlock;
}

// --- Content (edit these upfront) ---
// Types: "text" | "image" | "video" | "link" | "voucher"
const DEFAULT_DOORS = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  title: `Jour ${i + 1}`,
  type: "text",
  payload: { text: "Surprise 🎄" },
}));

export default function App() {
  const [doors] = useState(DEFAULT_DOORS);
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-emerald-100 text-slate-800">
      <header className="p-8 max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            🌲 Calendrier de l'Avent {ADVENT_YEAR} 🌲
          </h1>
          <p className="mt-3 mx-auto max-w-2xl text-sm sm:text-base text-slate-600 bg-white/70 border rounded-2xl px-4 py-3">
            {"Comme je te l'avais déjà dit, tu auras un calendrier de l'avent 1 an sur 2. J'espère qu'il te plaîra et je te souhaite un Joyeux Noël mon amour <3 "}
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-2">
          {doors.map((d) => (
            <DoorCard key={d.id} door={d} onOpen={() => setSelected(d)} />
          ))}
        </div>

        {selected && (
          <DoorModal door={selected} onClose={() => setSelected(null)} />
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-8 text-center text-xs text-slate-500">
        © Copyright 2025 Guillaume Van Raemdonck, Inc. All rights reserved.
      </footer>
    </div>
  );
}

function DoorCard({ door, onOpen }) {
  // Make day 1 available for preview; others follow date
  const open = door.id === 1 || isDoorOpen(door.id);
  const isRed = RED_DAYS.has(door.id);

  const base = [
    "relative aspect-square rounded-2xl p-3 border shadow-sm transition",
    open ? "hover:shadow-md" : "cursor-not-allowed",
  ];

  const colorClass = open
    ? (isRed ? "bg-red-100 border-red-200" : "bg-white border-slate-200")
    : (isRed ? "bg-red-200 border-red-300" : "bg-slate-100 border-slate-200");

  return (
    <button
      onClick={onOpen}
      className={[...base, colorClass].join(" ")}
      disabled={!open}
      title={open ? `Ouvrir le jour ${door.id}` : `Verrouillé jusqu'au ${door.id} décembre`}
      aria-label={open ? `Jour ${door.id} ouvrable` : `Jour ${door.id} verrouillé`}
    >
      <div className="w-full h-full flex flex-col items-center justify-center select-none">
        {open ? (
          <>
            <span className="text-4xl" aria-hidden>🎁</span>
            <span className="mt-2 text-sm text-slate-700">Jour {door.id}</span>
          </>
        ) : (
          <>
            <span className="text-4xl" aria-hidden>🔒</span>
            <span className="mt-2 text-sm text-slate-600">{door.id}</span>
          </>
        )}
      </div>
    </button>
  );
}

function DoorModal({ door, onClose }) {
  useEffect(() => {
    // subtle confetti on open (emoji-based, zero deps)
    tinyConfetti();
  }, [door?.id]);

  const { type, payload } = door;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-lg w-full rounded-2xl bg-white shadow-xl border" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Jour {door.id}</h3>
            <p className="text-xs text-slate-500">{door.title}</p>
          </div>
          <button className="px-3 py-1 text-sm bg-slate-100 rounded-xl" onClick={onClose}>Fermer</button>
        </div>

        <div className="p-5">
          {type === "text" && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{payload.text || "(Vide)"}</p>
          )}
          {type === "image" && payload.imageUrl && (
            <img src={payload.imageUrl} alt="Surprise" className="w-full rounded-xl border" />
          )}
          {type === "video" && payload.videoUrl && (
            <video src={payload.videoUrl} controls playsInline className="w-full rounded-xl border" />
          )}
          {type === "link" && payload.linkUrl && (
            <a href={payload.linkUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white text-sm">
              Ouvrir le lien 🔗
            </a>
          )}
          {type === "voucher" && (
            <div className="rounded-xl border p-3 bg-emerald-50">
              <div className="text-xs uppercase text-emerald-700">Bon cadeau</div>
              <div className="text-lg font-bold">{payload.voucher || "(à définir)"}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function tinyConfetti() {
  const root = document.body;
  const n = 14;
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.textContent = ['✨','🎉','🎊'][Math.floor(Math.random()*3)];
    el.style.position = 'fixed';
    el.style.zIndex = '9999';
    el.style.left = (window.innerWidth / 2) + (Math.random()*120 - 60) + 'px';
    el.style.top = (window.innerHeight / 2) + (Math.random()*40 - 20) + 'px';
    el.style.fontSize = (16 + Math.random()*12) + 'px';
    el.style.transition = 'transform 900ms ease-out, opacity 900ms ease-out';
    el.style.willChange = 'transform, opacity';
    root.appendChild(el);
    requestAnimationFrame(() => {
      const dx = (Math.random() - 0.5) * 260;
      const dy = 180 + Math.random() * 200;
      const rot = (Math.random() - 0.5) * 240;
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      el.style.opacity = '0';
    });
    setTimeout(() => root.removeChild(el), 1000);
  }
}
