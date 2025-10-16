import React, { useMemo, useState, useEffect } from "react";
// If you want to wire Supabase later, uncomment the following and set env vars
// import { createClient } from "@supabase/supabase-js";
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// --- Helpers ---
function nowBrussels() {
  const n = new Date();
  const s = n.toLocaleString("en-US", { timeZone: "Europe/Brussels" });
  return new Date(s);
}
function isDoorOpen(day, n = nowBrussels()) {
  const y = n.getFullYear();
  const unlock = new Date(y, 11, day, 0, 0, 0); // December (11)
  return n >= unlock;
}

const DEFAULT_DOORS = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  title: `Jour ${i + 1}`,
  type: "text", // text | image | video | link | voucher
  payload: {
    text: "Une petite surprise arrive ici ✨",
    imageUrl: "",
    videoUrl: "",
    linkUrl: "",
    voucher: "",
  },
}));

function loadDoors() {
  try {
    const raw = localStorage.getItem("advent_doors");
    if (!raw) return DEFAULT_DOORS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 24) return DEFAULT_DOORS;
    return parsed;
  } catch {
    return DEFAULT_DOORS;
  }
}
function saveDoors(doors) {
  localStorage.setItem("advent_doors", JSON.stringify(doors));
}

function useDoors() {
  const [doors, setDoors] = useState(() => loadDoors());
  useEffect(() => saveDoors(doors), [doors]);
  return [doors, setDoors];
}

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

