/**
 * [INPUT]: lamina (https://github.com/pmndrs/lamina, MIT) 的 chunks 与 three r169 ShaderMaterial 契约
 * [OUTPUT]: 对外导出 GLSL 片段：helpers / noise / blend / lighting，供 layers.ts 拼装 ShaderMaterial
 * [POS]: spline-material 的着色器原料层；noise 与 blend 函数逐字移植自 lamina，lighting 为自研近似
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */

/** lamina src/chunks/Helpers.ts + HSL 辅助 */
export const HELPERS_CHUNK = /* glsl */ `
float lamina_map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float lamina_normalize(float v) { return lamina_map(v, -1.0, 1.0, 0.0, 1.0); }
vec3 lamina_hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}
`;

/** lamina src/chunks/Noise.ts 逐字移植（patriciogonzalezvivo / glsl-worley，经 lamina 整理） */
export const NOISE_CHUNK = /* glsl */ `
float lamina_noise_mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 lamina_noise_mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 lamina_noise_perm(vec4 x){return lamina_noise_mod289(((x * 34.0) + 1.0) * x);}
vec4 lamina_noise_permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 lamina_noise_taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float lamina_noise_white(vec2 p) {
  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
}
float lamina_noise_white(vec3 p) {
  return lamina_noise_white(p.xy);
}

vec3 lamina_noise_fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float lamina_noise_perlin(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = lamina_noise_permute(lamina_noise_permute(ix) + iy);
  vec4 ixy0 = lamina_noise_permute(ixy + iz0);
  vec4 ixy1 = lamina_noise_permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

  vec4 norm0 = lamina_noise_taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = lamina_noise_taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = lamina_noise_fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return lamina_normalize(2.2 * n_xyz);
}

float lamina_noise_simplex(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0);
  vec4 p = lamina_noise_permute(lamina_noise_permute(lamina_noise_permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
      i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = lamina_noise_taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return lamina_normalize(42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3))));
}

vec3 lamina_noise_simplex3(vec3 x) {
  float s = lamina_noise_simplex(vec3(x));
  float s1 = lamina_noise_simplex(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2));
  float s2 = lamina_noise_simplex(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4));
  return vec3(s, s1, s2);
}

vec3 lamina_noise_curl(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  vec3 p_x0 = lamina_noise_simplex3(p - dx);
  vec3 p_x1 = lamina_noise_simplex3(p + dx);
  vec3 p_y0 = lamina_noise_simplex3(p - dy);
  vec3 p_y1 = lamina_noise_simplex3(p + dy);
  vec3 p_z0 = lamina_noise_simplex3(p - dz);
  vec3 p_z1 = lamina_noise_simplex3(p + dz);

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / (2.0 * e);
  return normalize(vec3(x, y, z) * divisor);
}

vec3 lamina_permute(vec3 x) {
  return mod((34.0 * x + 1.0) * x, 289.0);
}

vec3 lamina_dist(vec3 x, vec3 y, vec3 z, bool manhattanDistance) {
  return manhattanDistance ? abs(x) + abs(y) + abs(z) : (x * x + y * y + z * z);
}

float lamina_noise_worley(vec3 P) {
  float jitter = 1.0;
  bool manhattanDistance = false;

  float K = 0.142857142857;
  float Ko = 0.428571428571;
  float K2 = 0.020408163265306;
  float Kz = 0.166666666667;
  float Kzo = 0.416666666667;

  vec3 Pi = mod(floor(P), 289.0);
  vec3 Pf = fract(P) - 0.5;

  vec3 Pfx = Pf.x + vec3(1.0, 0.0, -1.0);
  vec3 Pfy = Pf.y + vec3(1.0, 0.0, -1.0);
  vec3 Pfz = Pf.z + vec3(1.0, 0.0, -1.0);

  vec3 p = lamina_permute(Pi.x + vec3(-1.0, 0.0, 1.0));
  vec3 p1 = lamina_permute(p + Pi.y - 1.0);
  vec3 p2 = lamina_permute(p + Pi.y);
  vec3 p3 = lamina_permute(p + Pi.y + 1.0);

  vec3 p11 = lamina_permute(p1 + Pi.z - 1.0);
  vec3 p12 = lamina_permute(p1 + Pi.z);
  vec3 p13 = lamina_permute(p1 + Pi.z + 1.0);
  vec3 p21 = lamina_permute(p2 + Pi.z - 1.0);
  vec3 p22 = lamina_permute(p2 + Pi.z);
  vec3 p23 = lamina_permute(p2 + Pi.z + 1.0);
  vec3 p31 = lamina_permute(p3 + Pi.z - 1.0);
  vec3 p32 = lamina_permute(p3 + Pi.z);
  vec3 p33 = lamina_permute(p3 + Pi.z + 1.0);

  vec3 ox11 = fract(p11 * K) - Ko;
  vec3 oy11 = mod(floor(p11 * K), 7.0) * K - Ko;
  vec3 oz11 = floor(p11 * K2) * Kz - Kzo;
  vec3 ox12 = fract(p12 * K) - Ko;
  vec3 oy12 = mod(floor(p12 * K), 7.0) * K - Ko;
  vec3 oz12 = floor(p12 * K2) * Kz - Kzo;
  vec3 ox13 = fract(p13 * K) - Ko;
  vec3 oy13 = mod(floor(p13 * K), 7.0) * K - Ko;
  vec3 oz13 = floor(p13 * K2) * Kz - Kzo;
  vec3 ox21 = fract(p21 * K) - Ko;
  vec3 oy21 = mod(floor(p21 * K), 7.0) * K - Ko;
  vec3 oz21 = floor(p21 * K2) * Kz - Kzo;
  vec3 ox22 = fract(p22 * K) - Ko;
  vec3 oy22 = mod(floor(p22 * K), 7.0) * K - Ko;
  vec3 oz22 = floor(p22 * K2) * Kz - Kzo;
  vec3 ox23 = fract(p23 * K) - Ko;
  vec3 oy23 = mod(floor(p23 * K), 7.0) * K - Ko;
  vec3 oz23 = floor(p23 * K2) * Kz - Kzo;
  vec3 ox31 = fract(p31 * K) - Ko;
  vec3 oy31 = mod(floor(p31 * K), 7.0) * K - Ko;
  vec3 oz31 = floor(p31 * K2) * Kz - Kzo;
  vec3 ox32 = fract(p32 * K) - Ko;
  vec3 oy32 = mod(floor(p32 * K), 7.0) * K - Ko;
  vec3 oz32 = floor(p32 * K2) * Kz - Kzo;
  vec3 ox33 = fract(p33 * K) - Ko;
  vec3 oy33 = mod(floor(p33 * K), 7.0) * K - Ko;
  vec3 oz33 = floor(p33 * K2) * Kz - Kzo;

  vec3 dx11 = Pfx + jitter * ox11;
  vec3 dy11 = Pfy.x + jitter * oy11;
  vec3 dz11 = Pfz.x + jitter * oz11;
  vec3 dx12 = Pfx + jitter * ox12;
  vec3 dy12 = Pfy.x + jitter * oy12;
  vec3 dz12 = Pfz.y + jitter * oz12;
  vec3 dx13 = Pfx + jitter * ox13;
  vec3 dy13 = Pfy.x + jitter * oy13;
  vec3 dz13 = Pfz.z + jitter * oz13;
  vec3 dx21 = Pfx + jitter * ox21;
  vec3 dy21 = Pfy.y + jitter * oy21;
  vec3 dz21 = Pfz.x + jitter * oz21;
  vec3 dx22 = Pfx + jitter * ox22;
  vec3 dy22 = Pfy.y + jitter * oy22;
  vec3 dz22 = Pfz.y + jitter * oz22;
  vec3 dx23 = Pfx + jitter * ox23;
  vec3 dy23 = Pfy.y + jitter * oy23;
  vec3 dz23 = Pfz.z + jitter * oz23;
  vec3 dx31 = Pfx + jitter * ox31;
  vec3 dy31 = Pfy.z + jitter * oy31;
  vec3 dz31 = Pfz.x + jitter * oz31;
  vec3 dx32 = Pfx + jitter * ox32;
  vec3 dy32 = Pfy.z + jitter * oz32;
  vec3 dz32 = Pfz.y + jitter * oz32;
  vec3 dx33 = Pfx + jitter * ox33;
  vec3 dy33 = Pfy.z + jitter * oy33;
  vec3 dz33 = Pfz.z + jitter * oz33;

  vec3 d11 = lamina_dist(dx11, dy11, dz11, manhattanDistance);
  vec3 d12 = lamina_dist(dx12, dy12, dz12, manhattanDistance);
  vec3 d13 = lamina_dist(dx13, dy13, dz13, manhattanDistance);
  vec3 d21 = lamina_dist(dx21, dy21, dz21, manhattanDistance);
  vec3 d22 = lamina_dist(dx22, dy22, dz22, manhattanDistance);
  vec3 d23 = lamina_dist(dx23, dy23, dz23, manhattanDistance);
  vec3 d31 = lamina_dist(dx31, dy31, dz31, manhattanDistance);
  vec3 d32 = lamina_dist(dx32, dy32, dz32, manhattanDistance);
  vec3 d33 = lamina_dist(dx33, dy33, dz33, manhattanDistance);

  vec3 d1a = min(d11, d12);
  d12 = max(d11, d12);
  d11 = min(d1a, d13);
  d13 = max(d1a, d13);
  d12 = min(d12, d13);
  vec3 d2a = min(d21, d22);
  d22 = max(d21, d22);
  d21 = min(d2a, d23);
  d23 = max(d2a, d23);
  d22 = min(d22, d23);
  vec3 d3a = min(d31, d32);
  d32 = max(d31, d32);
  d31 = min(d3a, d33);
  d33 = max(d3a, d33);
  d32 = min(d32, d33);
  vec3 da = min(d11, d21);
  d21 = max(d11, d21);
  d11 = min(da, d31);
  d31 = max(da, d31);
  d11.xy = (d11.x < d11.y) ? d11.xy : d11.yx;
  d11.xz = (d11.x < d11.z) ? d11.xz : d11.zx;
  d12 = min(d12, d21);
  d12 = min(d12, d22);
  d12 = min(d12, d31);
  d12 = min(d12, d32);
  d11.yz = min(d11.yz, d12.xy);
  d11.y = min(d11.y, d12.z);
  d11.y = min(d11.y, d11.z);

  vec2 F = sqrt(d11.xy);
  return F.x;
}

float lamina_noise_swirl(vec3 position) {
  float scale = 0.1;
  float freq = 4.0 * scale;
  float t = 1.0;

  vec3 pos = (position * scale) + lamina_noise_curl(position * 7.0 * scale);

  float worley1 = 1.0 - lamina_noise_worley((pos * (freq * 2.0)) + (t * 2.0));
  float worley2 = 1.0 - lamina_noise_worley((pos * (freq * 4.0)) + (t * 4.0));
  float worley3 = 1.0 - lamina_noise_worley((pos * (freq * 8.0)) + (t * 8.0));
  float worley4 = 1.0 - lamina_noise_worley((pos * (freq * 16.0)) + (t * 16.0));

  float fbm1 = worley1 * 0.625 + worley2 * 0.25 + worley3 * 0.125;
  float fbm2 = worley2 * 0.625 + worley3 * 0.25 + worley4 * 0.125;
  float fbm3 = worley3 * 0.75 + worley4 * 0.25;

  vec3 curlWorleyFbm = vec3(fbm1, fbm2, fbm3);
  return curlWorleyFbm.r * 0.625 + curlWorleyFbm.g * 0.25 + curlWorleyFbm.b * 0.125;
}
`;

