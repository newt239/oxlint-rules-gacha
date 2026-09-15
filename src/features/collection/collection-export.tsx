"use client";

import * as stylex from "@stylexjs/stylex";

import { CodeBlock } from "#/components/code-block";
import { CopyButton } from "#/components/copy-button";
import { buildOxlintrc } from "#/lib/oxlintrc";
import { color } from "#/styles/tokens.stylex";

import type { Dictionary } from "#/i18n";
import type { RuleIndexEntry } from "#/lib/rules";

const styles = stylex.create({
  heading: {
    fontSize: "1.125rem",
    marginBlock: "0 1rem",
  },
  note: {
    color: color.inkDim,
    fontSize: "0.8125rem",
  },
  section: {
    marginBlockStart: "3rem",
  },
  summary: {
    color: color.inkDim,
    cursor: "pointer",
    fontSize: "0.875rem",
    marginBlockStart: "1rem",
  },
});

type CollectionExportProps = {
  dictionary: Dictionary;
  rules: readonly RuleIndexEntry[];
};

export const CollectionExport = ({ dictionary, rules }: CollectionExportProps) => {
  if (rules.length === 0) {
    return (
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>{dictionary.exportHeading}</h2>
        <p {...stylex.props(styles.note)}>{dictionary.exportEmpty}</p>
      </section>
    );
  }

  const config = buildOxlintrc(rules);

  return (
    <section {...stylex.props(styles.section)}>
      <h2 {...stylex.props(styles.heading)}>{dictionary.exportHeading}</h2>
      <CopyButton copiedLabel={dictionary.copied} label={dictionary.copyAllConfig} text={config} />
      <details>
        <summary {...stylex.props(styles.summary)}>{dictionary.exportPreview}</summary>
        <CodeBlock example={{ code: config, lang: "json" }} />
      </details>
    </section>
  );
};
