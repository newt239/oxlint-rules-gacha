import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { SITE_NAME } from "#/lib/site";
import { color, layout } from "#/styles/tokens.stylex";

import type { Dictionary } from "#/i18n";

const OXC_REPO_URL = "https://github.com/oxc-project/oxc";
const OXC_LICENSE_URL = "https://github.com/oxc-project/oxc/blob/main/LICENSE";
const OXC_RULES_URL = "https://oxc.rs/docs/guide/usage/linter/rules.html";

const styles = stylex.create({
  backLink: {
    color: color.inkDim,
    display: "inline-block",
    fontSize: "0.875rem",
    marginBlockStart: "3rem",
  },
  body: {
    lineHeight: 1.9,
    margin: 0,
    maxWidth: "70ch",
  },
  heading: {
    color: color.inkDim,
    fontSize: "0.8125rem",
    letterSpacing: "0.08em",
    marginBlock: "0 0.5rem",
    textTransform: "uppercase",
  },
  intro: {
    lineHeight: 1.9,
    marginBlock: "1.5rem 0",
    maxWidth: "70ch",
  },
  link: {
    color: color.catStyle,
  },
  linkList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    listStyle: "none",
    marginBlock: "1rem 0",
    padding: 0,
  },
  main: {
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingBlock: "2.5rem 4rem",
    paddingInline: layout.gutter,
  },
  section: {
    marginBlockStart: "2.5rem",
  },
  title: {
    fontSize: "clamp(1.5rem, 6vw, 2rem)",
    marginBlock: "0 0.5rem",
  },
});

type AboutArticleProps = {
  dictionary: Dictionary;
  lang: string;
};

export const AboutArticle = ({ dictionary, lang }: AboutArticleProps) => (
  <main {...stylex.props(styles.main)}>
    <article>
      <h1 {...stylex.props(styles.title)}>{dictionary.about}</h1>
      <p {...stylex.props(styles.intro)}>{dictionary.aboutIntro}</p>
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>{dictionary.aboutUnofficialHeading}</h2>
        <p {...stylex.props(styles.body)}>
          <strong>{dictionary.aboutUnofficial}</strong>
        </p>
      </section>
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>{dictionary.aboutDataSourceHeading}</h2>
        <p {...stylex.props(styles.body)}>{dictionary.aboutDataSource}</p>
        <ul {...stylex.props(styles.linkList)}>
          <li>
            <a href={OXC_RULES_URL} rel="noreferrer" target="_blank" {...stylex.props(styles.link)}>
              {dictionary.originalDocs}
            </a>
          </li>
          <li>
            <a href={OXC_REPO_URL} rel="noreferrer" target="_blank" {...stylex.props(styles.link)}>
              oxc-project/oxc
            </a>
          </li>
        </ul>
      </section>
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>{dictionary.aboutLicenseHeading}</h2>
        <p {...stylex.props(styles.body)}>{dictionary.aboutLicense}</p>
        <ul {...stylex.props(styles.linkList)}>
          <li>
            <a
              href={OXC_LICENSE_URL}
              rel="noreferrer"
              target="_blank"
              {...stylex.props(styles.link)}
            >
              {dictionary.sourceCredit}
            </a>
          </li>
        </ul>
      </section>
      <p {...stylex.props(styles.body)}>{SITE_NAME}</p>
    </article>
    <Link href={`/${lang}`} {...stylex.props(styles.backLink)}>
      {dictionary.backToGacha}
    </Link>
  </main>
);
