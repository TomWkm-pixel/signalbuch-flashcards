"use client";

import { useState, useEffect } from "react";
import type { SignalDeck } from "@/lib/types";
import { SIGNAL_DECKS } from "@/lib/data/signals";
import StudySession from "@/components/StudySession";
import { loadProgress, getDeckStats, loadStreak, type DeckStats, type StreakData } from "@/lib/sm2";

const HELP_KEY = "signalbuch_help_seen";

// Virtuelles "Alle Decks"-Deck — alle Karten gemischt
const ALL_DECK: SignalDeck = {
  id: "alle",
  name: "Alle Signale",
  description: "Alle 58 Signalkarten aus allen Decks gemischt",
  cards: SIGNAL_DECKS.flatMap((d) => d.cards),
};

function HelpSection() {
  const [open, setOpen] = useState(false);

  // Beim ersten Besuch automatisch aufklappen
  useEffect(() => {
    const seen = localStorage.getItem(HELP_KEY);
    if (!seen) setOpen(true);
  }, []);

  const close = () => {
    setOpen(false);
    localStorage.setItem(HELP_KEY, "1");
  };

  return (
    <div className="card mb-4" style={{ borderColor: open ? "var(--accent)" : "var(--border)" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 text-left"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
          ❓ Wie funktioniert die App?
        </span>
        <span className="muted text-xs">{open ? "▲ Schließen" : "▼ Anzeigen"}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-4 text-sm" style={{ color: "var(--text)" }}>

          <div>
            <p className="font-semibold mb-1">🃏 Lernkarten</p>
            <p className="muted">
              Wähle ein Deck aus — zum Beispiel „Hauptsignale". Du siehst das Signalbild.
              Drücke auf die Karte (oder die <kbd className="px-1 rounded text-xs" style={{ border: "1px solid var(--border)" }}>Leertaste</kbd>),
              um die Bedeutung aufzudecken. Dann bewertest du, wie gut du es wusstest.
            </p>
          </div>

          <div>
            <p className="font-semibold mb-1">📊 Bewertung</p>
            <ul className="muted space-y-1 ml-2">
              <li><span className="text-red-400 font-semibold">🔁 Nochmal</span> — Nicht gewusst. Karte kommt morgen wieder.</li>
              <li><span className="text-orange-400 font-semibold">😓 Schwer</span> — Mit Mühe erinnert. Kommt bald wieder.</li>
              <li><span className="text-emerald-400 font-semibold">✓ Gut</span> — Richtig, aber nicht sofort. Kommt in einigen Tagen.</li>
              <li><span style={{ color: "var(--accent)" }} className="font-semibold">⚡ Einfach</span> — Sofort gewusst! Kommt erst in Wochen wieder.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-1">🧠 Spaced Repetition</p>
            <p className="muted">
              Die App merkt sich, welche Signale du schon gut kennst und welche nicht.
              Schwierige Karten siehst du öfter, einfache seltener. So lernst du effizienter —
              genau wie mit Karteikärtchen, nur viel smarter.
            </p>
          </div>

          <div>
            <p className="font-semibold mb-1">🔥 Streak</p>
            <p className="muted">
              Lernst du jeden Tag, wächst dein Streak. Die Zahl oben zeigt, wie viele Tage
              du in Folge gelernt hast. Versuche, deinen Rekord zu brechen!
            </p>
          </div>

          <div>
            <p className="font-semibold mb-1">⌨️ Tastenkürzel</p>
            <p className="muted">
              <kbd className="px-1 rounded text-xs" style={{ border: "1px solid var(--border)" }}>Leertaste</kbd> Karte umdrehen &nbsp;·&nbsp;
              <kbd className="px-1 rounded text-xs" style={{ border: "1px solid var(--border)" }}>1</kbd> Nochmal &nbsp;·&nbsp;
              <kbd className="px-1 rounded text-xs" style={{ border: "1px solid var(--border)" }}>2</kbd> Schwer &nbsp;·&nbsp;
              <kbd className="px-1 rounded text-xs" style={{ border: "1px solid var(--border)" }}>3</kbd> Gut &nbsp;·&nbsp;
              <kbd className="px-1 rounded text-xs" style={{ border: "1px solid var(--border)" }}>4</kbd> Einfach
            </p>
          </div>

          <div>
            <p className="font-semibold mb-1">📱 App installieren</p>
            <p className="muted">
              Du kannst die App auf deinem Handy installieren und auch offline nutzen.
              Auf iPhone: „Teilen" → „Zum Home-Bildschirm". Auf Android: im Browser-Menü „App installieren".
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            className="btn btn-primary text-xs py-1.5 px-4"
          >
            Verstanden, loslegen! 🚦
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [studyDeck, setStudyDeck] = useState<SignalDeck | null>(null);
  const [stats, setStats] = useState<Record<string, DeckStats>>({});
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, lastStudyDate: "", longestStreak: 0 });

  useEffect(() => {
    const store = loadProgress();
    const result: Record<string, DeckStats> = {};
    for (const deck of SIGNAL_DECKS) {
      result[deck.id] = getDeckStats(deck.cards.map((c) => c.id), store);
    }
    setStats(result);
    setStreak(loadStreak());
  }, [studyDeck]);

  // Support ?deck=hp für iframe-Einbettung
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const deckParam = params.get("deck");
    if (deckParam) {
      if (deckParam.toLowerCase() === "alle") { setStudyDeck(ALL_DECK); return; }
      const found = SIGNAL_DECKS.find((d) => d.id.toLowerCase() === deckParam.toLowerCase());
      if (found) setStudyDeck(found);
    }
  }, []);

  if (studyDeck) {
    return <StudySession deck={studyDeck} onExit={() => setStudyDeck(null)} />;
  }

  const totalDue = Object.values(stats).reduce((sum, s) => sum + s.due, 0);
  const totalStudied = Object.values(stats).reduce((sum, s) => sum + s.studied, 0);
  const totalCards = SIGNAL_DECKS.reduce((sum, d) => sum + d.cards.length, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        📖 Signalbuch – Lernkarten
      </h1>
      <p className="muted text-sm mb-4">
        Ril 301 INB 2026 · Eisenbahnsignale lernen · Wähle ein Deck zum Üben
      </p>

      <HelpSection />

      {/* Gesamtfortschritt + Streak */}
      <div className="card mb-4 py-3 px-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm" style={{ color: "var(--text)" }}>
          {totalStudied > 0 ? (
            <>
              <span className="font-semibold">{totalStudied}</span>
              <span className="muted"> / {totalCards} Karten schon gelernt</span>
            </>
          ) : (
            <span className="muted">Noch keine Karten gelernt — leg los! 🚦</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {totalDue > 0 && (
            <div className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
              {totalDue} fällig 🔔
            </div>
          )}
          {streak.currentStreak > 0 && (
            <div className="text-sm font-semibold text-orange-400" title={`Rekord: ${streak.longestStreak} Tage`}>
              🔥 {streak.currentStreak} Tag{streak.currentStreak !== 1 ? "e" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Alle Decks Button */}
      <button
        className="btn btn-primary w-full mb-6 py-3 text-base font-semibold"
        type="button"
        onClick={() => setStudyDeck(ALL_DECK)}
      >
        🃏 Alle {totalCards} Signale gemischt üben
      </button>

      <ul className="space-y-4">
        {SIGNAL_DECKS.map((deck) => {
          const s = stats[deck.id];
          return (
            <li key={deck.id} className="card flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold" style={{ color: "var(--text)" }}>{deck.name}</div>
                  <div className="muted text-sm mt-0.5">{deck.description}</div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="muted text-xs">{deck.cards.length} Karten</span>
                    {s && s.studied > 0 && (
                      <>
                        {s.known > 0 && (
                          <span className="text-xs text-emerald-400">✓ {s.known} gewusst</span>
                        )}
                        {s.retry > 0 && (
                          <span className="text-xs text-orange-400">↩ {s.retry} nochmal</span>
                        )}
                        {s.due > 0 && (
                          <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                            {s.due} fällig 🔔
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <button
                  className="btn btn-primary flex-shrink-0"
                  type="button"
                  onClick={() => setStudyDeck(deck)}
                  disabled={deck.cards.length === 0}
                >
                  {s && s.due > 0 ? `▶ Lernen (${s.due})` : "▶ Lernen"}
                </button>
              </div>
              {s && s.studied > 0 && (
                <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: "var(--border)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.round((s.studied / s.total) * 100)}%`,
                      background: "var(--accent)",
                    }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
