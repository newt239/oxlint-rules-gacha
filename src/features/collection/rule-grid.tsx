"use client";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { CategoryBadge } from "#/components/category-badge";
import { ruleHref } from "#/lib/rule-href";
import { color, font, layout } from "#/styles/tokens.stylex";

import type { Dictionary } from "#/i18n";
import type { CollectionSection } from "#/lib/collection-progress";

const styles = stylex.create({
  count: {
    color: color.inkDim,
    fontSize: "0.6875rem",
  },
  heading: {
    color: color.inkDim,
    fontFamily: font.mono,
    fontSize: "0.8125rem",
    marginBlock: "0 0.75rem",
  },
  item: {
    alignItems: "center",
    backgroundColor: color.cabinet2,
    borderRadius: layout.radius,
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
    paddingBlock: "0.35rem",
    paddingInline: "0.6rem",
  },
  link: {
    alignItems: "center",
    color: color.ink,
    display: "flex",
    flexWrap: "wrap",
    fontFamily: font.mono,
    fontSize: "0.75rem",
    gap: "0.4rem",
    textDecoration: "none",
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  locked: {
    backgroundColor: color.cabinet2,
    borderRadius: layout.radius,
    opacity: 0.45,
    paddingBlock: "0.35rem",
    paddingInline: "0.6rem",
  },
  section: {
    containIntrinsicSize: "auto 320px",
    contentVisibility: "auto",
    marginBlockStart: "2rem",
  },
  silhouette: {
    backgroundColor: color.inkDim,
    borderRadius: "4px",
    display: "block",
    height: "0.75rem",
    width: "5rem",
  },
});

type RuleGridProps = {
  dictionary: Dictionary;
  lang: string;
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

const sectionTitle = (section: CollectionSection, dictionary: Dictionary): React.ReactNode => {
  if (section.kind === "plugin") {
    return section.plugin;
  }

  if (section.kind === "category") {
    return <CategoryBadge category={section.category} />;
  }

  if (section.kind === "obtained") {
    return dictionary.obtainedSection;
  }

  return dictionary.lockedSection;
};

export const RuleGrid = ({ dictionary, lang, sections }: RuleGridProps) => (
  <div>
    {sections.map((section) => (
      <section key={sectionKey(section)} {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>{sectionTitle(section, dictionary)}</h2>
        <ul {...stylex.props(styles.list)}>
          {section.entries.map((entry) =>
            entry.obtained ? (
              <li key={entry.id} {...stylex.props(styles.item)}>
                <Link
                  href={ruleHref(lang, entry.plugin, entry.name)}
                  {...stylex.props(styles.link)}
                >
                  {entry.name}
                  <CategoryBadge category={entry.category} />
                  {entry.count > 1 && (
                    <span {...stylex.props(styles.count)}>
                      {dictionary.duplicateCount.replace("{count}", String(entry.count))}
                    </span>
                  )}
                </Link>
              </li>
            ) : (
              <li
                key={entry.id}
                aria-label={dictionary.lockedRule}
                {...stylex.props(styles.locked)}
              >
                <span aria-hidden {...stylex.props(styles.silhouette)} />
              </li>
            ),
          )}
        </ul>
      </section>
    ))}
  </div>
);
