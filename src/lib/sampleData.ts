import type { Deck } from "./types";

export const SAMPLE_DECKS: Deck[] = [
  {
    id: "1",
    name: "German Vocabulary",
    description: "Basic German words & phrases",
    cards: [
      { id: "1-1", front: "der Hund", back: "the dog" },
      { id: "1-2", front: "die Katze", back: "the cat" },
      { id: "1-3", front: "das Buch", back: "the book" },
      { id: "1-4", front: "Guten Morgen", back: "Good morning" },
      { id: "1-5", front: "Danke schön", back: "Thank you very much" },
    ],
  },
  {
    id: "2",
    name: "React Concepts",
    description: "Core React hooks and patterns",
    cards: [
      { id: "2-1", front: "useState", back: "Hook to manage local component state" },
      { id: "2-2", front: "useEffect", back: "Hook to run side effects after render" },
      { id: "2-3", front: "useRef", back: "Hook to hold a mutable value that doesn't trigger re-renders" },
    ],
  },
];
