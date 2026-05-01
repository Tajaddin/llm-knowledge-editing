const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Marvin Osei-Kuffour & Tajaddin Gafarov";
pres.title = "Reproducibility: Learning to Edit — Aligning LLMs with Knowledge Editing";

// === COLOR PALETTE: Ocean/Deep Blue (academic, trustworthy) ===
const C = {
  navy: "0F2B46",
  darkBlue: "1A3C5E",
  midBlue: "2563EB",
  lightBlue: "DBEAFE",
  iceBlue: "EFF6FF",
  white: "FFFFFF",
  offWhite: "F8FAFC",
  gray: "64748B",
  darkGray: "1E293B",
  accent: "F59E0B",   // amber for highlights
  green: "10B981",
  red: "EF4444",
};

// Factory functions for reusable styles (avoid PptxGenJS mutation bug)
const makeShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.12 });
const makeCard = (x, y, w, h) => ({ x, y, w, h, fill: { color: C.white }, shadow: makeShadow() });

// ─────────────────────────────────────────────────────────────
// SLIDE 1: TITLE
// ─────────────────────────────────────────────────────────────
let s1 = pres.addSlide();
s1.background = { color: C.navy };

// Accent bar at top
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.midBlue } });

// Title
s1.addText("Reproducibility Study", {
  x: 0.8, y: 1.2, w: 8.4, h: 0.8,
  fontSize: 18, fontFace: "Calibri", color: C.midBlue, bold: true,
  charSpacing: 4, margin: 0
});
s1.addText("Learning to Edit: Aligning LLMs\nwith Knowledge Editing", {
  x: 0.8, y: 1.8, w: 8.4, h: 1.6,
  fontSize: 36, fontFace: "Georgia", color: C.white, bold: true, margin: 0
});

// Authors
s1.addText([
  { text: "Marvin Osei-Kuffour  &  Tajaddin Gafarov", options: { fontSize: 16, color: C.white, breakLine: true } },
  { text: "\nCAI 5335 / CIS 4930: Introduction to Large Language Models", options: { fontSize: 13, color: C.gray } },
  { text: "\nUniversity of South Florida", options: { fontSize: 13, color: C.gray } }
], { x: 0.8, y: 3.8, w: 8.4, h: 1.2, fontFace: "Calibri", margin: 0 });

// Original paper reference
s1.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 5.05, w: 8.4, h: 0.01, fill: { color: C.gray } });
s1.addText("Original: Jiang et al. (ACL 2024)  |  github.com/YJiangcm/LTE", {
  x: 0.8, y: 5.1, w: 8.4, h: 0.4,
  fontSize: 11, fontFace: "Calibri", color: C.gray, margin: 0
});

// ─────────────────────────────────────────────────────────────
// SLIDE 2: MOTIVATION — Why Knowledge Editing?
// ─────────────────────────────────────────────────────────────
let s2 = pres.addSlide();
s2.background = { color: C.offWhite };

s2.addText("Why Knowledge Editing?", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 32, fontFace: "Georgia", color: C.darkGray, bold: true, margin: 0
});

// Problem card
s2.addShape(pres.shapes.RECTANGLE, makeCard(0.8, 1.4, 4, 3.6));
s2.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.4, w: 0.08, h: 3.6, fill: { color: C.red } });
s2.addText("The Problem", {
  x: 1.2, y: 1.6, w: 3.4, h: 0.4,
  fontSize: 18, fontFace: "Calibri", color: C.red, bold: true, margin: 0
});
s2.addText([
  { text: "LLMs absorb knowledge during pre-training, but facts go stale", options: { breakLine: true, bullet: true } },
  { text: "\nRetraining from scratch is computationally prohibitive", options: { breakLine: true, bullet: true } },
  { text: "\nExisting editing methods force memorization, not understanding", options: { bullet: true } }
], {
  x: 1.2, y: 2.2, w: 3.4, h: 2.5,
  fontSize: 13, fontFace: "Calibri", color: C.darkGray, margin: 0, paraSpaceAfter: 4
});

