# LLM Knowledge Editing — Reproducibility Study

Reproducibility study of **"Learning to Edit: Aligning LLMs with Knowledge Editing"** (ACL 2024), benchmarking three knowledge editing methods on LLaMA2-Chat-7B across two datasets.

**Course:** CAI 6335 — Large Language Models (Graduate), University of South Florida, Spring 2025  
**Authors:** Tajaddin Gafarov, Marvin [Partner]

## What is Knowledge Editing?

Large language models encode world knowledge in their weights during training. Knowledge editing methods update specific facts in a model's weights *without full retraining* — for example, changing "The president of France is X" to "The president of France is Y" while leaving everything else intact.

## Methods Benchmarked

| Method | Type | Description |
|--------|------|-------------|
| **LTE-LoRA** | Fine-tuning | The paper's proposed method — trains a LoRA adapter that learns *how* to absorb edits, then applies new knowledge at inference via a memory bank |
| **ROME** | Locate-and-edit | Identifies the MLP layer storing a fact and directly patches the weight matrix |
| **ICE** | In-context | Injects the new fact as a retrieved context at inference time (no weight modification) |

## Evaluation Metrics

- **Edit Success** — does the model correctly answer the edited fact?
- **Portability** — does the edit generalize to rephrased or related questions?
- **Locality** — does the edit leave unrelated facts unchanged?
- **Fluency** — does the model still produce grammatical, coherent text after editing?

## Datasets

| Dataset | Description |
|---------|-------------|
| **ZsRE** | Zero-shot relation extraction — fact edits in question-answering format |
| **WikiData_cf** | CounterFact — factual edits designed to be counterfactual to Wikipedia |

Both datasets are loaded via the [EasyEdit](https://github.com/zjunlp/EasyEdit) framework.

## Repository Structure

```
PPD/
├── LTE/
│   ├── LTE_Final_Colab.ipynb        # Full evaluation pipeline (LTE-LoRA + baselines)
│   ├── LTE_LoRA_Training_Colab.ipynb # LTE-LoRA alignment training on Colab A100
│   ├── EasyEdit/                     # EasyEdit framework (ROME, ICE, dataset loaders)
│   │   ├── create_train_data.ipynb   # LTE alignment data preparation
│   │   └── data/                     # ZsRE, CounterFact, WikiBio datasets
│   ├── data/
│   │   └── LTE_train_data.json       # Alignment training data (ZsRE + Ripple + WikiBio)
│   └── FastChat/                     # FastChat for LLaMA2-Chat conversation format
├── LTE_Presentation_Final.pptx       # Final presentation slides
└── README.md
```

## Setup & Reproduction

### Environment

```bash
pip install easyedit peft bitsandbytes transformers datasets accelerate
```

Requires a GPU with ≥16GB VRAM for LTE-LoRA training (A100 recommended). ICE and ROME evaluation can run on smaller GPUs with 4-bit quantization.

### LTE-LoRA Training

Open `LTE/LTE_LoRA_Training_Colab.ipynb` in Google Colab (A100 runtime):

```python
# Load LLaMA2-Chat-7B with 4-bit QLoRA
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-chat-hf",
    load_in_4bit=True,
    device_map="auto"
)
# Train the alignment LoRA adapter
trainer.train()
```

Training takes 4–8 hours on an A100. A pre-trained checkpoint from the original authors can be used to skip training.

### Evaluation

Open `LTE/LTE_Final_Colab.ipynb` and run all cells. The notebook runs all three methods on both datasets and outputs a results table matching Table 1 of the original paper.

### ICE / ROME Baselines Only

```python
from easyeditor import BaseEditor, ROMEHyperParams, IKEHyperParams

# ROME
hparams = ROMEHyperParams.from_hparams('hparams/ROME/llama-7b.yaml')
editor = BaseEditor.from_hparams(hparams)
metrics, edited_model, _ = editor.edit(prompts=..., target_new=..., subject=...)

# ICE (in-context)
hparams = IKEHyperParams.from_hparams('hparams/IKE/llama-7b.yaml')
```

## Key Findings

- **LTE-LoRA** achieves the highest edit success and portability among the three methods, consistent with the original paper
- **ROME** shows strong edit success but lower locality — editing one fact can affect related facts
- **ICE** has perfect locality (no weight changes) but lower portability on rephrased questions
- Hardware differences (RTX consumer GPU vs. paper's A100 setup) cause minor metric divergence, documented in the analysis

## References

- Yao, Y., et al. "Learning to Edit: Aligning LLMs with Knowledge Editing." ACL 2024. [[paper]](https://aclanthology.org/2024.acl-long.258/)
- Meng, K., et al. "Locating and Editing Factual Associations in GPT." NeurIPS 2022 (ROME).
- Zheng, C., et al. "Can We Edit Factual Knowledge by In-Context Learning?" EMNLP 2023 (ICE).
- EasyEdit framework: [[GitHub]](https://github.com/zjunlp/EasyEdit)
