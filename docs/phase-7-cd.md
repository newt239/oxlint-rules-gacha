# フェーズ 7: CD

**完了条件**: ビルドコマンドに `rules:build` と `test` が組み込まれ、週次更新が回る。

デプロイ先は **ロリポップ！デプロイナウ** です。

## 構成

```
push（main）
  └─ デプロイナウがビルド
       npm ci
       npm run build:deploy   rules:build → test → build
       → .next/standalone を公開

GitHub Actions
  ├─ PR: npm run codecheck + npm run test（デプロイのゲートではなく開発中のチェック）
  └─ schedule（週次）: main へ空コミットを push してデプロイを起動
```

テストが落ちればビルドが失敗し、デプロイされません。デプロイのゲートとしては機能します。

## 済んだこと

- [x] ビルドコマンドを 1 つにまとめた。`package.json` の `build:deploy` が `npm run rules:build && npm run test && npm run build` を実行する
- [x] 週次のルール更新を GitHub Actions の `schedule` から起動する（`.github/workflows/refresh-rules.yml`。毎週月曜 08:00 JST = `cron: "0 23 * * 0"`）
- [x] 取得に失敗したときにビルドが**失敗する**ことを確認した。`fetch` を失敗させて `scripts/build-rules.ts` を実行すると終了コード 1 になり、`&&` 連結のため `next build` へ到達しない

## 残っていること（リポジトリだけでは完了できない）

- [ ] GitHub リポジトリを作成し `git remote` を設定する（**現在このリポジトリに remote がありません**）
- [ ] デプロイナウのプロジェクトを作成し、GitHub 連携の「デプロイするブランチ」を `main` にする
- [ ] `lolipop build-config update --build "npm run build:deploy"` を実行する
- [ ] `NEXT_PUBLIC_SITE_URL` を登録する
- [ ] 差分があればそのまま公開されることを確認する

## デプロイナウの仕様（確認済み）

- ビルド／インストールコマンドはプロジェクト作成時か `lolipop build-config update` で変更できる
- 出力ディレクトリは既定で `.next/standalone`。`--output` の指定は要らない
- `next.config` の `output: 'standalone'` が必須。外すと公開に必要な成果物を組み立てられない
- **`.env` は読まれない。** 環境変数はダッシュボードか `lolipop env create` で設定する。本番とプレビューで別に持てる
- 接続ブランチへの push で自動デプロイ。プルリクエストごとのプレビュー URL もある
- **Deploy Hook / Webhook は提供されていない。** CLI の認証もブラウザ経由で `~/.config/lolipop/credentials.json` に保存する方式のため、CI から `lolipop deploy` を叩く手段がない。週次更新を空コミット push で起こしているのはこのため

## 既存の CI

`.github/workflows/codecheck.yml` は PR と `main` への push で次を実行します。

- `npm ci`
- `npm run typecheck` / `lint` / `format` / `knip`
- `npm run test`

## 注意点

- **デプロイナウのビルドは PR のステータスチェックを返しません。** PR 段階の lint / test は GitHub Actions 側の責務です。
- **週次ジョブの空コミットは GPG 署名されません。** `AGENTS.md` の署名要件はローカル作業のコミットに対するものです。
- **`npm run setup:repo` でブランチ保護（PR 必須）を設定すると、週次ジョブの `main` への直接 push が弾かれます。** 週次更新を使うなら、ルールセットに GitHub Actions のバイパスを設けるか、ブランチ保護を適用しないでください。
- npm 11 の `allowScripts` により、依存を更新するとインストールスクリプトの再承認が要ります。ビルドが `npm warn allow-scripts` で止まる場合はここを疑ってください。
- `@stylexswc/*` と `next` は Dependabot のまとめ更新から除外してあります。個別 PR で来るので、まとめてマージしないこと。

## 生成物をコミットする方式に切り替える場合

ビルド環境から `oxc.rs` へ到達できない場合の構成。

- [ ] `src/generated/` と `public/data/` を `.gitignore` から外す
- [ ] ビルドコマンドを `npm run test && npm run build` に戻す
- [ ] GitHub Actions の週次ジョブで再生成し、差分があれば自動 PR を出す
