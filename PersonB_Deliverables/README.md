# Reproducibility: Learning to Edit — Aligning LLMs with Knowledge Editing

A reproduction of [Jiang et al. 2024, "Learning to Edit"](https://aclanthology.org/2024.acl-long.258/) (ACL 2024) for **CAI 5335 / CIS 4930 — Introduction to Large Language Models**, University of South Florida.

**Authors:** Marvin Osei-Kuffour, Tajaddin Gafarov

## What's in this repository

| File | Purpose |
|---|---|
| `Reproducibility_LTE.pdf` | Final 8-page report (ACL format), submission deliverable |
| `Reproducibility_LTE.tex` | LaTeX source for the report |
| `references.bib` | Bibliography for the report |
| `ALL_IN_ONE_Colab.ipynb` | One-click Colab notebook: train + evaluate + aggregate metrics |
| `lte_lora_results.json` | Aggregated LTE-LoRA evaluation numbers (the headline output) |
| `results/IKE_*_results.json` | Raw per-aspect EasyEdit evaluation outputs (9 files) |
| `output_lte_lora_llama-2_7b_chat/` | Trained LoRA adapter (16.8 MB safetensors + config) |
| `Table1_Replica.xlsx` | Spreadsheet matching paper Table 1 with our numbers filled in |

## How to reproduce our results

### Quick path (use our trained adapter, ~1.5 hours of A100)

If you only want to verify our evaluation numbers without re-training:

1. Open `ALL_IN_ONE_Colab.ipynb` in [Google Colab](https://colab.research.google.com/).
2. **Runtime → Change runtime type → A100 GPU**.
3. Run **Cells 1–4** (environment setup, ~3 minutes).
4. Skip Cell 5 (training).
5. Manually download `output_lte_lora_llama-2_7b_chat/` from this repo into `/content/LTE/` in the Colab runtime, OR mount Google Drive if you have the adapter saved there.
6. Run **Cells 7–12** (sanity check, evaluation, aggregation).

Final output: `lte_lora_results.json` containing the 13 metric values reported in our paper Tables 1 and 2.

### Full path (train + evaluate from scratch, ~10 hours of A100)

1. Open `ALL_IN_ONE_Colab.ipynb` in Colab. Set runtime to A100.
2. **Runtime → Run all**. The notebook will:
   - Install dependencies (Cell 2)
   - Clone the LTE repo, download SFT training data, apply 7 compatibility patches (Cell 3)
   - Pre-download LLaMA-2-Chat-7B (Cell 4)
   - Train LTE-LoRA for 1 epoch at sequence length 1024 (Cell 5, ~6 hr)
   - Save adapter to Drive (Cell 6)
   - Run sanity check (Cell 7)
   - Evaluate on ZsRE 4 aspects + counterfact 5 aspects, 200 examples each (Cells 9–10, ~3.5 hr)
   - Aggregate metrics (Cell 11) and save to Drive (Cell 12)

Total Colab Pro compute units consumed: ~50.

## Results summary

Detailed analysis is in `Reproducibility_LTE.pdf`. Headline numbers below.

### LTE-LoRA on LLaMA-2-Chat-7B

| Metric | ZsRE | WikiData_counterfact |
|---|---|---|
| Edit Success | 65.38 | **90.31** |
| Portability — Reasoning | 62.42 | 41.06 |
| Portability — Subject Aliasing | 56.69 | 82.62 |
| Portability — Logical Generalization | **76.81** | 50.74 |
| Locality — Relation Specificity | 59.09 | 63.75 |
| Locality — Forgetfulness | — | 65.03 |
| Fluency (n-gram entropy) | **584.30** | **599.27** |

Highlighted cells indicate the strongest reproductions (Fluency on both datasets matches the paper's reported range; counterfact Edit Success at 90% is within ~10 points of the paper's ~99.9%).

## Compatibility patches applied

The published LTE codebase requires seven compatibility patches to run on current `transformers` (≥ 4.46). All are applied automatically by Cell 3 of the notebook:

1. `from transformers import deepspeed` → `transformers.integrations.deepspeed`
2. `flash_attn` import made optional
3. `CPUAdamBuilder().load()` wrapped in try/except
4. `Trainer(tokenizer=…)` → `Trainer(processing_class=…)` (surgical, only the Trainer call)
5. `deepspeed.is_deepspeed_zero3_enabled()` bypassed (replaced with `False`)
6. EasyEdit `blip2_models/__init__.py` stubbed out (vision-language API drift)
7. `run_knowedit.py` `random.sample(datas, ...)` wrapped in `list()`

See Section 2 (Table 1) of `Reproducibility_LTE.pdf` for full details.

## How our setup differs from the paper

| | Paper | Ours |
|---|---|---|
| Epochs | 3 | 1 |
| `model_max_length` | 2048 | 1024 |
| Eval examples per aspect | full set (~700–1000) | 200 random subsample |
| Hardware | 4× A100 80GB | 1× A100 40GB (Colab Pro) |
| Backbones | LLaMA-2-Chat-7B + Qwen-Chat-7B | LLaMA-2-Chat-7B only |
| Benchmarks | ZsRE, WikiBio, WikiData_recent, WikiData_counterfact | ZsRE + WikiData_counterfact |

These deviations are necessitated by the Colab compute budget. Section 4 (Extension Results) of the paper quantifies which metrics are most sensitive to these reductions.

## Reproducing the report PDF

```bash
pdflatex Reproducibility_LTE.tex
bibtex Reproducibility_LTE
pdflatex Reproducibility_LTE.tex
pdflatex Reproducibility_LTE.tex
```

Requires standard `texlive-latex-extra` and `texlive-fonts-recommended`.

## Citation

If you build on this reproduction, please cite the original paper:

```bibtex
@inproceedings{jiang2024learning,
  title     = {Learning to Edit: Aligning {LLM}s with Knowledge Editing},
  author    = {Jiang, Yuxin and Wang, Yufei and Wu, Chuhan and Zhong, Wanjun
                and Zeng, Xingshan and Gao, Jiahui and Li, Liangyou and Jiang, Xin
                and Shang, Lifeng and Tang, Ruiming and Liu, Qun and Wang, Wei},
  booktitle = {Proceedings of the 62nd Annual Meeting of the ACL},
  year      = {2024},
  pages     = {4689--4705}
}
```

## Acknowledgments

We thank the LTE authors for releasing the alignment SFT training data and the EasyEdit team for the evaluation infrastructure. Compute was provided by Google Colab Pro.

## License

This reproduction (notebook, paper, scripts) is released under the MIT License. The underlying LTE codebase and data inherit the LTE authors' license; the LLaMA-2 weights inherit Meta's LLAMA 2 Community License.
