/**
 * [INPUT]: React DOM 与本目录 MaterialLab、style.css
 * [OUTPUT]: 对外提供 spline-material.html 的浏览器调试入口
 * [POS]: 独立实验页；Spline Material 面板模拟 + lamina 式图层引擎的可视验收
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { createRoot } from "react-dom/client";
import { MaterialLab } from "./Lab";
import "./style.css";

createRoot(document.getElementById("root")!).render(<MaterialLab />);
