/*
 * [INPUT]: 依赖平台注入的 ctx.sqlite、ctx.files、ctx.media.materialize/importFile、ctx.artifacts.publish、ctx.project 与受限 ctx.shell
 * [OUTPUT]: 注册 Brief、每项目 Remotion 工作区（workspace/）seed 与 code.read/write、素材引用登记、Vite dev server 预览（preview.serve.start/status/stop）与 props、终端命令（terminal.exec）与日志读取（logs.read）、本地渲染环境与后台导出（完成时设为项目视频封面）的 App API 与 MCP 工具处理器
 * [POS]: remotion-studio 的唯一业务后端；创作落点在项目私有 workspace 的 composition 代码（AI 经 code.read/write 直接改写），预览由每项目 Vite dev server 热更新，UI iframe 嵌入其 player.html，导出委托本地 Node 渲染工作区 + 平台 Asset 归档
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */

function id() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// 平台自 v0.1.15 起每个 App 只有一个 storage.sqlite，App 自身按 ctx.project.id
// 分区所有行；ctx.project 在项目目标下才存在。
function scope(ctx) {
  return ctx.project ? ctx.project.id : "";
}

const WORKSPACE = "workspace";

function ensureSchema(ctx) {
  ctx.sqlite.execute("create table if not exists briefs (id text primary key, project_id text not null default '', template text not null, topic text not null, details text not null, expected_duration_sec real not null, material_json text not null, created_at text not null)");
  ctx.sqlite.execute("create table if not exists exports (render_id text primary key, project_id text not null default '', brief_id text not null, shell_job_id text not null, status text not null, label text not null, settings_json text not null, asset_id text, error text, created_at text not null, updated_at text not null)");
  ctx.sqlite.execute("create table if not exists composition_assets (project_id text not null, asset_id text not null, created_at text not null, primary key (project_id, asset_id))");
  ctx.sqlite.execute("create table if not exists app_meta (key text primary key, value text not null)");
  for (const [table, column] of [["briefs", "project_id"], ["exports", "project_id"], ["exports", "brief_id"]]) {
    try { ctx.sqlite.execute(`alter table ${table} add column ${column} text not null default ''`); } catch (_) { /* 新库已含该列。 */ }
  }
  const exportsCols = ctx.sqlite.query("pragma table_info(exports)").map((row) => String(row.name));
  if (exportsCols.includes("design_id")) {
    // 旧版 schema 曾写入 design_id（NOT NULL 无默认），重构后代码不再维护该列；
    // 重建 exports 去掉 design_id，否则 INSERT 触发 NOT NULL 约束失败。
    ctx.sqlite.execute("alter table exports rename to exports_legacy");
    ctx.sqlite.execute("create table exports (render_id text primary key, project_id text not null default '', brief_id text not null, shell_job_id text not null, status text not null, label text not null, settings_json text not null, asset_id text, error text, created_at text not null, updated_at text not null)");
    ctx.sqlite.execute("insert into exports (render_id, project_id, brief_id, shell_job_id, status, label, settings_json, asset_id, error, created_at, updated_at) select render_id, project_id, brief_id, shell_job_id, status, label, settings_json, asset_id, error, created_at, updated_at from exports_legacy");
    ctx.sqlite.execute("drop table exports_legacy");
  }
}

// shell/importFile 等返回 camelCase map（status/id/error…），与 Apps 消费契约一致。
// trackJob 只追加，供 logs.list 回填各任务历史日志；列表保持最近若干条。
function trackJob(ctx, key, jobId) {
  if (!jobId) return;
  const rows = ctx.sqlite.query("select value from app_meta where key = ?", [key]);
  const current = rows.length ? String(rows[0].value || "") : "";
  const list = current ? current.split(",") : [];
  list.push(String(jobId));
  ctx.sqlite.execute("insert or replace into app_meta (key, value) values (?, ?)", [key, list.slice(-12).join(",")]);
}

