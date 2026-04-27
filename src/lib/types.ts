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

// ── SM-2 Lernfortschritt ───────────────────────────────────────────────────

export type SM2Grade = "nochmal" | "schwer" | "gut" | "einfach";

/** Gespeicherter Lernstand pro Karte (SM-2 Algorithmus) */
export type CardProgress = {
  cardId: string;
  repetitions: number;   // Anzahl aufeinanderfolgende korrekte Antworten
  interval: number;      // Tage bis zur nächsten Wiederholung
  easeFactor: number;    // Leichtigkeitsfaktor (min. 1.3, Standard 2.5)
  dueDate: string;       // ISO-Datum (YYYY-MM-DD) der nächsten fälligen Wiederholung
  lastGrade: SM2Grade;   // Letzte Bewertung
};

/** Gesamter Lernstand, gespeichert als Record in localStorage */
export type ProgressStore = Record<string, CardProgress>;

export type SignalDeck = {
  id: string;
  name: string;
  description: string;
  cards: SignalCard[];
};
