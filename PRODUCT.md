# Signalbuch Flash Card App — Produktvision & Entwicklungsplan

> **Sprache der App:** Deutsch  
> **Zielgruppe:** Eisenbahner in Ausbildung, Triebfahrzeugführer, Fahrdienstleiter, Selbstlernende  
> **Quelle:** Ril 301 INB 2026 (DB Richtlinie 301 – Signalbuch, 190+ Seiten, Text + visuelle Elemente)

> **Dokumentationsstand:** 5. Oktober 2026, abgeglichen mit Repository-Commit `306b094`. Implementierte Funktionen sind unten vom weiteren Zielbild getrennt. Maßgeblich für den aktuellen Umfang sind `src/app/page.tsx`, `src/lib/data/signals.ts`, die eingebundenen Komponenten und `src/lib/sm2.ts`; Deployment-Konfiguration: `next.config.js` und `package.json`.

---

## 1. Vision

Lernende sollen die deutschen Eisenbahnsignale nach Ril 301 schnell, sicher und mit Spaß erlernen — wann immer und wo immer sie wollen. Die App wandelt das dichte Regelwerk in interaktive Lernkarten um und macht repetitives Lernen motivierend statt mühsam.

**Kern-Versprechen:**
- Signale als Lernkarten: Bild vorne, Bedeutung + Regelreferenz hinten (aktueller Umfang: 58 Karten; fachliche Prüfung offen)
- Thematisch geordnet (Hauptsignale, Vorsignale, Langsamfahrsignale, …)
- Einbettbar in eine bestehende Website (iframe; Web-Component als spätere Erweiterung)
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

## 3. Aktuell implementierte Funktionen

### 3.1 Lernkarten-Decks
- 58 fest vorgegebene Karten in 13 Decks nach Signalgruppen (Hp, Vr, Lf, Ra, So, Zs, El, …), definiert in `src/lib/data/signals.ts`
- Keine Oberfläche für eigene Decks/Karten in der aktiven App: Die generische Komponente `DeckList.tsx` und `sampleData.ts` sind nicht in die Startseite eingebunden.
- Jede Karte:
  - **Vorderseite:** Signalbild (SVG oder Bild-Asset) + Signalname
  - **Rückseite:** Bedeutung + Signalname + Regelreferenz + ggf. Merkhilfe; fachlicher Abgleich mit Ril 301 noch offen
- Klassisches Umblättern mit 3D-Flip-Animation; Multiple Choice ist noch geplant.

### 3.2 Lernmodus
- Neue und nach SM-2 fällige Karten werden gemischt abgefragt. Wenn nichts fällig ist, wird das gesamte gewählte Deck zum weiteren Üben angeboten.
- Selbstbewertung: **Nochmal / Schwer / Gut / Einfach** aktualisiert bereits den SM-2-Lernstand.
- Fortschrittsanzeige je Session
- Leertaste zum Umblättern, Tasten 1–4 zum Bewerten der aufgedeckten Karte
- „Alle Signale“ kombiniert die Karten aller Decks mit derselben Fälligkeitsauswahl.

### 3.3 Abschlusszusammenfassung
- Verteilung der vier Selbstbewertungen und Anteil „gewusst“ (Gut + Einfach)
- Erneutes Üben derselben Session oder Rückkehr zur Übersicht

