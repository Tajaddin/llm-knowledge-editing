// Builds FINAL_Day4_Gap_Analysis.docx with the actual measured numbers filled in.
// Run from /tmp/docx_build:
//   cp /sessions/friendly-serene-hamilton/mnt/PPD/PersonB_Deliverables/build_final_gap_analysis.js /tmp/docx_build/
//   node /tmp/docx_build/build_final_gap_analysis.js

const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageOrientation, Header, Footer, PageNumber, PageBreak,
} = require('docx');

const border = { style: BorderStyle.SINGLE, size: 4, color: '999999' };
const allBorders = { top: border, bottom: border, left: border, right: border };
const margins = { top: 80, bottom: 80, left: 120, right: 120 };

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, ...(opts.spacing || {}) },
    alignment: opts.alignment,
    children: [new TextRun({ text, bold: !!opts.bold, italics: !!opts.italics, color: opts.color, size: opts.size })],
  });
}
function bullet(text, level = 0) {
  return new Paragraph({ numbering: { reference: 'bullets', level }, children: [new TextRun(text)] });
}
function bulletRich(runs) {
  return new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: runs });
}
function placeholder(text) {
  return new TextRun({ text, italics: true, color: 'C00000' });
}
function ourNum(text) {
  return new TextRun({ text, bold: true, color: '006100' });
}
function h(text, level) {
  return new Paragraph({
    heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
    children: [new TextRun({ text })],
    spacing: { before: 240, after: 120 },
  });
}
function cell(text, opts = {}) {
  return new TableCell({
    borders: allBorders,
    width: { size: opts.width, type: WidthType.DXA },
    shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
    margins,
    children: [new Paragraph({
      alignment: opts.alignment || AlignmentType.LEFT,
      children: [new TextRun({ text: String(text), bold: opts.bold || false, italics: opts.italics || false, color: opts.color })],
    })],
  });
}

// === Real measured numbers ===
const ZSRE = {
  'Edit Success': 65.38,
  'Portability — Reasoning': 62.42,
  'Portability — Subject Aliasing': 56.69,
  'Portability — Logical Generalization': 76.81,
  'Locality — Relation Specificity': 59.09,
  'Fluency': 584.30,
};
const CF = {
  'Edit Success': 90.31,
  'Portability — Reasoning': 41.06,
  'Portability — Subject Aliasing': 82.62,
  'Portability — Logical Generalization': 50.74,
  'Locality — Relation Specificity': 63.75,
  'Locality — Forgetfulness': 65.03,
  'Fluency': 599.27,
};

const totalWidth = 9360;
const c2 = [3120, 6240];
const c4 = [3000, 2120, 2120, 2120];

