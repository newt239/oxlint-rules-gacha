import type { NextConfig } from "next";

import withStylexTurbopack from "@stylexswc/nextjs-plugin/turbopack";
import path from "node:path";

const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  headers: () => [
    {
      headers: [
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ],
      source: "/(.*)",
    },
  ],
  output: "standalone",
  poweredByHeader: false,
  redirects: () => [{ destination: "/en", permanent: false, source: "/" }],
  typedRoutes: true,
};

export default withStylexTurbopack({
  rsOptions: {
    aliases: { "#/*": [path.join(process.cwd(), "src", "*")] },
    dev: isDev,
    unstable_moduleResolution: { type: "commonJS" },
  },
})(nextConfig);
