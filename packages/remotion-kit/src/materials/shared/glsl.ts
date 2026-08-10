/**
 * [INPUT]: 无运行时依赖；各 material 组件与 MaterialElement 引用
 * [OUTPUT]: 对外提供共享 GLSL 片段：passthrough vertex、hash/fbm/smoothMin 等确定性工具
 * [POS]: remotion-kit/src/materials 的共享着色器头；所有材质必须可 seek、可并发导出，禁止状态累积
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */

/** 标准 UV passthrough vertex shader：所有后处理/环境材质复用 */
export const PASSTHROUGH_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** hash12：确定性 2D 哈希（固定 seed，禁止直接依赖 uTime 之外的真实随机） */
export const GLSL_HASH12 = `
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
`;

/** 2D 值噪声 + 5 层 fBm：程序化环境/雾场共用 */
export const GLSL_FBM2 = `
  float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm2(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise2D(p);
      p = p * 2.02 + 17.1;
      amplitude *= 0.5;
    }
    return value;
  }
`;

/** 数值工具：pow2/pow5/linearStep/smoothMin（CanvasUI 光学模型共用） */
export const GLSL_NUMERIC = `
  float pow2(float x) { return x * x; }
  float pow5(float x) { float x2 = x * x; return x2 * x2 * x; }
  float linearStep(float e0, float e1, float x) { return clamp((x - e0) / (e1 - e0), 0.0, 1.0); }
  float smoothMin(float d1, float d2, float k) {
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(max(h, 1e-12)) / k;
  }
`;
