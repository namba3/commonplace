# AIが書いたテストは信用できる？独立検証とテストオラクルの設計

作成日：2026-10-12 / 更新日：2026-10-12

AIが実装とテストを同時に作り、どちらも通った。これで「仕様どおり」と判断してよいでしょうか。

答えは**テストの合否だけでは判断できない**です。実装とテストが同じ仕様の誤解を共有するなら、見事に合格するテストが、誤った振る舞いを固定化することさえあります。

この回では、仕様を基準にするテストオラクル、反例、独立性、要求とCI証跡の追跡を扱います。

## AI生成物を独立して検証する

### コードとテストの共通誤り

同じ曖昧な仕様からAIに実装とテストを作らせると、**両方が同じ誤解を共有し、テストが通る**ことがあります。AI固有の現象ではありませんが、大量生成時には見落としやすくなります。

例：仕様が「範囲の終了位置は含まない」であるのに、実装もテストも終了位置を含めている場合、テスト成功は仕様適合性を示さない。

### 独立性を高める方法

- **仕様起点**：期待値を実装から逆算せず、先に定めた受入条件・ドメイン規則から作る。
- **独立した反例**：正常系だけでなく、無効値、境界値、競合、権限不足を確認する。
- **異なる検査手段**：型検査、静的解析、プロパティテスト、統合試験、レビューを組み合わせる。
- **メタモルフィックテスト**：正解値を直接算出しづらい問題では、入力変換に対して保たれる関係を検証する。
- **ミューテーションテスト**：意図的に変異を入れ、テストが欠陥を検出できるかを調べる。
- **重要箇所の人間レビュー**：仕様との照合、脅威分析、境界条件、残留リスクを確認する。

別のAIモデルや別エージェントにレビューさせることも補助にはなるが、**独立性や正しさの保証にはならない**。仕様の出典と検査方法を分離する方が本質的である。

### 期待値の出典を固定する

生成コードと生成テストを別々のAIに作らせるだけでは、同一の誤解を防ぎきれない。まず**期待動作の根拠（オラクル）**を明示する。

| オラクルの根拠 | 例 | 確認すること |
|---|---|---|
| 事前に承認された仕様 | `end`は排他的、認可なしなら403 | 実装ではなく仕様から期待値を決めているか |
| 既存の互換性契約 | 公開API、ファイル形式、既知の成功ケース | 互換仕様の変更が意図的か |
| 独立に検査できる不変条件 | 保存→読込で意味が保存される | その不変条件自体が要求として妥当か |
| 外部仕様・参照実装 | 標準プロトコル、互換性スイート | 参照側のバージョン・適用条件が合うか |

受入基準や既存テストをAIが変更するときは、**仕様変更として差分をレビュー**する。期待値の書き換え、`skip`・`ignore`の追加、タイムアウト緩和、検査の無効化で「緑色のCI」を作ってはならない。既存テストも誤っていることはあるため、変更禁止ではなく、**理由と承認を要求する**。

### テストが合格してもValidationは別に確認する

独立したテストオラクルがあっても、**オラクルの前提である仕様が不適切**なことはある。重要変更では、受入条件の仕様適合性に加え、利用者に価値があるかを代表シナリオ、試作、利害関係者との確認、実利用観測で判断する。

例えば「一度に10万件の行を完全に描画する」という受入条件を満たせても、本来の課題が「目的のファイルへ素早く到達する」であれば、検索性・段階表示・操作応答性を含む成功条件を見直す。

## 要求→設計→テスト→証跡を一本につなぐ

### 仕様とテストを結びつける

まず「古いディレクトリの列挙結果を表示しない」という受入条件を合意します。実装担当AIに結果を見せてもらう前に、**A→Bの順で開き、B→Aの順で完了する**反例をテストの基準として定めます。仕様が正しいかどうかは利用者と別途確認します。

### 仕様から観測までの追跡線

以下のリンクがつながることを理想とする。

```text
利用者の要求 / Issue
    → 受入条件（何が正しいか）
    → 設計判断 / ADR（どう成立させるか）
    → テスト・解析・ベンチ（どう検証するか）
    → 変更差分 / PR（どこを変更したか）
    → 観測結果・後続課題（現実はどうだったか）
```

「テストがある」という状態だけでは不十分です。**重要な要求に対応する検査があり、その検査が本当に要求の合否を判断できるか**を確認する。

### 要求から検証へ：競合状態の具体例

例：Rust製ファイルマネージャーで、ディレクトリ切替中に古い検索結果が新しい一覧を上書きする問題を扱う。これは**説明用の架空の課題**であり、特定リポジトリに対する実測・実施結果ではない。

