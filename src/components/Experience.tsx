"use client";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import type { SceneController } from "@/three/scene";
import { newGame, scrollDestination, type Game } from "@/three/game";
export default function Experience() {
  const [mode, setMode] = useState<"simple" | "explore">("simple"),
    [playing, setPlaying] = useState(false),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [game, setGame] = useState<Game>(newGame),
    [best, setBest] = useState(0),
    [active, setActive] = useState("home");
  const host = useRef<HTMLDivElement>(null),
    controller = useRef<SceneController | null>(null),
    savedScroll = useRef(0),
    dialog = useRef<HTMLDivElement>(null),
    playButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let saved;
    try {
      saved = localStorage.getItem("portfolio-mode");
      setBest(Number(localStorage.getItem("frog-best")) || 0);
    } catch {}
    setMode(
      saved === "simple" ||
        (!saved && matchMedia("(prefers-reduced-motion: reduce)").matches)
        ? "simple"
        : "explore",
    );
  }, []);
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    return () => {
      delete document.documentElement.dataset.mode;
    };
  }, [mode]);
  useEffect(() => {
    if (mode !== "explore" || !host.current) return;
    let cancelled = false;
    setReady(false);
    setFailed(false);
    import("@/three/scene")
      .then(({ createScene }) => {
        if (cancelled || !host.current) return;
        try {
          controller.current = createScene(host.current, setGame, () =>
            setFailed(true),
          );
          setReady(true);
          update();
        } catch {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true));
    function update() {
      controller.current?.scroll(scrollDestination(scrollY));
      controller.current?.landmarks(
        ["home", "about", "skills", "projects", "gallery", "contact"].map(
          (id) =>
            scrollDestination(
              Math.max(0, (document.getElementById(id)?.offsetTop || 0) - 110),
            ),
        ),
      );
    }
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      cancelled = true;
      controller.current?.dispose();
      controller.current = null;
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, [mode]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (game.score > best) {
      setBest(game.score);
      try {
        localStorage.setItem("frog-best", String(game.score));
      } catch {}
    }
  }, [game.score, best]);
  useEffect(() => {
    if (
      mode !== "explore" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const elements = document.querySelectorAll<HTMLElement>(
      ".portfolio section > h2, .portfolio section > p, .skill-groups > div, .project-card, .gallery > a, .about-note",
    );
    document.documentElement.classList.add("scroll-reveals");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -25px 0px" },
    );
    elements.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", `${(i % 3) * 65}ms`);
      observer.observe(el);
    });
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("scroll-reveals");
      elements.forEach((el) => el.classList.remove("reveal", "is-visible"));
    };
  }, [mode]);
  useEffect(() => {
    if (!playing) return;
    const main = document.getElementById("portfolio");
    main?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.playing = "true";
    dialog.current?.focus();
    function key(e: KeyboardEvent) {
      const moves: Record<string, [number, number]> = {
        ArrowUp: [0, 1],
        w: [0, 1],
        ArrowDown: [0, -1],
        s: [0, -1],
        ArrowLeft: [-1, 0],
        a: [-1, 0],
        ArrowRight: [1, 0],
        d: [1, 0],
      };
      if (moves[e.key]) {
        e.preventDefault();
        controller.current?.move(...moves[e.key]);
      }
      if (e.key === "Escape") controller.current?.pause();
      if (e.key === "Tab") {
        const nodes =
          dialog.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialog.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    addEventListener("keydown", key);
    return () => {
      main?.removeAttribute("inert");
      document.body.style.overflow = "";
      delete document.documentElement.dataset.playing;
      removeEventListener("keydown", key);
    };
  }, [playing]);
  function select(next: "simple" | "explore") {
    setMode(next);
    try {
      localStorage.setItem("portfolio-mode", next);
    } catch {}
  }
  function exit() {
    controller.current?.exit();
    setPlaying(false);
    requestAnimationFrame(() => {
      window.scrollTo(0, savedScroll.current);
      playButton.current?.focus();
    });
  }
  return (
    <>
      <header className="site-header" inert={playing}>
        <a className="brand" href="/#home" aria-label="Emman home">
          <span className="frog-mark">••</span> Emman
          <span className="brand-dot">.</span>
        </a>
        <nav aria-label="Main navigation">
          {["about", "skills", "projects", "contact"].map((id) => (
            <a
              key={id}
              href={id === "contact" ? "/contact/" : `/#${id}`}
              aria-current={active === id ? "location" : undefined}
            >
              {id}
            </a>
          ))}
        </nav>
        <div className="mode-switch" aria-label="Presentation mode">
          <button
            aria-pressed={mode === "explore"}
            onClick={() => select("explore")}
          >
            Explore
          </button>
          <button
            aria-pressed={mode === "simple"}
            onClick={() => select("simple")}
          >
            Simple
          </button>
        </div>
      </header>
      {mode === "explore" && (
        <aside
          className={`world ${playing ? "world-playing" : ""}`}
          aria-label="Interactive frog world"
        >
          <div className="scene-host" ref={host} />
          {(!ready || failed) && (
            <div className="scene-message">
              {failed
                ? "The 3D world is unavailable. Your portfolio is ready below."
                : "Growing a little world…"}
              {failed && (
                <button onClick={() => select("simple")}>
                  Open simple view
                </button>
              )}
            </div>
          )}
          {!playing && ready && !failed && (
            <>
              <div className="world-label">
                <span className="live-dot" /> A LITTLE WORLD TO EXPLORE
              </div>
              <div className="world-caption">
                <span>
                  Follow the frog.<small>Scroll to take the next step.</small>
                </span>
                <button
                  ref={playButton}
                  className="dark-button"
                  onClick={() => {
                    savedScroll.current = scrollY;
                    controller.current?.play();
                    setPlaying(true);
                  }}
                >
                  Play the crossing ↗
                </button>
              </div>
            </>
          )}
        </aside>
      )}
      {playing && (
        <div
          className="game-ui"
          role="dialog"
          aria-modal="true"
          aria-label="Frog crossing game"
          ref={dialog}
          tabIndex={-1}
        >
          <div className="game-top">
            <span>
              CROSSING CLUB <b>{String(game.score).padStart(2, "0")}</b>{" "}
              <small>BEST {best}</small>
            </span>
            <div>
              <ThemeToggle inGame />
              <button
                onClick={() => controller.current?.pause()}
                disabled={game.status !== "playing" && game.status !== "paused"}
              >
                {game.status === "paused" ? "Resume" : "Pause"}
              </button>
              <button onClick={exit}>Exit game ×</button>
            </div>
          </div>
          {game.status !== "playing" && (
            <div className="game-card">
              <span className="eyebrow">ONE HOP AT A TIME</span>
              <h2>
                {game.status === "ready"
                  ? "How far can you hop?"
                  : game.status === "lost"
                    ? "A little road bump."
                    : "Take a breath."}
              </h2>
              <p>
                Use arrow keys, WASD, or the buttons below. Cross the roads,
                avoid the cars, and keep going. The woodland never ends.
              </p>
              <button
                className="dark-button"
                onClick={() =>
                  game.status === "paused"
                    ? controller.current?.pause()
                    : controller.current?.start()
                }
              >
                {game.status === "ready"
                  ? "Let’s hop →"
                  : game.status === "paused"
                    ? "Keep going →"
                    : "Try again →"}
              </button>
            </div>
          )}
          <div className="touch-controls">
            {[
              ["←", -1, 0, "Move left"],
              ["↑", 0, 1, "Move forward"],
              ["↓", 0, -1, "Move backward"],
              ["→", 1, 0, "Move right"],
            ].map(([label, x, r, aria]) => (
              <button
                key={label}
                aria-label={String(aria)}
                onClick={() => controller.current?.move(Number(x), Number(r))}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="sr-only" aria-live="polite">
            {game.status}. Score {game.score}.
          </span>
        </div>
      )}
    </>
  );
}
