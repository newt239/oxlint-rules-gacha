"use client";

import * as stylex from "@stylexjs/stylex";

import { CopyButton } from "#/components/copy-button";
import { trackEvent } from "#/lib/track";
import { color, text } from "#/styles/tokens.stylex";

import { CodeBlock } from "./code-block";
import { buildOxlintrc } from "./oxlintrc";

import type { RuleIndexEntry } from "#/lib/rules";

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
  rules: readonly RuleIndexEntry[];
};

export const CollectionExport = ({ rules }: CollectionExportProps) => {
  if (rules.length === 0) {
    return (
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Take your rules home</h2>
        <p {...stylex.props(styles.note)}>Draw a rule first, then you can take the config home.</p>
      </section>
    );
  }

  const config = buildOxlintrc(rules);

  return (
    <section {...stylex.props(styles.section)}>
      <h2 {...stylex.props(styles.heading)}>Take your rules home</h2>
      <CopyButton
        copiedLabel="Copied"
        label="Copy .oxlintrc.json"
        onCopied={() => {
          trackEvent("collection_export_copy", { rule_count: rules.length });
        }}
        text={config}
      />
      <details>
        <summary {...stylex.props(styles.summary)}>Preview</summary>
        <CodeBlock code={config} />
      </details>
    </section>
  );
};
