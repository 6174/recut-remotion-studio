import { createRoot } from "react-dom/client";
import { getRecutLocale } from "./recut-sdk";
import App from "./app";
import "./style.css";

document.documentElement.lang = getRecutLocale() === "zh" ? "zh-CN" : "en";

createRoot(document.getElementById("root")!).render(<App />);
