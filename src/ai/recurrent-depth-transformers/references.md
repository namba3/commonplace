# 参考文献・一次資料
作成日：2026-11-03 / 更新日：2026-11-03

ここでは原論文または会議録・著者公開ページを中心に掲げる。**2026年のプレプリントは発表・改訂時点の内容であり、結果が後日更新される可能性がある。会議採択論文、査読前プレプリント、研究プロジェクトページを区別して読む。リンクは原論文・会議録を優先する。**

**数値の比較について：** 本文に記載する「最大◯倍」「◯ポイント」は、それぞれの論文が用いたモデル・ハードウェア・ベンチマーク・比較対象に限定された報告値である。異なる論文の最大値を同じ尺度として並べ、ランキング化しない。arXiv版は改訂で数値が変わる場合があるため、厳密な再引用時は版（v番号）も確認する。

## 層間類似性とResidual Stream

- Min & Wang (ICLR 2025), [DOCS: Quantifying Weight Similarity for Deeper Insights into Large Language Models](https://proceedings.iclr.cc/paper_files/paper/2025/hash/a39a9aceda771cded859ae7560530e09-Abstract-Conference.html) — 重み類似度と層間クラスター。
- Elhage et al. (2021), [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html) — Residual Streamを共有通信経路として捉える基礎。
- Razzhigaev et al. (ACL 2024), [Your Transformer is Secretly Linear](https://aclanthology.org/2024.acl-long.293/) — 隣接層の表現と残差経路。
- Patrawala et al. (NeurIPS 2025), [LLM Layers Immediately Correct Each Other](https://proceedings.neurips.cc/paper_files/paper/2025/hash/cb574f092013f886fe0b93d295aa402e-Abstract-Conference.html) — 隣接層による更新の補正。

## Looped Transformer / Recurrent-Depth Transformer

- Dehghani et al. (2018), [Universal Transformers](https://arxiv.org/abs/1807.03819) — 深さ方向の共有計算と適応停止。
- Lan et al. (2019), [ALBERT: A Lite BERT for Self-Supervised Learning of Language Representations](https://arxiv.org/abs/1909.11942) — 層間パラメータ共有による圧縮。
- Bai et al. (NeurIPS 2019), [Deep Equilibrium Models](https://papers.neurips.cc/paper_files/paper/2019/hash/01386bd6d8e091c2ab4c7c7de644d37b-Abstract.html) — 重み共有型モデルの固定点と陰関数微分。
- Giannou et al. (ICML 2023), [Looped Transformers as Programmable Computers](https://proceedings.mlr.press/v202/giannou23a.html) — 反復Transformerの計算表現能力。
- Geiping et al. (NeurIPS 2025), [Scaling up Test-Time Compute with Latent Reasoning: A Recurrent Depth Approach](https://arxiv.org/abs/2502.05171) — Huginn。
- Zhu et al. (2025、2026年改訂), [Scaling Latent Reasoning via Looped Language Models](https://arxiv.org/abs/2510.25741) — Ouro。2026-10-11のv6まで改訂あり。[モデル・評価ページ](https://ouro-llm.github.io/)も参照。
- Marchenko et al. (2026), [Closing the Loop: Practical Training Recipes for Looped Language Models](https://arxiv.org/abs/2610.00673) — ループ型モデルの学習レシピと事前学習済みDenseモデルの変換。プレプリント。
- Fan et al. (2026), [Bridging the Gap Between Latent and Explicit Reasoning with Looped Transformers](https://arxiv.org/abs/2606.31779) — LOTUS。反復＋並列潜在スロット＋CoT教師信号。
- Huang et al. (2026), [Towards Looped Models Done Right, Part I: Topology, Input Injection, Recurrent-State Design](https://arxiv.org/abs/2610.23036) — 反復の配置とMoEへの展開。
- Huang et al. (2026), [Towards Looped Models Done Right, Part II: Rethinking at Fixed Points](https://arxiv.org/abs/2610.06833) — 固定点と深度分布、KV共有、Prefill・RLの計算コスト。
- Xu & Sato (ICML 2025), [On Expressive Power of Looped Transformers: Theoretical Analysis and Enhancement via Timestep Encoding](https://proceedings.mlr.press/v267/xu25x.html) — 深度条件付きスケーリングと表現力。
- Jeddi et al. (ICLR 2026), [LoopFormer: Elastic-Depth Looped Transformers for Latent Reasoning via Shortcut Modulation](https://openreview.net/forum?id=RzYXb5YWBs) — 時刻・刻み幅の条件付けと軌跡整合。[arXiv版](https://arxiv.org/abs/2602.11451)。
- Zhuang et al. (2026), [What Makes Recurrence Effective in Looped Language Models?](https://arxiv.org/abs/2609.36636) — 反復外挿、Depth Conditioning、History-State Injectionと状態の相互作用。
- Li et al. (2026), [DeepLoop: Depth Scaling for Looped Transformers](https://arxiv.org/abs/2607.13491) — 反復訪問を踏まえた残差スケーリング。
- Chen et al. (2026), [Hybrid Latent Attention for Looped Language Models](https://arxiv.org/abs/2610.07940) — KVキャッシュの圧縮と実効スループット。
- Williams et al. (ICML 2026), [Prioritize the Process, Not Just the Outcome](https://proceedings.mlr.press/v306/williams26b.html) — 潜在反復軌跡への報酬の配分。

## MTP・将来予測・Speculative Decoding

- Gloeckle et al. (ICML 2024), [Better & Faster Large Language Models via Multi-token Prediction](https://proceedings.mlr.press/v235/gloeckle24a.html) — 共有Trunkから将来位置を学習するMTP。
- DeepSeek-AI et al. (2024/2025), [DeepSeek-V3 Technical Report](https://arxiv.org/abs/2412.19437) — 逐次的なMTPモジュールと学習補助目的。
- Shomali et al. (2026), [LoopMTP: A Looped Transformer Guided by Latent Multi-Token Prediction](https://arxiv.org/abs/2608.03624) — 各反復状態への将来トークン埋め込みのSoft Alignment。
- Cho et al. (2026), [LoopSpec: Pipelined Self-Speculative Decoding for Looped Transformers](https://arxiv.org/abs/2609.17184) — 浅い反復をDraftに使うパイプライン。
- Liu et al. (2026), [LoopAhead: Speculating Ahead for Faster Decoding in Looped Language Models](https://arxiv.org/abs/2610.21594) — Lookahead Draftと深い反復からのフィードバック。
- Zuhri et al. (ICML 2026), [Predicting the Order of Upcoming Tokens Improves Language Modeling](https://proceedings.mlr.press/v306/zuhri26a.html) — MTPと将来トークン順序の教師信号を比較。

## Block Diffusion・反復Denoising・並列サンプリング

- Arriola et al. (ICLR 2025), [Block Diffusion: Interpolating Between Autoregressive and Diffusion Language Models](https://proceedings.iclr.cc/paper_files/paper/2025/hash/7ede97c3e082c6df10a8d6103a2eebd2-Abstract-Conference.html) — ブロック間ARとブロック内離散拡散。
- Lee et al. (2026), [Looped Diffusion Language Models](https://arxiv.org/abs/2605.26106) — LoopMDMと適応的Depth Recurrence。
- Geiping et al. (ICML 2026), [Efficient Parallel Samplers for Recurrent-Depth Models and Their Connection to Diffusion Language Models](https://proceedings.mlr.press/v306/geiping26a.html) — 既存Recurrent-Depthモデルへ適用する並列サンプラー。
- Cameron et al. (ICML 2026), [One Step Forward and K Steps Back: Better Reasoning with Denoising Recursion Models](https://proceedings.mlr.press/v306/cameron26a.html) — Denoisingの中間状態と再帰的学習。
- Chng et al. (2026), [Looped Diffusion Transformer](https://arxiv.org/abs/2609.40305) — 画像生成のDenoisingステップ内で共有Coreを反復。
- Ma et al. (2026), [Diffusion In Diffusion: Reclaiming Global Coherence in Semi-Autoregressive Diffusion](https://arxiv.org/abs/2601.13599) — ブロック草案の大域的再修正。
- Arriola & Kuleshov (ICML 2026), [Set Diffusion: Interpolating Token Orderings between Autoregression and Diffusion for Fast and Flexible Decoding](https://proceedings.mlr.press/v306/arriola26a.html) — 位置集合単位での柔軟な生成。

## CoT・潜在推論・マルチモーダル

- Wei et al. (2022), [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903) — CoT Prompting。
- Hao et al. (COLM 2025), [Training Large Language Models to Reason in a Continuous Latent Space](https://arxiv.org/abs/2412.06769) — Coconut。
- Yang et al. (CVPR 2026), [Machine Mental Imagery: Empower Multimodal Reasoning with Latent Visual Tokens](https://openaccess.thecvf.com/content/CVPR2026/html/Yang_Machine_Mental_Imagery_Empower_Multimodal_Reasoning_with_Latent_Visual_Tokens_CVPR_2026_paper.html) — Mirage。
- Xu et al. (2026), [Looping Back to Move Forward: Recursive Transformers for Efficient and Flexible Large Multimodal Models](https://arxiv.org/abs/2602.09080) — RecursiveVLM。
- Ray et al. (CVPR 2026 Findings), [Mull-Tokens: Modality-Agnostic Latent Thinking](https://openaccess.thecvf.com/content/CVPR2026F/html/Ray_Mull-Tokens__Modality-Agnostic_Latent_Thinking_CVPRF_2026_paper.html) — マルチモーダル潜在トークン。
- Qiu et al. (2026), [Does Latent Chain-of-Thought Actually Reason? A Single, Unifying Taxonomy for Latent Reasoning](https://arxiv.org/abs/2610.21182) — 潜在チェーンの表現・利用・状態遷移を分ける因果的な検証。

## 検証範囲

- mdBook 0.5.4でビルドし、生成HTMLに数式区切りが残ることと、ローカルリンク・アンカーの参照先を確認した。
- 引用元の一次資料は主要な数値・構造の主張を中心に確認した。全外部URLの疎通確認や、論文の実験再現は行っていない。
- Mermaid図は編集可能なソースを保持している。ブラウザー上での描画とテーマ別のコントラストは未確認である。

---

[連載の目次へ](./)
