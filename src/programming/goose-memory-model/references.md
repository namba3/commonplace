# 参考資料

作成日：2026-11-02 / 更新日：2026-11-03

[← シリーズ目次](./)

以下は主に一次資料であり、本文中の番号に対応する。Gooseに関する一次資料は開発元自身の説明であり、独立した検証の代わりにはならない。リンク先の内容は開発に伴って更新される可能性がある。確認基準日：2026年10月31日。過去の研究経緯は、開発元の先行技術調査と外部文献を区別して読む必要がある。

1. <a id="ref-1"></a>**Goose**, [The Goose Language — Specification (v4 draft)](https://aardappel.github.io/goose/docs/goose_spec.html) — Data Stack、型・参照・寿命、安全性、並行処理、未実装事項。
2. <a id="ref-2"></a>**Goose**, [The Goose Compiler: Implementation Notes](https://aardappel.github.io/goose/docs/implementation.html) — コンパイラ、Cコード生成、ランタイム、仮想アドレス予約、制約。
3. <a id="ref-3"></a>**Goose**, [Benchmark Results](https://aardappel.github.io/goose/bench/results.html) — Goose、Rust、C++の公式比較。実装とデータ構造の条件に注意。
4. <a id="ref-4"></a>**Goose**, [Running Goose on WebAssembly](https://aardappel.github.io/goose/docs/design/wasm.html) — *Proposal, not implemented* と明記されたWasm移植案。
5. <a id="ref-5"></a>**Goose**, [GitHub Repository / README](https://github.com/aardappel/goose) — 実装状況とエコシステム。
6. <a id="ref-6"></a>**Go Team**, [A Guide to the Go Garbage Collector](https://go.dev/doc/gc-guide) — GCのコストとEscape Analysis。
7. <a id="ref-7"></a>**Go Team**, [Diagnostics](https://go.dev/doc/diagnostics) — Profiling、Tracing、性能解析。
8. <a id="ref-8"></a>**Rust Embedded Working Group**, [The Embedded Rust Book — `no_std`](https://docs.rust-embedded.org/book/intro/no-std.html) — OSを必要としないRust。
9. <a id="ref-9"></a>**Linux Kernel Documentation**, [Rust — Quick Start](https://docs.kernel.org/rust/quick-start.html) — Linux KernelでのRust開発。
10. <a id="ref-10"></a>**Zig Project**, [Language Reference](https://ziglang.org/documentation/master/) — Allocator、Freestanding、C連携、メモリ管理。`master`のため記述内容は変化する。
11. <a id="ref-11"></a>**Goose**, [Benchmark Design](https://aardappel.github.io/goose/bench/design.html) — 比較する実装の選び方、得意・不得意、測定上の注意。
12. <a id="ref-12"></a>**Goose**, [Goose by Example](https://aardappel.github.io/goose/docs/tutorial.html) — 配列・データ配置・最適化例。
13. <a id="ref-13"></a>**Goose**, [Root Structs: State with Independent Storage](https://aardappel.github.io/goose/docs/design/root_structs.html) — 実装済みのRoot所有、Pool、未対応境界。
14. <a id="ref-14"></a>**Goose**, [Goose v2026.3 Release](https://github.com/aardappel/goose/releases/tag/v2026.3) — Worker・キュー等の機能更新。
15. <a id="ref-15"></a>**Rust UEFI Project**, [uefi crate](https://docs.rs/uefi/latest/uefi/) — UEFIアプリケーション・ドライバ開発。
16. <a id="ref-16"></a>**TinyGo**, [TinyGo Documentation](https://tinygo.org/docs/) — MCUおよびWasmを含むGoの小型処理系。
17. <a id="ref-17"></a>**Goose**, [Language Reference](https://aardappel.github.io/goose/docs/reference.html) — 例とAPIをまとめた言語リファレンス。
18. <a id="ref-18"></a>**TinyGo**, [UEFI applications](https://tinygo.org/docs/guides/uefi/) — `uefi-amd64`、TinyGo 0.42以降、GC・API・アーキテクチャ上の制限。
19. <a id="ref-19"></a>**Goose**, [The goose command line](https://aardappel.github.io/goose/docs/command_line.html) — `check`、`--stacks`、`--bce-lines`、`run`、`build`の使い方・実行条件。
20. <a id="ref-20"></a>**bumpalo**, [Crate documentation](https://docs.rs/bumpalo/latest/bumpalo/) — RustのBump Allocator、一括解放、`Drop`上の注意点、Allocator API。
21. <a id="ref-21"></a>**boxcar**, [Crate documentation](https://docs.rs/boxcar/latest/boxcar/) — 要素アドレスを維持する並行Append-only配列の例。
22. <a id="ref-22"></a>**Rust Compiler**, [rustc_arena](https://doc.rust-lang.org/nightly/nightly-rustc/rustc_arena/index.html) — Rustコンパイラ内部で利用されるArenaの実装。一般向け標準APIではない。
23. <a id="ref-23"></a>**Rust Project**, [std::alloc::Allocator](https://doc.rust-lang.org/std/alloc/trait.Allocator.html) — Rust 1.99.1時点のAPI文書。nightly-only (`allocator_api`, tracking issue #32838) と明記。
24. <a id="ref-24"></a>**Goose**, [The Goose standard library](https://aardappel.github.io/goose/docs/stdlib.html) — 専用APIリファレンスに掲載された18モジュールと、外部Cとの境界。
25. <a id="ref-25"></a>**Goose**, [The Goose Standard Library — Design](https://aardappel.github.io/goose/docs/design/stdlib_design.html) — 当初の設計理念・API規約。**歴史的設計文書**であり、現行APIは資料24を優先する。
26. <a id="ref-26"></a>**Goose**, [Documentation Index](https://aardappel.github.io/goose/docs/index.html) — 実装済み資料と、Wasm・Coroutine等の設計提案の一覧。
27. <a id="ref-27"></a>**cppreference**, [std::pmr::monotonic_buffer_resource](https://en.cppreference.com/cpp/memory/monotonic_buffer_resource) — C++17以降の一括解放型メモリリソース。
28. <a id="ref-28"></a>**Goose**, [Prior art: the nearest memory models, and what is new](https://aardappel.github.io/goose/docs/design/prior_art.html) — 2026年10月の開発元による先行研究整理。ML Kit、GNU obstacks、ParaSail、CのArena等との比較。**開発元の調査であり独立レビューではない**。
