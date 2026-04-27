"use client";

import { useState, useEffect, useCallback } from "react";
import type { SignalCard, SignalDeck, SM2Grade } from "@/lib/types";
import { updateCardProgress, getSessionCards, loadProgress } from "@/lib/sm2";
import FlashCard from "@/components/FlashCard";

type Props = { deck: SignalDeck; onExit: () => void };

export default function StudySession({ deck, onExit }: Props) {
  // Nur fällige Karten (neue + SM-2-fällige) für diese Session
  const [cards] = useState<SignalCard[]>(() => {
    const store = loadProgress();
    const due = getSessionCards(deck.cards, store);
    // Wenn nichts fällig: trotzdem alle anzeigen (damit es nie leer ist)
    return due.length > 0 ? due : [...deck.cards].sort(() => Math.random() - 0.5);
  });

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [grades, setGrades] = useState<SM2Grade[]>([]);
  const [done, setDone] = useState(false);
  const [lastInterval, setLastInterval] = useState<number | null>(null);

  const card = cards[index];

  const grade = useCallback(
    (g: SM2Grade) => {
      const updated = updateCardProgress(card.id, g);
      setLastInterval(updated.interval);
      setGrades((prev) => [...prev, g]);
      if (index + 1 >= cards.length) {
        setDone(true);
      } else {
        setIndex(index + 1);
        setFlipped(false);
        setLastInterval(null);
      }
    },
    [card, index, cards.length]
  );

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
  }, [flipped, done, grade]);

  const restart = () => {
    setIndex(0);
    setFlipped(false);
    setGrades([]);
    setDone(false);
    setLastInterval(null);
  };

  if (done) {
    const counts = {
      nochmal: grades.filter((s) => s === "nochmal").length,
      schwer: grades.filter((s) => s === "schwer").length,
      gut: grades.filter((s) => s === "gut").length,
      einfach: grades.filter((s) => s === "einfach").length,
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
          <p className="text-lg font-semibold mb-4" style={{ color: "var(--accent)" }}>
            {pct} % gewusst
          </p>
          <div className="flex justify-center gap-4 flex-wrap text-sm mb-4">
            <span className="text-red-400">🔁 Nochmal: {counts.nochmal}</span>
            <span className="text-orange-400">😓 Schwer: {counts.schwer}</span>
            <span className="text-emerald-400">✓ Gut: {counts.gut}</span>
            <span style={{ color: "var(--accent)" }}>⚡ Einfach: {counts.einfach}</span>
          </div>
          {counts.nochmal > 0 && (
            <p className="muted text-xs mb-6">
              💡 {counts.nochmal} Karte{counts.nochmal !== 1 ? "n" : ""} kommen morgen wieder.
            </p>
          )}
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
              <button className="btn" style={{ color: "#f87171", borderColor: "#f87171" }} type="button" onClick={() => grade("nochmal")} title="Morgen wiederholen (Taste: 1)">🔁 Nochmal</button>
              <button className="btn" style={{ color: "#fb923c", borderColor: "#fb923c" }} type="button" onClick={() => grade("schwer")} title="Bald wiederholen (Taste: 2)">😓 Schwer</button>
              <button className="btn" style={{ color: "#34d399", borderColor: "#34d399" }} type="button" onClick={() => grade("gut")} title="In einigen Tagen (Taste: 3)">✓ Gut</button>
              <button className="btn" style={{ color: "var(--accent)", borderColor: "var(--accent)" }} type="button" onClick={() => grade("einfach")} title="Lange nicht mehr anzeigen (Taste: 4)">⚡ Einfach</button>
            </div>
            {lastInterval !== null && (
              <p className="muted text-xs text-center">
                ✅ Gespeichert · Nächste Wiederholung in {lastInterval} Tag{lastInterval !== 1 ? "en" : ""}
              </p>
            )}
            <div className="muted text-xs text-center">
              Tastatur:{" "}
              <kbd className="px-1 rounded" style={{ border: "1px solid var(--border)" }}>1</kbd> Nochmal &nbsp;
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
