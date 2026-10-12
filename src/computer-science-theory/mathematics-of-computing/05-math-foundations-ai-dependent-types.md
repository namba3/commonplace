# 依存型という革新：仕様と証明を型で表現するとはどういうことか

> **シリーズ「AI時代に再発見する情報科学の数学的本質」第5章：依存型**  
> 通常の型、依存型、命題、証明がどうつながるのかを、2要素のソートを題材に説明します。

プログラミング言語の型は、どのような値を扱えるかを表すための仕組みです。

しかし、依存型（dependent types）の発想は、その役割を大きく広げます。

**「単に整数を返す」ではなく、「指定した性質を満たす整数を返す」。その条件を型の一部として表せる**のです。

さらに命題と証明を型理論の中で扱うことで、仕様・実装・証明を共通の枠組みで結びつけられます。

これは昔から研究されてきた発想ですが、AIがコードや証明候補を作る時代には、改めて重要になるかもしれません。

## 通常の型から、値に依存する型へ

例えば、次の型を考えます。

```text
List Nat
```

自然数のリストを表しますが、リストの長さは型からは分かりません。

一方、依存型では**型が値に依存**できます。

```text
Vector Nat 8
```

これは「長さ8の自然数ベクトル」を表す概念的な記法です。Leanの型としては`Vector Nat 8`のように表現できます。

さらに、関数の引数である\\( n \\)に応じて、返り値の型が変わります。

\\[
f:(n:\mathbb N)\rightarrow\operatorname{Vector}(\mathbb N,n)
\\]

大事なのは、長さが合っているかを**実行した後で調べる**だけではなく、型検査の条件として扱えることです。

## ソートを「正しいと分かる型」にする

次の関数型だけでは、ソートの正しさは分かりません。

```text
sort : List Nat -> List Nat
```

空リストを返しても、すべての要素を0に書き換えても、型だけなら成立します。

ここで、出力が満たすべき条件を明示しましょう。

1. 要素が昇順である。
2. 元の要素が、重複個数を含めて保存されている。

概念的には、次のような型を与えられます。

```text
sort : (xs : List Nat) ->
  {ys : List Nat // Sorted ys ∧ Permutation xs ys}
```

このコードは依存型の意味を示す擬似表記です。`Sorted`や`Permutation`の定義は省略しています。

返すものは単なるリストではありません。**整列済みで、元のリストの並べ替えになっているリストと、その根拠を組にしたもの**です。

ここに、依存型を単なる「強い型注釈」よりも興味深くする理由があります。

## 命題と型の関係：Curry–Howard対応

Curry–Howard対応では、命題を型、証明をその型の項として捉えます。

| 論理・数学 | 型理論での見方 |
|---|---|
| 命題 \\( P \\) | 型 \\( P \\) |
| \\( P \\) の証明 | 型 \\( P \\) の項 |
| \\( P\Rightarrow Q \\) | \\( P \\)から\\( Q \\)への関数 |
| 全称量化 \\( \forall x,P(x) \\) | 依存関数型 |

例えばLean 4では、次の命題を書けます。

```lean
example (n : Nat) : n + 0 = n := by
  simp
```

`n + 0 = n`が命題で、`by simp`は証明を構築するためのタクティクです。最終的には、証明項が適切な型を持つかをカーネルが検査します。

Curry–Howard対応そのものは依存型だけに固有ではありません。**依存型の重要性は、値に応じた命題や量化まで型に表現しやすくなる**点にあります。

## Π型、Σ型、Subtype、Existsは同じものではない

依存型を学び始めると、似た形の概念が登場します。

| 概念 | おおまかな意味 | Leanでの例 |
|---|---|---|
| Π型（依存関数型） | \\( x \\)の値で結果の型が決まる関数 | `(n : Nat) -> Vector Nat n` |
| Σ型（依存ペア型） | 第1成分に依存して第2成分の型が決まるデータの組 | `Sigma` |
| `Subtype` | 述語を満たす値と、その証拠の組 | `{n : Nat // n > 0}` |
| `Exists` | 条件を満たす値が存在するという命題 | `∃ n : Nat, n > 0` |

特にLeanでは、`Sigma`は計算データを扱う依存ペアで、`Subtype`は値と`Prop`に属する証明を組にするための型です。`Exists`は存在を表す命題です。

すべてを「値と条件の組」とだけ説明すると、**計算に使う値と論理的な証拠の違い**を見失います。

ここで扱うソート結果には`Subtype`が適しています。

また、Leanの`Prop`に属する証明は通常、実行時の計算データとして保持することを目的としていません。`Subtype`を「実行時にも証明書オブジェクトを常に持ち回る型」と考えるのは誤解です。

## Lean 4で2要素をソートしてみる

一般のリストよりも小さく、2個の自然数を並べ替える例にしましょう。

まず、仕様です。

```lean
import Init

namespace SortDemo

def SortedPair (p : Nat × Nat) : Prop := p.1 ≤ p.2

def PermutationPair (a b : Nat) (p : Nat × Nat) : Prop :=
  p = (a, b) ∨ p = (b, a)

def SortResult (a b : Nat) : Type :=
  { p : Nat × Nat // SortedPair p ∧ PermutationPair a b p }

end SortDemo
```

