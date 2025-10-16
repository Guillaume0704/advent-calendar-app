import React, { useEffect, useState } from "react";

// --- Config ---
const ADVENT_YEAR = 2025; // target year for unlocking

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
    <div className="min-h-screen bg-white text-slate-800">
      <header className="p-6 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎄</span>
          <div>
            <h1 className="text-2xl font-bold">Calendrier de l'Avent {ADVENT_YEAR}</h1>
          </div>
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
        Fait avec ❤️ — installable comme app (PWA) et fonctionne hors ligne.
      </footer>
    </div>
  );
}

function DoorCard({ door, onOpen }) {
  const open = isDoorOpen(door.id);

  return (
    <button
      onClick={onOpen}
      className={[
        "relative aspect-square rounded-2xl p-3 border shadow-sm transition",
        open ? "bg-white hover:shadow-md" : "bg-slate-100 cursor-not-allowed",
      ].join(" ")}
      disabled={!open}
      title={open ? `Ouvrir le jour ${door.id}` : `Verrouillé jusqu'au ${door.id} décembre`}
      aria-label={open ? `Jour ${door.id} ouvrable` : `Jour ${door.id} verrouillé`}
    >
      <div className="w-full h-full flex flex-col items-center justify-center select-none">
        {open ? (
          <>
            <span className="text-4xl" aria-hidden>🎁</span>
            <span className="mt-2 text-sm text-slate-600">Jour {door.id}</span>
          </>
        ) : (
          <>
            <span className="text-4xl" aria-hidden>🔒</span>
            <span className="mt-2 text-sm text-slate-500">{door.id}</span>
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