// --- Components ---
export default function App() {
  const [doors, setDoors] = useDoors();
  const [selected, setSelected] = useState(null); // door object or null
  const [admin, setAdmin] = useState(false);
  const [userName, setUserName] = useState(() => localStorage.getItem("advent_user") || "");

  useEffect(() => {
    localStorage.setItem("advent_user", userName);
  }, [userName]);

  // Simple admin unlock: type "joyeuxnoel" in the name field
  useEffect(() => {
    if (userName.toLowerCase().trim() === "joyeuxnoel") setAdmin(true);
  }, [userName]);

  const today = nowBrussels();
  const year = today.getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-emerald-50 text-slate-800">
      <header className="p-6 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎄</span>
          <div>
            <h1 className="text-2xl font-bold">Calendrier de l'Avent {year}</h1>
            <p className="text-sm text-slate-500">Fuseau horaire : Europe/Brussels</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            placeholder={"Prénom de ta chérie"}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="px-3 py-2 rounded-xl border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <button
            onClick={() => setAdmin((v) => !v)}
            className={classNames(
              "px-3 py-2 rounded-xl text-sm font-medium",
              admin ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
            )}
            title="Basculer le mode admin"
          >
            {admin ? "Admin ON" : "Admin OFF"}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        <IntroCard name={userName} />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
          {doors.map((d) => (
            <DoorCard key={d.id} door={d} onOpen={() => setSelected(d)} admin={admin} />
          ))}
        </div>

        {selected && (
          <DoorModal
            door={selected}
            onClose={() => setSelected(null)}
            admin={admin}
            onSave={(updated) => {
              setDoors((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
              setSelected(updated);
            }}
          />
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-8 text-center text-xs text-slate-500">
        Fait avec ❤️ pour toi — 
        <span className="inline-block ml-1">{new Intl.DateTimeFormat("fr-BE", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Brussels" }).format(nowBrussels())}</span>
      </footer>
    </div>
  );
}

function IntroCard({ name }) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur border shadow-sm p-5">
      <h2 className="text-lg font-semibold">Coucou {name ? name + " ✨" : "toi ✨"}</h2>
      <p className="text-sm text-slate-600 mt-1">
        Chaque jour de décembre, ouvre une case pour découvrir une petite surprise. Les cases se débloquent
        automatiquement à minuit (heure de Bruxelles). Les futures surprises sont bien cachées 👀
      </p>
    </div>
  );
}

function DoorCard({ door, onOpen, admin }) {
  const open = isDoorOpen(door.id);
  return (
    <button
      onClick={onOpen}
      className={classNames(
        "relative aspect-square rounded-2xl p-3 border shadow-sm transition hover:shadow-md",
        open ? "bg-white" : "bg-slate-100 cursor-pointer",
      )}
      disabled={!open && !admin}
      title={open ? `Ouvrir le jour ${door.id}` : `Verrouillé jusqu'au ${door.id} décembre`}
    >
      <div className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
        {open ? "Ouvert" : "Verrouillé"}
      </div>
      <div className="w-full h-full flex flex-col items-center justify-center select-none">
        <span className="text-4xl font-black tracking-tight">{door.id}</span>
        <span className="mt-2 text-sm text-slate-500">{door.title}</span>
      </div>
      {!open && !admin && (
        <span className="absolute inset-0 flex items-center justify-center text-4xl">🔒</span>
      )}
    </button>
  );
}

function DoorModal({ door, onClose, admin, onSave }) {
  const [draft, setDraft] = useState(door);
  const open = isDoorOpen(door.id);

  useEffect(() => setDraft(door), [door]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-lg w-full rounded-2xl bg-white shadow-xl border" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Jour {door.id}</h3>
            <p className="text-xs text-slate-500">{open ? "Débloqué" : "Verrouillé (admin peut prévisualiser)"}</p>
          </div>
          <button className="px-3 py-1 text-sm bg-slate-100 rounded-xl" onClick={onClose}>Fermer</button>
        </div>

        <div className="p-4">
          {!open && !admin ? (
            <div className="text-center py-10 text-slate-500">
              🔒 Patience… Reviens le {door.id} décembre à partir de minuit (Bruxelles).
            </div>
          ) : (
            <RevealView door={draft} />
          )}
        </div>

        {admin && (
          <div className="p-4 border-t bg-slate-50">
            <AdminEditor draft={draft} setDraft={setDraft} onSave={() => onSave(draft)} />
          </div>
        )}
      </div>
    </div>
  );
}

function RevealView({ door }) {
  const { type, payload } = door;
  return (
    <div className="space-y-3">
      <h4 className="text-base font-semibold">{door.title}</h4>
      {type === "text" && (
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{payload.text || "(Vide)"}</p>
      )}
      {type === "image" && payload.imageUrl && (
        <img src={payload.imageUrl} alt="Surprise" className="w-full rounded-xl border" />
      )}
      {type === "video" && payload.videoUrl && (
        <video src={payload.videoUrl} controls className="w-full rounded-xl border" />)
      }
      {type === "link" && payload.linkUrl && (
        <a
          href={payload.linkUrl}
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white text-sm"
        >
          Ouvrir le lien 🔗
        </a>
      )}
      {type === "voucher" && (
        <div className="rounded-xl border p-3 bg-amber-50">
          <div className="text-xs uppercase text-amber-700">Bon cadeau</div>
          <div className="text-lg font-bold">{payload.voucher || "(à définir)"}</div>
        </div>
      )}
    </div>
  );
}

function AdminEditor({ draft, setDraft, onSave }) {
  const setPayload = (k, v) => setDraft((d) => ({ ...d, payload: { ...d.payload, [k]: v } }));
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="block text-slate-600 mb-1">Titre</span>
          <input
            className="w-full px-3 py-2 rounded-xl border bg-white"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </label>
        <label className="text-sm">
          <span className="block text-slate-600 mb-1">Type</span>
          <select
            className="w-full px-3 py-2 rounded-xl border bg-white"
            value={draft.type}
            onChange={(e) => setDraft({ ...draft, type: e.target.value })}
          >
            <option value="text">Texte</option>
            <option value="image">Image (URL)</option>
            <option value="video">Vidéo (URL)</option>
            <option value="link">Lien</option>
            <option value="voucher">Bon</option>
          </select>
        </label>
      </div>

      {draft.type === "text" && (
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Texte</span>
          <textarea
            rows={4}
            className="w-full px-3 py-2 rounded-xl border bg-white"
            value={draft.payload.text}
            onChange={(e) => setPayload("text", e.target.value)}
          />
        </label>
      )}

      {draft.type === "image" && (
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Image URL</span>
          <input
            className="w-full px-3 py-2 rounded-xl border bg-white"
            value={draft.payload.imageUrl}
            onChange={(e) => setPayload("imageUrl", e.target.value)}
            placeholder="https://…"
          />
        </label>
      )}

      {draft.type === "video" && (
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Vidéo URL</span>
          <input
            className="w-full px-3 py-2 rounded-xl border bg-white"
            value={draft.payload.videoUrl}
            onChange={(e) => setPayload("videoUrl", e.target.value)}
            placeholder="https://…"
          />
        </label>
      )}

      {draft.type === "link" && (
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Lien URL</span>
          <input
            className="w-full px-3 py-2 rounded-xl border bg-white"
            value={draft.payload.linkUrl}
            onChange={(e) => setPayload("linkUrl", e.target.value)}
            placeholder="https://…"
          />
        </label>
      )}

      {draft.type === "voucher" && (
        <label className="text-sm block">
          <span className="block text-slate-600 mb-1">Texte du bon</span>
          <input
            className="w-full px-3 py-2 rounded-xl border bg-white"
            value={draft.payload.voucher}
            onChange={(e) => setPayload("voucher", e.target.value)}
            placeholder="Ex: 1 massage de 30 min 💆‍♀️"
          />
        </label>
      )}

      <div className="flex items-center justify-end gap-2">
        <button className="px-4 py-2 rounded-xl bg-slate-100" onClick={onSave}>Enregistrer</button>
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer text-sm text-slate-600">Exporter / Importer</summary>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-sm"
            onClick={() => {
              const data = localStorage.getItem("advent_doors") || "";
              navigator.clipboard.writeText(data);
              alert("Copié dans le presse-papiers ✅");
            }}
          >
            Copier le JSON
          </button>
          <button
            className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm"
            onClick={() => {
              if (!confirm("Réinitialiser toutes les cases ?")) return;
              localStorage.removeItem("advent_doors");
              location.reload();
            }}
          >
            Réinitialiser (24 cases par défaut)
          </button>
        </div>
      </details>

      <p className="text-[11px] text-slate-500 mt-2">
        Astuce: mets "joyeuxnoel" comme nom en haut pour activer l'admin (ou clique Admin OFF/ON). Pour une vraie sécurité,
        connecte une base (Supabase) et sers les contenus du jour à l'appel.
      </p>
    </div>
  );
}
