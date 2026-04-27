# Signalbuch Flash Card App — Copilot Instructions

## Stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- CSS variables for theming (`var(--bg)`, `var(--card-bg)`, `var(--text)`, `var(--accent)`, etc.)
- Light/dark theme via `html[data-theme]`

## Conventions
- All components are in `src/components/`
- Types are in `src/lib/types.ts`
- Sample/seed data is in `src/lib/sampleData.ts`
- Use `.card`, `.btn`, `.btn-primary`, `.btn-danger`, `.input`, `.muted` CSS utility classes (defined in globals.css)
- All destructive actions require `window.confirm()` before proceeding
- Buttons inside forms must use `type="button"` to avoid accidental form submits

## Roadmap / planned features
- Persistent storage (localStorage or backend API)
- Spaced repetition scheduling (SM-2 algorithm)
- Couples / household mode — two users, shared decks
- Contextual study prompts linked to goals/topics
- Progress tracking over time