// Solution card
s2.addShape(pres.shapes.RECTANGLE, makeCard(5.2, 1.4, 4, 3.6));
s2.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.4, w: 0.08, h: 3.6, fill: { color: C.green } });
s2.addText("LTE Solution", {
  x: 5.6, y: 1.6, w: 3.4, h: 0.4,
  fontSize: 18, fontFace: "Calibri", color: C.green, bold: true, margin: 0
});
s2.addText([
  { text: '"Teach a man to fish" — train LLMs to apply edits, not memorize them', options: { breakLine: true, bullet: true } },
  { text: "\nOne-time alignment training, then unlimited edits at inference", options: { breakLine: true, bullet: true } },
  { text: "\n99.9% edit success with +21 portability over SOTA", options: { bullet: true } }
], {
  x: 5.6, y: 2.2, w: 3.4, h: 2.5,
  fontSize: 13, fontFace: "Calibri", color: C.darkGray, margin: 0, paraSpaceAfter: 4
});

// ─────────────────────────────────────────────────────────────
// SLIDE 3: LTE Framework Overview
// ─────────────────────────────────────────────────────────────
let s3 = pres.addSlide();
s3.background = { color: C.offWhite };

s3.addText("LTE Framework", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 32, fontFace: "Georgia", color: C.darkGray, bold: true, margin: 0
});

// Phase 1 card
s3.addShape(pres.shapes.RECTANGLE, makeCard(0.8, 1.3, 4, 3.8));
s3.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 4, h: 0.5, fill: { color: C.midBlue } });
s3.addText("Phase 1: Alignment (One-Time)", {
  x: 1.0, y: 1.35, w: 3.6, h: 0.4,
  fontSize: 14, fontFace: "Calibri", color: C.white, bold: true, margin: 0
});
s3.addText([
  { text: "Fine-tune on curated parallel dataset", options: { breakLine: true, bullet: true } },
  { text: "\nPrompt format:", options: { breakLine: true, bold: true } },
  { text: "\n[Updated Information]{edit}", options: { breakLine: true, fontFace: "Consolas", fontSize: 11 } },
  { text: "[Query]{question}", options: { breakLine: true, fontFace: "Consolas", fontSize: 11 } },
  { text: "\nTrains 3 capabilities:", options: { breakLine: true, bold: true } },
  { text: "\n  In-scope: use edited facts correctly", options: { breakLine: true, bullet: true } },
  { text: "\n  Out-of-scope: preserve unrelated knowledge", options: { breakLine: true, bullet: true } },
  { text: "\n  Linguistic: maintain fluency", options: { bullet: true } }
], {
  x: 1.1, y: 2.0, w: 3.5, h: 2.8,
  fontSize: 12, fontFace: "Calibri", color: C.darkGray, margin: 0, paraSpaceAfter: 2
});

// Arrow between phases
s3.addText(">>>", {
  x: 4.6, y: 2.8, w: 0.8, h: 0.5,
  fontSize: 20, fontFace: "Calibri", color: C.midBlue, bold: true, align: "center", margin: 0
});

// Phase 2 card
s3.addShape(pres.shapes.RECTANGLE, makeCard(5.2, 1.3, 4, 3.8));
s3.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4, h: 0.5, fill: { color: C.accent } });
s3.addText("Phase 2: Inference (Real-Time)", {
  x: 5.4, y: 1.35, w: 3.6, h: 0.4,
  fontSize: 14, fontFace: "Calibri", color: C.darkGray, bold: true, margin: 0
});
s3.addText([
  { text: "No further training needed!", options: { breakLine: true, bullet: true, bold: true } },
  { text: "\nRetrieval mechanism pulls relevant edit from memory bank", options: { breakLine: true, bullet: true } },
  { text: "\nSupports real-time batch & sequential editing", options: { breakLine: true, bullet: true } },
  { text: "\nNo parameter updates at inference time", options: { breakLine: true, bullet: true } },
  { text: "\nScales to unlimited new edits", options: { bullet: true } }
], {
  x: 5.5, y: 2.0, w: 3.5, h: 2.8,
  fontSize: 12, fontFace: "Calibri", color: C.darkGray, margin: 0, paraSpaceAfter: 4
});

// ─────────────────────────────────────────────────────────────
// SLIDE 4: Our Reproduction Scope
// ─────────────────────────────────────────────────────────────
let s4 = pres.addSlide();
s4.background = { color: C.offWhite };

