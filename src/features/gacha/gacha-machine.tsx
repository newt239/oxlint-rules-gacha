"use client";

import { useEffect, useRef, useState } from "react";

import * as stylex from "@stylexjs/stylex";
import { useAnimate, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ActionButton } from "#/components/action-button";
import { obtainedIds } from "#/lib/collection";
import { skipHintStore } from "#/lib/stores";
import { drawAndRecord, useCollection, useFilter, useSkipHintSeen } from "#/lib/use-draw";
import { color, font, layout } from "#/styles/tokens.stylex";

import { FilterPanel } from "./filter-panel";
import { playSequence } from "./sequence";

import type { Dictionary } from "#/i18n";

const styles = stylex.create({
  cabinet: {
    alignItems: "center",
    backgroundColor: color.cabinet2,
    borderRadius: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    marginBlockStart: "2.5rem",
    paddingBlock: "3rem",
    paddingInline: layout.gutter,
  },
  capsule: {
    background: `linear-gradient(to bottom, ${color.ink} 0 50%, ${color.catSuspicious} 50% 100%)`,
    borderRadius: "999px",
    height: "88px",
    opacity: 0,
    width: "88px",
  },
  capsuleSlot: {
    alignItems: "center",
    display: "flex",
    height: "88px",
    justifyContent: "center",
  },
  collectionLink: {
    color: color.inkDim,
    display: "inline-block",
    fontSize: "0.875rem",
    marginBlockStart: "2rem",
  },
  count: {
    color: color.inkDim,
    fontFamily: font.mono,
    fontSize: "0.8125rem",
    margin: 0,
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
  status: {
    color: color.inkDim,
    fontSize: "0.8125rem",
    minHeight: "1.5em",
  },
  tagline: {
    fontSize: "clamp(1.5rem, 6vw, 2rem)",
    lineHeight: 1.4,
    margin: 0,
    textAlign: "center",
  },
});

type GachaMachineProps = {
  dictionary: Dictionary;
  lang: string;
};

export const GachaMachine = ({ dictionary, lang }: GachaMachineProps) => {
  const router = useRouter();
  const collection = useCollection();
  const filter = useFilter();
  const skipHintSeen = useSkipHintSeen();
  const reducedMotion = useReducedMotion() ?? false;
  const [scope, animate] = useAnimate();
  const [drawing, setDrawing] = useState(false);
  const skippedRef = useRef(false);

  useEffect(() => {
    const skip = () => {
      if (drawing) {
        skippedRef.current = true;
      }
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
  }, [drawing]);

  const handleClick = () => {
    setDrawing(true);
    skippedRef.current = false;
    skipHintStore.set(true);

    const sequence = playSequence(animate, reducedMotion, () => skippedRef.current);

    drawAndRecord(lang, collection, filter)
      .then(async (href) => {
        if (href !== null) {
          router.prefetch(href);
        }

        await sequence;

        return href;
      })
      .then((href) => {
        if (href === null) {
          setDrawing(false);

          return;
        }

        router.push(href);
      })
      .catch((error: unknown) => {
        setDrawing(false);
        console.error(error);
      });
  };

  return (
    <main {...stylex.props(styles.main)}>
      <h1 {...stylex.props(styles.tagline)}>{dictionary.tagline}</h1>
      <div ref={scope}>
        <div data-cabinet {...stylex.props(styles.cabinet)}>
          <div aria-hidden {...stylex.props(styles.capsuleSlot)}>
            <div data-capsule {...stylex.props(styles.capsule)} />
          </div>
          <ActionButton busy={drawing} onClick={handleClick} variant="primary">
            {dictionary.drawButton}
          </ActionButton>
          <output {...stylex.props(styles.status)}>{drawing ? dictionary.drawing : ""}</output>
          <p {...stylex.props(styles.count)}>
            {dictionary.drawnCount.replace("{count}", String(obtainedIds(collection).length))}
          </p>
        </div>
      </div>
      {!skipHintSeen && <p {...stylex.props(styles.hint)}>{dictionary.skipHint}</p>}
      <FilterPanel dictionary={dictionary} />
      <Link href={`/${lang}/collection`} {...stylex.props(styles.collectionLink)}>
        {dictionary.viewCollection}
      </Link>
    </main>
  );
};
