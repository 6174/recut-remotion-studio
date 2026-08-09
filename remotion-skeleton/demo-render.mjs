import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const outDir = path.join(process.cwd(), "demo-render-out");
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(process.cwd(), "demo-render-entry.tsx") });
const comp = await selectComposition({ serveUrl, id: "Demo" });
for (const [effect, frames] of [["cursor", [30, 90]], ["magnifier", [90]], ["focus-spotlight", [90]]]) {
  for (const frame of frames) {
    await renderStill({ composition: comp, serveUrl, imageFormat: "png", frame, output: path.join(outDir, `${effect}-${frame}.png`), inputProps: { effect } });
    console.log("rendered", effect, frame);
  }
}