s4.addText("Our Reproduction Scope", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 32, fontFace: "Georgia", color: C.darkGray, bold: true, margin: 0
});

// 4 cards in 2x2 grid
const cards = [
  { title: "Methods", items: "LTE-LoRA\nROME (baseline)\nICE (baseline)", color: C.midBlue, x: 0.8, y: 1.3 },
  { title: "Datasets", items: "ZsRE (1,304 test)\nWikiDatacounterfact\n(885 test)", color: C.green, x: 5.2, y: 1.3 },
  { title: "Backbone", items: "LLaMA-2-Chat-7B\n(4-bit QLoRA)\nvia HuggingFace", color: C.accent, x: 0.8, y: 3.3 },
  { title: "Metrics", items: "Edit Success\nPortability\nLocality\nFluency", color: C.red, x: 5.2, y: 3.3 }
];

cards.forEach(c => {
  s4.addShape(pres.shapes.RECTANGLE, makeCard(c.x, c.y, 4, 1.7));
  s4.addShape(pres.shapes.RECTANGLE, { x: c.x, y: c.y, w: 0.08, h: 1.7, fill: { color: c.color } });
  s4.addText(c.title, {
    x: c.x + 0.3, y: c.y + 0.15, w: 3.5, h: 0.35,
    fontSize: 16, fontFace: "Calibri", color: c.color, bold: true, margin: 0
  });
  s4.addText(c.items, {
    x: c.x + 0.3, y: c.y + 0.55, w: 3.5, h: 1.0,
    fontSize: 12, fontFace: "Calibri", color: C.darkGray, margin: 0
  });
});

// ─────────────────────────────────────────────────────────────
// SLIDE 5: Methodology / Pipeline
// ─────────────────────────────────────────────────────────────
let s5 = pres.addSlide();
s5.background = { color: C.offWhite };

s5.addText("Reproduction Pipeline", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 32, fontFace: "Georgia", color: C.darkGray, bold: true, margin: 0
});

// Step boxes
const steps = [
  { num: "1", title: "Data Prep", desc: "Download ZsRE +\nWikiData_cf via\nEasyEdit/KnowEdit", color: C.midBlue },
  { num: "2", title: "Alignment", desc: "LTE-LoRA training\non A100 (QLoRA)\n3 epochs, lr=3e-4", color: C.darkBlue },
  { num: "3", title: "Baselines", desc: "Run ICE + ROME\nvia EasyEdit\n(no training)", color: C.green },
  { num: "4", title: "Evaluation", desc: "4 metrics on\nboth datasets\n+ gap analysis", color: C.accent }
];

steps.forEach((st, i) => {
  const x = 0.8 + i * 2.3;
  // Number circle
  s5.addShape(pres.shapes.OVAL, { x: x + 0.7, y: 1.4, w: 0.6, h: 0.6, fill: { color: st.color } });
  s5.addText(st.num, {
    x: x + 0.7, y: 1.4, w: 0.6, h: 0.6,
    fontSize: 20, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle", margin: 0
  });
  // Card
  s5.addShape(pres.shapes.RECTANGLE, makeCard(x, 2.2, 2.0, 2.4));
  s5.addText(st.title, {
    x: x + 0.15, y: 2.35, w: 1.7, h: 0.4,
    fontSize: 15, fontFace: "Calibri", color: st.color, bold: true, align: "center", margin: 0
  });
  s5.addText(st.desc, {
    x: x + 0.15, y: 2.8, w: 1.7, h: 1.5,
    fontSize: 11, fontFace: "Calibri", color: C.darkGray, align: "center", margin: 0
  });
  // Arrow (except last)
  if (i < 3) {
    s5.addText(">", {
      x: x + 2.0, y: 2.8, w: 0.3, h: 0.8,
      fontSize: 28, fontFace: "Calibri", color: C.gray, bold: true, align: "center", valign: "middle", margin: 0
    });
  }
});

// Software stack note
s5.addText("Software: EasyEdit  |  HuggingFace Transformers + PEFT  |  bitsandbytes (4-bit)  |  Google Colab A100", {
  x: 0.8, y: 4.9, w: 8.4, h: 0.4,
  fontSize: 11, fontFace: "Calibri", color: C.gray, italic: true, margin: 0
});

