import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { CodeBlock } from "#/components/code-block";
import { RuleBadges } from "#/components/rule-badges";
import { layout } from "#/styles/tokens.stylex";

import { DrawAgainButton } from "./draw-again-button";

import type { Dictionary } from "#/i18n";
import type { RuleDetail } from "#/lib/rules";

const styles = stylex.create({
  main: {
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingInline: layout.gutter,
  },
});

type RuleArticleProps = {
  detail: RuleDetail;
  dictionary: Dictionary;
  lang: string;
};

export const RuleArticle = ({ detail, dictionary, lang }: RuleArticleProps) => (
  <main {...stylex.props(styles.main)}>
    <article>
      <h1>{detail.id}</h1>
      <RuleBadges detail={detail} dictionary={dictionary} />
      <p>{detail.summary}</p>
      {detail.incorrect.length > 0 && (
        <section>
          <h2>{dictionary.incorrectExample}</h2>
          <CodeBlock example={detail.incorrect[0]} />
        </section>
      )}
      {detail.correct.length > 0 && (
        <section>
          <h2>{dictionary.correctExample}</h2>
          <CodeBlock example={detail.correct[0]} />
        </section>
      )}
      <p>{dictionary.ruleTextInEnglish}</p>
      <a href={detail.docsUrl} rel="noreferrer" target="_blank">
        {dictionary.originalDocs}
      </a>
    </article>
    <DrawAgainButton dictionary={dictionary} lang={lang} />
    <Link href={`/${lang}`}>{dictionary.backToGacha}</Link>
  </main>
);
