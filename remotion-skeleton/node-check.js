/**
 * [INPUT]: 依赖 remotion-skeleton/package.json 安装出的预览与导出运行包
 * [OUTPUT]: 对外提供 Remotion 预览/渲染/实验依赖安装自检；缺包时以非零退出码阻止启动
 * [POS]: remotion-skeleton 的依赖探针单一真相源；Makefile install 与 render.setup 共用它
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
const REQUIRED_PACKAGES = [
  "@remotion/renderer",
  "@remotion/bundler",
  "@remotion/player",
  "@remotion/media",
  "@remotion/transitions",
  "@remotion/three",
  "@react-three/fiber",
  "three",
  "remotion",
  "react",
  "vite",
];

function resolvePackage(packageName) {
  try {
    return require.resolve(packageName);
  } catch (entryError) {
    try {
      return require.resolve(packageName + "/package.json");
    } catch (_) {
      throw entryError;
    }
  }
}

try {
  for (const packageName of REQUIRED_PACKAGES) {
    resolvePackage(packageName);
  }
  console.log("remotion-skeleton: ok");
  process.exit(0);
} catch (error) {
  console.error("remotion-skeleton: missing dependencies");
  console.error(String(error && error.message ? error.message : error));
  process.exit(1);
}