| 識別子 | 内容 | 接続先 |
|---|---|---|
| REQ-01 | ディレクトリ切替後は、選択中ディレクトリの結果だけを画面へ反映する | AC-01, AC-02 |
| AC-01 | Aの列挙中にBへ切り替え、Aが遅れて完了してもBの表示を維持する | TEST-01 |
| AC-02 | キャンセルが失敗しても、古いタスクの結果が表示へ混入しない | TEST-02 |
| DEC-01 | 非同期タスクの応答に世代IDを付与し、UI側が現行世代以外を棄却 | ADR（重要な構造変更なら作成） |
| TEST-01 | 完了順序を制御した決定的な競合テスト | AC-01 |
| TEST-02 | キャンセル拒否／遅延を注入する境界テスト | AC-02 |
| EVD-01 | コミット識別子・実行コマンド・テストログ・結果 | REQ-01, TEST-01, TEST-02 |

```text
要求 (REQ) ─→ 受入条件 (AC) ─→ 設計判断 (DEC)
                 │                  │
                 └────→ テスト (TEST) ─→ 実行証跡 (EVD)
                                           └→ PR・課題表の完了判断
```

**重要な点**は、テスト名やコードの存在ではなく、受入条件ごとに期待動作と検証方法が追跡できることにある。性能目標が重要な場合は、[連載第3章：Performance by Design](./03-ai-coding-shift-left-performance.md)で扱った負荷条件・性能予算・計測証跡をこの鎖へ追加する。追跡IDは例であり、既存のIssue ID・テスト名をそのまま使ってもよい。

### AC-01とAC-02を再現するCargoテスト

ここでは**表示状態だけ**に注目した小さなCargoクレートを使います。キャンセルが成功する保証はないため、完了通知の受け取り側で現行の世代IDを確認する設計です。

まず、アプリケーション側の核となる `src/lib.rs` を示します。`switch_to()`は旧タスクへのキャンセル要求が失敗しても次の世代を開始します。

```rust
/// 非同期に取得した一覧のうち、現行の世代だけを表示する最小モデル。
#[derive(Default)]
pub struct DirectoryView {
    generation: u64,
    current: Option<u64>,
    shown: Vec<String>,
}

/// 中断はbest-effort。失敗してもUIの世代チェックに依存して整合性を保つ。
pub trait Canceller {
    fn try_cancel(&mut self, generation: u64) -> Result<(), &'static str>;
}

impl DirectoryView {
    pub fn switch_to(&mut self, canceller: &mut impl Canceller) -> u64 {
        if let Some(old) = self.current {
            let _ = canceller.try_cancel(old);
        }
        self.generation = self.generation.checked_add(1).expect("generation overflow");
        self.current = Some(self.generation);
        self.shown.clear();
        self.generation
    }

    pub fn complete(&mut self, generation: u64, entries: Vec<String>) -> bool {
        if self.current != Some(generation) {
            return false;
        }
        self.shown = entries;
        true
    }

    pub fn shown(&self) -> &[String] {
        &self.shown
    }
}
```

次の `tests/view_guard.rs` は**別のファイル**に置く統合テストです。AC-01では「B→Aの順で完了」を制御し、AC-02ではキャンセル要求が実際に`Err`を返したことを確認してから、Aの古い完了結果を流します。

```rust
use shift_left_view_guard::{Canceller, DirectoryView};

#[derive(Default)]
struct AcceptCancel;

impl Canceller for AcceptCancel {
    fn try_cancel(&mut self, _: u64) -> Result<(), &'static str> {
        Ok(())
    }
}

#[derive(Default)]
struct RejectCancel {
    attempts: Vec<u64>,
}

impl Canceller for RejectCancel {
    fn try_cancel(&mut self, generation: u64) -> Result<(), &'static str> {
        self.attempts.push(generation);
        Err("cancel rejected")
    }
}

#[test]
fn ac01_late_a_cannot_overwrite_b() {
    let mut view = DirectoryView::default();
    let mut cancel = AcceptCancel;
    let a = view.switch_to(&mut cancel);
    let b = view.switch_to(&mut cancel);
    assert!(view.complete(b, vec!["b.txt".into()]));
    assert!(!view.complete(a, vec!["a.txt".into()]));
    assert_eq!(view.shown(), &["b.txt".to_string()]);
}

#[test]
fn ac02_cancel_rejected_old_completion_is_ignored() {
    let mut view = DirectoryView::default();
    let mut cancel = RejectCancel::default();
    let a = view.switch_to(&mut cancel);
    let b = view.switch_to(&mut cancel); // ここでAのキャンセルが失敗する
    assert_eq!(cancel.attempts, vec![a]); // 失敗経路を確実に通った
    assert!(view.complete(b, vec!["b.txt".into()]));
    assert!(!view.complete(a, vec!["stale.txt".into()]));
    assert_eq!(view.shown(), &["b.txt".to_string()]);
}

#[test]
fn current_generation_is_applied() {
    let mut view = DirectoryView::default();
    let mut cancel = AcceptCancel;
    let a = view.switch_to(&mut cancel);
    assert!(view.complete(a, vec!["current.txt".into()]));
    assert_eq!(view.shown(), &["current.txt".to_string()]);
}
```

