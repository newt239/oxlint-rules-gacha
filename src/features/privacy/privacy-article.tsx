import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { linkStyles } from "#/components/link-styles";
import { pageStyles } from "#/components/page-styles";
import { color, font, text } from "#/styles/tokens.stylex";

import { ConsentControls } from "./consent-controls";

const GA_OPT_OUT_URL = "https://tools.google.com/dlpage/gaoptout";
const GOOGLE_PARTNER_SITES_URL = "https://policies.google.com/technologies/partner-sites";
const GOOGLE_PRIVACY_URL = "https://policies.google.com/privacy";
const LAST_UPDATED = "19 September 2026";
const REPO_ISSUES_URL = "https://github.com/newt239/oxlint-rules-gacha/issues";

const EVENT_NAMES = [
  "gacha_draw",
  "gacha_draw_empty",
  "filter_change",
  "rule_share",
  "rule_docs_click",
  "rule_obtained_from_link",
  "rule_draw_again",
  "collection_clear",
  "collection_export_copy",
];

const STORAGE_KEYS = [
  { key: "oxlint-gacha:collection", where: "localStorage", why: "the rules you have drawn" },
  {
    key: "oxlint-gacha:filter",
    where: "localStorage",
    why: "the categories and plugins you excluded",
  },
  { key: "oxlint-gacha:consent", where: "localStorage", why: "your analytics choice" },
  {
    key: "oxlint-gacha:auto-draw",
    where: "sessionStorage",
    why: "a one-shot flag that starts a draw after navigation",
  },
];

