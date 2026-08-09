/**
 * [INPUT]: 依赖 node:module registerHooks（node 22.12+）
 * [OUTPUT]: 让 node 直接跑 src/*.ts 纯函数：ESM 相对导入补全 .ts 后缀
 * [POS]: remotion-kit 的测试辅助；不参与运行时构建
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      specifier.startsWith(".") &&
      !specifier.endsWith(".ts") &&
      !specifier.endsWith(".js") &&
      !specifier.endsWith(".mjs") &&
      !specifier.endsWith(".json")
    ) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});