### 3.4 Einbettung in bestehende Website
- Die App wird als eigenständige Next.js-App gebaut
- Einbindung via `<iframe>`; Anleitung und Deck-IDs in [README.md](README.md#einbettung)
- Startdeck-Parameter: `?deck=hp` (Hauptsignale) oder `?deck=alle`; ohne gültige ID erscheint die Übersicht.
- Web-Component, spezielles Embed-Layout und `postMessage`-Kommunikation sind noch offen. Ein statischer Export ist keine Voraussetzung für die iframe-Einbettung.

### 3.5 Lernstand, Darstellung und PWA
- SM-2-Fortschritt und Fälligkeiten je Deck in `localStorage` (`signalbuch_sm2_progress`), ohne Account oder geräteübergreifende Synchronisation
- Streaks nach abgeschlossenen Sessions (`signalbuch_streak`)
- Hell-/Dunkelmodus mit gespeicherter Auswahl und Systempräferenz als Voreinstellung
- In-App-Hilfe und Feedback-Link zu Microsoft Forms
- PWA-Manifest, Icons, Installationshinweise und Service Worker mit Asset-Caching vorhanden. Vollständiges Offline-Starten ist noch nicht abgesichert: `public/sw.js` speichert keine HTML-Seiten im Cache; Signalbilder und Next.js-Assets werden beim Abruf gecached.

---

## 4. Geplante Erweiterungen (noch nicht implementiert)

| Feature | Nutzen |
|---|---|
| **Multiple Choice** | Signalbilder anhand vorgegebener Antworten erkennen |
| **Umgekehrter Modus** | Bedeutung vorne, Signalname/Bild hinten |
| **Quiz-Modus** | 20-Fragen-Test mit Zeitlimit, wie eine echte Prüfungsvorbereitung |
| **Bilderkennung-Karten** | Signalbild ohne Namen anzeigen → Nutzer tippt den Namen ein |
| **Nutzer-Accounts / Haushalt** | Zwei Lernende teilen Decks, sehen gegenseitigen Fortschritt |
| **Ausbilder-Dashboard** | Überblick: Welche Signale bereiten der Gruppe Schwierigkeiten? |
| **Vollständiger Offline-Start** | HTML-/Asset-Verfügbarkeit nach Installation und bei Neustart ohne Netz sicherstellen |
| **Web-Component / Host-Integration** | Wrapper, transparentes Layout und Theme-Sync ergänzen |

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

**Gesamtstand: 58 Karten in 13 Decks mit 58 SVGs.** Dies beschreibt den vorhandenen Datenbestand; eine vollständige Ril-301-Abdeckung und fachliche Freigabe sind damit nicht belegt (siehe WP 1.5 und WP 7.1).

---

## 6. Technischer Stack

| Schicht | Technologie | Begründung |
|---|---|---|
| Frontend | Next.js 14.2.35 (App Router) + TypeScript | Regulärer Next.js-Build; statischer Export nicht konfiguriert |
| Styling | Tailwind CSS + CSS-Variablen | Konsistent, theming-fähig |
| Bilder/SVGs | Statische Assets in `public/signals/` | Signalbilder als SVG oder PNG |
| Daten | TypeScript-Konstante `SIGNAL_DECKS` in `src/lib/data/signals.ts` | Vorgegebene Inhalte, kein Backend |
| Persistenz (MVP) | `localStorage` | Fortschritt ohne Account speichern |
| Persistenz (v2, geplant) | PostgreSQL + REST API | Für Accounts & Multiplayer; nicht implementiert |
| Einbettung | `<iframe>` + URL-Parameter | Einfachste, sicherste Einbettung |
| Einbettung (v2, geplant) | Web Component / Custom Element | Tiefere Integration in Host-Website; nicht implementiert |

**Deployment-Status:** Vercel-Deployment ist in der Projekthistorie dokumentiert (WP 8.1). Der Code enthält jedoch nur `const nextConfig = {}` sowie die Skripte `next build` / `next start`. Ein Vercel-Deployment und ein statischer Export sind getrennte Sachverhalte. `output: "export"` fehlt; WP 6.1 bleibt offen. Für Next.js 14 erfolgt ein künftiger Export über diese Option und `next build`, nicht über den entfernten Befehl `next export` (siehe [Next.js-Dokumentation](https://nextjs.org/docs/14/app/building-your-application/deploying/static-exports)). Die aktuelle Erreichbarkeit und die Vercel-Projekteinstellungen lassen sich aus dem Repository allein nicht bestätigen.

---

## 7. Datenstuktur: Signalkarte

```typescript
// src/lib/types.ts (aktueller SignalCard-Typ)
type SignalCard = {
  id: string;           // z.B. "hp1"
  deck: string;         // z.B. "Hauptsignale"
  deckId: string;       // z.B. "hp"
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
**Ziel:** Signale aus der Ril 301 INB 2026 als strukturierte TypeScript-Daten und Bildmaterial erfassen; Vollständigkeit fachlich prüfen.

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
- [ ] 2.3 Fallback-Darstellung wenn Bild fehlt (Platzhalter + Signalname); aktuell nur `img` mit Alternativtext, kein Fehler-Fallback
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

- [ ] 6.1 Statischen Export mit `output: "export"` in `next.config.js` konfigurieren und `npm run build` / `out/` prüfen; aktuell nicht konfiguriert, unabhängig vom Vercel-Deployment in WP 8.1
- [x] 6.2 `<iframe>`-Einbettungsanleitung in [README.md](README.md#einbettung) dokumentiert
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
- [ ] 7.6 Vollständigen Offline-Start absichern und prüfen (HTML wird vom aktuellen Service Worker nicht gecached)

---

### WP 8 — Deployment & Integration
- [x] 8.1 Vercel-Deployment laut Projekthistorie eingerichtet (`signalbuch-flashcards.vercel.app`); regulärer Next.js-Build, kein konfigurierter statischer Export (siehe WP 6.1)
- [x] 8.2 Direktstart per `?deck=` für `<iframe>`-Einbettung implementiert; Hosting-/Host-Konfiguration muss Einbettung zulassen
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
| PWA/Offline | PWA-Bausteine implementiert; vollständiger Offline-Start offen (WP 7.6) |

---

## 10. Offene Fragen & Entscheidungen

| # | Frage | Optionen | Status |
|---|---|---|---|
| 1 | Woher kommen die Signalbilder? | SVGs aus PDF extrahieren / neu zeichnen / DB-Lizenz prüfen | ✅ Alle 58 SVGs handgefertigt |
| 2 | Dürfen Ril-301-Inhalte 1:1 verwendet werden? | Interne Nutzung / Lizenz klären | ✅ Für Lernzwecke freigegeben |
| 3 | Einbettung: iframe vs. Web Component | iframe = einfach; WC = flexibler | ✅ iframe mit `?deck=` implementiert |
| 4 | Fortschritt: nur lokal oder mit Account? | localStorage für MVP, Account später | ✅ entschieden |
| 5 | Sprache der Code-Kommentare | Deutsch oder Englisch | ✅ Deutsch |

---

## 11. Sprint-Historie & Nächste Schritte

**Bisher dokumentierte Sprint-Historie bis April 2026** (kein Nachweis aktueller Deployment-Erreichbarkeit oder fachlicher Freigabe):
- ✅ Sprint 1: 18 Signale, 7 Decks, 18 SVGs
- ✅ Sprint 2: 3D-Flip-Animation, Keyboard-Shortcuts (Space/1–4), `?deck=`-URL-Parameter
- ✅ Sprint 3: GitHub-Repo + Vercel-Deployment, iframe-Einbettung live
- ✅ Sprint 4: Erweiterung auf 37 Signale, 10 Decks (Lf, El, Bü ergänzt)
- ✅ Sprint 5: Erweiterung auf 58 Karten in 13 Decks (Ts, So, Pf ergänzt)
- ✅ Sprint 6: SM-2 Spaced Repetition, localStorage-Persistenz, Dark Mode, PWA (Manifest + Service Worker + Icons), Streak-Anzeige, Alle-Decks-Modus, Feedback-Button (Microsoft Forms), In-App-Hilfe/Onboarding

**Sprint 7 — Nächste Prioritäten:**
1. **Fachliche Korrekturlesung** — Alle 58 Karten gegen Ril 301 INB 2026 abgleichen
2. **Multiple-Choice-Modus** — 4 Bilder, welches bedeutet was?
3. **Barrierefreiheit** — aria-labels, WCAG-Kontraste, Tastaturnavigation komplett
4. **Analytics** — datenschutzkonform (Plausible o.ä.) um Nutzungsverhalten zu verstehen
5. **Umgekehrter Modus** — Bedeutung vorne, Signalbild/Name hinten

---

*Zuletzt aktualisiert: 5. Oktober 2026 (Dokumentationsabgleich mit Repository-Stand `306b094`; keine funktionalen Änderungen)*
