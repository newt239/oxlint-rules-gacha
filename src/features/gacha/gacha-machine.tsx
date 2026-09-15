"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";
import { useRouter } from "next/navigation";

import { drawAndRecord, useCollection, useFilter } from "#/lib/use-draw";
import { layout } from "#/styles/tokens.stylex";

import { FilterPanel } from "./filter-panel";

import type { Dictionary } from "#/i18n";

const styles = stylex.create({
  main: {
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingInline: layout.gutter,
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
      <h1>{dictionary.tagline}</h1>
      <button aria-busy={drawing} disabled={drawing} onClick={handleClick} type="button">
        {dictionary.drawButton}
      </button>
      <output>{drawing ? dictionary.drawing : ""}</output>
      <p>{dictionary.drawnCount.replace("{count}", String(collection.length))}</p>
      <FilterPanel dictionary={dictionary} />
    </main>
  );
};