/** lamina src/chunks/BlendModes.ts 子集（与面板暴露的 blend mode 一一对应） */
export const BLEND_CHUNK = /* glsl */ `
vec4 lamina_blend_alpha(const in vec4 x, const in vec4 y, const in float opacity) {
  float a = min(y.a, opacity);
  return vec4(y.rgb * a + x.rgb * (1.0 - a), x.a);
}
vec4 lamina_blend_normal(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4(y.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_add(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4(min(x.xyz + y.xyz, 1.0) * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_subtract(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4(max(x.xyz + y.xyz - 1.0, 0.0) * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_multiply(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4(x.xyz * y.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_screen(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4((1.0 - (1.0 - x.xyz) * (1.0 - y.xyz)) * opacity + x.xyz * (1.0 - opacity), x.a);
}
float lamina_blend_overlay_f(const in float x, const in float y) {
  return (x < 0.5) ? (2.0 * x * y) : (1.0 - 2.0 * (1.0 - x) * (1.0 - y));
}
vec4 lamina_blend_overlay(const in vec4 x, const in vec4 y, const in float opacity) {
  vec4 z = vec4(lamina_blend_overlay_f(x.r, y.r), lamina_blend_overlay_f(x.g, y.g), lamina_blend_overlay_f(x.b, y.b), lamina_blend_overlay_f(x.a, y.a));
  return vec4(z.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}
float lamina_blend_softlight_f(const in float x, const in float y) {
  return (y < 0.5) ? (2.0 * x * y + x * x * (1.0 - 2.0 * y)) : (sqrt(x) * (2.0 * y - 1.0) + 2.0 * x * (1.0 - y));
}
vec4 lamina_blend_softlight(const in vec4 x, const in vec4 y, const in float opacity) {
  vec4 z = vec4(lamina_blend_softlight_f(x.r, y.r), lamina_blend_softlight_f(x.g, y.g), lamina_blend_softlight_f(x.b, y.b), lamina_blend_softlight_f(x.a, y.a));
  return vec4(z.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_lighten(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4(max(x.xyz, y.xyz) * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_darken(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4(min(x.xyz, y.xyz) * opacity + x.xyz * (1.0 - opacity), x.a);
}
float lamina_blend_divide_f(const in float x, const in float y) {
  return (y > 0.0) ? min(x / y, 1.0) : 1.0;
}
vec4 lamina_blend_divide(const in vec4 x, const in vec4 y, const in float opacity) {
  vec4 z = vec4(lamina_blend_divide_f(x.r, y.r), lamina_blend_divide_f(x.g, y.g), lamina_blend_divide_f(x.b, y.b), lamina_blend_divide_f(x.a, y.a));
  return vec4(z.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}
float lamina_blend_reflect_f(const in float x, const in float y) {
  return (y == 1.0) ? y : min(x * x / (1.0 - y), 1.0);
}
vec4 lamina_blend_reflect(const in vec4 x, const in vec4 y, const in float opacity) {
  vec4 z = vec4(lamina_blend_reflect_f(x.r, y.r), lamina_blend_reflect_f(x.g, y.g), lamina_blend_reflect_f(x.b, y.b), lamina_blend_reflect_f(x.a, y.a));
  return vec4(z.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_negation(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4((1.0 - abs(1.0 - x.xyz - y.xyz)) * opacity + x.xyz * (1.0 - opacity), x.a);
}
`;

