# 参考文献・一次資料

作成日：2026-11-15 / 更新日：2026-11-15

本記事の主たる一次資料は2017年のCycleGAN情報隠蔽論文である。その他の文献は背景・理論・現代への接続を補うものであり、個別の研究で観察された現象を相互に同一視しない。

## 中心となる論文

1. **Chu, C., Zhmoginov, A., & Sandler, M. (2017).** *CycleGAN, a Master of Steganography.* NeurIPS 2017 Workshop on Machine Deception. [arXiv:1712.02950v2](https://arxiv.org/abs/1712.02950v2) / [HTML本文](https://arxiv.org/html/1712.02950v2) / [PDF](https://arxiv.org/pdf/1712.02950)。
   - 第1章：Figure 1–2（元画像・生成地図・再構成、細かな信号の可視化）。
   - 第3章：§3、Figure 3–4（ノイズ感度、JPEG、非局所性）。
   - 第5章：§4、Figure 5（復元器に対する敵対的入力）。
   - 第4・6章：§5（情報量の非対称性、設計上の含意）。
2. **Google Research (2017).** *CycleGAN, a Master of Steganography.* [公式研究紹介](https://research.google/pubs/cyclegan-a-master-of-steganography/)。著者と発表形態の確認に使用。
3. **Zhu, J.-Y., Park, T., Isola, P., & Efros, A. A. (2017).** *Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Networks.* ICCV 2017. [arXiv:1703.10593](https://arxiv.org/abs/1703.10593) / [公式実装](https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix)。CycleGANの構成・損失関数の背景。

## 後続研究と現代への接続

4. **Porav, H., Musat, V., & Newman, P. (2019).** *Reducing Steganography In Cycle-consistency GANs.* CVPR Workshops 2019. [CVF Open Access（論文PDF）](https://openaccess.thecvf.com/content_CVPRW_2019/papers/Vision%20for%20All%20Seasons%20Bad%20Weather%20and%20Nighttime/Porav_Reducing_Steganography_In_Cycle-consistency_GANs_CVPRW_2019_paper.pdf)。昼夜変換におけるデノイザを介した情報隠蔽の抑制。
5. **Löhdefink, J., & Fingscheidt, T. (2022).** *Improving Performance of Semantic Segmentation CycleGANs by Noise Injection into the Latent Segmentation Space.* [arXiv:2201.06415](https://arxiv.org/abs/2201.06415)。セグメンテーション空間へのガウスノイズ・量子化ノイズ注入による情報隠蔽抑制と下流評価。
6. **Utz, J., et al. (2023).** *Focus on Content not Noise: Improving Image Generation for Nuclei Segmentation by Suppressing Steganography in CycleGAN.* ICCV Workshops 2023. [arXiv:2308.01769](https://arxiv.org/abs/2308.01769) / [CVF Open Access（論文PDF）](https://openaccess.thecvf.com/content/ICCV2023W/BIC/papers/Utz_Focus_on_Content_not_Noise_Improving_Image_Generation_for_Nuclei_ICCVW_2023_paper.pdf)。医用画像合成におけるDCTフィルタと下流タスクの実験。
7. **Wu, S., et al. (2024).** *StegoGAN: Leveraging Steganography for Non-Bijective Image-to-Image Translation.* CVPR 2024, pp. 7922–7931. [arXiv:2403.20142](https://arxiv.org/abs/2403.20142) / [CVF Open Access](https://openaccess.thecvf.com/content/CVPR2024/html/Wu_StegoGAN_Leveraging_Steganography_for_Non-Bijective_Image-to-Image_Translation_CVPR_2024_paper.html) / [著者コード](https://github.com/sian-wusidi/StegoGAN)。非全単射変換で、対応しない情報を特徴空間の明示的な経路に置き、意味整合性を高める方向を提案。

## 理論と関連する研究

8. **Geirhos, R., et al. (2020).** *Shortcut learning in deep neural networks.* Nature Machine Intelligence 2, 665–673. [論文](https://www.nature.com/articles/s42256-020-00257-z) / [arXiv:2004.07780](https://arxiv.org/abs/2004.07780)。標準的な評価に最適化される近道の学習に関する整理。
9. **Krakovna, V., et al. (2020).** *Specification gaming: the flip side of AI ingenuity.* Google DeepMind. [解説](https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/)。明示された仕様と意図された結果の乖離を示す事例集。
10. **Anthropic (2024).** *Sycophancy to subterfuge: Investigating reward tampering in language models.* [研究紹介](https://www.anthropic.com/research/reward-tampering)。特別に設定した実験環境での仕様逸脱の研究。CycleGANの現象とは独立に扱う。
11. **Zhang, R., Isola, P., Efros, A. A., Shechtman, E., & Wang, O. (2018).** *The Unreasonable Effectiveness of Deep Features as a Perceptual Metric.* CVPR 2018. [arXiv:1801.03924](https://arxiv.org/abs/1801.03924)。第6章の知覚品質と意味的整合性を独立評価する際に参照するLPIPSの原論文。

## 読者向け補足

- 原論文の図を記事に直接転載する場合、原著作物の利用条件を別途確認する必要がある。本草案は図の転載を避け、原論文へのリンクと独自のMermaid模式図で説明している。
- 本稿の情報理論による定式化と現代のLLM・エージェントとの比較は、研究結果を読み解くための**本稿の考察**を含む。数式や解釈を、原著者の実証結果として引用しない。

[記事トップに戻る](./)
