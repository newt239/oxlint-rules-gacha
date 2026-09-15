"use client";

import { useEffect, useRef } from "react";

import * as stylex from "@stylexjs/stylex";
import { Anchor, Ellipse, Hemisphere, Illustration } from "zdog";

import { cabinetColor, categoryColor, inkColor } from "./palette";

import type { Category } from "#/lib/rules";

const ZOOM = 1.5;
const WIDTH = 168;
const OVERDRAW = 96;
const HEIGHT = WIDTH + OVERDRAW;
const RADIUS = 34;
const CAPSULE_OFFSET_Y = OVERDRAW / 2 / ZOOM;

const styles = stylex.create({
  canvas: {
    display: "block",
    height: `${HEIGHT}px`,
    marginBlockStart: `-${OVERDRAW}px`,
    width: `${WIDTH}px`,
  },
});

type CapsuleState = {
  open: boolean;
  spinning: boolean;
  tint: string;
};

type CapsuleCanvasProps = {
  category: Category | null;
  open: boolean;
  spinning: boolean;
};

export const CapsuleCanvas = ({ category, open, spinning }: CapsuleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<CapsuleState>({ open: false, spinning: false, tint: "" });

  useEffect(() => {
    stateRef.current = {
      open,
      spinning,
      tint: categoryColor(category ?? "suspicious"),
    };
  }, [category, open, spinning]);

  // カプセルは zdog が canvas へ直接描画するため、要素の生成後にしか組み立てられない
  useEffect(() => {
    const element = canvasRef.current;
    let frame = 0;

    if (element !== null) {
      // 再実行に備え、zdog が書き換えた canvas のサイズを戻す
      element.width = WIDTH;
      element.height = HEIGHT;

      const shell = cabinetColor();
      const illustration = new Illustration({ element, zoom: ZOOM });
      const capsule = new Anchor({
        addTo: illustration,
        rotate: { x: -0.32 },
        translate: { y: CAPSULE_OFFSET_Y },
      });
      const top = new Anchor({ addTo: capsule });
      const bottom = new Anchor({ addTo: capsule });
      const dome = new Hemisphere({
        addTo: top,
        backface: shell,
        diameter: RADIUS * 2,
        rotate: { x: Math.PI / 2 },
        stroke: 4,
      });
      const bowl = new Hemisphere({
        addTo: bottom,
        color: inkColor(),
        diameter: RADIUS * 2,
        rotate: { x: -Math.PI / 2 },
        stroke: 4,
      });
      const seam = new Ellipse({
        addTo: capsule,
        color: shell,
        diameter: RADIUS * 2 + 3,
        rotate: { x: Math.PI / 2 },
        stroke: 9,
      });

      let split = 0;

      const render = () => {
        const state = stateRef.current;

        split += ((state.open ? 1 : 0) - split) * 0.16;
        dome.color = state.tint;
        bowl.backface = state.tint;
        seam.visible = split < 0.04;
        capsule.rotate.y += state.spinning ? 0.06 : 0.012;
        top.translate.y = -split * 54;
        top.rotate.x = -split * 1.2;
        bottom.translate.y = split * 18;
        illustration.updateRenderGraph();
        frame = requestAnimationFrame(render);
      };

      render();
    }

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      height={HEIGHT}
      width={WIDTH}
      {...stylex.props(styles.canvas)}
    />
  );
};
