"use client";

import { useState, useEffect } from "react";
import type { SignalDeck } from "@/lib/types";
import { SIGNAL_DECKS } from "@/lib/data/signals";
import StudySession from "@/components/StudySession";
import { loadProgress, getDeckStats, type DeckStats } from "@/lib/sm2";

export default function Home() {
  const [studyDeck, setStudyDeck] = useState<SignalDeck | null>(null);
  const [stats, setStats] = useState<Record<string, DeckStats>>({});

  // Lernstand aus localStorage laden (client-only)
  useEffect(() => {
    const store = loadProgress();
    const result: Record<string, DeckStats> = {};
    for (const deck of SIGNAL_DECKS) {
      result[deck.id] = getDeckStats(deck.cards.map((c) => c.id), store);
    }
    setStats(result);
  }, [studyDeck]); // Neu laden nach jeder Session

  // Support ?deck=hp für iframe-Einbettung
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const deckParam = params.get("deck");
    if (deckParam) {
      const found = SIGNAL_DECKS.find(
        (d) => d.id.toLowerCase() === deckParam.toLowerCase()
      );
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

      {/* Gesamtfortschritt */}
      {totalStudied > 0 && (
        <div className="card mb-6 py-3 px-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-sm" style={{ color: "var(--text)" }}>
            <span className="font-semibold">{totalStudied}</span>
            <span className="muted"> / {totalCards} Karten schon gelernt</span>
          </div>
          {totalDue > 0 && (
            <div className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
              {totalDue} heute fällig 🔔
            </div>
          )}
        </div>
      )}

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
                        <span className="text-xs text-emerald-400">{s.mastered} gemeistert</span>
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
              {/* Fortschrittsbalken */}
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
