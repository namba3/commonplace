# 主要21言語・22比較区分の補足一覧

[← 前編に戻る](01-type-systems.md)

このページは[前編](01-type-systems.md)の補足です。現代のプログラミング言語を、**AIの生成結果を何によって検査できるか**という視点から整理しています。C#は歴史的な対照群として旧世代と現在を分けています。

| 言語 | 代表的な確認ポイント |
|---|---|
| C#（.NET Framework時代） | 当時の静的型・CLR・Code Contractsの歴史 |
| C#（C# 14） | nullable解析、Roslyn、最新のパターンマッチ |
| JavaScript | 実行テスト、外部入力、ランタイム検証 |
| TypeScript | `strict`、判別共用体、`any`の使用 |
| Java | sealed、null周辺、OpenJML |
| Go | 単純な型検査、レースディテクター |
| Kotlin | nullable型、sealed、`!!` |
| PHP | 型宣言、PHPStan／Psalm |
| Ruby | RBS／Steep、実行テスト |
| Dart | null safety、`dynamic` |
| Rust | 所有権・借用、Kani／Verus |
| C | 未定義動作、Frama-C／CBMC |
| C++ | 所有権、未定義動作、CBMC等 |
| Zig | ポインタ寿命、ビルドモード別安全検査 |
| Swift | `Sendable`、actor isolation |
| Python | Pyright／mypy、Nagini／CrossHair |
| Julia | 型推論と実行時挙動の違い |
| Scala 3 | union／intersection／match types |
| Haskell | ADT、型クラス、LiquidHaskell |
| OCaml | 型推論、variant、パターンマッチ |
| F# | 判別共用体、ドメインモデリング |
| Lean 4 | 依存型、証明項、カーネル |

この一覧は機能の存在を示したものであり、言語の品質やAIのコーディング成功率の順位ではありません。具体的な保証は、言語の版、ビルド設定、ライブラリ、形式検証器の適用範囲で変わります。

関連：[前編・静的型付けとAIコーディング](01-type-systems.md) ／ [後編・依存型と形式証明](02-dependent-types-and-formal-verification.md)
