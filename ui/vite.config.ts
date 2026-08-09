import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    // @recut/remotion-kit 是 file: 符号链接依赖，包内自带一份 react/remotion 拷贝；
    // 必须 dedupe 到本项目 node_modules 的单份实例，否则 @remotion/player 提供的
    // Remotion React context 会被另一份 remotion 读到，出现 "No video config found"。
    dedupe: ["remotion", "react", "react-dom", "@remotion/player"],
    preserveSymlinks: true,
  },
});
