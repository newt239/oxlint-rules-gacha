"use client";

import { useEffect, useRef, ViewTransition } from "react";

import * as stylex from "@stylexjs/stylex";
import ShuffleText from "shuffle-text";

import { categoryColor } from "#/lib/palette";
import { font, text } from "#/styles/tokens.stylex";

import type { Category } from "#/lib/rules";

const SHUFFLE_DURATION_MS = 620;

const styles = stylex.create({
  text: {
    fontFamily: font.mono,
    fontSize: text.reveal,
    fontWeight: 500,
    lineHeight: 1.3,
    marginBlock: "1.5rem 0",
    marginInline: 0,
    opacity: 0,
    overflowWrap: "anywhere",
    textAlign: "center",
  },
  tint: (value: string) => ({ color: value }),
});

type RevealTextProps = {
  category: Category;
  ruleId: string;
  shuffle: boolean;
};

export const RevealText = ({ category, ruleId, shuffle }: RevealTextProps) => {
  const textRef = useRef<HTMLParagraphElement>(null);

  // ShuffleText は textContent を直接書き換えるため、要素が生成されたあとにしか動かせない
  useEffect(() => {
    const element = textRef.current;
    const effect = element === null || !shuffle ? null : new ShuffleText(element);

    if (effect !== null) {
      effect.duration = SHUFFLE_DURATION_MS;
      effect.sourceRandomCharacter = "abcdefghijklmnopqrstuvwxyz-/";
      effect.setText(ruleId);
      effect.start();
    }

    return () => {
      effect?.dispose();
    };
  }, [ruleId, shuffle]);

  return (
    <ViewTransition name="rule-title" share="morph" default="none">
      <p
        ref={textRef}
        aria-hidden
        data-reveal
        {...stylex.props(styles.text, styles.tint(categoryColor(category)))}
      >
        {ruleId}
      </p>
    </ViewTransition>
  );
};
