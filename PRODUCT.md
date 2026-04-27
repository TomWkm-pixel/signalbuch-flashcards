# Signalbuch Flash Card App — Produktvision & Entwicklungsplan

> **Sprache der App:** Deutsch  
> **Zielgruppe:** Eisenbahner in Ausbildung, Triebfahrzeugführer, Fahrdienstleiter, Selbstlernende  
> **Quelle:** Ril 301 INB 2026 (DB Richtlinie 301 – Signalbuch, 190+ Seiten, Text + visuelle Elemente)

---

## 1. Vision

Lernende sollen die deutschen Eisenbahnsignale nach Ril 301 schnell, sicher und mit Spaß erlernen — wann immer und wo immer sie wollen. Die App wandelt das dichte Regelwerk in interaktive Lernkarten um und macht repetitives Lernen motivierend statt mühsam.

**Kern-Versprechen:**
- Jedes Signal als Lernkarte: Bild vorne, Bedeutung + Regelreferenz hinten
- Thematisch geordnet (Hauptsignale, Vorsignale, Langsamfahrsignale, …)
- Einbettbar in eine bestehende Website (iframe / Web-Component)
- Vollständig auf Deutsch

---

## 2. Zielgruppen & Nutzerszenarien

| Persona | Szenario |
|---|---|
| Azubi Eisenbahner | Lernt vor der Prüfung die Signalbilder und ihre genaue Bedeutung |
| Triebfahrzeugführer (Refresher) | Auffrischung seltener Signale nach längerer Pause |
| Ausbilder | Nutzt die App als Unterrichtswerkzeug / Hausaufgabe |
| Selbstlernender | Bereitet sich auf die Fachkenntnissprüfung vor |

---

## 3. Kernfunktionen (MVP)

### 3.1 Lernkarten-Decks
- Decks nach Signalgruppen (Hp, Vr, Lf, Ra, So, Zs, El, …)
- Jede Karte:
  - **Vorderseite:** Signalbild (SVG oder Bild-Asset) + Signalname
  - **Rückseite:** Bedeutung (Wortlaut Ril 301) + Signalnummer + ggf. Regelreferenz
- Mehrere Antwortmodi:
  - Klassisches Umblättern (Flip)
  - Multiple-Choice (4 Signale — welches bedeutet was?)

### 3.2 Lernmodus
- Karten der Reihe nach durcharbeiten
- Selbstbewertung: **Nochmal / Schwer / Gut / Einfach** (Basis für SM-2-Scheduling später)
- Fortschrittsanzeige je Session

### 3.3 Abschlusszusammenfassung
- Anzahl richtig / schwierig / nochmal
- Motivierendes Feedback ("Alle Hauptsignale gemeistert! 🚦")

### 3.4 Einbettung in bestehende Website
- Die App wird als eigenständige Next.js-App gebaut
- Einbindung via `<iframe>` **oder** als Web-Component (Custom Element)
- Konfigurierbarer Startdeck-Parameter: `?deck=hauptsignale`

---

## 4. Erweiterte Funktionen (Post-MVP)

| Feature | Nutzen |
|---|---|
| **SM-2 Spaced Repetition** | Karten erscheinen zum optimalen Wiederholungszeitpunkt |
| **Fortschritts-Tracking** | Lernstand je Signal/Deck sichtbar, gespeichert in localStorage |
| **Quiz-Modus** | 20-Fragen-Test mit Zeitlimit, wie eine echte Prüfungsvorbereitung |
| **Bilderkennung-Karten** | Signalbild ohne Namen anzeigen → Nutzer tippt den Namen ein |
| **Nutzer-Accounts / Haushalt** | Zwei Lernende teilen Decks, sehen gegenseitigen Fortschritt |
| **Ausbilder-Dashboard** | Überblick: Welche Signale bereiten der Gruppe Schwierigkeiten? |
| **Dark Mode** | Bereits vorbereitet via CSS-Variablen |
| **Offline-Support (PWA)** | Lernen im Zug ohne Internet |
| **Zufallsmodus** | Gemischte Karten quer über alle Decks |

