import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const FEEDBACK_URL =
  "https://forms.cloud.microsoft/e/UwAyA3i99m";

export const metadata: Metadata = {
  title: "Signalbuch – Eisenbahnsignale lernen",
  description:
    "Lernkarten für Eisenbahnsignale nach Ril 301 INB 2026. Für Azubis, Triebfahrzeugführer und alle, die die deutschen Bahnsignale lernen wollen.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Signalbuch",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen">
        <header className="border-b" style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}>
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <span className="font-semibold tracking-tight" style={{ color: "var(--text)" }}>
              📖 Signalbuch
            </span>
            <div className="flex items-center gap-2">
              <a
                href={FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Feedback geben"
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  padding: "0.3rem 0.65rem",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                💬 Feedback
              </a>
              <ThemeProvider />
            </div>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