プロジェクト直下の`Cargo.toml`は以下の最小構成です。

```toml
[package]
name = "shift_left_view_guard"
version = "0.1.0"
edition = "2021"
publish = false

[dependencies]
```

```text
Cargo.toml
src/lib.rs
tests/view_guard.rs
```

```bash
cargo test --workspace --all-targets
```

**テストと受入条件の対応：** `ac01_late_a_cannot_overwrite_b` → AC-01、`ac02_cancel_rejected_old_completion_is_ignored` → AC-02、`current_generation_is_applied` → 正常系です。`complete()`の世代比較を除去すると、少なくとも古い結果の上書きを防ぐ2テストは失敗する想定です。実際の検証結果は対象コミットのCIログで確認してください。


> **注記**
> これは**テストダブルでキャンセル失敗を注入したモデル検証**です。OSのI/Oキャンセル、実際のスレッド競合、GUIフレームワーク統合の正しさまでは立証していません。その範囲は別の統合・E2Eテストで確認します。Rustのソース例はこの記事内に掲載していますが、独立したビルド可能なサンプルプロジェクトはこのリポジトリに含めていません。


### Validationも同じ課題に接続する

上のREQ-01の仕様適合性は、順序を制御したTEST-01/02で検証できる。一方、「切り替え後に古い結果を表示しない」が**利用者の困りごとを解決するか**は、実際の操作シナリオとユーザーの期待を確認する必要がある。課題レコードには次を別々に残す。

| 種別 | 例 | 証跡 |
|---|---|---|
| VAL-01：妥当性 | 利用者は切替後、選択中のフォルダの一覧が一貫していることを期待 | 操作シナリオの確認、必要ならユーザーテスト |
| VER-01：仕様適合 | 旧タスクが後から完了しても新しい一覧は上書きされない | 順序制御した自動テストログ |
| EVD-01：合否の根拠 | 対象コミットでテストが成功 | CI実行IDとログ |

**仕様変更はVALを更新し、期待値を変えたテストはVERのレビューをやり直す。** 新しい列を大量に増やす必要はなく、既存Issueのリンクや本文で表現してよい。

## 独立性には複数の意味がある

「別のAIにレビューさせたから独立」と考えるのは早計です。独立性は少なくとも次に分けられます。

| 独立性 | 誰が／何を分けるのか | 失敗例 |
|---|---|---|
| 判定基準の独立性 | 受入条件を実装の前に確定する | 実装に合わせて期待値を変更する |
| 検査手段の独立性 | 異なる失敗の検出手段を組み合わせる | 単体テストだけで全品質を判断する |
| 人的レビューの独立性 | 必要な場面で別担当者が確認する | 作者自身のレビューを第三者レビューと呼ぶ |
| 承認権限の独立性 | マージ・リリースの権限を明示する | テストの成功を正式承認の代わりにする |

テストで検証できる条件と、人間の承認を必要とする条件は同じではありません。リスクに応じて何が必要か定義します。

## 「PASS」の証跡は何に紐付いているか

同じ名前のテストが通っても、実行したコミットとマージ対象コミットが違えば、その合格記録をそのまま使えるとは限りません。最低限、次を結びつけます。

```text
REQ/AC（合意済みの受入条件）
  → TEST（検証方法とオラクルの出典）
  → SHA（検証対象コミット）
  → RUN（CI/コマンド・設定・環境）
  → RESULT（PASS/FAIL/NOT_RUN/INCONCLUSIVE）
  → REVIEW（承認者・未検証事項）
```

設定変更、テストの`skip`、期待値の変更は単なるリファクタリングではなく、**正しさの判定基準への変更**であることを意識してレビューします。


> **注記**
> 性能などの統計的指標で`INCONCLUSIVE`となる場合もあります。未実施と判定不能を`PASS`に読み替えず、再実行や検証計画の修正を検討します。


## まとめ

AIが書いたコードをAIで検証すること自体は有効です。しかし、**その検査がどの仕様に基づき、何を確認し、どの範囲を保証できないのか**を分離する必要があります。検証の成否だけでなく、検証の根拠が追える状態を目指します。

---

[← 前章：Security・Reliability・UI/UX by Design](./04-ai-coding-shift-left-quality.md) ｜ [次章：リスク分類と品質ゲート →](./06-ai-coding-shift-left-quality-gates.md)
