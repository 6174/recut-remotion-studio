#!/usr/bin/env node
/**
 * [INPUT]: 依赖 src/html-canvas 的纯函数模块（timeline/targets/interaction）
 * [OUTPUT]: 运行 node:test 的确定性单元测试；先测数学，再测像素实现
 * [POS]: remotion-kit 的 html-canvas 纯函数测试；node 24 类型剥离直接跑 .ts
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import test from "node:test";
import assert from "node:assert/strict";
import { clamp, ease, effectProgress, interpolatePoint } from "../src/html-canvas/timeline.ts";
import { targetCenter, targetBounds, containsPoint, expandRect, rectCenter } from "../src/html-canvas/targets.ts";
import { resolveInteractionState, resolvePointer, pathPointAt, sortEvents } from "../src/html-canvas/interaction.ts";

test("timeline: clamp 夹取边界", () => {
  assert.equal(clamp(5, 0, 3), 3);
  assert.equal(clamp(-2, 0, 3), 0);
  assert.equal(clamp(1.5, 0, 3), 1.5);
});

test("timeline: ease 单调且有界", () => {
  for (const name of ["linear", "easeIn", "easeOut", "easeInOut", undefined]) {
    assert.equal(ease(name, 0), 0);
    assert.equal(ease(name, 1), 1);
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const v = ease(name, t);
      assert.ok(v >= 0 && v <= 1, `${name} ${t} -> ${v}`);
    }
  }
  assert.ok(ease("easeIn", 0.5) < 0.5, "easeIn 前段慢");
  assert.ok(ease("easeOut", 0.5) > 0.5, "easeOut 前段快");
});

test("timeline: effectProgress 生命周期与边界", () => {
  const timing = { startFrame: 10, enterFrames: 5, holdFrames: 5, exitFrames: 5 };
  assert.deepEqual(effectProgress(timing, 9), { phase: "before", local: -1, enter: 0, exit: 0, active: false });
  assert.deepEqual(effectProgress(timing, 10).phase, "enter");
  assert.equal(effectProgress(timing, 12).enter, 0.4);
  assert.equal(effectProgress(timing, 14).phase, "enter");
  assert.equal(effectProgress(timing, 15).phase, "play");
  assert.equal(effectProgress(timing, 19).phase, "play");
  assert.equal(effectProgress(timing, 20).phase, "exit");
  assert.equal(effectProgress(timing, 20).exit, 0);
  assert.equal(effectProgress(timing, 21).phase, "exit");
  assert.equal(effectProgress(timing, 24).exit, 0.8);
  assert.equal(effectProgress(timing, 25).phase, "after");
  assert.equal(effectProgress(timing, 100).active, false);
});

test("timeline: 无 hold 时 play 后直接 exit", () => {
  const timing = { startFrame: 0, enterFrames: 3, exitFrames: 2 };
  assert.equal(effectProgress(timing, 2).phase, "enter");
  assert.equal(effectProgress(timing, 3).phase, "exit");
  assert.equal(effectProgress(timing, 4).exit, 0.5);
  assert.equal(effectProgress(timing, 6).active, false);
});

test("timeline: interpolatePoint 按 easing 插值", () => {
  const mid = interpolatePoint({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5);
  assert.deepEqual(mid, { x: 5, y: 10 });
  const eased = interpolatePoint({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5, "easeInOut");
  assert.equal(eased.x, 5);
  assert.equal(eased.y, 10);
});

test("targets: targetCenter 各 kind", () => {
  assert.deepEqual(targetCenter({ kind: "rect", rect: { x: 100, y: 50, width: 200, height: 100 } }), { x: 200, y: 100 });
  assert.deepEqual(targetCenter({ kind: "circle", cx: 30, cy: 40, radius: 10 }), { x: 30, y: 40 });
  assert.deepEqual(targetCenter({ kind: "path", points: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 10 }] }), { x: 5, y: 10 / 3 });
});

test("targets: containsPoint 命中判定", () => {
  const rect = { kind: "rect", rect: { x: 0, y: 0, width: 100, height: 50 } };
  assert.ok(containsPoint(rect, { x: 50, y: 25 }));
  assert.ok(!containsPoint(rect, { x: 101, y: 25 }));
  const circle = { kind: "circle", cx: 0, cy: 0, radius: 10 };
  assert.ok(containsPoint(circle, { x: 7, y: 7 }));
  assert.ok(!containsPoint(circle, { x: 8, y: 8 }));
});

test("targets: targetBounds 与 expandRect", () => {
  const circle = { kind: "circle", cx: 100, cy: 100, radius: 50 };
  assert.deepEqual(targetBounds(circle), { x: 50, y: 50, width: 100, height: 100 });
  assert.deepEqual(expandRect({ x: 10, y: 10, width: 20, height: 20 }, 5), { x: 5, y: 5, width: 30, height: 30 });
  assert.deepEqual(rectCenter({ x: 10, y: 10, width: 20, height: 20 }), { x: 20, y: 20 });
});

const EVENTS = [
  { kind: "move", frame: 10, x: 0, y: 0 },
  { kind: "move", frame: 30, x: 100, y: 50, easing: "easeInOut" },
  { kind: "hover", frame: 40, targetId: "btn" },
  { kind: "click", frame: 50, targetId: "btn" },
];

test("interaction: sortEvents 稳定排序（drag 用 startFrame）", () => {
  const sorted = sortEvents([...EVENTS, { kind: "drag", startFrame: 20, endFrame: 25, from: { x: 0, y: 0 }, to: { x: 10, y: 0 } }]);
  assert.deepEqual(sorted.map((e) => (e.kind === "drag" ? e.startFrame : e.frame)), [10, 20, 30, 40, 50]);
});

test("interaction: pathPointAt 线性与缓动插值", () => {
  assert.deepEqual(pathPointAt(EVENTS, 10), { x: 0, y: 0 });
  assert.deepEqual(pathPointAt(EVENTS, 20), { x: 50, y: 25 });
  // frame 25 = t 0.75，easeInOut(0.75) = 0.9375
  const eased = pathPointAt(EVENTS, 25);
  assert.equal(eased.x, 93.75);
  assert.equal(eased.y, 46.875);
  assert.deepEqual(pathPointAt(EVENTS, 100), { x: 100, y: 50 });
});

test("interaction: resolveInteractionState 语义状态与 pressed 窗口", () => {
  const atPress = resolveInteractionState(EVENTS, 52);
  assert.equal(atPress.hoveredTargetId, "btn");
  assert.equal(atPress.pressedTargetId, "btn");
  assert.equal(atPress.clicks.length, 1);
  assert.deepEqual(atPress.pointer, { x: 100, y: 50 });

  const afterWindow = resolveInteractionState(EVENTS, 62);
  assert.equal(afterWindow.pressedTargetId, null, "press 状态按窗口自动清除");
  assert.equal(afterWindow.hoveredTargetId, "btn");
});

test("interaction: drag 阶段覆盖指针位置", () => {
  const events = [
    { kind: "drag", startFrame: 0, endFrame: 20, from: { x: 0, y: 0 }, to: { x: 80, y: 40 } },
  ];
  const mid = resolveInteractionState(events, 10);
  assert.deepEqual(mid.pointer, { x: 40, y: 20 });
  assert.equal(mid.drag?.progress, 0.5);
  assert.equal(resolveInteractionState(events, 30).drag, null);
});

test("interaction: scroll 取最近事件的绝对偏移", () => {
  const events = [
    { kind: "scroll", frame: 10, targetId: "list", offsetY: 20 },
    { kind: "scroll", frame: 40, targetId: "list", offsetY: 160 },
  ];
  assert.equal(resolveInteractionState(events, 30).scrollOffsetY, 20);
  assert.equal(resolveInteractionState(events, 50).scrollOffsetY, 160);
  assert.equal(resolveInteractionState(events, 50).scrollTargetId, "list");
});

test("interaction: resolvePointer 无 move 时回退目标中心", () => {
  const targets = { btn: { kind: "rect", rect: { x: 100, y: 100, width: 200, height: 100 } } };
  const events = [{ kind: "hover", frame: 10, targetId: "btn" }];
  const p = resolvePointer(events, 20, targets);
  assert.deepEqual(p, { x: 200, y: 150 });
  assert.equal(resolvePointer([], 0), null);
});
