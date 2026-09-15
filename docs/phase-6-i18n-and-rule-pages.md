# フェーズ 6: i18n・ルール詳細・OGP

**完了条件**: 両言語の全ページが静的生成され、OGP が表示される。

抽選結果をルールページで見せる設計にしたため、**ルール詳細ページ・OGP・i18n 辞書はフェーズ 2〜3 で前倒しして実装済み**です。このファイルには残りのタスクだけを置いています。

## 実測したページ数とビルド時間

|                             | 件数                |
| --------------------------- | ------------------- |
| ルール詳細                  | 870 × 2 言語 = 1740 |
| トップ                      | 2                   |
| その他（`_not-found` など） | 4                   |
| **合計**                    | **1746 ページ**     |

`npm run build` で **1746 ページを約 3 秒**で静的生成できました。仕様書が心配していたビルド時間の問題は起きていないため、OGP を代表画像 1 枚へ縮退する必要はありません。

OGP 画像は `generateStaticParams` を書いても `dynamic = "force-static"` を付けてもビルド時には出力されず、**初回リクエストで生成して以降キャッシュする**方式になりました（`x-nextjs-cache: HIT`）。Node サーバーで動かす限り問題ありませんが、静的ホスティングへ移す場合は事前生成の手段を別途探す必要があります。

## 完了しているもの

- `src/i18n/{en,ja,index}.ts`。`en.ts` の型を `Dictionary` として `ja.ts` に適用しているので、キーが欠けると型エラーになる
- `getDictionary(lang)`。未知の言語は英語にフォールバック
- 辞書は Server Component で読み、Client Component には使うキーだけを props で渡す
- i18n ライブラリは入れていない
- `[lang]` は `dynamicParams = false` で `en` / `ja` 以外は 404
- ルール詳細ページ `/[lang]/rules/[plugin]/[rule]`。Server Component のみで、`generateStaticParams` が 870 件 × 2 言語を列挙する
- `generateMetadata` で title / description / `openGraph` を出力する
- oxc.rs の原典へのリンクと「説明は英語の原文」という注記
- URL のプラグイン名は oxlint のルール ID 側（`jsx-a11y`）に揃えてある
- `opengraph-image.tsx` でルール名とカテゴリバッジを描画する

## 残りのタスク

### i18n

- [ ] 言語スイッチャーをヘッダに置き、`hreflang` 付きのリンクにする
- [ ] 選択を localStorage に保存して初期表示に反映する
- [ ] **言語の自動判定は行わない**。既定は英語
- [ ] `generateMetadata` に `alternates.languages` を足す

### 日本語フォント

フェーズ 0 では Baloo 2 + Geist Mono のみ接続しています。Zen Maru Gothic は next/font のメタデータ上 `japanese` サブセットを持たないため、`subsets: ["latin"]` では日本語グリフが配信されない可能性があります。

- [ ] Zen Maru Gothic を接続し、**実際に日本語が表示されるか確認する**
- [ ] 配信されない場合の代替案
  - 別の日本語フォントを使う
  - `next/font/local` でサブセット化した woff2 を同梱する
  - 日本語 UI はシステムフォントに任せる
- [ ] `new-cap` の `capIsNewExceptions` にフォント関数名を追加する（`.oxlintrc.json`）
- [ ] `[lang]/layout.tsx` で言語に応じて body のフォント変数を切り替える

### ルール詳細ページの残り

- [ ] 「出典: oxc プロジェクト（MIT）」と原典へのリンクを明記する
- [ ] 悪い例 / 良い例を 1 つずつではなく全件出すか決める（現在は先頭 1 つのみ）

### About ページ

- [ ] サイト説明・データ出典
- [ ] MIT ライセンス表記
- [ ] **本サイトが非公式である旨**

## 注意点

- 共有 URL は「引いた結果」ではなく「そのルールのページ」を指します。
- `<html lang>` が言語と一致し、言語スイッチャーが `hreflang` 付きのリンクであることを確認してください。
