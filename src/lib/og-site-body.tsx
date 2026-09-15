import { CABINET, CATEGORY_COLORS, CATEGORY_SPECTRUM, INK, INK_DIM } from "#/lib/og-colors";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "#/lib/site";

export const OgSiteBody = () => (
  <div
    style={{
      backgroundColor: CABINET,
      color: INK,
      display: "flex",
      flexDirection: "column",
      fontFamily: "Baloo 2",
      height: "100%",
      width: "100%",
    }}
  >
    <div style={{ display: "flex", height: 8, width: "100%" }}>
      {CATEGORY_SPECTRUM.map((category) => (
        <div
          key={category}
          style={{ backgroundColor: CATEGORY_COLORS[category], flexGrow: 1, height: "100%" }}
        />
      ))}
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        padding: "60px 70px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
          {SITE_NAME}
        </div>
        <div
          style={{ color: INK_DIM, fontSize: 34, lineHeight: 1.4, marginTop: 20, maxWidth: 520 }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
      <div
        style={{
          bottom: 60,
          color: INK_DIM,
          fontSize: 28,
          letterSpacing: 1,
          position: "absolute",
          right: 70,
        }}
      >
        {SITE_URL.host}
      </div>
    </div>
  </div>
);
