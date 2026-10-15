# 執筆と公開の手順

## 記事の追加

1. 記事を公開してよい内容か確認し、適切なカテゴリにMarkdownファイルを作ります。ファイル名は英数字とハイフンによる安定したslugにします。
2. 必要に応じて [`../templates/article.md`](../templates/article.md) を使います。
3. `src/SUMMARY.md` に記事を登録し、必要ならカテゴリの `README.md` にも説明やリンクを追加します。
4. 相対リンク、画像、コード例、出典を確認し、mdBook 0.5.4で `mdbook build` を実行します。
5. 公開前に人が内容と出典をレビュー・校正します。ビルド成功は公開承認を意味しません。
6. Pull Requestで変更を確認し、`main` に取り込むとPagesへデプロイされます。

## Mermaid図

Mermaidを使う開発環境では、mdBook 0.5.4と `mdbook-mermaid` 0.17.1を固定して使います。

```bash
cargo install mdbook-mermaid --version 0.17.1 --locked
python3 scripts/prepare-mermaid-assets.py
npm ci
npm run serve
```

準備スクリプトは `mdbook-mermaid install .` で初期化ファイルを用意し、Mermaid.js 11.16.1のnpm配布アーカイブをSHA-512検証して `mermaid.min.js` に配置します。アセットはルートに生成されますが、`.gitignore` 対象のためコミットしません。実行時に外部CDNへ接続せず、Node.jsも使いません。ローカルとCIは同じスクリプト・同じ固定バージョンを使用します。

Mermaidコードフェンスはローカルプレビューで描画を確認し、構文エラーはブラウザーの表示と開発者コンソールで調べます。mdBookのビルドが成功しても、ブラウザーでの図の描画確認にはなりません。Mermaidの出所、バージョン、ライセンスと脆弱性の判断は[第三者ライセンス一覧](../src/legal/third-party.md)に記録します。

## プレビューとビルド

リポジトリルートで次を実行します。

```bash
mdbook build
python3 scripts/prepare-pagefind.py --site book
npm exec -- pagefind --site book
python3 scripts/verify-pagefind.py --site book
node scripts/smoke-pagefind.mjs book
```

GitHub ActionsはNode.js 22.22.1と `package-lock.json` の固定依存を使い、同じ順序で検索インデックスを作成します。Pagefindは記事の `<main>` のみを索引化します。`print.html`、`404.html`、`toc.html` は公開成果物に残し、検索対象から除外します。検索UIは `pagefind-init.js` がPagefindのコンポーネントを読み込み、初期化スクリプトの配信パスから基準URLを決めます。そのため、ローカルの `/` とGitHub Pagesの `/commonplace/` の両方で結果リンクが正しく解決されます。スモークテストは日本語・英語・混合クエリ、両方の基準URL、抜粋のハイライト、検索結果と見出しURL、重複ページ、大小文字の違いを確認します。

`mdbook serve` はビルド後のPagefind生成処理を実行せず、再ビルド時に既存のPagefind出力も消去します。ライブプレビューでは `npm run serve` を使ってください。このラッパーはmdBookの初回ビルドと各再ビルド後に、記事マーク付け、Pagefind生成、出力検証を実行します。mdBookの引数は `npm run serve -- --port 3001` のように渡せます。

Pagefindは日本語の単語分割に対応しますが、語幹処理は行いません。活用形や表記揺れは一致しない場合があります。

ブラウザーでmdBookのローカルURLを開き、検索結果の移動先がサイトルート配下になることを確認します。UIのCSS・JavaScriptと検索データはローカルサーバーから配信され、外部の検索サーバーは使いません。

生成物は `book/` に置かれ、Git管理しません。Pull RequestではGitHub Actionsがビルド検証し、公開処理は行いません。

## GitHub Pagesの初回設定

リポジトリ設定の **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にします。ワークフローは `main` へのpush、または `main` を対象にした手動実行でPages artifactをデプロイします。手動実行時は対象ブランチに `main` を選んでください。他のブランチから実行した場合はビルドのみ行い、Pagesへはデプロイしません。必要なPagesとOIDC権限はdeployジョブに限定し、個人アクセストークンは使いません。

GitHubリポジトリ `namba3/commonplace` は、`owner.github.io`形式のユーザーサイトではなく通常のプロジェクトサイトです。カスタムドメイン用の`CNAME`ファイルは置かず、`book.toml` の `site-url` を `/commonplace/` に設定しています。リポジトリ名やPages構成を変更するときは、`book.toml` とこの説明を合わせて更新します。

`git-repository-url` はGitHubリポジトリへのリンクに使います。印刷ボタンと編集提案ボタンは `book.toml` で無効にしています。

## 著作権・ライセンス

記事、画像、ソースコードのライセンスは一括指定していません。Publicリポジトリであることだけで自由な再利用が許諾されるわけではありません。引用や画像には個別の出典・権利表示を付け、第三者の利用条件を確認してください。現在LICENSEファイルはありません。ライセンスを決める場合は別途明示的に選定します。

ビルドツールとサイトで配信する第三者資産の個別ライセンスは、[サイトのライセンスページ](../src/legal/third-party.md)に掲載します。資産の追加・更新時は[サードパーティライセンス管理手順](THIRD_PARTY_LICENSES.md)に従って一覧と原文を確認します。

## 今後の拡張候補

記事数が増え、運用上の必要が生じた場合に、Front Matter、目次・タグ索引・新着記事の自動生成、RSS/Atom、独自Sitemap、関連記事推薦、転載、CMS、独自テーマを検討します。現時点では実装していません。
