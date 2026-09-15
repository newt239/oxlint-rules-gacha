"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";
import { useRouter } from "next/navigation";

import { ActionButton } from "#/components/action-button";
import { drawAndRecord, useCollection, useFilter } from "#/lib/use-draw";
import { color, font, layout } from "#/styles/tokens.stylex";

import { FilterPanel } from "./filter-panel";

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
  count: {
    color: color.inkDim,
    fontFamily: font.mono,
    fontSize: "0.8125rem",
    margin: 0,
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
  const [drawing, setDrawing] = useState(false);

  const handleClick = () => {
    setDrawing(true);
    drawAndRecord(lang, collection, filter)
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
      <div {...stylex.props(styles.cabinet)}>
        <ActionButton busy={drawing} onClick={handleClick} variant="primary">
          {dictionary.drawButton}
        </ActionButton>
        <output {...stylex.props(styles.status)}>{drawing ? dictionary.drawing : ""}</output>
        <p {...stylex.props(styles.count)}>
          {dictionary.drawnCount.replace("{count}", String(collection.length))}
        </p>
      </div>
      <FilterPanel dictionary={dictionary} />
    </main>
  );
};
