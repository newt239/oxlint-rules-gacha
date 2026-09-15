# フェーズ 8: アクセシビリティとパフォーマンス

**完了条件**: 下記のチェックリストを全て確認し、パフォーマンス予算に収まっている。

Playwright・axe-core・Storybook は入れません。ブラウザ操作と a11y は手動確認とします。自動テストを持たないぶん、リリース前にこのリストを消化してください。

各項目には根拠（ファイルと行、または実測値）を添えてあります。**スクリーンリーダーでの読み上げと、キーボードのみの通し確認は未消化です。** この 2 つは実機でしか確かめられないため、リリース前に手動で消化してください。

## アクセシビリティ チェックリスト

`jsx-a11y` のルールを扱うサイトである以上、自サイトでは `oxlint` の `jsx-a11y` ルールを全て有効にします。`npm run lint` は `--deny-warnings` で走るため、違反があれば CI が落ちます。

### 抽選

抽選結果はページ遷移で見せるため、結果の読み上げはルールページの `<h1>` と Next.js の route announcer が担います。

- [x] 抽選ボタンは `<button>`。押下中は `aria-busy="true"` — `src/components/action-button.tsx`。生成 HTML に `<button aria-busy="false" type="button">` を確認
- [x] トップの `<output>`（暗黙の `role="status"`）が告げるのは「抽選中」だけで、結果は流さない — `src/features/gacha/gacha-machine.tsx:158`
- [x] 演出中の中間状態（カプセルの落下など）は読み上げない（`aria-hidden`） — 同 152。生成 HTML に `aria-hidden="true"` を確認
- [x] 連打しても二重に遷移しない（演出中はボタンを `disabled` にする） — `src/components/action-button.tsx` が `disabled={busy}` を付ける
- [ ] 遷移後、スクリーンリーダーでルール名が読み上げられる — **未消化（実機確認）**
- [ ] ルールページの「もう一度引く」に Tab で自然に到達できる — **未消化（実機確認）**

### 演出

- [x] 画面タップ / Esc / Space でスキップできる。手段は初回のみテキストで案内 — `src/features/gacha/gacha-machine.tsx` の `keydown` / `pointerdown` リスナーと `skipHintStore`
- [x] `prefers-reduced-motion: reduce` で 150ms のクロスフェードに置換される — `src/features/gacha/sequence.ts:10,25-29`（`REDUCED_CROSSFADE_SECONDS = 0.15`）
- [x] コレクション画面に演出を足していない（進捗バーにトランジションを付けていない）

### 表示

- [x] テキストのコントラストが 4.5:1 以上 — 全カテゴリ色が `cabinet` / `cabinet-2` に対し 4.5:1 以上であることを確認済み（[未決事項](./open-questions.md) の決着済み）
- [x] カテゴリは色 + ラベルで表されている — `src/components/category-badge.tsx` がカテゴリ名をテキストで出す。コレクションの達成率チップも `CategoryBadge` + 件数
- [x] コードスニペットは単色表示にとどめている — `src/components/code-block.tsx`
- [x] コレクションの未所持シルエットは**ルール名を DOM に出さない**。幅も固定で名前の長さが漏れない — `src/features/collection/rule-grid.tsx`。`aria-label` で「未所持」と伝える

### 言語

- [x] `<html lang>` が言語と一致している — 生成 HTML で `/en` が `lang="en"`、`/ja` が `lang="ja"`
- [x] 言語スイッチャーが `hreflang` 付きのリンクである — `src/components/site-header.tsx`。生成 HTML に `<a aria-current="true" href="/en/..." hrefLang="en">` / `<a href="/ja/..." hrefLang="ja">` を確認
- [x] `alternates.languages` を出している — `src/lib/alternates.ts`。生成 HTML に `<link rel="canonical">` と `<link rel="alternate" hrefLang="en|ja">` を確認

### 通し確認

- [ ] キーボードのみで「回す → ルールページ → 設定コピー → もう一度引く」まで到達できる — **未消化（実機確認）**

## パフォーマンス予算

| 指標                    | 目標                                     | 実測                                 |
| ----------------------- | ---------------------------------------- | ------------------------------------ |
| トップの初期 JS（gzip） | 100KB 以下                               | **196.4KB（未達）**                  |
| `rules.index.json`      | 60KB 以下（gzip 15KB 程度）              | 44.9KB / gzip 7.6KB（達成）          |
| ルール詳細ページの JS   | 最小限（抽選とコピーの島のみ）           | 176.5KB（フレームワーク基準 +3.2KB） |
| LCP                     | 1.5s 以下（4G 相当）                     | 未計測（実機確認）                   |
| INP                     | 200ms 以下（ボタン押下から演出開始まで） | 未計測（実機確認）                   |

### 初期 JS の内訳（`npm run build` 後、HTML が読む `<script src>` の gzip 合計）

| ページ               | gzip    | 基準との差 |
| -------------------- | ------- | ---------- |
| About（Client なし） | 173.3KB | —          |
| 言語振り分け `/`     | 175.0KB | +1.7KB     |
| ルール詳細           | 176.5KB | +3.2KB     |
| コレクション         | 178.4KB | +5.1KB     |
| トップ               | 196.4KB | +23.1KB    |

**予算 100KB を超えているのは自前のコードではなく、Next.js 16 + React 19 のフレームワーク基準（約 173KB gzip）です。** Client Component を 1 つも置いていない About ページでも 173.3KB あり、自前のコードが足しているのはトップで 23KB（`motion` と抽選・フィルタの島）、ルール詳細で 3.2KB に収まっています。100KB という数字は仕様書 v0.5 の時点の見積もりで、現行のフレームワークでは達成できません。**予算そのものを見直すか、フレームワーク基準を除いた「自前コードの増分」で測る指標に改めてください。**

### タスク

- [x] 詳細データがクライアントへ送られていないことを確認する（`src/generated/rules.json` をビルド時にサーバー側で読む）
- [x] `rules.index.json` のサイズを実測する → **44,932 バイト**（gzip 約 7.6KB）
- [x] フォントは `next/font` のサブセット指定を使う — 3 書体とも `subsets: ["latin"]`。日本語グリフは `subsets` の指定と無関係に配信される（[未決事項](./open-questions.md) の決着済み）
- [x] 装飾は CSS のみで実装し、依存を増やさない — フェーズ 5〜8 で新規依存を追加していない
- [x] ルール詳細ページのクライアント JS が最小限であることを確認する — フレームワーク基準 +3.2KB。言語スイッチャーを Server Component にして `usePathname` を避けたため増えていない
- [x] 870 件のコレクション一覧の初期描画コストを抑える — 各セクションに `content-visibility: auto` と `contain-intrinsic-size` を指定（`src/features/collection/rule-grid.tsx`）

### 予算表の修正について

旧版の「ルール詳細ページの JS: 最小限（**Client Component を置かない**）」はフェーズ 2 の設計変更（抽選結果をルールページで見せ、「もう一度引く」をそこに置く）で成立しなくなっていたため、「最小限（抽選とコピーの島のみ）」に改めました。フェーズ 6 の言語スイッチャーを Server Component にしたのは、この予算を守るためです。
