# Coding Agent Guidelines

## 目次

- [基本原則](#基本原則)
- [開発コマンド](#開発コマンド)
- [アーキテクチャ](#アーキテクチャ)
- [コーディングガイドライン](#コーディングガイドライン)
- [Git 運用](#git-運用)

## 基本原則

- 常に日本語でコミュニケーションを行ってください。すべてのコミットメッセージ、コメント、エラーメッセージ、ユーザーとのやり取りは日本語で行ってください。
- ファイルの削除を行う場合は、必ず実行前に以下を報告し、明示的なユーザー承認を得てください。
  - 対象ファイルのリスト
  - 実行する変更の詳細説明
  - 影響範囲の説明
- 不明な点がある場合は常に質問し、推測で進めてはなりません。
- 実装後の必須作業として、`npm run codecheck` と `npm run test` を実行してください。
  - 型エラーやリンターのエラーが出た場合は、コミット前に必ず修正してください。
  - エラーを解消するために `.oxlintrc.json` や `tsconfig.json` を変更してはなりません。

## 開発コマンド

- `npm run dev` - 開発サーバーを起動
- `npm run build` - ルールデータを取得してから本番アプリケーションをビルド（`.next/standalone` を出力）
- `npm run start` - 本番サーバーを開始
- `npm run rules:build` - oxc.rs からルールデータを取得して生成物を書き出す
- `npm run test` - Vitest で単体テストを実行
- `npm run typecheck` - TypeScript で型チェック
- `npm run codecheck` - 型チェック・Lint・フォーマット・未使用コード検出をまとめて実行

`scripts/` は Node の型ストリップでそのまま実行します（`node scripts/build-rules.mts`）。ランナーは入れないので、拡張子は `.mts` にし、相対 import には `.mts` まで書いてください。Node 22.18 以上が必要です。

パッケージマネージャは **npm** です。ホスティング先の制約により npm のみを使用します。pnpm / yarn を使ってはなりません。

## アーキテクチャ

### 技術スタック

- **言語**: TypeScript
- **フレームワーク**: Next.js 16 with App Router（`output: 'standalone'`）
- **スタイリング**: StyleX（`@stylexswc/nextjs-plugin` の `/turbopack` + `@stylexswc/postcss-plugin`）
- **アニメーション**: `motion`（フェーズ 4 で導入）
- **状態管理**: ライブラリなし。`useSyncExternalStore` + localStorage
- **表示言語**: 英語のみ。i18n の仕組みは持ちません
- **コード品質**: Oxlint / Oxfmt
- **テスト**: Vitest のみ（純関数の単体テスト）
- **Git hooks**: Lefthook
- **デプロイ**: ホスティング先でビルド（`output: 'standalone'`）

### サーバーに状態を持たない

データベース・認証・ランキング・投稿機能は**将来も含めて作りません**。ページは全てビルド時に静的生成し、抽選結果とコレクションはクライアント側（localStorage）だけで扱います。この前提を崩す提案をしてはなりません。

読み取り専用の API ルートだけは例外で、`/api/random` がランダムなルールを 1 件返します（`Access-Control-Allow-Origin: *`）。状態は持たず、`src/generated/rules.json` を読むだけです。

### プロジェクト構造

```bash
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # ルートレイアウト（html / body / フォント）
│   ├── page.tsx            # ガチャ（トップ）
│   ├── about/              # About
│   ├── collection/         # コレクション
│   ├── rules/[plugin]/[rule]/  # ルール詳細
│   └── api/random/         # 読み取り専用のランダム 1 件 API
├── features/               # 機能ベースのディレクトリ構成
│   └── {feature-name}/     # about / collection / gacha / og / rule
├── components/             # 複数の feature から使うコンポーネント
├── lib/                    # グローバルユーティリティ・設定
├── styles/
│   ├── globals.css         # @stylex ディレクティブとリセット
│   └── tokens.stylex.ts    # defineVars によるデザイントークン
└── generated/              # rules:build の生成物（gitignore）
scripts/
├── build-rules.mts         # ルールデータ取得
├── lib/                    # 純関数（テスト対象）
└── oxlint/                 # 自作 oxlint ルール
public/
└── data/                   # rules:build の生成物（gitignore）
```

- コンポーネントの名前は PascalCase で命名し、ディレクトリ名は kebab-case で命名してください。
- コンポーネントごとにディレクトリを作らず、`{component-name}.tsx` として直接配置し、名前付きエクスポートしてください。`index.ts` による再エクスポートは行いません。
- 参照元が 1 つの feature に閉じているものは `components/` や `lib/` ではなく、その feature の下に置いてください。`components/` は 2 つ以上の feature から使うものだけです。

### Feature 内モジュールの参照制限

- 各 feature 内の **actions**・**lib**・**hooks** は、**その feature の外から呼び出してはなりません**。
- 共通化したい処理は `src/lib/` など グローバルな層に配置してください。

### インポートとパスエイリアス

- `#/` が `src/` にマップされています。例: `#/styles/tokens.stylex`。
- 同一 feature 内・同一ディレクトリ内は相対パスで構いませんが、それ以外は必ず `#/` から始めてください。

### StyleX

- レイアウト・配色・タイポグラフィはすべて StyleX で書きます。CSS ファイルを増やしてはなりません。
- 色・フォント・レイアウト値は `src/styles/tokens.stylex.ts` の `defineVars` から参照します。生の色コードをコンポーネントに直接書いてはなりません。
- `rem` は 0.25 刻みの値だけを使います。自作の oxlint ルール `stylex/rem-scale`（`scripts/oxlint/rem-scale.mts`）が違反を検出します。
- Turbopack ではローダーが変換のみを行い、**CSS の抽出は `postcss.config.mjs` の `@stylexswc/postcss-plugin` が担当** します。`postcss.config.mjs` を消すとスタイルが一切当たりません。
- `postcss.config.mjs` を置いた時点で Next.js 組み込みの PostCSS 設定は無効になります。必要な既定プラグインは自分で書き戻してください（現在は `autoprefixer`）。
- `@stylexswc/*` は非公式プラグインです。バージョンは固定し、Dependabot のまとめ更新から除外しています。`next` も同様です。
- Motion が触るプロパティは `transform` / `opacity` / `filter` に限定し、StyleX 側で同じプロパティを指定してはなりません。

### レンダリング方針

- ルール詳細・About・レイアウトは Server Component。
- ガチャ本体・コレクション・フィルタ設定のみ Client Component。
- ルールインデックスは RSC ペイロードに載せず、`public/data/rules.index.json` を fetch します。props で渡してはなりません。

### GA4 と同意管理

- GA は Google Consent Mode v2 で動かします。`src/app/layout.tsx` の `beforeInteractive` な inline script (`GA_CONSENT_BOOTSTRAP_SCRIPT`) が `analytics_storage` を `denied` で初期化し、保存済みの同意が `granted` なら同期的に `update` します。この順序を崩すと同意前に Cookie が作られるため、`<GoogleAnalytics>` より前に実行される構成を維持してください。
- 同意状態は `src/lib/consent.ts` と `consentStore`（`src/lib/stores.ts`）で持ち、変更は `src/features/privacy/set-consent.ts` の `setConsent()` だけを通します。
- プライバシーポリシー (`/privacy`) の記述と実装は対応しています。計測項目・保存キー・Cookie を変えたら `src/features/privacy/privacy-article.tsx` も更新してください。

## コーディングガイドライン

### `any` の禁止

- いかなる理由があっても `any` を使用してはなりません。
- `unknown` や `never` の使用も避けてください。

### 型アサーションの禁止

- 型アサーションは禁止です。使用する場合は明確な理由をコメントとして記述してください。

### `interface` の禁止

- 型定義に `interface` を使用してはなりません。`type` を使用してください。

### コメントの禁止

- 原則としてコメントは記述してはなりません。
- 型アサーションや useEffect の使用理由など、他のガイドラインが記述を求める場合のみ例外とします。

### 過度な抽象化の禁止

- 再利用される明確な根拠がない限り、処理の切り出しや定数への抽出を行わないでください。

### useEffect の禁止

- 初期データを取得するために useEffect を使用してはなりません。
- ブラウザ API アクセスやイベントリスナー登録など、真に必要な場合のみ許可します。

### アクセシビリティ

`jsx-a11y` のルールを扱うサイトなので、自サイトでは `jsx-a11y` のルールをすべて有効にしています。無効化してはなりません。あわせて次を守ってください。

- 抽選ボタンは `<button>`。押下中は `aria-busy="true"`
- 結果は `role="status"` の領域に演出完了時に一度だけ流す。演出中の中間状態は `aria-hidden`
- カテゴリは色だけでなくテキストラベルでも表す
- テキストのコントラストは背景に対し 4.5:1 以上
- `prefers-reduced-motion: reduce` では演出を 150ms のクロスフェードに置換する

## Git 運用

### ブランチ

- 特別な指示がない限り `main` に直接コミットしてください。フェーズや作業単位でブランチを切る必要はありません。
- ブランチを切るよう指示された場合のみ作成し、名前は `{prefix}/{kebab-case の要約}` とします。例: `feat/draw-logic`

### 署名

- `commit.gpgsign` が有効です。**署名を無効化して実行してはなりません**（`-c commit.gpgsign=false` などを付けない）。
- コミット後に `git log --format="%h %G? %s" -1` で `G` になっていることを確認してください。

### コミットメッセージ

- 日本語で、1 行以内で書いてください。本文は付けません。
- Conventional Commits の prefix を付けてください。
  - `feat:` 機能追加
  - `fix:` バグ修正
  - `refactor:` 挙動を変えない内部改善
  - `docs:` ドキュメントのみの変更
  - `test:` テストのみの変更
  - `chore:` 依存更新・設定変更など上記に当てはまらないもの
  - `ci:` GitHub Actions などの CI 設定の変更
- 目的ごとにコミットを分けてください。
- lefthook の pre-commit が `lint:fix` と `format:fix` を実行し、修正結果をステージします。

### プルリクエスト

- `.github/PULL_REQUEST_TEMPLATE.md` の項目を埋めてください。
- 作成前に `npm run codecheck`・`npm run test`・`npm run build` が通ることを確認してください。
- CI では Codecheck が必須ステータスチェックです。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
