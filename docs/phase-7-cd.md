# フェーズ 7: CD

**完了条件**: ビルドコマンドに `rules:build` と `test` が組み込まれ、週次更新が回る。

## 構成

```
push（main）
  └─ ホスティング先でビルド
       npm ci
       npm run rules:build   ルールデータ取得
       npm run test          vitest run
       npm run build         next build（OGP 生成を含む）
       → .next/standalone を公開

GitHub Actions
  ├─ PR: npm run codecheck + npm run test（デプロイのゲートではなく開発中のチェック）
  └─ schedule（週次）: ルールデータを更新するためにデプロイを起動
```

テストが落ちればビルドが失敗し、デプロイされません。デプロイのゲートとしては機能します。

## タスク

- [ ] ビルドコマンドを `npm run rules:build && npm run test && npm run build` に設定する
- [ ] 週次のルール更新を GitHub Actions の `schedule` から起動する
  - `main` へ空コミットを push するか、ホスティング先の CLI を叩く
  - タイムゾーンは `Asia/Tokyo`
- [ ] 差分があればそのまま公開されることを確認する
- [ ] 取得に失敗したときにビルドが**失敗する**ことを確認する（古いデータが無言で公開され続けないこと）

## 既存の CI

`.github/workflows/codecheck.yml` は PR と `main` への push で次を実行します。

- `npm ci`
- `npm run typecheck` / `lint` / `format` / `knip`
- `npm run test`

`npm run setup:repo` でブランチ保護を設定すると、`codecheck` が必須ステータスチェックになります。

## 注意点

- **ホスティング先のビルドは PR のステータスチェックを返しません。** PR 段階の lint / test は GitHub Actions 側の責務です。
- ホスティング先にスケジュール実行の仕組みはありません。週次更新は GitHub Actions から起こします。
- npm 11 の `allowScripts` により、依存を更新するとインストールスクリプトの再承認が要ります。ビルドが `npm warn allow-scripts` で止まる場合はここを疑ってください。
- `@stylexswc/*` と `next` は Dependabot のまとめ更新から除外してあります。個別 PR で来るので、まとめてマージしないこと。

## 生成物をコミットする方式に切り替える場合

ビルド環境から `oxc.rs` へ到達できない場合の構成。

- [ ] `src/generated/` と `public/data/` を `.gitignore` から外す
- [ ] ビルドコマンドを `npm run test && npm run build` に戻す
- [ ] GitHub Actions の週次ジョブで再生成し、差分があれば自動 PR を出す
