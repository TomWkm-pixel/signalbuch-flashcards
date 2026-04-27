"use client";

import { useState, useEffect } from "react";
import type { SignalDeck } from "@/lib/types";
import { SIGNAL_DECKS } from "@/lib/data/signals";
import StudySession from "@/components/StudySession";

export default function Home() {
  const [studyDeck, setStudyDeck] = useState<SignalDeck | null>(null);

  // Support ?deck=hp (or ?deck=Hp) for iframe embedding
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        📖 Signalbuch – Lernkarten
      </h1>
      <p className="muted text-sm mb-6">
        Ril 301 INB 2026 · Eisenbahnsignale lernen · Wähle ein Deck zum Üben
      </p>

      <ul className="space-y-4">
        {SIGNAL_DECKS.map((deck) => (
          <li key={deck.id} className="card flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="font-semibold" style={{ color: "var(--text)" }}>{deck.name}</div>
              <div className="muted text-sm mt-0.5">{deck.description}</div>
              <div className="muted text-xs mt-1">{deck.cards.length} Signalkarte{deck.cards.length !== 1 ? "n" : ""}</div>
            </div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setStudyDeck(deck)}
              disabled={deck.cards.length === 0}
            >
              ▶ Lernen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
