"use client";
import { useEffect, useState } from "react";

let themeSweep: ViewTransition | undefined;

export default function ThemeToggle({ inGame = false }: { inGame?: boolean }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const system = matchMedia("(prefers-color-scheme: dark)");
    function sync() {
      setDark(document.documentElement.dataset.theme === "dark");
    }
    function applyPreference() {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("portfolio-theme");
      } catch {}
      document.documentElement.dataset.theme =
        saved || (system.matches ? "dark" : "light");
      window.dispatchEvent(new Event("portfolio-theme"));
    }
    window.addEventListener("portfolio-theme", sync);
    system.addEventListener("change", applyPreference);
    applyPreference();
    return () => {
      window.removeEventListener("portfolio-theme", sync);
      system.removeEventListener("change", applyPreference);
    };
  }, []);
  function toggle() {
    const root = document.documentElement;
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    function applyTheme() {
      root.dataset.theme = theme;
      try {
        localStorage.setItem("portfolio-theme", theme);
      } catch {}
      window.dispatchEvent(new Event("portfolio-theme"));
    }
    if (themeSweep) return;
    if (
      !document.startViewTransition ||
      inGame ||
      root.dataset.mode !== "explore" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      applyTheme();
      return;
    }
    root.dataset.themeSweep = theme;
    themeSweep = document.startViewTransition(applyTheme);
    void themeSweep.finished
      .finally(() => {
        delete root.dataset.themeSweep;
        themeSweep = undefined;
      })
      .catch(() => {});
  }
  return (
    <button
      className={inGame ? "game-theme" : "theme-toggle"}
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Daylight" : "Nightfall"}
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}