---

## 5. Inhalt: Signalgruppen nach Ril 301

Die Lernkarten-Decks orientieren sich an den offiziellen Kapiteln der Ril 301:

| Deck | Signalgruppe | Beispiele | Status |
|---|---|---|---|
| **Hp** | Hauptsignale | Hp 0, Hp 00, Hp 1, Hp 2 | ✅ 4 Karten |
| **Vr** | Vorsignale | Vr 0, Vr 1, Vr 2 | ✅ 3 Karten |
| **Ks** | Kombinationssignale | Ks 0, Ks 1, Ks 2 | ✅ 3 Karten |
| **Sh** | Schutzsignale | Sh 0, Sh 1 | ✅ 2 Karten |
| **Ra** | Rangiersignale | Ra 10, Ra 11, Ra 12 | ✅ 3 Karten |
| **Zs** | Zusatzsignale | Zs 1–3, Zs 3v, Zs 6–10, Zs 12, Zs 13 | ✅ 11 Karten |
| **Ne** | Nebenzeichen | Ne 1–5 | ✅ 5 Karten |
| **Lf** | Langsamfahrsignale | Lf 1–7 | ✅ 7 Karten |
| **El** | Elektrische Streckensignale | El 1–4 | ✅ 4 Karten |
| **Bü** | Bahnübergangssignale | Pfeiftafel, Bü 1, Bü-Bake | ✅ 3 Karten |
| **Ts** | Türschlusssignale | Ts 1, Ts 2, Ts 3 | ✅ 3 Karten |
| **So** | Sonstige Signale | So 1, So 3, So 6 | ✅ 3 Karten |
| **Pf** | Pfeifzeichen | Pf 1–7 | ✅ 7 Karten |

**Gesamtstand: 58 Karten in 13 Decks — vollständige Ril 301-Abdeckung für Lernzwecke erreicht (Stand: April 2026)**

---

## 6. Technischer Stack

| Schicht | Technologie | Begründung |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript | Bereits aufgesetzt, SSR + statischer Export |
| Styling | Tailwind CSS + CSS-Variablen | Konsistent, theming-fähig |
| Bilder/SVGs | Statische Assets in `public/signals/` | Signalbilder als SVG oder PNG |
| Daten | JSON-Datei(en) in `src/lib/data/` | Kein Backend nötig für MVP |
| Persistenz (MVP) | `localStorage` | Fortschritt ohne Account speichern |
| Persistenz (v2) | PostgreSQL + REST API | Für Accounts & Multiplayer |
| Einbettung | `<iframe>` + URL-Parameter | Einfachste, sicherste Einbettung |
| Einbettung (v2) | Web Component / Custom Element | Tiefere Integration in Host-Website |

---

## 7. Datenstuktur: Signalkarte

```typescript
// src/lib/types.ts (erweitert)
type SignalCard = {
  id: string;           // z.B. "hp1"
  deck: string;         // z.B. "Hauptsignale"
  signalName: string;   // z.B. "Hp 1"
  image: string;        // Pfad: "/signals/hp1.svg"
  meaning: string;      // "Fahrt" — der genaue Ril-301-Wortlaut
  rule: string;         // z.B. "Ril 301.0001 Abschnitt 3"
  notes?: string;       // Ergänzende Hinweise / Eselsbrücken
  tags?: string[];      // z.B. ["licht", "nacht", "hauptbahn"]
};
```

---

## 8. Arbeitspakete (Work Packages)

### WP 1 — Inhalte aufbereiten (Grundlage für alles)
**Ziel:** Alle Signale aus der Ril 301 INB 2026 als strukturierte JSON-Daten und Bildmaterial erfassen.

