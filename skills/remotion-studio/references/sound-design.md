# sound-design — remotion-studio 介质映射（薄适配层）

> 决策规则权威来源：`service/skills/recut-directing-sound`；本文件仅保留 remotion-studio 介质映射
>
> 本文件是 remotion-studio 对全局 `recut-directing-sound` 的薄适配层。BGM 选型、SFX 词汇、片种气质、版权红线的**决策规则**以全局为准；本文件仅保留"如何在 Remotion/composition 代码与 `assets/audio/` 管线中落声音"的介质映射与实战清单。

## 权威来源

- **决策规则**：`service/skills/recut-directing-sound/SKILL.md` §3–4（BGM 四判据、SFX 五词汇、钉帧纪律、版权红线）+ `service/skills/recut-directing-sound/references/sound-design.md`（模板片 30 轮后进声音的时机教训、BGM 三易其稿、16 类目录与找音路径的权威原文，288 行）。
- **本介质落法**：下述 Remotion 写法与清单为本文件的权威增量。

## 1. Remotion 声音架构（本介质专属）

- **集中管理**：全片声音集中在一个文件管理（`template/src/aifl/Main.tsx` 的 `SFX[]` 钉帧表），场景组件不含音频代码；声音是时间线级资产。
- **BGM 铺底**：一条 BGM 全片铺底，音量包络用 `interpolate` 首尾淡入淡出（模板片 `[0, 30, TOTAL-50, TOTAL] → [0, 0.34, 0.34, 0]`，1s 淡入/1.7s 淡出，BGM 压至 0.34 给 SFX 留 headroom）。能量曲线需贴合分镜能量曲线，候选曲必须垫进成片试听。
- **双版本交付**：BGM 的 `<Audio>` 用布尔 `inputProp`（如 `bgm`，默认 `true`）包住，SFX 不受开关影响；终渲从同一时间线出两版：`npx remotion render … --props=props-nobgm.json`（`{"bgm":false}`），Windows 走文件最稳。
- **顺序铁律**：画面结构基本锁定后才进声音；任何镜头时长/顺序变更，收尾固定包含"全表 SFX 帧号重对"（见全局 S3）。

## 2. SFX 词汇到目录的 Remotion 映射

`assets/audio/` 管线为 Remotion 专属，保留完整清单供找音时按类别进目录试听；**选音判据仍以全局"按片种选，不按事件选"为准**，目录只是索引。

| 词汇表 | whoosh | impact | riser | sparkle | transition |
|---|---|---|---|---|---|
| 目录 | `transition/` | `impact/` | `riser/` | **`light/`** | `transition/` |

完整 16 类目录与数量/装载/何时进入，见全局 `references/sound-design.md` §3.0 原表（149 个文件，`sparkle` 对应 `light/`，库无 `sparkle/` 目录）。找音路径：先定类别（运镜→`transition`、落地→`impact`、打字→`text`、光效→`light`…），再在类内挑音色。

### 2.1 `ui/` 必须逐个试听（Remotion 专属清单）

`ui/` 内部质感分裂（真实开关拟音 vs 合成反馈 tone/bleep/alert/notification），不可整目录放行。清单与 Mixkit 原名/质感判定见全局 `references/sound-design.md` §3.3（18 文件，`switch-light`/`switch-tap`/`switch-click-quick`/`pop` 为可直接拟音档，其余 tone/bleep 分级见原表）。同理 `data/`/`scifi/` 需逐个试听。

### 2.2 模板片实战钉帧表（Remotion 增量，保留帧号语义）

下表为模板片定稿的 12 个实发 SFX 的 Remotion 帧号语义，复用时取相对语义而非绝对数值（30fps/1085f）：

