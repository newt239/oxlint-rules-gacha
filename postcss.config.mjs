import path from "node:path";

const config = {
  plugins: {
    "@stylexswc/postcss-plugin": {
      include: ["src/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
      rsOptions: {
        aliases: { "#/*": [path.join(process.cwd(), "src", "*")] },
        dev: process.env.NODE_ENV === "development",
        unstable_moduleResolution: { type: "commonJS" },
      },
    },
    autoprefixer: {},
  },
};

export default config;
