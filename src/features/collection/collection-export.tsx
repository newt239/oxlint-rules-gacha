"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { ActionButton } from "#/components/action-button";
import { codeBlockStyles } from "#/components/code-block-styles";
import { trackEvent } from "#/lib/analytics";
import { color, text } from "#/styles/tokens.stylex";

import { buildOxlintrc, type OxlintrcRule } from "./oxlintrc";

const styles = stylex.create({
  heading: {
    fontSize: text.xl,
    marginBlock: "0 1rem",
    textWrap: "balance",
  },
  note: {
    color: color.inkDim,
    fontSize: text.md,
    textWrap: "pretty",
  },
  section: {
    marginBlockStart: "3rem",
  },
  summary: {
    color: color.inkDim,
    cursor: "pointer",
    fontSize: text.md,
    marginBlockStart: "1rem",
  },
});

type CollectionExportProps = {
  rules: readonly OxlintrcRule[];
};

export const CollectionExport = ({ rules }: CollectionExportProps) => {
  const [copied, setCopied] = useState(false);
  const config = buildOxlintrc(rules);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(config)
      .then(() => {
        setCopied(true);
        trackEvent("collection_export_copy", { rule_count: rules.length });
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  };

  return (
    <section {...stylex.props(styles.section)}>
      <h2 {...stylex.props(styles.heading)}>Take your rules home</h2>
      {rules.length === 0 ? (
        <p {...stylex.props(styles.note)}>Draw a rule first, then you can take the config home.</p>
      ) : (
        <>
          <ActionButton onClick={handleCopy} variant="secondary">
            {copied ? "Copied" : "Copy .oxlintrc.json"}
          </ActionButton>
          <details>
            <summary {...stylex.props(styles.summary)}>Preview</summary>
            <pre {...stylex.props(codeBlockStyles.pre)}>
              <code {...stylex.props(codeBlockStyles.code)}>{config}</code>
            </pre>
          </details>
        </>
      )}
    </section>
  );
};
