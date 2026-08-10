/**
 * [INPUT]: 依赖 shots/types 的 frame props 与 shots/primitives 的纸张视觉原子
 * [OUTPUT]: 对外提供 opening 至 ratio 的 12 个独立 React 镜头组件
 * [POS]: composition-graph/shots 的前半段叙事；解释时间、组件、HTML 与多格式素材如何进入合成
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { ShotComponent } from "./types";
import { Detail, Headline, reveal, rise, Shell } from "./primitives";

export const OpeningScene: ShotComponent = ({ progress }) => (
  <Shell label="REMOTION / 01" progress={progress}>
    <Headline progress={progress} start={-0.1}>
      Video, built
      <br />
      <span
        style={{
          display: "inline-block",
          padding: "0 14px 6px",
          transform: "rotate(-1.5deg)",
          background:
            "linear-gradient(transparent 57%, #ff6414 57%, #ff6414 89%, transparent 89%)",
        }}
      >
        like software.
      </span>
    </Headline>
    <Detail progress={progress}>
      React components become an editable moving picture.
    </Detail>
  </Shell>
);
export const ReactScene: ShotComponent = ({ progress }) => (
  <Shell label="THE PREMISE" progress={progress}>
    <div
      style={{
        position: "absolute",
        top: 232,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: '"Arial Black", "Hiragino Sans GB", sans-serif',
        fontSize: 238,
        lineHeight: 0.8,
        letterSpacing: ".04em",
        ...rise(reveal(progress, 0.06), 52),
      }}
    >
      FRAME
    </div>
    <div
      style={{
        position: "absolute",
        top: 500,
        left: 0,
        right: 0,
        color: "#ff6414",
        textAlign: "center",
        fontSize: 66,
        fontWeight: 900,
        ...rise(reveal(progress, 0.42), 34),
      }}
    >
      = React render()
    </div>
    <div
      style={{
        position: "absolute",
        left: 260,
        right: 260,
        top: 650,
        borderTop: "3px solid #171310",
        paddingTop: 24,
        display: "flex",
        justifyContent: "space-between",
        color: "#3b3028",
        fontSize: 31,
        ...rise(reveal(progress, 0.62), 24),
      }}
    >
      <span>state in</span>
      <span>pixels out</span>
    </div>
  </Shell>
);
export const FrameScene: ShotComponent = ({ progress }) => (
  <Shell label="TIME" progress={progress}>
    <Headline progress={progress} width={700}>
      Seek anywhere.
      <br />
      Land exactly there.
    </Headline>
    <pre
      style={{
        position: "absolute",
        right: 120,
        top: 218,
        width: 700,
        padding: 52,
        margin: 0,
        border: "2px solid #171310",
        color: "#1d1613",
        background: "#fff9ef",
        font: "600 30px/1.8 ui-monospace,Menlo,monospace",
        ...rise(reveal(progress, 0.46), 38),
      }}
    >
      <b style={{ color: "#ff8c78" }}>const</b> frame ={" "}
      <b style={{ color: "#ff6414" }}>useCurrentFrame</b>();{"\n\n"}
      <b style={{ color: "#ff8c78" }}>return</b> frame;
    </pre>
  </Shell>
);
export const ComponentScene: ShotComponent = ({ progress }) => (
  <Shell label="COMPONENT" progress={progress}>
    <Headline progress={progress} width={760}>
      A component
      <br />
      can be a shot.
    </Headline>
    <div
      style={{
        position: "absolute",
        right: 160,
        top: 282,
        width: 500,
        height: 368,
        border: "3px solid #ff6414",
        ...rise(reveal(progress, 0.48), 54),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 42,
          top: 42,
          color: "#ff6414",
          fontSize: 66,
          fontWeight: 800,
        }}
      >
        &lt;Scene /&gt;
      </div>
      <div
        style={{
          position: "absolute",
          right: 42,
          bottom: 42,
          color: "#171310",
          fontSize: 38,
        }}
      >
        props → pixels
      </div>
    </div>
  </Shell>
);
export const CutScene: ShotComponent = ({ progress }) => (
  <Shell label="EDIT" progress={progress}>
    <Headline progress={progress}>
      A cut is
      <br />a decision.
    </Headline>
    <div
      style={{
        position: "absolute",
        left: 108,
        right: 108,
        bottom: 140,
        height: 234,
        padding: 32,
        opacity: reveal(progress, 0.48),
        border: "2px solid #171310",
        background: "#fff9ef",
      }}
    >
      <div style={{ height: 42, width: "44%", background: "#ef7a3c" }} />
      <div
        style={{
          height: 42,
          width: "52%",
          margin: "20px 0 0 26%",
          background: "#ff6414",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 24,
          left: `${18 + progress * 70}%`,
          width: 5,
          height: 192,
          background: "#171310",
        }}
      />
    </div>
  </Shell>
);
export const CompositionScene: ShotComponent = ({ progress }) => (
  <Shell label="COMPOSITION" progress={progress}>
    <Headline progress={progress}>
      Small scenes
      <br />
      become a film.
    </Headline>
    <div
      style={{
        position: "absolute",
        right: 150,
        top: 250,
        width: 590,
        height: 500,
        ...rise(reveal(progress, 0.46), 42),
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          border: "3px solid #ff6414",
          padding: 34,
        }}
      >
        <div
          style={{
            width: "66%",
            height: "60%",
            border: "3px solid #171310",
            padding: 28,
          }}
        >
          <div
            style={{ width: "56%", height: "50%", border: "3px solid #ff6414" }}
          />
        </div>
      </div>
    </div>
  </Shell>
);
export const HtmlScene: ShotComponent = ({ progress }) => (
  <Shell label="HTML SOURCE" progress={progress}>
    <div
      style={{
        position: "absolute",
        top: 214,
        left: 106,
        fontFamily: '"Arial Black", "Hiragino Sans GB", sans-serif',
        fontSize: 220,
        lineHeight: 0.8,
        ...rise(reveal(progress, 0.12), 60),
      }}
    >
      HTML
    </div>
    <div
      style={{
        position: "absolute",
        top: 355,
        right: 120,
        width: 630,
        padding: "34px 0 34px 42px",
        borderLeft: "8px solid #ff6414",
        fontSize: 64,
        lineHeight: 1,
        ...rise(reveal(progress, 0.34), 38),
      }}
    >
      is layout.
      <div
        style={{ position: "relative", display: "inline-block", marginTop: 12 }}
      >
        <i
          style={{
            position: "absolute",
            left: -12,
            right: -14,
            bottom: 5,
            height: 34,
            zIndex: 0,
            background: "#ffd60a",
            transformOrigin: "left center",
            transform: `scaleX(${reveal(progress, 0.54)}) rotate(-1deg)`,
          }}
        />
        <b style={{ position: "relative", color: "#ff6414", zIndex: 1 }}>
          Three
        </b>
        <span style={{ position: "relative", zIndex: 1 }}>
          {" "}
          owns the frame.
        </span>
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 108,
        bottom: 162,
        display: "flex",
        gap: 28,
        ...rise(reveal(progress, 0.6), 24),
      }}
    >
      {["type", "layout", "texture"].map((item, index) => (
        <span
          key={item}
          style={{
            width: 250,
            padding: "18px 0",
            borderTop: `3px solid ${index === 2 ? "#ff6414" : "#171310"}`,
            color: index === 2 ? "#ff6414" : "#171310",
            font: "700 30px ui-monospace, Menlo, monospace",
          }}
        >
          {item}
        </span>
      ))}
    </div>
  </Shell>
);
export const HicScene: ShotComponent = ({ progress }) => (
  <Shell label="HTML-IN-CANVAS" progress={progress}>
    <Headline progress={progress} width={760}>
      Capture the
      <br />
      real layout.
    </Headline>
    <div
      style={{
        position: "absolute",
        right: 132,
        top: 258,
        width: 570,
        height: 408,
        border: "3px solid #ff6414",
        padding: 38,
        ...rise(reveal(progress, 0.5), 42),
      }}
    >
      <div
        style={{
          font: "700 22px ui-monospace,Menlo,monospace",
          color: "#ff6414",
        }}
      >
        HTML SUBTREE
      </div>
      <div
        style={{
          position: "absolute",
          top: 182,
          left: 0,
          width: "100%",
          borderTop: "3px solid #ff6414",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 38,
          fontSize: 42,
          fontWeight: 800,
        }}
      >
        CanvasTexture
      </div>
    </div>
  </Shell>
);
export const RasterScene: ShotComponent = ({ progress }) => (
  <Shell label="TEXTURE" progress={progress}>
    <Headline progress={progress}>
      HTML becomes
      <br />a material.
    </Headline>
    <div
      style={{
        position: "absolute",
        right: 154,
        top: 270,
        width: 560,
        height: 360,
        background: "#ef7a3c",
        ...rise(reveal(progress, 0.48), 50),
      }}
    >
      <div
        style={{ position: "absolute", inset: 22, border: "3px solid #171310" }}
      />
      <div
        style={{
          position: "absolute",
          left: 42,
          bottom: 38,
          fontSize: 52,
          fontWeight: 800,
        }}
      >
        texture → mesh
      </div>
    </div>
  </Shell>
);
export const MediaScene: ShotComponent = ({ progress }) => (
  <Shell label="MEDIA" progress={progress}>
    <Headline progress={progress} width={760}>
      Video is also
      <br />a texture.
    </Headline>
    <div
      style={{
        position: "absolute",
        right: 120,
        top: 194,
        width: 720,
        height: 500,
        background: "#fff2df",
        border: "3px solid #ff6414",
        ...rise(reveal(progress, 0.48), 38),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 34,
          background: "radial-gradient(circle at 70% 35%,#ff6414, #fff2df 62%)",
        }}
      />
      <i
        style={{
          position: "absolute",
          left: 320,
          top: 190,
          width: 0,
          height: 0,
          borderTop: "54px solid transparent",
          borderBottom: "54px solid transparent",
          borderLeft: "88px solid #171310",
        }}
      />
    </div>
  </Shell>
);
export const RatioScene: ShotComponent = ({ progress }) => (
  <Shell label="FORMAT" progress={progress}>
    <Headline progress={progress}>
      One scene.
      <br />
      Many canvases.
    </Headline>
    <div
      style={{
        position: "absolute",
        right: 150,
        top: 228,
        display: "flex",
        gap: 36,
        alignItems: "end",
        ...rise(reveal(progress, 0.5), 38),
      }}
    >
      <b style={{ width: 260, height: 146, border: "3px solid #ff6414" }} />
      <b style={{ width: 150, height: 266, border: "3px solid #171310" }} />
      <b style={{ width: 212, height: 212, border: "3px solid #ff6414" }} />
    </div>
  </Shell>
);
