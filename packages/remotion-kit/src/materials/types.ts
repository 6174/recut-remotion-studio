/**
 * [INPUT]: 依赖 React/Three 类型，无运行时依赖
 * [OUTPUT]: 对外提供 MaterialCategory、MaterialParamSchema、MaterialDefinition 与 MaterialElementProps 契约
 * [POS]: remotion-kit/src/materials 的契约层；registry/catalog/shot-graph 通过它保持无内容耦合
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { FC } from "react";
import type * as THREE from "three";

/** 材质类别：后处理（消费内容纹理）/ 转场（顶点变形 + 消费纹理）/ 环境（程序化，可选纹理） */
export type MaterialCategory = "post" | "transform" | "ambient";

/** 材质唯一 id；同时是 catalog effects 的 engine=three 条目 id */
export type MaterialId =
  | "glitch"
  | "crt"
  | "vintage"
  | "magnify"
  | "glass"
  | "bubble"
  | "article-highlight"
  | "bend"
  | "store-peel"
  | "clouds";

/** 语义参数 schema：限制参数范围，给 catalog、Agent 与未来表单共用 */
export type MaterialParamSchema =
  | { type: "number"; min?: number; max?: number; default: number }
  | { type: "boolean"; default: boolean };

/** 材质元数据注册项；渲染实现由各 material 组件与 MaterialElement 提供 */
export interface MaterialDefinition {
  id: MaterialId;
  label: string;
  category: MaterialCategory;
  description: string;
  /** 是否消费内容纹理（ambient 可不消费，直接以 uTime 生成画面） */
  consumesMap: boolean;
  /** 语义参数表；无参数时为 {} */
  schema: Record<string, MaterialParamSchema>;
}

/** MaterialElement 的统一 props：内容纹理 + Remotion 帧 + 语义参数 */
export interface MaterialElementProps {
  id: MaterialId;
  map: THREE.Texture | null;
  frame: number;
  /** 视频帧率；缺省 30。uTime 按 frame/fps 派生，保证任意 fps 下速度一致。 */
  fps?: number;
  width: number;
  height: number;
  options?: Record<string, unknown>;
}

/** 语义参数读取工具：缺省回退 schema default */
export const materialOption = (
  options: Record<string, unknown> | undefined,
  name: string,
  fallback: number,
): number => {
  const value = options?.[name];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

export type MaterialRegistry = Record<MaterialId, MaterialDefinition>;

export type { FC };
