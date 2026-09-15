"use client";

import { useState } from "react";

import { ActionButton } from "./action-button";

type CopyButtonProps = {
  copiedLabel: string;
  label: string;
  text: string;
};

export const CopyButton = ({ copiedLabel, label, text }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  };

  return (
    <ActionButton onClick={handleClick} variant="secondary">
      {copied ? copiedLabel : label}
    </ActionButton>
  );
};
