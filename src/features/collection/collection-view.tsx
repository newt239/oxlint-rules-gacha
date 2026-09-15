"use client";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { obtainedIds } from "#/lib/collection";
import { collectionProgress, obtainedEntries } from "#/lib/collection-progress";
import { COLLECTION_DESCRIPTION } from "#/lib/site";
import { useRuleIndex } from "#/lib/use-rule-index";
import { useCollection } from "#/lib/use-stores";
import { color, font, layout, text } from "#/styles/tokens.stylex";

import { CollectionClear } from "./collection-clear";
import { CollectionExport } from "./collection-export";
import { ProgressSummary } from "./progress-summary";
import { RuleGrid } from "./rule-grid";

const styles = stylex.create({
  backLink: {
    color: color.inkDim,
    display: "inline-block",
    fontSize: text.md,
    marginBlockStart: "3rem",
  },
  empty: {
    color: color.inkDim,
    fontSize: text.md,
    marginBlockStart: "2rem",
    textWrap: "balance",
  },
  heading: {
    fontSize: text.xl,
    marginBlock: "0 0.5rem",
    textWrap: "balance",
  },
  main: {
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingBlock: "2.5rem 4rem",
    paddingInline: layout.gutter,
  },
  note: {
    color: color.inkDim,
    fontSize: text.md,
    textWrap: "pretty",
  },
  retiredItem: {
    color: color.inkDim,
    fontFamily: font.mono,
    fontSize: text.md,
  },
  retiredList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.25rem 0.75rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  section: {
    marginBlockStart: "3rem",
  },
  title: {
    fontSize: text.display,
    marginBlock: "0 0.5rem",
    textWrap: "balance",
  },
});

export const CollectionView = () => {
  const collection = useCollection();
  const index = useRuleIndex();

  if (index === null) {
    return (
      <main {...stylex.props(styles.main)}>
        <h1 {...stylex.props(styles.title)}>Collection</h1>
        <output {...stylex.props(styles.note)}>Loading rules</output>
      </main>
    );
  }

  const progress = collectionProgress(index.rules, collection);
  const entries = obtainedEntries(index.rules, collection);
  const owned = index.rules.filter((rule) => Object.hasOwn(collection.obtained, rule.id));
  const obtainedCount = obtainedIds(collection).length;

  return (
    <main {...stylex.props(styles.main)}>
      <h1 {...stylex.props(styles.title)}>Collection</h1>
      <p {...stylex.props(styles.note)}>{COLLECTION_DESCRIPTION}</p>
      <ProgressSummary progress={progress} />
      {entries.length === 0 ? (
        <p {...stylex.props(styles.empty)}>No rules yet. Draw one to start your collection.</p>
      ) : (
        <RuleGrid entries={entries} />
      )}
      {progress.retired.length > 0 && (
        <section {...stylex.props(styles.section)}>
          <h2 {...stylex.props(styles.heading)}>Retired rules</h2>
          <p {...stylex.props(styles.note)}>
            These rules are no longer part of oxlint {index.rulesetVersion}.
          </p>
          <ul {...stylex.props(styles.retiredList)}>
            {progress.retired.map((id) => (
              <li key={id} {...stylex.props(styles.retiredItem)}>
                {id}
              </li>
            ))}
          </ul>
        </section>
      )}
      <CollectionExport rules={owned} />
      <CollectionClear count={obtainedCount} />
      <Link href="/" {...stylex.props(styles.backLink)}>
        Back to the gacha
      </Link>
    </main>
  );
};
