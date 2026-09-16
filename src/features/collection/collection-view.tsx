"use client";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { linkStyles } from "#/components/link-styles";
import { pageStyles } from "#/components/page-styles";
import { obtainedIds } from "#/lib/collection";
import { COLLECTION_DESCRIPTION } from "#/lib/site";
import { collectionStore, usePersistedStore } from "#/lib/stores";
import { color, font, text } from "#/styles/tokens.stylex";

import { CollectionClear } from "./collection-clear";
import { CollectionExport } from "./collection-export";
import { collectionProgress, obtainedEntries } from "./collection-progress";
import { ProgressSummary } from "./progress-summary";
import { RuleGrid } from "./rule-grid";
import { useRuleIndex } from "./use-rule-index";

const styles = stylex.create({
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
  const collection = usePersistedStore(collectionStore);
  const index = useRuleIndex();

  if (index === null) {
    return (
      <main {...stylex.props(pageStyles.main, pageStyles.article)}>
        <h1 {...stylex.props(styles.title)}>Collection</h1>
        <output {...stylex.props(styles.note)}>Loading rules</output>
      </main>
    );
  }

  const progress = collectionProgress(index.rules, collection);
  const entries = obtainedEntries(index.rules, collection);
  const obtainedCount = obtainedIds(collection).length;

  return (
    <main {...stylex.props(pageStyles.main, pageStyles.article)}>
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
      <CollectionExport rules={entries} />
      <CollectionClear count={obtainedCount} />
      <Link href="/" {...stylex.props(linkStyles.underline, pageStyles.backLink)}>
        Back to the gacha
      </Link>
    </main>
  );
};
