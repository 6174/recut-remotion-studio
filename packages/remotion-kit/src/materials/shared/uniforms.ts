/**
 * [INPUT]: 依赖 React 与 Three；由所有 material 组件引用
 * [OUTPUT]: 对外提供 useMaterialUniforms，统一「一次编译 shader + 逐帧只更新 uniform」的纪律
 * [POS]: remotion-kit/src/materials 的 uniform 生命周期工具；禁止任何材质重建 shader 或发起独立动画循环
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useLayoutEffect, useMemo, useRef } from "react";
import type * as THREE from "three";

type UniformMap = Record<string, THREE.IUniform>;

/**
 * 创建并持有 material 实例与 uniforms：
 * - `build`：创建 uniform 对象（内容纹理/静态几何值），**只在挂载时运行一次**；
 * - `update`：每次渲染后写入最新派生值（时间、强度、镜头位置…）。
 * 动态值必须放进 `update`，build 只放生命周期内不变的纹理/几何；避免每帧 new Uniform。
 * ref 仅在提交后可用，因此更新放在 useLayoutEffect，保证第一帧即生效。
 */
export const useMaterialUniforms = <T extends THREE.ShaderMaterial>(
  build: () => UniformMap,
  update: (uniforms: UniformMap) => void,
) => {
  const material = useRef<T>(null);
  const buildRef = useRef(build);
  const updateRef = useRef(update);
  buildRef.current = build;
  updateRef.current = update;
  const uniforms = useMemo(() => buildRef.current(), []);
  useLayoutEffect(() => {
    if (!material.current) return;
    updateRef.current(material.current.uniforms);
  });
  return { material, uniforms };
};
