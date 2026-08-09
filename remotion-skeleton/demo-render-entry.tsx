import React from "react";
import { registerRoot, Composition } from "remotion";
import { HtmlCanvasVideoStage, planForEffect } from "@recut/remotion-kit";
const Demo: React.FC<{ effect: string }> = ({ effect }) => (
  <HtmlCanvasVideoStage plan={planForEffect(effect)}><div style={{ width: "100%", height: "100%", background: "#0b0d14" }} /></HtmlCanvasVideoStage>
);
export const DemoRoot: React.FC = () => (
  <Composition id="Demo" component={Demo} durationInFrames={240} fps={30} width={1920} height={1080} defaultProps={{ effect: "cursor" }} />
);
registerRoot(DemoRoot);