const STYLE_TEMPLATES = {
  "paper-collage": { label: "纸拼贴编辑风", description: "纸质拼贴、编辑杂志感；适合解说、知识与观点内容", motion: "低能量、缓慢推进、落定后呼吸；像一篇会动的杂志文章" },
  "cinematic-dark": { label: "电影感深色", description: "深色背景、星空与粒子光效；适合产品、故事与情绪化内容", motion: "聚光→推进→悬浮；单一主角完整动作弧" },
  "clean-editorial": { label: "简洁杂志排版", description: "几何背景、大字排版；适合新闻、教育、报告类内容", motion: "直线滑动、克制的过冲；信息先于装饰" },
  "vibrant-tech": { label: "科技活力风", description: "渐变色块、高能量运动；适合产品发布、演示与社交媒体", motion: "高能量入场、轻微过冲；批量元素靠运动本身表达" },
};

const CAPTION_THEMES = [
  { id: "pop", label: "Pop 弹入", description: "缩放弹入，清爽通用" },
  { id: "karaoke", label: "Karaoke 扫光", description: "逐词高亮扫过，适合歌词式字幕" },
  { id: "kinetic-01", label: "Kinetic 动能排版", description: "主词放大、侧词对齐的动能排版" },
  { id: "kinetic-02", label: "Kinetic 变体", description: "动能排版第二套" },
  { id: "hustle", label: "Hustle 快节奏", description: "快速进入，活力十足" },
  { id: "grape", label: "Grape 圆角盒", description: "圆角色块背景字幕" },
  { id: "beast", label: "Beast 粗体高对比", description: "粗体加高对比阴影" },
  { id: "poppin", label: "Poppin 大写字幕", description: "全大写 Poppins 字体" },
  { id: "aarit", label: "Aarit 逐字缩放", description: "电影感逐字缩放与渐变扫光" },
  { id: "soft-ai", label: "Soft AI 毛玻璃", description: "磨砂玻璃模糊进入" },
  { id: "gaming-stream", label: "Gaming 霓虹", description: "霓虹发光游戏风格" },
  { id: "simple-one-word", label: "单字聚焦", description: "每次只高亮一个词" },
  { id: "podcast", label: "Podcast 播客", description: "播客风格的段落字幕" },
];

const CANVAS_SIZES = [
  { id: "1080p", label: "1080p 横屏", width: 1920, height: 1080, fps: 30 },
  { id: "vertical", label: "1080×1920 竖屏", width: 1080, height: 1920, fps: 30 },
  { id: "square", label: "1080×1080 方形", width: 1080, height: 1080, fps: 30 },
];

const WORKSPACE_TREE = ["src", "src/compositions", "src/effects", "src/captions", "src/components", "src/components/remotion-templates", "src/components/shotcraft"];

function catalog(_, ctx) {
  ensureSchema(ctx);
  return { styleTemplates: STYLE_TEMPLATES, captionThemes: CAPTION_THEMES, canvasSizes: CANVAS_SIZES };
}

function createBrief(input, ctx) {
  ensureSchema(ctx);
  const template = String(input.template || "").trim();
  const topic = String(input.topic || "").trim();
  if (!template || !STYLE_TEMPLATES[template]) throw new Error("template 必须选择一个有效的风格模板");
  if (!topic) throw new Error("topic 是必填项");
  const details = String(input.details ?? "").trim();
  const expectedDurationSec = input.expectedDurationSec === undefined ? 60 : Number(input.expectedDurationSec);
  if (!Number.isFinite(expectedDurationSec) || expectedDurationSec <= 0) throw new Error("expectedDurationSec 必须是正数");
  const materialAssetIds = Array.isArray(input.materialAssetIds) ? input.materialAssetIds.filter((value) => typeof value === "string" && Boolean(value.trim())) : [];
  const brief = {
    id: id(),
    template,
    topic,
    details,
    expectedDurationSec,
    materialAssetIds,
    createdAt: new Date().toISOString(),
  };
  ctx.sqlite.execute("insert into briefs (id, project_id, template, topic, details, expected_duration_sec, material_json, created_at) values (?, ?, ?, ?, ?, ?, ?, ?)", [brief.id, scope(ctx), template, topic, details, expectedDurationSec, JSON.stringify(materialAssetIds), brief.createdAt]);
  return ctx.artifacts.publish({ type: "recut.remotion-studio.brief@1", value: brief });
}

