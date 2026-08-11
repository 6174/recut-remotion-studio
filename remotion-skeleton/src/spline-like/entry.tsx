/**
 * [INPUT]: 依赖 React、@remotion/player 与本目录实验 Composition
 * [OUTPUT]: 对外提供 spline-like.html 的浏览器调试入口与认知摘要
 * [POS]: 独立实验页；把可视验证与首页运行时彻底分开
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { Player } from "@remotion/player";
import { createRoot } from "react-dom/client";
import { SPLINE_LIKE_DURATION, SplineLikeComposition } from "./Composition";
import "./style.css";

const Notes = () => <aside>
  <p>LAB / spline-like glass</p>
  <h1>稳定性结论</h1>
  <ol>
    <li>透明 Canvas 的 Transmission 必须提供只供离屏采样的背景，否则会折射透明黑。</li>
    <li>多个动态 Transmission 网格互相进入缓冲可能闪动；本实验用 Remotion 帧时钟稳定复现后再决定共享 buffer 或轨道材质。</li>
    <li>薄 Timeline 要用二维圆角轮廓挤出，不能让 depth 限制平面圆角。</li>
    <li>动画只以帧驱动的低频平移实现；不使用 Math.random、Date 或隐式时间。</li>
  </ol>
</aside>;

createRoot(document.getElementById("root")!).render(<main><section><Player component={SplineLikeComposition} compositionHeight={1080} compositionWidth={1920} durationInFrames={SPLINE_LIKE_DURATION} fps={30} controls loop style={{ height: "100%", width: "100%" }} /></section><Notes /></main>);
