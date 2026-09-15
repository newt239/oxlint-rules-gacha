"use client";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { CategoryBadge } from "#/components/category-badge";
import { ruleHref } from "#/lib/rule-href";
import { color, font, layout, text } from "#/styles/tokens.stylex";

import type { CollectionSection } from "#/lib/collection-progress";

const styles = stylex.create({
  count: {
    color: color.inkDim,
    fontSize: text.md,
  },
  heading: {
    color: color.inkDim,
    fontFamily: font.mono,
    fontSize: text.md,
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
  sections: CollectionSection[];
};

const sectionKey = (section: CollectionSection): string => {
  if (section.kind === "plugin") {
    return `plugin:${section.plugin}`;
  }

  if (section.kind === "category") {
    return `category:${section.category}`;
  }

  return section.kind;
};

const sectionTitle = (section: CollectionSection): React.ReactNode => {
  if (section.kind === "plugin") {
    return section.plugin;
  }

  if (section.kind === "category") {
    return <CategoryBadge category={section.category} size="sm" />;
  }

  return "Recently collected";
};

export const RuleGrid = ({ sections }: RuleGridProps) => (
  <div>
    {sections.map((section) => (
      <section key={sectionKey(section)} {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>{sectionTitle(section)}</h2>
        <ul {...stylex.props(styles.list)}>
          {section.entries.map((entry) => (
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
    ))}
  </div>
);
