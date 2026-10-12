# 第5章 Transformerが起こした二度目のパラダイムシフト

## 5.1 Attentionを中心に、系列全体の相互作用を計算する

Transformerは、2017年の[Vaswani et al., *Attention Is All You Need*](https://arxiv.org/abs/1706.03762) で提案された。RNNの逐次状態更新を主要構造にせず、Attentionを用いた系列処理を提示した。

Self-Attentionは、トークン表現行列 \\(X\\) から

\\[
Q=XW_Q,\qquad K=XW_K,\qquad V=XW_V
\\]

を計算し、

\\[
\operatorname{Attention}(Q,K,V)
=\operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}+M\right)V
\\]

で出力を得る。\\(M\\) は必要に応じたマスクで、Causalモデルでは未来位置への参照を制限する。

大切なのは、**どのトークンがどのトークンを参照するかという結合の強さが、入力に応じて変化する**ことだ。単純な固定行列だけの処理とも、登録済みパターンの検索とも異なる。

ただし、Attentionは値の重み付き集約を行う仕組みであり、「すべての知能がAttention一つから生まれる」という意味ではない。

### Attentionには位置とマスクの設計が必要

Self-Attentionの行列演算だけでは、入力の順序や空間的配置を自動的に識別できるわけではない。位置埋め込みやRoPEのような位置表現、Causal/双方向のマスクなどが、どの関係を学習できるかを規定する。つまりTransformerは帰納バイアスを消したのではなく、**汎用的な相互作用演算と、タスクに応じた構造指定を分離しやすくした**。

## 5.2 CNN/RNNから何が変わったのか

- **動的な依存関係**：離れた位置にも直接Attentionを向けられる。どの位置を重視するかは入力によって異なる。
- **系列方向の並列性**：学習時に与えられたトークン列のAttentionを並列計算しやすい。一方、自己回帰生成時の次トークン生成は通常は逐次的である。
- **同種ブロックの再利用**：文章・画像パッチ・音声表現などをトークン列にすれば、類似した計算部品を利用できる。
- **大規模事前学習**：大量データで学習した表現を、多様な下流タスクへ移す運用が拡大した。

**Transformerは「入力の種類を問わず意味を理解する万能装置」ではない**。適切なトークン化、位置表現、学習目標、データが必要であり、帰納バイアスが完全になくなったわけでもない。

### アーキテクチャの変化と、学習方式の変化を混同しない

Transformerの成功には、Attentionの計算上の性質に加え、自己教師ありの大規模事前学習、データセット、アクセラレータ、分散学習などの発展も寄与した。大規模化や事前学習はTransformerにしかない性質ではないが、同種のブロックを積み重ねて多領域へ展開できる設計と結びつき、実用上の転換を加速した。

## 5.3 Attentionだけではない：FFNとResidual Stream

Transformerの基本ブロックをPre-Norm型で書けば、

\\[
\begin{aligned}
u&#95;l&=x&#95;l+\operatorname{Attn}&#95;l(\operatorname{Norm}(x&#95;l)),\\\\
x&#95;{l+1}&=u&#95;l+\operatorname{FFN}&#95;l(\operatorname{Norm}(u&#95;l))
\end{aligned}
\\]

となる。

Attentionは**トークン間で情報をやり取り**できる。一方、一般的なFFNは**各トークンのチャネル表現を非線形に変換**する。そしてどちらの計算結果も、同じ流れへ加算される。

ここに、Transformerの現代的な理解として重要な視点がある。**共通のResidual Streamに対して、多数の更新計算が繰り返し作用する**という見方である。次章で詳しく扱う。

## 5.4 トークン化とAttentionの汎用性

- 言語：サブワードや語彙トークンの埋め込み。
- 画像：ViTのように画像をパッチ列へ変換する。[Dosovitskiy et al. (2021)](https://arxiv.org/abs/2010.11929)。
- 音声：フレームやパッチ、離散化表現を系列へ変換する。
- 生成画像：潜在画像のパッチへTransformerを適用するDiTがある。[Peebles & Xie (2023)](https://openaccess.thecvf.com/content/ICCV2023/html/Peebles_Scalable_Diffusion_Models_with_Transformers_ICCV_2023_paper.html)。

同じ演算が使えるからといって、モダリティ間で必ず学習済み表現を共有できるとは限らない。モダリティ固有のエンコーダや位置設計を組み合わせる場合もある。

## 5.5 汎用化と引き換えのコスト

標準的な密なSelf-Attentionには、系列長 \\(n\\) に対して \\(n\times n\\) のスコアに相当する相互作用があり、**長さに関して二次**の演算が含まれる。head幅を \\(d_k\\) とすると、スコア計算は概ね \\(O(n^2d_k)\\) である。一方、実装上はFlashAttentionのようにスコア行列全体のメモリ保持を避けられるため、**演算量の二次性と追加メモリ量の二次性は同一の主張ではない**。長系列では計算とメモリアクセスが課題となる。FlashAttentionはAttentionを近似して省略するのではなく、I/Oを意識した実装によって効率化する。[Dao et al. (2022)](https://papers.neurips.cc/paper_files/paper/2022/hash/67d57c32e20fd0a7a302cb81d36e40d5-Abstract-Conference.html)。

ここで言う汎用性とは、**同じ種類の変換部品を多くの問題へ適用しやすい**という工学的性質である。計算資源が無限に必要なくなるという意味ではない。

> **Transformerの転換点**：学習可能な特徴変換に加え、入力に応じて変わる情報の参照・統合と、共通状態の段階的更新を、汎用的なブロックとして大規模化しやすくした。

---

[← 前章：CNN・RNN時代](04-cnn-rnn-resnet.md) ｜ [次章：Residual StreamとComputational Branch →](06-residual-stream.md)
