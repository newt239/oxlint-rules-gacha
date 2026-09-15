# フェーズ 0: リポジトリ初期化と疎通確認

StyleX の設定と外部 fetch という 2 つの不確実性を初日に潰すためのフェーズ。

## 完了したこと

- [x] `next-template` を土台にプロジェクトを生成し、pnpm → npm、Tailwind CSS → StyleX に差し替え
- [x] DB（Drizzle / Turso）・認証（Better Auth）・Playwright・Intent UI・不要な依存を削除
- [x] `output: 'standalone'` を設定し、`/` → `/en` のリダイレクトを追加
- [x] StyleX の疎通確認（`src/styles/tokens.stylex.ts` + `src/app/[lang]/page.tsx`）
- [x] `npm run rules:build` のダミー fetch（`oxc.rs/llms.txt` からルールのパスを列挙）
- [x] Vitest の導入と `scripts/lib/parse-llms-txt.ts` の単体テスト
- [x] `npm ci` / `codecheck` / `test` / `build` がすべて通ることを確認

### 検証結果

| 項目                   | 結果                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| StyleX の CSS 抽出     | `defineVars` の `:root{--x1fafnwz:#14131f;…}` とクラス定義が 1 本の CSS に出力され、静的 HTML から link されている |
| `output: 'standalone'` | `node .next/standalone/server.js` で `/en` が 200、`/` → `/en` が 307                                              |
| 外部 fetch             | ローカルからは到達可能。870 件を抽出                                                                               |
| §6.2 のコントラスト    | 全色 4.5:1 以上。要検証だった `--cat-pedantic` は 5.27:1（cabinet）/ 4.65:1（cabinet-2）                           |

## 残っているタスク

- [ ] GitHub リポジトリを作成して push する

  ```bash
  gh repo create newt239/oxlint-rules-gacha --private --source=. --push
  npm run setup:repo
  ```

- [ ] ホスティング先にプロジェクトを作成し、初回デプロイを流す
  - フレームワークは Next.js を明示する（リポジトリ内容からは自動判別されない）
  - ビルドコマンドは `npm run rules:build && npm run test && npm run build`
  - 出力ディレクトリは `.next/standalone`
- [ ] ビルドログで 2 点を確認する
  - `870 件のルールを … に書き出しました` が出るか（**ビルド環境から `oxc.rs` へ到達できるか**）
  - 公開ページの背景が `#14131F` になっているか（**StyleX の CSS 抽出が効いているか**）
- [ ] 外部 fetch が通らなかった場合は、[フェーズ 1](./phase-1-data-pipeline.md) の代替案（生成物をコミットする方式）へ切り替える

## 仕様書からの逸脱

あとから読んで混乱しないように、意図的に仕様書と変えた点を残しておきます。

| 項目                  | 仕様書                | 実装                                      | 理由                                                                                                                                                                              |
| --------------------- | --------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App Router の位置     | `app/`（§15、案）     | `src/app/`                                | §8.3 がテンプレートを土台と定めているため。`#/` → `src/` のエイリアスと `.oxlintrc.json` の override をそのまま使える                                                             |
| Node のバージョン指定 | 22.12.0 以上          | `engines: ">=22.12.0"`                    | テンプレートの `devEngines`（24.19.0 固定・`onFail: "download"`）はバージョン不一致で npm 自体がエラーになり、ビルド環境の Node で install が落ちる                               |
| Vitest のパス解決     | `vite-tsconfig-paths` | Vite 標準の `resolve.tsconfigPaths: true` | vitest 5 がプラグインを非推奨として警告するため。設定ファイルは `vitest.config.mts`                                                                                               |
| 日本語フォント        | Zen Maru Gothic 700   | 未接続                                    | next/font のメタデータ上このフォントに `japanese` サブセットが無く、日本語グリフが配信されない可能性がある。[フェーズ 6](./phase-6-i18n-and-rule-pages.md) で実表示を見て判断する |

## テンプレートとの差分で空振りした項目

仕様書 §8.3 が挙げていたが、テンプレートに存在しなかったもの。

- `.ls-lint.yml`（ファイル名規約）
- `vitest.config.ts`
- `motion`（フェーズ 4 で新規に入れる）
- `@internationalized/date` / `@react-aria/i18n` / `nanoid`

`codecheck` は `typecheck && lint && format && knip` の 4 つです。

## 注意点

- npm 11 はインストールスクリプトを持つ依存を既定でブロックします。`package.json` の `allowScripts` に lefthook / @swc/core / esbuild をバージョン付きで記録済みです。**依存を更新すると再承認が必要**になり、ビルド環境でも引っかかる可能性があります。
- `postcss.config.mjs` を置いた時点で Next.js 組み込みの PostCSS 設定は無効になります。現在は `autoprefixer` だけ書き戻しています。
