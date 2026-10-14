# 参考文献・関連資料

文献は原論文・研究機関の公式発表を中心に選んだ。公式発表には著者・組織側の主張が含まれるため、再現可能な独立検証と同一視しない。研究結果の報告と、本シリーズの解釈は区別している。Qwen系はマルチモーダル設計の短い具体例としてのみ紹介し、モデルの詳細比較や性能ランキングは本シリーズの対象外とした。

## 言語・推論・数学研究

- Brown, T. et al. (2020). *Language Models are Few-Shot Learners*. <https://arxiv.org/abs/2005.14165>
- Wei, J. et al. (2022). *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models*. <https://arxiv.org/abs/2201.11903>
- OpenAI (2025). *Early experiments in accelerating science with GPT-5*. <https://openai.com/index/accelerating-science-gpt-5/> — Erdős Problem #848の協働事例。
- OpenAI (2026). *An OpenAI model has disproved a central conjecture in discrete geometry*. <https://openai.com/index/model-disproves-discrete-geometry-conjecture/> — 特定の単位距離予想への反例に関する発表。
- Tsoukalas, G. et al. (2026). *Advancing Mathematics Research with AI-Driven Formal Proof Search*. <https://arxiv.org/abs/2605.22763> — モデルと形式検証器の組み合わせ。

## 表現学習・内部表現

- Bengio, Y., Courville, A. & Vincent, P. (2013). *Representation Learning: A Review and New Perspectives*. <https://arxiv.org/abs/1206.5538>
- Li, K. et al. (2023). *Emergent World Representations: Exploring a Sequence Model Trained on a Synthetic Task*. <https://arxiv.org/abs/2210.13382>
- Gurnee, W. & Tegmark, M. (2023). *Language Models Represent Space and Time*. <https://arxiv.org/abs/2310.02207>
- He, K. et al. (2022). *Masked Autoencoders Are Scalable Vision Learners*. <https://arxiv.org/abs/2111.06377>
- Radford, A. et al. (2021). *Learning Transferable Visual Models From Natural Language Supervision*. <https://arxiv.org/abs/2103.00020>

## 画像生成・確率過程

- Ho, J., Jain, A. & Abbeel, P. (2020). *Denoising Diffusion Probabilistic Models*. <https://arxiv.org/abs/2006.11239>
- Song, Y. et al. (2021). *Score-Based Generative Modeling through Stochastic Differential Equations*. <https://arxiv.org/abs/2011.13456>
- Lipman, Y. et al. (2023). *Flow Matching for Generative Modeling*. <https://arxiv.org/abs/2210.02747>

## Unified Transformer・マルチモーダル

- Chameleon Team (2024). *Chameleon: Mixed-Modal Early-Fusion Foundation Models*. <https://arxiv.org/abs/2405.09818>
- Zhou, C. et al. (2024). *Transfusion: Predict the Next Token and Diffuse Images with One Multi-Modal Model*. <https://arxiv.org/abs/2408.11039>
- Xie, J. et al. (2024). *Show-o: One Single Transformer to Unify Multimodal Understanding and Generation*. <https://arxiv.org/abs/2408.12528>
- Wu, C. et al. (CVPR 2025). *Janus: Decoupling Visual Encoding for Unified Multimodal Understanding and Generation*. <https://openaccess.thecvf.com/content/CVPR2025/html/Wu_Janus_Decoupling_Visual_Encoding_for_Unified_Multimodal_Understanding_and_Generation_CVPR_2025_paper.html>
- Ma, Y. et al. (CVPR 2025). *JanusFlow: Harmonizing Autoregression and Rectified Flow for Unified Multimodal Understanding and Generation*. <https://openaccess.thecvf.com/content/CVPR2025/html/Ma_JanusFlow_Harmonizing_Autoregression_and_Rectified_Flow_for_Unified_Multimodal_Understanding_CVPR_2025_paper.html>
- Bai, S. et al. (2025). *Qwen3-VL Technical Report*. <https://arxiv.org/abs/2511.21631> — 視覚と言語の統合例。
- Xu, J. et al. (2025). *Qwen3-Omni Technical Report*. <https://arxiv.org/abs/2509.17765> — 音声の入出力を含む統合例。
- Qwen Team (2026). *Qwen-Image-2.1: Official Repository*. <https://github.com/QwenLM/Qwen-Image-2.1> — 条件理解と画像生成の分業例。

## 世界モデル・エージェント

- Hafner, D. et al. (2019). *Learning Latent Dynamics for Planning from Pixels*（PlaNet）. <https://planetrl.github.io/>
- Bruce, J. et al. (ICML 2024). *Genie: Generative Interactive Environments*. <https://proceedings.mlr.press/v235/bruce24a.html>
- Hafner, D. et al. (Nature 2025). *Mastering diverse control tasks through world models*（DreamerV3）. <https://www.nature.com/articles/s41586-025-08744-2>
- Assran, M. et al. (2025). *V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning*. <https://ai.meta.com/research/publications/v-jepa-2-self-supervised-video-models-enable-understanding-prediction-and-planning/>
- Google DeepMind (2025). *Genie 3: A new frontier for world models*. <https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/>
- Google DeepMind (2025). *Gemini Robotics brings AI into the physical world*. <https://deepmind.google/blog/gemini-robotics-brings-ai-into-the-physical-world/>

## Commonplaceの既存記事

- [Deep Learningのパラダイムシフト](../deep-learning-paradigm-shifts/)
- [表現学習という転換](../deep-learning-paradigm-shifts/02-representation-learning.md)
- [多様体仮説と非線形幾何変換](../deep-learning-paradigm-shifts/03-manifold-geometric.md)
- [Residual StreamとComputational Branch](../deep-learning-paradigm-shifts/06-residual-stream.md)
- [誤差逆伝播はなぜ革命的なのか？](../../computer-science-theory/mathematics-of-computing/03-math-foundations-ai-backprop.md)

## AI利用に関する注記

本稿はAIによる資料調査、構成、改稿の支援を用いて作成された。対象文献の実験条件を新たに再現した記事ではない。提案した小規模実験は**未実施**。公開前には著者による事実確認と本文の校正が必要である。
