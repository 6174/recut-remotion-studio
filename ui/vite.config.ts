import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    // @recut/remotion-kit 是 file: 符号链接依赖；保留链接路径，让包内对
    // react/remotion 的裸导入从本项目 node_modules 解析。
    preserveSymlinks: true,
  },
});
