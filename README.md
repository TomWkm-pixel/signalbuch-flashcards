# Signalbuch – Lernkarten

Deutschsprachige Lern-App für Eisenbahnsignale mit Bezug auf Ril 301 INB 2026, gebaut mit Next.js 14 (App Router), TypeScript und Tailwind CSS.

## Aktueller Funktionsumfang

- **58 vorgegebene Signalkarten in 13 Decks**, definiert in [`src/lib/data/signals.ts`](src/lib/data/signals.ts), mit SVG-Signalbildern, Bedeutung, Regelreferenz und ergänzenden Merkhilfen.
- Deck-Auswahl oder **„Alle Signale“** über alle Gruppen; Direktstart per `?deck=hp` bzw. `?deck=alle`.
- Lernsession mit **3D-Kartenflip**, Fortschrittsanzeige und Selbstbewertung: **Nochmal / Schwer / Gut / Einfach**. Leertaste dreht die Karte um, **1–4** bewerten die aufgedeckte Karte.
- **SM-2-Wiederholungsplanung**: Neue und fällige Karten werden gemischt abgefragt. Ist keine Karte fällig, werden alle Karten des gewählten Decks zum weiteren Üben angeboten.
- Session-Zusammenfassung mit Bewertungsverteilung und Anteil „gewusst“ (Gut + Einfach); erneutes Üben möglich.
- Lernstand und Fälligkeiten je Deck sowie **Streaks** nach abgeschlossenen Sessions. Speicherung im Browser via `localStorage`, ohne Account oder geräteübergreifende Synchronisation.
- **Hell-/Dunkelmodus**, In-App-Hilfe und Feedback-Link zu Microsoft Forms.
- **PWA-Bausteine**: Manifest, Icons, Installationshinweise und Service Worker mit Asset-Caching. Vollständiges Offline-Starten ist derzeit nicht abgesichert: [`public/sw.js`](public/sw.js) cached geladene Assets, speichert aber keine HTML-Seiten für den Offline-Fallback.
- **iframe-Einbettung** mit Deck-Auswahl über URL-Parameter.

Die aktive App bietet keine Oberfläche zum Erstellen, Bearbeiten oder Löschen eigener Decks/Karten. `DeckList.tsx` und `sampleData.ts` stammen aus dem generischen Prototyp und werden von der Startseite nicht verwendet. Multiple Choice, Prüfungsquiz, umgekehrte Karten, Accounts und Web-Component-Wrapper sind nicht implementiert.

Die 58 Karten beschreiben den vorhandenen Datenbestand, keine bestätigte vollständige Abdeckung der Ril 301. Die fachliche Prüfung bleibt offen; Status und Planung stehen in [`PRODUCT.md`](PRODUCT.md).

## Lokal starten

```bash
npm install
npm run dev
```

Anschließend [http://localhost:3000](http://localhost:3000) öffnen.

## Skripte

| Befehl | Beschreibung |
|---|---|
| `npm run dev` | Entwicklungsserver (`next dev`) |
| `npm run build` | Regulärer Next.js-Produktionsbuild (`next build`) |
| `npm start` | Produktionsserver nach dem Build (`next start`) |
| `npm run lint` | ESLint über `next lint` |

## Deployment: Next.js / Vercel und statischer Export

Als Vercel-Adresse ist [signalbuch-flashcards.vercel.app](https://signalbuch-flashcards.vercel.app) dokumentiert. Der Repository-Stand verwendet einen regulären Next.js-Build: [`next.config.js`](next.config.js) exportiert eine leere Konfiguration; [`package.json`](package.json) enthält `next build` und `next start`.

**Ein statischer Export ist nicht konfiguriert.** Ein Vercel-Deployment kann mit dieser Next.js-Konfiguration funktionieren und belegt keinen statischen Export. Auch statisch vorgerenderte Seiten im normalen Build sind kein eigenständig auslieferbarer `out/`-Export.

Für einen künftigen statischen Export müsste `output: "export"` in `next.config.js` ergänzt und der mit `npm run build` erzeugte `out/`-Ordner separat geprüft werden. In Next.js 14 ersetzt diese Konfiguration den entfernten Befehl `next export`; siehe [Next.js-14-Dokumentation](https://nextjs.org/docs/14/app/building-your-application/deploying/static-exports). Dieser Schritt bleibt in **WP 6.1** offen. Die Dokumentationskorrektur ändert die Build-Konfiguration nicht.

## Einbettung

Beispiel für den Direktstart des Decks „Hauptsignale“:

```html
<iframe
  src="https://signalbuch-flashcards.vercel.app/?deck=hp"
  title="Signalbuch – Hauptsignale lernen"
  width="100%"
  height="800"
  style="border: 0"
></iframe>
```

Unterstützte Deck-IDs: `hp`, `vr`, `ks`, `sh`, `ra`, `zs`, `ne`, `lf`, `el`, `bu`, `ts`, `so`, `pf`; `alle` kombiniert alle Decks. Ohne gültigen `deck`-Parameter erscheint die Übersicht. Die Auswahl wird beim Laden ausgewertet.

Die Einbettung nutzt die normale App und setzt voraus, dass die Hosting- und Host-Seiten-Konfiguration iframes zulässt. Sie benötigt keinen statischen Export. Ein spezielles transparentes Embed-Layout, Host-Theme-Synchronisation per `postMessage` und ein Web-Component-Wrapper sind noch offen.
