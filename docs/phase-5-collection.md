# フェーズ 5: コレクションと設定出力

**完了条件**: localStorage への永続化が動き、`.oxlintrc.json` をコピーできる。→ **達成**

## データ構造

```ts
type Collection = {
  version: 1;
  obtained: Record<string /* ruleId */, { count: number; firstAt: number }>;
  rulesetVersion: string;
};
```

`src/lib/collection.ts` に実装しました。localStorage のキーは旧実装から変えず `oxlint-gacha:collection` のままです。

## 済んだこと

### 永続化

- [x] localStorage に保存する — `src/lib/stores.ts` の `collectionStore`
- [x] **`rulesetVersion` が変わっても既存データは破棄しない** — `recordDraw` は `rulesetVersion` だけを上書きし `obtained` に触らない。削除済みルールは `collectionProgress` の `retired` として残り、コレクション画面に「過去のルール」としてグレー表示される
- [x] `version` を持たせ、将来のマイグレーションに備える — `reviveCollection` が分岐点。`version` が未知でも `obtained` が読めれば取り込む
- [x] 旧形式（`string[]`）の localStorage を破棄せず取り込む — `reviveCollection` が配列を受けたら `{ count: 1, firstAt: 0 }` に変換する

### コレクション画面（`/[lang]/collection`）

- [x] プラグイン別セクション。未所持はシルエット表示（**ルール名を DOM に出さない**。幅も固定にして名前の長さが漏れないようにした）
- [x] ソート: 入手順 / カテゴリ / プラグイン — `collectionSections`
- [x] 全体件数に加えてプラグイン別・カテゴリ別の達成率を表示する — `ProgressSummary`

### 設定出力

- [x] 所持ルールのみから `.oxlintrc.json` を一括生成する — `src/lib/oxlintrc.ts` の `buildOxlintrc`
- [x] 結果カードからは単体の `Copy config` を出す — `src/features/rule/rule-actions.tsx`。同じ `buildOxlintrc` を使う
- [x] 生成した JSON が正しいことを単体テストで確認する — `src/lib/oxlintrc.test.ts`

## 生成する `.oxlintrc.json`

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "categories": { "correctness": "off" },
  "plugins": ["eslint", "jsx-a11y", "unicorn"],
  "rules": {
    "eslint/eqeqeq": "error",
    "jsx-a11y/alt-text": "error",
    "unicorn/no-null": "error"
  }
}
```

`plugins` と `categories` を出す理由（oxlint 1.80.0 の `configuration_schema.json` と oxc.rs で確認）:

- `plugins` を書かないと `vue` / `vitest` / `jsdoc` などのルールが黙って動かない。書くと既定のプラグイン集合を**上書き**するので、所持ルールのプラグインを漏れなく列挙する
- `categories` を書かないと `correctness` が既定で有効のままになり、「所持ルールだけが動く」設定にならない。既定 ON は `correctness` だけなので 1 行で足りる

実際に生成した設定で `oxlint` を走らせ、**所持ルールだけが発火し、`correctness` の既定ルール（`no-dupe-keys` / `no-debugger`）が抑止される**ことを確認済みです。

## テスト

- [x] 所持ルールから生成した `.oxlintrc.json` が正しい JSON であること — `src/lib/oxlintrc.test.ts`
- [x] `rulesetVersion` が変わっても既存の所持データが失われないこと — `src/lib/collection.test.ts`
- [x] 達成率とソート — `src/lib/collection-progress.test.ts`

## 注意点（実装時に守ったこと）

- `getServerSnapshot` は静的生成時に呼ばれるため、必ず「未所持」を返す。`EMPTY_COLLECTION` をモジュールレベル定数として同一参照で返している
- ルールインデックスは RSC ペイロードに載せず `public/data/rules.index.json` を fetch する。初期データ取得目的の `useEffect` は使えないので、`src/lib/use-rule-index.ts` で `subscribe` の初回に fetch を起動する `useSyncExternalStore` ストアにした
- コレクションはクライアント側だけの状態。サーバーへ送らず、他ユーザーと共有する機能も作らない
