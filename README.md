# Commonplace

**サイトURL：** [https://namba3.github.io/commonplace/](https://namba3.github.io/commonplace/)

Commonplaceは、技術的な知識、調査結果、考察などを、自分の学習や関心に沿って整理・蓄積する個人的なWebサイトです。生成AIによる調査・執筆支援も活用しながら、ソフトウェア開発、プログラミング、AI、数学などのテーマを扱います。記事はMarkdownで管理し、継続的に追記・修正します。

特定の企業・団体が運営するサービスや公式ドキュメントではなく、掲載内容もそれらの公式見解を示すものではありません。

## AIの利用

調査、構成、文章生成、編集にAIを利用しており、AIが生成した文章を含む記事があります。記事ごとに人が内容を確認・校正する方針ですが、確認範囲は記事ごとに異なります。誤りや古い情報が含まれる可能性があり、正確性・完全性・最新性を保証するものではありません。推測や考察は確認された事実と区別し、重要な判断には公式資料などの一次情報も確認してください。公開後も必要に応じて訂正・更新します。

## 技術構成

- MarkdownとmdBook 0.5.4による静的サイト生成
- `mdbook-mermaid` 0.17.1によるMermaid図
- GitHub ActionsによるビルドとGitHub Pagesへのデプロイ

## ローカルでのプレビュー

Rustのツールチェーンがある環境でmdBookとMermaidプリプロセッサをインストールします。

```bash
cargo install mdbook --version 0.5.4 --locked
cargo install mdbook-mermaid --version 0.17.1 --locked
```

プレビューまたはビルドの前に、無視対象のMermaidアセットを準備します。スクリプトは `mdbook-mermaid install .` を実行した後、既知の脆弱性に修正が入ったMermaid.js 11.16.1をSHA-512で検証して配置します。Python 3とネットワーク接続が必要です。Node.jsは使いません。

```bash
python3 scripts/prepare-mermaid-assets.py
```

この準備コマンドはローカルプレビューとGitHub Actionsで共通です。生成される `mermaid.min.js` と `mermaid-init.js` はGit管理せず、ビルド時に再生成します。

プレビューとビルドは次のコマンドで行います。

```bash
mdbook serve
mdbook build
```

記事の追加手順やPagesの設定は [`docs/PUBLISHING.md`](docs/PUBLISHING.md) を参照してください。

## 記事の管理

記事は `src/` の各カテゴリに追加し、`src/SUMMARY.md` に登録します。記事テンプレートは [`templates/article.md`](templates/article.md)、AI利用と出典の方針は [`docs/EDITORIAL_POLICY.md`](docs/EDITORIAL_POLICY.md) にあります。

## 著作権・ライセンス

このリポジトリに記事全体へ適用するLICENSEファイルはありません。リポジトリが閲覧可能であることは、記事、画像、コードの自由な再配布・改変を許可するものではありません。それぞれの権利や利用条件は、記事中の表示や引用元のライセンスを確認してください。ビルドツールとサイトで配信する第三者資産の一覧、ライセンス原文は[サイトのライセンスページ](src/legal/third-party.md)を参照してください。追加・更新時の確認手順は[`docs/THIRD_PARTY_LICENSES.md`](docs/THIRD_PARTY_LICENSES.md)にまとめています。

## 免責事項

掲載内容は個人的な調査・学習・考察に基づき、正確性、完全性、最新性を保証しません。誤りや古い情報が含まれる可能性があります。重要な判断や実装に使う場合は、公式資料などの一次情報を確認してください。記事中の企業・団体・製品との公式な関係を示すものではなく、個人の見解を所属組織などの見解として扱わないでください。
