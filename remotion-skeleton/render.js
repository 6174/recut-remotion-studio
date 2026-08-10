/**
 * [INPUT]: 依赖 Recut 注入的导出 props、workspace composition、Remotion bundler/renderer 与素材文件
 * [OUTPUT]: 对外提供 ProjectVideo 的本地 MP4 导出、进度文件与 ANGLE/SwiftShader 图形诊断路径
 * [POS]: remotion-skeleton 的服务端成片入口；预览与导出均解析同一冻结 remotion-kit，WebGL
 *        HTML-in-Canvas pass 的 Chromium backend 在此唯一配置。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */

/*
 * Remotion Studio — programmatic server-side render entry.
 *
 * Reads ${RECUT_APP_FILES_DIR}/exports/{renderId}/props.json, materializes the
 * referenced media into a temporary bundle public directory, bundles the
 * project's composition workspace (${RECUT_APP_FILES_DIR}/workspace), and
 * renders the ProjectVideo composition to
 * ${RECUT_APP_FILES_DIR}/exports/{renderId}/out.mp4 while streaming progress to
 * ${RECUT_APP_FILES_DIR}/exports/{renderId}/progress.json.
 *
 * Env: RECUT_APP_FILES_DIR is injected by the Recut host for every app shell job.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { bundle } = require("@remotion/bundler");
const { getCompositions, renderMedia } = require("@remotion/renderer");
const postcss = require("postcss");
const tailwindPostcss = require("@tailwindcss/postcss");

// Remotion's Rspack bundler handles CSS natively (built-in CSS), so loader-level
// PostCSS injection is ignored. We instead pre-compile the workspace's Tailwind
// CSS here (postcss + @tailwindcss/postcss, same engine as the Vite preview) into
// a per-render temp file, then bundle a thin entry that imports the compiled CSS
// and re-exports the composition entry. Exported frames thus carry the exact
// design tokens/utilities as the live preview.
async function compileTailwindCSS(workspace, outDir) {
  const cssPath = path.join(workspace, "src", "index.css");
  const raw = fs.readFileSync(cssPath, "utf8");
  const result = await postcss([tailwindPostcss({ base: workspace })]).process(raw, { from: cssPath });
  const compiledPath = path.join(outDir, "tailwind.generated.css");
  fs.writeFileSync(compiledPath, result.css);
  return compiledPath;
}

function makeEntry(compiledCssPath, realEntry) {
  const dir = path.dirname(compiledCssPath);
  const entryPath = path.join(dir, "composition.entry.ts");
  fs.writeFileSync(entryPath, `import ${JSON.stringify(compiledCssPath)};\nexport * from ${JSON.stringify(realEntry)};\n`);
  return entryPath;
}

function readArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 && index + 1 < process.argv.length ? process.argv[index + 1] : null;
}

// 与 vite.config.ts 一致的 kit 别名：把 @recut/remotion-kit 指向 workspace 的
// 冻结副本（workspace/remotion-kit/），渲染与预览、项目版本三者一致。
function kitWebpackAlias(workspace) {
  const kit = (rel) => require("path").join(workspace, "remotion-kit", rel);
  return [
    { name: "@recut/remotion-kit/templates", alias: kit("src/components/remotion-templates") },
    { name: "@recut/remotion-kit/shotcraft", alias: kit("src/components") },
    { name: "@recut/remotion-kit/captions", alias: kit("src/captions/index.ts") },
    { name: "@recut/remotion-kit/effects", alias: kit("src/effects/index.ts") },
    { name: "@recut/remotion-kit", alias: kit("src/index.ts") },
  ];
}

const renderId = readArg("renderId");
if (!renderId) {
  console.error("remotion-render: missing --renderId");
  process.exit(1);
}
const filesRoot = process.env.RECUT_APP_FILES_DIR;
if (!filesRoot) {
  console.error("remotion-render: RECUT_APP_FILES_DIR is not set");
  process.exit(1);
}
const workDir = path.join(filesRoot, "exports", renderId);
const outFile = path.join(workDir, "out.mp4");
const progressFile = path.join(workDir, "progress.json");
const workspaceEntry = path.join(__dirname, "src", "index.ts");

function writeProgress(phase, progress, message) {
  try {
    fs.mkdirSync(workDir, { recursive: true });
    fs.writeFileSync(progressFile, JSON.stringify({ phase, progress, message, at: new Date().toISOString() }));
  } catch (_) {
    /* progress is best-effort */
  }
  console.log(`remotion-render: ${phase} ${Math.round((progress || 0) * 100)}% ${message || ""}`.trim());
}

