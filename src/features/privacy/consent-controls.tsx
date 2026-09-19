"use client";

import * as stylex from "@stylexjs/stylex";

import { ActionButton } from "#/components/action-button";
import { useHydratedConsent } from "#/lib/stores";
import { text } from "#/styles/tokens.stylex";

import { setConsent } from "./set-consent";

const STATUS_TEXT = {
  denied: "Analytics is off in this browser.",
  granted: "Analytics is on in this browser.",
  unset: "Analytics is off until you allow it.",
};

const styles = stylex.create({
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    marginBlockStart: "1rem",
  },
  status: {
    display: "block",
    fontSize: text.md,
    fontWeight: 700,
    marginBlockStart: "1rem",
    minHeight: "1.75rem",
  },
});

export const ConsentControls = () => {
  const consent = useHydratedConsent();

  return (
    <div>
      <output {...stylex.props(styles.status)}>
        {consent === null ? "" : STATUS_TEXT[consent]}
      </output>
      <div {...stylex.props(styles.actions)}>
        <ActionButton
          disabled={consent === null || consent === "granted"}
          onClick={() => {
            setConsent("granted");
          }}
          variant="secondary"
        >
          Allow analytics
        </ActionButton>
        <ActionButton
          disabled={consent === null || consent === "denied"}
          onClick={() => {
            setConsent("denied");
          }}
          variant="secondary"
        >
          Turn analytics off
        </ActionButton>
      </div>
    </div>
  );
};