| 文件 | 目录 | 用途 | 典型钉帧 |
|---|---|---|---|
| `bgm-tech-house.mp3` | `bgm/` | 鼓底 BGM | 全片铺底 0→0.34→0 |
| `transition-soft.mp3` | `transition/` | 柔转场 | f12/f277/f475/f623/f779 |
| `whoosh-fast/big` | `transition/` | 运镜 | f78/f127/f308/f340/f388/f435 |
| `sparkle.mp3` | `light/` | 光效 reveal | f141/f1005 |
| `keyboard.mp3` | `text/` | 键盘拟音（长样本） | f401 截 24f / f781 截 44f |
| `click-camera.mp3` | `camera/` | 快门确认（全片最响 0.6） | f451/f648 |
| `riser-cine → impact-deep-whoosh → sparkle` | `riser`/`impact`/`light` | 收束三拍 | f945→f980→f1005 |

> `impact-cine.mp3` 已从 `assets/audio/` 删除，库内等价文件为字节相同的 `impact-deep-whoosh`（md5 `ce27fd2f`）；`typewriter.mp3` 已删，打字改用 `keyboard.mp3` 截帧或 `typewriter-hit-single`。

## 3. 钉帧与对齐（Remotion 专属写法）

- **声明式表 + 相对钉帧**：`SFX: { from, src, volume }[]`，每条注释画面动作，渲染时包 `<Sequence from={s.from}>`；`from` 一律写 `SHOTS.<shot>.from + offset` 或卡点片 `beatF(n)`，不写裸数字（见 `music-beat-sync.md`）。
- **长样本靠 Sequence 截断**：`keyboard.mp3`（19.6s）按段落给 `durationInFrames` 24f/44f；其余统一 90f 让 ≤3s 素材自然播完；库内 21 个 >5s 文件必须显式截断（清单见 §3.1），漏给会拖响。
- **音量与轻音处理**：常规 0.2–0.6 的前提是素材峰值≈0dB；7 个 <-12dB 轻音素材给 1.0 仍被 BGM 盖住，首选换素材或 `ffmpeg loudnorm` 预归一化，必要时 `volume>1`（Remotion 真实放大但预览钳 1.0，须渲染后 `volumedetect` 验峰防削波）。清单与三条出路见下。

### 3.1 需显式截断的长样本（>5s，21 个，Remotion 清单）

`scifi-computer-ambience`(23.5s) / `projector-spin-antique`(21.7s) / `keyboard`(19.6s) / `write-blackboard`(13.9s) / `mech-robotic-futuristic`(9.6s) / `camera-autofocus`(9.6s) / `paper-book-browse-fast`(9.3s) / `space-intro-futuristic`(8.1s) / `light-spell`(8.0s) / `impact-cine-big`(7.9s) / `tech-hum-futuristic`(6.0s) / `swoosh-slow/wing-flutter/wind-pass-vibrate`(5.0–5.7s) / `paper-wind-blow`(5.5s) / `metal-drop-scifi-small`(5.5s) / `light-aura/light-transition-magic`(5.1–5.5s) / `impact-movie-epic`(5.1s) / `power-up-electronic`(5.0s) / `applause-rhythmic-loop`(5.0s)

### 3.2 本身录得轻的文件（<-12dB，7 个）

`data-load-os`(-24.6dB) / `pencil-write-short`(-22.7dB) / `write-fast`(-20.0dB) / `wing-flutter`(-17.9dB) / `ui-zoom-in`(-14.3dB) / `clock-knob-spin`(-14.0dB) / `clock-tick-single`(-13.9dB) — 三条出路：换素材 > 预归一化 > `volume>1` 增益（需渲染验峰）。

## 4. 与全局的衔接

- BGM 气质、SFX 词汇、片种一耳朵检验、版权红线（安全路径/授权存档/AI 披露）的**判断**以全局 `recut-directing-sound` 为准，本文件不再复制其散文。
- 卡点落拍的数学纪律与渲后回测以全局 `recut-directing-editing` 的 `music-beat-sync.md` 为准；连发防机枪三招（双样本交替+音量阶梯+间隔加速）与全局一致，Remotion 侧无 `playbackRate` 变调（实测零命中）。
- 收束句式 `riser(组装)→impact(落点峰值)→sparkle(余韵)` 的三拍时距（约 35f+25f）与全局一致，Remotion 侧取 `light/` 的 sparkle。
