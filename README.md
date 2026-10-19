# llm-knowledge-editing

Working files for a course reproduction of Jiang et al., "Learning to Edit: Aligning LLMs with Knowledge Editing" (ACL 2024). The cleaned release, with code, results, the trained adapter, and the report source, is **[lte-reproducibility](https://github.com/Tajaddin/lte-reproducibility)**. Start there. This repository is archived.

Authors: Marvin Osei-Kuffour and Tajaddin Gafarov. CAI 5335, Introduction to Large Language Models, University of South Florida, Spring 2026.

## Setup

- Backbone: LLaMA-2-Chat-7B.
- Compute: one Google Colab A100 (40 GB). LTE-LoRA trained for one epoch at sequence length 1024, against the paper's three epochs at 2048.
- Evaluation: EasyEdit on ZsRE and WikiData counterfact, 200 examples per aspect.
- ROME was not run. ROME numbers in our tables come from the paper.

## Headline results (LTE-LoRA)

| Metric | Ours, ZsRE | Paper, ZsRE | Ours, counterfact | Paper, counterfact |
|---|---:|---:|---:|---:|
| Edit success | 65.38 | 99.9 | 90.31 | 99.9 |
| Portability (average) | 65.31 | 57.0 | 58.14 | 46.1 |
| Locality (average) | 59.09 | 100.0 | 64.39 | 100.0 |

Full tables, the ICE baseline, and the LLaMA-3 extension are in lte-reproducibility.

## What is here

- `PersonB_Deliverables/`: the team plan (`4-DAY-PLAN.md`) assigned baselines to Person A (Marvin) and LTE-LoRA training to Person B (Tajaddin). This folder holds the Person B outputs: an earlier draft of the report (`Reproducibility_LTE.pdf`), aggregated results, raw EasyEdit outputs, and the adapter config.
- `LTE/`: a copy of the upstream code ([YJiangcm/LTE](https://github.com/YJiangcm/LTE)) with its vendored EasyEdit and Qwen code, plus our Colab notebooks.
- Slides, the project proposal, and the planning doc.

## Inherited upstream security caveats

The vendored EasyEdit code uses `eval()` in `LTE/SeqEdit/easyeditor/models/grace/GRACE.py` and `pickle.load` at four sites without integrity checks. Do not run the IKE method or the BLIP2 trainer on files you did not generate. The vendored Qwen GSM8K evaluators were switched from `eval()` to `ast.literal_eval`.

## References

- Jiang et al., Learning to Edit: Aligning LLMs with Knowledge Editing, ACL 2024. https://aclanthology.org/2024.acl-long.258/
- Meng et al., Locating and Editing Factual Associations in GPT, NeurIPS 2022 (ROME).
- EasyEdit framework, https://github.com/zjunlp/EasyEdit