function latestBrief(_, ctx) {
  ensureSchema(ctx);
  const rows = ctx.sqlite.query("select id, template, topic, details, expected_duration_sec, material_json, created_at from briefs where project_id = ? order by created_at desc limit 1", [scope(ctx)]);
  if (!rows.length) return null;
  const row = rows[0];
  return { id: row.id, template: row.template, topic: row.topic, details: row.details, expectedDurationSec: row.expected_duration_sec, materialAssetIds: JSON.parse(row.material_json), createdAt: row.created_at };
}

function workspaceSeeded(ctx) {
  try {
    const marker = ctx.files.readText(`${WORKSPACE}/.recut-workspace`);
    return Boolean(marker && marker.trim());
  } catch (_) { return false; }
}

function workspaceEnsure(_, ctx) {
  ensureSchema(ctx);
  if (!workspaceSeeded(ctx)) {
    const seeded = ctx.shell.run({ command: "node", args: ["seed.js"], timeoutSeconds: 180 });
    if (seeded.exitCode !== 0) throw new Error(`工作区初始化失败：${seeded.error || seeded.stdout || "seed.js 退出非零"}`);
  }
  return { ready: workspaceSeeded(ctx), root: WORKSPACE };
}

function workspaceReset(_, ctx) {
  ensureSchema(ctx);
  // 停止预览服务，删除项目 workspace 与 serve 状态，清空素材登记与旧工作区任务历史，再从骨架重新 seed。
  const rows = ctx.sqlite.query("select value from app_meta where key = ?", [`serve_job:${scope(ctx)}`]);
  if (rows.length) {
    try { ctx.shell.cancel(rows[0].value); } catch (_) { /* job 可能已结束 */ }
  }
  for (const key of [`serve_job:${scope(ctx)}`, `serve_jobs:${scope(ctx)}`, `terminal_jobs:${scope(ctx)}`]) {
    ctx.sqlite.execute("delete from app_meta where key = ?", [key]);
  }
  const removed = ctx.shell.run({ command: "rm", args: ["-rf", WORKSPACE, "serve"], cwd: "files", timeoutSeconds: 120 });
  if (removed.exitCode !== 0) throw new Error(`工作区重置失败：${removed.error || removed.stdout || "rm 退出非零"}`);
  ctx.sqlite.execute("delete from composition_assets where project_id = ?", [scope(ctx)]);
  workspaceEnsure({}, ctx);
  return { ok: true, seeded: true, root: WORKSPACE };
}

function listRecursive(ctx, base) {
  const result = [];
  const walk = (prefix) => {
    let entries = [];
    try { entries = ctx.files.list(prefix); } catch (_) { result.push(prefix); return; }
    entries.forEach((name) => {
      if (name === "node_modules" || name === ".git") return;
      const child = prefix ? `${prefix}/${name}` : name;
      let sub = [];
      try { sub = ctx.files.list(child); } catch (_) { result.push(child); return; }
      walk(child);
    });
  };
  walk(base);
  return result;
}

function codeList(_, ctx) {
  ensureSchema(ctx);
  if (!workspaceSeeded(ctx)) return { root: WORKSPACE, files: [] };
  return { root: WORKSPACE, files: listRecursive(ctx, WORKSPACE) };
}

function codeRead(input, ctx) {
  ensureSchema(ctx);
  const path = String(input.path || "").trim();
  assertWorkspacePath(path);
  return { path, content: ctx.files.readText(path) };
}

function codeWrite(input, ctx) {
  ensureSchema(ctx);
  const path = String(input.path || "").trim();
  assertWorkspacePath(path);
  const content = String(input.content ?? "");
  ctx.files.writeText(path, content);
  return { path, bytes: content.length };
}

function assertWorkspacePath(path) {
  if (!path || !/^workspace\//.test(path) || path.includes("..") || path.startsWith(`${WORKSPACE}/node_modules`)) {
    throw new Error("code 路径必须位于 workspace/ 内且不允许越界");
  }
}

function registeredAssets(ctx) {
  ensureSchema(ctx);
  return ctx.sqlite.query("select asset_id from composition_assets where project_id = ? order by created_at asc", [scope(ctx)]).map((row) => row.asset_id);
}