// ─────────────────────────────────────────────────────────────
// SLIDE 6: Results Table (Table 1 Partial Reproduction)
// ─────────────────────────────────────────────────────────────
let s6 = pres.addSlide();
s6.background = { color: C.offWhite };

s6.addText("Results: Partial Table 1 Reproduction", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 28, fontFace: "Georgia", color: C.darkGray, bold: true, margin: 0
});

s6.addText("LLaMA-2-Chat-7B  |  Single Editing  |  ZsRE & WikiDatacounterfact", {
  x: 0.8, y: 1.0, w: 8.4, h: 0.3,
  fontSize: 12, fontFace: "Calibri", color: C.gray, italic: true, margin: 0
});

// Table header style
const hdrOpts = { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11, fontFace: "Calibri", align: "center", valign: "middle" };
const cellOpts = { fontSize: 11, fontFace: "Calibri", align: "center", valign: "middle", color: C.darkGray };
const altRow = { fill: { color: C.iceBlue } };

// Paper's reported numbers from Table 1 (LLaMA-2-Chat-7B, Single Editing)
// Format: [Method, Dataset, Edit Succ, Portability, Locality, Fluency]
let tableData = [
  [
    { text: "Method", options: hdrOpts },
    { text: "Dataset", options: hdrOpts },
    { text: "Edit Succ. (%)", options: hdrOpts },
    { text: "Portability (%)", options: hdrOpts },
    { text: "Locality (%)", options: hdrOpts },
    { text: "Fluency", options: hdrOpts }
  ],
  [
    { text: "ICE", options: {...cellOpts} },
    { text: "ZsRE", options: {...cellOpts} },
    { text: "72.9", options: {...cellOpts} },
    { text: "30.0", options: {...cellOpts} },
    { text: "70.6", options: {...cellOpts} },
    { text: "537.2", options: {...cellOpts} }
  ],
  [
    { text: "ROME", options: {...cellOpts, ...altRow} },
    { text: "ZsRE", options: {...cellOpts, ...altRow} },
    { text: "96.4", options: {...cellOpts, ...altRow} },
    { text: "46.6", options: {...cellOpts, ...altRow} },
    { text: "52.8", options: {...cellOpts, ...altRow} },
    { text: "535.3", options: {...cellOpts, ...altRow} }
  ],
  [
    { text: "LTE-LoRA", options: {...cellOpts, bold: true, color: C.midBlue} },
    { text: "ZsRE", options: {...cellOpts} },
    { text: "99.9", options: {...cellOpts, bold: true, color: C.green} },
    { text: "67.4", options: {...cellOpts, bold: true, color: C.green} },
    { text: "51.7", options: {...cellOpts} },
    { text: "551.1", options: {...cellOpts} }
  ],
  [
    { text: "ICE", options: {...cellOpts, ...altRow} },
    { text: "WikiData_cf", options: {...cellOpts, ...altRow} },
    { text: "73.1", options: {...cellOpts, ...altRow} },
    { text: "37.7", options: {...cellOpts, ...altRow} },
    { text: "37.2", options: {...cellOpts, ...altRow} },
    { text: "539.5", options: {...cellOpts, ...altRow} }
  ],
  [
    { text: "ROME", options: {...cellOpts} },
    { text: "WikiData_cf", options: {...cellOpts} },
    { text: "99.9", options: {...cellOpts} },
    { text: "9.2", options: {...cellOpts} },
    { text: "61.5", options: {...cellOpts} },
    { text: "545.2", options: {...cellOpts} }
  ],
  [
    { text: "LTE-LoRA", options: {...cellOpts, ...altRow, bold: true, color: C.midBlue} },
    { text: "WikiData_cf", options: {...cellOpts, ...altRow} },
    { text: "99.9", options: {...cellOpts, ...altRow, bold: true, color: C.green} },
    { text: "53.7", options: {...cellOpts, ...altRow, bold: true, color: C.green} },
    { text: "25.1", options: {...cellOpts, ...altRow} },
    { text: "551.6", options: {...cellOpts, ...altRow} }
  ]
];

