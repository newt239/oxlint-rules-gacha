"use client";

import * as stylex from "@stylexjs/stylex";

import { CategoryBadge } from "#/components/category-badge";
import { toCategory } from "#/lib/rules";
import { color, font, layout } from "#/styles/tokens.stylex";

import type { Dictionary } from "#/i18n";
import type { CollectionProgress } from "#/lib/collection-progress";

const styles = stylex.create({
  bar: {
    backgroundColor: color.cabinet2,
    borderRadius: "999px",
    height: "8px",
    marginBlockStart: "0.75rem",
    overflow: "hidden",
  },
  chip: {
    alignItems: "center",
    backgroundColor: color.cabinet2,
    borderRadius: layout.radius,
    display: "flex",
    fontFamily: font.mono,
    fontSize: "0.75rem",
    gap: "0.4rem",
    paddingBlock: "0.3rem",
    paddingInline: "0.6rem",
  },
  count: {
    color: color.inkDim,
  },
  fill: {
    backgroundColor: color.catPerf,
    height: "100%",
  },
  heading: {
    color: color.inkDim,
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    marginBlock: "1.5rem 0.5rem",
    textTransform: "uppercase",
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  section: {
    marginBlockStart: "2rem",
  },
  total: {
    fontFamily: font.mono,
    fontSize: "1rem",
    margin: 0,
  },
  width: (ratio: number) => ({ width: `${ratio}%` }),
});

type ProgressSummaryProps = {
  dictionary: Dictionary;
  progress: CollectionProgress;
};

export const ProgressSummary = ({ dictionary, progress }: ProgressSummaryProps) => (
  <section {...stylex.props(styles.section)}>
    <p {...stylex.props(styles.total)}>
      {dictionary.collectionProgress
        .replace("{obtained}", String(progress.obtained))
        .replace("{total}", String(progress.total))}
    </p>
    <div aria-hidden {...stylex.props(styles.bar)}>
      <div
        {...stylex.props(
          styles.fill,
          styles.width(progress.total === 0 ? 0 : (progress.obtained / progress.total) * 100),
        )}
      />
    </div>
    <h2 {...stylex.props(styles.heading)}>{dictionary.plugins}</h2>
    <ul {...stylex.props(styles.list)}>
      {progress.byPlugin.map((item) => (
        <li key={item.key} {...stylex.props(styles.chip)}>
          {item.key}
          <span {...stylex.props(styles.count)}>
            {item.obtained}/{item.total}
          </span>
        </li>
      ))}
    </ul>
    <h2 {...stylex.props(styles.heading)}>{dictionary.categoryLabel}</h2>
    <ul {...stylex.props(styles.list)}>
      {progress.byCategory.map((item) => {
        const category = toCategory(item.key);

        return (
          <li key={item.key} {...stylex.props(styles.chip)}>
            {category === undefined ? item.key : <CategoryBadge category={category} />}
            <span {...stylex.props(styles.count)}>
              {item.obtained}/{item.total}
            </span>
          </li>
        );
      })}
    </ul>
  </section>
);