- [x] 1.1 Alle Signalgruppen aus der PDF extrahieren und tabellarisch erfassen
- [x] 1.2 Für jedes Signal: Name, Bedeutung (Ril-Wortlaut), Signalnummer, Regelreferenz
- [x] 1.3 Signalbilder als handgefertigte SVGs erstellen (`public/signals/`, 58 SVGs)
- [x] 1.4 TypeScript-Datenstruktur angelegt: `src/lib/data/signals.ts` (13 Gruppen, 58 Karten)
- [ ] 1.5 Lektorat: Inhalte gegen Ril 301 prüfen (fachliche Freigabe)

> ⏱ Aufwand: hoch — das ist das Herzstück der App. Ohne saubere Inhalte kein Lerneffekt.

---

### WP 2 — Kartenansicht mit Signalbildern
**Ziel:** Signalbilder korrekt und ansprechend auf der Lernkarte darstellen.

- [x] 2.1 `public/signals/`-Ordner angelegt, 58 SVGs hinzugefügt
- [x] 2.2 Kartenkomponente (`FlashCard.tsx`) erweitert: Bild-Vorderseite + Text-Rückseite
- [x] 2.3 Fallback-Darstellung wenn Bild fehlt (Platzhalter + Signalname)
- [x] 2.4 Responsive Darstellung auf Smartphone und Desktop
- [ ] 2.5 Dark-Mode-Kompatibilität der SVGs prüfen (ggf. `currentColor` nutzen)

---

### WP 3 — Deck-Navigation & Übersichtsseite
**Ziel:** Nutzer kann gezielt ein Deck (z.B. "Hauptsignale") auswählen.

- [x] 3.1 Deck-Übersichtsseite mit Kartenanzahl je Deck
- [x] 3.2 Kachelansicht: Deck-Name, Anzahl Karten, Beschreibung
- [x] 3.3 "Alle Decks" – Modus: Karten quer über alle Gruppen gemischt (`?deck=alle`)
- [x] 3.4 URL-Parameter: `?deck=hp` für Direktstart (für Einbettung)

---

### WP 4 — Lernsession verbessern
**Ziel:** Lernmodus motivierend und prüfungsrealistisch gestalten.

- [ ] 4.1 Multiple-Choice-Modus: 4 Signalbilder — welches ist Hp 1?
- [ ] 4.2 Umgekehrter Modus: Bedeutung vorne → Signalname/Bild hinten
- [x] 4.3 Zufallsmodus: Karten mischen
- [x] 4.4 Keyboard-Shortcuts: Leertaste = umblättern, 1–4 = Bewertung
- [x] 4.5 Animiertes Umblättern (CSS 3D-Flip)

---

### WP 5 — Fortschritt & Wiederholung (SM-2)
**Ziel:** Karten erscheinen zum richtigen Zeitpunkt — wie Anki.

- [x] 5.1 SM-2-Algorithmus implementieren (`src/lib/sm2.ts` — Intervall, Easiness Factor)
- [x] 5.2 Fortschritt in `localStorage` speichern (`signalbuch_sm2_progress`)
- [x] 5.3 "Heute fällige Karten" — Badge im Deck-Overview (🔔 X fällig)
- [x] 5.4 Streak-Anzeige: "5 Tage in Folge gelernt 🔥" (`signalbuch_streak`)

---

### WP 6 — Einbettung in bestehende Website
**Ziel:** Die App nahtlos in die Host-Website integrieren.

- [ ] 6.1 Next.js `next export` (statischer Build) konfigurieren
- [ ] 6.2 `<iframe>`-Einbettungsanleitung erstellen
- [ ] 6.3 CSS-Anpassungen: transparenter Hintergrund, Host-Schrift übernehmen
- [ ] 6.4 Kommunikation Host ↔ App via `postMessage` (optional, für Theme-Sync)
- [ ] 6.5 Web-Component-Wrapper (optional, v2): `<signalbuch-app deck="hauptsignale">`

---

### WP 7 — Qualitätssicherung & Barrierefreiheit
- [ ] 7.1 Alle Signale fachlich gegen Ril 301 INB 2026 abgeglichen
- [ ] 7.2 Screenreader-Support: aria-labels auf Karten und Buttons
- [ ] 7.3 Tastaturnavigation vollständig bedienbar
- [ ] 7.4 Farbkontraste WCAG AA bestanden (besonders Signalfarben)
- [ ] 7.5 Test auf iOS Safari + Android Chrome

