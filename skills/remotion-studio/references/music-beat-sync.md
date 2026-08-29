# music-beat-sync — remotion-studio 介质映射（薄适配层）

> 决策规则权威来源：`service/skills/recut-directing-editing`；本文件仅保留 remotion-studio 介质映射
>
> 本文件是 remotion-studio 对全局 `recut-directing-editing` 的薄适配层。卡点纪律、节拍网格、鼓点定位、渲后回测的**决策规则**以全局为准；本文件只保留"如何在 Remotion/composition 代码中落拍"的介质映射。

## 权威来源

- **决策规则**：`service/skills/recut-directing-editing/SKILL.md` §3（卡点纪律）+ `service/skills/recut-directing-editing/references/music-beat-sync.md`（合并版，含 editor/remotion 双介质分层、节拍网格拟合、鼓点定位、渲后回测）。
- **本文件**：仅保留 Remotion 侧的 `beatF`/`SHOTS` 常量化写法与工具备忘。

## 何时启用（转述全局）

- 已指定强节奏 BGM → 先按全局文档测定节拍网格，再让每个镜头边界锚到拍号。
- 未指定 BGM → 按内容节奏排，不强行卡点；BGM 选型延后到声音阶段（见 `production-workflow.md` 阶段 6）。

## Remotion 落拍写法（本介质唯一合法表达）

把节拍网格常量化，一切镜头边界与动效关键帧用 `beatF()` 表达，换曲时只改 `BEAT0`/`BEAT_INT` 两个常量：

```ts
export const FPS = 30;
export const BEAT0 = 0.2244;    // t0，秒（拟合得到的拍 0 位置）
export const BEAT_INT = 0.45465; // T，秒（拍长）
export const beatT = (n: number) => BEAT0 + n * BEAT_INT;          // 拍→秒
export const beatF = (n: number) => Math.round(beatT(n) * FPS);    // 拍→帧

export const SHOTS = {
  s0_open:  { from: 0,        to: beatF(8) },
  s1_slam:  { from: beatF(8), to: beatF(16) },
  // …每个镜头边界都是 beatF(整数拍)；内部动效用局部拍：
};
export const localBeat = (shot: {from: number}, n: number) => beatF(n) - shot.from;
```

纪律（与全局一致）：

- 镜头时长以拍为单位（4/8 拍一镜），加速段可用半拍/四分之一拍阶梯（如 `CUT_BEATS = [48, 49.5, 50.5, 51, 51.25]` 的收敛逼近）。
- 切点必须落整数拍 ±0.03s（约 1 帧）；半拍钉点需有能量数据支撑（见全局鼓点定位）。
- SFX 钉帧表同样写 `beatF(n)`，与画面共用同一事实源；详见 `sound-design.md` §钉帧。

## 节拍网格与鼓点（指引）

测定与定位的完整方法、脚本与验算标准见全局 `references/music-beat-sync.md` §1–2（含 librosa 拟合、残差 ≤±15ms 验收、kick 频段能量排序、音乐结构表与最强 hit 清单）。本文件不再重复其散文与代码，仅作路由。

## 渲后回测（必做，指引）

对渲出视频音轨重跑网格拟合，逐一切点对比设计帧号与实测拍的帧号误差；合格 ≤3f、理想 ≤1.5f、>3f 必修。完整步骤与工具见全局 §5。

## 工具备忘（Remotion 侧）

- `librosa` 不在系统 python 时用 `uv run --with librosa --with scipy --python 3.11 script.py`。
- 只有人声/复杂编曲的曲子 `beat_track` 会漂：先用 `librosa.effects.hpss` 分离打击成分再测；变速曲按能量段分段拟合。
