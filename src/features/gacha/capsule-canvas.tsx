"use client";

import { useEffect, useRef } from "react";

import * as stylex from "@stylexjs/stylex";
import { Anchor, Ellipse, Hemisphere, Illustration } from "zdog";

import { cabinetColor, categoryColor, inkColor } from "./palette";

import type { Category } from "#/lib/rules";

const SIZE = 168;
const RADIUS = 34;

const styles = stylex.create({
  canvas: {
    display: "block",
    height: `${SIZE}px`,
    width: `${SIZE}px`,
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
      const shell = cabinetColor();
      const illustration = new Illustration({ element, zoom: 1.5 });
      const capsule = new Anchor({ addTo: illustration, rotate: { x: -0.32 } });
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
      height={SIZE}
      width={SIZE}
      {...stylex.props(styles.canvas)}
    />
  );
};
