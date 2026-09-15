"use client";

import { useTransition } from "react";

import * as stylex from "@stylexjs/stylex";
import { useRouter } from "next/navigation";

import { ActionButton } from "#/components/action-button";
import { requestAutoDraw } from "#/lib/auto-draw";
import { obtainedIds } from "#/lib/collection";
import { useCollection } from "#/lib/use-draw";
import { color, font } from "#/styles/tokens.stylex";

const styles = stylex.create({
  count: {
    color: color.inkDim,
    fontFamily: font.mono,
    fontSize: "0.8125rem",
    margin: 0,
  },
  group: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
});

export const RuleActions = () => {
  const router = useRouter();
  const collection = useCollection();
  const [drawing, startDrawing] = useTransition();

  const handleDraw = () => {
    requestAutoDraw();
    startDrawing(() => {
      router.push("/");
    });
  };

  return (
    <div {...stylex.props(styles.group)}>
      <ActionButton busy={drawing} onClick={handleDraw} variant="primary">
        Draw again
      </ActionButton>
      <p {...stylex.props(styles.count)}>{obtainedIds(collection).length} rules drawn</p>
    </div>
  );
};
