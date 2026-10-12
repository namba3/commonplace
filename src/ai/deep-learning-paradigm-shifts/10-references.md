# 参考文献と関連資料

本書は独自の整理・解釈を含む。各文献は、対応する技術・主張を検討するための**一次資料・レビュー**であり、本書の哲学的な結論を一括して証明するものではない。

## 従来の機械学習

- Quinlan, J. R. (1986). [*Induction of Decision Trees*](https://doi.org/10.1007/BF00116251). *Machine Learning*. — 決定木による帰納学習。
- Cortes, C., & Vapnik, V. (1995). [*Support-Vector Networks*](https://doi.org/10.1007/BF00994018). *Machine Learning*. — SVMと高次元特徴空間。
- Pearl, J. (1988). [*Probabilistic Reasoning in Intelligent Systems*](https://doi.org/10.1016/C2009-0-27609-4). — ベイジアンネットワークと確率推論。
- Breiman, L. (2001). [*Random Forests*](https://doi.org/10.1023/A:1010933404324). *Machine Learning*. — 決定木の集約。
- Friedman, J. H. (2001). [*Greedy Function Approximation: A Gradient Boosting Machine*](https://doi.org/10.1214/aos/1013203451). *The Annals of Statistics*. — 損失関数の勾配に基づく逐次的な関数近似。
- Chen, T., & Guestrin, C. (2016). [*XGBoost: A Scalable Tree Boosting System*](https://arxiv.org/abs/1603.02754). *KDD*. — 大規模GBDT。
- Gorishniy, Y. et al. (2021). [*Revisiting Deep Learning Models for Tabular Data*](https://arxiv.org/abs/2106.11959). *NeurIPS*. — 表形式データにおけるDLとGBDTの比較。

## 表現学習・多様体

- Bengio, Y., Courville, A., & Vincent, P. (2013). [*Representation Learning: A Review and New Perspectives*](https://arxiv.org/abs/1206.5538). *IEEE TPAMI*. — 表現学習のレビュー。
- LeCun, Y., Bengio, Y., & Hinton, G. (2015). [*Deep learning*](https://www.nature.com/articles/nature14539). *Nature*. — 深層学習の概観。
- Pope, P. et al. (2021). [*The Intrinsic Dimension of Images and Its Impact on Learning*](https://arxiv.org/abs/2104.08894). *ICLR*. — 画像の内在次元。
- Cohen, U. et al. (2020). [*Separability and geometry of object manifolds in deep neural networks*](https://doi.org/10.1038/s41467-020-14578-5). *Nature Communications*. — 物体多様体の幾何。
- Alain, G., & Bengio, Y. (2014). [*What Regularized Auto-Encoders Learn from the Data-Generating Distribution*](https://jmlr.org/papers/v15/alain14a.html). *JMLR*. — 局所的なデータ構造。
- Jacot, A., Gabriel, F., & Hongler, C. (2018). [*Neural Tangent Kernel: Convergence and Generalization in Neural Networks*](https://papers.neurips.cc/paper_files/paper/2018/hash/5a4be1fa34e62bb8a6ec6b91d2462f5a-Abstract.html). *NeurIPS*. — 深いネットワークとカーネル法の接続。
- Chizat, L., Oyallon, E., & Bach, F. (2019). [*On Lazy Training in Differentiable Programming*](https://arxiv.org/abs/1812.07956). *NeurIPS*. — 初期値周辺の線形化と学習領域。
- Yang, G., & Hu, E. J. (2021). [*Tensor Programs IV: Feature Learning in Infinite-Width Neural Networks*](https://proceedings.mlr.press/v139/yang21c.html). *ICML*. — 特徴学習とカーネル的学習の違い。

## CNN・RNN・Residual

- Rumelhart, D. E., Hinton, G. E., & Williams, R. J. (1986). [*Learning representations by back-propagating errors*](https://doi.org/10.1038/323533a0). *Nature*. — 逆伝播による中間表現の学習。
- LeCun, Y. et al. (1989). [*Backpropagation Applied to Handwritten Zip Code Recognition*](https://direct.mit.edu/neco/article/1/4/541/5515/Backpropagation-Applied-to-Handwritten-Zip-Code). *Neural Computation*. — 画像から分類までの共同学習。
- Hochreiter, S., & Schmidhuber, J. (1997). [*Long Short-Term Memory*](https://direct.mit.edu/neco/article/9/8/1735/6109/Long-Short-Term-Memory). *Neural Computation*. — 長期状態を扱うRNN。
- Krizhevsky, A. et al. (2012). [*ImageNet Classification with Deep Convolutional Neural Networks*](https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html). *NeurIPS*. — AlexNet。
- Sutskever, I., Vinyals, O., & Le, Q. V. (2014). [*Sequence to Sequence Learning with Neural Networks*](https://arxiv.org/abs/1409.3215). *NeurIPS*. — RNNによる系列変換。
- Bahdanau, D., Cho, K., & Bengio, Y. (2014/2015). [*Neural Machine Translation by Jointly Learning to Align and Translate*](https://arxiv.org/abs/1409.0473). — RNNベースのAttention。
- He, K. et al. (2016). [*Deep Residual Learning for Image Recognition*](https://arxiv.org/abs/1512.03385). *CVPR*. — ResNet。
- He, K. et al. (2016). [*Identity Mappings in Deep Residual Networks*](https://arxiv.org/abs/1603.05027). *ECCV*. — Identity経路とPre-activationの解析。

## Transformer・現代的構造

- Vaswani, A. et al. (2017). [*Attention Is All You Need*](https://arxiv.org/abs/1706.03762). *NeurIPS*. — 原型Transformer。
- Devlin, J. et al. (2019). [*BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding*](https://arxiv.org/abs/1810.04805). *NAACL*. — 双方向表現学習。
- Xiong, R. et al. (2020). [*On Layer Normalization in the Transformer Architecture*](https://proceedings.mlr.press/v119/xiong20b.html). *ICML*. — Pre-Norm/Post-Norm。
- Elhage, N. et al. (2021). [*A Mathematical Framework for Transformer Circuits*](https://transformer-circuits.pub/2021/framework/index.html). — Residual StreamとQK/OVの解析。
- Dosovitskiy, A. et al. (2021). [*An Image is Worth 16x16 Words*](https://arxiv.org/abs/2010.11929). *ICLR*. — Vision Transformer。
- Zhang, B., & Sennrich, R. (2019). [*Root Mean Square Layer Normalization*](https://arxiv.org/abs/1910.07467). — RMSNorm。
- Su, J. et al. (2021/2024). [*RoFormer: Enhanced Transformer with Rotary Position Embedding*](https://arxiv.org/abs/2104.09864). — RoPE。
- Shazeer, N. (2020). [*GLU Variants Improve Transformer*](https://arxiv.org/abs/2002.05202). — FFNのゲート変種。
- Dao, T. et al. (2022). [*FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness*](https://papers.neurips.cc/paper_files/paper/2022/hash/67d57c32e20fd0a7a302cb81d36e40d5-Abstract-Conference.html). *NeurIPS*. — AttentionのI/O効率化。
- Ainslie, J. et al. (2023). [*GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints*](https://aclanthology.org/2023.emnlp-main.298/). *EMNLP*. — Grouped Query Attention。
- Peebles, W., & Xie, S. (2023). [*Scalable Diffusion Models with Transformers*](https://openaccess.thecvf.com/content/ICCV2023/html/Peebles_Scalable_Diffusion_Models_with_Transformers_ICCV_2023_paper.html). *ICCV*. — DiTとadaLN-Zero。

## 暗記と生成モデル

- Carlini, N. et al. (2021). [*Extracting Training Data from Large Language Models*](https://www.usenix.org/conference/usenixsecurity21/presentation/carlini-extracting). *USENIX Security*. — 訓練データの抽出。
- Lipman, Y. et al. (2023). [*Flow Matching for Generative Modeling*](https://arxiv.org/abs/2210.02747). *ICLR*. — ベクトル場を学習する生成モデル。

---

[← 総括](09-synthesis.md) ｜ [シリーズ目次](./)
