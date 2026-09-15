import * as stylex from "@stylexjs/stylex";

import { color, layout, text } from "#/styles/tokens.stylex";

import type { Category } from "#/lib/rules";

const styles = stylex.create({
  badge: {
    borderColor: "transparent",
    borderRadius: layout.radius,
    borderStyle: "solid",
    borderWidth: "1px",
    color: color.cabinet,
    display: "inline-block",
    fontWeight: 700,
    lineHeight: 1.6,
    paddingInline: "0.75em",
  },
  correctness: { backgroundColor: color.catCorrectness },
  md: { fontSize: text.md },
  nursery: { backgroundColor: color.catNursery },
  pedantic: { backgroundColor: color.catPedantic },
  perf: { backgroundColor: color.catPerf },
  restriction: { backgroundColor: color.catRestriction },
  sm: { fontSize: text.sm },
  style: { backgroundColor: color.catStyle },
  suspicious: { backgroundColor: color.catSuspicious },
});

type CategoryBadgeProps = {
  category: Category;
  size?: "md" | "sm";
};

export const CategoryBadge = ({ category, size = "md" }: CategoryBadgeProps) => (
  <span {...stylex.props(styles.badge, styles[size], styles[category])}>{category}</span>
);
