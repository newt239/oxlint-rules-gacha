"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { ActionButton } from "#/components/action-button";
import { ActionLink } from "#/components/action-link";
import { requestAutoDraw } from "#/lib/auto-draw";
import { hasObtained, obtainedCount, obtainedIds, recordDraw } from "#/lib/collection";
import { loadRuleIndex } from "#/lib/rule-index-cache";
import { collectionStore } from "#/lib/stores";
import { useCollection } from "#/lib/use-draw";
import { color, font, layout, text } from "#/styles/tokens.stylex";

import { ShareButton } from "./share-button";

const styles = stylex.create({
  buttons: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
  claim: {
    alignItems: "flex-start",
    borderColor: color.inkDim,
    borderRadius: layout.radius,
    borderStyle: "solid",
    borderWidth: "1px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1.5rem",
  },
  group: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    marginBlockStart: "2.5rem",
  },
  lead: {
    fontSize: text.lg,
    fontWeight: 700,
    margin: 0,
    textWrap: "balance",
  },
  meta: {
    color: color.inkDim,
    fontFamily: font.mono,
    fontSize: text.md,
    margin: 0,
  },
});

const drawnLabel = (count: number): string => (count === 1 ? "drawn once" : `drawn ${count} times`);

const totalLabel = (count: number): string =>
  count === 1 ? "1 rule drawn" : `${count} rules drawn`;

type RuleActionsProps = {
  ruleId: string;
  shareUrl: string;
};

export const RuleActions = ({ ruleId, shareUrl }: RuleActionsProps) => {
  const collection = useCollection();
  const [claiming, setClaiming] = useState(false);
  const [announced, setAnnounced] = useState("");
  const owned = hasObtained(collection, ruleId);

  const handleClaim = () => {
    setClaiming(true);

    loadRuleIndex()
      .then(({ rulesetVersion }) => {
        collectionStore.set(recordDraw(collection, ruleId, { now: Date.now(), rulesetVersion }));
        setAnnounced(`Added ${ruleId} to your collection`);
        setClaiming(false);
      })
      .catch((error: unknown) => {
        setClaiming(false);
        console.error(error);
      });
  };

  return (
    <div {...stylex.props(styles.group)}>
      <section {...stylex.props(styles.claim)}>
        {owned ? (
          <>
            <p {...stylex.props(styles.lead)}>Already in your collection.</p>
            <p {...stylex.props(styles.meta)}>{drawnLabel(obtainedCount(collection, ruleId))}</p>
          </>
        ) : (
          <>
            <p {...stylex.props(styles.lead)}>Someone shared this rule with you.</p>
            <ActionButton busy={claiming} onClick={handleClaim} variant="primary">
              Add to my collection
            </ActionButton>
          </>
        )}
        <output {...stylex.props(styles.meta)}>{announced}</output>
      </section>
      <div {...stylex.props(styles.buttons)}>
        <ActionLink href="/" onClick={requestAutoDraw} variant={owned ? "primary" : "secondary"}>
          Draw again
        </ActionLink>
        <ShareButton title={ruleId} url={shareUrl} />
        <p {...stylex.props(styles.meta)}>{totalLabel(obtainedIds(collection).length)}</p>
      </div>
    </div>
  );
};
