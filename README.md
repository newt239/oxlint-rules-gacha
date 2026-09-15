# oxlint-rules-gacha

An unofficial fan site for learning the 870 oxlint rules, one draw at a time.

https://oxlint-gacha.newt239.dev

Each draw takes you to that rule's page, and the URL is the thing you share. Drawn rules pile up in a collection you can take home as an `.oxlintrc.json` snippet. Rule descriptions and code samples are shown verbatim from the [oxc project](https://github.com/oxc-project/oxc) (MIT).

## Setup

```bash
npm ci
npm run rules:build   # fetch rule data from oxc.rs
npm run dev
```

Node.js 22.12.0 or later. Use **npm**; other package managers are not supported.

See `.env.example` for the environment variables. `NEXT_PUBLIC_*` values are inlined at build time, so set them on the host before the build runs. Analytics stays off unless `NEXT_PUBLIC_GA_ID` is set, and never sends hits from `localhost`.

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

## API

`GET /api/random` returns one random rule as JSON. It is read-only, sends `Access-Control-Allow-Origin: *`, and is never cached.

```bash
curl https://oxlint-gacha.newt239.dev/api/random
```

```json
{
  "category": "correctness",
  "correct": [
    {
      "code": "async function main() {\n  const data = await getData();\n  const result = complexCalculation(data);\n}",
      "lang": "javascript"
    }
  ],
  "docsUrl": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-debugger.html",
  "enabledByDefault": true,
  "fix": "suggestion",
  "id": "eslint/no-debugger",
  "incorrect": [
    {
      "code": "async function main() {\n  const data = await getData();\n  const result = complexCalculation(data);\n  debugger;\n}",
      "lang": "javascript"
    }
  ],
  "name": "no-debugger",
  "plugin": "eslint",
  "summary": "Checks for usage of the debugger statement.",
  "typeAware": false,
  "url": "https://oxlint-gacha.newt239.dev/rules/eslint/no-debugger",
  "version": "0.0.3"
}
```
