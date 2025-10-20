import React, { useEffect, useMemo, useRef, useState } from "react";

/* ==============================
   Config
============================== */
const ADVENT_YEAR = 2025;
const RED_DAYS = new Set([5, 10, 15, 20, 24]);

// Answers are case/diacritics-insensitive
const QUESTIONS = {
  1:  { q: "Quel est le nom du bar où l'on a eu notre premier date?", a: "La Cabane" },
  2:  { q: "Comment s'appellent nos doudous?", a: "Kawaii Ne" },
  3:  { q: "Que dis-tu sur ta meilleure photo?", a: "Mug all day long" },
  4:  { q: "Où a t'on fêté nos 1 mois?", a: "Walibi" },
  5:  { q: "Qui nage le mieux?", a: "Guillaume" },
  6:  { q: "Combien de temps pour un oeuf à la coq?", a: "5 minutes" },
  7:  { q: "Quelle est ma bière préférée", a: "Paix Dieu" },
  8:  { q: "Quel va (peut-être) être le nom de notre future fille?", a: "Léo" },
  9:  { q: "Quel va (peut-être) être le nom de notre futur garçon?", a: "Léo 2" },
  10: { q: "Quel serait ton totem?", a: "Tanuki" },
  11: { q: "Quel personnage animé to représente?", a: "Ponyo" },
  12: { q: "Qui se gare le mieux?", a: "Guillaume" },
  13: { q: "Quelle est la marque de ta bière préférée?", a: "St Hubertus" },
  14: { q: "Qu'est-ce que j'ai reçu comme cadeau à la soirée EASI?", a: "Barre son" },
  15: { q: "Qui a la plus belle manette PS5?", a: "Guillaume" },
  16: { q: "Quelle sera la race de notre futur chat?", a: "British Short Hair" },
  17: { q: "Quel est le burger le plus nul?", a: "Smash Burger" },
  18: { q: "Qu'est-ce qui est mieux qu'un coucher de soleil?", a: "Deux couchers de soleil" },
  19: { q: "Quel est le modèle de mon téléphone?", a: "iPhone 17Pro 256GB Bleu Intense" },
  20: { q: "Quelle était la meilleure activité de Corée?", a: "Machines à pince" },
  21: { q: "Qu'est-ce qui est plus mignon qu'une loutre?", a: "Guillaume" },
  22: { q: "Sur 10, seum à combien de l'Omakase?", a: "9" },
  23: { q: "Qui est la plus belle blonde que je connaisse?", a: "Elline" },
  24: { q: "Avec qui est-ce que je souhaite finir ma vie?", a: "Elline" },
};

