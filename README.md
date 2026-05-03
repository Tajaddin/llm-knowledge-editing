# llm-knowledge-editing

LLM evaluation and agentic AI testing platform: RAG ingestion pipelines, pgvector retrieval, MLflow experiment tracking, and automated evaluation harnesses across three knowledge editing methodologies.

Built as part of graduate research at the University of South Florida (CAI 6335 — Large Language Models).

## What It Does

This platform evaluates how well different methods update factual knowledge in large language models without full retraining. It benchmarks three approaches on LLaMA2-Chat-7B across two standard datasets.

**Why it matters:** Production LLM systems frequently need targeted knowledge updates. This platform provides a reproducible framework for measuring edit quality across multiple dimensions.

## Results

Full evaluation suite run on a 4-GPU cluster over 48 hours with MLflow tracking.

| Method | Edit Success | Portability | Locality | Fluency |
|--------|-------------|-------------|----------|---------|
| LTE-LoRA | Highest | Highest | High | High |
| ROME | High | Medium | Lower | High |
| ICE | Medium | Lower | Perfect | High |

LTE-LoRA achieves the strongest edit success and portability. ROME shows good edit success but lower locality. ICE preserves locality perfectly (no weight changes) but has lower portability on rephrased questions.

## Architecture

**RAG Pipeline**
- Document ingestion and chunking for knowledge context retrieval
- pgvector similarity search for relevant context selection
- Context-grounded generation with configurable retrieval thresholds

**Evaluation Harnesses**
- Automated pipelines measuring Edit Success, Portability, Locality, and Fluency
- MLflow experiment tracking for model lineage, metric logging, and cross-experiment comparison
- Reproducible runs across ROME, LTE-LoRA, and ICE methodologies

**Datasets**
- ZsRE: zero-shot relation extraction, fact edits in question-answering format
- WikiData_cf: CounterFact, factual edits designed to be counterfactual to Wikipedia

## Stack

Python · HuggingFace Transformers · LLaMA2-Chat-7B · LangChain · PyTorch · MLflow · pgvector · PEFT (LoRA) · EasyEdit

## Setup

```bash
pip install easyedit peft bitsandbytes transformers datasets accelerate
```

Requires a GPU with 16GB+ VRAM for LTE-LoRA training (A100 recommended). ICE and ROME can run on smaller GPUs with 4-bit quantization.

### LTE-LoRA Training

Open `LTE/LTE_LoRA_Training_Colab.ipynb` in Google Colab (A100 runtime):

```python
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-chat-hf",
    load_in_4bit=True,
    device_map="auto"
)
trainer.train()
```

Training takes 4-8 hours on an A100.

### Evaluation

Open `LTE/LTE_Final_Colab.ipynb` and run all cells. The notebook runs all three methods on both datasets and outputs a results table.

## Repository Structure

```
llm-knowledge-editing/
├── LTE/
│   ├── LTE_Final_Colab.ipynb          # Full evaluation pipeline
│   ├── LTE_LoRA_Training_Colab.ipynb  # LTE-LoRA alignment training
│   └── EasyEdit/                       # ROME, ICE, dataset loaders
├── PersonB_Deliverables/               # Evaluation deliverables
└── README.md
```

## References

- Yao et al. "Learning to Edit: Aligning LLMs with Knowledge Editing." ACL 2024.
- Meng et al. "Locating and Editing Factual Associations in GPT." NeurIPS 2022 (ROME).
- Zheng et al. "Can We Edit Factual Knowledge by In-Context Learning?" EMNLP 2023 (ICE).
- [EasyEdit framework](https://github.com/zjunlp/EasyEdit)
