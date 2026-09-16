import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { linkStyles } from "#/components/link-styles";
import { pageStyles } from "#/components/page-styles";
import { ABOUT_INTRO } from "#/lib/site";
import { color, text } from "#/styles/tokens.stylex";

const AUTHOR_GITHUB_URL = "https://github.com/newt239";
const AUTHOR_NAME = "newt239";
const AUTHOR_WEBSITE_URL = "https://newt239.dev";
const AUTHOR_X_URL = "https://x.com/newt239";
const OXC_LICENSE_URL = "https://github.com/oxc-project/oxc/blob/main/LICENSE";
const OXC_REPO_URL = "https://github.com/oxc-project/oxc";
const OXC_RULES_URL = "https://oxc.rs/docs/guide/usage/linter/rules.html";
const REPO_URL = "https://github.com/newt239/oxlint-rules-gacha";

const styles = stylex.create({
  body: {
    lineHeight: 1.9,
    marginBlock: 0,
    maxWidth: "70ch",
    textWrap: "pretty",
  },
  heading: {
    color: color.inkDim,
    fontSize: text.lg,
    marginBlock: "0 0.5rem",
  },
  intro: {
    marginBlockStart: "1.5rem",
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
  section: {
    marginBlockStart: "2.5rem",
  },
  title: {
    fontSize: text.display,
    marginBlock: "0 0.5rem",
  },
});

export const AboutArticle = () => (
  <main {...stylex.props(pageStyles.main, pageStyles.article)}>
    <article>
      <h1 {...stylex.props(styles.title)}>About</h1>
      <p {...stylex.props(styles.body, styles.intro)}>{ABOUT_INTRO}</p>
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Unofficial</h2>
        <p {...stylex.props(styles.body)}>
          This is an unofficial fan site. It is not affiliated with, endorsed by, or maintained by
          the oxc project.
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
            <a
              href={OXC_RULES_URL}
              rel="noreferrer"
              target="_blank"
              {...stylex.props(linkStyles.underline, styles.link)}
            >
              Read the original docs on oxc.rs
            </a>
          </li>
          <li>
            <a
              href={OXC_REPO_URL}
              rel="noreferrer"
              target="_blank"
              {...stylex.props(linkStyles.underline, styles.link)}
            >
              oxc-project/oxc
            </a>
          </li>
        </ul>
      </section>
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Source code</h2>
        <p {...stylex.props(styles.body)}>
          This site is open source. Issues and pull requests are welcome.
        </p>
        <ul {...stylex.props(styles.linkList)}>
          <li>
            <a
              href={REPO_URL}
              rel="noreferrer"
              target="_blank"
              {...stylex.props(linkStyles.underline, styles.link)}
            >
              newt239/oxlint-rules-gacha
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
              {...stylex.props(linkStyles.underline, styles.link)}
            >
              Source: the oxc project (MIT)
            </a>
          </li>
        </ul>
      </section>
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Author</h2>
        <p {...stylex.props(styles.body)}>Built by {AUTHOR_NAME}.</p>
        <ul {...stylex.props(styles.linkList)}>
          <li>
            <a
              href={AUTHOR_WEBSITE_URL}
              rel="noreferrer"
              target="_blank"
              {...stylex.props(linkStyles.underline, styles.link)}
            >
              Website
            </a>
          </li>
          <li>
            <a
              href={AUTHOR_GITHUB_URL}
              rel="noreferrer"
              target="_blank"
              {...stylex.props(linkStyles.underline, styles.link)}
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={AUTHOR_X_URL}
              rel="noreferrer"
              target="_blank"
              {...stylex.props(linkStyles.underline, styles.link)}
            >
              X
            </a>
          </li>
        </ul>
      </section>
    </article>
    <Link href="/" {...stylex.props(linkStyles.underline, pageStyles.backLink)}>
      Back to the gacha
    </Link>
  </main>
);
