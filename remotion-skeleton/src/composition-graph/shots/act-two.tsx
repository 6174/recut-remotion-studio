/**
 * [INPUT]: 依赖 shots/types 的 frame props 与 shots/primitives 的纸张视觉原子
 * [OUTPUT]: 对外提供 three 至 end 的 12 个独立 React 镜头组件
 * [POS]: composition-graph/shots 的后半段叙事；展示 Three、CanvasUI effect 与 runtime 结论
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { ShotComponent } from "./types";
import { Detail, Headline, reveal, rise, Shell } from "./primitives";

export const ThreeScene: ShotComponent = ({ progress }) => (
  <Shell label="THREE" progress={progress}>
    <div
      style={{
        position: "absolute",
        top: 238,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "#ff6414",
        fontFamily: '"Arial Black", "Hiragino Sans GB", sans-serif',
        fontSize: 236,
        lineHeight: 0.8,
        ...rise(reveal(progress, 0.12), 56),
      }}
    >
      THREE
    </div>
    <div
      style={{
        position: "absolute",
        top: 514,
        left: 280,
        right: 280,
        padding: "30px 0",
        borderTop: "3px solid #171310",
        borderBottom: "3px solid #171310",
        textAlign: "center",
        fontSize: 54,
        lineHeight: 1.08,
        ...rise(reveal(progress, 0.44), 32),
      }}
    >
      Everything visible lands in one GPU scene.
    </div>
    <div
      style={{
        position: "absolute",
        left: 406,
        right: 406,
        bottom: 188,
        display: "flex",
        justifyContent: "space-between",
        color: "#3b3028",
        font: "700 27px ui-monospace, Menlo, monospace",
        ...rise(reveal(progress, 0.66), 22),
      }}
    >
      <span>HTML</span>
      <span>VIDEO</span>
      <span>FX</span>
    </div>
  </Shell>
);
export const DepthScene: ShotComponent = ({ progress }) => (
  <Shell label="SPACE" progress={progress}>
    <Headline progress={progress} width={800}>
      Then space
      <br />
      is editable.
    </Headline>
    <div
      style={{
        position: "absolute",
        right: 150,
        top: 250,
        width: 580,
        height: 390,
        perspective: 700,
        ...rise(reveal(progress, 0.48), 42),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "3px solid #ff6414",
          transform: "rotateY(-18deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 64,
          border: "3px solid #171310",
          transform: "rotateY(-18deg) translateZ(70px)",
        }}
      />
    </div>
  </Shell>
);
export const MagnifyScene: ShotComponent = ({ progress }) => (
  <Shell label="CANVAS UI / MAGNIFY" progress={progress}>
    <div
      style={{
        position: "absolute",
        top: 246,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: '"Arial Black", "Hiragino Sans GB", sans-serif',
        fontSize: 204,
        letterSpacing: ".03em",
        ...rise(reveal(progress, 0.1), 44),
      }}
    >
      FOCUS
    </div>
    <div
      style={{
        position: "absolute",
        left: 166,
        top: 605,
        color: "#ff6414",
        font: "800 29px ui-monospace, Menlo, monospace",
        ...rise(reveal(progress, 0.42), 24),
      }}
    >
      [ scan live texture ]
    </div>
    <div
      style={{
        position: "absolute",
        right: 156,
        top: 620,
        width: 520,
        color: "#3b3028",
        borderTop: "3px solid #171310",
        paddingTop: 20,
        fontSize: 38,
        ...rise(reveal(progress, 0.54), 28),
      }}
    >
      A scanner lens makes emphasis physical.
    </div>
    <div
      style={{
        position: "absolute",
        left: 470,
        top: 506,
        width: 980,
        borderTop: "2px dashed #ff6414",
        ...rise(reveal(progress, 0.3), 18),
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 1220,
        top: 354,
        color: "#f7efe1",
        textShadow: "0 1px 0 #171310",
        font: "700 24px/1.55 ui-monospace, Menlo, monospace",
        letterSpacing: ".08em",
        whiteSpace: "pre",
        ...rise(reveal(progress, 0.32), 18),
      }}
    >
      {"X 0960\nY 0368\n1.7X MAG\nR 172PX  *"}
    </div>
  </Shell>
);
export const GlitchScene: ShotComponent = ({ progress }) => (
  <Shell label="CANVAS UI / GLITCH" progress={progress}>
    <div
      style={{
        position: "absolute",
        top: 278,
        left: 0,
        right: 0,
        color: "#ff6414",
        textAlign: "center",
        fontFamily: '"Arial Black", "Hiragino Sans GB", sans-serif',
        fontSize: 260,
        lineHeight: 0.75,
        ...rise(reveal(progress, 0.16), 64),
      }}
    >
      CUT
    </div>
    <div
      style={{
        position: "absolute",
        left: 184,
        right: 184,
        top: 590,
        display: "flex",
        justifyContent: "space-between",
        borderTop: "4px solid #171310",
        paddingTop: 24,
        font: "700 31px ui-monospace, Menlo, monospace",
        ...rise(reveal(progress, 0.56), 26),
      }}
    >
      <span>tear</span>
      <span style={{ color: "#ff6414" }}>split</span>
      <span>settle</span>
    </div>
  </Shell>
);
export const BubbleScene: ShotComponent = ({ progress }) => (
  <Shell label="CANVAS UI / GLASS" progress={progress}>
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 270,
        fontFamily: '"Arial Black", "Hiragino Sans GB", sans-serif',
        fontSize: 210,
        lineHeight: 0.8,
        ...rise(reveal(progress, 0.12), 56),
      }}
    >
      GLASS
    </div>
    <div
      style={{
        position: "absolute",
        right: 135,
        top: 275,
        width: 520,
        padding: 36,
        border: "4px solid #ff6414",
        color: "#171310",
        fontSize: 56,
        lineHeight: 1.04,
        ...rise(reveal(progress, 0.18), 38),
      }}
    >
      A lens is a
      <br />
      story choice.
    </div>
    <div
      style={{
        position: "absolute",
        left: 126,
        bottom: 186,
        width: 700,
        color: "#3b3028",
        fontSize: 36,
        ...rise(reveal(progress, 0.62), 26),
      }}
    >
      Refraction keeps the source visible, then makes one detail impossible to
      miss.
    </div>
  </Shell>
);
export const CloudsScene: ShotComponent = ({ progress }) => (
  <Shell label="CANVAS UI / CLOUDS" progress={progress}>
    <Headline progress={progress}>
      Atmosphere is
      <br />
      also a node.
    </Headline>
    <Detail progress={progress}>
      Procedural fog enters and leaves without a video asset.
    </Detail>
  </Shell>
);
export const EffectsScene: ShotComponent = ({ progress }) => (
  <Shell label="EFFECT GRAPH" progress={progress}>
    <Headline progress={progress}>
      Effects compose
      <br />
      like content.
    </Headline>
    <div
      style={{
        position: "absolute",
        right: 140,
        top: 330,
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: reveal(progress, 0.5),
        font: "700 34px ui-monospace,Menlo,monospace",
      }}
    >
      <span>INPUT</span>
      <b style={{ width: 140, height: 4, background: "#ff6414" }} />
      <span>PASS</span>
      <b style={{ width: 140, height: 4, background: "#ff6414" }} />
      <span>OUTPUT</span>
    </div>
  </Shell>
);
export const AgentScene: ShotComponent = ({ progress }) => (
  <Shell label="AI STATE" progress={progress}>
    <Headline progress={progress}>
      Edit state,
      <br />
      not files.
    </Headline>
    <div
      style={{
        position: "absolute",
        right: 130,
        top: 292,
        width: 620,
        padding: 42,
        color: "#1d1613",
        border: "2px solid #171310",
        background: "#fff9ef",
        font: "600 28px/1.7 ui-monospace,Menlo,monospace",
        ...rise(reveal(progress, 0.48), 44),
      }}
    >
      scene.title = "new";{"\n"}camera.zoom = 1.2;{"\n"}effect.amount = .8;
    </div>
  </Shell>
);
export const PreviewScene: ShotComponent = ({ progress }) => (
  <Shell label="PREVIEW" progress={progress}>
    <Headline progress={progress}>
      See the real
      <br />
      composition now.
    </Headline>
    <div
      style={{
        position: "absolute",
        right: 120,
        top: 210,
        width: 720,
        height: 460,
        border: "3px solid #ff6414",
        background: "#fff2df",
        ...rise(reveal(progress, 0.48), 38),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 34,
          right: 34,
          bottom: 34,
          height: 8,
          background: "#171310",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: "#ff6414",
          }}
        />
      </div>
    </div>
  </Shell>
);
export const RenderScene: ShotComponent = ({ progress }) => (
  <Shell label="RENDER" progress={progress}>
    <Headline progress={progress}>
      Frame in.
      <br />
      Pixels out.
    </Headline>
    <div
      style={{
        position: "absolute",
        right: 154,
        top: 254,
        display: "grid",
        gridTemplateColumns: "repeat(8, 44px)",
        gap: 12,
        ...rise(reveal(progress, 0.48), 38),
      }}
    >
      {Array.from({ length: 48 }, (_, index) => (
        <i
          key={index}
          style={{
            width: 44,
            height: 44,
            background:
              index < Math.floor(progress * 48) ? "#ff6414" : "#e0d1be",
          }}
        />
      ))}
    </div>
  </Shell>
);
export const RuntimeScene: ShotComponent = ({ progress }) => (
  <Shell label="RUNTIME" progress={progress}>
    <div
      style={{
        position: "absolute",
        top: 272,
        left: 0,
        right: 0,
        color: "#ff6414",
        textAlign: "center",
        fontFamily: '"Arial Black", "Hiragino Sans GB", sans-serif',
        fontSize: 212,
        ...rise(reveal(progress, 0.18), 58),
      }}
    >
      RUNTIME
    </div>
    <div
      style={{
        position: "absolute",
        top: 556,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 52,
        ...rise(reveal(progress, 0.5), 32),
      }}
    >
      Not another editor.
      <br />A media composition runtime.
    </div>
  </Shell>
);
export const ResultScene: ShotComponent = ({ progress }) => (
  <Shell label="RESULT" progress={progress}>
    <div
      style={{
        position: "absolute",
        top: 230,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: '"Arial Black", "Hiragino Sans GB", sans-serif',
        fontSize: 160,
        lineHeight: 0.94,
        ...rise(reveal(progress, 0.14), 50),
      }}
    >
      ONE GRAPH.
      <br />
      <span style={{ color: "#ff6414" }}>EVERY MEDIUM.</span>
    </div>
    <div
      style={{
        position: "absolute",
        left: 500,
        top: 615,
        width: 920,
        borderTop: "3px solid #171310",
        paddingTop: 22,
        textAlign: "center",
        color: "#3b3028",
        fontSize: 38,
        ...rise(reveal(progress, 0.62), 25),
      }}
    >
      Remotion drives time. Three makes the frame.
    </div>
  </Shell>
);
export const EndScene: ShotComponent = ({ progress }) => (
  <Shell label="RECUT" progress={progress}>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 310,
        textAlign: "center",
        fontSize: 150,
        lineHeight: 0.9,
        fontWeight: 900,
        ...rise(reveal(progress, 0.18), 48),
      }}
    >
      Build the scene.
      <br />
      Keep it editable.
    </div>
    <Detail progress={progress} start={0.66} left={560} top={640} width={800}>
      HTML, media and effects in one composition graph.
    </Detail>
  </Shell>
);
