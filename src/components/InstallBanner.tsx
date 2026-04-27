"use client";

import { useState, useEffect } from "react";

const INSTALL_DISMISSED_KEY = "signalbuch_install_dismissed";

// Detect iOS Safari
function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

// Detect standalone mode (already installed)
function isStandalone() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true;
}

export default function InstallBanner() {
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (isStandalone()) return; // already installed
    if (localStorage.getItem(INSTALL_DISMISSED_KEY)) return;

    const iosDevice = isIOS();
    setIos(iosDevice);

    if (iosDevice) {
      // On iOS we always show the hint (no install event)
      setShow(true);
    } else {
      // On Chrome/Android wait for beforeinstallprompt
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShow(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(INSTALL_DISMISSED_KEY, "1");
  };

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") dismiss();
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderBottom: "1px solid var(--border)",
        padding: "0.6rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        flexWrap: "wrap",
        fontSize: "0.8rem",
      }}
    >
      <span style={{ color: "var(--text)", flex: 1, minWidth: 0 }}>
        {ios ? (
          <>
            📲 <strong>App installieren:</strong> Tippe auf{" "}
            <span style={{ display: "inline-block", fontSize: "1rem" }}>⎋</span>{" "}
            „Teilen" → <strong>„Zum Home‑Bildschirm"</strong>
          </>
        ) : (
          <>
            📲 <strong>App installieren</strong> — offline nutzbar, wie eine echte App
          </>
        )}
      </span>
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        {!ios && deferredPrompt && (
          <button
            type="button"
            onClick={install}
            className="btn btn-primary"
            style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem" }}
          >
            Installieren
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          className="btn"
          style={{
            fontSize: "0.78rem",
            padding: "0.3rem 0.6rem",
            color: "var(--text-muted)",
            background: "none",
            border: "1px solid var(--border)",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
