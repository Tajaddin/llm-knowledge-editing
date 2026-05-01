// Builds Day4_Gap_Analysis_Template.docx
// Run from /tmp/docx_build (where docx is installed):
//   cp /sessions/friendly-serene-hamilton/mnt/PPD/PersonB_Deliverables/build_gap_analysis.js /tmp/docx_build/
//   node /tmp/docx_build/build_gap_analysis.js

const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageOrientation, Header, Footer, PageNumber, PageBreak,
} = require('docx');

// ---------- helpers ----------
const border = { style: BorderStyle.SINGLE, size: 4, color: '999999' };
const allBorders = { top: border, bottom: border, left: border, right: border };
const margins = { top: 80, bottom: 80, left: 120, right: 120 };

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, ...opts.spacing },
    alignment: opts.alignment,
    children: [new TextRun({ text, bold: !!opts.bold, italics: !!opts.italics, color: opts.color, size: opts.size })],
    ...opts.paraOpts,
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    children: [new TextRun(text)],
  });
}

function bulletRich(runs) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: runs,
  });
}

function placeholder(text) {
  return new TextRun({ text, italics: true, color: 'C00000' });
}

function h(text, level) {
  return new Paragraph({
    heading: level === 1 ? HeadingLevel.HEADING_1
            : level === 2 ? HeadingLevel.HEADING_2
            : HeadingLevel.HEADING_3,
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
      children: [new TextRun({
        text,
        bold: opts.bold || false,
        italics: opts.italics || false,
        color: opts.color,
      })],
    })],
  });
}

// ---------- content ----------
const totalWidth = 9360;
const c2 = [3120, 6240];
const c4 = [3000, 2120, 2120, 2120];

