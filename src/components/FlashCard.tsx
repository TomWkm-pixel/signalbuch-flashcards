"use client";

import type { SignalCard } from "@/lib/types";

type Props = {
  card: SignalCard;
  flipped: boolean;
  onClick: () => void;
};

const faceBase: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  borderRadius: "var(--radius, 12px)",
  padding: "1.25rem",
  border: "1px solid var(--border)",
  background: "var(--card-bg)",
  display: "flex",
  flexDirection: "column",
};

export default function FlashCard({ card, flipped, onClick }: Props) {
  return (
    <div
      className="cursor-pointer select-none"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={flipped ? "Vorderseite anzeigen" : "Antwort aufdecken"}
      onKeyDown={(e) => e.key === " " && (e.preventDefault(), onClick())}
      style={{ perspective: "1200px", minHeight: 340 }}
    >
      {/* 3-D flipper */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: 340,
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* ── Vorderseite ─────────────────────────────────────────────────── */}
        <div style={faceBase}>
          {/* Kopfzeile */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{ background: "var(--border)", color: "var(--text-muted)" }}
            >
              {card.deckId.toUpperCase()}
            </span>
            <span className="muted text-xs">Signal erkennen</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 flex-1 py-2">
            <div
              className="rounded-xl flex items-center justify-center"
              style={{ background: "#0d0d0d", width: 180, height: 180, padding: "1rem" }}
            >
              <img
                src={card.image}
                alt={`Signal ${card.signalName}`}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold tracking-wide" style={{ color: "var(--text)" }}>
                {card.signalName}
              </div>
              <div className="muted text-sm mt-1">
                Klicken oder{" "}
                <kbd
                  className="px-1 py-0.5 rounded text-xs"
                  style={{ border: "1px solid var(--border)" }}
                >
                  Leertaste
                </kbd>{" "}
                zum Aufdecken
              </div>
            </div>
          </div>
        </div>

        {/* ── Rückseite ────────────────────────────────────────────────────── */}
        <div style={{ ...faceBase, transform: "rotateY(180deg)" }}>
          {/* Kopfzeile */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{ background: "var(--border)", color: "var(--text-muted)" }}
            >
              {card.deckId.toUpperCase()}
            </span>
            <span className="muted text-xs">Bedeutung</span>
          </div>

          <div className="flex gap-4 items-start mb-4">
            {/* Thumbnail */}
            <div
              className="rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{ background: "#0d0d0d", width: 72, height: 72, padding: "0.4rem" }}
            >
              <img
                src={card.image}
                alt={`Signal ${card.signalName}`}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div>
              <div className="font-bold text-lg" style={{ color: "var(--text)" }}>
                {card.signalName}
              </div>
              <div className="text-xs font-mono mt-0.5" style={{ color: "var(--accent)" }}>
                {card.rule}
              </div>
            </div>
          </div>

          {/* Bedeutung */}
          <div
            className="rounded-lg p-3 text-sm leading-relaxed whitespace-pre-line mb-3"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {card.meaning}
          </div>

          {/* Merkhilfe */}
          {card.notes && (
            <div
              className="text-xs rounded-lg p-3 leading-relaxed"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              💡 {card.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
