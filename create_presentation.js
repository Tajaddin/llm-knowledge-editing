const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const path = require("path");

// Icons
const { FaBrain, FaDatabase, FaCogs, FaChartBar, FaRocket, FaServer, FaExclamationTriangle, FaCheckCircle, FaArrowRight, FaLightbulb, FaGraduationCap } = require("react-icons/fa");
const { MdScience, MdExtension } = require("react-icons/md");

function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// Color palette - Ocean Gradient + warm accents for AI/NLP theme
const C = {
  navy:      "0D1B2A",
  darkBlue:  "1B3A4B",
  teal:      "065A82",
  midBlue:   "1C7293",
  lightBlue: "A9D6E5",
  cream:     "F0F4F8",
  white:     "FFFFFF",
  accent:    "E07A5F",   // terracotta accent
  green:     "2A9D8F",
  gold:      "E9C46A",
  darkText:  "1A1A2E",
  mutedText: "5A6A7A",
  lightMuted:"8A9AAA",
  successGreen: "2A9D8F",
  cardBg:    "FFFFFF",
  slideBg:   "F5F7FA",
};

async function main() {
  let pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Tajaddin Gafarov & Marvin Osei-Kuffour";
  pres.title = "Reproducibility Study: Learning to Edit";

  // Helper: factory functions for shadows (never reuse objects)
  const cardShadow = () => ({ type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.1 });
  const subtleShadow = () => ({ type: "outer", blur: 3, offset: 1, angle: 135, color: "000000", opacity: 0.08 });

  // Pre-render icons
  const iconBrain = await iconToBase64Png(FaBrain, "#" + C.white, 256);
  const iconDatabase = await iconToBase64Png(FaDatabase, "#" + C.teal, 256);
  const iconCogs = await iconToBase64Png(FaCogs, "#" + C.teal, 256);
  const iconChart = await iconToBase64Png(FaChartBar, "#" + C.teal, 256);
  const iconRocket = await iconToBase64Png(FaRocket, "#" + C.teal, 256);
  const iconServer = await iconToBase64Png(FaServer, "#" + C.teal, 256);
  const iconWarn = await iconToBase64Png(FaExclamationTriangle, "#" + C.accent, 256);
  const iconCheck = await iconToBase64Png(FaCheckCircle, "#" + C.successGreen, 256);
  const iconArrow = await iconToBase64Png(FaArrowRight, "#" + C.teal, 256);
  const iconBulb = await iconToBase64Png(FaLightbulb, "#" + C.gold, 256);
  const iconGrad = await iconToBase64Png(FaGraduationCap, "#" + C.white, 256);
  const iconScience = await iconToBase64Png(MdScience, "#" + C.teal, 256);
  const iconExtension = await iconToBase64Png(MdExtension, "#" + C.teal, 256);

  const iconBrainTeal = await iconToBase64Png(FaBrain, "#" + C.teal, 256);
  const iconCheckWhite = await iconToBase64Png(FaCheckCircle, "#" + C.white, 256);
  const iconBulbWhite = await iconToBase64Png(FaLightbulb, "#" + C.white, 256);
  const iconRocketWhite = await iconToBase64Png(FaRocket, "#" + C.white, 256);

  // =====================================================
  // SLIDE 1: TITLE SLIDE (dark background)
  // =====================================================
  let s1 = pres.addSlide();
  s1.background = { color: C.navy };

  // Decorative shape - top right corner accent
  s1.addShape(pres.shapes.RECTANGLE, { x: 7.5, y: 0, w: 2.5, h: 0.15, fill: { color: C.accent } });
  s1.addShape(pres.shapes.RECTANGLE, { x: 8.5, y: 0, w: 1.5, h: 0.08, fill: { color: C.gold } });

  // Brain icon
  s1.addImage({ data: iconBrain, x: 4.5, y: 0.6, w: 1, h: 1 });

  // Title
  s1.addText("Reproducibility Study", {
    x: 0.8, y: 1.7, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: "Georgia", color: C.white, bold: true, align: "center", margin: 0
  });
  s1.addText([
    { text: "Learning to Edit: ", options: { color: C.lightBlue, italic: true } },
    { text: "Aligning LLMs with Knowledge Editing", options: { color: C.lightBlue, italic: true } }
  ], {
    x: 0.8, y: 2.4, w: 8.4, h: 0.6,
    fontSize: 20, fontFace: "Georgia", align: "center", margin: 0
  });

  // Separator line
  s1.addShape(pres.shapes.LINE, { x: 3.5, y: 3.2, w: 3, h: 0, line: { color: C.accent, width: 2 } });

  // Authors
  s1.addText("Marvin Osei-Kuffour  &  Tajaddin Gafarov", {
    x: 0.8, y: 3.5, w: 8.4, h: 0.45,
    fontSize: 16, fontFace: "Calibri", color: C.lightBlue, align: "center", margin: 0
  });

  // Course info
  s1.addText("CAI 5335 / CIS 4930: Introduction to Large Language Models", {
    x: 0.8, y: 4.0, w: 8.4, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: C.lightMuted, align: "center", margin: 0
  });
  s1.addText("University of South Florida", {
    x: 0.8, y: 4.3, w: 8.4, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: C.lightMuted, align: "center", margin: 0
  });

  // Citation at bottom
  s1.addText("Original: Jiang et al. (ACL 2024)  |  github.com/YJiangcm/LTE", {
    x: 0.8, y: 5.0, w: 8.4, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: C.lightMuted, align: "center", margin: 0
  });

  // Bottom accent bar
  s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.45, w: 10, h: 0.18, fill: { color: C.teal } });


  // =====================================================
  // SLIDE 2: INTRODUCTION & MOTIVATION
  // =====================================================
  let s2 = pres.addSlide();
  s2.background = { color: C.slideBg };

  // Section tag
  s2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });
  s2.addText("INTRODUCTION & MOTIVATION", {
    x: 0.6, y: 0.25, w: 5, h: 0.35,
    fontSize: 10, fontFace: "Calibri", color: C.teal, bold: true, charSpacing: 3, margin: 0
  });

  s2.addText("Why Knowledge Editing?", {
    x: 0.6, y: 0.6, w: 8, h: 0.55,
    fontSize: 30, fontFace: "Georgia", color: C.navy, bold: true, margin: 0
  });

  // Left column - The Problem (card)
  s2.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 4.3, h: 3.6, fill: { color: C.white }, shadow: cardShadow() });
  s2.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 4.3, h: 0.06, fill: { color: C.accent } });

  s2.addImage({ data: iconWarn, x: 0.8, y: 1.65, w: 0.35, h: 0.35 });
  s2.addText("The Problem", {
    x: 1.25, y: 1.65, w: 3, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: C.accent, bold: true, margin: 0
  });

  s2.addText([
    { text: "LLMs absorb knowledge during pre-training, but facts go stale", options: { bullet: true, breakLine: true, fontSize: 13 } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "Retraining from scratch is computationally prohibitive", options: { bullet: true, breakLine: true, fontSize: 13 } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "Existing editing methods force memorization, not understanding", options: { bullet: true, breakLine: true, fontSize: 13 } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "No guarantee edited knowledge generalizes to related queries", options: { bullet: true, fontSize: 13 } },
  ], {
    x: 0.8, y: 2.2, w: 3.8, h: 2.5,
    fontFace: "Calibri", color: C.darkText, paraSpaceAfter: 4, margin: 0
  });

  // Right column - LTE Solution (card)
  s2.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.4, w: 4.3, h: 3.6, fill: { color: C.white }, shadow: cardShadow() });
  s2.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.4, w: 4.3, h: 0.06, fill: { color: C.successGreen } });

  s2.addImage({ data: iconCheck, x: 5.5, y: 1.65, w: 0.35, h: 0.35 });
  s2.addText("LTE Solution", {
    x: 5.95, y: 1.65, w: 3, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: C.successGreen, bold: true, margin: 0
  });

  s2.addText([
    { text: "\"Teach a model to fish\" \u2014 train LLMs to ", options: { fontSize: 13 } },
    { text: "apply ", options: { bold: true, fontSize: 13 } },
    { text: "edits, not memorize them", options: { fontSize: 13, breakLine: true } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "One-time alignment training, then unlimited edits at inference", options: { bullet: true, breakLine: true, fontSize: 13 } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "99.9% edit success with +21pt portability over SOTA", options: { bullet: true, breakLine: true, fontSize: 13, bold: true } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "No parameter updates needed at inference time", options: { bullet: true, fontSize: 13 } },
  ], {
    x: 5.5, y: 2.2, w: 3.8, h: 2.5,
    fontFace: "Calibri", color: C.darkText, paraSpaceAfter: 4, margin: 0
  });

  // Figure reference at bottom
  s2.addImage({ path: path.resolve("G:/PPD/image (2).png"), x: 2.5, y: 5.1, w: 2.2, h: 0.45, sizing: { type: "contain", w: 2.2, h: 0.45 } });
  s2.addText("Figure 1 from Jiang et al. (2024)", {
    x: 4.7, y: 5.1, w: 3, h: 0.35,
    fontSize: 9, fontFace: "Calibri", color: C.lightMuted, italic: true, margin: 0
  });


  // =====================================================
  // SLIDE 3: LTE FRAMEWORK (Methods)
  // =====================================================
  let s3 = pres.addSlide();
  s3.background = { color: C.slideBg };

  s3.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });
  s3.addText("METHODS", {
    x: 0.6, y: 0.25, w: 5, h: 0.35,
    fontSize: 10, fontFace: "Calibri", color: C.teal, bold: true, charSpacing: 3, margin: 0
  });

  s3.addText("LTE Framework: Two-Phase Approach", {
    x: 0.6, y: 0.6, w: 8, h: 0.55,
    fontSize: 28, fontFace: "Georgia", color: C.navy, bold: true, margin: 0
  });

  // Phase 1 card
  s3.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.35, w: 4.3, h: 2.9, fill: { color: C.white }, shadow: cardShadow() });
  s3.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.35, w: 4.3, h: 0.06, fill: { color: C.teal } });

  s3.addText("Phase 1: Alignment (One-Time)", {
    x: 0.8, y: 1.55, w: 3.8, h: 0.4,
    fontSize: 15, fontFace: "Calibri", color: C.teal, bold: true, margin: 0
  });

  s3.addText([
    { text: "Fine-tune on curated parallel dataset", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "Prompt format:", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "  [Updated Information]{edit}", options: { breakLine: true, fontSize: 11, fontFace: "Consolas", color: C.teal } },
    { text: "  [Query]{question}", options: { breakLine: true, fontSize: 11, fontFace: "Consolas", color: C.teal } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "Trains 3 capabilities:", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "  \u2022 In-scope: use edited facts correctly", options: { breakLine: true, fontSize: 11 } },
    { text: "  \u2022 Out-of-scope: preserve unrelated knowledge", options: { breakLine: true, fontSize: 11 } },
    { text: "  \u2022 Linguistic: maintain fluency", options: { fontSize: 11 } },
  ], {
    x: 0.8, y: 2.0, w: 3.8, h: 2.1,
    fontFace: "Calibri", color: C.darkText, margin: 0
  });

  // Arrow between phases
  s3.addImage({ data: iconArrow, x: 4.85, y: 2.5, w: 0.3, h: 0.3 });

  // Phase 2 card
  s3.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.35, w: 4.3, h: 2.9, fill: { color: C.white }, shadow: cardShadow() });
  s3.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.35, w: 4.3, h: 0.06, fill: { color: C.accent } });

  s3.addText("Phase 2: Inference (Real-Time)", {
    x: 5.5, y: 1.55, w: 3.8, h: 0.4,
    fontSize: 15, fontFace: "Calibri", color: C.accent, bold: true, margin: 0
  });

  s3.addText([
    { text: "No further training needed!", options: { bullet: true, breakLine: true, fontSize: 12, bold: true } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "Retrieval mechanism pulls relevant edit from memory bank", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "Supports real-time batch & sequential editing", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "No parameter updates at inference time", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "Scales to unlimited new edits", options: { bullet: true, fontSize: 12 } },
  ], {
    x: 5.5, y: 2.0, w: 3.8, h: 2.1,
    fontFace: "Calibri", color: C.darkText, margin: 0
  });

  // Figure from paper at bottom
  s3.addImage({ path: path.resolve("G:/PPD/image (1).png"), x: 0.8, y: 4.4, w: 8.4, h: 1.1, sizing: { type: "contain", w: 8.4, h: 1.1 } });


  // =====================================================
  // SLIDE 4: DATASETS & LLMs
  // =====================================================
  let s4 = pres.addSlide();
  s4.background = { color: C.slideBg };

  s4.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });
  s4.addText("DATASETS & LLMS", {
    x: 0.6, y: 0.25, w: 5, h: 0.35,
    fontSize: 10, fontFace: "Calibri", color: C.teal, bold: true, charSpacing: 3, margin: 0
  });

  s4.addText("Reproduction Scope", {
    x: 0.6, y: 0.6, w: 8, h: 0.55,
    fontSize: 30, fontFace: "Georgia", color: C.navy, bold: true, margin: 0
  });

  // 4 cards in a 2x2 grid
  const cardDefs = [
    { title: "Methods", icon: iconCogs, items: ["LTE-LoRA (main)", "ROME (baseline)", "ICE (baseline)"], x: 0.5, y: 1.35, color: C.teal },
    { title: "Datasets", icon: iconDatabase, items: ["ZsRE (1,304 test examples)", "WikiDatacounterfact (885 test)"], x: 5.2, y: 1.35, color: C.midBlue },
    { title: "Backbone", icon: iconBrainTeal, items: ["LLaMA-2-Chat-7B", "4-bit QLoRA quantization", "via HuggingFace (NousResearch)"], x: 0.5, y: 3.2, color: C.teal },
    { title: "Metrics", icon: iconChart, items: ["Edit Success", "Portability", "Locality", "Fluency"], x: 5.2, y: 3.2, color: C.midBlue },
  ];

  for (const cd of cardDefs) {
    s4.addShape(pres.shapes.RECTANGLE, { x: cd.x, y: cd.y, w: 4.3, h: 1.6, fill: { color: C.white }, shadow: cardShadow() });
    s4.addShape(pres.shapes.RECTANGLE, { x: cd.x, y: cd.y, w: 0.08, h: 1.6, fill: { color: cd.color } });

    s4.addImage({ data: cd.icon, x: cd.x + 0.3, y: cd.y + 0.15, w: 0.3, h: 0.3 });
    s4.addText(cd.title, {
      x: cd.x + 0.7, y: cd.y + 0.15, w: 3, h: 0.35,
      fontSize: 15, fontFace: "Calibri", color: cd.color, bold: true, margin: 0
    });

    const textArr = cd.items.map((item, i) => ({
      text: item,
      options: { bullet: true, breakLine: i < cd.items.length - 1, fontSize: 12 }
    }));
    s4.addText(textArr, {
      x: cd.x + 0.35, y: cd.y + 0.55, w: 3.6, h: 1.0,
      fontFace: "Calibri", color: C.darkText, margin: 0
    });
  }

  // Scoping note
  s4.addText("Scoped down from full 2-model x 4-benchmark table for a rigorous partial reproduction", {
    x: 0.6, y: 5.05, w: 8.8, h: 0.35,
    fontSize: 11, fontFace: "Calibri", color: C.mutedText, italic: true, align: "center", margin: 0
  });


  // =====================================================
  // SLIDE 5: REPRODUCTION PIPELINE
  // =====================================================
  let s5 = pres.addSlide();
  s5.background = { color: C.slideBg };

  s5.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });
  s5.addText("METHODS", {
    x: 0.6, y: 0.25, w: 5, h: 0.35,
    fontSize: 10, fontFace: "Calibri", color: C.teal, bold: true, charSpacing: 3, margin: 0
  });

  s5.addText("Reproduction Pipeline", {
    x: 0.6, y: 0.6, w: 8, h: 0.55,
    fontSize: 30, fontFace: "Georgia", color: C.navy, bold: true, margin: 0
  });

  // Pipeline steps as horizontal flow
  const steps = [
    { num: "1", title: "Data Prep", desc: "Download ZsRE +\nWikiData_cf via\nEasyEdit / KnowEdit", color: C.midBlue },
    { num: "2", title: "Alignment", desc: "LTE-LoRA training\non A100 (QLoRA)\nSFTTrainer + PEFT", color: C.teal },
    { num: "3", title: "Baselines", desc: "Run ICE + ROME\nvia EasyEdit\n(no training needed)", color: C.midBlue },
    { num: "4", title: "Evaluation", desc: "4 metrics on\nboth datasets\n+ gap analysis", color: C.teal },
  ];

  for (let i = 0; i < steps.length; i++) {
    const sx = 0.5 + i * 2.35;

    // Step card
    s5.addShape(pres.shapes.RECTANGLE, { x: sx, y: 1.5, w: 2.05, h: 2.5, fill: { color: C.white }, shadow: cardShadow() });

    // Number circle
    s5.addShape(pres.shapes.OVAL, { x: sx + 0.75, y: 1.7, w: 0.55, h: 0.55, fill: { color: steps[i].color } });
    s5.addText(steps[i].num, {
      x: sx + 0.75, y: 1.7, w: 0.55, h: 0.55,
      fontSize: 18, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle", margin: 0
    });

    // Step title
    s5.addText(steps[i].title, {
      x: sx + 0.1, y: 2.4, w: 1.85, h: 0.35,
      fontSize: 14, fontFace: "Calibri", color: steps[i].color, bold: true, align: "center", margin: 0
    });

    // Step description
    s5.addText(steps[i].desc, {
      x: sx + 0.1, y: 2.8, w: 1.85, h: 1.0,
      fontSize: 11, fontFace: "Calibri", color: C.darkText, align: "center", margin: 0
    });

    // Arrow between steps
    if (i < steps.length - 1) {
      s5.addText("\u25B6", {
        x: sx + 2.05, y: 2.4, w: 0.3, h: 0.5,
        fontSize: 14, fontFace: "Calibri", color: C.teal, align: "center", valign: "middle", margin: 0
      });
    }
  }

  // Software stack bar at bottom
  s5.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.35, w: 9, h: 0.6, fill: { color: C.darkBlue } });
  s5.addText("Software: EasyEdit  |  HuggingFace Transformers + PEFT  |  TRL (SFTTrainer)  |  bitsandbytes  |  Google Colab A100", {
    x: 0.5, y: 4.35, w: 9, h: 0.6,
    fontSize: 11, fontFace: "Calibri", color: C.lightBlue, align: "center", valign: "middle", margin: 0
  });


  // =====================================================
  // SLIDE 6: RESULTS TABLE
  // =====================================================
  let s6 = pres.addSlide();
  s6.background = { color: C.slideBg };

  s6.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });
  s6.addText("EXPERIMENTS", {
    x: 0.6, y: 0.25, w: 5, h: 0.35,
    fontSize: 10, fontFace: "Calibri", color: C.teal, bold: true, charSpacing: 3, margin: 0
  });

  s6.addText("Results: Partial Table 1 Reproduction", {
    x: 0.6, y: 0.6, w: 8, h: 0.55,
    fontSize: 28, fontFace: "Georgia", color: C.navy, bold: true, margin: 0
  });

  s6.addText("LLaMA-2-Chat-7B  |  Single Editing  |  ZsRE & WikiDatacounterfact", {
    x: 0.6, y: 1.1, w: 8, h: 0.3,
    fontSize: 12, fontFace: "Calibri", color: C.mutedText, italic: true, margin: 0
  });

  // Results table
  const headerOpts = { fill: { color: C.teal }, color: C.white, bold: true, fontSize: 12, fontFace: "Calibri", align: "center", valign: "middle" };
  const cellOpts = { fontSize: 12, fontFace: "Calibri", align: "center", valign: "middle", color: C.darkText };
  const bestOpts = { ...cellOpts, bold: true, color: C.successGreen };
  const methodOpts = { ...cellOpts, align: "left", bold: true };

  const tableData = [
    [
      { text: "Method", options: { ...headerOpts, align: "left" } },
      { text: "Dataset", options: headerOpts },
      { text: "Edit Succ. (%)", options: headerOpts },
      { text: "Portability (%)", options: headerOpts },
      { text: "Locality (%)", options: headerOpts },
      { text: "Fluency", options: headerOpts },
    ],
    [
      { text: "ICE", options: methodOpts },
      { text: "ZsRE", options: cellOpts },
      { text: "72.9", options: cellOpts },
      { text: "30.0", options: cellOpts },
      { text: "70.6", options: { ...bestOpts } },
      { text: "537.2", options: cellOpts },
    ],
    [
      { text: "ROME", options: methodOpts },
      { text: "ZsRE", options: cellOpts },
      { text: "96.4", options: cellOpts },
      { text: "46.6", options: cellOpts },
      { text: "52.8", options: cellOpts },
      { text: "535.3", options: cellOpts },
    ],
    [
      { text: "LTE-LoRA", options: { ...methodOpts, color: C.teal } },
      { text: "ZsRE", options: cellOpts },
      { text: "99.9", options: bestOpts },
      { text: "67.4", options: bestOpts },
      { text: "51.7", options: cellOpts },
      { text: "551.1", options: bestOpts },
    ],
    [
      { text: "ICE", options: methodOpts },
      { text: "WikiData_cf", options: cellOpts },
      { text: "73.1", options: cellOpts },
      { text: "37.7", options: cellOpts },
      { text: "37.2", options: cellOpts },
      { text: "539.5", options: cellOpts },
    ],
    [
      { text: "ROME", options: methodOpts },
      { text: "WikiData_cf", options: cellOpts },
      { text: "99.9", options: bestOpts },
      { text: "9.2", options: cellOpts },
      { text: "61.5", options: bestOpts },
      { text: "545.2", options: cellOpts },
    ],
    [
      { text: "LTE-LoRA", options: { ...methodOpts, color: C.teal } },
      { text: "WikiData_cf", options: cellOpts },
      { text: "99.9", options: bestOpts },
      { text: "53.7", options: bestOpts },
      { text: "25.1", options: cellOpts },
      { text: "551.6", options: bestOpts },
    ],
  ];

  s6.addTable(tableData, {
    x: 0.5, y: 1.55, w: 9.0,
    colW: [1.3, 1.5, 1.5, 1.5, 1.4, 1.1],
    border: { pt: 0.5, color: "D0D0D0" },
    rowH: [0.4, 0.38, 0.38, 0.42, 0.38, 0.38, 0.42],
    autoPage: false,
  });

  // Key takeaway box
  s6.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.65, w: 9.0, h: 0.7, fill: { color: C.navy } });
  s6.addImage({ data: iconBulb, x: 0.8, y: 4.78, w: 0.35, h: 0.35 });
  s6.addText([
    { text: "Key: ", options: { bold: true, color: C.gold } },
    { text: "LTE-LoRA achieves 99.9% edit success and +21pt portability improvement over prior SOTA", options: { color: C.white } },
  ], {
    x: 1.3, y: 4.65, w: 7.8, h: 0.7,
    fontSize: 13, fontFace: "Calibri", valign: "middle", margin: 0
  });

  s6.addText("Numbers from the original paper (Jiang et al., 2024, Table 1). Green = best in column.", {
    x: 0.6, y: 5.15, w: 8.5, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: C.lightMuted, margin: 0
  });


  // =====================================================
  // SLIDE 7: CHALLENGES
  // =====================================================
  let s7 = pres.addSlide();
  s7.background = { color: C.slideBg };

  s7.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });
  s7.addText("EXPERIMENTS", {
    x: 0.6, y: 0.25, w: 5, h: 0.35,
    fontSize: 10, fontFace: "Calibri", color: C.teal, bold: true, charSpacing: 3, margin: 0
  });

  s7.addText("Challenges & Reproducibility Findings", {
    x: 0.6, y: 0.6, w: 8.5, h: 0.55,
    fontSize: 28, fontFace: "Georgia", color: C.navy, bold: true, margin: 0
  });

  // 4 challenge cards in 2x2
  const challenges = [
    { title: "Hardware Limitations", desc: "Local GPU: RTX 5060 (8 GB VRAM)\nFull LTE needs ~14 GB \u2192 used QLoRA\n4-bit quantization for A100 training", x: 0.5, y: 1.3 },
    { title: "Dependency Conflicts", desc: "Colab Python 3.12 + transformers v5\nincompatible with original FastChat code\nRequired 8 patches to training script", x: 5.2, y: 1.3 },
    { title: "Training Pipeline Issues", desc: "FastChat preprocessor produced loss=0\nSwitched to TRL SFTTrainer\nflash-attn failed to compile on Colab", x: 0.5, y: 3.0 },
    { title: "Scope Decisions", desc: "2 of 4 datasets (ZsRE, WikiData_cf)\n1 of 2 backbones (LLaMA-2 only)\n3 of 7 methods (LTE-LoRA, ROME, ICE)", x: 5.2, y: 3.0 },
  ];

  for (const ch of challenges) {
    s7.addShape(pres.shapes.RECTANGLE, { x: ch.x, y: ch.y, w: 4.3, h: 1.45, fill: { color: C.white }, shadow: cardShadow() });
    s7.addShape(pres.shapes.RECTANGLE, { x: ch.x, y: ch.y, w: 0.08, h: 1.45, fill: { color: C.accent } });

    s7.addText(ch.title, {
      x: ch.x + 0.3, y: ch.y + 0.1, w: 3.7, h: 0.3,
      fontSize: 14, fontFace: "Calibri", color: C.accent, bold: true, margin: 0
    });
    s7.addText(ch.desc, {
      x: ch.x + 0.3, y: ch.y + 0.45, w: 3.7, h: 0.9,
      fontSize: 11, fontFace: "Calibri", color: C.darkText, margin: 0
    });
  }

  // Takeaway
  s7.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.7, w: 9, h: 0.55, fill: { color: C.navy } });
  s7.addText("The original code does not run out-of-the-box with current library versions \u2014 a real reproducibility finding", {
    x: 0.8, y: 4.7, w: 8.5, h: 0.55,
    fontSize: 12, fontFace: "Calibri", color: C.lightBlue, align: "center", valign: "middle", italic: true, margin: 0
  });


  // =====================================================
  // SLIDE 8: EXTENSION - LLaMA-3-8B
  // =====================================================
  let s8 = pres.addSlide();
  s8.background = { color: C.slideBg };

  s8.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });
  s8.addText("EXTENSION", {
    x: 0.6, y: 0.25, w: 5, h: 0.35,
    fontSize: 10, fontFace: "Calibri", color: C.teal, bold: true, charSpacing: 3, margin: 0
  });

  s8.addText("Extension: LLaMA-3-8B Backbone", {
    x: 0.6, y: 0.6, w: 8, h: 0.55,
    fontSize: 28, fontFace: "Georgia", color: C.navy, bold: true, margin: 0
  });

  // Goal card
  s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.35, w: 9, h: 1.1, fill: { color: C.white }, shadow: cardShadow() });
  s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.35, w: 0.08, h: 1.1, fill: { color: C.teal } });

  s8.addImage({ data: iconRocket, x: 0.8, y: 1.5, w: 0.35, h: 0.35 });
  s8.addText("Goal", {
    x: 1.25, y: 1.5, w: 2, h: 0.35,
    fontSize: 15, fontFace: "Calibri", color: C.teal, bold: true, margin: 0
  });
  s8.addText("Apply LTE-LoRA to Meta-LLaMA-3-8B-Instruct \u2014 a newer model with a different tokenizer, pre-training corpus, and stronger instruction-following. Tests whether LTE generalizes across model generations.", {
    x: 0.8, y: 1.9, w: 8.4, h: 0.45,
    fontSize: 12, fontFace: "Calibri", color: C.darkText, margin: 0
  });

  // Hypothesis card
  s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.65, w: 4.3, h: 1.5, fill: { color: C.white }, shadow: cardShadow() });
  s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.65, w: 0.08, h: 1.5, fill: { color: C.gold } });

  s8.addImage({ data: iconBulb, x: 0.8, y: 2.8, w: 0.3, h: 0.3 });
  s8.addText("Hypothesis", {
    x: 1.2, y: 2.8, w: 3, h: 0.3,
    fontSize: 14, fontFace: "Calibri", color: C.gold, bold: true, margin: 0, valign: "middle"
  });
  s8.addText([
    { text: "Edit Success: comparable or better (stronger base model)", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "Locality: may differ (different internal knowledge distribution)", options: { bullet: true, fontSize: 12 } },
  ], {
    x: 0.8, y: 3.2, w: 3.8, h: 0.8,
    fontFace: "Calibri", color: C.darkText, margin: 0
  });

  // Feasibility card
  s8.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 2.65, w: 4.3, h: 1.5, fill: { color: C.white }, shadow: cardShadow() });
  s8.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 2.65, w: 0.08, h: 1.5, fill: { color: C.successGreen } });

  s8.addImage({ data: iconCheck, x: 5.5, y: 2.8, w: 0.3, h: 0.3 });
  s8.addText("Feasibility", {
    x: 5.9, y: 2.8, w: 3, h: 0.3,
    fontSize: 14, fontFace: "Calibri", color: C.successGreen, bold: true, margin: 0, valign: "middle"
  });
  s8.addText([
    { text: "Inference-only evaluation (no re-training)", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "Swap backbone, reuse existing LTE-LoRA checkpoint", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "Fallback if reproduction overruns", options: { bullet: true, fontSize: 12 } },
  ], {
    x: 5.5, y: 3.2, w: 3.8, h: 0.8,
    fontFace: "Calibri", color: C.darkText, margin: 0
  });


  // =====================================================
  // SLIDE 9: RESOURCES
  // =====================================================
  let s9 = pres.addSlide();
  s9.background = { color: C.slideBg };

  s9.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });
  s9.addText("RESOURCES", {
    x: 0.6, y: 0.25, w: 5, h: 0.35,
    fontSize: 10, fontFace: "Calibri", color: C.teal, bold: true, charSpacing: 3, margin: 0
  });

  s9.addText("Computational Resources", {
    x: 0.6, y: 0.6, w: 8, h: 0.55,
    fontSize: 30, fontFace: "Georgia", color: C.navy, bold: true, margin: 0
  });

  // 3 resource cards
  const resources = [
    { title: "Local GPU", desc: "NVIDIA RTX 5060 Laptop\n8.15 GB VRAM\nBlackwell architecture, CUDA 12.9\nPrototyping + debugging + small eval", x: 0.5, color: C.midBlue },
    { title: "Cloud Compute", desc: "Google Colab Pro (A100 40GB)\nFull alignment training + evaluation\n$100 AWS student credit budget\n4\u20138 hour training time estimate", x: 3.5, color: C.teal },
    { title: "Software Stack", desc: "Authors' LTE codebase (GitHub)\nEasyEdit for baselines\nHuggingFace Transformers + PEFT\nbitsandbytes (4-bit quantization)", x: 6.5, color: C.midBlue },
  ];

  for (const r of resources) {
    s9.addShape(pres.shapes.RECTANGLE, { x: r.x, y: 1.35, w: 2.8, h: 2.8, fill: { color: C.white }, shadow: cardShadow() });
    s9.addShape(pres.shapes.RECTANGLE, { x: r.x, y: 1.35, w: 2.8, h: 0.06, fill: { color: r.color } });

    s9.addText(r.title, {
      x: r.x + 0.2, y: 1.55, w: 2.4, h: 0.35,
      fontSize: 15, fontFace: "Calibri", color: r.color, bold: true, align: "center", margin: 0
    });
    s9.addText(r.desc, {
      x: r.x + 0.2, y: 2.0, w: 2.4, h: 2.0,
      fontSize: 11, fontFace: "Calibri", color: C.darkText, align: "center", margin: 0
    });
  }

  // Cost note
  s9.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.4, w: 9, h: 0.5, fill: { color: C.navy } });
  s9.addText("Total cloud cost well within $100 budget  |  All code publicly available at github.com/YJiangcm/LTE", {
    x: 0.5, y: 4.4, w: 9, h: 0.5,
    fontSize: 12, fontFace: "Calibri", color: C.lightBlue, align: "center", valign: "middle", margin: 0
  });


  // =====================================================
  // SLIDE 10: SUMMARY & THANK YOU (dark)
  // =====================================================
  let s10 = pres.addSlide();
  s10.background = { color: C.navy };

  s10.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.teal } });

  s10.addText("Summary", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.55,
    fontSize: 32, fontFace: "Georgia", color: C.white, bold: true, align: "center", margin: 0
  });

  // Summary points with icons
  const summaryItems = [
    { icon: iconCheckWhite, text: "Reproducing LTE (ACL 2024) \u2014 a framework that teaches LLMs how to apply knowledge edits" },
    { icon: iconCheckWhite, text: "Focused on LTE-LoRA + 2 baselines (ROME, ICE) on 2 datasets (ZsRE, WikiDatacounterfact)" },
    { icon: iconCheckWhite, text: "LTE-LoRA achieves 99.9% edit success with +21pt portability gain over prior SOTA" },
    { icon: iconRocketWhite, text: "Extension: testing generalization to LLaMA-3-8B-Instruct" },
    { icon: iconBulbWhite, text: "Key finding: original code requires significant patches for current library versions" },
  ];

  for (let i = 0; i < summaryItems.length; i++) {
    const sy = 1.2 + i * 0.65;
    s10.addImage({ data: summaryItems[i].icon, x: 1.2, y: sy + 0.05, w: 0.3, h: 0.3 });
    s10.addText(summaryItems[i].text, {
      x: 1.7, y: sy, w: 7.2, h: 0.5,
      fontSize: 14, fontFace: "Calibri", color: C.lightBlue, valign: "middle", margin: 0
    });
  }

  // Separator
  s10.addShape(pres.shapes.LINE, { x: 3, y: 4.5, w: 4, h: 0, line: { color: C.accent, width: 2 } });

  // Thank you
  s10.addText("Thank You \u2014 Questions?", {
    x: 0.8, y: 4.7, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Georgia", color: C.white, bold: true, align: "center", margin: 0
  });

  // References
  s10.addText("References: Jiang et al. (2024) ACL  |  Wang et al. (2024) EasyEdit  |  github.com/YJiangcm/LTE", {
    x: 0.8, y: 5.15, w: 8.4, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: C.lightMuted, align: "center", margin: 0
  });

  // Write file
  await pres.writeFile({ fileName: path.resolve("G:/PPD/LTE_Presentation_Final.pptx") });
  console.log("Presentation saved to G:/PPD/LTE_Presentation_Final.pptx");
}

main().catch(err => { console.error(err); process.exit(1); });
