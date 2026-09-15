# oxlint-rules-gacha

oxlint の 870 あるルールを、1 回 1 件ずつ「引く」ことで知るためのサイト。

引くとそのルールのページへ移ります。その URL がそのまま共有先になります。引いたルールはコレクションとして貯まり、`.oxlintrc.json` のスニペットとして持ち帰れます。非公式のファンサイトで、ルールの説明文とコード例は [oxc プロジェクト](https://github.com/oxc-project/oxc)（MIT）の原文をそのまま表示します。

## セットアップ

```bash
npm ci
npm run rules:build   # oxc.rs からルールデータを取得する
npm run dev
```

Node.js は 22.12.0 以上が必要です。パッケージマネージャは **npm** を使ってください（ホスティング先の制約）。

初回の `npm install` では、インストールスクリプトを持つ依存（lefthook / @swc/core / esbuild）の承認が必要です。`package.json` の `allowScripts` にバージョン付きで記録してあるため通常は不要ですが、依存を更新して警告が出たら次を実行してください。

```bash
npm approve-scripts <pkg>
```

## スクリプト

| コマンド              | 内容                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `npm run dev`         | 開発サーバー                                                                                |
| `npm run build`       | ルールデータを取得してから本番ビルド（`.next/standalone` を出力）                           |
| `npm run start`       | 本番サーバー                                                                                |
| `npm run rules:build` | oxc.rs からルールデータを取得して `public/data/` と `src/generated/` に書き出す（約 25 秒） |
| `npm run test`        | Vitest                                                                                      |
| `npm run codecheck`   | 型チェック・Lint・フォーマット・未使用コード検出                                            |

`public/data/` と `src/generated/` は生成物で、リポジトリにはコミットしません。

## 構成

- **Next.js 16**（App Router / Turbopack / `output: 'standalone'`）
- **StyleX** — 変換は `@stylexswc/nextjs-plugin` の `/turbopack`、CSS の抽出は `postcss.config.mjs` の `@stylexswc/postcss-plugin` が担当します。どちらかが欠けるとスタイルが当たりません
- **英語のみ** — 多言語対応は行いません。UI 文言もルールの説明文も英語です
- 全ルートをビルド時に静的生成します。サーバー側に状態を持ちません

## デプロイ

[ロリポップ！デプロイナウ](https://deploy.lolipop.jp/docs) にデプロイします。フレームワークは Next.js、ビルドコマンドは `npm run build:deploy` です。

```bash
npm run build:deploy   # test → rules:build → build
```

ルールデータの取得は `npm run build` 自体に組み込んであるため、ビルドコマンドが既定の `npm run build` のままでもビルドは通ります（テストは走りません）。

出力ディレクトリはデプロイナウの既定値 `.next/standalone` のままでよく、`--output` の指定は要りません。ルールデータの取得はビルド時に行うため生成物はコミットせず、取得に失敗した場合はビルドを失敗させて古いデータが公開され続けないようにしています。

### 初回の設定

```bash
npm i -g lolipop
lolipop login
lolipop build-config update --build "npm run build:deploy"
lolipop env create NEXT_PUBLIC_SITE_URL https://<発行されたドメイン>
```

- `.env` は読まれません。環境変数はダッシュボードか `lolipop env` で設定します
- `NEXT_PUBLIC_SITE_URL` が未設定だと `metadataBase` が `http://localhost:3000` になり、OGP と `canonical` の絶対 URL が壊れます
- GitHub 連携の「デプロイするブランチ」を `main` にします。`main` への push で自動デプロイされます
