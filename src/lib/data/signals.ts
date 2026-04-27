import type { SignalDeck } from "@/lib/types";

// ────────────────────────────────────────────────────────────────────────────
// Ril 301 INB 2026 — Signalbuch Lernkarten
// Quelle: DB Richtlinie 301 (öffentlich zugänglich)
// ────────────────────────────────────────────────────────────────────────────

export const SIGNAL_DECKS: SignalDeck[] = [
  // ── Hp: Hauptsignale ──────────────────────────────────────────────────────
  {
    id: "hp",
    name: "Hauptsignale (Hp)",
    description: "Hauptsignale zeigen an, ob ein Zug fahren darf oder halten muss.",
    cards: [
      {
        id: "hp0",
        deck: "Hauptsignale (Hp)",
        deckId: "hp",
        signalName: "Hp 0",
        image: "/signals/hp0.svg",
        meaning: "Halt!\nDer Zug muss vor dem Signal halten.",
        rule: "Ril 301.0001 § 1",
        notes: "Hp 0 = zwei rote Lichter nebeneinander oder ein einzelnes rotes Licht je nach Signaltyp.",
        tags: ["halt", "licht", "formsignal"],
      },
      {
        id: "hp1",
        deck: "Hauptsignale (Hp)",
        deckId: "hp",
        signalName: "Hp 1",
        image: "/signals/hp1.svg",
        meaning: "Fahrt!\nDer Zug darf mit der zugelassenen Streckengeschwindigkeit fahren.",
        rule: "Ril 301.0001 § 2",
        notes: "Hp 1 = ein grünes Licht. Merkhilfe: Grün = los!",
        tags: ["fahrt", "licht"],
      },
      {
        id: "hp2",
        deck: "Hauptsignale (Hp)",
        deckId: "hp",
        signalName: "Hp 2",
        image: "/signals/hp2.svg",
        meaning: "Langsamfahrt!\nDer Zug darf höchstens mit 40 km/h an dem Signal vorbeifahren und bis zum nächsten Hauptsignal mit dieser Geschwindigkeit weiterfahren.",
        rule: "Ril 301.0001 § 3",
        notes: "Hp 2 = ein grünes + ein gelbes Licht. Merkhilfe: Gelb = Vorsicht, langsamer.",
        tags: ["langsamfahrt", "40 km/h", "licht"],
      },
    ],
  },

  // ── Vr: Vorsignale ────────────────────────────────────────────────────────
  {
    id: "vr",
    name: "Vorsignale (Vr)",
    description: "Vorsignale kündigen das nächste Hauptsignal an und geben dem Triebfahrzeugführer Zeit zum Bremsen.",
    cards: [
      {
        id: "vr0",
        deck: "Vorsignale (Vr)",
        deckId: "vr",
        signalName: "Vr 0",
        image: "/signals/vr0.svg",
        meaning: "Halt erwarten!\nDas nächste Hauptsignal zeigt Halt. Der Zug muss auf Bremsung bis zum Halt vorbereitet sein.",
        rule: "Ril 301.0002 § 1",
        notes: "Vr 0 = zwei gelbe Lichter. Merkhilfe: Gelb-Gelb = nächstes Signal Rot.",
        tags: ["halt erwarten", "bremsen", "licht"],
      },
      {
        id: "vr1",
        deck: "Vorsignale (Vr)",
        deckId: "vr",
        signalName: "Vr 1",
        image: "/signals/vr1.svg",
        meaning: "Fahrt erwarten!\nDas nächste Hauptsignal zeigt Fahrt.",
        rule: "Ril 301.0002 § 2",
        notes: "Vr 1 = zwei grüne Lichter (diagonal). Merkhilfe: Grün-Grün = alles frei.",
        tags: ["fahrt erwarten", "licht"],
      },
      {
        id: "vr2",
        deck: "Vorsignale (Vr)",
        deckId: "vr",
        signalName: "Vr 2",
        image: "/signals/vr2.svg",
        meaning: "Langsamfahrt erwarten!\nDas nächste Hauptsignal zeigt Langsamfahrt. Der Zug muss auf 40 km/h abbremsen.",
        rule: "Ril 301.0002 § 3",
        notes: "Vr 2 = ein grünes + ein gelbes Licht (diagonal). Merkhilfe: Grün-Gelb = nächstes Signal Hp 2.",
        tags: ["langsamfahrt erwarten", "40 km/h", "licht"],
      },
    ],
  },

  // ── Ks: Kombinationssignale ───────────────────────────────────────────────
  {
    id: "ks",
    name: "Kombinationssignale (Ks)",
    description: "Ks-Signale vereinen Haupt- und Vorsignalfunktion in einem Signalschirm.",
    cards: [
      {
        id: "ks1",
        deck: "Kombinationssignale (Ks)",
        deckId: "ks",
        signalName: "Ks 1",
        image: "/signals/ks1.svg",
        meaning: "Fahrt!\nDas Signal gilt gleichzeitig als Hauptsignal (Fahrt) und zeigt mit einem Richtungspfeil oder Zs 3 die anzuwendende Geschwindigkeit an.",
        rule: "Ril 301.0401 § 1",
        notes: "Ks 1 = ein grünes Licht. Kann mit Zs 3 (Geschwindigkeitsanzeiger) kombiniert sein.",
        tags: ["fahrt", "kombinationssignal", "licht"],
      },
      {
        id: "ks2",
        deck: "Kombinationssignale (Ks)",
        deckId: "ks",
        signalName: "Ks 2",
        image: "/signals/ks2.svg",
        meaning: "Langsamfahrt erwarten!\nDas nächste Ks-Signal zeigt eine reduzierte Geschwindigkeit. Das Signal leuchtet grün mit einem gelben Blinkaufsatz.",
        rule: "Ril 301.0401 § 2",
        notes: "Ks 2 = grün blinkend oder grün + gelber Lichtstreifen. Ankündigung von Hp 2 / Langsamfahrt.",
        tags: ["langsamfahrt erwarten", "kombinationssignal", "blinklicht"],
      },
    ],
  },

  // ── Sh: Schutzsignale ─────────────────────────────────────────────────────
  {
    id: "sh",
    name: "Schutzsignale (Sh)",
    description: "Schutzsignale sichern Gefahrenstellen und Rangierfahrwege.",
    cards: [
      {
        id: "sh0",
        deck: "Schutzsignale (Sh)",
        deckId: "sh",
        signalName: "Sh 0",
        image: "/signals/sh0.svg",
        meaning: "Fahrverbot!\nRangierfahrten und Züge dürfen nicht über das Signal hinausfahren.",
        rule: "Ril 301.0701 § 1",
        notes: "Sh 0 = weiß-rote-weiße Scheibe waagerecht ODER rotes Licht. Merkhilfe: Rotes Kreuz = kein Durchkommen.",
        tags: ["halt", "rangieren", "fahrverbot"],
      },
      {
        id: "sh1",
        deck: "Schutzsignale (Sh)",
        deckId: "sh",
        signalName: "Sh 1",
        image: "/signals/sh1.svg",
        meaning: "Rangierfahrt erlaubt!\nRangierfahrten dürfen über das Signal hinausfahren.",
        rule: "Ril 301.0701 § 2",
        notes: "Sh 1 = weiße Scheibe mit waagerechtem weißem Balken ODER weißes Licht. Merkhilfe: Weiß = freie Fahrt für Rangierfahrten.",
        tags: ["rangieren", "erlaubt", "licht"],
      },
    ],
  },

  // ── Ra: Rangiersignale ────────────────────────────────────────────────────
  {
    id: "ra",
    name: "Rangiersignale (Ra)",
    description: "Rangiersignale regeln die Bewegungen von Rangierfahrzeugen.",
    cards: [
      {
        id: "ra10",
        deck: "Rangiersignale (Ra)",
        deckId: "ra",
        signalName: "Ra 10",
        image: "/signals/ra10.svg",
        meaning: "Rangierhalt!\nRangierfahrzeuge dürfen nicht über das Signal hinausfahren.",
        rule: "Ril 301.0801 § 10",
        notes: "Ra 10 = rot-weiß-rote senkrechte Scheibe ODER zwei rote Lichter. Kompaktsignal für den Rangierdienst.",
        tags: ["rangierhalt", "halt", "rangieren"],
      },
      {
        id: "ra11",
        deck: "Rangiersignale (Ra)",
        deckId: "ra",
        signalName: "Ra 11",
        image: "/signals/ra11.svg",
        meaning: "Rangierfahrt erlaubt!\nRangierfahrzeuge dürfen über das Signal hinausfahren.",
        rule: "Ril 301.0801 § 11",
        notes: "Ra 11 = weiß-rot-weiße senkrechte Scheibe ODER ein weißes Licht.",
        tags: ["rangierfahrt", "erlaubt", "rangieren"],
      },
      {
        id: "ra12",
        deck: "Rangiersignale (Ra)",
        deckId: "ra",
        signalName: "Ra 12",
        image: "/signals/ra12.svg",
        meaning: "Gedenkt des Rangierers!\nDas Triebfahrzeug darf sich nur so weit bewegen, dass der Rangierer nicht gefährdet wird (Schrittgeschwindigkeit).",
        rule: "Ril 301.0801 § 12",
        notes: "Ra 12 = gelbes Licht. Achtung: nur Schrittgeschwindigkeit (max. 10 km/h).",
        tags: ["rangieren", "schrittgeschwindigkeit", "vorsicht"],
      },
    ],
  },

  // ── Zs: Zusatzsignale ─────────────────────────────────────────────────────
  {
    id: "zs",
    name: "Zusatzsignale (Zs)",
    description: "Zusatzsignale ergänzen oder ändern die Aussage anderer Signale.",
    cards: [
      {
        id: "zs1",
        deck: "Zusatzsignale (Zs)",
        deckId: "zs",
        signalName: "Zs 1",
        image: "/signals/zs1.svg",
        meaning: "Ersatzsignal!\nDer Zug darf auf Sicht in den gesperrten oder besetzten Gleisabschnitt einfahren (max. 40 km/h).",
        rule: "Ril 301.1001 § 1",
        notes: "Zs 1 = weißes Licht (oft blinkend). Erlaubt Einfahrt auch wenn Einfahrsignal Halt zeigt.",
        tags: ["ersatzsignal", "40 km/h", "auf sicht"],
      },
      {
        id: "zs3",
        deck: "Zusatzsignale (Zs)",
        deckId: "zs",
        signalName: "Zs 3",
        image: "/signals/zs3.svg",
        meaning: "Geschwindigkeitsanzeiger!\nDer angezeigte Wert × 10 km/h ist die zulässige Höchstgeschwindigkeit bis zum nächsten Hauptsignal.",
        rule: "Ril 301.1001 § 3",
        notes: "Zs 3 = beleuchtet gelbe Ziffer (z. B. '6' bedeutet 60 km/h). Kombiniert mit Ks- oder Hp-Signalen.",
        tags: ["geschwindigkeit", "ziffer", "zusatzsignal"],
      },
      {
        id: "zs7",
        deck: "Zusatzsignale (Zs)",
        deckId: "zs",
        signalName: "Zs 7",
        image: "/signals/zs7.svg",
        meaning: "Vorsicht!\nDer Zug darf das Signal passieren, muss aber auf Hindernisse vorbereitet sein (max. 40 km/h).",
        rule: "Ril 301.1001 § 7",
        notes: "Zs 7 = gelbes X-förmiges Lichtzeichen. Zeigt an: Weiterfahrt möglich, aber Achtung geboten.",
        tags: ["vorsicht", "40 km/h", "hindernis"],
      },
    ],
  },

  // ── Ne: Nebenzeichen ──────────────────────────────────────────────────────
  {
    id: "ne",
    name: "Nebenzeichen (Ne)",
    description: "Nebenzeichen kennzeichnen besondere Stellen im Gleis (Haltetafel, Trapeztafel, …).",
    cards: [
      {
        id: "ne1",
        deck: "Nebenzeichen (Ne)",
        deckId: "ne",
        signalName: "Ne 1",
        image: "/signals/ne1.svg",
        meaning: "Trapeztafel (Vorsignaltafel)\nKündigt an, dass sich in einem Bremsweg ein Hauptsignal befindet, das ggf. Halt zeigen kann.",
        rule: "Ril 301.1101 § 1",
        notes: "Ne 1 = gelb-schwarz trapezförmige Tafel. Steht am Standort, wo das Vorsignal sein müsste, aber keines vorhanden ist.",
        tags: ["vorsignal", "trapeztafel", "tafel"],
      },
      {
        id: "ne5",
        deck: "Nebenzeichen (Ne)",
        deckId: "ne",
        signalName: "Ne 5",
        image: "/signals/ne5.svg",
        meaning: "Haltetafel!\nKennzeichnet die Stelle, an der der erste Wagen eines Zuges halten muss (Haltepunkt).",
        rule: "Ril 301.1101 § 5",
        notes: "Ne 5 = weiße Tafel mit schwarzem H. Steht am Bahnsteig.",
        tags: ["halten", "bahnsteig", "haltepunkt"],
      },
    ],
  },
];
