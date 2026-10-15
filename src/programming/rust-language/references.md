# 参考資料と関連記事

作成日：2026-10-15 / 更新日：2026-10-15

## 参考資料・出典

### 言語設計と仕様

- [The Rust Reference — Statements](https://doc.rust-lang.org/reference/statements.html#let-statements) — `let`によるパターン束縛と初期化。
- [The Rust Reference — Patterns](https://doc.rust-lang.org/reference/patterns.html) — パターンの束縛モードとMove・Copy・Borrow。
- [The Rust Reference — Place and Value Expressions](https://doc.rust-lang.org/reference/expressions.html#place-expressions-and-value-expressions) — 格納場所と値の区別。
- [The Rust Book — Variables and Mutability](https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html) — ShadowingとMutationの違い。
- [Rust std — `let` keyword](https://doc.rust-lang.org/std/keyword.let.html) — 名前と値の束縛。
- [The Rust Reference — Influences](https://doc.rust-lang.org/reference/influences.html) — SML/OCaml、C++、Haskellなどから受けた設計上の影響。
- [Rust Compiler Development Guide — Bootstrapping](https://rustc-dev-guide.rust-lang.org/building/bootstrapping/intro.html) — 初期コンパイラがOCamlで書かれていた事実。
- [Rust Blog — Mixing matching, mutation, and moves in Rust](https://blog.rust-lang.org/2015/04/17/Enums-match-mutation-and-moves/) — パターンマッチ・所有権・命令型スタイルの関係。
- [The Rust Programming Language — Understanding Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html) — 所有権の基本。
- [The Rust Programming Language — References and Borrowing](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html) — 共有参照・可変参照。
- [The Rust Programming Language — Validating References with Lifetimes](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html) — ライフタイムの関係と省略規則。
- [The Rust Reference — Expressions](https://doc.rust-lang.org/reference/expressions.html) — 式の評価と副作用、ブロック式・Place/Valueの仕様。
- [The Rust Book — Interior Mutability](https://doc.rust-lang.org/book/ch15-05-interior-mutability.html) — 不変の束縛と内部可変性の違い。
- [The Rust Book — Closure Traits](https://doc.rust-lang.org/book/ch13-01-closures.html#moving-captured-values-out-of-closures-and-the-fn-traits) — `Fn`、`FnMut`、`FnOnce`の関係。
- [The Rust Programming Language — Functions](https://doc.rust-lang.org/book/ch03-03-how-functions-work.html) — 文・式、関数と型注釈。
- [The Rust Reference — Inferred Type](https://doc.rust-lang.org/reference/types/inferred.html) — 型推論。
- [The Rust Programming Language — Defining Shared Behavior with Traits](https://doc.rust-lang.org/book/ch10-02-traits.html) — TraitとGenerics。
- [The Rust Programming Language — Advanced Traits](https://doc.rust-lang.org/book/ch20-02-advanced-traits.html) — Associated Type、Fully Qualified Syntax、Newtype。
- [The Rust Reference — Associated Items](https://doc.rust-lang.org/reference/items/associated-items.html) — 関連型・関連定数・GATの定義。
- [The Rust Reference — Traits](https://doc.rust-lang.org/reference/items/traits.html) — Trait Bounds、Dyn Compatibility。
- [The Rust Reference — Implementations](https://doc.rust-lang.org/reference/items/implementations.html) — CoherenceとOrphan Rule。
- [Rust Blog — Generic associated types to be stable in Rust 1.65](https://blog.rust-lang.org/2022/10/28/gats-stabilization/) — GATの安定化と制限。
- [The Rust Programming Language — Closures](https://doc.rust-lang.org/book/ch13-01-closures.html) — クロージャとキャプチャ。
- [The Rust Programming Language — Iterators](https://doc.rust-lang.org/book/ch13-02-iterators.html) — Iteratorの合成。
- [The Rust Programming Language — The match Control Flow Construct](https://doc.rust-lang.org/book/ch06-02-match.html) — パターンマッチ。
- [The Rust Programming Language — Unsafe Rust](https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html) — `unsafe`の対象と責務。
- [The Rustonomicon](https://doc.rust-lang.org/nomicon/) — Unsafe Rustの詳細。
- [The Rust Edition Guide](https://doc.rust-lang.org/edition-guide/) — Editionの仕組み。

### コンパイラとLLVM

- [Rust Compiler Development Guide — Overview](https://rustc-dev-guide.rust-lang.org/overview.html) — HIR/MIR、借用検査、単相化、LLVMへのコード生成。
- [Rust Compiler Development Guide — Code generation](https://rustc-dev-guide.rust-lang.org/backend/codegen.html) — LLVM・Cranelift・GCCとコード生成バックエンドの位置づけ。
- [Rust Compiler Development Guide — Lowering MIR](https://rustc-dev-guide.rust-lang.org/backend/lowering-mir.html) — MIRからLLVM IRへの変換。
- [The rustc book — Codegen Options](https://doc.rust-lang.org/rustc/codegen-options/index.html) — 最適化レベル、LTO、ターゲットCPUと生成コードの制御。
- [LLVM — Getting Started](https://llvm.org/docs/GettingStarted.html) — LLVMの最適化・コード生成コンポーネント。
- [LLVM — Target-Independent Code Generator](https://llvm.org/docs/CodeGenerator.html) — 命令選択、レジスタ割当、ターゲット向けコード生成。

### 開発ツールと用途

- [The Cargo Book](https://doc.rust-lang.org/cargo/) — パッケージ管理とビルド。
- [The Rust Programming Language — Writing Automated Tests](https://doc.rust-lang.org/book/ch11-00-testing.html) — テスト。
- [The Embedded Rust Book](https://doc.rust-lang.org/embedded-book/) — 組込み向けRust。
- [Rust and WebAssembly](https://rustwasm.github.io/docs/book/) — ブラウザーとWasm。
- [Linux Kernel Documentation — Rust Quick Start](https://docs.kernel.org/rust/quick-start.html) — カーネルへの導入。
- [Leptos](https://leptos.dev/) / [Yew](https://yew.rs/) / [Dioxus](https://dioxuslabs.com/) — RustでのWeb UI等。
- [Tokio Documentation](https://docs.rs/tokio/latest/tokio/) — 非同期ランタイム。

## 関連記事

- [AIコーディング時代の型システムと形式検証](../type-systems-and-formal-verification/)
- [AI時代に再発見する情報科学の数学的本質](../../computer-science-theory/mathematics-of-computing/)
- [AIコーディング時代のシフトレフト](../../software-engineering/ai-coding-shift-left/)
