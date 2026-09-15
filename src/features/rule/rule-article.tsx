import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { CodeBlock } from "#/components/code-block";
import { RuleBadges } from "#/components/rule-badges";
import { color, font, layout } from "#/styles/tokens.stylex";

import { RuleActions } from "./rule-actions";

import type { RuleDetail } from "#/lib/rules";

const styles = stylex.create({
  actions: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginBlockStart: "2.5rem",
  },
  backLink: {
    color: color.inkDim,
    fontSize: "0.875rem",
  },
  docsLink: {
    color: color.catStyle,
    display: "inline-block",
    fontSize: "0.875rem",
    marginBlockStart: "1.5rem",
  },
  heading: {
    color: color.inkDim,
    fontSize: "0.8125rem",
    letterSpacing: "0.08em",
    marginBlock: "0 0.5rem",
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
    marginBlockStart: "2rem",
  },
  section: {
    marginBlockStart: "2rem",
  },
  summary: {
    fontSize: "1rem",
    lineHeight: 1.8,
    marginBlock: "1.5rem 0",
    maxWidth: "70ch",
  },
  title: {
    fontFamily: font.mono,
    fontSize: "clamp(1.5rem, 7vw, 2.25rem)",
    fontWeight: 500,
    lineHeight: 1.3,
    marginBlock: "0 1rem",
    overflowWrap: "anywhere",
  },
});

type RuleArticleProps = {
  detail: RuleDetail;
};

export const RuleArticle = ({ detail }: RuleArticleProps) => (
  <main {...stylex.props(styles.main)}>
    <article>
      <h1 {...stylex.props(styles.title)}>{detail.id}</h1>
      <RuleBadges detail={detail} />
      <p {...stylex.props(styles.summary)}>{detail.summary}</p>
      {detail.incorrect.length > 0 && (
        <section {...stylex.props(styles.section)}>
          <h2 {...stylex.props(styles.heading)}>Incorrect</h2>
          <CodeBlock example={detail.incorrect[0]} />
        </section>
      )}
      {detail.correct.length > 0 && (
        <section {...stylex.props(styles.section)}>
          <h2 {...stylex.props(styles.heading)}>Correct</h2>
          <CodeBlock example={detail.correct[0]} />
        </section>
      )}
      <a href={detail.docsUrl} rel="noreferrer" target="_blank" {...stylex.props(styles.docsLink)}>
        Read the original docs on oxc.rs
      </a>
      <p {...stylex.props(styles.note)}>Source: the oxc project (MIT)</p>
    </article>
    <div {...stylex.props(styles.actions)}>
      <RuleActions detail={detail} />
      <Link href="/" {...stylex.props(styles.backLink)}>
        Back to the gacha
      </Link>
    </div>
  </main>
);