const children = [
  // Title block
  p('Day 4 — Gap Analysis Template', { bold: true, size: 36, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  p('Reproducibility: Learning to Edit — Aligning LLMs with Knowledge Editing (Jiang et al., ACL 2024)',
    { italics: true, alignment: AlignmentType.CENTER, color: '666666', spacing: { after: 240 } }),
  p('Authors: Marvin Osei-Kuffour (Person A), Tajaddin Gafarov (Person B). CAI 5335 / CIS 4930, University of South Florida.',
    { spacing: { after: 240 } }),

  // Abstract
  h('1. Summary of what we ran', 1),
  new Paragraph({
    children: [
      new TextRun('We reproduced the LTE-LoRA result from Jiang et al. 2024 on '),
      placeholder('[ZsRE / WikiData_counterfact / both]'),
      new TextRun(' against two baselines ('),
      placeholder('ICE, ROME'),
      new TextRun('), using LLaMA-2-Chat-7B as the backbone. Alignment training ran on a Colab A100 for '),
      placeholder('[X.X hours]'),
      new TextRun(' over 3 epochs of the 60k-example LTE SFT dataset. Evaluation used the EasyEdit toolkit.'),
    ],
    spacing: { after: 120 },
  }),

  // Section 2: Setup table
  h('2. Setup', 1),
  new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: c2,
    rows: [
      new TableRow({ children: [cell('Backbone', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('LLaMA-2-Chat-7B (NousResearch ungated mirror)', { width: c2[1] })] }),
      new TableRow({ children: [cell('Methods reproduced', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('ICE, ROME, LTE-LoRA', { width: c2[1] })] }),
      new TableRow({ children: [cell('Datasets', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('ZsRE-test-all (1,304 ex.), wiki_counterfact/test_cf (885 ex.)', { width: c2[1] })] }),
      new TableRow({ children: [cell('Hardware', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('Colab A100 40 GB (training + LTE-LoRA eval); Person A: [GPU?] for ICE/ROME', { width: c2[1] })] }),
      new TableRow({ children: [cell('LoRA config', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('r=8, alpha=16, dropout=0.05 (matches authors)', { width: c2[1] })] }),
      new TableRow({ children: [cell('Optimizer', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('AdamW, lr=3e-4, cosine schedule, 3 epochs, eff. batch 128 (per_device 2 × accum 64)', { width: c2[1] })] }),
      new TableRow({ children: [cell('Quantization', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('bf16 during training; QLoRA 4-bit only on local 8 GB prototyping path', { width: c2[1] })] }),
      new TableRow({ children: [cell('Out of scope', { width: c2[0], bold: true, shade: 'D9E1F2' }), cell('Batch / sequential editing (1k edits), Qwen-Chat-7B, full LTE (fp16 fine-tuning)', { width: c2[1] })] }),
    ],
  }),

  // Section 3: Results table
  h('3. Results', 1),
  p('Numbers below are pulled from Table1_Replica.xlsx. Replace the placeholder cells with the actual values.', { italics: true, color: '666666' }),

  // Edit Success comparison table
  h('3.1 ZsRE', 2),
  new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: c4,
    rows: [
      new TableRow({ children: [
        cell('Metric', { width: c4[0], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
        cell('ICE (ours)', { width: c4[1], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
        cell('ROME (ours)', { width: c4[2], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
        cell('LTE-LoRA (ours / paper)', { width: c4[3], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
      ]}),
      ...['Edit Success', 'Portability — Reasoning', 'Portability — Subject Aliasing', 'Portability — Logical Generalization', 'Locality — Relation Specificity', 'Fluency'].map(metric => new TableRow({
        children: [
          cell(metric, { width: c4[0] }),
          cell('—', { width: c4[1], italics: true, color: 'C00000', alignment: AlignmentType.CENTER }),
          cell('—', { width: c4[2], italics: true, color: 'C00000', alignment: AlignmentType.CENTER }),
          cell('— / —', { width: c4[3], italics: true, color: 'C00000', alignment: AlignmentType.CENTER }),
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
        cell('Metric', { width: c4[0], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
        cell('ICE (ours)', { width: c4[1], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
        cell('ROME (ours)', { width: c4[2], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
        cell('LTE-LoRA (ours / paper)', { width: c4[3], bold: true, shade: '1F4E78', color: 'FFFFFF', alignment: AlignmentType.CENTER }),
      ]}),
      ...['Edit Success', 'Portability — Reasoning', 'Portability — Subject Aliasing', 'Portability — Logical Generalization', 'Locality — Relation Specificity', 'Locality — Forgetfulness', 'Fluency'].map(metric => new TableRow({
        children: [
          cell(metric, { width: c4[0] }),
          cell('—', { width: c4[1], italics: true, color: 'C00000', alignment: AlignmentType.CENTER }),
          cell('—', { width: c4[2], italics: true, color: 'C00000', alignment: AlignmentType.CENTER }),
          cell('— / —', { width: c4[3], italics: true, color: 'C00000', alignment: AlignmentType.CENTER }),
        ],
      })),
    ],
  }),

  // Section 4: Where we matched / diverged
  h('4. Where we matched the paper', 1),
  bulletRich([new TextRun('LTE-LoRA Edit Success on ZsRE: ours '), placeholder('[X.XX]'), new TextRun(', paper '), placeholder('[Y.YY]'), new TextRun('. '), placeholder('[Within / outside]'), new TextRun(' the paper\'s claimed ~99.9%.')]),
  bulletRich([new TextRun('Locality — Relation Specificity: ours '), placeholder('[X.XX]'), new TextRun(', paper '), placeholder('[Y.YY]'), new TextRun('.')]),
  bulletRich([new TextRun('Fluency (n-gram entropy ×100): ours '), placeholder('[X.XX]'), new TextRun(', paper '), placeholder('[Y.YY]'), new TextRun('.')]),
  bulletRich([placeholder('[Add 1–2 more rows from Table 3.x where Δ is small.]')]),

  h('5. Where we diverged from the paper', 1),
  bulletRich([new TextRun('Portability — Logical Generalization: ours '), placeholder('[X.XX]'), new TextRun(' vs paper '), placeholder('[Y.YY]'), new TextRun(' (Δ = '), placeholder('[±Z]'), new TextRun('). Likely cause: '), placeholder('[hypothesis — see §6]')]),
  bulletRich([new TextRun('ROME Edit Success on counterfact: ours '), placeholder('[X.XX]'), new TextRun(' vs paper '), placeholder('[Y.YY]'), new TextRun('. ROME is sensitive to the layer hyperparameter; we used the released llama-7b config without re-tuning.')]),
  bulletRich([placeholder('[Add 1–2 more rows from Table 3.x where Δ is large.]')]),

  // Section 6: Hypotheses for divergence
  h('6. Hypotheses for the gaps', 1),
  p('Each of these is a candidate explanation; if you have time, the appendix has a small experiment to test the most likely one.', { italics: true, color: '666666' }),

  h('6.1 Hardware: RTX 5060 (8 GB) prototyping vs. A100 (40 GB) for the real run', 3),
  bulletRich([new TextRun('Local prototyping uses 4-bit QLoRA; the actual reported numbers come from the bf16 A100 run, so this should not affect headline metrics. Sanity check: any divergence between Day 1 dummy-pass numbers and Day 3 should be tiny.')]),

  h('6.2 Effective batch size and gradient accumulation', 3),
  bulletRich([new TextRun('We use per_device 2 × accum 64 = effective 128. The authors\' release uses '), placeholder('[verify from FastChat config]'), new TextRun('. If different, optimization dynamics differ slightly which can shift Portability metrics by a few points.')]),

  h('6.3 Eval split / dataset version', 3),
  bulletRich([new TextRun('We used the KnowEdit-bundled splits. ZsRE: 1,304 examples (verified Day 1). WikiData_counterfact: 885 examples. The paper reports on the same KnowEdit splits, so this should match.')]),

  h('6.4 Retrieval encoder and memory bank size', 3),
  bulletRich([new TextRun('LTE inference retrieves from a memory bank using all-MiniLM-L6-v2. We populate the bank with the same edit set the eval iterates over. If the authors used a different encoder or larger bank, retrieval quality (and therefore Portability) would differ.')]),

  h('6.5 Software versions', 3),
  bulletRich([new TextRun('transformers, peft, and bitsandbytes versions changed substantially since the paper. We pinned to '), placeholder('[fill in `pip list | grep -E "transformers|peft|bitsandbytes"`]'), new TextRun('.')]),

  // Section 7: Extension
  h('7. Extension — LLaMA-3-8B inference-only', 1),
  new Paragraph({
    children: [
      new TextRun('We '),
      placeholder('[did / did not]'),
      new TextRun(' apply the LTE-LoRA adapter (trained on LLaMA-2-Chat-7B) to LLaMA-3-8B-Instruct without re-training, to test how much of LTE\'s alignment generalizes across model generations.'),
    ],
    spacing: { after: 120 },
  }),
  new Paragraph({
    children: [
      new TextRun('Hypothesis: Edit Success comparable, Locality differs because of LLaMA-3\'s different internal knowledge distribution. Result: '),
      placeholder('[fill in if attempted]'),
      new TextRun('.'),
    ],
    spacing: { after: 120 },
  }),

  // Section 8: Reproducibility checklist
  h('8. Reproducibility checklist', 1),
  bullet('LoRA adapter saved to Drive (folder name: output_lte_lora_llama-2_7b_chat).'),
  bullet('Per-aspect raw JSON in EasyEdit/output/ (5 files for counterfact, 4 for ZsRE).'),
  bullet('Aggregated lte_lora_results.json copied into Table1_Replica.xlsx.'),
  bullet('ICE and ROME hparams: ran with the released llama-7b configs unchanged.'),
  bullet('Random seed: default (42 in EasyEdit).'),
  bullet('Code: this repo + the patched FastChat trainer (see Day 2 notebook Cell 3 for the diff).'),

  // Section 9: Conclusion
  h('9. Conclusion', 1),
  new Paragraph({
    children: [
      new TextRun('On the two benchmarks we tested, our LTE-LoRA reproduction '),
      placeholder('[broadly matches / partially matches / does not match]'),
      new TextRun(' the headline numbers from Jiang et al. 2024. The strongest agreement is on '),
      placeholder('[Edit Success]'),
      new TextRun('; the largest gap is on '),
      placeholder('[metric]'),
      new TextRun(', most likely caused by '),
      placeholder('[chosen hypothesis from §6]'),
      new TextRun('. Overall the central claim of the paper — that an alignment-based approach can deliver near-perfect edit success while preserving locality — '),
      placeholder('[holds / does not hold]'),
      new TextRun(' under our setup.'),
    ],
    spacing: { after: 120 },
  }),

  // References — short
  new Paragraph({ children: [new PageBreak()] }),
  h('References', 1),
  p('Jiang, Wang, Wu, Zhong, et al. "Learning to Edit: Aligning LLMs with Knowledge Editing." ACL 2024. arXiv:2402.11905v2.'),
  p('Wang, Zhang, Xie, Yao, et al. "EasyEdit: An Easy-to-Use Knowledge Editing Framework for LLMs." ACL 2024 System Demos.'),
  p('Levy, Seo, Choi, Zettlemoyer. "Zero-Shot Relation Extraction via Reading Comprehension." CoNLL 2017. (ZsRE)'),
  p('Cohen, Biran, Yoran, Globerson, Geva. "Ripple Edits." EMNLP 2023. (WikiData_counterfact lineage)'),
  p('Touvron et al. "LLaMA-2: Open Foundation and Fine-Tuned Chat Models." arXiv 2023.'),
];

// ---------- assemble ----------
const doc = new Document({
  creator: 'LTE Reproducibility — Person B',
  title: 'Day 4 — Gap Analysis Template',
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
      ],
    }],
  },
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } }, // 11pt
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
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: 'LTE Reproducibility — Day 4 Gap Analysis', italics: true, color: '888888', size: 18 })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Page ', size: 18, color: '888888' }),
                     new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '888888' })],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = '/sessions/friendly-serene-hamilton/mnt/PPD/PersonB_Deliverables/Day4_Gap_Analysis_Template.docx';
  fs.writeFileSync(out, buf);
  console.log('OK -', out, '(', buf.length, 'bytes )');
});
