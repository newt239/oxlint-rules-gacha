"use client";

import * as stylex from "@stylexjs/stylex";

import { actionStyles } from "#/components/action-styles";
import { trackEvent } from "#/lib/analytics";
import { SITE_NAME } from "#/lib/site";

type ShareButtonProps = {
  title: string;
  url: string;
};

export const ShareButton = ({ title, url }: ShareButtonProps) => {
  const text = `I drew ${title} on ${SITE_NAME}!`;
  const intentUrl = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof navigator.share !== "function" || !window.matchMedia("(pointer: coarse)").matches) {
      trackEvent("rule_share", { rule_id: title, share_method: "x_intent" });

      return;
    }

    trackEvent("rule_share", { rule_id: title, share_method: "web_share" });
    event.preventDefault();
    navigator.share({ text, title, url }).catch(() => {});
  };

  return (
    <a
      href={intentUrl}
      onClick={handleClick}
      rel="noreferrer"
      target="_blank"
      {...stylex.props(actionStyles.base, actionStyles.secondary, actionStyles.link)}
    >
      Share this rule
    </a>
  );
};
