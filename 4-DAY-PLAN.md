# LTE Reproducibility — 4-Day Execution Plan

**Project:** Reproducing "Learning to Edit: Aligning LLMs with Knowledge Editing" (ACL 2024)
**Team:** Person A (Marvin) & Person B (Tajaddin)
**Backbone:** LLaMA2-Chat-7B | **Methods:** LTE-LoRA, ROME, ICE
**Datasets:** ZsRE, WikiDatacounterfact
**Metrics:** Edit Success, Portability, Locality, Fluency

---

## Visual Timeline

```
            Person A                              Person B
           (Baselines)                        (LTE-LoRA Training)
 ───────────────────────────────────────────────────────────────────
 DAY 1  ┌─────────────────────┐          ┌─────────────────────────┐
        │ Clone LTE repo      │          │ Download & format       │
        │ Install EasyEdit,   │          │ ZsRE + WikiData_cf      │
        │ PEFT, bitsandbytes  │          │ via EasyEdit/KnowEdit   │
        │ Verify 4-bit QLoRA  │          │                         │
        │ forward pass on     │          │ Download LTE alignment  │
        │ LLaMA2-Chat-7B      │          │ training data from      │
        └────────┬────────────┘          │ GitHub (ZsRE, Ripple,   │
                 │                       │ WikiBio, MQuAKE)        │
                 │                       └────────┬────────────────┘
                 └──────────┬─────────────────────┘
                       SYNC POINT
                  "Can we load the model
                   and see the data?"
 ───────────────────────────────────────────────────────────────────
 DAY 2  ┌─────────────────────┐          ┌─────────────────────────┐
        │ Run ICE on ZsRE     │          │ Start LTE-LoRA          │
        │ Run ROME on ZsRE    │          │ alignment training      │
        │ (no training needed) │          │ on Colab A100           │
        │                     │          │ (4-8 hrs)               │
        │ Record all 4 metrics│          │                         │
        │ into shared sheet   │          │ Monitor loss curve      │
        │ (match Table 1 cols)│          │ Restart if crash        │
        └────────┬────────────┘          └────────┬────────────────┘
                 │                                │
            ZsRE baselines                  Training running
              complete                      overnight OK
 ───────────────────────────────────────────────────────────────────
 DAY 3  ┌─────────────────────┐          ┌─────────────────────────┐
        │ Run ICE on           │          │ Training done           │
        │   WikiData_cf       │          │                         │
        │ Run ROME on         │          │ Run LTE-LoRA eval on    │
        │   WikiData_cf       │          │   ZsRE                  │
        │                     │          │ Run LTE-LoRA eval on    │
        │ Verify EasyEdit     │          │   WikiData_cf           │
        │ config matches      │          │                         │
        │ paper settings      │          │ Collect all 4 metrics   │
        │ (batch size, split) │          │ Check memory bank /     │
        └────────┬────────────┘          │ retrieval config        │
                 │                       └────────┬────────────────┘
                 │                                │
            All baselines                  All LTE-LoRA
              complete                     numbers in
 ───────────────────────────────────────────────────────────────────
 DAY 4  ┌─────────────────────────────────────────────────────────┐
        │                    TOGETHER                             │
        │                                                         │
        │  1. Fill partial Table 1 replica                        │
        │     (LTE-LoRA + ROME + ICE) x (ZsRE + WikiData_cf)     │
        │                                                         │
        │  2. Write gap analysis:                                 │
        │     - Where do numbers match the paper?                 │
        │     - Where do they diverge? Why?                       │
        │     - Note hardware diffs (RTX 5060 vs paper's setup)   │
        │                                                         │
        │  3. [IF TIME] LLaMA-3-8B extension                     │
        │     - Inference-only with existing LTE-LoRA checkpoint  │
        │     - No re-training needed — just swap backbone        │
        └─────────────────────────────────────────────────────────┘
```

---

## Detailed Day-by-Day Breakdown

### Day 1 — Foundations (Parallel)

