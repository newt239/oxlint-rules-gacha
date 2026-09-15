import * as stylex from "@stylexjs/stylex";

import { color, font, layout } from "#/styles/tokens.stylex";

const styles = stylex.create({
  badge: {
    alignSelf: "flex-start",
    backgroundColor: color.catCorrectness,
    borderRadius: "999px",
    color: color.cabinet,
    fontSize: "14px",
    fontWeight: 700,
    paddingBlock: "4px",
    paddingInline: "12px",
  },
  card: {
    backgroundColor: color.cabinet2,
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "24px",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingBlock: "64px",
    paddingInline: layout.gutter,
  },
  note: {
    color: color.inkDim,
    margin: 0,
  },
  ruleName: {
    fontFamily: font.mono,
    fontSize: "clamp(24px, 7vw, 40px)",
    fontWeight: 500,
    margin: 0,
  },
});

const HomePage = () => (
  <main {...stylex.props(styles.main)}>
    <div {...stylex.props(styles.card)}>
      <span {...stylex.props(styles.badge)}>correctness</span>
      <h1 {...stylex.props(styles.ruleName)}>eslint/no-debugger</h1>
      <p {...stylex.props(styles.note)}>StyleX setup check. Replace with the gacha in phase 2.</p>
    </div>
  </main>
);

export default HomePage;