function registerAssets(input, ctx) {
  ensureSchema(ctx);
  const assetIds = Array.isArray(input.assetIds) ? input.assetIds.filter((value) => typeof value === "string" && Boolean(value.trim())) : [];
  ctx.sqlite.execute("delete from composition_assets where project_id = ?", [scope(ctx)]);
  const now = new Date().toISOString();
  assetIds.forEach((assetId) => {
    ctx.sqlite.execute("insert or ignore into composition_assets (project_id, asset_id, created_at) values (?, ?, ?)", [scope(ctx), assetId, now]);
  });
  return { assetIds };
}

function ensureRenderDeps(ctx) {
  const node = ctx.shell.run({ command: "node", args: ["--version"], timeoutSeconds: 30 });
  const checks = { node: node.exitCode === 0 ? { ok: true, version: String(node.stdout || "").trim() } : { ok: false, error: node.error || "node 不可用，请先安装 Node.js 18+" } };
  if (checks.node.ok) {
    const deps = ctx.shell.run({ command: "node", args: ["remotion-skeleton/node-check.js"], timeoutSeconds: 180 });
    if (deps.exitCode === 0) {
      checks.renderWorkspace = { ok: true };
    } else {
      let install = ctx.shell.run({ command: "npm", args: ["ci", "--prefix", "remotion-skeleton", "--no-audit", "--no-fund"], timeoutSeconds: 1800 });
      if (install.exitCode !== 0) {
        install = ctx.shell.run({ command: "npm", args: ["install", "--prefix", "remotion-skeleton", "--no-audit", "--no-fund"], timeoutSeconds: 1800 });
      }
      checks.renderWorkspace = install.exitCode === 0 ? { ok: true } : { ok: false, error: install.error || "npm 依赖安装失败" };
    }
  }
  const ready = Object.values(checks).every((item) => item && item.ok);
  return { ready, checks };
}

function renderSetup(_, ctx) {
  ensureSchema(ctx);
  return ensureRenderDeps(ctx);
}

function previewServeStart(_, ctx) {
  ensureSchema(ctx);
  workspaceEnsure({}, ctx);
  const existing = previewServeStatus({}, ctx);
  if (existing.running) return { jobId: existing.jobId, phase: existing.phase, port: existing.port, url: existing.url };
  // 项目工程的 Makefile 内部处理依赖与端口冲突；无法解决时把可读错误抛给 AI。
  const job = ctx.shell.start({ command: "make", args: ["-C", "workspace", "start"], cwd: "files", timeoutSeconds: 0 });
  trackJob(ctx, `serve_jobs:${scope(ctx)}`, job.id);
  ctx.sqlite.execute("insert or replace into app_meta (key, value) values (?, ?)", [`serve_job:${scope(ctx)}`, job.id]);
  return { jobId: job.id, phase: "starting", port: null, url: null };
}

function previewServeStatus(_, ctx) {
  ensureSchema(ctx);
  const rows = ctx.sqlite.query("select value from app_meta where key = ?", [`serve_job:${scope(ctx)}`]);
  if (!rows.length) return { running: false, phase: "stopped", port: null, url: null, error: null };
  const jobId = rows[0].value;
  let jobStatus = "unknown";
  let jobError = "";
  try {
    const job = ctx.shell.status(jobId);
    jobStatus = job.status;
    jobError = job.error || "";
  } catch (_) { /* job 已不可查 */ }
  if (["completed", "failed", "cancelled", "interrupted"].includes(jobStatus)) {
    return { running: false, phase: jobStatus, port: null, url: null, error: jobError || `预览服务已结束（${jobStatus}）`, jobId };
  }
  let port = null;
  let phase = "starting";
  let error = null;
  try {
    const status = JSON.parse(ctx.files.readText(`serve/status.json`));
    if (status && status.port) { port = Number(status.port); phase = status.phase || phase; error = status.error || null; }
  } catch (_) { /* 尚未写状态 */ }
  const running = jobStatus === "running" || jobStatus === "queued";
  return { running, phase, port, url: port ? `http://127.0.0.1:${port}/player.html` : null, error, jobId };
}

