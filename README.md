# Commonplace

**サイトURL：** [https://namba3.github.io/commonplace/](https://namba3.github.io/commonplace/)

Commonplaceは、技術的な知識、調査結果、考察などを、自分の学習や関心に沿って整理・蓄積する個人的なWebサイトです。生成AIによる調査・執筆支援も活用しながら、ソフトウェア開発、プログラミング、AI、数学などのテーマを扱います。記事はMarkdownで管理し、継続的に追記・修正します。

特定の企業・団体が運営するサービスや公式ドキュメントではなく、掲載内容もそれらの公式見解を示すものではありません。

## AIの利用

調査、構成、文章生成、編集にAIを利用しており、AIが生成した文章を含む記事があります。記事ごとに人が内容を確認・校正する方針ですが、確認範囲は記事ごとに異なります。誤りや古い情報が含まれる可能性があり、正確性・完全性・最新性を保証するものではありません。推測や考察は確認された事実と区別し、重要な判断には公式資料などの一次情報も確認してください。公開後も必要に応じて訂正・更新します。

## 技術構成

- MarkdownとmdBook 0.5.4による静的サイト生成
- `mdbook-mermaid` 0.17.1によるMermaid図
- Pagefind 1.5.2による日本語・英語の静的全文検索
- GitHub ActionsによるビルドとGitHub Pagesへのデプロイ

## ローカルでのプレビュー

Rustのツールチェーンがある環境でmdBookとMermaidプリプロセッサをインストールします。

```bash
cargo install mdbook --version 0.5.4 --locked
cargo install mdbook-mermaid --version 0.17.1 --locked
npm ci
```

Pagefindの検索生成にはNode.js/npmを使います。GitHub ActionsではNode.js 22.22.1を固定しています。

ビルドの前に、無視対象のMermaidアセットを準備します。スクリプトは `mdbook-mermaid install .` を実行した後、Mermaid.js 11.16.1をSHA-512で検証して配置します。Python 3とネットワーク接続が必要です。

```bash
python3 scripts/prepare-mermaid-assets.py
```

この準備コマンドはローカルプレビューとGitHub Actionsで共通です。生成される `mermaid.min.js` と `mermaid-init.js` はGit管理せず、ビルド時に再生成します。

検索UIを含めてライブプレビューする場合は、`mdbook serve` の代わりに次のコマンドを使います。mdBookの再ビルド後にPagefindのインデックスを作り直します。

```bash
npm run serve
```

ポートなどのmdBook引数は `npm run serve -- --port 3001` のように渡せます。`mdbook serve` を直接実行した場合、mdBookはPagefindの後処理を行わないため、検索UIとインデックスは生成されません。

サイト生成と検索インデックスの作成は次の順で行います。

```bash
mdbook build
python3 scripts/prepare-pagefind.py --site book
npm exec -- pagefind --site book
python3 scripts/verify-pagefind.py --site book
node scripts/smoke-pagefind.mjs book
```

Pagefindは `package-lock.json` で1.5.2に固定し、日本語の単語分割に対応するExtended版を使います。検索対象は記事の `<main>` に限定し、`print.html`、`404.html`、`toc.html` は除外します。検索アセットとインデックスは `book/pagefind/` に生成され、Git管理しません。検索UIの基準URLは初期化スクリプトの配信パスから決まり、ローカルの `/` とGitHub Pagesの `/commonplace/` の両方で動作します。UIと検索動作は `file://` ではなくHTTPで確認してください。

記事の追加手順やPagesの設定は [`docs/PUBLISHING.md`](docs/PUBLISHING.md) を参照してください。

## 記事の管理

記事は `src/` の各カテゴリに追加し、`src/SUMMARY.md` に登録します。記事テンプレートは [`templates/article.md`](templates/article.md)、AI利用と出典の方針は [`docs/EDITORIAL_POLICY.md`](docs/EDITORIAL_POLICY.md) にあります。

## 著作権・ライセンス

このリポジトリに記事全体へ適用するLICENSEファイルはありません。リポジトリが閲覧可能であることは、記事、画像、コードの自由な再配布・改変を許可するものではありません。それぞれの権利や利用条件は、記事中の表示や引用元のライセンスを確認してください。ビルドツールとサイトで配信する第三者資産の一覧、ライセンス原文は[サイトのライセンスページ](src/legal/third-party.md)を参照してください。追加・更新時の確認手順は[`docs/THIRD_PARTY_LICENSES.md`](docs/THIRD_PARTY_LICENSES.md)にまとめています。

## 免責事項

掲載内容は個人的な調査・学習・考察に基づき、正確性、完全性、最新性を保証しません。誤りや古い情報が含まれる可能性があります。重要な判断や実装に使う場合は、公式資料などの一次情報を確認してください。記事中の企業・団体・製品との公式な関係を示すものではなく、個人の見解を所属組織などの見解として扱わないでください。