この型は、出力の順序性と、入力の2要素が保存されることを要求します。次に実装です。

```lean
import SortSpec

namespace SortDemo

def sortTwo (a b : Nat) : SortResult a b :=
  if h : a ≤ b then
    ⟨(a, b), ⟨h, Or.inl rfl⟩⟩
  else
    have hba : b ≤ a := (Nat.le_total a b).resolve_left h
    ⟨(b, a), ⟨hba, Or.inr rfl⟩⟩

end SortDemo
```

上の仕様と実装のコード例は、それぞれ`SortSpec.lean`と`SortTwo.lean`に分ける想定です。このリポジトリには実行可能なLakeプロジェクトや`Acceptance.lean`を含めていないため、ここに示した断片だけでは`lake build`を実行できません。Leanのツールチェーンを導入する方法は、[公式のLeanインストールガイド](https://lean-lang.org/install/)を参照してください。

> **注意**
>
> **再現性について：** この章ではLean 4.34.1でのコンパイルを確認していません。掲載した断片は教育用で、実行可能なサンプルプロジェクトや未信頼のLeanコードを安全に受け入れるCIを提供するものではありません。実利用前に、対応するプロジェクト構成を用意してコンパイルと出力を確認してください。


注目すべきは、各分岐が単にペアを返すだけではなく、`SortedPair`と`PermutationPair`の証明も構成していることです。

例えば\\( a\le b \\)の場合、`(a,b)`が昇順である証拠は`h`です。並べ替えである証拠は、元のペアと一致することを示す`rfl`です。

一方、\\( a>b \\)の場合は、`b ≤ a`を導く必要があります。

なお、`Nat.le_total a b`は`a ≤ b ∨ b ≤ a`という`Prop`に属する命題の証明です。**これを直接「計算値のどちらを返すか」の分岐に使わず、`if h : a ≤ b`の判定を用いる**のがポイントです。Leanには`Prop`から`Type`への除去に制約があるからです。

## 型が仕様なら、どこに証明義務があるのか

上の`sortTwo`は、`SortResult a b`型の値を構築しなければなりません。

したがって、「順序」と「要素保存」の証明義務は、**その値を構築する時点**にあります。

後から以下のような定理を書くこともできます。

```lean
theorem sortTwo_sorted (a b : Nat) :
    SortedPair (sortTwo a b).val :=
  (sortTwo a b).property.1
```

ただしこれは、別のアルゴリズムで独立にソートの正しさを検証しているわけではありません。すでに`SortResult`に含まれる証明を取り出しているのです。

この違いを理解すると、依存型が**実装と仕様をどこで結びつけているのか**が見えてきます。

## AIコーディング時代に何が変わるのか

依存型自体は新しい発明ではありません。Martin-Löfによる型理論をはじめ、長い歴史があります。

それでもAIコーディングとの組み合わせが面白いのは、候補となるプログラムや証明項をAIに探索させ、**検査はAIの自己申告ではなく形式的な検証器に委ねられる**ことです。

ただし、証明器に通ったからといって、人間の要求まで保証されたとは限りません。AIが仕様や公理を勝手に変更するなら、見かけ上の成功を作れてしまいます。

そのため、承認済み仕様と、AIが編集してよい実装・証明候補を分離する設計が重要です。

## おわりに

依存型の革新性は、型を細かく指定できることだけではありません。

**仕様を型にし、実装がその型の値を構築すること自体に証明義務を組み込めること**です。

AIがコードを書くようになったとき、人間が「どう書くか」から「何が満たされるべきか」へ関心を移すなら、依存型は重要な選択肢になります。

しかし、依存型だけが正解というわけではありません。次章は、Rust、Lean、Kani、Verus、Dafnyなどが、何を異なる方法で保証しているのかを比較します。

## 参考文献

- [Lean: Dependent Type Theory](https://lean-lang.org/theorem_proving_in_lean4/Dependent-Type-Theory/)
- [Lean: Propositions and Proofs](https://lean-lang.org/theorem_proving_in_lean4/Propositions-and-Proofs/)
- [Lean Language Reference: Subtypes](https://lean-lang.org/doc/reference/latest/Basic-Types/Subtypes/)
- [Lean: PropからTypeへの除去制約](https://lean-lang.org/doc/reference/latest/Error-Explanations/About___--propRecLargeElim/)
- [Stanford Encyclopedia of Philosophy: Intuitionistic Type Theory](https://plato.stanford.edu/entries/type-theory-intuitionistic/)

---

## 章ナビゲーション

- **シリーズの総論：** [第1章｜総論：二つの数学的な転換](01-math-foundations-ai-overview.md)
- **前章：** [第4章｜AIコーディング：仕様と設計](04-math-foundations-ai-coding.md)
- **次章：** [第6章｜言語比較：保証の種類と選定](06-math-foundations-ai-languages.md)
