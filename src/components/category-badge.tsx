import * as stylex from "@stylexjs/stylex";

import { color, layout, text } from "#/styles/tokens.stylex";

import type { Category } from "#/lib/rules";

const styles = stylex.create({
  badge: {
    borderRadius: layout.radius,
    color: color.cabinet,
    display: "inline-block",
    fontSize: text.md,
    fontWeight: 700,
    lineHeight: 1.6,
    paddingInline: "0.75em",
  },
  correctness: { backgroundColor: color.catCorrectness },
  nursery: { backgroundColor: color.catNursery },
  pedantic: { backgroundColor: color.catPedantic },
  perf: { backgroundColor: color.catPerf },
  restriction: { backgroundColor: color.catRestriction },
  style: { backgroundColor: color.catStyle },
  suspicious: { backgroundColor: color.catSuspicious },
});

type CategoryBadgeProps = {
  category: Category;
};

export const CategoryBadge = ({ category }: CategoryBadgeProps) => (
  <span {...stylex.props(styles.badge, styles[category])}>{category}</span>
);
