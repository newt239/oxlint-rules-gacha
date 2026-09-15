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

## 済んだこと（フェーズ 6 の残タスク）

### i18n

- [x] 言語スイッチャーをヘッダに置き、`hreflang` 付きのリンクにする — `src/components/site-header.tsx`。**Server Component の素の `<a hreflang>`** にしたので、ルール詳細ページにクライアント JS が増えない。現在の言語には `aria-current="true"` を付ける
- [x] 選択を localStorage に保存して初期表示に反映する — 下記「言語の記憶」を参照
- [x] **言語の自動判定は行わない**。既定は英語
- [x] `generateMetadata` に `alternates.languages` を足す — `src/lib/alternates.ts`。`canonical` も出す

#### 言語の記憶

「保存値と現在の言語が違えば飛ばす」を全ページでやると、スイッチャーで切り替えた直後に元の言語へ引き戻されて操作が成立しません。そこで**復元は `/` でだけ行います**。

- `next.config.ts` の `/` → `/en` リダイレクトを外し、`src/app/(root)/` を**もう 1 つのルートレイアウト**（Next.js 16 のルートグループごとの複数ルートレイアウト）として追加した
- `/` は記憶した言語へ `router.replace` する。JS が無い環境では両言語へのリンクを見せる
- 保存はトップページのクライアント島が行う。`/en` または `/ja` のトップを開いた時点でその言語を記憶する
- `/` も静的生成される（`npm run build` の出力で確認済み）

### 日本語フォント

- [x] Zen Maru Gothic を接続し、**実際に日本語が表示されるか確認する** → **表示される**
- [x] `new-cap` の `capIsNewExceptions` に `Zen_Maru_Gothic` を追加
- [x] `[lang]/layout.tsx` で言語に応じて body のフォント変数を切り替える — `lang === "ja"` のときだけ `font.displayJa` に差し替える

`next/font` は Google Fonts の CSS を `subset` パラメータなしで取得し、CSS に含まれる全 woff2 をダウンロードして自己ホストします。`subsets` オプションは preload 対象の選択にしか使われないため、メタデータ上 `japanese` サブセットが無くても日本語グリフは配信されます。ビルド後の CSS で Zen Maru Gothic の `@font-face` 245 件を解析し、ひらがな・カタカナ・常用漢字が `unicode-range` に含まれることを実測しました。代償は自己ホストする woff2 が 244 ファイル・約 3.2MB 増えることと、日本語グリフが preload されないこと（`display: swap` で吸収）です。

### ルール詳細ページの残り

- [x] 「出典: oxc プロジェクト（MIT）」と原典へのリンクを明記する — `src/features/rule/rule-article.tsx` の `sourceCredit`、および About ページ
- [x] 悪い例 / 良い例を全件出すか決める → **先頭 1 つのままにする**。`src/generated/rules.json` はビルド時にサーバー側で読むためクライアント JS には響かないが、全件出すと HTML が肥大して LCP に効く。全件は原典リンクに委ねる

### About ページ

- [x] サイト説明・データ出典 — `src/app/[lang]/about/page.tsx` + `src/features/about/about-article.tsx`
- [x] MIT ライセンス表記
- [x] **本サイトが非公式である旨**

## 注意点

- 共有 URL は「引いた結果」ではなく「そのルールのページ」を指します。
- `<html lang>` が言語と一致し、言語スイッチャーが `hreflang` 付きのリンクであることを確認してください。
