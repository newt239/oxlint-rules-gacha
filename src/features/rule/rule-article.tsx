import { ViewTransition } from "react";

import * as stylex from "@stylexjs/stylex";

import { RuleBadges } from "#/components/rule-badges";
import { color, font, layout, text } from "#/styles/tokens.stylex";

import { HighlightedCode } from "./highlighted-code";
import { RuleActions } from "./rule-actions";

import type { RuleDetail } from "#/lib/rules";

const styles = stylex.create({
  docsLink: {
    color: color.catStyle,
    display: "inline-block",
    fontSize: text.md,
    marginBlockStart: "1.5rem",
  },
  heading: {
    color: color.inkDim,
    fontSize: text.lg,
    marginBlock: "0 0.5rem",
  },
  main: {
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingBlock: "2.5rem 4rem",
    paddingInline: layout.gutter,
  },
  section: {
    marginBlockStart: "2rem",
  },
  summary: {
    fontSize: text.md,
    lineHeight: 1.8,
    marginBlock: "1.5rem 0",
    maxWidth: "70ch",
    textWrap: "pretty",
  },
  title: {
    fontFamily: font.mono,
    fontSize: text.ruleId,
    fontWeight: 500,
    lineHeight: 1.3,
    marginBlock: "0 1rem",
    overflowWrap: "anywhere",
  },
});

const titleTint = stylex.create({
  correctness: { color: color.catCorrectness },
  nursery: { color: color.catNursery },
  pedantic: { color: color.catPedantic },
  perf: { color: color.catPerf },
  restriction: { color: color.catRestriction },
  style: { color: color.catStyle },
  suspicious: { color: color.catSuspicious },
});

type RuleArticleProps = {
  detail: RuleDetail;
};

export const RuleArticle = ({ detail }: RuleArticleProps) => (
  <main {...stylex.props(styles.main)}>
    <article>
      <ViewTransition name="rule-title" share="morph" default="none">
        <h1 {...stylex.props(styles.title, titleTint[detail.category])}>{detail.id}</h1>
      </ViewTransition>
      <RuleBadges detail={detail} />
      <p {...stylex.props(styles.summary)}>{detail.summary}</p>
      {detail.incorrect.length > 0 && (
        <section {...stylex.props(styles.section)}>
          <h2 {...stylex.props(styles.heading)}>Incorrect</h2>
          <HighlightedCode example={detail.incorrect[0]} />
        </section>
      )}
      {detail.correct.length > 0 && (
        <section {...stylex.props(styles.section)}>
          <h2 {...stylex.props(styles.heading)}>Correct</h2>
          <HighlightedCode example={detail.correct[0]} />
        </section>
      )}
      <a href={detail.docsUrl} rel="noreferrer" target="_blank" {...stylex.props(styles.docsLink)}>
        Read the original docs on oxc.rs
      </a>
    </article>
    <RuleActions />
  </main>
);
