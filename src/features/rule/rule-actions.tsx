"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";
import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";

import { ActionButton } from "#/components/action-button";
import { ActionLink } from "#/components/action-link";
import { requestAutoDraw } from "#/lib/auto-draw";
import { hasObtained, obtainedCount, obtainedIds, recordDraw } from "#/lib/collection";
import { loadRuleIndex } from "#/lib/rule-index-cache";
import { collectionStore } from "#/lib/stores";
import { useCollection } from "#/lib/use-draw";
import { color, font, layout, text } from "#/styles/tokens.stylex";

import { ShareButton } from "./share-button";

import type { Category } from "#/lib/rules";

const CapsuleCanvas = dynamic(
  async () => {
    const loaded = await import("#/components/capsule-canvas");

    return loaded.CapsuleCanvas;
  },
  { ssr: false },
);

const RATTLE_MS = 900;
const REVEAL_MS = 450;
const REDUCED_MS = 150;

const styles = stylex.create({
  buttons: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    justifyContent: "space-between",
  },
  claim: {
    borderColor: color.inkDim,
    borderRadius: layout.radius,
    borderStyle: "solid",
    borderWidth: "1px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    overflow: "hidden",
    padding: "1.5rem",
  },
  claimAction: {
    display: "flex",
    justifyContent: "flex-end",
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
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
  stage: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    paddingBlockStart: "6rem",
  },
});

const drawnLabel = (count: number): string => (count === 1 ? "drawn once" : `drawn ${count} times`);

const totalLabel = (count: number): string =>
  count === 1 ? "1 rule drawn" : `${count} rules drawn`;

const wait = async (ms: number): Promise<void> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
};

type RuleActionsProps = {
  category: Category;
  ruleId: string;
  shareUrl: string;
};

export const RuleActions = ({ category, ruleId, shareUrl }: RuleActionsProps) => {
  const collection = useCollection();
  const reducedMotion = useReducedMotion() ?? false;
  const [claiming, setClaiming] = useState(false);
  const [opened, setOpened] = useState(false);
  const [announced, setAnnounced] = useState("");
  const owned = hasObtained(collection, ruleId);
  const showCapsule = !owned || opened;

  const handleClaim = () => {
    setClaiming(true);

    Promise.all([loadRuleIndex(), wait(reducedMotion ? REDUCED_MS : RATTLE_MS)])
      .then(async ([{ rulesetVersion }]) => {
        setOpened(true);
        collectionStore.set(recordDraw(collection, ruleId, { now: Date.now(), rulesetVersion }));
        await wait(reducedMotion ? 0 : REVEAL_MS);
        setClaiming(false);
        setAnnounced(`Added ${ruleId} to your collection`);
      })
      .catch((error: unknown) => {
        setClaiming(false);
        console.error(error);
      });
  };

  return (
    <div {...stylex.props(styles.group)}>
      <section {...stylex.props(styles.claim)}>
        {showCapsule && (
          <div aria-hidden {...stylex.props(styles.stage)}>
            <CapsuleCanvas category={category} open={opened} spinning={claiming && !opened} />
          </div>
        )}
        {owned ? (
          <>
            <p {...stylex.props(styles.lead)}>Already in your collection.</p>
            <p {...stylex.props(styles.meta)}>{drawnLabel(obtainedCount(collection, ruleId))}</p>
          </>
        ) : (
          <>
            <p {...stylex.props(styles.lead)}>Someone shared this rule with you.</p>
            <div {...stylex.props(styles.claimAction)}>
              <ActionButton busy={claiming} onClick={handleClaim} variant="tonal">
                Add to my collection
              </ActionButton>
            </div>
          </>
        )}
        <output {...stylex.props(styles.meta)}>{announced}</output>
      </section>
      <div {...stylex.props(styles.footer)}>
        <div {...stylex.props(styles.buttons)}>
          <ShareButton title={ruleId} url={shareUrl} />
          <ActionLink href="/" onClick={requestAutoDraw}>
            Draw again
          </ActionLink>
        </div>
        <p {...stylex.props(styles.meta)}>{totalLabel(obtainedIds(collection).length)}</p>
      </div>
    </div>
  );
};