function previewServeStop(_, ctx) {
  ensureSchema(ctx);
  const rows = ctx.sqlite.query("select value from app_meta where key = ?", [`serve_job:${scope(ctx)}`]);
  if (rows.length) {
    try { ctx.shell.cancel(rows[0].value); } catch (_) { /* job 可能已结束 */ }
  }
  ctx.sqlite.execute("delete from app_meta where key = ?", [`serve_job:${scope(ctx)}`]);
  return { stopped: true };
}

function previewProps(input, ctx) {
  ensureSchema(ctx);
  workspaceEnsure({}, ctx);
  const brief = latestBrief({}, ctx);
  const media = input.media && typeof input.media === "object" && !Array.isArray(input.media) ? input.media : {};
  const settings = input.settings && typeof input.settings === "object" && !Array.isArray(input.settings) ? input.settings : { width: 1920, height: 1080, fps: 30 };
  const payload = { brief, media, settings, at: new Date().toISOString() };
  ctx.files.writeText(`${WORKSPACE}/preview/props.json`, JSON.stringify(payload));
  return { ok: true, path: `${WORKSPACE}/preview/props.json` };
}

function terminalExec(input, ctx) {
  ensureSchema(ctx);
  const command = String(input.command || "").trim();
  if (!command) throw new Error("command 是必填项");
  const cwd = String(input.cwd || "").trim();
  if (cwd && (cwd.includes("..") || cwd.startsWith("/"))) throw new Error("cwd 必须是相对项目目录的路径");
  const job = ctx.shell.run({ command: "sh", args: ["-c", cwd ? `cd ${cwd} && ${command}` : command], cwd: "files", timeoutSeconds: Number(input.timeoutSeconds || 60) });
  trackJob(ctx, `terminal_jobs:${scope(ctx)}`, job.jobId);
  return { jobId: job.jobId, status: job.status, exitCode: job.exitCode, output: job.stdout || "", error: job.error || "" };
}

function readLogs(input, ctx) {
  ensureSchema(ctx);
  const jobId = String(input.jobId || "").trim();
  if (!jobId) throw new Error("jobId 是必填项");
  const job = ctx.shell.status(jobId);
  const limit = Math.max(1, Math.min(Number(input.limit || 500), 2000));
  let logs = [];
  try { logs = ctx.shell.logs(jobId); } catch (_) { /* 日志暂不可读 */ }
  return { jobId, status: job.status, logs: logs.slice(-limit).map((line) => ({ sequence: line.sequence, stream: line.stream, text: line.text, timestamp: line.timestamp })) };
}

// logs.list 汇总本项目 App 启动过的全部 shell 任务日志（预览服务、终端命令、
// 渲染导出），按时间线排序后一次返回，供界面在挂载或切换时回填；shell 结果
// 均为 camelCase map（status/stream/text/timestamp/sequence）。
function collectJobIds(ctx) {
  const ids = [];
  const seen = new Set();
  const push = (jobId) => {
    const value = String(jobId || "").trim();
    if (value && !seen.has(value)) { seen.add(value); ids.push(value); }
  };
  for (const key of [`serve_job:${scope(ctx)}`, `serve_jobs:${scope(ctx)}`, `terminal_jobs:${scope(ctx)}`]) {
    ctx.sqlite.query("select value from app_meta where key = ?", [key]).forEach((row) => { String(row.value || "").split(",").filter(Boolean).forEach(push); });
  }
  ctx.sqlite.query("select shell_job_id from exports where project_id = ?", [scope(ctx)]).forEach((row) => push(row.shell_job_id));
  return ids;
}

function listLogs(_, ctx) {
  ensureSchema(ctx);
  const lines = [];
  for (const jobId of collectJobIds(ctx)) {
    let status = "";
    let logs = [];
    try {
      status = ctx.shell.status(jobId).status;
      logs = ctx.shell.logs(jobId);
    } catch (_) { continue; }
    logs.forEach((line) => lines.push({ jobId, status, sequence: line.sequence ?? 0, stream: line.stream, text: line.text, timestamp: line.timestamp }));
  }
  lines.sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : (a.sequence ?? 0) - (b.sequence ?? 0)));
  return { lines };
}