(async () => {
  writeProgress("reading", 0.01, "读取渲染配置");
  const propsPath = path.join(workDir, "props.json");
  const rawProps = JSON.parse(fs.readFileSync(propsPath, "utf8"));
  const brief = rawProps.brief || null;
  const settings = rawProps.settings || { width: 1920, height: 1080, fps: 30, codec: "h264" };
  const media = rawProps.media || {};
  if (!fs.existsSync(workspaceEntry)) {
    throw new Error(`workspace 入口不存在：${workspaceEntry}（请先调用 workspace.ensure）`);
  }

  // Materialize media into a per-render public directory so the bundle can
  // serve them at /public/media/{assetId}{ext} during rendering.
  writeProgress("media", 0.03, "准备画面素材");
  const publicDir = fs.mkdtempSync(path.join(os.tmpdir(), "remotion-studio-public-"));
  const mediaDir = path.join(publicDir, "media");
  fs.mkdirSync(mediaDir, { recursive: true });
  const resolvedMedia = {};
  for (const [assetId, ref] of Object.entries(media)) {
    if (!ref || !ref.path) continue;
    const sourcePath = path.isAbsolute(ref.path) ? ref.path : path.join(filesRoot, ref.path);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`素材 ${assetId} 本地文件不存在：${sourcePath}`);
    }
    const extension = path.extname(sourcePath) || ".bin";
    const targetName = `${assetId}${extension}`;
    fs.copyFileSync(sourcePath, path.join(mediaDir, targetName));
    resolvedMedia[assetId] = { kind: ref.kind, mimeType: ref.mimeType, url: `/public/media/${targetName}`, path: sourcePath };
  }

  writeProgress("bundling", 0.05, "打包 Remotion 项目");
  const compiledCss = await compileTailwindCSS(__dirname, workDir);
  const entryPoint = makeEntry(compiledCss, workspaceEntry);
  const serveUrl = await bundle({
    entryPoint,
    publicDir,
    enableCaching: false,
    ignoreRegisterRootWarning: true,
    webpackOverride: (config) => ({ ...config, resolve: { ...config.resolve, alias: kitWebpackAlias(__dirname) } }),
  });

  const inputProps = { brief, media: resolvedMedia, settings };

  writeProgress("compositions", 0.08, "读取合成配置");
  const compositions = await getCompositions({
    serveUrl,
    inputProps,
  });
  const composition = compositions.find((candidate) => candidate.id === "ProjectVideo");
  if (!composition) {
    throw new Error(`未找到 ProjectVideo 合成，可注册的合成：${compositions.map((item) => item.id).join(", ") || "无"}`);
  }

  writeProgress("render", 0.1, `开始渲染 ${composition.width}x${composition.height}@${composition.fps}fps，共 ${composition.durationInFrames} 帧`);
  await renderMedia({
    composition,
    serveUrl,
    codec: settings.codec || "h264",
    outputLocation: outFile,
    inputProps,
    concurrency: "50%",
    // HTML-in-Canvas 的 WebGL pass 需要一个明确、预览可复现的后端；无 GPU 环境可将
    // RECUT_REMOTION_GL=swangle 作为受控诊断路径，而不是静默退回 DOM 效果。
    chromiumOptions: { gl: process.env.RECUT_REMOTION_GL === "swangle" ? "swangle" : "angle" },
    timeoutInMilliseconds: 60000,
    onProgress: ({ progress }) => writeProgress("render", 0.1 + progress * 0.89, `渲染中 ${Math.round(progress * 100)}%`),
  });

  writeProgress("done", 1, "渲染完成");
  console.log(`remotion-render: output ${outFile}`);
  process.exit(0);
})().catch((error) => {
  writeProgress("failed", 0, String(error && error.stack ? error.stack : error));
  console.error("remotion-render: failed");
  console.error(String(error && error.stack ? error.stack : error));
  process.exit(1);
});
