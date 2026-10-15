# サードパーティライセンス

作成日：2026-10-12 / 更新日：2026-10-15

Commonplaceの記事や画像に包括的なライセンスを付与するページではありません。ここでは、ビルドに使うツールと、サイトのHTML・JavaScript・CSS・フォントとして配信する主な第三者ソフトウェアを区別して記載します。上流ソースとライセンスは記載した固定バージョンを基準にしています。

## ビルド専用ツール

次のツールはサイトの生成に使用し、GitHub Pagesの訪問者へ実行ファイルとして配布しません。

| ソフトウェア | バージョン | 用途 | ライセンス・原文 |
| --- | --- | --- | --- |
| [mdBook](https://github.com/rust-lang/mdBook/tree/v0.5.4) | 0.5.4 | Markdownから静的サイトを生成。下記のmdBook由来のブラウザー資産も生成・配信します。 | MPL-2.0 ([原文](licenses/MPL-2.0.txt), [上流](https://github.com/rust-lang/mdBook/blob/v0.5.4/LICENSE)) |
| [mdbook-mermaid](https://github.com/badboy/mdbook-mermaid/tree/v0.17.1) | 0.17.1 | MermaidコードブロックをHTMLへ変換し、初期化スクリプトをインストール。 | MPL-2.0 ([原文](licenses/MPL-2.0.txt), [上流](https://github.com/badboy/mdbook-mermaid/blob/v0.17.1/LICENSE)) |
| [Pagefind](https://github.com/Pagefind/pagefind/tree/v1.5.2) | 1.5.2 | 日本語対応検索インデックスを生成し、Component UIと検索ランタイムを提供。 | MIT ([原文と同梱コンポーネントの表示](licenses/MIT-Pagefind.txt), [上流](https://github.com/Pagefind/pagefind/blob/v1.5.2/LICENSE/LICENSE)) |

ローカルとGitHub Actionsではこの表のバージョンを使用します。Cargo経由の間接依存はビルド環境で使うもので、サイトから配信する資産とは分けて扱います。

## サイトから配信する資産

### mdBookのテーマとブラウザー機能

mdBook 0.5.4が生成する `book-*.js`、検索・目次・ハイライト用のJavaScript、CSS、favicon、HTML内のUIを配信します。mdBook本体のソースはMPL-2.0です。ライセンス表示を含む上流の[HTMLフロントエンド](https://github.com/rust-lang/mdBook/tree/v0.5.4/crates/mdbook-html/front-end)と[ライセンス原文](licenses/MPL-2.0.txt)を参照してください。

生成HTMLやアセットに保持されているバージョン・著作権表示をもとに、主な構成要素を記します。

| 配信される構成要素 | バージョン | ライセンス | 原文・上流ソース |
| --- | --- | --- | --- |
| [clipboard.js](https://github.com/zenorocha/clipboard.js/tree/v2.0.4) | 2.0.4 | MIT（配信JSの表示と固定版のpackage metadata） | [MIT原文](licenses/MIT.txt), [上流のpackage metadata](https://github.com/zenorocha/clipboard.js/blob/v2.0.4/package.json)。このタグには独立した `LICENSE` ファイルがなく、配信JSの `© Zeno Rocha` 表示を保持しています。 |
| [elasticlunr](https://github.com/weixsong/elasticlunr.js/tree/v0.9.5) | 0.9.5 | MIT | [原文](licenses/MIT.txt), [上流ライセンス](https://github.com/weixsong/elasticlunr.js/blob/v0.9.5/LICENSE) |
| [highlight.js](https://github.com/highlightjs/highlight.js/tree/10.1.1) | 10.1.1 | BSD-3-Clause | [原文](licenses/BSD-3-Clause-Highlight.js.txt), [上流ライセンス](https://github.com/highlightjs/highlight.js/blob/10.1.1/LICENSE) |
| [mark.js](https://github.com/julmot/mark.js/tree/8.11.1) | 8.11.1 | MIT | [原文](licenses/MIT.txt), [上流ライセンス](https://github.com/julmot/mark.js/blob/8.11.1/LICENSE) |
| [Font Awesome Free](https://github.com/FortAwesome/Font-Awesome/tree/6.2.0) inline SVG icons | 6.2.0 | CC BY 4.0 | [原文](licenses/CC-BY-4.0.txt), [上流ライセンス](https://github.com/FortAwesome/Font-Awesome/blob/6.2.0/LICENSE.txt)。生成HTMLにも著作権者・ライセンスへの帰属表示があります。 |
| [Octicons](https://github.com/primer/octicons/tree/v2.0.0) のコピー用アイコン | 2.0.0 | MIT | [原文](licenses/MIT.txt), [上流](https://github.com/primer/octicons/tree/v2.0.0)。上流CSSの帰属表示は配信CSSに保持されています。 |
| [Open Sans](https://github.com/googlefonts/opensans) フォント | mdBook同梱版 | Apache-2.0 | [フォントとライセンス](licenses/Apache-2.0-Open-Sans.txt), [Apache-2.0原文](licenses/Apache-2.0.txt) |
| [Source Code Pro](https://github.com/adobe-fonts/source-code-pro) フォント | mdBook同梱版 | SIL OFL 1.1 | [フォントとライセンス](licenses/OFL-1.1-Source-Code-Pro.txt) |

mdBookの生成物には、上記以外にもmdBook由来のJavaScript・CSSがあります。それらのライセンス表示とソースは、mdBook 0.5.4の上流フロントエンドに従います。`ayu-highlight.css`、`highlight.css`、`tomorrow-night.css` のテーマ由来表示、CSS内のOcticons表示、HTML内のFont Awesome表示も生成ファイルに保持しています。サイト生成時にバージョン付きハッシュ名が付くファイルは、対応する元のファイル名を示しています。

### Mermaid

`mermaid-*.min.js` として配信するMermaid.jsは11.16.1です。ビルド前に `mdbook-mermaid install .` が生成する同梱版11.6.0を、[npmの固定配布アーカイブ](https://registry.npmjs.org/mermaid/-/mermaid-11.16.1.tgz)内の公式 `dist/mermaid.min.js` で置き換えます。準備スクリプトはアーカイブのSHA-512 SRI `sha512-TQsq6u22fAn3rek5VOubrhKPo1g5hwC3FXUN9hiyupTckcYiGuuKGkNQrKYwGJkXUxZdojwRG46gsSCFZMDp4g==` とJS本体のSHA-256を検証します。実行時のCDN依存はなく、JavaScript資産はGitHub Pagesから配信します。Mermaid本体はMITライセンスです ([原文](licenses/MIT-Mermaid.txt), [Mermaid 11.16.1の上流リリース](https://github.com/mermaid-js/mermaid/tree/mermaid%4011.16.1), [配布ファイルのpackage metadata](https://registry.npmjs.org/mermaid/11.16.1))。

この差し替えはセキュリティ上の理由によるものです。mdbook-mermaid 0.17.1同梱の11.6.0は、後に公表された複数の脆弱性の影響対象です。選定した11.16.1では、11.16.0以前を対象とするアーキテクチャ図のprototype pollution、レーダー図のDoS、XYチャートの無限ループ、CSS injectionなどの修正が確認できます ([公式アドバイザリ一覧](https://github.com/mermaid-js/mermaid/security/advisories?state=published), [prototype pollutionのアドバイザリ](https://github.com/mermaid-js/mermaid/security/advisories/GHSA-3rrr-jr9j-h3q3), [レーダー図DoSのアドバイザリ](https://github.com/mermaid-js/mermaid/security/advisories/GHSA-rhh3-jpg6-66xh), [11.16.1変更履歴](https://github.com/mermaid-js/mermaid/blob/develop/packages/mermaid/CHANGELOG.md))。バージョン固定は既知の脆弱性がないことを保証しません。更新時にはMermaidの公式アドバイザリを再確認します。

Mermaidの配布バンドルは第三者コンポーネントのライセンス表示をファイル末尾に保持しています。表示されている主な構成要素は次のとおりです。

| バンドル内の構成要素 | バージョン | 表示されているライセンス | 原文・上流 |
| --- | --- | --- | --- |
| [DOMPurify](https://github.com/cure53/DOMPurify/tree/3.4.0) | 3.4.0 | Apache-2.0 または MPL-2.0 | [Apache原文](licenses/Apache-2.0.txt), [MPL原文](licenses/MPL-2.0.txt), [上流ライセンス](https://github.com/cure53/DOMPurify/blob/3.4.0/LICENSE) |
| [js-yaml](https://github.com/nodeca/js-yaml/tree/4.1.1) | 4.1.1 | MIT | [上流ライセンス原文](licenses/MIT-js-yaml.txt), [上流ライセンス](https://github.com/nodeca/js-yaml/blob/4.1.1/LICENSE) |
| [Lodash (custom build)](https://github.com/lodash/lodash) | 4.18.1 (バンドル表示) | MIT | [原文](licenses/MIT.txt), [上流ライセンス](https://github.com/lodash/lodash/blob/4.18.1/LICENSE) |
| [Cytoscape.js](https://github.com/cytoscape/cytoscape.js) とレイアウト拡張 [cose-bilkent](https://github.com/cytoscape/cytoscape.js-cose-bilkent) / [fcose](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose) | バンドル内に個別バージョン表示なし | MIT | [Cytoscapeライセンス原文](licenses/MIT-Cytoscape.txt)、[cose-bilkent](licenses/MIT-cose-bilkent-4.1.0.txt)、[fcose](licenses/MIT-fcose-2.2.0.txt)。上流ライセンス: [Cytoscape](https://github.com/cytoscape/cytoscape.js/blob/v3.33.3/LICENSE), [cose-bilkent](https://github.com/cytoscape/cytoscape.js-cose-bilkent/blob/v4.1.0/LICENSE), [fcose](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose/blob/v2.2.0/LICENSE) |

この表のバージョンはMermaid.js 11.16.1の配信バンドル末尾に表示された情報を記載しています。バンドルに個別バージョン表示がない構成要素は、その旨を明記しました。Cytoscape関連の上流ライセンス原文には著作権表示を含めています。バンドル末尾にあるPromises/A+ thenable、jQueryイベント由来コード、Bezier曲線、Runge-Kutta spring physicsのMIT表示も、配信ファイル中に保持しています。準備処理ではライセンスコメントを加工せず、上流の `mermaid.min.js` をそのまま配置します。

`mermaid-init-*.js` は `mdbook-mermaid` 0.17.1由来の初期化スクリプトで、MPL-2.0です ([原文](licenses/MPL-2.0.txt), [対応する上流ソース](https://github.com/badboy/mdbook-mermaid/blob/v0.17.1/src/bin/assets/mermaid-init.js))。`mdbook-mermaid install .` が生成する `mermaid.min.js` と `mermaid-init.js` はGit管理せず、`scripts/prepare-mermaid-assets.py` とGitHub Actionsで生成します。初期化スクリプトは現在上流と同一であることをSHA-256で確認します。独自変更を検出した場合はスクリプトが停止し、ファイルを上書きしません。

### Pagefind

Pagefind 1.5.2のExtended CLIはビルド時に日本語の単語分割を含む静的インデックスを生成します。Component UI、CSS、JavaScript、検索ワーカー、インデックスをGitHub Pagesから配信します。上流パッケージのMITライセンスと同梱 `vscode-ripgrep` のMIT表示を[保存したライセンス文書](licenses/MIT-Pagefind.txt)に収録しています。実行時に外部検索サーバーやCDNは使いません。

## Commonplaceのコンテンツについて

記事、画像、Commonplace独自のソースコードには、リポジトリ全体へ適用するライセンスを指定していません。Publicリポジトリやこの第三者ライセンス一覧は、Commonplaceのコンテンツを自由に再配布・改変する許可を意味しません。記事内の引用、画像、コードには個別の出典と利用条件が適用されます。