s6.addTable(tableData, {
  x: 0.5, y: 1.5, w: 9.0,
  colW: [1.2, 1.4, 1.3, 1.3, 1.3, 1.0],
  border: { pt: 0.5, color: "CBD5E1" },
  rowH: [0.4, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35]
});

s6.addText("Numbers from the original paper (Jiang et al., 2024, Table 1). Green = best in column.", {
  x: 0.8, y: 4.4, w: 8.4, h: 0.3,
  fontSize: 10, fontFace: "Calibri", color: C.gray, italic: true, margin: 0
});

// Key takeaway
s6.addShape(pres.shapes.RECTANGLE, makeCard(0.8, 4.8, 8.4, 0.6));
s6.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.8, w: 0.08, h: 0.6, fill: { color: C.accent } });
s6.addText("Key: LTE-LoRA achieves 99.9% edit success and +21pt portability improvement over prior SOTA", {
  x: 1.2, y: 4.8, w: 7.8, h: 0.6,
  fontSize: 13, fontFace: "Calibri", color: C.darkGray, bold: true, valign: "middle", margin: 0
});

// ─────────────────────────────────────────────────────────────
// SLIDE 7: Challenges & Constraints
// ─────────────────────────────────────────────────────────────
let s7 = pres.addSlide();
s7.background = { color: C.offWhite };

s7.addText("Challenges & Constraints", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 32, fontFace: "Georgia", color: C.darkGray, bold: true, margin: 0
});

const challenges = [
  { title: "Hardware Limitations", desc: "Local GPU: RTX 5060 (8.15 GB VRAM)\nFull LTE needs ~14 GB — used QLoRA\n4-bit quantization for local dev", color: C.red },
  { title: "Dependency Conflicts", desc: "Colab Python 3.12 + PyTorch 2.10\nincompatible with original code\nPatched transformers imports + flash_attn", color: C.accent },
  { title: "Compute Budget", desc: "Training on Colab A100 (40 GB)\n$100 AWS credit budget\nOOM at batch_size=8, reduced to 2", color: C.midBlue },
  { title: "Scope Decisions", desc: "2 of 4 datasets (ZsRE, WikiData_cf)\n1 of 2 backbones (LLaMA-2 only)\n3 of 7 methods (LTE-LoRA, ROME, ICE)", color: C.green }
];

challenges.forEach((ch, i) => {
  const x = (i % 2 === 0) ? 0.8 : 5.2;
  const y = (i < 2) ? 1.3 : 3.3;
  s7.addShape(pres.shapes.RECTANGLE, makeCard(x, y, 4, 1.7));
  s7.addShape(pres.shapes.RECTANGLE, { x: x, y: y, w: 0.08, h: 1.7, fill: { color: ch.color } });
  s7.addText(ch.title, {
    x: x + 0.3, y: y + 0.15, w: 3.5, h: 0.35,
    fontSize: 15, fontFace: "Calibri", color: ch.color, bold: true, margin: 0
  });
  s7.addText(ch.desc, {
    x: x + 0.3, y: y + 0.55, w: 3.5, h: 1.0,
    fontSize: 11, fontFace: "Calibri", color: C.darkGray, margin: 0
  });
});

// ─────────────────────────────────────────────────────────────
// SLIDE 8: Extension — LLaMA-3-8B
// ─────────────────────────────────────────────────────────────
let s8 = pres.addSlide();
s8.background = { color: C.offWhite };

s8.addText("Extension: LLaMA-3-8B", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 32, fontFace: "Georgia", color: C.darkGray, bold: true, margin: 0
});

// What
s8.addShape(pres.shapes.RECTANGLE, makeCard(0.8, 1.3, 8.4, 1.4));
s8.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 0.08, h: 1.4, fill: { color: C.midBlue } });
s8.addText("Goal", {
  x: 1.2, y: 1.4, w: 1.0, h: 0.3,
  fontSize: 15, fontFace: "Calibri", color: C.midBlue, bold: true, margin: 0
});
s8.addText("Apply LTE-LoRA to Meta-LLaMA-3-8B-Instruct — a newer model with a different tokenizer, pre-training corpus, and stronger instruction-following. Tests whether LTE generalizes across model generations.", {
  x: 1.2, y: 1.8, w: 7.8, h: 0.7,
  fontSize: 13, fontFace: "Calibri", color: C.darkGray, margin: 0
});