function workflowContext(_, ctx) {
  ensureSchema(ctx);
  const brief = latestBrief({}, ctx);
  const seeded = workspaceSeeded(ctx);
  const stage = !brief ? "brief" : "studio";
  const serve = previewServeStatus({}, ctx);
  return {
    revision: `${stage}:${brief?.createdAt || "none"}:${seeded ? "workspace-seeded" : "no-workspace"}`,
    stage,
    nextAction: stage === "brief" ? "create_brief" : "edit_composition_code",
    brief,
    workspace: { root: WORKSPACE, seeded },
    preview: serve,
    registeredAssets: registeredAssets(ctx),
    catalogs: { styleTemplates: STYLE_TEMPLATES, captionThemes: CAPTION_THEMES, canvasSizes: CANVAS_SIZES },
    allowedActions: stage === "brief" ? ["create_brief"] : ["workspace.ensure", "code.list", "code.read", "code.write", "composition.assets", "preview.serve.start", "preview.serve.status", "preview.serve.stop", "preview.props", "terminal.exec", "logs.read", "render.export"],
    mediaExecution: {
      composition: { kind: "per-project-code", generate: "用 code.list/code.read 读项目 workspace 的 composition 源码，用 code.write 直接改写 src/Root.tsx 与 src/compositions/ 成片代码；复用 src/effects、src/captions、src/components；画面素材用 resolveMediaUrl(assetId) 引用", complete: "code.write 保存后 Vite dev server 自动热更新预览；把代码引用的素材 assetId 用 composition.assets 登记，导出才能物化" },
    },
  };
}

function renderExport(input, ctx) {
  ensureSchema(ctx);
  const brief = latestBrief({}, ctx);
  if (!brief) throw new Error("还没有 Brief，请先让用户提交选题");
  workspaceEnsure({}, ctx);
  const renderId = id();
  const now = new Date().toISOString();
  const width = Number(input.width || 1920);
  const height = Number(input.height || 1080);
  const fps = Number(input.fps || 30);
  if (![24, 30].includes(fps)) throw new Error("fps 必须是 24 或 30");
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 320 || height < 320 || width > 3840 || height > 3840) throw new Error("width/height 必须在 320–3840 之间");
  const codec = String(input.codec || "h264");
  const label = String(input.label || "remotion 渲染导出");

  const assetIds = Array.from(new Set([...(brief.materialAssetIds || []), ...registeredAssets(ctx)]));
  const media = {};
  assetIds.forEach((assetId) => {
    if (media[assetId]) return;
    const materialized = ctx.media.materialize(assetId);
    media[assetId] = { kind: materialized.kind, mimeType: materialized.mimeType, path: materialized.path };
  });

  const payload = { brief, media, settings: { width, height, fps, codec } };
  ctx.files.writeText(`exports/${renderId}/props.json`, JSON.stringify(payload));
  ctx.files.writeText(`exports/${renderId}/progress.json`, JSON.stringify({ phase: "queued", progress: 0, message: "任务已排队" }));

  const job = ctx.shell.start({ command: "node", args: ["workspace/render.js", "--renderId", renderId], cwd: "files", timeoutSeconds: 3600 });
  const settings = { width, height, fps, codec, label };
  ctx.sqlite.execute("insert into exports (render_id, project_id, brief_id, shell_job_id, status, label, settings_json, asset_id, error, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [renderId, scope(ctx), brief.id, job.id, "queued", label, JSON.stringify(settings), null, null, now, now]);
  return { renderId, shellJobId: job.id, status: "queued", briefId: brief.id };
}

function exportRow(ctx, renderId) {
  const rows = ctx.sqlite.query("select render_id, brief_id, shell_job_id, status, label, settings_json, asset_id, error, created_at, updated_at from exports where render_id = ? and project_id = ?", [renderId, scope(ctx)]);
  if (!rows.length) throw new Error(`渲染任务 ${renderId} 不存在`);
  const row = rows[0];
  return { renderId: row.render_id, briefId: row.brief_id, shellJobId: row.shell_job_id, status: row.status, label: row.label, settings: JSON.parse(row.settings_json), assetId: row.asset_id, error: row.error, createdAt: row.created_at, updatedAt: row.updated_at };
}

