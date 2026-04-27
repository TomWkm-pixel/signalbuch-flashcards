"use client";

import { useState } from "react";
import type { Deck, Card } from "@/lib/types";

type Props = {
  decks: Deck[];
  setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
  onStudy: (deck: Deck) => void;
};

let nextId = 100;
const uid = () => String(++nextId);

export default function DeckList({ decks, setDecks, onStudy }: Props) {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [expandedDeck, setExpandedDeck] = useState<string | null>(null);
  const [newCardFront, setNewCardFront] = useState<Record<string, string>>({});
  const [newCardBack, setNewCardBack] = useState<Record<string, string>>({});

  const addDeck = () => {
    if (!newName.trim()) return;
    setDecks((prev) => [...prev, { id: uid(), name: newName.trim(), description: newDesc.trim(), cards: [] }]);
    setNewName("");
    setNewDesc("");
  };

  const deleteDeck = (id: string) => {
    if (!window.confirm("Remove this deck? This cannot be undone.")) return;
    setDecks((prev) => prev.filter((d) => d.id !== id));
  };

  const addCard = (deckId: string) => {
    const front = newCardFront[deckId]?.trim();
    const back = newCardBack[deckId]?.trim();
    if (!front || !back) return;
    setDecks((prev) =>
      prev.map((d) =>
        d.id === deckId ? { ...d, cards: [...d.cards, { id: uid(), front, back }] } : d
      )
    );
    setNewCardFront((p) => ({ ...p, [deckId]: "" }));
    setNewCardBack((p) => ({ ...p, [deckId]: "" }));
  };

  const deleteCard = (deckId: string, cardId: string) => {
    if (!window.confirm("Remove this card?")) return;
    setDecks((prev) =>
      prev.map((d) =>
        d.id === deckId ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) } : d
      )
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Your Decks</h1>
      <p className="muted text-sm mb-6">Select a deck to study, or manage cards below.</p>

      {/* Create deck */}
      <div className="card mb-6 flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[160px]">
          <div className="text-xs muted mb-1">Deck name</div>
          <input className="input w-full" placeholder="e.g. Spanish verbs" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addDeck()} />
        </div>
        <div className="flex-1 min-w-[160px]">
          <div className="text-xs muted mb-1">Description (optional)</div>
          <input className="input w-full" placeholder="Short description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="button" disabled={!newName.trim()} onClick={addDeck}>
          + New Deck
        </button>
      </div>

      {decks.length === 0 && (
        <div className="card text-center py-10">
          <div className="text-3xl mb-2">📭</div>
          <div className="font-semibold" style={{ color: "var(--text)" }}>No decks yet</div>
          <p className="muted text-sm mt-1">Create your first deck above to get started.</p>
        </div>
      )}

      <ul className="space-y-4">
        {decks.map((deck) => (
          <li key={deck.id} className="card">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="font-semibold" style={{ color: "var(--text)" }}>{deck.name}</div>
                {deck.description && <div className="muted text-sm">{deck.description}</div>}
                <div className="muted text-xs mt-0.5">{deck.cards.length} card{deck.cards.length !== 1 ? "s" : ""}</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button className="btn btn-primary" type="button" disabled={deck.cards.length === 0} onClick={() => onStudy(deck)}>
                  ▶ Study
                </button>
                <button className="btn" type="button" onClick={() => setExpandedDeck(expandedDeck === deck.id ? null : deck.id)}>
                  {expandedDeck === deck.id ? "▲ Collapse" : "▼ Cards"}
                </button>
                <button className="btn btn-danger" type="button" onClick={() => deleteDeck(deck.id)}>
                  Remove
                </button>
              </div>
            </div>

            {expandedDeck === deck.id && (
              <div className="mt-4">
                {/* Card list */}
                {deck.cards.length === 0 ? (
                  <p className="muted text-sm mb-3">No cards yet — add one below.</p>
                ) : (
                  <ul className="divide-y mb-3" style={{ borderColor: "var(--border)" }}>
                    {deck.cards.map((card: Card) => (
                      <li key={card.id} className="py-2 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex gap-4 flex-1 min-w-0">
                          <span className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{card.front}</span>
                          <span className="muted text-sm truncate">→ {card.back}</span>
                        </div>
                        <button className="btn btn-danger text-xs py-0.5 px-2" type="button" onClick={() => deleteCard(deck.id, card.id)}>
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Add card */}
                <div className="flex flex-wrap gap-2 items-end pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                  <div className="flex-1 min-w-[120px]">
                    <div className="text-xs muted mb-1">Front</div>
                    <input className="input w-full" placeholder="Question / term" value={newCardFront[deck.id] ?? ""} onChange={(e) => setNewCardFront((p) => ({ ...p, [deck.id]: e.target.value }))} />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <div className="text-xs muted mb-1">Back</div>
                    <input className="input w-full" placeholder="Answer / definition" value={newCardBack[deck.id] ?? ""} onChange={(e) => setNewCardBack((p) => ({ ...p, [deck.id]: e.target.value }))} />
                  </div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={!newCardFront[deck.id]?.trim() || !newCardBack[deck.id]?.trim()}
                    onClick={() => addCard(deck.id)}
                  >
                    + Add Card
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
