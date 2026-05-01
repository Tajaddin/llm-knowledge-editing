# Person B — Final Deliverables

You're done with the heavy lifting. Training finished, evaluation finished, numbers are populated.

## What to submit (the FINAL_ files)

| File | What it contains |
|---|---|
| **`FINAL_Table1_Replica.xlsx`** | Spreadsheet with your real LTE-LoRA numbers in the OURS row (green-highlighted). Person A still needs to add ICE and ROME rows; you still need to transcribe paper numbers from arXiv:2402.11905v2 Table 1. |
| **`FINAL_Day4_Gap_Analysis.docx`** | Pre-written gap analysis with your real numbers, real training notes (5h 49m, 469 steps, loss 1.05), real eval setup (200 ex/aspect), and the actual divergence pattern explained. Just needs the paper numbers filled in for the Δ column and any final edits to your taste. |

## Your measured results (LTE-LoRA on LLaMA-2-Chat-7B)

**ZsRE** (200 examples per aspect):
- Edit Success: **65.38**
- Portability — Reasoning: 62.42
- Portability — Subject Aliasing: 56.69
- Portability — Logical Generalization: **76.81** *(actually higher than paper)*
- Locality — Relation Specificity: 59.09
- Fluency: **584.30** *(matches paper range)*

**WikiData_counterfact** (200 examples per aspect):
- Edit Success: **90.31** *(within ~10 pts of paper)*
- Portability — Reasoning: 41.06
- Portability — Subject Aliasing: 82.62
- Portability — Logical Generalization: 50.74
- Locality — Relation Specificity: 63.75
- Locality — Forgetfulness: 65.03
- Fluency: **599.27** *(matches paper range)*

**The story:** Fluency matches the paper exactly (LoRA preserves linguistic ability). Counterfact Edit Success is close to paper (90 vs 99). ZsRE Edit Success and most Portability metrics are 20–40 points below the paper, attributable to undertraining (1 epoch instead of 3, sequence length 1024 instead of 2048, due to a single Colab session budget).

## What still needs doing

1. **Paper numbers.** Open arXiv:2402.11905v2, find Table 1 on page 6, find the LTE-LoRA / LLaMA-2-Chat-7B rows for ZsRE and WikiData_counterfact. Type those numbers into:
   - `FINAL_Table1_Replica.xlsx` → Sheet 1 → row 8 (PAPER — LTE-LoRA)
   - `FINAL_Day4_Gap_Analysis.docx` → tables 3.1 and 3.2 → "Paper" column
   The Δ row in the spreadsheet will auto-compute once both rows have numbers.

2. **Person A's numbers.** When Person A finishes their ICE and ROME baseline runs, they paste those into rows 9 and 10 of the spreadsheet (and the "ICE (ours)" and "ROME (ours)" columns of the docx tables — but you may need to extend the docx tables since I only built the LTE-LoRA column).

3. **Final read-through of the docx.** Sections 4, 5, 6, 8 are written based on your actual results pattern. Skim and adjust the language to your voice if needed.

## Folder inventory

| File | Purpose |
|---|---|
| `FINAL_Table1_Replica.xlsx` | **What you submit** — spreadsheet |
| `FINAL_Day4_Gap_Analysis.docx` | **What you submit** — gap analysis writeup |
| `Table1_Replica.xlsx` | Earlier blank version (kept for reference) |
| `Day4_Gap_Analysis_Template.docx` | Earlier placeholder version (kept for reference) |
| `ALL_IN_ONE_Colab.ipynb` | The training+eval notebook with all patches baked in. Useful if you ever need to re-run. |
| `LTE_checkpoints-…/` | Your trained adapter + intermediate checkpoints + raw eval JSONs (downloaded from Drive). |
| `build_gap_analysis.js`, `build_final_gap_analysis.js` | Source scripts for the docx files. Ignore unless regenerating. |
| `README_PersonB.md` | This file. |

## Numbers provenance

All measured numbers come from `LTE_checkpoints-…/LTE_checkpoints/results/lte_lora_results.json`, which was aggregated by Cell 11 of `ALL_IN_ONE_Colab.ipynb` from the 9 raw JSON files in the same folder (4 ZsRE aspects + 5 counterfact aspects, computed by `EasyEdit/run_knowedit.py --editing_method=IKE`).

Training provenance: 469 steps, 1 epoch, eff. batch 128, lr 3e-4 cosine, bf16, A100-SXM4-40GB, 5h 49m wall time, final train loss 1.05.

Evaluation provenance: 200-example random subsample per aspect, IKE editing method (which is what EasyEdit calls LTE inference when configured with a LoRA-aligned model), all-MiniLM-L6-v2 retrieval encoder.
