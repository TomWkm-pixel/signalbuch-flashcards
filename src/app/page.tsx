"use client";

import { useState, useEffect } from "react";
import type { SignalDeck } from "@/lib/types";
import { SIGNAL_DECKS } from "@/lib/data/signals";
import StudySession from "@/components/StudySession";
import { loadProgress, getDeckStats, loadStreak, type DeckStats, type StreakData } from "@/lib/sm2";

// Virtuelles "Alle Decks"-Deck — alle Karten gemischt
const ALL_DECK: SignalDeck = {
  id: "alle",
  name: "Alle Signale",
  description: "Alle 58 Signalkarten aus allen Decks gemischt",
  cards: SIGNAL_DECKS.flatMap((d) => d.cards),
};

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
