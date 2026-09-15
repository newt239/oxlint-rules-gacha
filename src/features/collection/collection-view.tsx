"use client";

import { useState } from "react";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import {
  COLLECTION_SORTS,
  type CollectionSort,
  collectionProgress,
  collectionSections,
} from "#/lib/collection-progress";
import { COLLECTION_DESCRIPTION } from "#/lib/site";
import { useCollection } from "#/lib/use-draw";
import { useRuleIndex } from "#/lib/use-rule-index";
import { color, font, layout } from "#/styles/tokens.stylex";

import { CollectionExport } from "./collection-export";
import { ProgressSummary } from "./progress-summary";
import { RuleGrid } from "./rule-grid";

const SORT_LABELS: Record<CollectionSort, string> = {
  category: "By category",
  obtained: "Newest first",
  plugin: "By plugin",
};

const styles = stylex.create({
  backLink: {
    color: color.inkDim,
    display: "inline-block",
    fontSize: "0.875rem",
    marginBlockStart: "3rem",
  },
  empty: {
    color: color.inkDim,
    fontSize: "0.8125rem",
    marginBlockStart: "2rem",
  },
  fieldset: {
    borderStyle: "none",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem 1rem",
    margin: 0,
    padding: "0.5rem 0 0",
  },
  heading: {
    fontSize: "1.125rem",
    marginBlock: "0 0.5rem",
  },
  label: {
    alignItems: "center",
    color: color.ink,
    display: "flex",
    fontSize: "0.8125rem",
    gap: "0.35rem",
  },
  legend: {
    color: color.inkDim,
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    padding: 0,
    textTransform: "uppercase",
  },
  main: {
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingBlock: "2.5rem 4rem",
    paddingInline: layout.gutter,
  },
  note: {
    color: color.inkDim,
    fontSize: "0.8125rem",
  },
  retiredItem: {
    color: color.inkDim,
    fontFamily: font.mono,
    fontSize: "0.75rem",
  },
  retiredList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem 0.8rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  section: {
    marginBlockStart: "3rem",
  },
  sortGroup: {
    marginBlockStart: "2rem",
  },
  title: {
    fontSize: "clamp(1.5rem, 6vw, 2rem)",
    marginBlock: "0 0.5rem",
  },
});

export const CollectionView = () => {
  const collection = useCollection();
  const index = useRuleIndex();
  const [sort, setSort] = useState<CollectionSort>("obtained");

  if (index === null) {
    return (
      <main {...stylex.props(styles.main)}>
        <h1 {...stylex.props(styles.title)}>Collection</h1>
        <output {...stylex.props(styles.note)}>Loading rules</output>
      </main>
    );
  }

  const progress = collectionProgress(index.rules, collection);
  const sections = collectionSections(index.rules, collection, sort);
  const owned = index.rules.filter((rule) => Object.hasOwn(collection.obtained, rule.id));

  return (
    <main {...stylex.props(styles.main)}>
      <h1 {...stylex.props(styles.title)}>Collection</h1>
      <p {...stylex.props(styles.note)}>{COLLECTION_DESCRIPTION}</p>
      <ProgressSummary progress={progress} />
      <fieldset {...stylex.props(styles.fieldset, styles.sortGroup)}>
        <legend {...stylex.props(styles.legend)}>Sort</legend>
        {COLLECTION_SORTS.map((value) => (
          <label key={value} {...stylex.props(styles.label)}>
            <input
              checked={sort === value}
              name="collection-sort"
              onChange={() => {
                setSort(value);
              }}
              type="radio"
            />
            {SORT_LABELS[value]}
          </label>
        ))}
      </fieldset>
      {sections.length === 0 ? (
        <p {...stylex.props(styles.empty)}>No rules yet. Draw one to start your collection.</p>
      ) : (
        <RuleGrid sections={sections} />
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
      <Link href="/" {...stylex.props(styles.backLink)}>
        Back to the gacha
      </Link>
    </main>
  );
};
