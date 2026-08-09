#!/usr/bin/env node
/**
 * [INPUT]: 读取一个 Markdown 场景计划（Frame / Beat / Scene / 镜头 / 场景标题）
 * [OUTPUT]: 向 stdout 输出可供 Remotion SCENES 实现使用的规范化计划 JSON；无效计划以非零退出
 * [POS]: remotion-kit 的场景计划门槛；由 remotion-scenes skill 在改写 composition 前调用
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 *
 * Adapted from HeyGen HyperFrames `skills/faceless-explainer/scripts/lib/storyboard.mjs`
 * and `skills/product-launch-video/scripts/lib/storyboard.mjs` (Apache-2.0, Copyright 2026 HeyGen, Inc.).
 * This adaptation accepts Chinese scene headings and adds Recut's one-message-per-scene gates.
 */
import fs from "node:fs";
import path from "node:path";

const FRAME_HEADING = /^(#{2,3})[ \t]+(?:(?:frame|beat|scene)\b|(?:镜头|场景)(?=\s|$))/i;
const HEADING = /^(#{1,6})\s+/;
const META = /^\s*[-*]\s+([A-Za-z_\u4E00-\u9FFF][\w\-\u4E00-\u9FFF]*)\s*:\s*(.+?)\s*$/;
const DURATION = /(\d+(?:\.\d+)?)/;
const TRANSITION_KEYS = new Set(["transition_in", "transitionin", "transition"]);
const NARRATION_KEYS = new Set(["voiceover", "vo", "voice_over", "narration", "旁白"]);
const SCENE_KEYS = new Set(["scene", "description", "summary", "caption", "画面"]);

const stripQuotes = (value) => {
  if (value.length < 2) return value;
  const first = value[0];
  const last = value[value.length - 1];
  return (first === "\"" && last === "\"") || (first === "'" && last === "'") ? value.slice(1, -1) : value;
};

const parseHeading = (text) => {
  const match = /^(\d+)/.exec(text);
  if (!match) return { title: text.trim() };
  const title = text.slice(match[0].length).replace(/^[\s.:·—-]+/, "").trim();
  return { number: Number.parseInt(match[1], 10), title };
};

const assignMeta = (frame, key, value, warnings, line) => {
  if (key === "duration" || key === "时长") {
    frame.duration = value;
    const match = DURATION.exec(value);
    if (match) frame.durationSeconds = Number.parseFloat(match[1]);
    else warnings.push({ line, message: `无法解析时长：${value}` });
    return;
  }
  if (key === "status") { frame.status = value.toLowerCase(); return; }
  if (key === "poster") { frame.poster = Number.parseFloat(DURATION.exec(value)?.[1] || ""); return; }
  if (key === "src") { frame.src = value; return; }
  if (TRANSITION_KEYS.has(key)) { frame.transitionIn = value; return; }
  if (NARRATION_KEYS.has(key)) { frame.voiceover = stripQuotes(value); return; }
  if (SCENE_KEYS.has(key)) { frame.scene = value; return; }
  frame.extra[key] = value;
};

export function parseScenePlan(source) {
  const warnings = [];
  const lines = source.split(/\r?\n/);
  const frames = [];
  let current = null;

  lines.forEach((line, index) => {
    const open = FRAME_HEADING.exec(line);
    if (open) {
      const text = line.slice(open[0].length).replace(/^[\s.:—-]+/, "").trim();
      current = { index: frames.length + 1, status: "outline", narrative: "", extra: {}, headingLine: index + 1, level: open[1].length, ...parseHeading(text), lines: [] };
      frames.push(current);
      return;
    }
    if (current && HEADING.test(line) && (HEADING.exec(line)?.[1].length || 7) <= current.level) {
      current = null;
      return;
    }
    if (current) current.lines.push({ line, number: index + 1 });
  });

  const normalized = frames.map((frame) => {
    const narrative = [];
    frame.lines.forEach(({ line, number }) => {
      const meta = META.exec(line);
      if (meta) assignMeta(frame, meta[1].toLowerCase(), meta[2].trim(), warnings, number);
      else narrative.push(line);
    });
    frame.narrative = narrative.join("\n").trim();
    delete frame.lines;
    delete frame.level;
    delete frame.headingLine;
    return frame;
  });
  return { frames: normalized, warnings };
}

export function validateScenePlan(plan) {
  const errors = [];
  if (plan.frames.length < 3) errors.push("至少需要 3 个场景：钩子、信息推进和收束。");
  plan.frames.forEach((frame) => {
    if (!frame.title) errors.push(`场景 ${frame.index} 缺少标题。`);
    if (!frame.scene && !frame.narrative) errors.push(`场景 ${frame.index} 缺少画面或叙事说明。`);
    if (!Number.isFinite(frame.durationSeconds) || frame.durationSeconds <= 0) errors.push(`场景 ${frame.index} 需要正数时长（例如 - duration: 5s）。`);
    if (frame.durationSeconds > 10) errors.push(`场景 ${frame.index} 超过 10 秒；请拆成单一信息镜头。`);
  });
  return errors;
}

const input = process.argv[2];
if (!input) {
  console.error("usage: node validate-scene-plan.mjs <SCENE_PLAN.md>");
  process.exit(2);
}

const plan = parseScenePlan(fs.readFileSync(input, "utf8"));
const errors = validateScenePlan(plan);
const output = { source: path.basename(input), frames: plan.frames, warnings: plan.warnings, errors, durationSeconds: plan.frames.reduce((sum, frame) => sum + (frame.durationSeconds || 0), 0) };
console.log(JSON.stringify(output, null, 2));
process.exit(errors.length ? 1 : 0);
