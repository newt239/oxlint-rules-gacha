import { SITE_NAME } from "#/lib/site";

import type { Category } from "#/lib/rules";

const CABINET = "#14131F";
const CABINET_2 = "#201E33";
const INK = "#FFF6E8";
const INK_DIM = "#A8A2C4";

const CATEGORY_COLORS: Record<Category, string> = {
  correctness: "#FF4D5E",
  nursery: "#7A8CA8",
  pedantic: "#9B6DFF",
  perf: "#4ADE80",
  restriction: "#F5C14E",
  style: "#35D0D6",
  suspicious: "#FFC53D",
};

type OgImageBodyProps = {
  category?: Category;
  title: string;
};

export const OgImageBody = ({ category, title }: OgImageBodyProps) => (
  <div
    style={{
      backgroundColor: CABINET,
      backgroundImage: `radial-gradient(circle at 85% 12%, ${CABINET_2} 0%, ${CABINET} 60%)`,
      color: INK,
      display: "flex",
      flexDirection: "column",
      fontFamily: "Baloo 2",
      height: "100%",
      justifyContent: "center",
      padding: 88,
      width: "100%",
    }}
  >
    <div style={{ color: INK_DIM, fontSize: 30, fontWeight: 400, letterSpacing: 4 }}>
      {SITE_NAME.toUpperCase()}
    </div>
    <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.2, marginTop: 28 }}>{title}</div>
    {category !== undefined && (
      <div style={{ display: "flex", marginTop: 36 }}>
        <div
          style={{
            backgroundColor: CATEGORY_COLORS[category],
            borderRadius: 999,
            color: CABINET,
            fontSize: 32,
            fontWeight: 700,
            padding: "8px 28px",
          }}
        >
          {category}
        </div>
      </div>
    )}
  </div>
);
