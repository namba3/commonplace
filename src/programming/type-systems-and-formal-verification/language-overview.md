# 主要21言語・22区分で見る、コード生成を検査する仕組み

[← 前編に戻る](01-type-systems.md) ／ [後編へ進む](02-dependent-types-and-formal-verification.md)

このページは、[前編](01-type-systems.md)の「AIが生成したコードを、何によって確かめられるか」という問いを、21言語・22区分に広げた補足です。言語機能の一覧を作るだけでなく、**検査が何を確認し、何を確認しないのか**を並べて見ます。

対象は、JavaScript、TypeScript、C#、Java、Go、Kotlin、PHP、Ruby、Dart、Rust、C、C++、Zig、Swift、Python、Julia、Scala 3、Haskell、OCaml、F#、Lean 4です。C#は歴史的な.NET Framework世代とC# 14を分けているため、比較区分は22です。

**これは言語の優劣表でも、AIのコーディング能力を測った実験でもありません。** 機能の有無とツールの利用例を整理したもので、実際の保証は言語・処理系の版、設定、依存ライブラリ、解析対象、外部入力の扱いで変わります。2026年10月12日時点で参照できる公式仕様・ツール資料を中心にまとめています。

## 先に要点：検査は一つの尺度ではない

「型が強い」「コンパイルが通った」という一言では、何が確認できたか分かりません。コードを検査する仕組みには、少なくとも次の段階があります。

| 段階 | 主に確かめること | それだけでは分からないこと |
|---|---|---|
| 構文・型検査 | 文法、値の型、関数の呼び方、表現した状態との整合 | 要求どおりの計算か、実行時入力が本当にその型か |
| 静的解析 | 到達不能コード、null可能性、危険なAPI利用、特定のバグパターン | 解析対象外の箇所、未モデル化の実行環境、業務上の正しさ |
| テスト・動的検査 | 実際に与えた入力や実行経路での結果、競合や境界エラー | 実行していない入力・経路で同じ結果になること |
| 契約検証・モデル検査 | 明示した条件と解析範囲のもとで、性質を満たすか | 仕様の妥当性、範囲外の状態、未モデル化の環境 |
| 定理証明 | 形式化した命題が、採用した論理・公理から導けるか | 形式化した命題が本来の要求と一致するか |

この表は検査手法の強さを並べた序列ではありません。テストは実行時の振る舞いを確かめ、定理証明は形式化した命題を確かめるため、答える問いが異なります。仕様化、設定、実行時間、証明の保守などのコストも含め、必要な保証に合う手法を組み合わせます。

```mermaid
flowchart LR
    A[要求と入力境界を定める] --> B[AIがコードを生成]
    B --> C[型検査・コンパイル]
    C --> D[静的解析]
    D --> E[テスト・動的検査]
    E --> F[必要な箇所に契約検証・証明]
    F --> G[人が仕様と差分をレビュー]
```

この流れは直線的な合格判定ではありません。失敗した検査は修正材料になり、仕様やテストの見落としが見つかれば前の段階へ戻ります。**型検査、テスト、証明は別の証拠**として扱い、成功結果を一つの「正しい」にまとめないことが大切です。

## 同じコードでも、検査が答える質問は違う

注文処理の状態を考えます。注文は`Pending`、`Paid`、`Cancelled`のいずれかです。有限個の状態を代数的データ型や判別共用体で表し、状態ごとの分岐を網羅的に書けば、状態を追加したときに未対応の分岐をコンパイラが知らせる言語があります。

しかし、その検査だけでは「金額が0より大きい」「支払い済み日時が注文日時より後」「同じ注文に二度請求しない」といった値や履歴に関する条件は証明されません。そこには入力検証、テスト、契約、モデル検査など別の仕組みが必要です。

