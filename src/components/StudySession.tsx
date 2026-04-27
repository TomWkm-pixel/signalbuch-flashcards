"use client";

import { useState, useEffect, useCallback } from "react";
import type { SignalCard, SignalDeck } from "@/lib/types";
import FlashCard from "@/components/FlashCard";

type Props = { deck: SignalDeck; onExit: () => void };
type Grade = "nochmal" | "schwer" | "gut" | "einfach";

export default function StudySession({ deck, onExit }: Props) {
  const [cards] = useState<SignalCard[]>(() => [...deck.cards].sort(() => Math.random() - 0.5));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [scores, setScores] = useState<Grade[]>([]);
  const [done, setDone] = useState(false);

  const card = cards[index];

  const grade = (g: Grade) => {
    const next = [...scores, g];
    setScores(next);
    if (index + 1 >= cards.length) {
      setDone(true);
    } else {
      setIndex(index + 1);
      setFlipped(false);
    }
  };

  // Keyboard shortcuts: Space = flip, 1–4 = grade (only when flipped)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === " ") { e.preventDefault(); setFlipped((f) => !f); }
      if (!flipped) return;
      if (e.key === "1") grade("nochmal");
      if (e.key === "2") grade("schwer");
      if (e.key === "3") grade("gut");
      if (e.key === "4") grade("einfach");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, done, index]);

  const restart = () => {
    setIndex(0);
    setFlipped(false);
    setScores([]);
    setDone(false);
  };

  if (done) {
    const counts = {
      nochmal: scores.filter((s) => s === "nochmal").length,
      schwer: scores.filter((s) => s === "schwer").length,
      gut: scores.filter((s) => s === "gut").length,
      einfach: scores.filter((s) => s === "einfach").length,
    };
    const pct = Math.round(((counts.gut + counts.einfach) / cards.length) * 100);
    return (
      <div>
        <button className="btn mb-6" type="button" onClick={onExit}>← Zurück zur Übersicht</button>
        <div className="card text-center py-10">
          <div className="text-4xl mb-3">{pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📖"}</div>
          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
            Lernsession abgeschlossen!
          </h2>
          <p className="muted text-sm mb-2">
            Du hast {cards.length} Signalkarte{cards.length !== 1 ? "n" : ""} aus{" "}
            <strong>{deck.name}</strong> geübt.
          </p>
          <p className="text-lg font-semibold mb-6" style={{ color: "var(--accent)" }}>
            {pct} % gewusst
          </p>
          <div className="flex justify-center gap-4 flex-wrap text-sm mb-6">
            <span className="text-red-400">🔁 Nochmal: {counts.nochmal}</span>
            <span className="text-orange-400">😓 Schwer: {counts.schwer}</span>
            <span className="text-emerald-400">✓ Gut: {counts.gut}</span>
            <span style={{ color: "var(--accent)" }}>⚡ Einfach: {counts.einfach}</span>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            <button className="btn btn-primary" type="button" onClick={restart}>Nochmal üben</button>
            <button className="btn" type="button" onClick={onExit}>Zurück zur Übersicht</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button className="btn" type="button" onClick={onExit}>← Zurück</button>
        <div className="muted text-sm text-center">
          {deck.name} · Karte {index + 1} / {cards.length}
        </div>
        <div className="w-full mt-1 rounded-full h-1.5 overflow-hidden" style={{ background: "var(--border)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(index / cards.length) * 100}%`, background: "var(--accent)" }}
          />
        </div>
      </div>

      <FlashCard card={card} flipped={flipped} onClick={() => setFlipped(!flipped)} />

      <div className="mt-4">
        {flipped ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex justify-center gap-3 flex-wrap">
              <button className="btn" style={{ color: "#f87171", borderColor: "#f87171" }} type="button" onClick={() => grade("nochmal")}>🔁 Nochmal</button>
              <button className="btn" style={{ color: "#fb923c", borderColor: "#fb923c" }} type="button" onClick={() => grade("schwer")}>😓 Schwer</button>
              <button className="btn" style={{ color: "#34d399", borderColor: "#34d399" }} type="button" onClick={() => grade("gut")}>✓ Gut</button>
              <button className="btn" style={{ color: "var(--accent)", borderColor: "var(--accent)" }} type="button" onClick={() => grade("einfach")}>⚡ Einfach</button>
            </div>
            <div className="muted text-xs text-center">
              Tastatur: <kbd className="px-1 rounded" style={{ border: "1px solid var(--border)" }}>1</kbd> Nochmal &nbsp;
              <kbd className="px-1 rounded" style={{ border: "1px solid var(--border)" }}>2</kbd> Schwer &nbsp;
              <kbd className="px-1 rounded" style={{ border: "1px solid var(--border)" }}>3</kbd> Gut &nbsp;
              <kbd className="px-1 rounded" style={{ border: "1px solid var(--border)" }}>4</kbd> Einfach
            </div>
          </div>
        ) : (
          <p className="text-center muted text-sm">
            Karte aufdecken, dann dein Wissen bewerten. &nbsp;
            <kbd className="px-1 rounded text-xs" style={{ border: "1px solid var(--border)" }}>Leertaste</kbd>
          </p>
        )}
      </div>
    </div>
  );
}