const styles = stylex.create({
  body: {
    lineHeight: 1.9,
    marginBlock: 0,
    maxWidth: "70ch",
    textWrap: "pretty",
  },
  code: {
    fontFamily: font.mono,
    fontSize: text.sm,
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
  list: {
    lineHeight: 1.9,
    marginBlock: "1rem 0",
    maxWidth: "70ch",
    paddingInlineStart: "1.25rem",
  },
  paragraph: {
    marginBlockStart: "1rem",
  },
  section: {
    marginBlockStart: "2.5rem",
  },
  title: {
    fontSize: text.display,
    marginBlock: "0 0.5rem",
  },
  updated: {
    color: color.inkDim,
    fontSize: text.sm,
    margin: 0,
  },
});

export const PrivacyArticle = () => (
  <main {...stylex.props(pageStyles.main, pageStyles.article)}>
    <article>
      <h1 {...stylex.props(styles.title)}>Privacy policy</h1>
      <p {...stylex.props(styles.updated)}>Last updated: {LAST_UPDATED}</p>
      <p {...stylex.props(styles.body, styles.intro)}>
        oxlint rules gacha is a personal, non-commercial fan site built and run by newt239. This
        page explains what happens to your data when you use it.
      </p>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Who is responsible</h2>
        <p {...stylex.props(styles.body)}>
          newt239, acting as an individual, decides how this site handles data. Questions and
          requests go to the GitHub issue tracker. Issues there are public, so please do not post
          personal details in them.
        </p>
        <ul {...stylex.props(styles.linkList)}>
          <li>
            <a
              href={REPO_ISSUES_URL}
              rel="noreferrer"
              target="_blank"
              {...stylex.props(linkStyles.underline, styles.link)}
            >
              Open an issue on GitHub
            </a>
          </li>
        </ul>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>What stays in your browser</h2>
        <p {...stylex.props(styles.body)}>
          The site has no accounts, no database and no server-side storage. Your collection and your
          filter settings are kept in your own browser and are never sent anywhere.
        </p>
        <ul {...stylex.props(styles.list)}>
          {STORAGE_KEYS.map((entry) => (
            <li key={entry.key}>
              <span {...stylex.props(styles.code)}>{entry.key}</span> in {entry.where} — {entry.why}
            </li>
          ))}
        </ul>
        <p {...stylex.props(styles.body, styles.paragraph)}>
          Clearing site data for this domain removes all of them.
        </p>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Analytics</h2>
        <p {...stylex.props(styles.body)}>
          With your consent, the site loads Google Analytics 4, provided by Google Ireland Limited,
          Gordon House, Barrow Street, Dublin 4, Ireland.
        </p>
        <p {...stylex.props(styles.body, styles.paragraph)}>
          Google Consent Mode is configured so that analytics storage starts out denied. Before you
          accept, no analytics cookies are set and no analytics identifier is created for you.
          Google does still receive a cookieless signal containing your IP address, the page address
          and the referring page, which it uses to model aggregate traffic.
        </p>
        <p {...stylex.props(styles.body, styles.paragraph)}>
          After you accept, Google sets two first-party cookies,{" "}
          <span {...stylex.props(styles.code)}>_ga</span> and{" "}
          <span {...stylex.props(styles.code)}>_ga_&lt;stream id&gt;</span>. They expire after two
          years and hold a randomly generated identifier for this browser.
        </p>
        <p {...stylex.props(styles.body, styles.paragraph)}>
          What is measured: the pages you view, the referring page, an approximate location derived
          from your IP address, and your device, browser and screen size. These interactions are
          reported as events:
        </p>
        <ul {...stylex.props(styles.list)}>
          {EVENT_NAMES.map((name) => (
            <li key={name}>
              <span {...stylex.props(styles.code)}>{name}</span>
            </li>
          ))}
        </ul>
        <p {...stylex.props(styles.body, styles.paragraph)}>
          They carry the rule identifier, its category and plugin, which filter you changed, and how
          many rules you exported. No form input and no personal identifiers are sent.
        </p>
        <p {...stylex.props(styles.body, styles.paragraph)}>
          Legal basis: your consent, under Article 6(1)(a) of the GDPR. Retention: Google deletes
          the user-level and event-level data after two months. International transfers: Google may
          process the data in the United States under the EU-US Data Privacy Framework and the
          European Commission standard contractual clauses.
        </p>
        <ul {...stylex.props(styles.linkList)}>
          <li>
            <a
              href={GOOGLE_PRIVACY_URL}
              rel="noreferrer"
              target="_blank"
              {...stylex.props(linkStyles.underline, styles.link)}
            >
              Google privacy policy
            </a>
          </li>
          <li>
            <a
              href={GOOGLE_PARTNER_SITES_URL}
              rel="noreferrer"
              target="_blank"
              {...stylex.props(linkStyles.underline, styles.link)}
            >
              How Google uses data from sites that use its services
            </a>
          </li>
          <li>
            <a
              href={GA_OPT_OUT_URL}
              rel="noreferrer"
              target="_blank"
              {...stylex.props(linkStyles.underline, styles.link)}
            >
              Google Analytics opt-out add-on
            </a>
          </li>
        </ul>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Your choice</h2>
        <p {...stylex.props(styles.body)}>
          Withdrawing consent is as easy as giving it. Turning analytics off here also deletes the
          Google Analytics cookies this browser already holds. It does not delete data Google has
          already collected; for that, get in touch through the issue tracker above.
        </p>
        <ConsentControls />
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Hosting</h2>
        <p {...stylex.props(styles.body)}>
          The site runs on Lolipop! Deploy Now, operated by GMO Pepabo, Inc. in Japan. Their servers
          process ordinary request data — your IP address, the user agent string, the address
          requested and the time — to deliver pages and keep the site available. Legal basis: the
          legitimate interest in running a working and secure website, under Article 6(1)(f). Japan
          is covered by an adequacy decision of the European Commission, so no extra transfer
          safeguards are needed.
        </p>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>No other third parties</h2>
        <p {...stylex.props(styles.body)}>
          Fonts are downloaded at build time and served from this domain, so your browser never
          contacts Google Fonts. There are no ads, no embeds, no social widgets and no trackers
          other than the analytics described above. Links to oxc.rs, GitHub and X are ordinary
          links; once you follow one, the privacy policy of that site applies.
        </p>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>The API</h2>
        <p {...stylex.props(styles.body)}>
          <span {...stylex.props(styles.code)}>GET /api/random</span> returns one random rule as
          JSON and is readable from any origin. It stores nothing and reads no cookies.
        </p>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Your rights</h2>
        <p {...stylex.props(styles.body)}>
          Under the GDPR you can ask for access to your data, for it to be corrected or erased, for
          processing to be restricted, and for a copy in a portable form, and you can object to
          processing. Because the site keeps no accounts and no server-side records, nothing held
          here identifies you by name. The analytics identifier is held by Google as a processor;
          turning analytics off or clearing your browser data removes it. You also have the right to
          lodge a complaint with the data protection authority in your country.
        </p>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Children</h2>
        <p {...stylex.props(styles.body)}>
          The site is not directed at children under 16 and does not knowingly collect their data.
        </p>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Changes</h2>
        <p {...stylex.props(styles.body)}>
          Any change to this policy is published on this page together with a new date at the top.
        </p>
      </section>
    </article>
    <Link href="/" {...stylex.props(linkStyles.underline, pageStyles.backLink)}>
      Back to the gacha
    </Link>
  </main>
);
