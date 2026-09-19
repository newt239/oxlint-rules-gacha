"use client";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { ActionButton } from "#/components/action-button";
import { linkStyles } from "#/components/link-styles";
import { GA_MEASUREMENT_ID } from "#/lib/analytics";
import { useHydratedConsent } from "#/lib/stores";
import { color, layout, text } from "#/styles/tokens.stylex";

import { setConsent } from "./set-consent";

const styles = stylex.create({
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    justifyContent: "flex-end",
    marginBlockStart: "1.25rem",
  },
  banner: {
    backgroundColor: color.cabinet2,
    borderColor: color.inkDim,
    borderRadius: layout.radius,
    borderStyle: "solid",
    borderWidth: "1px",
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    padding: "1.25rem",
  },
  body: {
    fontSize: text.md,
    margin: 0,
    textWrap: "pretty",
  },
  dock: {
    insetBlockEnd: 0,
    paddingBlock: layout.gutter,
    paddingInline: layout.gutter,
    position: "sticky",
    zIndex: 10,
  },
  heading: {
    fontSize: text.lg,
    marginBlock: "0 0.5rem",
  },
  link: {
    color: color.catStyle,
  },
});

export const ConsentBanner = () => {
  const consent = useHydratedConsent();

  if (GA_MEASUREMENT_ID === "" || consent !== "unset") {
    return null;
  }

  return (
    <div {...stylex.props(styles.dock)}>
      <section aria-label="Analytics consent" {...stylex.props(styles.banner)}>
        <h2 {...stylex.props(styles.heading)}>Analytics cookies</h2>
        <p {...stylex.props(styles.body)}>
          We use Google Analytics to see which rules people draw. It sets cookies in your browser.
          Nothing is stored in them until you accept, and you can change your choice at any time on
          the{" "}
          <Link href="/privacy" {...stylex.props(linkStyles.underline, styles.link)}>
            privacy policy
          </Link>{" "}
          page.
        </p>
        <div {...stylex.props(styles.actions)}>
          <ActionButton
            onClick={() => {
              setConsent("granted");
            }}
            variant="secondary"
          >
            Accept
          </ActionButton>
          <ActionButton
            onClick={() => {
              setConsent("denied");
            }}
            variant="secondary"
          >
            Decline
          </ActionButton>
        </div>
      </section>
    </div>
  );
};
