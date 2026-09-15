"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { drawAndRecord, useCollection, useFilter } from "#/lib/use-draw";

import type { Dictionary } from "#/i18n";

type DrawAgainButtonProps = {
  dictionary: Dictionary;
  lang: string;
};

export const DrawAgainButton = ({ dictionary, lang }: DrawAgainButtonProps) => {
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
    <button aria-busy={drawing} disabled={drawing} onClick={handleClick} type="button">
      {dictionary.drawAgain}
    </button>
  );
};
