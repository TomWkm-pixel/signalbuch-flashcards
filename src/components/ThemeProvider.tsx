"use client";

import { useEffect, useState } from "react";

/** Liest/schreibt das Theme in localStorage und setzt data-theme auf <html> */
export default function ThemeProvider() {
  const [dark, setDark] = useState(false);

  // Beim ersten Laden gespeichertes Theme oder System-Präferenz lesen
  useEffect(() => {
    const stored = localStorage.getItem("signalbuch_theme");
    const prefersDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(prefersDark);
    document.documentElement.setAttribute(
      "data-theme",
      prefersDark ? "dark" : "light"
    );
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("signalbuch_theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      title={dark ? "Helles Design aktivieren" : "Dunkles Design aktivieren"}
      aria-label={dark ? "Light Mode" : "Dark Mode"}
      style={{
        background: "none",
        border: "1px solid var(--border)",
        borderRadius: "0.5rem",
        padding: "0.3rem 0.6rem",
        cursor: "pointer",
        fontSize: "1.1rem",
        color: "var(--text)",
        lineHeight: 1,
      }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
