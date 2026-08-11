/**
 * [INPUT]: 依赖 Three 场景节点与 SurfaceMoveDescriptor 的 shell 语义。
 * [OUTPUT]: 对外提供 BrowserSurfaceShell：为 HtmlSurface 增加有厚度的 Chrome 式浏览器外框。
 * [POS]: three/ 的内容外壳层；ShotGraph 在 surface 姿态 group 内挂载它，未来手机/设备模型沿同一 shell 边界扩展。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";

export interface BrowserSurfaceShellProps {
  width: number;
  height: number;
}

/** 简洁的浏览器实体：背板给出真实厚度，顶部 bar 与三枚控制点建立清楚的产品语义。 */
export const BrowserSurfaceShell: React.FC<BrowserSurfaceShellProps> = ({ width, height }) => {
  const border = 0.12;
  const barHeight = 0.24;
  const top = height / 2 + barHeight / 2 - 0.02;
  return (
    <>
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[width + border * 2, height + barHeight + border, 0.18]} />
        <meshBasicMaterial color="#111827" toneMapped={false} />
      </mesh>
      <mesh position={[0, top, 0.015]}>
        <boxGeometry args={[width + border * 2, barHeight, 0.04]} />
        <meshBasicMaterial color="#263247" toneMapped={false} />
      </mesh>
      {[-0.16, 0, 0.16].map((x, index) => (
        <mesh key={x} position={[-width / 2 + 0.34 + x, top, 0.05]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={["#fb7185", "#fbbf24", "#4ade80"][index]} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
};
