/**
 * [INPUT]: @react-three/fiber、three 与本目录 effects.ts 的 buildEffectMaterial
 * [OUTPUT]: 对外提供 PostFX：接管 R3F 渲染循环（priority=1），场景 → WebGLRenderTarget → 全屏效果合成
 * [POS]: spline-material 的全局后处理管线；Effects 面板的每一条 EffectState 都按顺序作用于整帧画面
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, type FC } from "react";
import * as THREE from "three";
import { buildEffectMaterial } from "./effects";
import type { EffectState } from "./effects-config";

export const PostFX: FC<{ effects: EffectState[] }> = ({ effects }) => {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  const target = useMemo(
    () =>
      new THREE.WebGLRenderTarget(1, 1, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: true,
        // Canvas 的 antialias 只作用于默认帧缓冲；渲染到 target 的效果链路必须显式开 MSAA，否则整帧锯齿
        samples: 4,
      }),
    [],
  );
  const quadScene = useMemo(() => {
    const s = new THREE.Scene();
    return s;
  }, []);
  const quadCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
  const material = useMemo(() => buildEffectMaterial(effects), [effects]);
  const sizeVector = useMemo(() => new THREE.Vector2(), []);

  useEffect(() => {
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    quad.frustumCulled = false;
    quadScene.add(quad);
    return () => {
      quadScene.remove(quad);
      quad.geometry.dispose();
    };
  }, [material, quadScene]);

  useEffect(
    () => () => {
      material.dispose();
      target.dispose();
    },
    [material, target],
  );

  useFrame(({ clock }) => {
    gl.getDrawingBufferSize(sizeVector);
    if (target.width !== sizeVector.x || target.height !== sizeVector.y) {
      target.setSize(sizeVector.x, sizeVector.y);
      material.uniforms.u_res.value.copy(sizeVector);
    }
    material.uniforms.tDiffuse.value = target.texture;
    material.uniforms.u_time.value = clock.elapsedTime;

    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.render(quadScene, quadCamera);
  }, 1);

  return null;
};
