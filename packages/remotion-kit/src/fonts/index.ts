/**
 * [INPUT]: 依赖 remotion 的 delayRender/continueRender 与按环境物化的字体 CSS 路径
 * [OUTPUT]: 对外提供 FontProvider / fontCssUrl —— 注入物化后的 @font-face 并等待
 *           document.fonts 就绪，保证预览/渲染同源、首帧不回退、渲染期零运行时网络
 * [POS]: remotion-kit 的字体加载边界；组成代码在根挂 FontProvider 并传入按环境解析的
 *        css 路径（预览=CDN、渲染=render.js 本地物化的 /fonts/{id}.css），caption 主题
 *        经 CaptionTheme 的 fontFamily 覆盖，正文经 palette.fontFamily 读取
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React, { useEffect } from "react";
import { continueRender, delayRender } from "remotion";

/** Recut 自有 CDN 自托管字体根（与 apps/editor 同一份二进制，零 Google 依赖）。 */
export const FONT_CDN_BASE = "https://cdn.recut.video/fonts/google";

/** 指定家族的 CDN 端 @font-face CSS（绝对 CDN 地址 + unicode-range 分片）。 */
export const fontCssUrl = (id: string): string =>
  `${FONT_CDN_BASE}/${encodeURIComponent(id)}.css`;

const injectedFonts = new Set<string>();

/** 物化后的字体 CSS 路径（预览传 CDN，渲染传 render.js 本地的 /fonts/{id}.css）。 */
export function resolveFontCss(id: string, css?: string | null): string {
  const explicit = String(css || "").trim();
  return explicit || fontCssUrl(id);
}

/**
 * 注入字体 CSS 并阻塞渲染直到字体就绪。
 * 重复的家族只注入一次；每次调用各占一个 delayRender handle，就绪后释放。
 */
export function loadFontFamily({
  id,
  css,
}: {
  id: string;
  css?: string | null;
}): string {
  const cssPath = resolveFontCss(id, css);
  const handle = delayRender(`font:${id}`);

  const release = () => {
    try {
      continueRender(handle);
    } catch (_) {
      /* 渲染已完成时继续释放为幂等 no-op。 */
    }
  };

  const waitFonts = () => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(release).catch(release);
    } else {
      release();
    }
  };

  if (typeof document !== "undefined" && !injectedFonts.has(cssPath)) {
    injectedFonts.add(cssPath);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssPath;
    link.onload = waitFonts;
    link.onerror = release;
    document.head.appendChild(link);
  } else {
    waitFonts();
  }

  return cssPath;
}

/**
 * 顶层字体载体：为 {id} 注入字体 CSS（按环境物化的路径）并等待就绪。
 * css 预览态传 CDN 绝对 URL，渲染态传 render.js 生成的 /fonts/{id}.css（本地，
 * 零运行时网络）。缺省回退 CDN。组件只做声明式副作用（注入 link 并阻塞到字体就绪），
 * 渲染 null，不包裹内容——避免多家族重复挂载同一内容树。
 * 用法：{fontEntries.map(([id]) => <FontProvider key={id} id={id} css={...} />)}
 */
export const FontProvider: React.FC<{ id: string; css?: string | null }> = ({ id, css }) => {
  useEffect(() => {
    loadFontFamily({ id, css });
  }, [id, css]);
  return null;
};