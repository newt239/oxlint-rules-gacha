"use client";

import { useState } from "react";

import { ActionButton } from "#/components/action-button";

type ShareButtonProps = {
  title: string;
  url: string;
};

export const ShareButton = ({ title, url }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    if (typeof navigator.share === "function") {
      navigator.share({ title, url }).catch(() => {
        setCopied(false);
      });

      return;
    }

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  };

  return (
    <ActionButton onClick={handleClick} variant="secondaryLarge">
      {copied ? "Link copied" : "Share this rule"}
    </ActionButton>
  );
};
