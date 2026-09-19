"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { ActionButton } from "#/components/action-button";
import { GA_MEASUREMENT_ID } from "#/lib/analytics";
import { useHydratedConsent } from "#/lib/stores";
import { color, text } from "#/styles/tokens.stylex";

import { setConsent } from "./set-consent";

import type { ConsentChoice } from "#/lib/consent";

const STATUS_TEXT = {
  denied: "Analytics is off in this browser.",
  granted: "Analytics is on in this browser.",
  unset: "You have not chosen yet, so analytics is off.",
};

const RESULT_TEXT = {
  denied: "Analytics is now off, and the Google Analytics cookies have been removed.",
  granted: "Analytics is now on.",
};

const styles = stylex.create({
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    marginBlockStart: "1rem",
  },
  result: {
    color: color.catPerf,
    display: "block",
    fontSize: text.md,
    marginBlock: "1rem 0",
    minHeight: "1.75rem",
  },
  status: {
    fontWeight: 700,
    margin: 0,
  },
});

export const ConsentControls = () => {
  const consent = useHydratedConsent();
  const [result, setResult] = useState("");

  if (GA_MEASUREMENT_ID === "" || consent === null) {
    return null;
  }

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
    setResult(RESULT_TEXT[choice]);
  };

  return (
    <div>
      <p {...stylex.props(styles.status)}>{STATUS_TEXT[consent]}</p>
      <div {...stylex.props(styles.actions)}>
        <ActionButton
          disabled={consent === "granted"}
          onClick={() => {
            choose("granted");
          }}
        >
          Allow analytics
        </ActionButton>
        <ActionButton
          disabled={consent === "denied"}
          onClick={() => {
            choose("denied");
          }}
        >
          Turn analytics off
        </ActionButton>
      </div>
      <output {...stylex.props(styles.result)}>{result}</output>
    </div>
  );
};
