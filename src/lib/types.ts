export type Card = {
  id: string;
  front: string;
  back: string;
};

export type Deck = {
  id: string;
  name: string;
  description?: string;
  cards: Card[];
};

// ── Signalbuch ──────────────────────────────────────────────────────────────

export type SignalCard = {
  id: string;           // z. B. "hp1"
  deck: string;         // z. B. "Hauptsignale"
  deckId: string;       // z. B. "hp"
  signalName: string;   // z. B. "Hp 1"
  image: string;        // Pfad zu public/signals/*.svg
  meaning: string;      // Ril-301-Wortlaut
  rule: string;         // Regelreferenz
  notes?: string;       // Eselsbrücken / Hinweise
  tags?: string[];
};

export type SignalDeck = {
  id: string;
  name: string;
  description: string;
  cards: SignalCard[];
};
