"use client";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { CategoryBadge } from "#/components/category-badge";
import { ruleHref } from "#/lib/rules";
import { color, font, layout, text } from "#/styles/tokens.stylex";

import type { CollectionEntry } from "#/lib/collection-progress";

const styles = stylex.create({
  count: {
    color: color.inkDim,
    fontSize: text.md,
  },
  heading: {
    color: color.inkDim,
    fontFamily: font.mono,
    fontSize: text.lg,
    marginBlock: "0 0.75rem",
  },
  item: {
    alignItems: "center",
    backgroundColor: color.cabinet2,
    borderRadius: layout.radius,
    display: "flex",
    flexWrap: "wrap",
    gap: "0.25rem",
    paddingBlock: "0.25rem",
    paddingInline: "0.75rem",
  },
  link: {
    alignItems: "center",
    color: color.ink,
    display: "flex",
    flexWrap: "wrap",
    fontFamily: font.mono,
    fontSize: text.md,
    gap: "0.25rem",
    textDecoration: "none",
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.25rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  section: {
    containIntrinsicSize: "auto 320px",
    contentVisibility: "auto",
    marginBlockStart: "2rem",
  },
});

type RuleGridProps = {
  entries: CollectionEntry[];
};

export const RuleGrid = ({ entries }: RuleGridProps) => (
  <section {...stylex.props(styles.section)}>
    <h2 {...stylex.props(styles.heading)}>Recently collected</h2>
    <ul {...stylex.props(styles.list)}>
      {entries.map((entry) => (
        <li key={entry.id} {...stylex.props(styles.item)}>
          <Link href={ruleHref(entry.plugin, entry.name)} {...stylex.props(styles.link)}>
            {entry.name}
            <CategoryBadge category={entry.category} size="sm" />
            {entry.count > 1 && (
              <span {...stylex.props(styles.count)}>drawn {entry.count} times</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);