/* ==============================
   Helpers
============================== */
function nowBrussels() {
  const n = new Date();
  const s = n.toLocaleString("en-US", { timeZone: "Europe/Brussels" });
  return new Date(s);
}
function isDoorOpenByDate(day, n = nowBrussels()) {
  const unlock = new Date(ADVENT_YEAR, 11, day, 0, 0, 0); // December
  return n >= unlock;
}
function isAvailable(day) {
  // Keep day 1 available for preview; remove this later if you want strict dates
  if (day === 1) return true;
  return isDoorOpenByDate(day);
}
// diacritics-insensitive, case-insensitive comparison
function normalize(s) {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/* ==============================
   Content (edit payloads upfront if you want)
============================== */
const DEFAULT_DOORS = [
  { id: 1, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 2, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 3, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 4, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 5, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 6, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 7, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 8, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 9, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 10, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 11, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 12, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 13, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 14, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 15, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 16, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 17, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 18, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 19, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 20, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 21, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 22, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 23, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  { id: 24, title: "Petit mot 💌", subtitle: "Joyeux 1er décembre ! 💚", type: "text", payload: { text: "Joyeux 1er décembre ! 💚" } },
  ];

/* ==============================
   App
============================== */
export default function App() {
  const [doors] = useState(DEFAULT_DOORS);
  const [selected, setSelected] = useState(null);
  const [quizDay, setQuizDay] = useState(null); // { day, door }

  // Lightweight snowfall (iPhone-friendly)
  useEffect(() => {
    const prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    let running = true;
    const mkFlake = () => {
      if (!running) return;
      const el = document.createElement("div");
      el.textContent = "❄️";
      el.style.position = "fixed";
      el.style.left = Math.random() * 100 + "vw";
      el.style.top = "-5vh";
      el.style.opacity = "0";
      el.style.fontSize = 10 + Math.random() * 12 + "px";
      el.style.transition = "transform 10s linear, opacity 2s ease";
      el.style.transform = "translateY(0px) translateX(0px)";
      el.style.pointerEvents = "none";
      el.style.zIndex = "1";
      document.body.appendChild(el);
      requestAnimationFrame(() => {
        el.style.opacity = "0.9";
        const driftX = (Math.random() - 0.5) * 60;
        el.style.transform =
          "translateY(" + (window.innerHeight + 80) + "px) translateX(" + driftX + "px)";
      });
      setTimeout(() => {
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 1500);
      }, 9500);
    };
    const interval = setInterval(mkFlake, 600);
    for (let i = 0; i < 10; i++) mkFlake();
    return () => {
      running = false;
      clearInterval(interval);
    };
  }, []);

  const requestOpen = (door) => {
    if (!isAvailable(door.id)) return;
    const qa = QUESTIONS[door.id];
    if (qa) setQuizDay({ day: door.id, door });
    else setSelected(door);
  };

  return (
    <>
      <StyleInjector />
      <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-emerald-100 text-slate-800">
        <header className="p-8 max-w-5xl mx-auto">
          <div className="text-center">
            <h1 className="text-[20px] sm:text-2xl font-bold tracking-tight whitespace-nowrap">
              🌲 Calendrier de l'Avent {ADVENT_YEAR} 🌲
            </h1>
            <div className="mt-3 relative overflow-visible">
              <SleighBanner text={
                "Comme je te l'avais déjà dit, tu auras un calendrier de l'avent 1 an sur 2. J'espère qu'il te plaîra et je te souhaite un Joyeux Noël mon amour ❤️"
              }/>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-2">
            {doors.map((d) => (
              <DoorCard key={d.id} door={d} onOpen={() => requestOpen(d)} />
            ))}
          </div>

          {selected && <DoorModal door={selected} onClose={() => setSelected(null)} />}

          {quizDay && (
            <QuestionModal
              qa={QUESTIONS[quizDay.day]}
              day={quizDay.day}
              onCancel={() => setQuizDay(null)}
              onSuccess={() => {
                setQuizDay(null);
                setSelected(quizDay.door);
                playSuccess();
              }}
              onFail={() => {
                playError();
              }}
            />
          )}
        </main>

        <footer className="max-w-5xl mx-auto px-6 py-8 text-center text-xs text-slate-500">
          © Copyright 2025 Guillaume Van Raemdonck, Inc. All rights reserved.
        </footer>
      </div>
    </>
  );
}

/* ==============================
   Components
============================== */
function DoorCard({ door, onOpen }) {
  const open = isAvailable(door.id);
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
      title={open ? "Ouvrir le jour " + door.id : "Verrouillé jusqu'au " + door.id + " décembre"}
      aria-label={open ? "Jour " + door.id + " ouvrable" : "Jour " + door.id + " verrouillé"}
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
    tinyConfetti();
    playSuccess();
  }, [door.id]);

  const { type, payload } = door;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-lg w-full rounded-2xl bg-white shadow-xl border" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <div>
          <h3 className="text-lg font-semibold">{door.title || `Jour ${door.id}`}</h3>
          {door.subtitle && <p className="text-xs text-slate-500">{door.subtitle}</p>}
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

