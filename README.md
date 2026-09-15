# oxlint-rules-gacha

oxlint の 600 以上あるルールを、1 回 1 枚ずつ「引く」ことで知るためのサイト。

引いたルールはコレクションとして貯まり、`.oxlintrc.json` のスニペットとして持ち帰れます。非公式のファンサイトで、ルールの説明文とコード例は [oxc プロジェクト](https://github.com/oxc-project/oxc)（MIT）の原文をそのまま表示します。

## セットアップ

```bash
npm ci
npm run rules:build   # oxc.rs からルールデータを取得する
npm run dev
```

Node.js は 22.12.0 以上が必要です。パッケージマネージャは **npm** を使ってください（デプロイ先が npm のみ対応のため）。

初回の `npm install` では、インストールスクリプトを持つ依存（lefthook / @swc/core / esbuild）の承認が必要です。`package.json` の `allowScripts` にバージョン付きで記録してあるため通常は不要ですが、依存を更新して警告が出たら次を実行してください。

```bash
npm approve-scripts <pkg>
```

## スクリプト

| コマンド              | 内容                                                                            |
| --------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`         | 開発サーバー                                                                    |
| `npm run build`       | 本番ビルド（`.next/standalone` を出力）                                         |
| `npm run start`       | 本番サーバー                                                                    |
| `npm run rules:build` | oxc.rs からルールデータを取得して `public/data/` と `src/generated/` に書き出す |
| `npm run test`        | Vitest                                                                          |
| `npm run codecheck`   | 型チェック・Lint・フォーマット・未使用コード検出                                |

`public/data/` と `src/generated/` は生成物で、リポジトリにはコミットしません。

## 構成

- **Next.js 16**（App Router / Turbopack / `output: 'standalone'`）
- **StyleX** — 変換は `@stylexswc/nextjs-plugin` の `/turbopack`、CSS の抽出は `postcss.config.mjs` の `@stylexswc/postcss-plugin` が担当します。どちらかが欠けるとスタイルが当たりません
- **i18n** — `[lang]` セグメント（`en` / `ja`）。UI 文言のみ翻訳し、ルールの説明文は英語原文のまま表示します
- 全ルートをビルド時に静的生成します。サーバー側に状態を持ちません

## デプロイ

ロリポップ！デプロイナウにデプロイします。フレームワークに `next` を指定し、ビルドコマンドを次のように設定します。

```bash
lolipop build-config update --project <id> \
  --build "npm run rules:build && npm run test && npm run build"
```

ルールデータの取得はデプロイ時に行うため、生成物はコミットしません。取得に失敗した場合はビルドを失敗させ、古いデータが公開され続けないようにしています。

<!-- setup-repo:start -->

## リポジトリの初期設定

GitHub にリポジトリを作成したあと、1 度だけ次を実行するとブランチ保護などを設定できます。

```bash
npm run setup:repo
```

<!-- setup-repo:end -->
