import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signalbuch Flash Card App",
  description: "Study smarter with flashcard decks",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen">
        <header className="border-b" style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}>
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <span className="font-semibold tracking-tight" style={{ color: "var(--text)" }}>
              📖 Signalbuch
            </span>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
