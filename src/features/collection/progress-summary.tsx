"use client";

import * as stylex from "@stylexjs/stylex";

import { CategoryBadge } from "#/components/category-badge";
import { toCategory } from "#/lib/rules";
import { color, font, layout, text } from "#/styles/tokens.stylex";

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
    fontSize: text.sm,
    gap: "0.25rem",
    paddingBlock: "0.25rem",
    paddingInline: "0.75rem",
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
    fontSize: text.lg,
    marginBlock: "1.5rem 0.5rem",
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
    fontSize: text.md,
    margin: 0,
  },
  width: (ratio: number) => ({ width: `${ratio}%` }),
});

type ProgressSummaryProps = {
  progress: CollectionProgress;
};

export const ProgressSummary = ({ progress }: ProgressSummaryProps) => (
  <section {...stylex.props(styles.section)}>
    <p {...stylex.props(styles.total)}>
      {progress.obtained} of {progress.total} rules collected
    </p>
    <div aria-hidden {...stylex.props(styles.bar)}>
      <div
        {...stylex.props(
          styles.fill,
          styles.width(progress.total === 0 ? 0 : (progress.obtained / progress.total) * 100),
        )}
      />
    </div>
    <h2 {...stylex.props(styles.heading)}>Plugins</h2>
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
    <h2 {...stylex.props(styles.heading)}>Category</h2>
    <ul {...stylex.props(styles.list)}>
      {progress.byCategory.map((item) => {
        const category = toCategory(item.key);

        return (
          <li key={item.key} {...stylex.props(styles.chip)}>
            {category === undefined ? item.key : <CategoryBadge category={category} size="sm" />}
            <span {...stylex.props(styles.count)}>
              {item.obtained}/{item.total}
            </span>
          </li>
        );
      })}
    </ul>
  </section>
);
