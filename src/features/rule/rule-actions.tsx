"use client";

import * as stylex from "@stylexjs/stylex";

import { ActionLink } from "#/components/action-link";
import { requestAutoDraw } from "#/lib/auto-draw";
import { obtainedIds } from "#/lib/collection";
import { useCollection } from "#/lib/use-draw";
import { color, font, text } from "#/styles/tokens.stylex";

const styles = stylex.create({
  count: {
    color: color.inkDim,
    fontFamily: font.mono,
    fontSize: text.md,
    margin: 0,
  },
  group: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "space-between",
    marginBlockStart: "2.5rem",
  },
});

export const RuleActions = () => {
  const collection = useCollection();

  return (
    <div {...stylex.props(styles.group)}>
      <p {...stylex.props(styles.count)}>{obtainedIds(collection).length} rules drawn</p>
      <ActionLink href="/" onClick={requestAutoDraw} variant="primary">
        Draw again
      </ActionLink>
    </div>
  );
};
