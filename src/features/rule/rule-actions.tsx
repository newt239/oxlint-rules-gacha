"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";
import { useRouter } from "next/navigation";

import { ActionButton } from "#/components/action-button";
import { CopyButton } from "#/components/copy-button";
import { buildOxlintrc } from "#/lib/oxlintrc";
import { ruleHref } from "#/lib/rule-href";
import { drawAndRecord, useCollection, useFilter } from "#/lib/use-draw";

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
};

export const RuleActions = ({ detail }: RuleActionsProps) => {
  const router = useRouter();
  const collection = useCollection();
  const filter = useFilter();
  const [drawing, setDrawing] = useState(false);

  const handleDraw = () => {
    setDrawing(true);
    drawAndRecord(collection, filter)
      .then((picked) => {
        if (picked === null) {
          setDrawing(false);

          return;
        }

        router.push(ruleHref(picked.plugin, picked.name));
      })
      .catch((error: unknown) => {
        setDrawing(false);
        console.error(error);
      });
  };

  return (
    <div {...stylex.props(styles.group)}>
      <ActionButton busy={drawing} onClick={handleDraw} variant="primary">
        Draw again
      </ActionButton>
      <CopyButton copiedLabel="Copied" label="Copy config" text={buildOxlintrc([detail])} />
    </div>
  );
};