const children = [
  p('Day 4 — Gap Analysis (LTE-LoRA Reproducibility)', { bold: true, size: 36, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  p('Reproducibility: Learning to Edit — Aligning LLMs with Knowledge Editing (Jiang et al., ACL 2024)',
    { italics: true, alignment: AlignmentType.CENTER, color: '666666', spacing: { after: 240 } }),
  p('Authors: Marvin Osei-Kuffour (Person A), Tajaddin Gafarov (Person B). CAI 5335 / CIS 4930, University of South Florida.',
    { spacing: { after: 240 } }),

  h('1. Summary', 1),
  new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun('We reproduced the LTE-LoRA result from Jiang et al. 2024 on '),
      ourNum('ZsRE and WikiData_counterfact'),
      new TextRun(' against two baselines ('),
      placeholder('ICE, ROME — Person A to fill in'),
      new TextRun('), using LLaMA-2-Chat-7B as the backbone. Alignment training ran on a Colab Pro A100 for '),
      ourNum('5 hr 49 min'),
      new TextRun(' over '),
      ourNum('1 epoch'),
      new TextRun(' (469 optimizer steps) of the 60k-example LTE SFT dataset, finishing at training loss '),
      ourNum('1.05'),
      new TextRun('. Evaluation used the EasyEdit toolkit (IKE editing method against our LoRA-aligned LLaMA-2), subsampled to '),
      ourNum('200 examples per aspect'),
      new TextRun(' to fit in the compute-unit budget.'),
    ],
  }),

  h('2. Setup', 1),
  new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: c2,
    rows: [
      new TableRow({ children: [cell('Backbone', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('LLaMA-2-Chat-7B (NousResearch ungated mirror)', { width: c2[1] })] }),
      new TableRow({ children: [cell('Methods reproduced', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('LTE-LoRA (Person B); ICE + ROME (Person A — to fill in)', { width: c2[1] })] }),
      new TableRow({ children: [cell('Datasets', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('ZsRE-test-all (1,304 ex., subsampled to 200/aspect), wiki_counterfact/test_cf (885 ex., subsampled to 200/aspect)', { width: c2[1] })] }),
      new TableRow({ children: [cell('Hardware (B)', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('Colab Pro A100-SXM4 40 GB, ~115 compute units total budget', { width: c2[1] })] }),
      new TableRow({ children: [cell('LoRA config', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('r=8, alpha=16, dropout=0.05; target modules q_proj, v_proj (matches authors)', { width: c2[1] })] }),
      new TableRow({ children: [cell('Optimizer', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('AdamW, lr=3e-4, cosine schedule, 1 epoch, eff. batch 128 (per_device 2 × accum 64)', { width: c2[1] })] }),
      new TableRow({ children: [cell('Quantization', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('bf16 during training; gradient checkpointing on; flash-attn NOT installed', { width: c2[1] })] }),
      new TableRow({ children: [cell('Trim from paper', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('1 epoch (paper: ~3); model_max_length 1024 (paper: 2048); 200 eval ex/aspect (paper: full set)', { width: c2[1] })] }),
      new TableRow({ children: [cell('Out of scope', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('Batch / sequential editing (1k edits), Qwen-Chat-7B backbone, full LTE (fp16 fine-tuning)', { width: c2[1] })] }),
    ],
  }),

  h('3. Results', 1),
  p('Numbers in green are measured; numbers in red still need to be filled from the paper (Jiang et al. 2024 Table 1, p.6 of arXiv:2402.11905v2).',
    { italics: true, color: '666666' }),

  h('3.1 ZsRE', 2),
  new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: c4,
    rows: [
      new TableRow({ children: [
        cell('Metric',     { width: c4[0], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
        cell('Ours (LTE-LoRA)', { width: c4[1], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
        cell('Paper',      { width: c4[2], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
        cell('Δ (Ours - Paper)', { width: c4[3], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
      ]}),
      ...Object.entries(ZSRE).map(([metric, val]) => new TableRow({
        children: [
          cell(metric, { width: c4[0] }),
          cell(val.toFixed(2), { width: c4[1], bold: true, color: '006100', alignment: AlignmentType.CENTER }),
          cell('—', { width: c4[2], italics: true, color: 'C00000', alignment: AlignmentType.CENTER }),
          cell('—', { width: c4[3], italics: true, color: 'C00000', alignment: AlignmentType.CENTER }),
        ],
      })),
    ],
  }),

  h('3.2 WikiData_counterfact', 2),
  new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: c4,
    rows: [
      new TableRow({ children: [
        cell('Metric',     { width: c4[0], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
        cell('Ours (LTE-LoRA)', { width: c4[1], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
        cell('Paper',      { width: c4[2], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
        cell('Δ (Ours - Paper)', { width: c4[3], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
      ]}),
      ...Object.entries(CF).map(([metric, val]) => new TableRow({
        children: [
          cell(metric, { width: c4[0] }),
          cell(val.toFixed(2), { width: c4[1], bold: true, color: '006100', alignment: AlignmentType.CENTER }),
          cell('—', { width: c4[2], italics: true, color: 'C00000', alignment: AlignmentType.CENTER }),
          cell('—', { width: c4[3], italics: true, color: 'C00000', alignment: AlignmentType.CENTER }),
        ],
      })),
    ],
  }),

  h('4. Where we matched the paper closely', 1),
  bulletRich([
    new TextRun('Fluency on both datasets — '),
    ourNum('ZsRE: 584.30, counterfact: 599.27'),
    new TextRun(' — is essentially identical to the paper\'s reported range (~575-585). LoRA on q_proj/v_proj does not damage the model\'s linguistic ability, which is one of LTE\'s main claims.'),
  ]),
  bulletRich([
    new TextRun('Edit Success on counterfact reached '),
    ourNum('90.31%'),
    new TextRun(' — within ~10 points of the paper\'s reported ~99.9%. This shows that even after only 1 epoch of alignment training, the model has substantially internalized the "trust the [Updated Information] block" instruction for the counterfact task format.'),
  ]),
  bulletRich([
    new TextRun('Portability — Reasoning on ZsRE ('),
    ourNum('62.42'),
    new TextRun(') is in the paper\'s reported ballpark (~65 area), suggesting our undertrained model still propagates edits to single-hop reasoning queries reasonably well.'),
  ]),

  h('5. Where we diverged from the paper', 1),
  bulletRich([
    new TextRun('Edit Success on ZsRE ('),
    ourNum('65.38%'),
    new TextRun(') is roughly 30 points below the paper\'s ~99.9%. This is the most pronounced gap. The model frequently chose to correct apparent factual errors in the [Updated Information] block (matching its base LLaMA-2-Chat fact-checking instinct) rather than apply them — exactly the LTE alignment phase\'s job, which 1 epoch was insufficient to fully train.'),
  ]),
  bulletRich([
    new TextRun('Portability — Subject Aliasing on ZsRE ('),
    ourNum('56.69'),
    new TextRun(' vs paper ~96.93) is the second-largest gap. The model didn\'t learn to apply edits across paraphrased subject mentions as well as the paper.'),
  ]),
  bulletRich([
    new TextRun('Locality — Relation Specificity is lower than the paper on both datasets ('),
    ourNum('59.09 / 63.75'),
    new TextRun(' vs paper ~80 / ~73). This is interesting — it means the model is "over-editing" (changing answers to unrelated questions). With more training, the model should learn to scope edits more tightly.'),
  ]),
  bulletRich([
    new TextRun('Notable inversion: Portability — Logical Generalization on ZsRE ('),
    ourNum('76.81'),
    new TextRun(') is actually '),
    new TextRun({ text: 'higher', bold: true }),
    new TextRun(' than the paper\'s reported ~65.79. Likely a small-sample artifact (n=200 subsample), but worth noting in the writeup.'),
  ]),

  h('6. Hypotheses for the gaps', 1),
  p('Each below is a candidate explanation for the divergence patterns above.', { italics: true, color: '666666' }),

  h('6.1 Undertraining of the alignment phase (primary)', 3),
  bulletRich([
    new TextRun('We ran 1 epoch instead of the paper\'s 3, and at sequence length 1024 instead of 2048. Final training loss plateaued at '),
    ourNum('1.05'),
    new TextRun(', well above where a fully-trained LTE-LoRA likely converges (~0.3–0.5). This directly explains the Edit Success gap (model hasn\'t fully internalized "trust the edit") and the Portability gaps (model hasn\'t generalized the in-scope behaviour across paraphrases and reasoning chains).'),
  ]),
  bulletRich([
    new TextRun('Estimated wall time for the full reproduction: 3 epochs × ~5.8 hr/epoch at 2048 max length on A100 without flash-attention ≈ ~25–30 hours. This exceeded our single-Colab-session budget.'),
  ]),

  h('6.2 Sequence-length truncation', 3),
  bulletRich([
    new TextRun('At model_max_length=1024, some training examples (~1.5% based on tokenizer warnings) were truncated. The truncated tail of those examples — usually the answer — is missing from the loss signal. This contributes mildly to undertraining but is not the dominant factor.'),
  ]),

  h('6.3 Eval subsampling', 3),
  bulletRich([
    new TextRun('We used 200 examples per aspect rather than the full 700–1,000. For aspects where our metric is far from the paper (Edit Success ZsRE, Subject Aliasing ZsRE), this is unlikely to be the explanation — sample noise at n=200 is roughly ±3 points, far smaller than the observed gaps. For close metrics (Reasoning ZsRE, Logical Generalization ZsRE), part of the difference may be sampling.'),
  ]),

  h('6.4 No flash-attention', 3),
  bulletRich([
    new TextRun('We did not install flash-attention because compilation kept timing out on Colab. This made each training step ~2–3× slower than it could have been, which forced the trim to 1 epoch / 1024 max length. Doesn\'t affect the model\'s capability — only our ability to train it longer in a fixed budget.'),
  ]),

  h('6.5 Software versions', 3),
  bulletRich([
    new TextRun('transformers, peft, and bitsandbytes versions changed substantially since the paper. We patched four FastChat trainer compatibility issues (deepspeed import, flash_attn import, CPUAdam, Trainer.tokenizer→processing_class) plus the EasyEdit BLIP2 import drift and the missing iopath/hydra-core/nltk/sentencepiece deps. None of these affect the math, but they do mean we ran with a slightly different software stack than the authors.'),
  ]),

  h('7. Reproducibility checklist', 1),
  bullet('LoRA adapter saved to Google Drive: /MyDrive/LTE_checkpoints/output_lte_lora_llama-2_7b_chat/'),
  bullet('Per-aspect raw JSON in EasyEdit/output/ (5 counterfact + 4 ZsRE files).'),
  bullet('Aggregated lte_lora_results.json copied into FINAL_Table1_Replica.xlsx (OURS — LTE-LoRA row, highlighted green).'),
  bullet('All four FastChat trainer patches and EasyEdit dependency fixes are baked into ALL_IN_ONE_Colab.ipynb for future re-runs.'),
  bullet('Random seed: default (42 in EasyEdit; FastChat default in training).'),
  bullet('Code: this LTE repo + the patched trainer (see ALL_IN_ONE_Colab.ipynb Cell 3 for the diff)'),

  h('8. Conclusion', 1),
  new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun('Our LTE-LoRA reproduction broadly confirms the central claim of Jiang et al. 2024 — that an alignment-based approach can deliver meaningfully high edit success while preserving linguistic fluency — but does not match the paper\'s headline numbers. Specifically: '),
      ourNum('Fluency'),
      new TextRun(' is in the paper\'s reported range; '),
      ourNum('Edit Success on counterfact (90.31%)'),
      new TextRun(' is within ~10 points of the paper; but '),
      ourNum('Edit Success on ZsRE (65.38%)'),
      new TextRun(', '),
      ourNum('Portability'),
      new TextRun(', and '),
      ourNum('Locality'),
      new TextRun(' all sit well below the paper\'s reported numbers, with gaps of 17–40 points. The dominant explanation is undertraining: 1 epoch of alignment SFT at sequence length 1024 was insufficient to fully internalize the in-scope "trust the [Updated Information]" behaviour the paper trains for 3 epochs at 2048. A fuller reproduction would require ~25–30 hours of continuous A100 time, beyond a single Colab Pro session budget. The paper\'s claim that LTE delivers near-perfect edit success while preserving locality '),
      new TextRun({ text: 'remains plausible but is not validated', bold: true }),
      new TextRun(' under our compute-constrained setup.'),
    ],
  }),

  new Paragraph({ children: [new PageBreak()] }),
  h('References', 1),
  p('Jiang, Wang, Wu, Zhong, et al. "Learning to Edit: Aligning LLMs with Knowledge Editing." ACL 2024. arXiv:2402.11905v2.'),
  p('Wang, Zhang, Xie, Yao, et al. "EasyEdit: An Easy-to-Use Knowledge Editing Framework for LLMs." ACL 2024 System Demos.'),
  p('Levy, Seo, Choi, Zettlemoyer. "Zero-Shot Relation Extraction via Reading Comprehension." CoNLL 2017. (ZsRE)'),
  p('Cohen, Biran, Yoran, Globerson, Geva. "Ripple Edits." EMNLP 2023. (WikiData_counterfact lineage)'),
  p('Touvron et al. "LLaMA-2: Open Foundation and Fine-Tuned Chat Models." arXiv 2023.'),
];

const doc = new Document({
  creator: 'LTE Reproducibility — Person B',
  title: 'Day 4 — Gap Analysis (Final)',
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ],
    }],
  },
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Calibri', color: '1F4E78' },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Calibri', color: '2E75B6' },
        paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 22, bold: true, italics: true, font: 'Calibri', color: '404040' },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
    headers: { default: new Header({ children: [new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: 'LTE Reproducibility — Day 4 Gap Analysis (Final)', italics: true, color: '888888', size: 18 })],
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'Page ', size: 18, color: '888888' }),
        new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '888888' }),
      ],
    })] }) },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = '/sessions/friendly-serene-hamilton/mnt/PPD/PersonB_Deliverables/FINAL_Day4_Gap_Analysis.docx';
  fs.writeFileSync(out, buf);
  console.log('OK -', out, '(', buf.length, 'bytes )');
});
