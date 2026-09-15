"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";
import { useRouter } from "next/navigation";

import { ActionButton } from "#/components/action-button";
import { drawAndRecord, useCollection, useFilter } from "#/lib/use-draw";

import type { Dictionary } from "#/i18n";
import type { RuleDetail } from "#/lib/rules";

const styles = stylex.create({
  group: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
});

type RuleActionsProps = {
  detail: RuleDetail;
  dictionary: Dictionary;
  lang: string;
};

export const RuleActions = ({ detail, dictionary, lang }: RuleActionsProps) => {
  const router = useRouter();
  const collection = useCollection();
  const filter = useFilter();
  const [drawing, setDrawing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDraw = () => {
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

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${JSON.stringify({ rules: { [detail.id]: "error" } }, null, 2)}\n`)
      .then(() => {
        setCopied(true);
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  };

  return (
    <div {...stylex.props(styles.group)}>
      <ActionButton busy={drawing} onClick={handleDraw} variant="primary">
        {dictionary.drawAgain}
      </ActionButton>
      <ActionButton onClick={handleCopy} variant="secondary">
        {copied ? dictionary.copied : dictionary.copyConfig}
      </ActionButton>
    </div>
  );
};
