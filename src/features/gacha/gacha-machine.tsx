"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

import * as stylex from "@stylexjs/stylex";
import { useAnimate, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ActionButton } from "#/components/action-button";
import { consumeAutoDraw } from "#/lib/auto-draw";
import { ruleHref } from "#/lib/rule-href";
import { skipHintStore } from "#/lib/stores";
import { drawAndRecord, useCollection, useFilter, useSkipHintSeen } from "#/lib/use-draw";
import { color, font, layout } from "#/styles/tokens.stylex";

import { FilterPanel } from "./filter-panel";
import { RevealText } from "./reveal-text";
import { CAPSULE, type Phase, playSequence, SPEED_LINES } from "./sequence";
import { SpeedLines } from "./speed-lines";

import type { RuleIndexEntry } from "#/lib/rules";

const CapsuleCanvas = dynamic(
  async () => {
    const loaded = await import("./capsule-canvas");

    return loaded.CapsuleCanvas;
  },
  { ssr: false },
);

const styles = stylex.create({
  cabinet: {
    alignItems: "center",
    backgroundColor: color.cabinet2,
    borderRadius: "28px",
    display: "flex",
    flexDirection: "column",
    isolation: "isolate",
    marginBlockStart: "2.5rem",
    overflow: "hidden",
    paddingBlock: "3rem",
    paddingInline: layout.gutter,
    position: "relative",
  },
  collectionLink: {
    color: color.inkDim,
    display: "inline-block",
    fontSize: "0.75rem",
    marginBlockStart: "2rem",
  },
  controls: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBlockStart: "1.5rem",
  },
  flash: {
    backgroundColor: color.ink,
    inset: 0,
    opacity: 0,
    pointerEvents: "none",
    position: "absolute",
  },
  hint: {
    color: color.inkDim,
    fontSize: "0.75rem",
    margin: 0,
    textAlign: "center",
  },
  main: {
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingBlock: "3rem 4rem",
    paddingInline: layout.gutter,
  },
  stage: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    justifyContent: "center",
    minHeight: "240px",
  },
  status: {
    color: color.inkDim,
    fontFamily: font.mono,
    fontSize: "0.75rem",
    minHeight: "1.5em",
    overflowWrap: "anywhere",
    textAlign: "center",
  },
  tagline: {
    fontSize: "clamp(1.5rem, 6vw, 2rem)",
    lineHeight: 1.4,
    margin: 0,
    textAlign: "center",
  },
});

export const GachaMachine = () => {
  const router = useRouter();
  const collection = useCollection();
  const filter = useFilter();
  const skipHintSeen = useSkipHintSeen();
  const reducedMotion = useReducedMotion() ?? false;
  const [scope, animate] = useAnimate();
  const [drawing, setDrawing] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [picked, setPicked] = useState<RuleIndexEntry | null>(null);
  const [announced, setAnnounced] = useState("");
  const skipRef = useRef<((skipped: boolean) => void) | null>(null);

  // スキップはページ全体のタップとキー操作で受けるため、window にリスナーを張る
  useEffect(() => {
    const skip = () => {
      skipRef.current?.(true);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === " ") {
        skip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", skip);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  const handleClick = () => {
    setDrawing(true);
    setPicked(null);
    setAnnounced("");
    skipHintStore.set(true);

    const skip = Promise.withResolvers<boolean>();

    skipRef.current = skip.resolve;

    const pick = drawAndRecord(collection, filter);

    const run = async (): Promise<RuleIndexEntry | null> => {
      const entry = await pick;

      if (entry !== null) {
        router.prefetch(ruleHref(entry.plugin, entry.name));
      }

      return playSequence({
        animate,
        picked: pick,
        reducedMotion,
        setPhase,
        setPicked,
        skipped: skip.promise,
      });
    };

    run()
      .then((entry) => {
        skipRef.current = null;

        if (entry === null) {
          animate([
            [CAPSULE, { opacity: 1, scale: 1, y: 0 }, { duration: 0.25 }],
            [SPEED_LINES, { opacity: 0 }, { at: 0, duration: 0.25 }],
          ]);
          setDrawing(false);
          setPhase("idle");

          return;
        }

        setAnnounced(entry.id);
        router.push(ruleHref(entry.plugin, entry.name));
      })
      .catch((error: unknown) => {
        skipRef.current = null;
        setDrawing(false);
        setPhase("idle");
        console.error(error);
      });
  };

  const startAutoDraw = useEffectEvent(() => {
    handleClick();
  });

  // ルールページからの再抽選の合図は sessionStorage にあり、マウント後にしか読めない
  useEffect(() => {
    const timer = setTimeout(() => {
      if (consumeAutoDraw()) {
        startAutoDraw();
      }
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const status = announced === "" && drawing ? "Drawing a rule" : announced;

  return (
    <main {...stylex.props(styles.main)}>
      <h1 {...stylex.props(styles.tagline)}>Draw one oxlint rule at a time.</h1>
      <div ref={scope}>
        <div data-cabinet {...stylex.props(styles.cabinet)}>
          <SpeedLines />
          <div {...stylex.props(styles.stage)}>
            <div aria-hidden data-capsule>
              <CapsuleCanvas
                category={picked === null ? null : picked.category}
                open={phase === "open" || phase === "reveal"}
                spinning={phase === "rattle"}
              />
            </div>
            {picked !== null && (
              <RevealText
                key={picked.id}
                category={picked.category}
                ruleId={picked.id}
                shuffle={phase === "reveal"}
              />
            )}
          </div>
          <div aria-hidden data-flash {...stylex.props(styles.flash)} />
        </div>
      </div>
      <div {...stylex.props(styles.controls)}>
        <ActionButton busy={drawing} onClick={handleClick} variant="primary">
          Draw a rule
        </ActionButton>
        <output {...stylex.props(styles.status)}>{status}</output>
      </div>
      {!skipHintSeen && (
        <p {...stylex.props(styles.hint)}>Tap, or press Esc or Space, to skip the animation.</p>
      )}
      <FilterPanel />
      <Link href="/collection" {...stylex.props(styles.collectionLink)}>
        See your collection
      </Link>
    </main>
  );
};
