"use client";

import * as stylex from "@stylexjs/stylex";

import { linkStyles } from "#/components/link-styles";
import { trackEvent } from "#/lib/analytics";
import { color, text } from "#/styles/tokens.stylex";

const styles = stylex.create({
  link: {
    color: color.catStyle,
    display: "inline-block",
    fontSize: text.md,
    marginBlockStart: "1.5rem",
  },
});

type DocsLinkProps = {
  ruleId: string;
  url: string;
};

export const DocsLink = ({ ruleId, url }: DocsLinkProps) => (
  <a
    href={url}
    onClick={() => {
      trackEvent("rule_docs_click", { link_url: url, rule_id: ruleId });
    }}
    rel="noreferrer"
    target="_blank"
    {...stylex.props(linkStyles.underline, styles.link)}
  >
    Read the original docs on oxc.rs
  </a>
);