// Hypothesis
s8.addShape(pres.shapes.RECTANGLE, makeCard(0.8, 3.0, 4, 1.6));
s8.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.0, w: 0.08, h: 1.6, fill: { color: C.green } });
s8.addText("Hypothesis", {
  x: 1.2, y: 3.1, w: 3.4, h: 0.3,
  fontSize: 15, fontFace: "Calibri", color: C.green, bold: true, margin: 0
});
s8.addText([
  { text: "Edit Success: comparable or better (stronger base model)", options: { bullet: true, breakLine: true } },
  { text: "\nLocality: may differ (different internal knowledge distribution)", options: { bullet: true } }
], {
  x: 1.2, y: 3.5, w: 3.4, h: 0.9,
  fontSize: 12, fontFace: "Calibri", color: C.darkGray, margin: 0
});

// Feasibility
s8.addShape(pres.shapes.RECTANGLE, makeCard(5.2, 3.0, 4, 1.6));
s8.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.0, w: 0.08, h: 1.6, fill: { color: C.accent } });
s8.addText("Feasibility", {
  x: 5.6, y: 3.1, w: 3.4, h: 0.3,
  fontSize: 15, fontFace: "Calibri", color: C.accent, bold: true, margin: 0
});
s8.addText([
  { text: "Inference-only evaluation (no re-training)", options: { bullet: true, breakLine: true } },
  { text: "\nSwap backbone, reuse existing LTE-LoRA checkpoint", options: { bullet: true, breakLine: true } },
  { text: "\nFallback if reproduction overruns", options: { bullet: true } }
], {
  x: 5.6, y: 3.5, w: 3.4, h: 0.9,
  fontSize: 12, fontFace: "Calibri", color: C.darkGray, margin: 0
});

// ─────────────────────────────────────────────────────────────
// SLIDE 9: Summary & Next Steps
// ─────────────────────────────────────────────────────────────
let s9 = pres.addSlide();
s9.background = { color: C.navy };

s9.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.midBlue } });

s9.addText("Summary", {
  x: 0.8, y: 0.5, w: 8.4, h: 0.7,
  fontSize: 32, fontFace: "Georgia", color: C.white, bold: true, margin: 0
});

s9.addText([
  { text: "Reproducing LTE (ACL 2024) — a framework that teaches LLMs how to apply knowledge edits", options: { breakLine: true, bullet: true, fontSize: 15 } },
  { text: "\nFocused on LTE-LoRA + 2 baselines (ROME, ICE) on 2 datasets", options: { breakLine: true, bullet: true, fontSize: 15 } },
  { text: "\nLTE-LoRA achieves 99.9% edit success with +21pt portability gain", options: { breakLine: true, bullet: true, fontSize: 15 } },
  { text: "\nExtension: testing generalization to LLaMA-3-8B", options: { breakLine: true, bullet: true, fontSize: 15 } },
  { text: "\nAll code via EasyEdit toolkit, reproducible on Colab A100", options: { bullet: true, fontSize: 15 } }
], {
  x: 1.0, y: 1.5, w: 8.0, h: 2.5,
  fontFace: "Calibri", color: C.white, margin: 0, paraSpaceAfter: 8
});

// References
s9.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.3, w: 8.4, h: 0.01, fill: { color: C.gray } });
s9.addText([
  { text: "References: ", options: { bold: true, breakLine: false } },
  { text: "Jiang et al. (2024) ACL  |  Wang et al. (2024) EasyEdit  |  github.com/YJiangcm/LTE", options: {} }
], {
  x: 0.8, y: 4.4, w: 8.4, h: 0.5,
  fontSize: 11, fontFace: "Calibri", color: C.gray, margin: 0
});

// Thank you
s9.addText("Thank You — Questions?", {
  x: 0.8, y: 4.9, w: 8.4, h: 0.5,
  fontSize: 18, fontFace: "Georgia", color: C.accent, bold: true, margin: 0
});

// ─────────────────────────────────────────────────────────────
// SAVE
// ─────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "G:/PPD/LTE_Reproducibility_Presentation.pptx" })
  .then(() => console.log("Presentation saved!"))
  .catch(err => console.error(err));