さらに、JSONやデータベースから読み込んだ値は、ソースコードに書いた型注釈だけでは正しい形になりません。外部との境界で実データを検証し、検証済みの値だけを内部処理へ渡す設計が必要です。TypeScriptの型は実行時に消去され、Pythonの型注釈も通常の実行系が自動で強制するものではありません。[TypeScriptの説明](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)と[Pythonのtyping資料](https://docs.python.org/3/library/typing.html)は、この区別を明記しています。

## 言語ごとの比較

表の「検査の主役」は、AI生成コードの差分で特に活用しやすい仕組みです。「見落としやすい境界」は、その仕組みが万能ではない理由を示します。ツール名は利用例であり、導入済み・有効化済みであることを意味しません。

| 言語・区分 | 検査の主役 | 見落としやすい境界・確認ポイント |
|---|---|---|
| C#（.NET Framework世代） | CLR上の静的型、コンパイラ診断。[Code Contracts](https://learn.microsoft.com/en-us/dotnet/framework/debug-trace-profile/code-contracts)などを追加して契約を書く構成もあった | 現行C#のnullable参照型や新しいパターン機能を前提にしない歴史的比較枠。注釈を追加しただけで静的検証が実行されるわけではない |
| C# 14 | nullable参照型の静的解析、Roslyn診断、パターンマッチ。C# 14は.NET 10でサポートされる | nullable解析は設定可能。新規テンプレートでは有効な場合がある一方、既存プロジェクトでは無効のことがある。`!`、抑制、外部コード、誤ったnull注釈を確認する ([C# 14](https://learn.microsoft.com/ja-jp/dotnet/csharp/whats-new/csharp-14)、[nullable参照型](https://learn.microsoft.com/ja-jp/dotnet/csharp/language-reference/builtin-types/nullable-reference-types)) |
| JavaScript | 実行テスト、実行時チェック、スキーマ検証、lint | JavaScript自体には組み込みの静的型検査がない。テストされていない実行経路と外部入力は残る。必要ならTypeScriptや静的解析を組み合わせる ([ECMAScript specification](https://tc39.es/ecma262/)) |
| TypeScript | `strict`系設定、判別共用体、制御フロー解析、`never`による網羅性確認 | 型注釈は実行時に消去される。`any`、型アサーション、外部の型定義、JavaScript相互運用が検査の穴になり得る。ネットワーク入力は実行時にも検証する ([TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)) |
| Java | 静的型、sealed階層、パターンswitch、静的解析。仕様を加える場合はOpenJML/JML | `sealed`は許可する直接の子型を列挙するが、`non-sealed`の子型はさらに拡張できる。網羅性検査の範囲や値域・業務条件の正しさは別途確認する。nullや外部入力も別扱い。OpenJMLが対応するJava版は利用するリリースごとに確認する ([Java 26 sealed classes](https://docs.oracle.com/en/java/javase/26/language/sealed-classes-interfaces.html)、[OpenJML](https://www.openjml.org/)) |
| Go | コンパイラの型検査、`go vet`、`go test -race` | race detectorは動的検査で、実際に実行した経路の競合を探す。未実行の分岐や、競合以外の並行処理上の誤りまでは保証しない ([Go vet](https://go.dev/cmd/vet/)、[Go race detector](https://go.dev/doc/articles/race_detector)) |
| Kotlin | nullable型、flow analysis、sealed classと`when` | `!!`、Java相互運用のplatform type、unchecked castが境界になる。非null型を使ってもJava側や外部入力の値が正しいとは限らない ([Kotlin null safety](https://kotlinlang.org/docs/null-safety.html)、[Java相互運用](https://kotlinlang.org/docs/java-interop.html)) |
| PHP | 型宣言に加えPHPStan／Psalmなどの静的解析 | 解析レベル、設定、PHPDoc、フレームワーク拡張、`mixed`の範囲で検出力が変わる。PHPStanは段階的に厳格度を上げられるが、低いレベルでは対象外の誤りが残る ([PHPStan rule levels](https://phpstan.org/user-guide/rule-levels)、[Psalm](https://psalm.dev/docs/)) |
| Ruby | RBSで署名を記述し、Steepなどで型検査。実行テストを併用 | 署名と実装がずれていないか、`untyped`や署名のない依存がどこまであるかを確認する。署名ファイルだけでは実行時の値を強制しない ([RBS](https://github.com/ruby/rbs)、[Steep](https://github.com/soutaro/steep)) |
| Dart | sound null safety、flow analysis、アナライザー | `dynamic`、`!`、legacyライブラリとの境界は別扱い。sound null safetyの保証は、対象コードがnull-safeな範囲に依存する ([Dart sound null safety](https://dart.dev/null-safety)) |
| Rust | 所有権・借用・`Send`／`Sync`、enumと`match`。追加でKaniやVerus | Safe Rustの型検査は業務ロジックの正しさを証明しない。`unsafe`は監査対象。Kaniはモデル検査で、未対応機能や計算資源によって結論が出ない場合がある。VerusはRustの一部を契約・仕様とともに検証する ([Rust Book](https://doc.rust-lang.org/book/)、[Kani](https://model-checking.github.io/kani/)、[Verus](https://verus-lang.github.io/verus/guide/overview.html)) |
| C | コンパイラ、静的解析、動的検査、Frama-CやCBMC | ポインタ、配列境界、未定義動作、所有権の問題を型検査だけで防げない。Frama-C Evaの結果は解析モデルと対象範囲に依存し、CBMCは指定した境界の検査として読む ([Frama-C Eva](https://www.frama-c.com/fc-plugins/eva.html)、[CBMC](https://www.cprover.org/cbmc/)) |
| C++ | 静的型、RAII、標準ライブラリのコンテナやスマートポインタ、解析器やCBMC | 生ポインタ、寿命、未定義動作、データ競合は型検査の成功と別。RAIIやスマートポインタの利用も、すべての寿命・論理誤りを解消しない ([C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)、[CBMC](https://www.cprover.org/cbmc/)) |
| Zig | 明示的なoptional／error union、コンパイル時評価、ビルドモード別の安全検査 | 安全検査の有効範囲はbuild modeや局所設定で変わる。たとえば`ReleaseFast`では多くの安全検査が無効になるため、CIがどのモードでビルドするかを確認する ([Zig Language Reference](https://ziglang.org/documentation/master/)) |
| Swift | enumとパターンマッチ、actor isolation、`Sendable`を使った並行性検査 | `@unchecked Sendable`はコンパイラの確認を外す宣言。Objective-C相互運用、unsafe API、Swift言語モードと並行性チェック設定を確認する ([Swift Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)、[Sendable](https://docs.swift.org/latest/documentation/swift/sendable/)) |
| Python | Pyright／mypyによる任意の静的型検査。契約の反例探索などにはNaginiやCrossHair | 注釈のない領域や`Any`は型チェッカーの確認が弱くなり、実行系も注釈を自動強制しない。CrossHairは型チェッカーではなく、対応する契約に対する反例を探索する ([Python typing](https://docs.python.org/3/library/typing.html)、[mypy](https://github.com/python/mypy)、[Nagini](https://github.com/marcoeilers/nagini)、[CrossHair](https://crosshair.readthedocs.io/en/latest/introduction.html)) |
| Julia | 実行時のmultiple dispatchと型推論、テスト、明示的な入力条件 | Juliaの型システムは動的。型注釈は多重ディスパッチ、可読性、実行時アサーション、性能改善の手掛かりとして使えるが、一般的な静的型検査ではない。型推論は主に特殊化・性能に関わり、その成功だけで静的な正しさが証明されたとは言えない ([Julia Types](https://docs.julialang.org/en/v1/manual/types/)、[Julia inference](https://docs.julialang.org/en/v1/devdocs/inference/)) |
| Scala 3 | ADT、enum、union／intersection type、match typeとパターンマッチ | 型で表せる範囲と、外部入力・副作用・実行時の状態は別。網羅性の警告をCIで失敗扱いにするかなど、コンパイラ設定も確認する ([Scala 3 union types](https://docs.scala-lang.org/scala3/book/types-union.html)) |
| Haskell | ADT、型推論、型クラス、GHCのパターン網羅性警告。追加でLiquidHaskell | 網羅性警告はコンパイラオプションに依存する。`undefined`、部分関数、外部効果、遅延評価に起因する問題は通常の型検査だけでは解決しない ([GHC warnings](https://downloads.haskell.org/ghc/latest/docs/users_guide/using-warnings.html)、[LiquidHaskell](https://ucsd-progsys.github.io/liquidhaskell/)) |
| OCaml | 型推論、variant、パターン網羅性・冗長性の警告 | 文字列や整数の任意値をvariantの有限集合と同じようには扱えない。警告を無視・抑制していないか、CIでどの警告を有効にしているかを確認する ([OCaml pattern matching](https://ocaml.org/docs/common-errors)) |
| F# | 判別共用体、`option`、パターンマッチ、型推論 | DUが強いモデルを作っても、値の業務制約、外部境界、nullを含む相互運用は別途設計する ([F# discriminated unions](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/discriminated-unions)) |
| Lean 4 | 依存型、命題と証明項、カーネルによる項の型検査 | カーネルが受理するのは形式化された命題とその前提に対する証明。公理、`sorry`、外部コード、仕様と現実の要求とのずれを監査する ([Theorem Proving in Lean 4](https://docs.lean-lang.org/theorem_proving_in_lean4/)) |

## 似て見える保証の違い

### 1. 型の網羅性は、値の妥当性とは違う

判別共用体、enum、sealed階層は、「状態の候補を有限個に閉じ、候補ごとの処理を促す」用途で役立ちます。網羅性検査を有効にしている範囲で状態を追加すれば、型チェッカーやコンパイラの診断が未対応の分岐を示すことがあります。警告をCIで必須にしているかも確認します。

一方、`amount: number`や`amount: int`だけでは、その値が正の金額なのか、通貨の最小単位に合うのかは分かりません。普通の型が表すのは値の集合と操作の整合であり、業務上の意味まで自動で決まるわけではありません。範囲や関係を型に表す仕組み、実行時バリデーター、契約、テストを必要に応じて加えます。

### 2. メモリ安全性と機能の正しさは別

所有権・借用は、メモリ寿命や別名参照に関する危険を扱います。actor isolationや`Sendable`は、共有状態を並行処理で扱う際の規則を明示します。これらは大きな価値を持ちますが、割引率を誤る、注文を二重に確定する、誤った仕様どおりに処理する、といった機能誤りを自動的に防ぐものではありません。

同様に、テストで競合が起きなかったことは競合がない証明ではありません。Goのrace detectorのような動的解析は、実際に実行されたコード経路の競合を報告します。静的な並行性規則、stress test、動的検出、仕様検証は相補的な証拠です。

### 3. 静的解析の「成功」は解析範囲と設定を含む

解析器の結果は、設定、注釈、モデル、サポート対象機能、境界条件に左右されます。次のような場合は「解析が通った」だけで結論を出さず、範囲を確認します。

- 型検査の対象から除外されたファイルや依存パッケージがある。
- 警告が無効、抑制、またはCIで失敗扱いになっていない。
- `any`、`dynamic`、`mixed`、型アサーション、null抑制、`unsafe`などの逃げ道が増えている。
- 解析器の`assume`、前提条件、スタブ、モデルが実際の挙動を正しく表しているか分からない。
- ループやスレッド、外部API、浮動小数点など一部の機能が未対応または簡略化されている。
- `timeout`、`unknown`、`unsupported`を成功と同じ扱いにしている。

モデル検査や定理証明の出力も、`pass`だけを保存するのではなく、反例、未到達、タイムアウト、未対応、未証明を区別して記録します。例えばKaniは、性質を証明するか反例を示すほか、未対応機能や計算資源の制約で結論できない場合があります。[結果の種類](https://model-checking.github.io/kani/verification-results.html)を一律の合格フラグにまとめないことが重要です。

## 目的から検査方法を選ぶ

| 確かめたいこと | まず使う仕組み | 次に確認すること |
|---|---|---|
| APIの引数・戻り値や状態の取り違え | 型検査、厳格な設定、判別共用体 | `any`相当、抑制、未検査ファイルがないか |
| JSON・HTTP・DBなど外部データの形 | 実行時バリデーターと異常系テスト | 検証後の型と実データが同じ契約を示すか |
| nullや未初期化の扱い | null安全な型、flow analysis、警告 | JavaScript・Java・FFIなど境界コード、抑制演算子 |
| 所有権・寿命・データ競合 | 言語のメモリ／並行性規則、sanitizer、stress test | `unsafe`や手動同期、未実行の実行経路 |
| 値域・不変条件・事前事後条件 | property-based test、契約検査、SMT、モデル検査 | 入力空間、ループ境界、仮定、解析器の対応範囲 |
| 数学的性質や厳密な状態遷移 | 定理証明器または対象に合う形式手法 | 命題の妥当性、公理、信頼基盤、証明の再現性 |

## AI生成コードで特に監査する箇所

コンパイラや解析器のエラーをAIへ返す修正ループは便利です。ただし、エラーを消すことだけを報酬にすると、AIは検査の意味を満たす代わりに検査自体を弱めるかもしれません。差分レビューでは、次を意識します。

1. 型エラーを直すために`any`、`dynamic`、`mixed`、型アサーション、`!!`が追加されていないか。
2. Rustの`unsafe`、Swiftの`@unchecked Sendable`、警告抑制、解析除外の範囲が広がっていないか。
3. テストを通すためにテスト条件や`assume`を過度に狭めていないか。
4. 形式検証が対象にした命題・事前条件が、要求を弱めたり空虚に満たしたりしていないか。
5. ツールが`pass`と報告した対象・版・設定・コマンドを再現できるか。
6. 外部入力、エラー系、並行実行、境界値を、型検査だけで済ませていないか。

安全性を弱める構文が常に誤りとは限りません。必要な理由、影響範囲、人間が確認した根拠が明示されているかを見ます。**型エラーがゼロになったことではなく、要求を保ったまま、独立した検査を増やせたか**が判断基準です。

## まとめ

言語を選ぶときは、「静的か動的か」「型が強いか」だけでなく、次の問いで比べると実用的です。

- 生成コードをどのコマンドで検査し、その結果をCIで必須にできるか。
- エラー診断が具体的で、修正後に同じ検査を再実行できるか。
- 外部入力やライブラリ境界の値を、どこで実データとして検査するか。
- 失敗・タイムアウト・未対応・検証対象外を区別できるか。
- AIが安全性を弱める変更をしたとき、人間が気づけるか。

言語機能は検査可能性を支える道具です。最後に信頼を与えるのは、対象を明示した型検査、解析、テスト、仕様確認と、生成物が検査をすり抜けていないかを見る人間のレビューです。

関連：[前編・静的型付けとAIコーディング](01-type-systems.md) ／ [後編・依存型と形式証明](02-dependent-types-and-formal-verification.md)

※ 本稿は言語・ツールの性能やAIの成功率を比較する実験ではありません。代表的な公式資料をもとに特徴と適用範囲を整理したものであり、全言語のコード例やツールを実環境で実行・検証したものではありません。ツールの対応状況や仕様は更新されるため、導入時にはリンク先の最新版を確認してください。
