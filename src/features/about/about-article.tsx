import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { ABOUT_INTRO, OXC_LICENSE_URL, SITE_NAME } from "#/lib/site";
import { color, layout, text } from "#/styles/tokens.stylex";

const OXC_REPO_URL = "https://github.com/oxc-project/oxc";
const OXC_RULES_URL = "https://oxc.rs/docs/guide/usage/linter/rules.html";

const styles = stylex.create({
  backLink: {
    color: color.inkDim,
    display: "inline-block",
    fontSize: text.md,
    marginBlockStart: "3rem",
  },
  body: {
    lineHeight: 1.9,
    margin: 0,
    maxWidth: "70ch",
    textWrap: "pretty",
  },
  heading: {
    color: color.inkDim,
    fontSize: text.md,
    letterSpacing: "0.08em",
    marginBlock: "0 0.5rem",
    textTransform: "uppercase",
  },
  intro: {
    lineHeight: 1.9,
    marginBlock: "1.5rem 0",
    maxWidth: "70ch",
    textWrap: "pretty",
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
    fontSize: text.display,
    marginBlock: "0 0.5rem",
  },
});

export const AboutArticle = () => (
  <main {...stylex.props(styles.main)}>
    <article>
      <h1 {...stylex.props(styles.title)}>About</h1>
      <p {...stylex.props(styles.intro)}>{ABOUT_INTRO}</p>
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Unofficial</h2>
        <p {...stylex.props(styles.body)}>
          <strong>
            This is an unofficial fan site. It is not affiliated with, endorsed by, or maintained by
            the oxc project.
          </strong>
        </p>
      </section>
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Data source</h2>
        <p {...stylex.props(styles.body)}>
          Rule names, categories and descriptions are fetched from the oxc documentation at oxc.rs
          and rebuilt every week.
        </p>
        <ul {...stylex.props(styles.linkList)}>
          <li>
            <a href={OXC_RULES_URL} rel="noreferrer" target="_blank" {...stylex.props(styles.link)}>
              Read the original docs on oxc.rs
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
        <h2 {...stylex.props(styles.heading)}>License</h2>
        <p {...stylex.props(styles.body)}>
          Rule text belongs to the oxc project and is licensed under MIT. This site is licensed
          under MIT as well.
        </p>
        <ul {...stylex.props(styles.linkList)}>
          <li>
            <a
              href={OXC_LICENSE_URL}
              rel="noreferrer"
              target="_blank"
              {...stylex.props(styles.link)}
            >
              Source: the oxc project (MIT)
            </a>
          </li>
        </ul>
      </section>
      <p {...stylex.props(styles.body)}>{SITE_NAME}</p>
    </article>
    <Link href="/" {...stylex.props(styles.backLink)}>
      Back to the gacha
    </Link>
  </main>
);
