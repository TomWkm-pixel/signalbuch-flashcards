/**
 * SM-2 Spaced-Repetition-Algorithmus
 * Basiert auf dem SuperMemo-2-Algorithmus (1987, Piotr Woźniak)
 *
 * Bewertungsskala (intern):
 *   0 = nochmal  (Völlig falsch / vergessen)
 *   1 = schwer   (Erinnert mit großer Mühe)
 *   3 = gut      (Korrekt nach kurzem Zögern)
 *   5 = einfach  (Sofort und sicher gewusst)
 */

import type { CardProgress, ProgressStore, SM2Grade } from "@/lib/types";

const STORAGE_KEY = "signalbuch_sm2_progress";

// ── Bewertung → numerischer Qualitätswert ────────────────────────────────────

const QUALITY: Record<SM2Grade, number> = {
  nochmal: 0,
  schwer: 1,
  gut: 3,
  einfach: 5,
};

// ── Datum-Hilfsfunktionen ─────────────────────────────────────────────────────

/** Gibt heutiges Datum als YYYY-MM-DD zurück */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Addiert n Tage zu einem ISO-Datum und gibt YYYY-MM-DD zurück */
function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Gibt true zurück, wenn die Karte heute oder früher fällig ist */
export function isDue(progress: CardProgress): boolean {
  return progress.dueDate <= today();
}

// ── SM-2 Kernalgorithmus ──────────────────────────────────────────────────────

/**
 * Berechnet den neuen Lernstand einer Karte nach einer Bewertung.
 * Gibt einen aktualisierten CardProgress zurück.
 */
export function applyGrade(
  cardId: string,
  grade: SM2Grade,
  current?: CardProgress
): CardProgress {
  const q = QUALITY[grade];

  // Startwerte für neue Karte
  let repetitions = current?.repetitions ?? 0;
  let interval = current?.interval ?? 1;
  let easeFactor = current?.easeFactor ?? 2.5;

  if (q < 3) {
    // Falsch beantwortet → zurück zum Anfang
    repetitions = 0;
    interval = 1;
  } else {
    // Korrekt beantwortet → Intervall verlängern
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;

    // Easiness Factor anpassen (min. 1.3)
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);
  }

  return {
    cardId,
    repetitions,
    interval,
    easeFactor,
    dueDate: addDays(today(), interval),
    lastGrade: grade,
  };
}

// ── localStorage ─────────────────────────────────────────────────────────────

/** Lädt den gesamten Lernstand aus dem localStorage */
export function loadProgress(): ProgressStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressStore) : {};
  } catch {
    return {};
  }
}

/** Speichert den gesamten Lernstand in den localStorage */
export function saveProgress(store: ProgressStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/** Aktualisiert eine einzelne Karte im localStorage */
export function updateCardProgress(cardId: string, grade: SM2Grade): CardProgress {
  const store = loadProgress();
  const updated = applyGrade(cardId, grade, store[cardId]);
  store[cardId] = updated;
  saveProgress(store);
  return updated;
}

// ── Statistik-Hilfsfunktionen ─────────────────────────────────────────────────

export type DeckStats = {
  total: number;       // Gesamtzahl der Karten im Deck
  studied: number;     // Schon mindestens einmal gelernt
  due: number;         // Heute fällig (inkl. neue Karten)
  known: number;       // Letzte Bewertung war "gut" oder "einfach"
  retry: number;       // Letzte Bewertung war "nochmal" oder "schwer"
  pct: number;         // Fortschritt in % (studied/total)
};

/** Berechnet Statistiken für ein Deck anhand des aktuellen Lernstands */
export function getDeckStats(cardIds: string[], store: ProgressStore): DeckStats {
  const total = cardIds.length;
  let studied = 0;
  let due = 0;
  let known = 0;
  let retry = 0;

  for (const id of cardIds) {
    const p = store[id];
    if (p) {
      studied++;
      if (p.lastGrade === "gut" || p.lastGrade === "einfach") {
        known++;
      } else {
        retry++;
      }
      if (isDue(p)) due++;
    } else {
      // Neue Karten sind sofort fällig
      due++;
    }
  }

  return {
    total,
    studied,
    due,
    known,
    retry,
    pct: total > 0 ? Math.round((studied / total) * 100) : 0,
  };
}

/**
 * Gibt die Karten-IDs für die aktuelle Session zurück:
 * Zuerst fällige Karten, dann neue Karten (die noch nie gelernt wurden).
 * Karten, die erst in der Zukunft fällig sind, werden ausgelassen.
 */
export function getSessionCards<T extends { id: string }>(
  cards: T[],
  store: ProgressStore
): T[] {
  const due = cards.filter((c) => {
    const p = store[c.id];
    return p ? isDue(p) : true; // Neue Karten immer fällig
  });
  // Mische fällige Karten zufällig
  return [...due].sort(() => Math.random() - 0.5);
}