// Quiz modal (shake + random error messages)
function QuestionModal({ qa, day, onCancel, onSuccess, onFail }) {
  const [answer, setAnswer] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const messages = useMemo(() => ["nope", "peut mieux faire", "nine", "iie", "bouhhhh"], []);
  const pickMsg = () => messages[Math.floor(Math.random() * messages.length)];

  const check = () => {
    const ok = normalize(answer) === normalize(qa.a);
    if (ok) {
      setErrorMsg("");
      onSuccess();
    } else {
      setErrorMsg(pickMsg());
      setShaking(true);
      setTimeout(() => setShaking(false), 350);
      onFail();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className={["max-w-md w-full rounded-2xl bg-white shadow-xl border transition",
          shaking ? "animate-shake border-red-400" : "border-slate-200"].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <h3 className="text-base font-semibold">Question du jour {day}</h3>
        </div>
        <div className="p-4 space-y-3">
          {errorMsg ? <div className="text-center text-red-600 font-semibold">{errorMsg}</div> : null}
          <p className="text-sm">{qa.q}</p>
          <input
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") check(); }}
            placeholder="Ta réponse"
            className="w-full px-3 py-2 rounded-xl border bg-white"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onCancel} className="px-3 py-2 rounded-xl bg-slate-100">Annuler</button>
            <button onClick={check} className="px-3 py-2 rounded-xl bg-emerald-600 text-white">Valider</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================
   Tiny effects + small CSS
============================== */
function tinyConfetti() {
  const root = document.body;
  const n = 14;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("div");
    const picks = ["✨", "🎉", "🎊"];
    el.textContent = picks[Math.floor(Math.random() * picks.length)];
    el.style.position = "fixed";
    el.style.zIndex = "9999";
    el.style.left = window.innerWidth / 2 + (Math.random() * 120 - 60) + "px";
    el.style.top = window.innerHeight / 2 + (Math.random() * 40 - 20) + "px";
    el.style.fontSize = 16 + Math.random() * 12 + "px";
    el.style.transition = "transform 900ms ease-out, opacity 900ms ease-out";
    el.style.willChange = "transform, opacity";
    root.appendChild(el);
    requestAnimationFrame(() => {
      const dx = (Math.random() - 0.5) * 260;
      const dy = 180 + Math.random() * 200;
      const rot = (Math.random() - 0.5) * 240;
      el.style.transform = "translate(" + dx + "px, " + dy + "px) rotate(" + rot + "deg)";
      el.style.opacity = "0";
    });
    setTimeout(() => root.removeChild(el), 1000);
  }
}

// Inject minimal CSS for shake + sleigh animation
function StyleInjector() {
  return (
    <style>{`
      @keyframes shake {
        0%,100%{transform:translateX(0)}
        20%{transform:translateX(-6px)}
        40%{transform:translateX(6px)}
        60%{transform:translateX(-4px)}
        80%{transform:translateX(4px)}
      }
      .animate-shake { animation: shake 300ms ease-in-out; }
      @keyframes fly { 0%{transform:translateX(110%)} 100%{transform:translateX(-110%)} }
      .sleigh-fly { animation: fly 18s linear infinite; }
    `}</style>
  );
}

function SleighBanner({ text }) {
  return (
    <div className="relative h-14 sm:h-16 overflow-visible flex items-center justify-center">
      <div className="sleigh-fly absolute right-0 flex items-center gap-3">
        <span className="text-3xl sm:text-4xl leading-none mt-0.5" aria-hidden>🦌</span>
        <div className="bg-white/85 border border-emerald-200 rounded-lg px-3 py-1 shadow-sm text-emerald-700 font-semibold whitespace-nowrap">
          {text}
        </div>
      </div>
    </div>
  );
}

/* ==============================
   Sounds (no assets; WebAudio)
============================== */
function playTone(opts) {
  const cfg = Object.assign({ freq: 880, time: 0.2, type: "sine", volume: 0.08 }, opts || {});
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = cfg.type;
    osc.frequency.value = cfg.freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = cfg.volume;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + cfg.time);
    osc.stop(ctx.currentTime + cfg.time);
  } catch (e) {
    // ignore audio errors (Safari permissions etc.)
  }
}
function playSuccess() {
  playTone({ freq: 880, time: 0.12 });
  setTimeout(() => playTone({ freq: 1320, time: 0.12 }), 130);
}
function playError() {
  playTone({ freq: 220, time: 0.18, type: "square" });
  setTimeout(() => playTone({ freq: 180, time: 0.18, type: "square" }), 160);
}