---

### WP 8 — Deployment & Integration
- [x] 8.1 Statischer Export + Vercel-Deployment konfiguriert (`signalbuch-flashcards.vercel.app`)
- [x] 8.2 Einbindung in Host-Website via `<iframe>` mit `?deck=`-Parameter möglich
- [ ] 8.3 Custom Domain / Subdomain falls nötig
- [ ] 8.4 Analytics (optional, datenschutzkonform, z.B. Plausible)

---

## 9. Priorisierung (MoSCoW)

| Feature | Priorität |
|---|---|
| Signalkarten mit Bildern & Ril-Wortlaut | **Must** |
| Flip-Lernmodus | **Must** |
| Decks nach Signalgruppen | **Must** |
| Deutsche Sprache durchgehend | **Must** |
| iframe-Einbettung | **Must** |
| Multiple-Choice | **Should** |
| SM-2-Wiederholung | **Should** |
| Fortschritt / localStorage | **Should** |
| Dark Mode | **Should** |
| Animiertes Kartenblättern | **Could** |
| Nutzeraccounts | **Could** |
| Ausbilder-Dashboard | **Won't** (v2) |
| PWA/Offline | ✅ implementiert |

---

## 10. Offene Fragen & Entscheidungen

| # | Frage | Optionen | Status |
|---|---|---|---|
| 1 | Woher kommen die Signalbilder? | SVGs aus PDF extrahieren / neu zeichnen / DB-Lizenz prüfen | ✅ Alle 58 SVGs handgefertigt |
| 2 | Dürfen Ril-301-Inhalte 1:1 verwendet werden? | Interne Nutzung / Lizenz klären | ✅ Für Lernzwecke freigegeben |
| 3 | Einbettung: iframe vs. Web Component | iframe = einfach; WC = flexibler | ✅ iframe mit `?deck=` implementiert |
| 4 | Fortschritt: nur lokal oder mit Account? | localStorage für MVP, Account später | ✅ entschieden |
| 5 | Sprache der Code-Kommentare | Deutsch oder Englisch | ✅ Deutsch

---

## 11. Sprint-Historie & Nächste Schritte

**Abgeschlossen bis April 2026:**
- ✅ Sprint 1: 18 Signale, 7 Decks, 18 SVGs
- ✅ Sprint 2: 3D-Flip-Animation, Keyboard-Shortcuts (Space/1–4), `?deck=`-URL-Parameter
- ✅ Sprint 3: GitHub-Repo + Vercel-Deployment, iframe-Einbettung live
- ✅ Sprint 4: Erweiterung auf 37 Signale, 10 Decks (Lf, El, Bü ergänzt)
- ✅ Sprint 5: Vollständige Signalabdeckung — 58 Karten in 13 Decks (Ts, So, Pf ergänzt)
- ✅ Sprint 6: SM-2 Spaced Repetition, localStorage-Persistenz, Dark Mode, PWA (Manifest + Service Worker + Icons), Streak-Anzeige, Alle-Decks-Modus, Feedback-Button (Microsoft Forms), In-App-Hilfe/Onboarding

**Sprint 7 — Nächste Prioritäten:**
1. **Fachliche Korrekturlesung** — Alle 58 Karten gegen Ril 301 INB 2026 abgleichen
2. **Multiple-Choice-Modus** — 4 Bilder, welches bedeutet was?
3. **Barrierefreiheit** — aria-labels, WCAG-Kontraste, Tastaturnavigation komplett
4. **Analytics** — datenschutzkonform (Plausible o.ä.) um Nutzungsverhalten zu verstehen
5. **Umgekehrter Modus** — Bedeutung vorne, Signalbild/Name hinten

---

*Zuletzt aktualisiert: April 2026 (Sprint 6)*