| | Person A | Person B |
|---|---|---|
| **Task** | Environment setup | Data preparation |
| **Steps** | 1. `git clone https://github.com/YJiangcm/LTE` | 1. Download ZsRE via EasyEdit/KnowEdit |
| | 2. `pip install easyedit peft bitsandbytes` | 2. Download WikiDatacounterfact |
| | 3. Load LLaMA2-Chat-7B with 4-bit quantization | 3. Download LTE alignment training data from GitHub |
| | 4. Run a dummy forward pass to verify CUDA works | 4. Format data splits (ZsRE, RippleEdits, WikiBio, MQuAKE) |
| **Done when** | Model loads and produces output without OOM | All datasets load cleanly; shapes/counts match expectations |

**End-of-day sync:** Both confirm they can load the model AND see the data. Do not proceed to Day 2 until this is verified.

---

### Day 2 — Baselines + Training Starts (Parallel)

| | Person A | Person B |
|---|---|---|
| **Task** | Run baselines on ZsRE | Start LTE-LoRA alignment training |
| **Steps** | 1. Configure EasyEdit for ICE (in-context editing) | 1. Launch training on Colab A100 **first thing** |
| | 2. Run ICE on ZsRE, record 4 metrics | 2. Use exact LoRA config from repo |
| | 3. Configure EasyEdit for ROME | 3. Monitor loss curve |
| | 4. Run ROME on ZsRE, record 4 metrics | 4. If crash → restart immediately |
| | 5. Enter results in shared spreadsheet (Table 1 column order) | 5. Let it run overnight if needed |
| **Done when** | ZsRE row filled for ICE and ROME | Training running without errors |

**Shared spreadsheet format** (match Table 1 exactly):

| Method | Dataset | Edit Succ. | Portability | Locality | Fluency |
|--------|---------|-----------|-------------|----------|---------|
| ICE | ZsRE | | | | |
| ROME | ZsRE | | | | |
| ICE | WikiData_cf | | | | |
| ROME | WikiData_cf | | | | |
| LTE-LoRA | ZsRE | | | | |
| LTE-LoRA | WikiData_cf | | | | |

---

### Day 3 — Finish Baselines + LTE Eval (Parallel)

| | Person A | Person B |
|---|---|---|
| **Task** | Run baselines on WikiDatacounterfact | Evaluate trained LTE-LoRA |
| **Steps** | 1. Run ICE on WikiData_cf, record metrics | 1. Verify training completed successfully |
| | 2. Run ROME on WikiData_cf, record metrics | 2. Run LTE-LoRA eval script on ZsRE |
| | 3. Double-check EasyEdit config matches paper | 3. Run LTE-LoRA eval script on WikiData_cf |
| | (edit batch size, evaluation split) | 4. If numbers look off → check retrieval config & memory bank population |
| **Done when** | All 4 baseline cells filled | All 4 LTE-LoRA cells filled |

**Fallback:** If training didn't finish, Person B evaluates the **pre-trained checkpoint from the authors' repo** directly. This still produces valid LTE-LoRA numbers without re-training.

---

### Day 4 — Assemble & Write (Together)

| Step | What | Details |
|------|------|---------|
| 1 | **Fill Table 1 replica** | Merge all numbers into final table: 3 methods x 2 datasets x 4 metrics |
| 2 | **Gap analysis** | For each cell: does your number match the paper? If not, by how much and why? |
| 3 | **Hardware note** | Document RTX 5060 (8.15 GB, Blackwell) vs paper's setup as likely divergence source |
| 4 | **Extension (if time)** | LLaMA-3-8B-Instruct inference-only — swap backbone, use existing LTE-LoRA checkpoint, no re-training |

---

## Key Coordination Rules

1. **Single shared spreadsheet** from Day 2 onward — never two separate files
2. **Sync at end of each day** — a 5-minute check-in prevents Day 4 surprises
3. **Fallback for training overrun** — use authors' pre-trained checkpoint
4. **Match Table 1 exactly** — same column order, same metric names
5. **Dmytro's feedback** — he suggested expanding methods if time allows; Day 4 extension addresses this

## Critical Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| CUDA/dependency mismatch | Day 1 forward pass catches this early |
| Training crash on Colab | Monitor loss; restart immediately; budget for overnight |
| Numbers wildly off | Check retrieval mechanism config + memory bank population |
| Time overrun | Pre-trained checkpoint fallback; extension is optional |
| Colab disconnects | Save checkpoints frequently; use Colab Pro for longer sessions |
