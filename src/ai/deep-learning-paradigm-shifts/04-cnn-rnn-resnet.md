# 第4章 CNN・RNN時代：問題ごとに設計された計算構造

作成日：2026-10-12 / 更新日：2026-10-14

Deep Learningの初期の成功は、**何でも同じネットワークで処理したから**起きたわけではない。画像にはCNN、時系列にはRNNというように、データ構造に強く合わせた設計が鍵だった。

## 4.1 CNN：空間的な局所性と重み共有

CNN（Convolutional Neural Network）は、局所的な近傍に同じフィルタを適用する。

\\[
h_{i,j,c'}=\sigma\\!\left(
\sum_{u,v,c}W_{u,v,c,c'}x_{i+u,j+v,c}+b_{c'}
\right)
\\]

この式は多くの実装で採用される相互相関（フィルタの反転を含まない演算）の書き方であり、厳密な数学上の畳み込みとは添字の扱いが異なる。重要なのは、**局所的な結合**と**位置をまたぐ重み共有**だ。平行移動した物体に対して共通の検出器を使いやすく、少ないパラメータで階層的特徴を学習できる。

これは画像データに適した帰納バイアスである反面、離れた位置同士の関係を扱うには層の深さや受容野の拡大などが必要になる。もちろん、大きなカーネルや多段の畳み込みによって広域情報を扱うこともできる。

AlexNet（2012）は、CNNと大規模データ、GPU学習の組み合わせが大きな効果を持つことを示した。[Krizhevsky et al. (2012)](https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html)。

## 4.2 RNNとLSTM：逐次処理に組み込まれた時間構造

RNN（Recurrent Neural Network）は、時刻 \\(t\\) の入力と前時刻の隠れ状態を使い、次の状態を計算する。

\\[
h_t=F_\theta(h_{t-1},x_t)
\\]

この構造は可変長系列を自然に扱える。ただし時刻方向の依存があるため、典型的なRNNでは系列全体を同時に計算しにくい。また長期依存の学習は勾配消失・爆発の影響を受け得る。

**LSTM** はゲートとセル状態を導入し、長期情報の保持と学習を改善した。[Hochreiter & Schmidhuber (1997)](https://direct.mit.edu/neco/article/9/8/1735/6109/Long-Short-Term-Memory)。LSTMがこれらの問題を完全に解決したわけではないが、音声・翻訳・時系列モデリングで長く中心的な役割を果たした。

RNNのencoder-decoderによる系列変換は[Sutskever, Vinyals & Le (2014)](https://arxiv.org/abs/1409.3215) などに代表される。その後、必要な入力位置を動的に参照するAttentionが、RNNベースの翻訳モデルにも導入された。[Bahdanau, Cho & Bengio (2014/2015)](https://arxiv.org/abs/1409.0473)。**AttentionそのものはTransformerの登場以前から存在した。**

## 4.3 ResNet：深いネットワークを「更新の積み重ね」として捉える

CNN時代の重要な発明が残差接続（Residual Connection）である。

\\[
x_{l+1}=x_l+F_l(x_l)
\\]

直接 \\(H_l(x_l)\\) を学ぶ代わりに、入力へ追加する**更新量** \\(F_l(x_l)\\) を学ぶ構造と捉えられる。恒等写像が必要なら \\(F_l\approx0\\) とすればよい。勾配には、恒等経路を通る項が加わる。

\\[
\frac{\partial x_{l+1}}{\partial x_l}=I+J_{F_l}(x_l)
\\]

この恒等項は深いネットワークを学習しやすくする一因である。ただし最適化の成功が、この式だけで保証されるわけではない。また、ここでの \\(x+F(x)\\) は**単純化した残差ブロック**の式であり、初期のResNetでは加算後に活性化を適用する構成も用いられた。厳密なIdentity経路を重視したPre-activation型との違いは後続研究で整理されている。[He et al. (2016), ResNet](https://arxiv.org/abs/1512.03385)、[He et al. (2016), Identity Mappings](https://arxiv.org/abs/1603.05027)。

ここで**用語に注意**したい。ResNetの文献では \\(F_l\\) を *residual branch（残差ブランチ）* と呼び、\\(x_l\\) 側を *shortcut/identity branch* と呼ぶことが多い。一方、Transformer解釈では積み上げた共有状態を *residual stream* と呼ぶ。両者を混同しないため、本書では以下を使う。

- **Residual Stream / 主経路**：前層までの状態を持ち越す加算経路。
- **Computational Branch / 更新計算経路**：AttentionやFFNなど、次の加算量 \\(\Delta x\\) を計算する側。

## 4.4 CNN/RNNとTransformerの違いは「知能の有無」ではない

| 観点 | CNN | RNN/LSTM | Transformer |
| --- | --- | --- | --- |
| 主な構造 | 局所近傍・重み共有 | 時間順の状態遷移 | トークン間の動的な結合 |
| 長距離関係 | 深い層・広い受容野など | 状態の伝播・ゲート | Attentionで直接参照し得る |
| 逐次依存 | 通常は低い | 高い | 学習時はトークン方向を並列化しやすい |
| 計算量の課題 | 大きな特徴マップ | 長い逐次計算 | 長系列Attentionの2次コスト |
| 強い帰納バイアス | 空間的局所性 | 時間的再帰 | 関係を入力に応じて選ぶ柔軟性 |

CNNでも大域的な関係は扱え、Transformerにも位置情報と構造的制約が必要だ。したがって「CNNは局所的な処理しかできず、Transformerだけが全体を見る」という断定は適切でない。

**次の転換点**は、画像か文章かといった領域に強く依存した計算構造から、同じ基本ブロックを多くのデータ形式へ適用できる構造が普及したことにある。

---

[← 前章：多様体仮説と幾何変換](03-manifold-geometric.md) ｜ [次章：Transformerの転換 →](05-transformer-shift.md)
