# フェーズ 1: データパイプライン

`scripts/build-rules.ts` を、ダミー fetch から本物のルールデータ生成に育てる。

**完了条件**: `public/data/rules.index.json` が生成され、件数が `oxlint --rules` と一致する。

## 前提（フェーズ 0 で判明した実態）

- ルールは **870 件**、15 プラグイン。仕様書の 612 件は古い数字。

  | プラグイン | 件数 |     | プラグイン | 件数 |
  | ---------- | ---- | --- | ---------- | ---- |
  | eslint     | 187  |     | jsx_a11y   | 36   |
  | unicorn    | 138  |     | import     | 33   |
  | typescript | 110  |     | oxc        | 27   |
  | react      | 85   |     | jsdoc      | 23   |
  | vitest     | 73   |     | nextjs     | 21   |
  | jest       | 60   |     | promise    | 16   |
  | vue        | 46   |     | node       | 11   |
  |            |      |     | react_perf | 4    |

- **ドキュメントのディレクトリ名はアンダースコア**（`jsx_a11y` / `react_perf`）。oxlint のルール ID はハイフン（`jsx-a11y/alt-text`）。**この 2 つは別物なので変換が要る。**
- `oxc.rs/llms.txt` は 97KB。`- [eslint/no-debugger | Oxlint](/docs/guide/usage/linter/rules/eslint/no-debugger.md)` の形式で並ぶ。

## タスク

### 取得と変換

- [ ] `scripts/lib/` にプラグイン ID の変換を実装する（`jsx_a11y` → `jsx-a11y`、`react_perf` → `react-perf`）。単体テストを書く
- [ ] 各ルールの Markdown を取得する。**同時実行数は 4 並列程度に絞る**（`oxc.rs` に負荷をかけない）
- [ ] Markdown をパースして `RuleDetail` を組み立てる
  - カテゴリ（`correctness` / `suspicious` / `pedantic` / `style` / `restriction` / `nursery`）
  - fix 状況（`none` / `fix` / `suggestion` / `dangerous`）
  - 既定で有効かどうか
  - 要約（1〜2 文）・説明（Markdown 原文）・良い例 / 悪い例
- [ ] パース結果を検証する。`zod` を**ビルド時のみの依存**として入れてよい（壊れ方が分かりやすくなる）

### 出力

- [ ] `public/data/rules.index.json` — 全件の軽量メタ。クライアントが fetch する
- [ ] `src/generated/rules/<plugin>/<rule>.json` — 詳細。`generateStaticParams` とルール詳細ページがビルド時に読む
- [ ] 取得元 oxlint のバージョンを `rulesetVersion` として記録する

### 整合性チェック

- [ ] `npx oxlint@latest --rules` の出力と件数を突き合わせる。**一致しない場合はビルドを失敗させる**
- [ ] 取得に失敗した場合も**ビルドを失敗させる**。直前の成功時の成果物を使い回さない（古いデータが無言で公開され続けるほうが問題）

### テスト

- [ ] 代表的な Markdown 数件のスナップショットテスト（oxc.rs 側の構造変更を検知する）
- [ ] `rules.index.json` の必須フィールドに欠落がないこと

## サイズ予算

`rules.index.json` は **60KB 以下**（gzip 15KB 程度）。フェーズ 0 のダミーは `docPath` を持っていたため 137KB ありました。`plugin` と `name` から導出できる値は持たせないこと。

870 件で 60KB なら 1 件あたり約 70 バイト。次の形が目安です。

```json
{ "id": "eslint/no-debugger", "c": "correctness", "f": "fix", "d": true }
```

キーを短くするか配列にするかは実測して決めてください。

## 外部 fetch が通らなかった場合

フェーズ 0 のデプロイで `oxc.rs` へ到達できなかった場合の代替案。

1. 生成物を `src/generated/` と `public/data/` にコミットする（`.gitignore` から外す）
2. ビルドコマンドを `npm run test && npm run build` に戻す
3. 週次ジョブで再生成して自動 PR を出す（[フェーズ 7](./phase-7-cd.md)）
