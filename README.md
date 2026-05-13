# llm-knowledge-editing

Reproducibility study of three LLM knowledge editing methods on LLaMA-2-Chat-7B. ROME, LTE-LoRA, and ICE benchmarked across ZsRE and Wiki-CounterFact on a 4-GPU cluster with MLflow tracking.

Coursework for CAI 6335 (Large Language Models) at the University of South Florida. 12-page reproducibility report included.

## Hero numbers

LTE-LoRA, LLaMA-2-Chat-7B, 1 epoch, model_max_length=1024 (trimmed from the paper to fit a class compute budget). Real numbers from `PersonB_Deliverables/lte_lora_results.json`.

### Wiki-CounterFact

| Metric | Score |
|---|---|
| Edit Success | 90.31 |
| Portability, Subject Aliasing | 82.62 |
| Locality, Forgetfulness | 65.03 |
| Locality, Relation Specificity | 63.75 |
| Portability, Logical Generalization | 50.74 |
| Portability, Reasoning | 41.06 |
| Fluency | 599.27 |

### ZsRE

| Metric | Score |
|---|---|
| Portability, Logical Generalization | 76.81 |
| Edit Success | 65.38 |
| Portability, Reasoning | 62.42 |
| Locality, Relation Specificity | 59.09 |
| Portability, Subject Aliasing | 56.69 |
| Fluency | 584.3 |

### Findings vs the paper

Three discrepancies vs Yao et al. ACL 2024:

1. Edit Success on ZsRE comes in 18 to 22 points below the paper. Compute-trimmed training (1 epoch, shorter context) is the dominant factor.
2. Locality on Wiki-CounterFact tracks the paper closely. Edit precision survives the training cut.
3. Portability splits cleanly. Logical Generalization holds, Reasoning lags. Reasoning needs the full training schedule.

Full discussion in `PersonB_Deliverables/Reproducibility_LTE.pdf`.

## What runs

Three methods, two datasets, one backbone.

| Method | Type | What it changes |
|---|---|---|
| ROME | Direct weight edit | Targeted MLP layer rank-one update |
| LTE-LoRA | LoRA adapter | Trained adapter aligns the model to edit instructions |
| ICE | In-context | No weight change, edit injected into the prompt |

Datasets: ZsRE (zero-shot relation QA), Wiki-CounterFact (counterfactual edits).

Metrics: Edit Success, Portability (Logical Generalization, Reasoning, Subject Aliasing), Locality (Forgetfulness, Relation Specificity), Fluency.

## Stack

Python, HuggingFace Transformers, LLaMA-2-Chat-7B, PyTorch, PEFT (LoRA), bitsandbytes 4-bit quantization, MLflow, EasyEdit framework.

## Reproduce

LTE-LoRA training, A100 with 40GB VRAM, runs 4 to 8 hours:

```
pip install easyedit peft bitsandbytes transformers datasets accelerate mlflow
```

Open `LTE/LTE_LoRA_Training_Colab.ipynb` in Colab and select an A100 runtime. The notebook loads LLaMA-2-Chat-7B in 4-bit, trains the LoRA adapter, and writes the trained weights to `output_lte_lora_llama-2_7b_chat/`.

Evaluation across all three methods, both datasets:

Open `LTE/LTE_Final_Colab.ipynb` and run all cells. The notebook outputs per-method per-dataset tables.

ROME and ICE run on a single 16GB GPU with 4-bit quantization. LTE-LoRA training wants A100.

## Repository layout

```
llm-knowledge-editing/
  LTE/
    LTE_Final_Colab.ipynb           Full eval across ROME, LTE-LoRA, ICE
    LTE_LoRA_Training_Colab.ipynb   LoRA adapter training
    EasyEdit/                       ROME, ICE, dataset loaders
  PersonB_Deliverables/
    Reproducibility_LTE.pdf         12-page write-up with paper comparison
    lte_lora_results.json           Raw eval numbers
    Table1_Replica.xlsx             Side-by-side reproduction table
    results/                        Per-run logs
  4-DAY-PLAN.md                     Project planning doc
```

## Known limitations

1. Single epoch on LTE-LoRA. The paper trains longer. Expect a 15 to 20 point Edit Success gap on ZsRE.
2. Context trimmed to 1024 tokens. Longer multi-hop edits lose context the paper preserves.
3. Single backbone. The paper covers LLaMA-2, Mistral, Qwen. Reproduction stops at LLaMA-2-Chat-7B.
4. No human eval. All scores come from automated metrics on EasyEdit's default test sets.

## References

- Yao et al., Learning to Edit: Aligning LLMs with Knowledge Editing, ACL 2024
- Meng et al., Locating and Editing Factual Associations in GPT, NeurIPS 2022 (ROME)
- Zheng et al., Can We Edit Factual Knowledge by In-Context Learning, EMNLP 2023 (ICE)
- EasyEdit framework, https://github.com/zjunlp/EasyEdit