function renderStatus(input, ctx) {
  ensureSchema(ctx);
  const renderId = String(input.renderId || "").trim();
  if (!renderId) throw new Error("renderId 是必填项");
  const record = exportRow(ctx, renderId);
  if (record.status === "completed" || record.status === "cancelled" || record.status === "failed") {
    return { renderId, status: record.status, assetId: record.assetId, error: record.error, label: record.label, settings: record.settings };
  }
  const job = ctx.shell.status(record.shellJobId);
  let progress = null;
  try { progress = JSON.parse(ctx.files.readText(`exports/${renderId}/progress.json`)); } catch (_) { /* 尚未写入进度文件 */ }
  if (job.status === "completed") {
    if (!record.assetId) {
      const asset = ctx.media.importFile({ path: `exports/${renderId}/out.mp4`, name: record.label + ".mp4", mimeType: "video/mp4" });
      if (ctx.project && typeof ctx.project.setCover === "function") ctx.project.setCover({ assetId: asset.id });
      const now = new Date().toISOString();
      ctx.sqlite.execute("update exports set status = 'completed', asset_id = ?, updated_at = ? where render_id = ? and project_id = ?", [asset.id, now, renderId, scope(ctx)]);
      return { renderId, status: "completed", assetId: asset.id, progress, label: record.label, settings: record.settings };
    }
    return { renderId, status: "completed", assetId: record.assetId, progress, label: record.label, settings: record.settings };
  }
  if (job.status === "failed" || job.status === "interrupted" || job.status === "cancelled") {
    const now = new Date().toISOString();
    const error = job.error || (job.status === "cancelled" ? "渲染任务已取消" : "渲染失败，请查看渲染日志");
    ctx.sqlite.execute("update exports set status = ?, error = ?, updated_at = ? where render_id = ? and project_id = ?", [job.status, error, now, renderId, scope(ctx)]);
    return { renderId, status: job.status, error, progress, label: record.label, settings: record.settings };
  }
  return { renderId, status: job.status, progress, label: record.label, settings: record.settings };
}

function renderCancel(input, ctx) {
  ensureSchema(ctx);
  const renderId = String(input.renderId || "").trim();
  if (!renderId) throw new Error("renderId 是必填项");
  const record = exportRow(ctx, renderId);
  if (record.status === "queued" || record.status === "running") {
    ctx.shell.cancel(record.shellJobId);
  }
  const now = new Date().toISOString();
  ctx.sqlite.execute("update exports set status = 'cancelled', updated_at = ? where render_id = ? and project_id = ?", [now, renderId, scope(ctx)]);
  return { renderId, status: "cancelled" };
}

function listExports(_, ctx) {
  ensureSchema(ctx);
  return ctx.sqlite.query("select render_id, brief_id, status, label, settings_json, asset_id, error, created_at from exports where project_id = ? order by created_at desc", [scope(ctx)]).map((row) => ({ renderId: row.render_id, status: row.status, label: row.label, settings: JSON.parse(row.settings_json), assetId: row.asset_id, error: row.error, createdAt: row.created_at }));
}

recut.operation.register("project.create", createBrief);
recut.operation.register("brief.latest", latestBrief);
recut.operation.register("workflow.context", workflowContext);
recut.operation.register("catalog.list", catalog);
recut.operation.register("workspace.ensure", workspaceEnsure);
recut.operation.register("workspace.reset", workspaceReset);
recut.operation.register("code.list", codeList);
recut.operation.register("code.read", codeRead);
recut.operation.register("code.write", codeWrite);
recut.operation.register("composition.assets", registerAssets);
recut.operation.register("preview.serve.start", previewServeStart);
recut.operation.register("preview.serve.status", previewServeStatus);
recut.operation.register("preview.serve.stop", previewServeStop);
recut.operation.register("preview.props", previewProps);
recut.operation.register("terminal.exec", terminalExec);
recut.operation.register("logs.read", readLogs);
recut.operation.register("logs.list", listLogs);
recut.operation.register("render.setup", renderSetup);
recut.operation.register("render.export", renderExport);
recut.operation.register("render.status", renderStatus);
recut.operation.register("render.cancel", renderCancel);
recut.operation.register("export.list", listExports);
