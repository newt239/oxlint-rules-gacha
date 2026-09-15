# oxlint-rules-gacha

An unofficial fan site for learning the 870 oxlint rules, one draw at a time.

Each draw takes you to that rule's page, and the URL is the thing you share. Drawn rules pile up in a collection you can take home as an `.oxlintrc.json` snippet. Rule descriptions and code samples are shown verbatim from the [oxc project](https://github.com/oxc-project/oxc) (MIT).

## Setup

```bash
npm ci
npm run rules:build   # fetch rule data from oxc.rs
npm run dev
```

Node.js 22.12.0 or later. Use **npm**; other package managers are not supported.

## Scripts

| Command               | What it does                                             |
| --------------------- | -------------------------------------------------------- |
| `npm run dev`         | Development server                                       |
| `npm run build`       | Fetch rule data, then build for production               |
| `npm run start`       | Production server                                        |
| `npm run rules:build` | Fetch rule data into `public/data/` and `src/generated/` |
| `npm run test`        | Vitest                                                   |
| `npm run codecheck`   | Type check, lint, format check, unused-code detection    |

`public/data/` and `src/generated/` are generated and not committed.

## Stack

- **Next.js 16** (App Router, Turbopack, `output: 'standalone'`)
- **StyleX** — `@stylexswc/nextjs-plugin` transforms, `@stylexswc/postcss-plugin` extracts the CSS. Both are required for styles to apply
- English only
- Every page is statically generated, except `/api/random`, a read-only endpoint that returns one random rule
- No server-side state

## License

MIT
