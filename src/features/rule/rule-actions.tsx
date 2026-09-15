"use client";

import { useEffect } from "react";

import * as stylex from "@stylexjs/stylex";

import { ActionLink } from "#/components/action-link";
import { requestAutoDraw } from "#/lib/auto-draw";
import { hasObtained, obtainedIds, recordDraw } from "#/lib/collection";
import { loadRuleIndex } from "#/lib/rule-index-cache";
import { collectionStore } from "#/lib/stores";
import { useCollection } from "#/lib/use-draw";
import { color, font, text } from "#/styles/tokens.stylex";

import { ShareButton } from "./share-button";

const styles = stylex.create({
  buttons: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    justifyContent: "space-between",
  },
  group: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBlockStart: "2.5rem",
  },
  meta: {
    color: color.inkDim,
    fontFamily: font.mono,
    fontSize: text.md,
    margin: 0,
  },
});

const totalLabel = (count: number): string =>
  count === 1 ? "1 rule drawn" : `${count} rules drawn`;

type RuleActionsProps = {
  ruleId: string;
  shareUrl: string;
};

export const RuleActions = ({ ruleId, shareUrl }: RuleActionsProps) => {
  const collection = useCollection();

  // 共有リンクから開いたルールも入手扱いにする。localStorage は描画後しか読めない
  useEffect(() => {
    let cancelled = false;

    if (!hasObtained(collectionStore.getSnapshot(), ruleId)) {
      loadRuleIndex()
        .then(({ rulesetVersion }) => {
          const current = collectionStore.getSnapshot();

          if (!cancelled && !hasObtained(current, ruleId)) {
            collectionStore.set(recordDraw(current, ruleId, { now: Date.now(), rulesetVersion }));
          }
        })
        .catch((error: unknown) => {
          console.error(error);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [ruleId]);

  return (
    <div {...stylex.props(styles.group)}>
      <div {...stylex.props(styles.buttons)}>
        <ShareButton title={ruleId} url={shareUrl} />
        <ActionLink href="/" onClick={requestAutoDraw}>
          Draw again
        </ActionLink>
      </div>
      <p {...stylex.props(styles.meta)}>{totalLabel(obtainedIds(collection).length)}</p>
    </div>
  );
};
