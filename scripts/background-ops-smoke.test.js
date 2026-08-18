/**
 * L1 后台操作 smoke test（无需真实 Recut 服务）：在 node 沙箱里加载 background.js，
 * 用假 ctx 校验 music.import / music.selected / fonts.select / fonts.selected / preview.props。
 * 运行：node scripts/background-ops-smoke.test.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const code = fs.readFileSync(path.join(root, "background.js"), "utf8");

const appMeta = new Map();
const written = [];
const imports = [];

function makeCtx() {
  const ctx = {
    locale: "zh",
    project: { id: "proj-1" },
    sqlite: {
      execute(query, params = []) {
        if (/insert or replace into app_meta/.test(query.trim())) { appMeta.set(params[0], params[1]); return; }
        if (/delete from app_meta where key = \?/.test(query.trim())) { appMeta.delete(params[0]); return; }
        // create/alter tables are no-ops in the harness.
      },
      query(query, params = []) {
        if (query.trim().startsWith("pragma table_info")) return [];
        if (/^select value from app_meta where key = \?$/.test(query.trim())) {
          const value = appMeta.get(params[0]);
          return value === undefined ? [] : [{ value }];
        }
        return [];
      },
    },
    files: {
      writeText(_p, _text) {},
      writeBase64(p, base64) { written.push({ p, base64 }); },
      readText(p) { return p.startsWith("workspace/.recut") ? "seeded" : ""; },
    },
    media: {
      importFile(input) { imports.push(input); return { id: "asset-music-1", kind: "audio" }; },
      materialize() { throw new Error("not used"); },
    },
    shell: {
      run(input) {
        const url = input.args[input.args.length - 1];
        if (String(url).includes(".mp3")) {
          // downloadToFile 写文件后打印一行完成标记，不携带二进制。
          return { exitCode: 0, stdout: "downloaded\n", error: "" };
        }
        if (/^music\//.test(String(input.args[input.args.length - 2] || ""))) {
          // node -e <script> <url> <out> → 脚本写 out 后打印完成标记。
          return { exitCode: 0, stdout: "downloaded\n", error: "" };
        }
        return { exitCode: 0, stdout: "{}", error: "" };
      },
    },
  };
  return ctx;
}

const registered = {};
const sandbox = {
  console,
  Buffer,
  recut: {
    operation: { register: (name, fn) => { registered[name] = fn; } },
  },
};
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: "background.js" });

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

const ctx = makeCtx();

// music.import：首次导入（UI 传入 CDN url 与元数据，catalog-first）
const first = registered["music.import"]({ trackId: "oga-bossa-nova", url: "https://cdn.recut.video/audio/music/oga-bossa-nova.mp3", name: "8-Bit Bossa", duration: 59.61, license: "CC0", source: "https://opengameart.org/content/bossa-nova", attribution: "OpenGameArt" }, ctx);
assert(first && first.assetId === "asset-music-1", "music.import should return imported assetId");
assert(imports.length === 1 && imports[0].mimeType === "audio/mpeg", "music.import should importFile audio/mpeg");
assert(written.some((w) => /^music\/.*\.mp3$/.test(w.p)) === false, "music.import should NOT write via writeBase64 (writes file via shell)");
assert(registered["music.selected"]({}, ctx).assetId === "asset-music-1", "music.selected should read back assetId");

// 幂等：同曲目二次调用不重复下载
const before = imports.length;
const second = registered["music.import"]({ trackId: "oga-bossa-nova" }, ctx);
assert(second.assetId === "asset-music-1" && imports.length === before, "music.import should be idempotent per track");

// 空 trackId 清除选择
const cleared = registered["music.import"]({ trackId: "" }, ctx);
assert(cleared.assetId === null && registered["music.selected"]({}, ctx).assetId === null, "empty trackId should clear selection");

// fonts.select / selected（google 来源）
registered["fonts.select"]({ familyId: "noto-sans-sc", source: "google" }, ctx);
assert(registered["fonts.selected"]({}, ctx).familyId === "noto-sans-sc", "fonts.selected should read back familyId");
assert(registered["fonts.selected"]({}, ctx).source === "google", "fonts.selected should read back source");

// previewProps 透传 music 与 fonts（google 家族带物化 css 路径）
let lastProps = null;
ctx.files.writeText = (p, text) => { lastProps = JSON.parse(text); };
registered["preview.props"]({ media: {}, settings: { width: 1920, height: 1080, fps: 30 }, music: { assetId: "asset-music-1" } }, ctx);
assert(lastProps && lastProps.music && lastProps.music.assetId === "asset-music-1", "preview.props should carry music");
assert(lastProps.fonts && lastProps.fonts["noto-sans-sc"] && typeof lastProps.fonts["noto-sans-sc"].css === "string", "preview.props should carry google fonts css path");

// 系统字体来源走独立分支：持久化 source=system，projectFonts 不产 css（本机直接用）。
registered["fonts.select"]({ familyId: "PingFang SC", source: "system" }, ctx);
assert(registered["fonts.selected"]({}, ctx).source === "system", "system font source should persist");
ctx.files.writeText = (p, text) => { lastProps = JSON.parse(text); };
registered["preview.props"]({ media: {}, settings: { width: 1920, height: 1080, fps: 30 } }, ctx);
assert(lastProps.fonts && lastProps.fonts["PingFang SC"] && lastProps.fonts["PingFang SC"].system === true, "system font should carry system flag without css");

// workflowContext 资源可见性
registered["music.import"]({ trackId: "oga-bossa-nova", url: "https://cdn.recut.video/audio/music/oga-bossa-nova.mp3", name: "8-Bit Bossa", duration: 59.61, license: "CC0", source: "x", attribution: "y" }, ctx);
ctx.sqlite.query = (query, params = []) => {
  if (query.trim().startsWith("pragma table_info")) return [];
  if (/^select value from app_meta where key = \?$/.test(query.trim())) {
    const value = appMeta.get(params[0]);
    return value === undefined ? [] : [{ value }];
  }
  return [];
};
const wc = registered["workflow.context"]({}, ctx);
assert(wc.resources.music && wc.resources.music.assetId === "asset-music-1", "workflow.context resources.music assetId");
assert(wc.resources.fonts && wc.resources.fonts.familyId === "PingFang SC", "workflow.context resources.fonts familyId");
assert(wc.resources.fonts && wc.resources.fonts.source === "system", "workflow.context resources.fonts source");

console.log("background-ops-smoke: OK (music.import/selected, fonts.select(source)/selected, preview.props music+fonts, workflow.context)");