/** 自研光照近似：Lambert / Phong / Physical(IBL) / Toon + 程序化摄影棚环境 + bump/occlusion 钩子 */
export const LIGHTING_CHUNK = /* glsl */ `
uniform float u_lamina_time;
uniform float u_lamina_opacity;
uniform float u_lamina_lighting;
uniform float u_lamina_lightStrength;
uniform vec3 u_lamina_lightColor;
uniform float u_lamina_shininess;
uniform float u_lamina_roughness;
uniform float u_lamina_metalness;
uniform float u_lamina_reflectivity;
uniform float u_lamina_glass;
uniform float u_lamina_aberration;
uniform float u_lamina_thickness;
uniform float u_lamina_refraction;
uniform float u_lamina_blur;
uniform float u_lamina_fx_liquid;
uniform float u_lamina_fx_liquidAmount;
uniform float u_lamina_fx_ngScale;
uniform float u_lamina_fx_ngOpacity;
uniform float u_lamina_envEnabled;
uniform float u_lamina_envExposure;
uniform float u_lamina_envRotation;
uniform float u_lamina_envPreset;
uniform float u_lamina_bump;
uniform float u_lamina_occlusion;
uniform float u_lamina_flat;
uniform float u_lamina_selected;
uniform float u_lamina_lightIntensity;
uniform float u_lamina_ambient;
uniform float u_lamina_tonemapping;
uniform vec3 u_lamina_base;

const vec3 LAMINA_KEY = vec3(0.44462, 0.60634, 0.52599);
const vec3 LAMINA_FILL = vec3(-0.66248, -0.14210, 0.47368);

/** 程序化摄影棚环境：底色渐变 + 顶灯柔光箱 + 左右灯条 + 背面轮廓光 + 地面反弹（lod 模拟粗糙度模糊） */
vec3 lamina_env(vec3 dir, float lod) {
  vec3 r = normalize(dir);
  float c = cos(u_lamina_envRotation);
  float s = sin(u_lamina_envRotation);
  r = vec3(c * r.x + s * r.z, r.y, -s * r.x + c * r.z);
  float up = r.y;
  float p = u_lamina_envPreset;
  vec3 base;
  vec3 keyTint;
  if (p < 0.5) {
    base = mix(vec3(0.05, 0.05, 0.06), vec3(0.34, 0.36, 0.40), smoothstep(-0.7, 1.0, up));
    keyTint = vec3(1.0);
  } else if (p < 1.5) {
    base = mix(vec3(0.10, 0.055, 0.03), vec3(0.52, 0.34, 0.20), smoothstep(-0.7, 1.0, up));
    keyTint = vec3(1.0, 0.86, 0.68);
  } else if (p < 2.5) {
    base = mix(vec3(0.012, 0.016, 0.03), vec3(0.10, 0.12, 0.20), smoothstep(-0.7, 1.0, up));
    keyTint = vec3(0.75, 0.82, 1.0);
  } else if (p < 3.5) {
    base = mix(vec3(0.30, 0.31, 0.33), vec3(0.72, 0.73, 0.76), smoothstep(-0.8, 1.0, up));
    keyTint = vec3(1.0);
  } else {
    base = mix(vec3(0.16, 0.07, 0.05), vec3(0.98, 0.52, 0.26), smoothstep(-0.6, 0.9, up));
    keyTint = vec3(1.0, 0.62, 0.36);
  }
  float bright = (p > 2.5 && p < 3.5) ? 1.0 : 0.0;
  float soft = 0.05 + lod * 0.2;
  vec3 e = base * mix(0.6, 1.0, u_lamina_envEnabled);
  e += keyTint * smoothstep(0.94 - soft, 0.995 - lod * 0.05, dot(r, normalize(vec3(0.25, 1.0, 0.5)))) * mix(2.5, 2.2, bright) * u_lamina_envEnabled;
  e += keyTint * smoothstep(0.958 - soft, 0.997, dot(r, normalize(vec3(-1.0, 0.32, 0.38)))) * mix(1.55, 1.35, bright) * u_lamina_envEnabled;
  e += vec3(1.0, 0.84, 0.66) * smoothstep(0.964 - soft, 0.998, dot(r, normalize(vec3(1.0, 0.22, 0.28)))) * mix(1.15, 1.0, bright) * u_lamina_envEnabled;
  e += vec3(0.8, 0.86, 1.0) * smoothstep(0.968 - soft * 0.5, 0.999, dot(r, normalize(vec3(0.0, 0.12, -1.0)))) * mix(1.0, 0.9, bright) * u_lamina_envEnabled;
  e += vec3(0.30, 0.27, 0.24) * smoothstep(-0.15, -1.0, up) * 0.5 * u_lamina_envEnabled;
  return e * u_lamina_envExposure;
}

vec3 lamina_shade(vec3 albedo, vec3 N, vec3 V) {
  if (u_lamina_lighting < 0.5) return albedo;
  float ndl = max(dot(N, LAMINA_KEY), 0.0) * u_lamina_lightIntensity;
  float ndlF = max(dot(N, LAMINA_FILL), 0.0) * u_lamina_lightIntensity;
  float ndv = max(dot(N, V), 0.0);
  vec3 lit = albedo;
  if (u_lamina_lighting < 1.5) {
    vec3 amb = mix(vec3(0.34), lamina_env(N, 2.6), 0.65);
    lit = albedo * (amb + 0.72 * ndl + 0.2 * ndlF);
  } else if (u_lamina_lighting < 2.5) {
    vec3 R = reflect(-LAMINA_KEY, N);
    float spec = pow(max(dot(R, V), 0.0), max(u_lamina_shininess, 1.0)) * 0.85;
    vec3 amb = mix(vec3(0.30), lamina_env(N, 2.6), 0.55) * mix(1.0, u_lamina_ambient * 1.33, 0.8);
    lit = albedo * (amb + 0.72 * ndl + 0.18 * ndlF) + u_lamina_lightColor * spec;
  } else if (u_lamina_lighting < 3.5) {
    float rough = clamp(u_lamina_roughness, 0.03, 1.0);
    float metal = clamp(u_lamina_metalness, 0.0, 1.0);
    float glassAmt = clamp(u_lamina_glass, 0.0, 1.0);
    float glassRough = clamp(max(u_lamina_roughness, u_lamina_blur), 0.03, 1.0);
    vec3 R = reflect(-V, N);
    float lod = rough * 2.4;
    vec3 env = lamina_env(R, lod) * 0.55;
    env += lamina_env(normalize(R + vec3(rough * 0.38, -rough * 0.22, rough * 0.3)), lod) * 0.24;
    env += lamina_env(normalize(R + vec3(-rough * 0.3, rough * 0.26, -rough * 0.32)), lod) * 0.21;
    vec3 F0 = mix(vec3(0.05) * u_lamina_reflectivity, albedo, metal);
    vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0);
    vec3 amb = mix(vec3(0.42), lamina_env(N, 2.8), 0.6) * mix(1.0, u_lamina_ambient * 1.33, 0.8);
    vec3 col = albedo * (1.0 - metal) * (amb + vec3(0.95, 0.96, 1.0) * (0.36 + 0.66 * ndl));
    col += env * F * (0.65 + 0.5 * metal);
    vec3 H = normalize(LAMINA_KEY + V);
    float s = pow(max(dot(N, H), 0.0), mix(10.0, 520.0, pow(1.0 - rough, 2.0)));
    col += u_lamina_lightColor * s * (1.0 - rough) * mix(vec3(0.6), F0 + 0.25, 0.5) * 1.6;
    if (glassAmt > 0.001) {
      float gLod = glassRough * 2.2;
      float ior = max(u_lamina_refraction, 1.01);
      vec3 fN = N;
      if (u_lamina_fx_liquid > 0.5) {
        vec3 fwp = v_lamina_position * 2.6 + u_lamina_time * 0.4;
        fN = normalize(N + (vec3(lamina_noise_simplex(fwp), lamina_noise_simplex(fwp + 17.1), lamina_noise_simplex(fwp + 43.7)) - 0.5) * (u_lamina_fx_liquidAmount * 0.35));
      }
      vec3 rd = refract(-V, fN, 1.0 / ior);
      if (dot(rd, rd) < 0.001) rd = R;
      float ab = u_lamina_aberration * 0.06;
      vec3 refr = vec3(
        lamina_env(normalize(rd + N * ab), gLod).r,
        lamina_env(rd, gLod).g,
        lamina_env(normalize(rd - N * ab), gLod).b);
      vec3 glassCol = mix(vec3(0.88) * refr, env * 1.3, clamp(F * 1.7 + 0.05, 0.0, 1.0));
      glassCol *= mix(vec3(1.0), albedo * 0.9, clamp(u_lamina_thickness * (1.0 - ndv) * 1.15, 0.0, 1.0));
      col = mix(col, glassCol, glassAmt);
    }
    lit = col;
  } else {
    float cel = floor(ndl * 3.0) / 3.0;
    lit = albedo * (0.34 + 0.66 * cel);
  }
  return mix(albedo, lit, clamp(u_lamina_lightStrength, 0.0, 1.0));
}
`;
