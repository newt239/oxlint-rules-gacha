"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";
import { useRouter } from "next/navigation";

import { ActionButton } from "#/components/action-button";
import { ruleHref } from "#/lib/rule-href";
import { drawAndRecord, useCollection, useFilter } from "#/lib/use-draw";

const styles = stylex.create({
  group: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
});

export const RuleActions = () => {
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
    </div>
  );
};
