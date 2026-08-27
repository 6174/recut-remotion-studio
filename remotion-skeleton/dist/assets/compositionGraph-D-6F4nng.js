import{j as u,r as Tr,c as Mr}from"./client-DOSV_kvz.js";import{d as Wr,c as Gr,r as qr,u as ot,a as lt,b as Zr,A as Xr,P as Yr}from"./index-C8avbcVU.js";import{r as j}from"./index-DzXGc9LX.js";import{T as Kr}from"./index-DT7QWFx8.js";import{V as te,U as R,C as Xn,D as Jr,u as Qn,a as er,S as tr,b as Qr,L as wr}from"./react-three-fiber.esm-DVnjAo8Q.js";const Yn=24,kr=18,eo=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,to=`
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform int uCount;
  uniform vec2 uTrail[${Yn}];
  uniform float uBaseRadius;
  uniform float uBlend;
  uniform float uRefraction;
  uniform float uDispersion;
  uniform float uShine;
  uniform float uRim;
  uniform float uIridescence;
  uniform float uIntensity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;

  const float EPS = 1e-4;
  const int ITR = 14;

  vec3 page(vec2 px) {
    vec2 uv = clamp(px / uResolution, 0.0005, 0.9995);
    return pow(texture2D(uMap, uv).rgb, vec3(2.2));
  }

  float rnd3D(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
  }

  float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    float a000 = rnd3D(i);
    float a100 = rnd3D(i + vec3(1.0, 0.0, 0.0));
    float a010 = rnd3D(i + vec3(0.0, 1.0, 0.0));
    float a110 = rnd3D(i + vec3(1.0, 1.0, 0.0));
    float a001 = rnd3D(i + vec3(0.0, 0.0, 1.0));
    float a101 = rnd3D(i + vec3(1.0, 0.0, 1.0));
    float a011 = rnd3D(i + vec3(0.0, 1.0, 1.0));
    float a111 = rnd3D(i + vec3(1.0, 1.0, 1.0));
    float k0 = a000;
    float k1 = a100 - a000;
    float k2 = a010 - a000;
    float k3 = a001 - a000;
    float k4 = a000 - a100 - a010 + a110;
    float k5 = a000 - a010 - a001 + a011;
    float k6 = a000 - a100 - a001 + a101;
    float k7 = -a000 + a100 + a010 - a110 + a001 - a101 - a011 + a111;
    return k0 + k1 * u.x + k2 * u.y + k3 * u.z + k4 * u.x * u.y
      + k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z;
  }

  float smoothMin(float d1, float d2, float k) {
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(max(h, 1e-12)) / k;
  }

  float map(vec3 p) {
    float radius = uBaseRadius * float(uCount);
    float d = 1e5;
    for (int i = 0; i < ${Yn}; i++) {
      if (i >= uCount) break;
      float sphere = length(p - vec3(uTrail[i], 0.0))
        - (radius - uBaseRadius * float(i));
      d = smoothMin(d, sphere, uBlend);
    }
    return d;
  }

  vec3 generateNormal(vec3 p) {
    return normalize(vec3(
      map(p + vec3(EPS, 0.0, 0.0)) - map(p - vec3(EPS, 0.0, 0.0)),
      map(p + vec3(0.0, EPS, 0.0)) - map(p - vec3(0.0, EPS, 0.0)),
      map(p + vec3(0.0, 0.0, EPS)) - map(p - vec3(0.0, 0.0, EPS))));
  }

  vec3 dropletColor(vec3 normal, vec3 rayDir) {
    vec3 reflectDir = reflect(rayDir, normal);
    vec3 color0 = uColorA * noise3D(reflectDir * 2.0 + uTime);
    vec3 color1 = uColorB * noise3D(reflectDir * 2.0 - uTime);
    return (color0 + color1) * uIntensity;
  }

  void main() {
    vec3 source = texture2D(uMap, vUv).rgb;
    float minRes = min(uResolution.x, uResolution.y);
    vec2 p = (vUv * uResolution * 2.0 - uResolution) / minRes;
    vec3 ray = vec3(p, 1.0);
    vec3 rayDir = vec3(0.0, 0.0, -1.0);
    float dist = 0.0;
    for (int i = 0; i < ITR; i++) {
      dist = map(ray);
      ray += rayDir * dist;
      if (dist < EPS || dist > 8.0) break;
    }
    float coverage = 1.0 - smoothstep(0.0, 3.0 / minRes, dist);
    if (coverage < 0.001) {
      gl_FragColor = vec4(source, 1.0);
      return;
    }

    vec3 normal = generateNormal(ray);
    vec3 glints = pow(max(dropletColor(normal, rayDir), 0.0), vec3(7.0));
    vec3 light = normalize(vec3(-0.5, 0.7, 0.6));
    float spec = pow(max(dot(reflect(-light, normal), vec3(0.0, 0.0, 1.0)), 0.0), 60.0);
    float depth = uRefraction;
    float ca = uDispersion * 0.03;
    vec3 rvR = refract(rayDir, normal, 1.0 / (1.33 - ca));
    vec3 rvG = refract(rayDir, normal, 1.0 / 1.33);
    vec3 rvB = refract(rayDir, normal, 1.0 / (1.33 + ca));
    vec3 refracted = vec3(
      page(vUv * uResolution + rvR.xy * depth).r,
      page(vUv * uResolution + rvG.xy * depth).g,
      page(vUv * uResolution + rvB.xy * depth).b);
    float edge = pow(1.0 - clamp(normal.z, 0.0, 1.0), 1.5);
    refracted *= 1.0 - 0.35 * uRim * edge;
    vec3 color = pow(max(refracted, 0.0), vec3(1.0 / 2.2));
    color += glints * uIridescence;
    color += vec3(spec * uShine * 0.9);
    gl_FragColor = vec4(mix(source, color, coverage), 1.0);
  }
`,no=(s,c,h)=>{s.forEach((y,p)=>{const w=c*.72-p*.052,T=Math.sin(w*.82)*Math.min(h*.62,1.12)+Math.sin(w*1.61)*.16,E=Math.cos(w*.57)*.38+Math.sin(w*1.17)*.12;y.set(T,E)})},ro=({aspect:s,height:c,intensity:h,texture:y,time:p,width:w})=>{const T=j.useRef(null),E=j.useRef(Array.from({length:Yn},()=>new te)),b=j.useMemo(()=>({uMap:new R(y),uResolution:new R(new te(w,c)),uTime:new R(0),uCount:new R(kr),uTrail:new R(E.current),uBaseRadius:new R(84/(1080*kr)),uBlend:new R(14),uRefraction:new R(80),uDispersion:new R(1),uShine:new R(.25),uRim:new R(.5),uIridescence:new R(1),uIntensity:new R(h),uColorA:new R(new Xn(.29,.45,.72)),uColorB:new R(new Xn(.41,.41,.42))}),[c,y,w]);return j.useLayoutEffect(()=>{T.current&&(T.current.uniforms.uResolution.value.set(w,c),no(E.current,p,s),T.current.uniforms.uTime.value=p*2,T.current.uniforms.uIntensity.value=h)},[s,c,h,p,w]),u.jsx("shaderMaterial",{ref:T,fragmentShader:to,toneMapped:!1,uniforms:b,vertexShader:eo})},oo=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,lo=`
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  varying vec2 vUv;
  float gauss1(float value, float sigma) {
    float sigmaSquared = sigma * sigma + 1e-6;
    return exp(-(value * value) / (2.0 * sigmaSquared));
  }
  void main() {
    vec2 pixel = 1.0 / uResolution;
    vec4 sharp = texture2D(uMap, vUv);
    float edgeY = abs(vUv.y - 0.5) * 2.0;
    float blurMix = pow(smoothstep(0.035, 0.62, edgeY), 1.06);
    float sigmaPixels = blurMix * 4.25 + 0.05;
    vec3 blurred = vec3(0.0);
    float totalWeight = 0.0;
    for (int y = -4; y <= 4; y++) {
      for (int x = -4; x <= 4; x++) {
        float weight = gauss1(float(x), sigmaPixels) * gauss1(float(y), sigmaPixels);
        vec2 sampleUv = clamp(vUv + pixel * vec2(float(x), float(y)), vec2(1e-4), vec2(1.0 - 1e-4));
        blurred += texture2D(uMap, sampleUv).rgb * weight;
        totalWeight += weight;
      }
    }
    vec3 color = mix(sharp.rgb, blurred / totalWeight, blurMix);
    vec2 centered = vUv * 2.0 - 1.0;
    centered.x *= uResolution.x / uResolution.y;
    color *= 1.0 - smoothstep(0.38, 1.02, length(centered)) * 0.13;
    gl_FragColor = vec4(color, sharp.a);
  }
`,so=({height:s,texture:c,width:h})=>{const y=j.useRef(null),p=j.useMemo(()=>({uMap:new R(c),uResolution:new R(new te(h,s))}),[s,c,h]);return j.useLayoutEffect(()=>{var w;(w=y.current)==null||w.uniforms.uResolution.value.set(h,s)},[s,h]),u.jsx("shaderMaterial",{ref:y,fragmentShader:lo,toneMapped:!1,uniforms:p,vertexShader:oo})},io=`
  uniform float uBend;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 transformed = position;
    float fold = (uv.y - 0.5) * uBend * 2.1;
    transformed.y *= cos(fold);
    transformed.z += abs(transformed.y) * sin(abs(fold)) * 0.92;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`,ao=`
  uniform sampler2D uMap;
  varying vec2 vUv;
  void main() {
    gl_FragColor = texture2D(uMap, vUv);
  }
`,uo=({bend:s,texture:c})=>{const h=j.useRef(null),y=j.useMemo(()=>({uMap:new R(c),uBend:new R(s)}),[c]);return j.useLayoutEffect(()=>{h.current&&(h.current.uniforms.uBend.value=s)},[s]),u.jsx("shaderMaterial",{ref:h,fragmentShader:ao,side:Jr,toneMapped:!1,uniforms:y,vertexShader:io})},co=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,fo=`
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1.0), vec2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.02 + 17.1;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 p = vUv * vec2(1.78, 1.0);
    float drift = uTime * 0.08;
    float field = fbm(p * 2.4 + vec2(drift, -drift * 0.4));
    float detail = fbm(p * 5.0 - vec2(drift * 1.8, drift));
    float mist = smoothstep(0.5, 0.87, field * 0.76 + detail * 0.24);
    float edge = smoothstep(0.0, 0.22, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
    vec3 color = mix(vec3(0.04, 0.17, 0.23), vec3(0.25, 0.82, 0.67), field);
    gl_FragColor = vec4(color * mist, mist * edge * uOpacity);
  }
`,po=({time:s,opacity:c})=>{const h=j.useRef(null),y=j.useMemo(()=>({uTime:new R(s),uOpacity:new R(c)}),[]);return j.useLayoutEffect(()=>{h.current&&(h.current.uniforms.uTime.value=s,h.current.uniforms.uOpacity.value=c)},[c,s]),u.jsx("shaderMaterial",{ref:h,depthWrite:!1,fragmentShader:fo,transparent:!0,toneMapped:!1,uniforms:y,vertexShader:co})},ho=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,mo=`
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uCurvature;
  uniform float uScanIntensity;
  uniform float uVignette;
  varying vec2 vUv;

  vec2 curveUv(vec2 uv) {
    vec2 c = uv * 2.0 - 1.0;
    vec2 offset = abs(c.yx) / uCurvature;
    c = c + c * offset * offset;
    return c * 0.5 + 0.5;
  }

  void main() {
    vec2 uv = curveUv(vUv);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }
    vec2 fromCenter = uv - 0.5;
    float radius = length(fromCenter);
    vec2 direction = radius > 0.0001 ? normalize(fromCenter) : vec2(0.0);
    float aberration = 0.0018 * pow(radius * 2.0, 2.0);
    vec3 color = vec3(
      texture2D(uMap, uv + direction * aberration).r,
      texture2D(uMap, uv).g,
      texture2D(uMap, uv - direction * aberration).b
    );
    float scan = 0.5 + 0.5 * sin(uv.y * uResolution.y);
    color *= mix(1.0, scan, uScanIntensity);
    float column = mod(gl_FragCoord.x, 3.0);
    vec3 mask = column < 1.0 ? vec3(1.04, 0.97, 0.97) :
      column < 2.0 ? vec3(0.97, 1.04, 0.97) : vec3(0.97, 0.97, 1.04);
    color *= mix(vec3(1.0), mask, 0.18);
    float vignette = smoothstep(0.95, 0.45, radius);
    color *= mix(1.0, vignette, uVignette);
    color *= 1.0 + 0.012 * sin(uTime * 60.0);
    color -= vec3(0.04) * smoothstep(0.62, 0.78, radius);
    gl_FragColor = vec4(color, 1.0);
  }
`,vo=({height:s,texture:c,time:h,width:y})=>{const p=j.useRef(null),w=j.useMemo(()=>({uMap:new R(c),uTime:new R(h),uResolution:new R(new te(y,s)),uCurvature:new R(new te(5.5,5)),uScanIntensity:new R(.24),uVignette:new R(.68)}),[s,c,y]);return j.useLayoutEffect(()=>{p.current&&(p.current.uniforms.uTime.value=h,p.current.uniforms.uResolution.value.set(y,s))},[s,h,y]),u.jsx("shaderMaterial",{ref:p,fragmentShader:mo,toneMapped:!1,uniforms:w,vertexShader:ho})},xo=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,go=`
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uAspect;
  varying vec2 vUv;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    float burstClock = mod(uTime, 3.7);
    float attack = smoothstep(0.0, 0.06, burstClock);
    float release = 1.0 - smoothstep(0.34, 0.56, burstClock);
    float amount = attack * release * uIntensity;
    vec2 uv = vUv;
    float band = floor(uv.y * 24.0);
    float seed = floor(uTime / 3.7) + 1.0;
    float pick = hash12(vec2(band, seed));
    float tear = step(0.74, pick) * amount;
    float direction = hash12(vec2(band, seed + 13.0)) * 2.0 - 1.0;
    uv.x += tear * direction * 0.035 / uAspect;
    float micro = hash12(vec2(floor(vUv.y * 160.0), seed + 29.0)) - 0.5;
    uv.x += micro * amount * 0.004;
    vec2 block = floor(uv * vec2(12.0, 8.0));
    if (hash12(block + seed) > 0.94 - amount * 0.08) {
      uv += vec2(hash12(block + 3.1) - 0.5, hash12(block + 7.7) - 0.5) * amount * vec2(0.06, 0.015);
    }
    float split = amount * 0.012;
    vec3 color = vec3(
      texture2D(uMap, clamp(uv + vec2(split, 0.0), 0.001, 0.999)).r,
      texture2D(uMap, clamp(uv, 0.001, 0.999)).g,
      texture2D(uMap, clamp(uv - vec2(split, 0.0), 0.001, 0.999)).b
    );
    float grain = hash12(vUv * 1400.0 + seed) - 0.5;
    color += grain * amount * 0.13;
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`,yo=({texture:s,time:c,intensity:h,aspect:y})=>{const p=j.useRef(null),w=j.useMemo(()=>({uMap:new R(s),uTime:new R(c),uIntensity:new R(h),uAspect:new R(y)}),[s]);return j.useLayoutEffect(()=>{p.current&&(p.current.uniforms.uTime.value=c,p.current.uniforms.uIntensity.value=h,p.current.uniforms.uAspect.value=y)},[y,h,c]),u.jsx("shaderMaterial",{ref:p,fragmentShader:go,toneMapped:!1,uniforms:w,vertexShader:xo})},So=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,wo=`
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform vec2 uCenter;
  uniform vec2 uHalf;
  uniform float uCorner;
  uniform float uEdge;
  uniform float uBevel;
  uniform float uIor;
  uniform float uDepth;
  uniform float uAberration;
  uniform float uBlur;
  uniform float uReflect;
  uniform float uShine;
  uniform float uZoom;
  varying vec2 vUv;

  const float PI = 3.14159265358979;
  const float AIR_IOR = 1.0003;
  const vec3 INCIDENT = vec3(0.0, 0.0, 1.0);

  float pow2(float x) { return x * x; }
  float pow5(float x) { float x2 = x * x; return x2 * x2 * x; }
  float linearStep(float e0, float e1, float x) { return clamp((x - e0) / (e1 - e0), 0.0, 1.0); }
  float sdf(vec2 p) {
    vec2 q = abs(p) - (uHalf - vec2(uCorner));
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uCorner;
  }
  float ign(vec2 v) { return fract(52.9829189 * fract(0.06711056 * v.x + 0.00583715 * v.y)); }
  vec3 page(vec2 px) {
    return pow(texture2D(uMap, clamp(px / uResolution, 0.0005, 0.9995)).rgb, vec3(2.2));
  }
  float iorForWavelength(float wavelength) {
    float ab = uAberration * 0.1;
    return mix(uIor + ab, uIor - ab, 1.0 - pow(1.0 - linearStep(450.0, 650.0, wavelength), 4.0));
  }
  vec3 pageAA(vec2 px) {
    float footprint = max(length(fwidth(px)), 1.0);
    return mix(page(px), page(px + vec2(footprint * 0.12)), 0.08);
  }
  vec3 sampleRefraction(vec2 basePx, float rim, vec3 normal, float glassIor) {
    vec3 ray = refract(INCIDENT, normal, AIR_IOR / glassIor);
    ray /= abs(ray.z) / uDepth;
    return mix(pageAA(basePx + ray.xy), page(basePx + ray.xy), min(uBlur * (1.0 + rim) * 0.14, 0.72));
  }
  float fresnelSchlick(float cosTheta, float f0) { return f0 + (1.0 - f0) * pow5(1.0 - cosTheta); }
  float smithSchlickDenom(float cosTheta, float k) { return cosTheta * (1.0 - k) + k; }
  float ggx(float roughness, float NDotL, float NDotV, float NDotH) {
    if (NDotL <= 0.0) return 0.0;
    float a2 = pow2(roughness);
    float d = a2 / (PI * pow2(pow2(NDotH) * (a2 - 1.0) + 1.0));
    float k = roughness * 0.5;
    float v = 1.0 / (smithSchlickDenom(NDotL, k) * smithSchlickDenom(clamp(NDotV, 0.0, 1.0), k));
    return NDotL * d * v;
  }

  void main() {
    vec2 fragPx = vUv * uResolution;
    vec2 p = fragPx - uCenter;
    float sd = sdf(p);
    float mask = 1.0 - smoothstep(-1.5, 0.0, sd);
    float minHalf = min(uHalf.x, uHalf.y);
    float edgeW = max(minHalf * (1.0 - clamp(uEdge, 0.0, 0.98)), 1.0);
    float rim = pow(linearStep(-edgeW, 0.0, sd), uBevel);
    float randAngle = ign(fragPx) * PI * 2.0;
    float scatter = min(uBlur, 1.0) * 0.02;
    vec3 flatNormal = normalize(vec3(sin(randAngle) * scatter, cos(randAngle) * scatter, -1.0));
    vec2 grad = vec2(sdf(p + vec2(1.0, 0.0)) - sdf(p - vec2(1.0, 0.0)), sdf(p + vec2(0.0, 1.0)) - sdf(p - vec2(0.0, 1.0)));
    vec3 rimNormal = vec3(normalize(grad + vec2(1e-5)), 0.0);
    vec3 normal = normalize(mix(flatNormal, rimNormal, rim));
    vec2 basePx = uCenter + p / uZoom;
    vec3 refracted = sampleRefraction(basePx, rim, normal, iorForWavelength(611.4)) * vec3(1.0, 0.0, 0.0);
    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(570.5)) * vec3(1.0, 1.0, 0.0);
    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(549.1)) * vec3(0.0, 1.0, 0.0);
    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(491.4)) * vec3(0.0, 1.0, 1.0);
    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(464.2)) * vec3(0.0, 0.0, 1.0);
    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(374.0)) * vec3(1.0, 0.0, 1.0);
    refracted /= 3.0;

    const vec3 V = vec3(0.0, 0.0, -1.0);
    float NDotV = clamp(dot(V, normal), 0.0, 1.0);
    float f0 = pow2((uIor - AIR_IOR) / (uIor + AIR_IOR));
    vec3 reflectVector = reflect(INCIDENT, normal);
    vec3 L = reflectVector;
    vec3 H = normalize(L + V);
    reflectVector /= abs(reflectVector.z) / uDepth;
    vec3 reflected = page(basePx + reflectVector.xy) * ggx(0.5, dot(normal, L), NDotV, dot(normal, H));
    vec3 glass = mix(refracted, reflected, clamp(fresnelSchlick(NDotV, f0) * uReflect, 0.0, 1.0));
    float ldot = dot(rimNormal.xy, normalize(vec2(-0.6, 0.8)));
    float band = pow(rim, 1.8);
    float arcs = pow(abs(ldot), 3.0) * (ldot > 0.0 ? 0.5 : 0.28);
    glass += band * (0.04 + arcs) * uShine;
    vec3 source = texture2D(uMap, vUv).rgb;
    gl_FragColor = vec4(mix(source, pow(max(glass, 0.0), vec3(1.0 / 2.2)), mask), 1.0);
  }
`,ko=({center:s,height:c,texture:h,width:y,zoom:p})=>{const w=j.useRef(null),T=j.useMemo(()=>({uMap:new R(h),uResolution:new R(new te(y,c)),uCenter:new R(new te(s[0]*y,s[1]*c)),uHalf:new R(new te(120,120)),uCorner:new R(120),uEdge:new R(.7),uBevel:new R(4),uIor:new R(1.5),uDepth:new R(250),uAberration:new R(1),uBlur:new R(0),uReflect:new R(1),uShine:new R(.01),uZoom:new R(p)}),[c,h,y,p]);return j.useLayoutEffect(()=>{w.current&&(w.current.uniforms.uResolution.value.set(y,c),w.current.uniforms.uCenter.value.set(s[0]*y,s[1]*c),w.current.uniforms.uZoom.value=p)},[s,c,y,p]),u.jsx("shaderMaterial",{ref:w,fragmentShader:wo,toneMapped:!1,uniforms:T,vertexShader:So})};var Ie={},Oe={};/**
 * @license React
 * react-dom-server-legacy.browser.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var br;function bo(){if(br)return Oe;br=1;var s=Tr();function c(e){for(var r="https://reactjs.org/docs/error-decoder.html?invariant="+e,l=1;l<arguments.length;l++)r+="&args[]="+encodeURIComponent(arguments[l]);return"Minified React error #"+e+"; visit "+r+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var h=Object.prototype.hasOwnProperty,y=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,p={},w={};function T(e){return h.call(w,e)?!0:h.call(p,e)?!1:y.test(e)?w[e]=!0:(p[e]=!0,!1)}function E(e,r,l,a,v,f,x){this.acceptsBooleans=r===2||r===3||r===4,this.attributeName=a,this.attributeNamespace=v,this.mustUseProperty=l,this.propertyName=e,this.type=r,this.sanitizeURL=f,this.removeEmptyString=x}var b={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){b[e]=new E(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var r=e[0];b[r]=new E(r,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){b[e]=new E(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){b[e]=new E(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){b[e]=new E(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){b[e]=new E(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){b[e]=new E(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){b[e]=new E(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){b[e]=new E(e,5,!1,e.toLowerCase(),null,!1,!1)});var S=/[\-:]([a-z])/g;function U(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var r=e.replace(S,U);b[r]=new E(r,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var r=e.replace(S,U);b[r]=new E(r,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var r=e.replace(S,U);b[r]=new E(r,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){b[e]=new E(e,1,!1,e.toLowerCase(),null,!1,!1)}),b.xlinkHref=new E("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){b[e]=new E(e,1,!1,e.toLowerCase(),null,!0,!0)});var H={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},G=["Webkit","ms","Moz","O"];Object.keys(H).forEach(function(e){G.forEach(function(r){r=r+e.charAt(0).toUpperCase()+e.substring(1),H[r]=H[e]})});var fe=/["'&<>]/;function X(e){if(typeof e=="boolean"||typeof e=="number")return""+e;e=""+e;var r=fe.exec(e);if(r){var l="",a,v=0;for(a=r.index;a<e.length;a++){switch(e.charCodeAt(a)){case 34:r="&quot;";break;case 38:r="&amp;";break;case 39:r="&#x27;";break;case 60:r="&lt;";break;case 62:r="&gt;";break;default:continue}v!==a&&(l+=e.substring(v,a)),v=a+1,l+=r}e=v!==a?l+e.substring(v,a):l}return e}var re=/([A-Z])/g,N=/^ms-/,L=Array.isArray;function q(e,r){return{insertionMode:e,selectedValue:r}}function oe(e,r,l){switch(r){case"select":return q(1,l.value!=null?l.value:l.defaultValue);case"svg":return q(2,null);case"math":return q(3,null);case"foreignObject":return q(1,null);case"table":return q(4,null);case"thead":case"tbody":case"tfoot":return q(5,null);case"colgroup":return q(7,null);case"tr":return q(6,null)}return 4<=e.insertionMode||e.insertionMode===0?q(1,null):e}var Y=new Map;function st(e,r,l){if(typeof l!="object")throw Error(c(62));r=!0;for(var a in l)if(h.call(l,a)){var v=l[a];if(v!=null&&typeof v!="boolean"&&v!==""){if(a.indexOf("--")===0){var f=X(a);v=X((""+v).trim())}else{f=a;var x=Y.get(f);x!==void 0||(x=X(f.replace(re,"-$1").toLowerCase().replace(N,"-ms-")),Y.set(f,x)),f=x,v=typeof v=="number"?v===0||h.call(H,a)?""+v:v+"px":X((""+v).trim())}r?(r=!1,e.push(' style="',f,":",v)):e.push(";",f,":",v)}}r||e.push('"')}function J(e,r,l,a){switch(l){case"style":st(e,r,a);return;case"defaultValue":case"defaultChecked":case"innerHTML":case"suppressContentEditableWarning":case"suppressHydrationWarning":return}if(!(2<l.length)||l[0]!=="o"&&l[0]!=="O"||l[1]!=="n"&&l[1]!=="N"){if(r=b.hasOwnProperty(l)?b[l]:null,r!==null){switch(typeof a){case"function":case"symbol":return;case"boolean":if(!r.acceptsBooleans)return}switch(l=r.attributeName,r.type){case 3:a&&e.push(" ",l,'=""');break;case 4:a===!0?e.push(" ",l,'=""'):a!==!1&&e.push(" ",l,'="',X(a),'"');break;case 5:isNaN(a)||e.push(" ",l,'="',X(a),'"');break;case 6:!isNaN(a)&&1<=a&&e.push(" ",l,'="',X(a),'"');break;default:r.sanitizeURL&&(a=""+a),e.push(" ",l,'="',X(a),'"')}}else if(T(l)){switch(typeof a){case"function":case"symbol":return;case"boolean":if(r=l.toLowerCase().slice(0,5),r!=="data-"&&r!=="aria-")return}e.push(" ",l,'="',X(a),'"')}}}function Z(e,r,l){if(r!=null){if(l!=null)throw Error(c(60));if(typeof r!="object"||!("__html"in r))throw Error(c(61));r=r.__html,r!=null&&e.push(""+r)}}function Cn(e){var r="";return s.Children.forEach(e,function(l){l!=null&&(r+=l)}),r}function it(e,r,l,a){e.push(ae(l));var v=l=null,f;for(f in r)if(h.call(r,f)){var x=r[f];if(x!=null)switch(f){case"children":l=x;break;case"dangerouslySetInnerHTML":v=x;break;default:J(e,a,f,x)}}return e.push(">"),Z(e,v,l),typeof l=="string"?(e.push(X(l)),null):l}var at=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,At=new Map;function ae(e){var r=At.get(e);if(r===void 0){if(!at.test(e))throw Error(c(65,e));r="<"+e,At.set(e,r)}return r}function Rn(e,r,l,a,v){switch(r){case"select":e.push(ae("select"));var f=null,x=null;for(P in l)if(h.call(l,P)){var C=l[P];if(C!=null)switch(P){case"children":f=C;break;case"dangerouslySetInnerHTML":x=C;break;case"defaultValue":case"value":break;default:J(e,a,P,C)}}return e.push(">"),Z(e,x,f),f;case"option":x=v.selectedValue,e.push(ae("option"));var M=C=null,I=null,P=null;for(f in l)if(h.call(l,f)){var $=l[f];if($!=null)switch(f){case"children":C=$;break;case"selected":I=$;break;case"dangerouslySetInnerHTML":P=$;break;case"value":M=$;default:J(e,a,f,$)}}if(x!=null)if(l=M!==null?""+M:Cn(C),L(x)){for(a=0;a<x.length;a++)if(""+x[a]===l){e.push(' selected=""');break}}else""+x===l&&e.push(' selected=""');else I&&e.push(' selected=""');return e.push(">"),Z(e,P,C),C;case"textarea":e.push(ae("textarea")),P=x=f=null;for(C in l)if(h.call(l,C)&&(M=l[C],M!=null))switch(C){case"children":P=M;break;case"value":f=M;break;case"defaultValue":x=M;break;case"dangerouslySetInnerHTML":throw Error(c(91));default:J(e,a,C,M)}if(f===null&&x!==null&&(f=x),e.push(">"),P!=null){if(f!=null)throw Error(c(92));if(L(P)&&1<P.length)throw Error(c(93));f=""+P}return typeof f=="string"&&f[0]===`
`&&e.push(`
`),f!==null&&e.push(X(""+f)),null;case"input":e.push(ae("input")),M=P=C=f=null;for(x in l)if(h.call(l,x)&&(I=l[x],I!=null))switch(x){case"children":case"dangerouslySetInnerHTML":throw Error(c(399,"input"));case"defaultChecked":M=I;break;case"defaultValue":C=I;break;case"checked":P=I;break;case"value":f=I;break;default:J(e,a,x,I)}return P!==null?J(e,a,"checked",P):M!==null&&J(e,a,"checked",M),f!==null?J(e,a,"value",f):C!==null&&J(e,a,"value",C),e.push("/>"),null;case"menuitem":e.push(ae("menuitem"));for(var pe in l)if(h.call(l,pe)&&(f=l[pe],f!=null))switch(pe){case"children":case"dangerouslySetInnerHTML":throw Error(c(400));default:J(e,a,pe,f)}return e.push(">"),null;case"title":e.push(ae("title")),f=null;for($ in l)if(h.call(l,$)&&(x=l[$],x!=null))switch($){case"children":f=x;break;case"dangerouslySetInnerHTML":throw Error(c(434));default:J(e,a,$,x)}return e.push(">"),f;case"listing":case"pre":e.push(ae(r)),x=f=null;for(M in l)if(h.call(l,M)&&(C=l[M],C!=null))switch(M){case"children":f=C;break;case"dangerouslySetInnerHTML":x=C;break;default:J(e,a,M,C)}if(e.push(">"),x!=null){if(f!=null)throw Error(c(60));if(typeof x!="object"||!("__html"in x))throw Error(c(61));l=x.__html,l!=null&&(typeof l=="string"&&0<l.length&&l[0]===`
`?e.push(`
`,l):e.push(""+l))}return typeof f=="string"&&f[0]===`
`&&e.push(`
`),f;case"area":case"base":case"br":case"col":case"embed":case"hr":case"img":case"keygen":case"link":case"meta":case"param":case"source":case"track":case"wbr":e.push(ae(r));for(var he in l)if(h.call(l,he)&&(f=l[he],f!=null))switch(he){case"children":case"dangerouslySetInnerHTML":throw Error(c(399,r));default:J(e,a,he,f)}return e.push("/>"),null;case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return it(e,l,r,a);case"html":return v.insertionMode===0&&e.push("<!DOCTYPE html>"),it(e,l,r,a);default:if(r.indexOf("-")===-1&&typeof l.is!="string")return it(e,l,r,a);e.push(ae(r)),x=f=null;for(I in l)if(h.call(l,I)&&(C=l[I],C!=null))switch(I){case"children":f=C;break;case"dangerouslySetInnerHTML":x=C;break;case"style":st(e,a,C);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":break;default:T(I)&&typeof C!="function"&&typeof C!="symbol"&&e.push(" ",I,'="',X(C),'"')}return e.push(">"),Z(e,x,f),f}}function Bt(e,r,l){if(e.push('<!--$?--><template id="'),l===null)throw Error(c(395));return e.push(l),e.push('"></template>')}function Nt(e,r,l,a){switch(l.insertionMode){case 0:case 1:return e.push('<div hidden id="'),e.push(r.segmentPrefix),r=a.toString(16),e.push(r),e.push('">');case 2:return e.push('<svg aria-hidden="true" style="display:none" id="'),e.push(r.segmentPrefix),r=a.toString(16),e.push(r),e.push('">');case 3:return e.push('<math aria-hidden="true" style="display:none" id="'),e.push(r.segmentPrefix),r=a.toString(16),e.push(r),e.push('">');case 4:return e.push('<table hidden id="'),e.push(r.segmentPrefix),r=a.toString(16),e.push(r),e.push('">');case 5:return e.push('<table hidden><tbody id="'),e.push(r.segmentPrefix),r=a.toString(16),e.push(r),e.push('">');case 6:return e.push('<table hidden><tr id="'),e.push(r.segmentPrefix),r=a.toString(16),e.push(r),e.push('">');case 7:return e.push('<table hidden><colgroup id="'),e.push(r.segmentPrefix),r=a.toString(16),e.push(r),e.push('">');default:throw Error(c(397))}}function En(e,r){switch(r.insertionMode){case 0:case 1:return e.push("</div>");case 2:return e.push("</svg>");case 3:return e.push("</math>");case 4:return e.push("</table>");case 5:return e.push("</tbody></table>");case 6:return e.push("</tr></table>");case 7:return e.push("</colgroup></table>");default:throw Error(c(397))}}var jn=/[<\u2028\u2029]/g;function ut(e){return JSON.stringify(e).replace(jn,function(r){switch(r){case"<":return"\\u003c";case"\u2028":return"\\u2028";case"\u2029":return"\\u2029";default:throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React")}})}function ue(e,r){return r=r===void 0?"":r,{bootstrapChunks:[],startInlineScript:"<script>",placeholderPrefix:r+"P:",segmentPrefix:r+"S:",boundaryPrefix:r+"B:",idPrefix:r,nextSuspenseID:0,sentCompleteSegmentFunction:!1,sentCompleteBoundaryFunction:!1,sentClientRenderFunction:!1,generateStaticMarkup:e}}function Ht(e,r,l,a){return l.generateStaticMarkup?(e.push(X(r)),!1):(r===""?e=a:(a&&e.push("<!-- -->"),e.push(X(r)),e=!0),e)}var Pe=Object.assign,ct=Symbol.for("react.element"),ft=Symbol.for("react.portal"),dt=Symbol.for("react.fragment"),Lt=Symbol.for("react.strict_mode"),pt=Symbol.for("react.profiler"),Ut=Symbol.for("react.provider"),ht=Symbol.for("react.context"),de=Symbol.for("react.forward_ref"),we=Symbol.for("react.suspense"),xe=Symbol.for("react.suspense_list"),mt=Symbol.for("react.memo"),K=Symbol.for("react.lazy"),ge=Symbol.for("react.scope"),zt=Symbol.for("react.debug_trace_mode"),We=Symbol.for("react.legacy_hidden"),Tn=Symbol.for("react.default_value"),Ge=Symbol.iterator;function _e(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case dt:return"Fragment";case ft:return"Portal";case pt:return"Profiler";case Lt:return"StrictMode";case we:return"Suspense";case xe:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case ht:return(e.displayName||"Context")+".Consumer";case Ut:return(e._context.displayName||"Context")+".Provider";case de:var r=e.render;return e=e.displayName,e||(e=r.displayName||r.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case mt:return r=e.displayName||null,r!==null?r:_e(e.type)||"Memo";case K:r=e._payload,e=e._init;try{return _e(e(r))}catch{}}return null}var qe={};function Vt(e,r){if(e=e.contextTypes,!e)return qe;var l={},a;for(a in e)l[a]=r[a];return l}var ye=null;function Q(e,r){if(e!==r){e.context._currentValue2=e.parentValue,e=e.parent;var l=r.parent;if(e===null){if(l!==null)throw Error(c(401))}else{if(l===null)throw Error(c(401));Q(e,l)}r.context._currentValue2=r.value}}function Ot(e){e.context._currentValue2=e.parentValue,e=e.parent,e!==null&&Ot(e)}function $t(e){var r=e.parent;r!==null&&$t(r),e.context._currentValue2=e.value}function Wt(e,r){if(e.context._currentValue2=e.parentValue,e=e.parent,e===null)throw Error(c(402));e.depth===r.depth?Q(e,r):Wt(e,r)}function Gt(e,r){var l=r.parent;if(l===null)throw Error(c(402));e.depth===l.depth?Q(e,l):Gt(e,l),r.context._currentValue2=r.value}function Ze(e){var r=ye;r!==e&&(r===null?$t(e):e===null?Ot(r):r.depth===e.depth?Q(r,e):r.depth>e.depth?Wt(r,e):Gt(r,e),ye=e)}var qt={isMounted:function(){return!1},enqueueSetState:function(e,r){e=e._reactInternals,e.queue!==null&&e.queue.push(r)},enqueueReplaceState:function(e,r){e=e._reactInternals,e.replace=!0,e.queue=[r]},enqueueForceUpdate:function(){}};function Zt(e,r,l,a){var v=e.state!==void 0?e.state:null;e.updater=qt,e.props=l,e.state=v;var f={queue:[],replace:!1};e._reactInternals=f;var x=r.contextType;if(e.context=typeof x=="object"&&x!==null?x._currentValue2:a,x=r.getDerivedStateFromProps,typeof x=="function"&&(x=x(l,v),v=x==null?v:Pe({},v,x),e.state=v),typeof r.getDerivedStateFromProps!="function"&&typeof e.getSnapshotBeforeUpdate!="function"&&(typeof e.UNSAFE_componentWillMount=="function"||typeof e.componentWillMount=="function"))if(r=e.state,typeof e.componentWillMount=="function"&&e.componentWillMount(),typeof e.UNSAFE_componentWillMount=="function"&&e.UNSAFE_componentWillMount(),r!==e.state&&qt.enqueueReplaceState(e,e.state,null),f.queue!==null&&0<f.queue.length)if(r=f.queue,x=f.replace,f.queue=null,f.replace=!1,x&&r.length===1)e.state=r[0];else{for(f=x?r[0]:e.state,v=!0,x=x?1:0;x<r.length;x++){var C=r[x];C=typeof C=="function"?C.call(e,f,l,a):C,C!=null&&(v?(v=!1,f=Pe({},f,C)):Pe(f,C))}e.state=f}else f.queue=null}var Mn={id:1,overflow:""};function vt(e,r,l){var a=e.id;e=e.overflow;var v=32-Xe(a)-1;a&=~(1<<v),l+=1;var f=32-Xe(r)+v;if(30<f){var x=v-v%5;return f=(a&(1<<x)-1).toString(32),a>>=x,v-=x,{id:1<<32-Xe(r)+v|l<<v|a,overflow:f+e}}return{id:1<<f|l<<v|a,overflow:e}}var Xe=Math.clz32?Math.clz32:Pn,Fn=Math.log,In=Math.LN2;function Pn(e){return e>>>=0,e===0?32:31-(Fn(e)/In|0)|0}function _n(e,r){return e===r&&(e!==0||1/e===1/r)||e!==e&&r!==r}var Dn=typeof Object.is=="function"?Object.is:_n,ce=null,xt=null,Ye=null,z=null,De=!1,Ke=!1,Ae=0,Se=null,Je=0;function ke(){if(ce===null)throw Error(c(321));return ce}function Xt(){if(0<Je)throw Error(c(312));return{memoizedState:null,queue:null,next:null}}function gt(){return z===null?Ye===null?(De=!1,Ye=z=Xt()):(De=!0,z=Ye):z.next===null?(De=!1,z=z.next=Xt()):(De=!0,z=z.next),z}function yt(){xt=ce=null,Ke=!1,Ye=null,Je=0,z=Se=null}function Yt(e,r){return typeof r=="function"?r(e):r}function Kt(e,r,l){if(ce=ke(),z=gt(),De){var a=z.queue;if(r=a.dispatch,Se!==null&&(l=Se.get(a),l!==void 0)){Se.delete(a),a=z.memoizedState;do a=e(a,l.action),l=l.next;while(l!==null);return z.memoizedState=a,[a,r]}return[z.memoizedState,r]}return e=e===Yt?typeof r=="function"?r():r:l!==void 0?l(r):r,z.memoizedState=e,e=z.queue={last:null,dispatch:null},e=e.dispatch=An.bind(null,ce,e),[z.memoizedState,e]}function Jt(e,r){if(ce=ke(),z=gt(),r=r===void 0?null:r,z!==null){var l=z.memoizedState;if(l!==null&&r!==null){var a=l[1];e:if(a===null)a=!1;else{for(var v=0;v<a.length&&v<r.length;v++)if(!Dn(r[v],a[v])){a=!1;break e}a=!0}if(a)return l[0]}}return e=e(),z.memoizedState=[e,r],e}function An(e,r,l){if(25<=Je)throw Error(c(301));if(e===ce)if(Ke=!0,e={action:l,next:null},Se===null&&(Se=new Map),l=Se.get(r),l===void 0)Se.set(r,e);else{for(r=l;r.next!==null;)r=r.next;r.next=e}}function Bn(){throw Error(c(394))}function Qe(){}var Qt={readContext:function(e){return e._currentValue2},useContext:function(e){return ke(),e._currentValue2},useMemo:Jt,useReducer:Kt,useRef:function(e){ce=ke(),z=gt();var r=z.memoizedState;return r===null?(e={current:e},z.memoizedState=e):r},useState:function(e){return Kt(Yt,e)},useInsertionEffect:Qe,useLayoutEffect:function(){},useCallback:function(e,r){return Jt(function(){return e},r)},useImperativeHandle:Qe,useEffect:Qe,useDebugValue:Qe,useDeferredValue:function(e){return ke(),e},useTransition:function(){return ke(),[!1,Bn]},useId:function(){var e=xt.treeContext,r=e.overflow;e=e.id,e=(e&~(1<<32-Xe(e)-1)).toString(32)+r;var l=et;if(l===null)throw Error(c(404));return r=Ae++,e=":"+l.idPrefix+"R"+e,0<r&&(e+="H"+r.toString(32)),e+":"},useMutableSource:function(e,r){return ke(),r(e._source)},useSyncExternalStore:function(e,r,l){if(l===void 0)throw Error(c(407));return l()}},et=null,St=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;function Nn(e){return console.error(e),null}function Be(){}function Hn(e,r,l,a,v,f,x,C,M){var I=[],P=new Set;return r={destination:null,responseState:r,progressiveChunkSize:a===void 0?12800:a,status:0,fatalError:null,nextSegmentId:0,allPendingTasks:0,pendingRootTasks:0,completedRootSegment:null,abortableTasks:P,pingedTasks:I,clientRenderedBoundaries:[],completedBoundaries:[],partialBoundaries:[],onError:v===void 0?Nn:v,onAllReady:Be,onShellReady:x===void 0?Be:x,onShellError:Be,onFatalError:Be},l=tt(r,0,null,l,!1,!1),l.parentFlushed=!0,e=wt(r,e,null,l,P,qe,null,Mn),I.push(e),r}function wt(e,r,l,a,v,f,x,C){e.allPendingTasks++,l===null?e.pendingRootTasks++:l.pendingTasks++;var M={node:r,ping:function(){var I=e.pingedTasks;I.push(M),I.length===1&&ln(e)},blockedBoundary:l,blockedSegment:a,abortSet:v,legacyContext:f,context:x,treeContext:C};return v.add(M),M}function tt(e,r,l,a,v,f){return{status:0,id:-1,index:r,parentFlushed:!1,chunks:[],children:[],formatContext:a,boundary:l,lastPushedText:v,textEmbedded:f}}function Ne(e,r){if(e=e.onError(r),e!=null&&typeof e!="string")throw Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "'+typeof e+'" instead');return e}function nt(e,r){var l=e.onShellError;l(r),l=e.onFatalError,l(r),e.destination!==null?(e.status=2,e.destination.destroy(r)):(e.status=1,e.fatalError=r)}function en(e,r,l,a,v){for(ce={},xt=r,Ae=0,e=l(a,v);Ke;)Ke=!1,Ae=0,Je+=1,z=null,e=l(a,v);return yt(),e}function tn(e,r,l,a){var v=l.render(),f=a.childContextTypes;if(f!=null){var x=r.legacyContext;if(typeof l.getChildContext!="function")a=x;else{l=l.getChildContext();for(var C in l)if(!(C in f))throw Error(c(108,_e(a)||"Unknown",C));a=Pe({},x,l)}r.legacyContext=a,ee(e,r,v),r.legacyContext=x}else ee(e,r,v)}function nn(e,r){if(e&&e.defaultProps){r=Pe({},r),e=e.defaultProps;for(var l in e)r[l]===void 0&&(r[l]=e[l]);return r}return r}function kt(e,r,l,a,v){if(typeof l=="function")if(l.prototype&&l.prototype.isReactComponent){v=Vt(l,r.legacyContext);var f=l.contextType;f=new l(a,typeof f=="object"&&f!==null?f._currentValue2:v),Zt(f,l,a,v),tn(e,r,f,l)}else{f=Vt(l,r.legacyContext),v=en(e,r,l,a,f);var x=Ae!==0;if(typeof v=="object"&&v!==null&&typeof v.render=="function"&&v.$$typeof===void 0)Zt(v,l,a,f),tn(e,r,v,l);else if(x){a=r.treeContext,r.treeContext=vt(a,1,0);try{ee(e,r,v)}finally{r.treeContext=a}}else ee(e,r,v)}else if(typeof l=="string"){switch(v=r.blockedSegment,f=Rn(v.chunks,l,a,e.responseState,v.formatContext),v.lastPushedText=!1,x=v.formatContext,v.formatContext=oe(x,l,a),bt(e,r,f),v.formatContext=x,l){case"area":case"base":case"br":case"col":case"embed":case"hr":case"img":case"input":case"keygen":case"link":case"meta":case"param":case"source":case"track":case"wbr":break;default:v.chunks.push("</",l,">")}v.lastPushedText=!1}else{switch(l){case We:case zt:case Lt:case pt:case dt:ee(e,r,a.children);return;case xe:ee(e,r,a.children);return;case ge:throw Error(c(343));case we:e:{l=r.blockedBoundary,v=r.blockedSegment,f=a.fallback,a=a.children,x=new Set;var C={id:null,rootSegmentID:-1,parentFlushed:!1,pendingTasks:0,forceClientRender:!1,completedSegments:[],byteSize:0,fallbackAbortableTasks:x,errorDigest:null},M=tt(e,v.chunks.length,C,v.formatContext,!1,!1);v.children.push(M),v.lastPushedText=!1;var I=tt(e,0,null,v.formatContext,!1,!1);I.parentFlushed=!0,r.blockedBoundary=C,r.blockedSegment=I;try{if(bt(e,r,a),e.responseState.generateStaticMarkup||I.lastPushedText&&I.textEmbedded&&I.chunks.push("<!-- -->"),I.status=1,je(C,I),C.pendingTasks===0)break e}catch(P){I.status=4,C.forceClientRender=!0,C.errorDigest=Ne(e,P)}finally{r.blockedBoundary=l,r.blockedSegment=v}r=wt(e,f,l,M,x,r.legacyContext,r.context,r.treeContext),e.pingedTasks.push(r)}return}if(typeof l=="object"&&l!==null)switch(l.$$typeof){case de:if(a=en(e,r,l.render,a,v),Ae!==0){l=r.treeContext,r.treeContext=vt(l,1,0);try{ee(e,r,a)}finally{r.treeContext=l}}else ee(e,r,a);return;case mt:l=l.type,a=nn(l,a),kt(e,r,l,a,v);return;case Ut:if(v=a.children,l=l._context,a=a.value,f=l._currentValue2,l._currentValue2=a,x=ye,ye=a={parent:x,depth:x===null?0:x.depth+1,context:l,parentValue:f,value:a},r.context=a,ee(e,r,v),e=ye,e===null)throw Error(c(403));a=e.parentValue,e.context._currentValue2=a===Tn?e.context._defaultValue:a,e=ye=e.parent,r.context=e;return;case ht:a=a.children,a=a(l._currentValue2),ee(e,r,a);return;case K:v=l._init,l=v(l._payload),a=nn(l,a),kt(e,r,l,a,void 0);return}throw Error(c(130,l==null?l:typeof l,""))}}function ee(e,r,l){if(r.node=l,typeof l=="object"&&l!==null){switch(l.$$typeof){case ct:kt(e,r,l.type,l.props,l.ref);return;case ft:throw Error(c(257));case K:var a=l._init;l=a(l._payload),ee(e,r,l);return}if(L(l)){rn(e,r,l);return}if(l===null||typeof l!="object"?a=null:(a=Ge&&l[Ge]||l["@@iterator"],a=typeof a=="function"?a:null),a&&(a=a.call(l))){if(l=a.next(),!l.done){var v=[];do v.push(l.value),l=a.next();while(!l.done);rn(e,r,v)}return}throw e=Object.prototype.toString.call(l),Error(c(31,e==="[object Object]"?"object with keys {"+Object.keys(l).join(", ")+"}":e))}typeof l=="string"?(a=r.blockedSegment,a.lastPushedText=Ht(r.blockedSegment.chunks,l,e.responseState,a.lastPushedText)):typeof l=="number"&&(a=r.blockedSegment,a.lastPushedText=Ht(r.blockedSegment.chunks,""+l,e.responseState,a.lastPushedText))}function rn(e,r,l){for(var a=l.length,v=0;v<a;v++){var f=r.treeContext;r.treeContext=vt(f,a,v);try{bt(e,r,l[v])}finally{r.treeContext=f}}}function bt(e,r,l){var a=r.blockedSegment.formatContext,v=r.legacyContext,f=r.context;try{return ee(e,r,l)}catch(M){if(yt(),typeof M=="object"&&M!==null&&typeof M.then=="function"){l=M;var x=r.blockedSegment,C=tt(e,x.chunks.length,null,x.formatContext,x.lastPushedText,!0);x.children.push(C),x.lastPushedText=!1,e=wt(e,r.node,r.blockedBoundary,C,r.abortSet,r.legacyContext,r.context,r.treeContext).ping,l.then(e,e),r.blockedSegment.formatContext=a,r.legacyContext=v,r.context=f,Ze(f)}else throw r.blockedSegment.formatContext=a,r.legacyContext=v,r.context=f,Ze(f),M}}function Ct(e){var r=e.blockedBoundary;e=e.blockedSegment,e.status=3,Te(this,r,e)}function on(e,r,l){var a=e.blockedBoundary;e.blockedSegment.status=3,a===null?(r.allPendingTasks--,r.status!==2&&(r.status=2,r.destination!==null&&r.destination.push(null))):(a.pendingTasks--,a.forceClientRender||(a.forceClientRender=!0,e=l===void 0?Error(c(432)):l,a.errorDigest=r.onError(e),a.parentFlushed&&r.clientRenderedBoundaries.push(a)),a.fallbackAbortableTasks.forEach(function(v){return on(v,r,l)}),a.fallbackAbortableTasks.clear(),r.allPendingTasks--,r.allPendingTasks===0&&(a=r.onAllReady,a()))}function je(e,r){if(r.chunks.length===0&&r.children.length===1&&r.children[0].boundary===null){var l=r.children[0];l.id=r.id,l.parentFlushed=!0,l.status===1&&je(e,l)}else e.completedSegments.push(r)}function Te(e,r,l){if(r===null){if(l.parentFlushed){if(e.completedRootSegment!==null)throw Error(c(389));e.completedRootSegment=l}e.pendingRootTasks--,e.pendingRootTasks===0&&(e.onShellError=Be,r=e.onShellReady,r())}else r.pendingTasks--,r.forceClientRender||(r.pendingTasks===0?(l.parentFlushed&&l.status===1&&je(r,l),r.parentFlushed&&e.completedBoundaries.push(r),r.fallbackAbortableTasks.forEach(Ct,e),r.fallbackAbortableTasks.clear()):l.parentFlushed&&l.status===1&&(je(r,l),r.completedSegments.length===1&&r.parentFlushed&&e.partialBoundaries.push(r)));e.allPendingTasks--,e.allPendingTasks===0&&(e=e.onAllReady,e())}function ln(e){if(e.status!==2){var r=ye,l=St.current;St.current=Qt;var a=et;et=e.responseState;try{var v=e.pingedTasks,f;for(f=0;f<v.length;f++){var x=v[f],C=e,M=x.blockedSegment;if(M.status===0){Ze(x.context);try{ee(C,x,x.node),C.responseState.generateStaticMarkup||M.lastPushedText&&M.textEmbedded&&M.chunks.push("<!-- -->"),x.abortSet.delete(x),M.status=1,Te(C,x.blockedBoundary,M)}catch(le){if(yt(),typeof le=="object"&&le!==null&&typeof le.then=="function"){var I=x.ping;le.then(I,I)}else{x.abortSet.delete(x),M.status=4;var P=x.blockedBoundary,$=le,pe=Ne(C,$);if(P===null?nt(C,$):(P.pendingTasks--,P.forceClientRender||(P.forceClientRender=!0,P.errorDigest=pe,P.parentFlushed&&C.clientRenderedBoundaries.push(P))),C.allPendingTasks--,C.allPendingTasks===0){var he=C.onAllReady;he()}}}finally{}}}v.splice(0,f),e.destination!==null&&rt(e,e.destination)}catch(le){Ne(e,le),nt(e,le)}finally{et=a,St.current=l,l===Qt&&Ze(r)}}}function He(e,r,l){switch(l.parentFlushed=!0,l.status){case 0:var a=l.id=e.nextSegmentId++;return l.lastPushedText=!1,l.textEmbedded=!1,e=e.responseState,r.push('<template id="'),r.push(e.placeholderPrefix),e=a.toString(16),r.push(e),r.push('"></template>');case 1:l.status=2;var v=!0;a=l.chunks;var f=0;l=l.children;for(var x=0;x<l.length;x++){for(v=l[x];f<v.index;f++)r.push(a[f]);v=Le(e,r,v)}for(;f<a.length-1;f++)r.push(a[f]);return f<a.length&&(v=r.push(a[f])),v;default:throw Error(c(390))}}function Le(e,r,l){var a=l.boundary;if(a===null)return He(e,r,l);if(a.parentFlushed=!0,a.forceClientRender)return e.responseState.generateStaticMarkup||(a=a.errorDigest,r.push("<!--$!-->"),r.push("<template"),a&&(r.push(' data-dgst="'),a=X(a),r.push(a),r.push('"')),r.push("></template>")),He(e,r,l),e=e.responseState.generateStaticMarkup?!0:r.push("<!--/$-->"),e;if(0<a.pendingTasks){a.rootSegmentID=e.nextSegmentId++,0<a.completedSegments.length&&e.partialBoundaries.push(a);var v=e.responseState,f=v.nextSuspenseID++;return v=v.boundaryPrefix+f.toString(16),a=a.id=v,Bt(r,e.responseState,a),He(e,r,l),r.push("<!--/$-->")}if(a.byteSize>e.progressiveChunkSize)return a.rootSegmentID=e.nextSegmentId++,e.completedBoundaries.push(a),Bt(r,e.responseState,a.id),He(e,r,l),r.push("<!--/$-->");if(e.responseState.generateStaticMarkup||r.push("<!--$-->"),l=a.completedSegments,l.length!==1)throw Error(c(391));return Le(e,r,l[0]),e=e.responseState.generateStaticMarkup?!0:r.push("<!--/$-->"),e}function Rt(e,r,l){return Nt(r,e.responseState,l.formatContext,l.id),Le(e,r,l),En(r,l.formatContext)}function Et(e,r,l){for(var a=l.completedSegments,v=0;v<a.length;v++)jt(e,r,l,a[v]);if(a.length=0,e=e.responseState,a=l.id,l=l.rootSegmentID,r.push(e.startInlineScript),e.sentCompleteBoundaryFunction?r.push('$RC("'):(e.sentCompleteBoundaryFunction=!0,r.push('function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("')),a===null)throw Error(c(395));return l=l.toString(16),r.push(a),r.push('","'),r.push(e.segmentPrefix),r.push(l),r.push('")<\/script>')}function jt(e,r,l,a){if(a.status===2)return!0;var v=a.id;if(v===-1){if((a.id=l.rootSegmentID)===-1)throw Error(c(392));return Rt(e,r,a)}return Rt(e,r,a),e=e.responseState,r.push(e.startInlineScript),e.sentCompleteSegmentFunction?r.push('$RS("'):(e.sentCompleteSegmentFunction=!0,r.push('function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("')),r.push(e.segmentPrefix),v=v.toString(16),r.push(v),r.push('","'),r.push(e.placeholderPrefix),r.push(v),r.push('")<\/script>')}function rt(e,r){try{var l=e.completedRootSegment;if(l!==null&&e.pendingRootTasks===0){Le(e,r,l),e.completedRootSegment=null;var a=e.responseState.bootstrapChunks;for(l=0;l<a.length-1;l++)r.push(a[l]);l<a.length&&r.push(a[l])}var v=e.clientRenderedBoundaries,f;for(f=0;f<v.length;f++){var x=v[f];a=r;var C=e.responseState,M=x.id,I=x.errorDigest,P=x.errorMessage,$=x.errorComponentStack;if(a.push(C.startInlineScript),C.sentClientRenderFunction?a.push('$RX("'):(C.sentClientRenderFunction=!0,a.push('function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX("')),M===null)throw Error(c(395));if(a.push(M),a.push('"'),I||P||$){a.push(",");var pe=ut(I||"");a.push(pe)}if(P||$){a.push(",");var he=ut(P||"");a.push(he)}if($){a.push(",");var le=ut($);a.push(le)}if(!a.push(")<\/script>")){e.destination=null,f++,v.splice(0,f);return}}v.splice(0,f);var Ue=e.completedBoundaries;for(f=0;f<Ue.length;f++)if(!Et(e,r,Ue[f])){e.destination=null,f++,Ue.splice(0,f);return}Ue.splice(0,f);var be=e.partialBoundaries;for(f=0;f<be.length;f++){var Mt=be[f];e:{v=e,x=r;var ze=Mt.completedSegments;for(C=0;C<ze.length;C++)if(!jt(v,x,Mt,ze[C])){C++,ze.splice(0,C);var un=!1;break e}ze.splice(0,C),un=!0}if(!un){e.destination=null,f++,be.splice(0,f);return}}be.splice(0,f);var Me=e.completedBoundaries;for(f=0;f<Me.length;f++)if(!Et(e,r,Me[f])){e.destination=null,f++,Me.splice(0,f);return}Me.splice(0,f)}finally{e.allPendingTasks===0&&e.pingedTasks.length===0&&e.clientRenderedBoundaries.length===0&&e.completedBoundaries.length===0&&r.push(null)}}function sn(e,r){try{var l=e.abortableTasks;l.forEach(function(a){return on(a,e,r)}),l.clear(),e.destination!==null&&rt(e,e.destination)}catch(a){Ne(e,a),nt(e,a)}}function an(){}function Tt(e,r,l,a){var v=!1,f=null,x="",C={push:function(I){return I!==null&&(x+=I),!0},destroy:function(I){v=!0,f=I}},M=!1;if(e=Hn(e,ue(l,r?r.identifierPrefix:void 0),{insertionMode:1,selectedValue:null},1/0,an,void 0,function(){M=!0}),ln(e),sn(e,a),e.status===1)e.status=2,C.destroy(e.fatalError);else if(e.status!==2&&e.destination===null){e.destination=C;try{rt(e,C)}catch(I){Ne(e,I),nt(e,I)}}if(v)throw f;if(!M)throw Error(c(426));return x}return Oe.renderToNodeStream=function(){throw Error(c(207))},Oe.renderToStaticMarkup=function(e,r){return Tt(e,r,!0,'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server')},Oe.renderToStaticNodeStream=function(){throw Error(c(208))},Oe.renderToString=function(e,r){return Tt(e,r,!1,'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server')},Oe.version="18.3.1",Oe}var kn={};/**
 * @license React
 * react-dom-server.browser.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Cr;function Co(){if(Cr)return kn;Cr=1;var s=Tr();function c(t){for(var n="https://reactjs.org/docs/error-decoder.html?invariant="+t,o=1;o<arguments.length;o++)n+="&args[]="+encodeURIComponent(arguments[o]);return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var h=null,y=0;function p(t,n){if(n.length!==0)if(512<n.length)0<y&&(t.enqueue(new Uint8Array(h.buffer,0,y)),h=new Uint8Array(512),y=0),t.enqueue(n);else{var o=h.length-y;o<n.length&&(o===0?t.enqueue(h):(h.set(n.subarray(0,o),y),t.enqueue(h),n=n.subarray(o)),h=new Uint8Array(512),y=0),h.set(n,y),y+=n.length}}function w(t,n){return p(t,n),!0}function T(t){h&&0<y&&(t.enqueue(new Uint8Array(h.buffer,0,y)),h=null,y=0)}var E=new TextEncoder;function b(t){return E.encode(t)}function S(t){return E.encode(t)}function U(t,n){typeof t.error=="function"?t.error(n):t.close()}var H=Object.prototype.hasOwnProperty,G=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,fe={},X={};function re(t){return H.call(X,t)?!0:H.call(fe,t)?!1:G.test(t)?X[t]=!0:(fe[t]=!0,!1)}function N(t,n,o,i,m,d,g){this.acceptsBooleans=n===2||n===3||n===4,this.attributeName=i,this.attributeNamespace=m,this.mustUseProperty=o,this.propertyName=t,this.type=n,this.sanitizeURL=d,this.removeEmptyString=g}var L={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){L[t]=new N(t,0,!1,t,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var n=t[0];L[n]=new N(n,1,!1,t[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(t){L[t]=new N(t,2,!1,t.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){L[t]=new N(t,2,!1,t,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){L[t]=new N(t,3,!1,t.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(t){L[t]=new N(t,3,!0,t,null,!1,!1)}),["capture","download"].forEach(function(t){L[t]=new N(t,4,!1,t,null,!1,!1)}),["cols","rows","size","span"].forEach(function(t){L[t]=new N(t,6,!1,t,null,!1,!1)}),["rowSpan","start"].forEach(function(t){L[t]=new N(t,5,!1,t.toLowerCase(),null,!1,!1)});var q=/[\-:]([a-z])/g;function oe(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var n=t.replace(q,oe);L[n]=new N(n,1,!1,t,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var n=t.replace(q,oe);L[n]=new N(n,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(t){var n=t.replace(q,oe);L[n]=new N(n,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(t){L[t]=new N(t,1,!1,t.toLowerCase(),null,!1,!1)}),L.xlinkHref=new N("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(t){L[t]=new N(t,1,!1,t.toLowerCase(),null,!0,!0)});var Y={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},st=["Webkit","ms","Moz","O"];Object.keys(Y).forEach(function(t){st.forEach(function(n){n=n+t.charAt(0).toUpperCase()+t.substring(1),Y[n]=Y[t]})});var J=/["'&<>]/;function Z(t){if(typeof t=="boolean"||typeof t=="number")return""+t;t=""+t;var n=J.exec(t);if(n){var o="",i,m=0;for(i=n.index;i<t.length;i++){switch(t.charCodeAt(i)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 39:n="&#x27;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}m!==i&&(o+=t.substring(m,i)),m=i+1,o+=n}t=m!==i?o+t.substring(m,i):o}return t}var Cn=/([A-Z])/g,it=/^ms-/,at=Array.isArray,At=S("<script>"),ae=S("<\/script>"),Rn=S('<script src="'),Bt=S('<script type="module" src="'),Nt=S('" async=""><\/script>'),En=/(<\/|<)(s)(cript)/gi;function jn(t,n,o,i){return""+n+(o==="s"?"\\u0073":"\\u0053")+i}function ut(t,n,o,i,m){t=t===void 0?"":t,n=n===void 0?At:S('<script nonce="'+Z(n)+'">');var d=[];if(o!==void 0&&d.push(n,b((""+o).replace(En,jn)),ae),i!==void 0)for(o=0;o<i.length;o++)d.push(Rn,b(Z(i[o])),Nt);if(m!==void 0)for(i=0;i<m.length;i++)d.push(Bt,b(Z(m[i])),Nt);return{bootstrapChunks:d,startInlineScript:n,placeholderPrefix:S(t+"P:"),segmentPrefix:S(t+"S:"),boundaryPrefix:t+"B:",idPrefix:t,nextSuspenseID:0,sentCompleteSegmentFunction:!1,sentCompleteBoundaryFunction:!1,sentClientRenderFunction:!1}}function ue(t,n){return{insertionMode:t,selectedValue:n}}function Ht(t){return ue(t==="http://www.w3.org/2000/svg"?2:t==="http://www.w3.org/1998/Math/MathML"?3:0,null)}function Pe(t,n,o){switch(n){case"select":return ue(1,o.value!=null?o.value:o.defaultValue);case"svg":return ue(2,null);case"math":return ue(3,null);case"foreignObject":return ue(1,null);case"table":return ue(4,null);case"thead":case"tbody":case"tfoot":return ue(5,null);case"colgroup":return ue(7,null);case"tr":return ue(6,null)}return 4<=t.insertionMode||t.insertionMode===0?ue(1,null):t}var ct=S("<!-- -->");function ft(t,n,o,i){return n===""?i:(i&&t.push(ct),t.push(b(Z(n))),!0)}var dt=new Map,Lt=S(' style="'),pt=S(":"),Ut=S(";");function ht(t,n,o){if(typeof o!="object")throw Error(c(62));n=!0;for(var i in o)if(H.call(o,i)){var m=o[i];if(m!=null&&typeof m!="boolean"&&m!==""){if(i.indexOf("--")===0){var d=b(Z(i));m=b(Z((""+m).trim()))}else{d=i;var g=dt.get(d);g!==void 0||(g=S(Z(d.replace(Cn,"-$1").toLowerCase().replace(it,"-ms-"))),dt.set(d,g)),d=g,m=typeof m=="number"?m===0||H.call(Y,i)?b(""+m):b(m+"px"):b(Z((""+m).trim()))}n?(n=!1,t.push(Lt,d,pt,m)):t.push(Ut,d,pt,m)}}n||t.push(xe)}var de=S(" "),we=S('="'),xe=S('"'),mt=S('=""');function K(t,n,o,i){switch(o){case"style":ht(t,n,i);return;case"defaultValue":case"defaultChecked":case"innerHTML":case"suppressContentEditableWarning":case"suppressHydrationWarning":return}if(!(2<o.length)||o[0]!=="o"&&o[0]!=="O"||o[1]!=="n"&&o[1]!=="N"){if(n=L.hasOwnProperty(o)?L[o]:null,n!==null){switch(typeof i){case"function":case"symbol":return;case"boolean":if(!n.acceptsBooleans)return}switch(o=b(n.attributeName),n.type){case 3:i&&t.push(de,o,mt);break;case 4:i===!0?t.push(de,o,mt):i!==!1&&t.push(de,o,we,b(Z(i)),xe);break;case 5:isNaN(i)||t.push(de,o,we,b(Z(i)),xe);break;case 6:!isNaN(i)&&1<=i&&t.push(de,o,we,b(Z(i)),xe);break;default:n.sanitizeURL&&(i=""+i),t.push(de,o,we,b(Z(i)),xe)}}else if(re(o)){switch(typeof i){case"function":case"symbol":return;case"boolean":if(n=o.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-")return}t.push(de,b(o),we,b(Z(i)),xe)}}}var ge=S(">"),zt=S("/>");function We(t,n,o){if(n!=null){if(o!=null)throw Error(c(60));if(typeof n!="object"||!("__html"in n))throw Error(c(61));n=n.__html,n!=null&&t.push(b(""+n))}}function Tn(t){var n="";return s.Children.forEach(t,function(o){o!=null&&(n+=o)}),n}var Ge=S(' selected=""');function _e(t,n,o,i){t.push(Q(o));var m=o=null,d;for(d in n)if(H.call(n,d)){var g=n[d];if(g!=null)switch(d){case"children":o=g;break;case"dangerouslySetInnerHTML":m=g;break;default:K(t,i,d,g)}}return t.push(ge),We(t,m,o),typeof o=="string"?(t.push(b(Z(o))),null):o}var qe=S(`
`),Vt=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,ye=new Map;function Q(t){var n=ye.get(t);if(n===void 0){if(!Vt.test(t))throw Error(c(65,t));n=S("<"+t),ye.set(t,n)}return n}var Ot=S("<!DOCTYPE html>");function $t(t,n,o,i,m){switch(n){case"select":t.push(Q("select"));var d=null,g=null;for(_ in o)if(H.call(o,_)){var k=o[_];if(k!=null)switch(_){case"children":d=k;break;case"dangerouslySetInnerHTML":g=k;break;case"defaultValue":case"value":break;default:K(t,i,_,k)}}return t.push(ge),We(t,g,d),d;case"option":g=m.selectedValue,t.push(Q("option"));var F=k=null,A=null,_=null;for(d in o)if(H.call(o,d)){var O=o[d];if(O!=null)switch(d){case"children":k=O;break;case"selected":A=O;break;case"dangerouslySetInnerHTML":_=O;break;case"value":F=O;default:K(t,i,d,O)}}if(g!=null)if(o=F!==null?""+F:Tn(k),at(g)){for(i=0;i<g.length;i++)if(""+g[i]===o){t.push(Ge);break}}else""+g===o&&t.push(Ge);else A&&t.push(Ge);return t.push(ge),We(t,_,k),k;case"textarea":t.push(Q("textarea")),_=g=d=null;for(k in o)if(H.call(o,k)&&(F=o[k],F!=null))switch(k){case"children":_=F;break;case"value":d=F;break;case"defaultValue":g=F;break;case"dangerouslySetInnerHTML":throw Error(c(91));default:K(t,i,k,F)}if(d===null&&g!==null&&(d=g),t.push(ge),_!=null){if(d!=null)throw Error(c(92));if(at(_)&&1<_.length)throw Error(c(93));d=""+_}return typeof d=="string"&&d[0]===`
`&&t.push(qe),d!==null&&t.push(b(Z(""+d))),null;case"input":t.push(Q("input")),F=_=k=d=null;for(g in o)if(H.call(o,g)&&(A=o[g],A!=null))switch(g){case"children":case"dangerouslySetInnerHTML":throw Error(c(399,"input"));case"defaultChecked":F=A;break;case"defaultValue":k=A;break;case"checked":_=A;break;case"value":d=A;break;default:K(t,i,g,A)}return _!==null?K(t,i,"checked",_):F!==null&&K(t,i,"checked",F),d!==null?K(t,i,"value",d):k!==null&&K(t,i,"value",k),t.push(zt),null;case"menuitem":t.push(Q("menuitem"));for(var ie in o)if(H.call(o,ie)&&(d=o[ie],d!=null))switch(ie){case"children":case"dangerouslySetInnerHTML":throw Error(c(400));default:K(t,i,ie,d)}return t.push(ge),null;case"title":t.push(Q("title")),d=null;for(O in o)if(H.call(o,O)&&(g=o[O],g!=null))switch(O){case"children":d=g;break;case"dangerouslySetInnerHTML":throw Error(c(434));default:K(t,i,O,g)}return t.push(ge),d;case"listing":case"pre":t.push(Q(n)),g=d=null;for(F in o)if(H.call(o,F)&&(k=o[F],k!=null))switch(F){case"children":d=k;break;case"dangerouslySetInnerHTML":g=k;break;default:K(t,i,F,k)}if(t.push(ge),g!=null){if(d!=null)throw Error(c(60));if(typeof g!="object"||!("__html"in g))throw Error(c(61));o=g.__html,o!=null&&(typeof o=="string"&&0<o.length&&o[0]===`
`?t.push(qe,b(o)):t.push(b(""+o)))}return typeof d=="string"&&d[0]===`
`&&t.push(qe),d;case"area":case"base":case"br":case"col":case"embed":case"hr":case"img":case"keygen":case"link":case"meta":case"param":case"source":case"track":case"wbr":t.push(Q(n));for(var me in o)if(H.call(o,me)&&(d=o[me],d!=null))switch(me){case"children":case"dangerouslySetInnerHTML":throw Error(c(399,n));default:K(t,i,me,d)}return t.push(zt),null;case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return _e(t,o,n,i);case"html":return m.insertionMode===0&&t.push(Ot),_e(t,o,n,i);default:if(n.indexOf("-")===-1&&typeof o.is!="string")return _e(t,o,n,i);t.push(Q(n)),g=d=null;for(A in o)if(H.call(o,A)&&(k=o[A],k!=null))switch(A){case"children":d=k;break;case"dangerouslySetInnerHTML":g=k;break;case"style":ht(t,i,k);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":break;default:re(A)&&typeof k!="function"&&typeof k!="symbol"&&t.push(de,b(A),we,b(Z(k)),xe)}return t.push(ge),We(t,g,d),d}}var Wt=S("</"),Gt=S(">"),Ze=S('<template id="'),qt=S('"></template>'),Zt=S("<!--$-->"),Mn=S('<!--$?--><template id="'),vt=S('"></template>'),Xe=S("<!--$!-->"),Fn=S("<!--/$-->"),In=S("<template"),Pn=S('"'),_n=S(' data-dgst="');S(' data-msg="'),S(' data-stck="');var Dn=S("></template>");function ce(t,n,o){if(p(t,Mn),o===null)throw Error(c(395));return p(t,o),w(t,vt)}var xt=S('<div hidden id="'),Ye=S('">'),z=S("</div>"),De=S('<svg aria-hidden="true" style="display:none" id="'),Ke=S('">'),Ae=S("</svg>"),Se=S('<math aria-hidden="true" style="display:none" id="'),Je=S('">'),ke=S("</math>"),Xt=S('<table hidden id="'),gt=S('">'),yt=S("</table>"),Yt=S('<table hidden><tbody id="'),Kt=S('">'),Jt=S("</tbody></table>"),An=S('<table hidden><tr id="'),Bn=S('">'),Qe=S("</tr></table>"),Qt=S('<table hidden><colgroup id="'),et=S('">'),St=S("</colgroup></table>");function Nn(t,n,o,i){switch(o.insertionMode){case 0:case 1:return p(t,xt),p(t,n.segmentPrefix),p(t,b(i.toString(16))),w(t,Ye);case 2:return p(t,De),p(t,n.segmentPrefix),p(t,b(i.toString(16))),w(t,Ke);case 3:return p(t,Se),p(t,n.segmentPrefix),p(t,b(i.toString(16))),w(t,Je);case 4:return p(t,Xt),p(t,n.segmentPrefix),p(t,b(i.toString(16))),w(t,gt);case 5:return p(t,Yt),p(t,n.segmentPrefix),p(t,b(i.toString(16))),w(t,Kt);case 6:return p(t,An),p(t,n.segmentPrefix),p(t,b(i.toString(16))),w(t,Bn);case 7:return p(t,Qt),p(t,n.segmentPrefix),p(t,b(i.toString(16))),w(t,et);default:throw Error(c(397))}}function Be(t,n){switch(n.insertionMode){case 0:case 1:return w(t,z);case 2:return w(t,Ae);case 3:return w(t,ke);case 4:return w(t,yt);case 5:return w(t,Jt);case 6:return w(t,Qe);case 7:return w(t,St);default:throw Error(c(397))}}var Hn=S('function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'),wt=S('$RS("'),tt=S('","'),Ne=S('")<\/script>'),nt=S('function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("'),en=S('$RC("'),tn=S('","'),nn=S('")<\/script>'),kt=S('function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX("'),ee=S('$RX("'),rn=S('"'),bt=S(")<\/script>"),Ct=S(","),on=/[<\u2028\u2029]/g;function je(t){return JSON.stringify(t).replace(on,function(n){switch(n){case"<":return"\\u003c";case"\u2028":return"\\u2028";case"\u2029":return"\\u2029";default:throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React")}})}var Te=Object.assign,ln=Symbol.for("react.element"),He=Symbol.for("react.portal"),Le=Symbol.for("react.fragment"),Rt=Symbol.for("react.strict_mode"),Et=Symbol.for("react.profiler"),jt=Symbol.for("react.provider"),rt=Symbol.for("react.context"),sn=Symbol.for("react.forward_ref"),an=Symbol.for("react.suspense"),Tt=Symbol.for("react.suspense_list"),e=Symbol.for("react.memo"),r=Symbol.for("react.lazy"),l=Symbol.for("react.scope"),a=Symbol.for("react.debug_trace_mode"),v=Symbol.for("react.legacy_hidden"),f=Symbol.for("react.default_value"),x=Symbol.iterator;function C(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Le:return"Fragment";case He:return"Portal";case Et:return"Profiler";case Rt:return"StrictMode";case an:return"Suspense";case Tt:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case rt:return(t.displayName||"Context")+".Consumer";case jt:return(t._context.displayName||"Context")+".Provider";case sn:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case e:return n=t.displayName||null,n!==null?n:C(t.type)||"Memo";case r:n=t._payload,t=t._init;try{return C(t(n))}catch{}}return null}var M={};function I(t,n){if(t=t.contextTypes,!t)return M;var o={},i;for(i in t)o[i]=n[i];return o}var P=null;function $(t,n){if(t!==n){t.context._currentValue=t.parentValue,t=t.parent;var o=n.parent;if(t===null){if(o!==null)throw Error(c(401))}else{if(o===null)throw Error(c(401));$(t,o)}n.context._currentValue=n.value}}function pe(t){t.context._currentValue=t.parentValue,t=t.parent,t!==null&&pe(t)}function he(t){var n=t.parent;n!==null&&he(n),t.context._currentValue=t.value}function le(t,n){if(t.context._currentValue=t.parentValue,t=t.parent,t===null)throw Error(c(402));t.depth===n.depth?$(t,n):le(t,n)}function Ue(t,n){var o=n.parent;if(o===null)throw Error(c(402));t.depth===o.depth?$(t,o):Ue(t,o),n.context._currentValue=n.value}function be(t){var n=P;n!==t&&(n===null?he(t):t===null?pe(n):n.depth===t.depth?$(n,t):n.depth>t.depth?le(n,t):Ue(n,t),P=t)}var Mt={isMounted:function(){return!1},enqueueSetState:function(t,n){t=t._reactInternals,t.queue!==null&&t.queue.push(n)},enqueueReplaceState:function(t,n){t=t._reactInternals,t.replace=!0,t.queue=[n]},enqueueForceUpdate:function(){}};function ze(t,n,o,i){var m=t.state!==void 0?t.state:null;t.updater=Mt,t.props=o,t.state=m;var d={queue:[],replace:!1};t._reactInternals=d;var g=n.contextType;if(t.context=typeof g=="object"&&g!==null?g._currentValue:i,g=n.getDerivedStateFromProps,typeof g=="function"&&(g=g(o,m),m=g==null?m:Te({},m,g),t.state=m),typeof n.getDerivedStateFromProps!="function"&&typeof t.getSnapshotBeforeUpdate!="function"&&(typeof t.UNSAFE_componentWillMount=="function"||typeof t.componentWillMount=="function"))if(n=t.state,typeof t.componentWillMount=="function"&&t.componentWillMount(),typeof t.UNSAFE_componentWillMount=="function"&&t.UNSAFE_componentWillMount(),n!==t.state&&Mt.enqueueReplaceState(t,t.state,null),d.queue!==null&&0<d.queue.length)if(n=d.queue,g=d.replace,d.queue=null,d.replace=!1,g&&n.length===1)t.state=n[0];else{for(d=g?n[0]:t.state,m=!0,g=g?1:0;g<n.length;g++){var k=n[g];k=typeof k=="function"?k.call(t,d,o,i):k,k!=null&&(m?(m=!1,d=Te({},d,k)):Te(d,k))}t.state=d}else d.queue=null}var un={id:1,overflow:""};function Me(t,n,o){var i=t.id;t=t.overflow;var m=32-cn(i)-1;i&=~(1<<m),o+=1;var d=32-cn(n)+m;if(30<d){var g=m-m%5;return d=(i&(1<<g)-1).toString(32),i>>=g,m-=g,{id:1<<32-cn(n)+m|o<<m|i,overflow:d+t}}return{id:1<<d|o<<m|i,overflow:t}}var cn=Math.clz32?Math.clz32:Nr,Ar=Math.log,Br=Math.LN2;function Nr(t){return t>>>=0,t===0?32:31-(Ar(t)/Br|0)|0}function Hr(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var Lr=typeof Object.is=="function"?Object.is:Hr,Ce=null,Ln=null,fn=null,V=null,Ft=!1,dn=!1,It=0,Fe=null,pn=0;function Ve(){if(Ce===null)throw Error(c(321));return Ce}function or(){if(0<pn)throw Error(c(312));return{memoizedState:null,queue:null,next:null}}function Un(){return V===null?fn===null?(Ft=!1,fn=V=or()):(Ft=!0,V=fn):V.next===null?(Ft=!1,V=V.next=or()):(Ft=!0,V=V.next),V}function zn(){Ln=Ce=null,dn=!1,fn=null,pn=0,V=Fe=null}function lr(t,n){return typeof n=="function"?n(t):n}function sr(t,n,o){if(Ce=Ve(),V=Un(),Ft){var i=V.queue;if(n=i.dispatch,Fe!==null&&(o=Fe.get(i),o!==void 0)){Fe.delete(i),i=V.memoizedState;do i=t(i,o.action),o=o.next;while(o!==null);return V.memoizedState=i,[i,n]}return[V.memoizedState,n]}return t=t===lr?typeof n=="function"?n():n:o!==void 0?o(n):n,V.memoizedState=t,t=V.queue={last:null,dispatch:null},t=t.dispatch=Ur.bind(null,Ce,t),[V.memoizedState,t]}function ir(t,n){if(Ce=Ve(),V=Un(),n=n===void 0?null:n,V!==null){var o=V.memoizedState;if(o!==null&&n!==null){var i=o[1];e:if(i===null)i=!1;else{for(var m=0;m<i.length&&m<n.length;m++)if(!Lr(n[m],i[m])){i=!1;break e}i=!0}if(i)return o[0]}}return t=t(),V.memoizedState=[t,n],t}function Ur(t,n,o){if(25<=pn)throw Error(c(301));if(t===Ce)if(dn=!0,t={action:o,next:null},Fe===null&&(Fe=new Map),o=Fe.get(n),o===void 0)Fe.set(n,t);else{for(n=o;n.next!==null;)n=n.next;n.next=t}}function zr(){throw Error(c(394))}function hn(){}var ar={readContext:function(t){return t._currentValue},useContext:function(t){return Ve(),t._currentValue},useMemo:ir,useReducer:sr,useRef:function(t){Ce=Ve(),V=Un();var n=V.memoizedState;return n===null?(t={current:t},V.memoizedState=t):n},useState:function(t){return sr(lr,t)},useInsertionEffect:hn,useLayoutEffect:function(){},useCallback:function(t,n){return ir(function(){return t},n)},useImperativeHandle:hn,useEffect:hn,useDebugValue:hn,useDeferredValue:function(t){return Ve(),t},useTransition:function(){return Ve(),[!1,zr]},useId:function(){var t=Ln.treeContext,n=t.overflow;t=t.id,t=(t&~(1<<32-cn(t)-1)).toString(32)+n;var o=mn;if(o===null)throw Error(c(404));return n=It++,t=":"+o.idPrefix+"R"+t,0<n&&(t+="H"+n.toString(32)),t+":"},useMutableSource:function(t,n){return Ve(),n(t._source)},useSyncExternalStore:function(t,n,o){if(o===void 0)throw Error(c(407));return o()}},mn=null,Vn=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;function Vr(t){return console.error(t),null}function Pt(){}function Or(t,n,o,i,m,d,g,k,F){var A=[],_=new Set;return n={destination:null,responseState:n,progressiveChunkSize:i===void 0?12800:i,status:0,fatalError:null,nextSegmentId:0,allPendingTasks:0,pendingRootTasks:0,completedRootSegment:null,abortableTasks:_,pingedTasks:A,clientRenderedBoundaries:[],completedBoundaries:[],partialBoundaries:[],onError:m===void 0?Vr:m,onAllReady:d===void 0?Pt:d,onShellReady:g===void 0?Pt:g,onShellError:k===void 0?Pt:k,onFatalError:F===void 0?Pt:F},o=vn(n,0,null,o,!1,!1),o.parentFlushed=!0,t=On(n,t,null,o,_,M,null,un),A.push(t),n}function On(t,n,o,i,m,d,g,k){t.allPendingTasks++,o===null?t.pendingRootTasks++:o.pendingTasks++;var F={node:n,ping:function(){var A=t.pingedTasks;A.push(F),A.length===1&&mr(t)},blockedBoundary:o,blockedSegment:i,abortSet:m,legacyContext:d,context:g,treeContext:k};return m.add(F),F}function vn(t,n,o,i,m,d){return{status:0,id:-1,index:n,parentFlushed:!1,chunks:[],children:[],formatContext:i,boundary:o,lastPushedText:m,textEmbedded:d}}function _t(t,n){if(t=t.onError(n),t!=null&&typeof t!="string")throw Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "'+typeof t+'" instead');return t}function xn(t,n){var o=t.onShellError;o(n),o=t.onFatalError,o(n),t.destination!==null?(t.status=2,U(t.destination,n)):(t.status=1,t.fatalError=n)}function ur(t,n,o,i,m){for(Ce={},Ln=n,It=0,t=o(i,m);dn;)dn=!1,It=0,pn+=1,V=null,t=o(i,m);return zn(),t}function cr(t,n,o,i){var m=o.render(),d=i.childContextTypes;if(d!=null){var g=n.legacyContext;if(typeof o.getChildContext!="function")i=g;else{o=o.getChildContext();for(var k in o)if(!(k in d))throw Error(c(108,C(i)||"Unknown",k));i=Te({},g,o)}n.legacyContext=i,se(t,n,m),n.legacyContext=g}else se(t,n,m)}function fr(t,n){if(t&&t.defaultProps){n=Te({},n),t=t.defaultProps;for(var o in t)n[o]===void 0&&(n[o]=t[o]);return n}return n}function $n(t,n,o,i,m){if(typeof o=="function")if(o.prototype&&o.prototype.isReactComponent){m=I(o,n.legacyContext);var d=o.contextType;d=new o(i,typeof d=="object"&&d!==null?d._currentValue:m),ze(d,o,i,m),cr(t,n,d,o)}else{d=I(o,n.legacyContext),m=ur(t,n,o,i,d);var g=It!==0;if(typeof m=="object"&&m!==null&&typeof m.render=="function"&&m.$$typeof===void 0)ze(m,o,i,d),cr(t,n,m,o);else if(g){i=n.treeContext,n.treeContext=Me(i,1,0);try{se(t,n,m)}finally{n.treeContext=i}}else se(t,n,m)}else if(typeof o=="string"){switch(m=n.blockedSegment,d=$t(m.chunks,o,i,t.responseState,m.formatContext),m.lastPushedText=!1,g=m.formatContext,m.formatContext=Pe(g,o,i),Wn(t,n,d),m.formatContext=g,o){case"area":case"base":case"br":case"col":case"embed":case"hr":case"img":case"input":case"keygen":case"link":case"meta":case"param":case"source":case"track":case"wbr":break;default:m.chunks.push(Wt,b(o),Gt)}m.lastPushedText=!1}else{switch(o){case v:case a:case Rt:case Et:case Le:se(t,n,i.children);return;case Tt:se(t,n,i.children);return;case l:throw Error(c(343));case an:e:{o=n.blockedBoundary,m=n.blockedSegment,d=i.fallback,i=i.children,g=new Set;var k={id:null,rootSegmentID:-1,parentFlushed:!1,pendingTasks:0,forceClientRender:!1,completedSegments:[],byteSize:0,fallbackAbortableTasks:g,errorDigest:null},F=vn(t,m.chunks.length,k,m.formatContext,!1,!1);m.children.push(F),m.lastPushedText=!1;var A=vn(t,0,null,m.formatContext,!1,!1);A.parentFlushed=!0,n.blockedBoundary=k,n.blockedSegment=A;try{if(Wn(t,n,i),A.lastPushedText&&A.textEmbedded&&A.chunks.push(ct),A.status=1,gn(k,A),k.pendingTasks===0)break e}catch(_){A.status=4,k.forceClientRender=!0,k.errorDigest=_t(t,_)}finally{n.blockedBoundary=o,n.blockedSegment=m}n=On(t,d,o,F,g,n.legacyContext,n.context,n.treeContext),t.pingedTasks.push(n)}return}if(typeof o=="object"&&o!==null)switch(o.$$typeof){case sn:if(i=ur(t,n,o.render,i,m),It!==0){o=n.treeContext,n.treeContext=Me(o,1,0);try{se(t,n,i)}finally{n.treeContext=o}}else se(t,n,i);return;case e:o=o.type,i=fr(o,i),$n(t,n,o,i,m);return;case jt:if(m=i.children,o=o._context,i=i.value,d=o._currentValue,o._currentValue=i,g=P,P=i={parent:g,depth:g===null?0:g.depth+1,context:o,parentValue:d,value:i},n.context=i,se(t,n,m),t=P,t===null)throw Error(c(403));i=t.parentValue,t.context._currentValue=i===f?t.context._defaultValue:i,t=P=t.parent,n.context=t;return;case rt:i=i.children,i=i(o._currentValue),se(t,n,i);return;case r:m=o._init,o=m(o._payload),i=fr(o,i),$n(t,n,o,i,void 0);return}throw Error(c(130,o==null?o:typeof o,""))}}function se(t,n,o){if(n.node=o,typeof o=="object"&&o!==null){switch(o.$$typeof){case ln:$n(t,n,o.type,o.props,o.ref);return;case He:throw Error(c(257));case r:var i=o._init;o=i(o._payload),se(t,n,o);return}if(at(o)){dr(t,n,o);return}if(o===null||typeof o!="object"?i=null:(i=x&&o[x]||o["@@iterator"],i=typeof i=="function"?i:null),i&&(i=i.call(o))){if(o=i.next(),!o.done){var m=[];do m.push(o.value),o=i.next();while(!o.done);dr(t,n,m)}return}throw t=Object.prototype.toString.call(o),Error(c(31,t==="[object Object]"?"object with keys {"+Object.keys(o).join(", ")+"}":t))}typeof o=="string"?(i=n.blockedSegment,i.lastPushedText=ft(n.blockedSegment.chunks,o,t.responseState,i.lastPushedText)):typeof o=="number"&&(i=n.blockedSegment,i.lastPushedText=ft(n.blockedSegment.chunks,""+o,t.responseState,i.lastPushedText))}function dr(t,n,o){for(var i=o.length,m=0;m<i;m++){var d=n.treeContext;n.treeContext=Me(d,i,m);try{Wn(t,n,o[m])}finally{n.treeContext=d}}}function Wn(t,n,o){var i=n.blockedSegment.formatContext,m=n.legacyContext,d=n.context;try{return se(t,n,o)}catch(F){if(zn(),typeof F=="object"&&F!==null&&typeof F.then=="function"){o=F;var g=n.blockedSegment,k=vn(t,g.chunks.length,null,g.formatContext,g.lastPushedText,!0);g.children.push(k),g.lastPushedText=!1,t=On(t,n.node,n.blockedBoundary,k,n.abortSet,n.legacyContext,n.context,n.treeContext).ping,o.then(t,t),n.blockedSegment.formatContext=i,n.legacyContext=m,n.context=d,be(d)}else throw n.blockedSegment.formatContext=i,n.legacyContext=m,n.context=d,be(d),F}}function $r(t){var n=t.blockedBoundary;t=t.blockedSegment,t.status=3,hr(this,n,t)}function pr(t,n,o){var i=t.blockedBoundary;t.blockedSegment.status=3,i===null?(n.allPendingTasks--,n.status!==2&&(n.status=2,n.destination!==null&&n.destination.close())):(i.pendingTasks--,i.forceClientRender||(i.forceClientRender=!0,t=o===void 0?Error(c(432)):o,i.errorDigest=n.onError(t),i.parentFlushed&&n.clientRenderedBoundaries.push(i)),i.fallbackAbortableTasks.forEach(function(m){return pr(m,n,o)}),i.fallbackAbortableTasks.clear(),n.allPendingTasks--,n.allPendingTasks===0&&(i=n.onAllReady,i()))}function gn(t,n){if(n.chunks.length===0&&n.children.length===1&&n.children[0].boundary===null){var o=n.children[0];o.id=n.id,o.parentFlushed=!0,o.status===1&&gn(t,o)}else t.completedSegments.push(n)}function hr(t,n,o){if(n===null){if(o.parentFlushed){if(t.completedRootSegment!==null)throw Error(c(389));t.completedRootSegment=o}t.pendingRootTasks--,t.pendingRootTasks===0&&(t.onShellError=Pt,n=t.onShellReady,n())}else n.pendingTasks--,n.forceClientRender||(n.pendingTasks===0?(o.parentFlushed&&o.status===1&&gn(n,o),n.parentFlushed&&t.completedBoundaries.push(n),n.fallbackAbortableTasks.forEach($r,t),n.fallbackAbortableTasks.clear()):o.parentFlushed&&o.status===1&&(gn(n,o),n.completedSegments.length===1&&n.parentFlushed&&t.partialBoundaries.push(n)));t.allPendingTasks--,t.allPendingTasks===0&&(t=t.onAllReady,t())}function mr(t){if(t.status!==2){var n=P,o=Vn.current;Vn.current=ar;var i=mn;mn=t.responseState;try{var m=t.pingedTasks,d;for(d=0;d<m.length;d++){var g=m[d],k=t,F=g.blockedSegment;if(F.status===0){be(g.context);try{se(k,g,g.node),F.lastPushedText&&F.textEmbedded&&F.chunks.push(ct),g.abortSet.delete(g),F.status=1,hr(k,g.blockedBoundary,F)}catch(ve){if(zn(),typeof ve=="object"&&ve!==null&&typeof ve.then=="function"){var A=g.ping;ve.then(A,A)}else{g.abortSet.delete(g),F.status=4;var _=g.blockedBoundary,O=ve,ie=_t(k,O);if(_===null?xn(k,O):(_.pendingTasks--,_.forceClientRender||(_.forceClientRender=!0,_.errorDigest=ie,_.parentFlushed&&k.clientRenderedBoundaries.push(_))),k.allPendingTasks--,k.allPendingTasks===0){var me=k.onAllReady;me()}}}finally{}}}m.splice(0,d),t.destination!==null&&Gn(t,t.destination)}catch(ve){_t(t,ve),xn(t,ve)}finally{mn=i,Vn.current=o,o===ar&&be(n)}}}function yn(t,n,o){switch(o.parentFlushed=!0,o.status){case 0:var i=o.id=t.nextSegmentId++;return o.lastPushedText=!1,o.textEmbedded=!1,t=t.responseState,p(n,Ze),p(n,t.placeholderPrefix),t=b(i.toString(16)),p(n,t),w(n,qt);case 1:o.status=2;var m=!0;i=o.chunks;var d=0;o=o.children;for(var g=0;g<o.length;g++){for(m=o[g];d<m.index;d++)p(n,i[d]);m=Sn(t,n,m)}for(;d<i.length-1;d++)p(n,i[d]);return d<i.length&&(m=w(n,i[d])),m;default:throw Error(c(390))}}function Sn(t,n,o){var i=o.boundary;if(i===null)return yn(t,n,o);if(i.parentFlushed=!0,i.forceClientRender)i=i.errorDigest,w(n,Xe),p(n,In),i&&(p(n,_n),p(n,b(Z(i))),p(n,Pn)),w(n,Dn),yn(t,n,o);else if(0<i.pendingTasks){i.rootSegmentID=t.nextSegmentId++,0<i.completedSegments.length&&t.partialBoundaries.push(i);var m=t.responseState,d=m.nextSuspenseID++;m=S(m.boundaryPrefix+d.toString(16)),i=i.id=m,ce(n,t.responseState,i),yn(t,n,o)}else if(i.byteSize>t.progressiveChunkSize)i.rootSegmentID=t.nextSegmentId++,t.completedBoundaries.push(i),ce(n,t.responseState,i.id),yn(t,n,o);else{if(w(n,Zt),o=i.completedSegments,o.length!==1)throw Error(c(391));Sn(t,n,o[0])}return w(n,Fn)}function vr(t,n,o){return Nn(n,t.responseState,o.formatContext,o.id),Sn(t,n,o),Be(n,o.formatContext)}function xr(t,n,o){for(var i=o.completedSegments,m=0;m<i.length;m++)gr(t,n,o,i[m]);if(i.length=0,t=t.responseState,i=o.id,o=o.rootSegmentID,p(n,t.startInlineScript),t.sentCompleteBoundaryFunction?p(n,en):(t.sentCompleteBoundaryFunction=!0,p(n,nt)),i===null)throw Error(c(395));return o=b(o.toString(16)),p(n,i),p(n,tn),p(n,t.segmentPrefix),p(n,o),w(n,nn)}function gr(t,n,o,i){if(i.status===2)return!0;var m=i.id;if(m===-1){if((i.id=o.rootSegmentID)===-1)throw Error(c(392));return vr(t,n,i)}return vr(t,n,i),t=t.responseState,p(n,t.startInlineScript),t.sentCompleteSegmentFunction?p(n,wt):(t.sentCompleteSegmentFunction=!0,p(n,Hn)),p(n,t.segmentPrefix),m=b(m.toString(16)),p(n,m),p(n,tt),p(n,t.placeholderPrefix),p(n,m),w(n,Ne)}function Gn(t,n){h=new Uint8Array(512),y=0;try{var o=t.completedRootSegment;if(o!==null&&t.pendingRootTasks===0){Sn(t,n,o),t.completedRootSegment=null;var i=t.responseState.bootstrapChunks;for(o=0;o<i.length-1;o++)p(n,i[o]);o<i.length&&w(n,i[o])}var m=t.clientRenderedBoundaries,d;for(d=0;d<m.length;d++){var g=m[d];i=n;var k=t.responseState,F=g.id,A=g.errorDigest,_=g.errorMessage,O=g.errorComponentStack;if(p(i,k.startInlineScript),k.sentClientRenderFunction?p(i,ee):(k.sentClientRenderFunction=!0,p(i,kt)),F===null)throw Error(c(395));p(i,F),p(i,rn),(A||_||O)&&(p(i,Ct),p(i,b(je(A||"")))),(_||O)&&(p(i,Ct),p(i,b(je(_||"")))),O&&(p(i,Ct),p(i,b(je(O)))),w(i,bt)}m.splice(0,d);var ie=t.completedBoundaries;for(d=0;d<ie.length;d++)xr(t,n,ie[d]);ie.splice(0,d),T(n),h=new Uint8Array(512),y=0;var me=t.partialBoundaries;for(d=0;d<me.length;d++){var ve=me[d];e:{m=t,g=n;var wn=ve.completedSegments;for(k=0;k<wn.length;k++)if(!gr(m,g,ve,wn[k])){k++,wn.splice(0,k);var Sr=!1;break e}wn.splice(0,k),Sr=!0}if(!Sr){t.destination=null,d++,me.splice(0,d);return}}me.splice(0,d);var qn=t.completedBoundaries;for(d=0;d<qn.length;d++)xr(t,n,qn[d]);qn.splice(0,d)}finally{T(n),t.allPendingTasks===0&&t.pingedTasks.length===0&&t.clientRenderedBoundaries.length===0&&t.completedBoundaries.length===0&&n.close()}}function yr(t,n){try{var o=t.abortableTasks;o.forEach(function(i){return pr(i,t,n)}),o.clear(),t.destination!==null&&Gn(t,t.destination)}catch(i){_t(t,i),xn(t,i)}}return kn.renderToReadableStream=function(t,n){return new Promise(function(o,i){var m,d,g=new Promise(function(_,O){d=_,m=O}),k=Or(t,ut(n?n.identifierPrefix:void 0,n?n.nonce:void 0,n?n.bootstrapScriptContent:void 0,n?n.bootstrapScripts:void 0,n?n.bootstrapModules:void 0),Ht(n?n.namespaceURI:void 0),n?n.progressiveChunkSize:void 0,n?n.onError:void 0,d,function(){var _=new ReadableStream({type:"bytes",pull:function(O){if(k.status===1)k.status=2,U(O,k.fatalError);else if(k.status!==2&&k.destination===null){k.destination=O;try{Gn(k,O)}catch(ie){_t(k,ie),xn(k,ie)}}},cancel:function(){yr(k)}},{highWaterMark:0});_.allReady=g,o(_)},function(_){g.catch(function(){}),i(_)},m);if(n&&n.signal){var F=n.signal,A=function(){yr(k,F.reason),F.removeEventListener("abort",A)};F.addEventListener("abort",A)}mr(k)})},kn.version="18.3.1",kn}var Rr;function Ro(){if(Rr)return Ie;Rr=1;var s,c;return s=bo(),c=Co(),Ie.version=s.version,Ie.renderToString=s.renderToString,Ie.renderToStaticMarkup=s.renderToStaticMarkup,Ie.renderToNodeStream=s.renderToNodeStream,Ie.renderToStaticNodeStream=s.renderToStaticNodeStream,Ie.renderToReadableStream=c.renderToReadableStream,Ie}var Eo=Ro();const jo={position:"relative",overflow:"hidden",width:1920,height:1080,color:"#171310",background:"#f2eadc",fontFamily:'"Kaiti SC", "STKaiti", "Marker Felt", cursive'},D=(s,c,h=.16)=>Math.min(1,Math.max(0,(s-c)/h)),B=(s,c=40)=>({opacity:s,transform:`translateY(${Math.round((1-s)*c)}px)`}),W=({label:s,progress:c,children:h})=>u.jsxs("div",{style:jo,children:[u.jsx("i",{"data-capture-sentinel":"true",style:{position:"absolute",top:0,left:0,width:1,height:1,background:"#77f5ba"}}),u.jsx("div",{style:{position:"absolute",inset:0,opacity:.33,backgroundImage:"radial-gradient(rgba(23,19,16,.21) .7px, transparent .9px)",backgroundSize:"7px 7px"}}),u.jsx("div",{style:{position:"absolute",top:128,right:-120,width:640,height:78,transform:"rotate(-7deg)",background:"#ff6414",opacity:.17}}),u.jsxs("header",{style:{position:"relative",display:"flex",justifyContent:"space-between",padding:"72px 106px",color:"#171310",opacity:D(c,.04),font:'700 22px "Marker Felt", "Kaiti SC", cursive',letterSpacing:".08em"},children:[u.jsx("span",{children:s}),u.jsx("span",{children:"RECUT / REMOTION"})]}),h]}),ne=({children:s,progress:c,start:h=.14,width:y=1120})=>u.jsx("h1",{style:{position:"absolute",left:106,top:236,width:y,margin:0,fontSize:132,fontWeight:900,lineHeight:.9,letterSpacing:0,fontFamily:'"Arial Black", "Hiragino Sans GB", "PingFang SC", sans-serif',...B(D(c,h),52)},children:s}),nr=({children:s,progress:c,start:h=.62,left:y=108,top:p=610,width:w=720})=>u.jsx("p",{style:{position:"absolute",left:y,top:p,width:w,margin:0,color:"#3b3028",fontSize:36,lineHeight:1.28,fontFamily:'"Kaiti SC", "STKaiti", "Marker Felt", cursive',...B(D(c,h),28)},children:s}),To=({progress:s})=>u.jsxs(W,{label:"REMOTION / 01",progress:s,children:[u.jsxs(ne,{progress:s,start:-.1,children:["Video, built",u.jsx("br",{}),u.jsx("span",{style:{display:"inline-block",padding:"0 14px 6px",transform:"rotate(-1.5deg)",background:"linear-gradient(transparent 57%, #ff6414 57%, #ff6414 89%, transparent 89%)"},children:"like software."})]}),u.jsx(nr,{progress:s,children:"React components become an editable moving picture."})]}),Mo=({progress:s})=>u.jsxs(W,{label:"THE PREMISE",progress:s,children:[u.jsx("div",{style:{position:"absolute",top:232,left:0,right:0,textAlign:"center",fontFamily:'"Arial Black", "Hiragino Sans GB", sans-serif',fontSize:238,lineHeight:.8,letterSpacing:".04em",...B(D(s,.06),52)},children:"FRAME"}),u.jsx("div",{style:{position:"absolute",top:500,left:0,right:0,color:"#ff6414",textAlign:"center",fontSize:66,fontWeight:900,...B(D(s,.42),34)},children:"= React render()"}),u.jsxs("div",{style:{position:"absolute",left:260,right:260,top:650,borderTop:"3px solid #171310",paddingTop:24,display:"flex",justifyContent:"space-between",color:"#3b3028",fontSize:31,...B(D(s,.62),24)},children:[u.jsx("span",{children:"state in"}),u.jsx("span",{children:"pixels out"})]})]}),Fo=({progress:s})=>u.jsxs(W,{label:"TIME",progress:s,children:[u.jsxs(ne,{progress:s,width:700,children:["Seek anywhere.",u.jsx("br",{}),"Land exactly there."]}),u.jsxs("pre",{style:{position:"absolute",right:120,top:218,width:700,padding:52,margin:0,border:"2px solid #171310",color:"#1d1613",background:"#fff9ef",font:"600 30px/1.8 ui-monospace,Menlo,monospace",...B(D(s,.46),38)},children:[u.jsx("b",{style:{color:"#ff8c78"},children:"const"})," frame ="," ",u.jsx("b",{style:{color:"#ff6414"},children:"useCurrentFrame"}),"();",`

`,u.jsx("b",{style:{color:"#ff8c78"},children:"return"})," frame;"]})]}),Io=({progress:s})=>u.jsxs(W,{label:"COMPONENT",progress:s,children:[u.jsxs(ne,{progress:s,width:760,children:["A component",u.jsx("br",{}),"can be a shot."]}),u.jsxs("div",{style:{position:"absolute",right:160,top:282,width:500,height:368,border:"3px solid #ff6414",...B(D(s,.48),54)},children:[u.jsx("div",{style:{position:"absolute",left:42,top:42,color:"#ff6414",fontSize:66,fontWeight:800},children:"<Scene />"}),u.jsx("div",{style:{position:"absolute",right:42,bottom:42,color:"#171310",fontSize:38},children:"props → pixels"})]})]}),Po=({progress:s})=>u.jsxs(W,{label:"EDIT",progress:s,children:[u.jsxs(ne,{progress:s,children:["A cut is",u.jsx("br",{}),"a decision."]}),u.jsxs("div",{style:{position:"absolute",left:108,right:108,bottom:140,height:234,padding:32,opacity:D(s,.48),border:"2px solid #171310",background:"#fff9ef"},children:[u.jsx("div",{style:{height:42,width:"44%",background:"#ef7a3c"}}),u.jsx("div",{style:{height:42,width:"52%",margin:"20px 0 0 26%",background:"#ff6414"}}),u.jsx("div",{style:{position:"absolute",top:24,left:`${18+s*70}%`,width:5,height:192,background:"#171310"}})]})]}),_o=({progress:s})=>u.jsxs(W,{label:"COMPOSITION",progress:s,children:[u.jsxs(ne,{progress:s,children:["Small scenes",u.jsx("br",{}),"become a film."]}),u.jsx("div",{style:{position:"absolute",right:150,top:250,width:590,height:500,...B(D(s,.46),42)},children:u.jsx("div",{style:{width:"100%",height:"100%",border:"3px solid #ff6414",padding:34},children:u.jsx("div",{style:{width:"66%",height:"60%",border:"3px solid #171310",padding:28},children:u.jsx("div",{style:{width:"56%",height:"50%",border:"3px solid #ff6414"}})})})})]}),Do=({progress:s})=>u.jsxs(W,{label:"HTML SOURCE",progress:s,children:[u.jsx("div",{style:{position:"absolute",top:214,left:106,fontFamily:'"Arial Black", "Hiragino Sans GB", sans-serif',fontSize:220,lineHeight:.8,...B(D(s,.12),60)},children:"HTML"}),u.jsxs("div",{style:{position:"absolute",top:355,right:120,width:630,padding:"34px 0 34px 42px",borderLeft:"8px solid #ff6414",fontSize:64,lineHeight:1,...B(D(s,.34),38)},children:["is layout.",u.jsxs("div",{style:{position:"relative",display:"inline-block",marginTop:12},children:[u.jsx("i",{style:{position:"absolute",left:-12,right:-14,bottom:5,height:34,zIndex:0,background:"#ffd60a",transformOrigin:"left center",transform:`scaleX(${D(s,.54)}) rotate(-1deg)`}}),u.jsx("b",{style:{position:"relative",color:"#ff6414",zIndex:1},children:"Three"}),u.jsxs("span",{style:{position:"relative",zIndex:1},children:[" ","owns the frame."]})]})]}),u.jsx("div",{style:{position:"absolute",left:108,bottom:162,display:"flex",gap:28,...B(D(s,.6),24)},children:["type","layout","texture"].map((c,h)=>u.jsx("span",{style:{width:250,padding:"18px 0",borderTop:`3px solid ${h===2?"#ff6414":"#171310"}`,color:h===2?"#ff6414":"#171310",font:"700 30px ui-monospace, Menlo, monospace"},children:c},c))})]}),Ao=({progress:s})=>u.jsxs(W,{label:"HTML-IN-CANVAS",progress:s,children:[u.jsxs(ne,{progress:s,width:760,children:["Capture the",u.jsx("br",{}),"real layout."]}),u.jsxs("div",{style:{position:"absolute",right:132,top:258,width:570,height:408,border:"3px solid #ff6414",padding:38,...B(D(s,.5),42)},children:[u.jsx("div",{style:{font:"700 22px ui-monospace,Menlo,monospace",color:"#ff6414"},children:"HTML SUBTREE"}),u.jsx("div",{style:{position:"absolute",top:182,left:0,width:"100%",borderTop:"3px solid #ff6414"}}),u.jsx("div",{style:{position:"absolute",bottom:38,fontSize:42,fontWeight:800},children:"CanvasTexture"})]})]}),Bo=({progress:s})=>u.jsxs(W,{label:"TEXTURE",progress:s,children:[u.jsxs(ne,{progress:s,children:["HTML becomes",u.jsx("br",{}),"a material."]}),u.jsxs("div",{style:{position:"absolute",right:154,top:270,width:560,height:360,background:"#ef7a3c",...B(D(s,.48),50)},children:[u.jsx("div",{style:{position:"absolute",inset:22,border:"3px solid #171310"}}),u.jsx("div",{style:{position:"absolute",left:42,bottom:38,fontSize:52,fontWeight:800},children:"texture → mesh"})]})]}),No=({progress:s})=>u.jsxs(W,{label:"MEDIA",progress:s,children:[u.jsxs(ne,{progress:s,width:760,children:["Video is also",u.jsx("br",{}),"a texture."]}),u.jsxs("div",{style:{position:"absolute",right:120,top:194,width:720,height:500,background:"#fff2df",border:"3px solid #ff6414",...B(D(s,.48),38)},children:[u.jsx("div",{style:{position:"absolute",inset:34,background:"radial-gradient(circle at 70% 35%,#ff6414, #fff2df 62%)"}}),u.jsx("i",{style:{position:"absolute",left:320,top:190,width:0,height:0,borderTop:"54px solid transparent",borderBottom:"54px solid transparent",borderLeft:"88px solid #171310"}})]})]}),Ho=({progress:s})=>u.jsxs(W,{label:"FORMAT",progress:s,children:[u.jsxs(ne,{progress:s,children:["One scene.",u.jsx("br",{}),"Many canvases."]}),u.jsxs("div",{style:{position:"absolute",right:150,top:228,display:"flex",gap:36,alignItems:"end",...B(D(s,.5),38)},children:[u.jsx("b",{style:{width:260,height:146,border:"3px solid #ff6414"}}),u.jsx("b",{style:{width:150,height:266,border:"3px solid #171310"}}),u.jsx("b",{style:{width:212,height:212,border:"3px solid #ff6414"}})]})]}),Lo=({progress:s})=>u.jsxs(W,{label:"THREE",progress:s,children:[u.jsx("div",{style:{position:"absolute",top:238,left:0,right:0,textAlign:"center",color:"#ff6414",fontFamily:'"Arial Black", "Hiragino Sans GB", sans-serif',fontSize:236,lineHeight:.8,...B(D(s,.12),56)},children:"THREE"}),u.jsx("div",{style:{position:"absolute",top:514,left:280,right:280,padding:"30px 0",borderTop:"3px solid #171310",borderBottom:"3px solid #171310",textAlign:"center",fontSize:54,lineHeight:1.08,...B(D(s,.44),32)},children:"Everything visible lands in one GPU scene."}),u.jsxs("div",{style:{position:"absolute",left:406,right:406,bottom:188,display:"flex",justifyContent:"space-between",color:"#3b3028",font:"700 27px ui-monospace, Menlo, monospace",...B(D(s,.66),22)},children:[u.jsx("span",{children:"HTML"}),u.jsx("span",{children:"VIDEO"}),u.jsx("span",{children:"FX"})]})]}),Uo=({progress:s})=>u.jsxs(W,{label:"SPACE",progress:s,children:[u.jsxs(ne,{progress:s,width:800,children:["Then space",u.jsx("br",{}),"is editable."]}),u.jsxs("div",{style:{position:"absolute",right:150,top:250,width:580,height:390,perspective:700,...B(D(s,.48),42)},children:[u.jsx("div",{style:{position:"absolute",inset:0,border:"3px solid #ff6414",transform:"rotateY(-18deg)"}}),u.jsx("div",{style:{position:"absolute",inset:64,border:"3px solid #171310",transform:"rotateY(-18deg) translateZ(70px)"}})]})]}),zo=({progress:s})=>u.jsxs(W,{label:"CANVAS UI / MAGNIFY",progress:s,children:[u.jsx("div",{style:{position:"absolute",top:246,left:0,right:0,textAlign:"center",fontFamily:'"Arial Black", "Hiragino Sans GB", sans-serif',fontSize:204,letterSpacing:".03em",...B(D(s,.1),44)},children:"FOCUS"}),u.jsx("div",{style:{position:"absolute",left:166,top:605,color:"#ff6414",font:"800 29px ui-monospace, Menlo, monospace",...B(D(s,.42),24)},children:"[ scan live texture ]"}),u.jsx("div",{style:{position:"absolute",right:156,top:620,width:520,color:"#3b3028",borderTop:"3px solid #171310",paddingTop:20,fontSize:38,...B(D(s,.54),28)},children:"A scanner lens makes emphasis physical."}),u.jsx("div",{style:{position:"absolute",left:470,top:506,width:980,borderTop:"2px dashed #ff6414",...B(D(s,.3),18)}}),u.jsx("div",{style:{position:"absolute",left:1220,top:354,color:"#f7efe1",textShadow:"0 1px 0 #171310",font:"700 24px/1.55 ui-monospace, Menlo, monospace",letterSpacing:".08em",whiteSpace:"pre",...B(D(s,.32),18)},children:`X 0960
Y 0368
1.7X MAG
R 172PX  *`})]}),Vo=({progress:s})=>u.jsxs(W,{label:"CANVAS UI / GLITCH",progress:s,children:[u.jsx("div",{style:{position:"absolute",top:278,left:0,right:0,color:"#ff6414",textAlign:"center",fontFamily:'"Arial Black", "Hiragino Sans GB", sans-serif',fontSize:260,lineHeight:.75,...B(D(s,.16),64)},children:"CUT"}),u.jsxs("div",{style:{position:"absolute",left:184,right:184,top:590,display:"flex",justifyContent:"space-between",borderTop:"4px solid #171310",paddingTop:24,font:"700 31px ui-monospace, Menlo, monospace",...B(D(s,.56),26)},children:[u.jsx("span",{children:"tear"}),u.jsx("span",{style:{color:"#ff6414"},children:"split"}),u.jsx("span",{children:"settle"})]})]}),Oo=({progress:s})=>u.jsxs(W,{label:"CANVAS UI / GLASS",progress:s,children:[u.jsx("div",{style:{position:"absolute",left:120,top:270,fontFamily:'"Arial Black", "Hiragino Sans GB", sans-serif',fontSize:210,lineHeight:.8,...B(D(s,.12),56)},children:"GLASS"}),u.jsxs("div",{style:{position:"absolute",right:135,top:275,width:520,padding:36,border:"4px solid #ff6414",color:"#171310",fontSize:56,lineHeight:1.04,...B(D(s,.18),38)},children:["A lens is a",u.jsx("br",{}),"story choice."]}),u.jsx("div",{style:{position:"absolute",left:126,bottom:186,width:700,color:"#3b3028",fontSize:36,...B(D(s,.62),26)},children:"Refraction keeps the source visible, then makes one detail impossible to miss."})]}),$o=({progress:s})=>u.jsxs(W,{label:"CANVAS UI / CLOUDS",progress:s,children:[u.jsxs(ne,{progress:s,children:["Atmosphere is",u.jsx("br",{}),"also a node."]}),u.jsx(nr,{progress:s,children:"Procedural fog enters and leaves without a video asset."})]}),Wo=({progress:s})=>u.jsxs(W,{label:"EFFECT GRAPH",progress:s,children:[u.jsxs(ne,{progress:s,children:["Effects compose",u.jsx("br",{}),"like content."]}),u.jsxs("div",{style:{position:"absolute",right:140,top:330,display:"flex",alignItems:"center",gap:24,opacity:D(s,.5),font:"700 34px ui-monospace,Menlo,monospace"},children:[u.jsx("span",{children:"INPUT"}),u.jsx("b",{style:{width:140,height:4,background:"#ff6414"}}),u.jsx("span",{children:"PASS"}),u.jsx("b",{style:{width:140,height:4,background:"#ff6414"}}),u.jsx("span",{children:"OUTPUT"})]})]}),Go=({progress:s})=>u.jsxs(W,{label:"AI STATE",progress:s,children:[u.jsxs(ne,{progress:s,children:["Edit state,",u.jsx("br",{}),"not files."]}),u.jsxs("div",{style:{position:"absolute",right:130,top:292,width:620,padding:42,color:"#1d1613",border:"2px solid #171310",background:"#fff9ef",font:"600 28px/1.7 ui-monospace,Menlo,monospace",...B(D(s,.48),44)},children:['scene.title = "new";',`
`,"camera.zoom = 1.2;",`
`,"effect.amount = .8;"]})]}),qo=({progress:s})=>u.jsxs(W,{label:"PREVIEW",progress:s,children:[u.jsxs(ne,{progress:s,children:["See the real",u.jsx("br",{}),"composition now."]}),u.jsx("div",{style:{position:"absolute",right:120,top:210,width:720,height:460,border:"3px solid #ff6414",background:"#fff2df",...B(D(s,.48),38)},children:u.jsx("div",{style:{position:"absolute",left:34,right:34,bottom:34,height:8,background:"#171310"},children:u.jsx("div",{style:{width:`${s*100}%`,height:"100%",background:"#ff6414"}})})})]}),Zo=({progress:s})=>u.jsxs(W,{label:"RENDER",progress:s,children:[u.jsxs(ne,{progress:s,children:["Frame in.",u.jsx("br",{}),"Pixels out."]}),u.jsx("div",{style:{position:"absolute",right:154,top:254,display:"grid",gridTemplateColumns:"repeat(8, 44px)",gap:12,...B(D(s,.48),38)},children:Array.from({length:48},(c,h)=>u.jsx("i",{style:{width:44,height:44,background:h<Math.floor(s*48)?"#ff6414":"#e0d1be"}},h))})]}),Xo=({progress:s})=>u.jsxs(W,{label:"RUNTIME",progress:s,children:[u.jsx("div",{style:{position:"absolute",top:272,left:0,right:0,color:"#ff6414",textAlign:"center",fontFamily:'"Arial Black", "Hiragino Sans GB", sans-serif',fontSize:212,...B(D(s,.18),58)},children:"RUNTIME"}),u.jsxs("div",{style:{position:"absolute",top:556,left:0,right:0,textAlign:"center",fontSize:52,...B(D(s,.5),32)},children:["Not another editor.",u.jsx("br",{}),"A media composition runtime."]})]}),Yo=({progress:s})=>u.jsxs(W,{label:"RESULT",progress:s,children:[u.jsxs("div",{style:{position:"absolute",top:230,left:0,right:0,textAlign:"center",fontFamily:'"Arial Black", "Hiragino Sans GB", sans-serif',fontSize:160,lineHeight:.94,...B(D(s,.14),50)},children:["ONE GRAPH.",u.jsx("br",{}),u.jsx("span",{style:{color:"#ff6414"},children:"EVERY MEDIUM."})]}),u.jsx("div",{style:{position:"absolute",left:500,top:615,width:920,borderTop:"3px solid #171310",paddingTop:22,textAlign:"center",color:"#3b3028",fontSize:38,...B(D(s,.62),25)},children:"Remotion drives time. Three makes the frame."})]}),Ko=({progress:s})=>u.jsxs(W,{label:"RECUT",progress:s,children:[u.jsxs("div",{style:{position:"absolute",left:0,right:0,top:310,textAlign:"center",fontSize:150,lineHeight:.9,fontWeight:900,...B(D(s,.18),48)},children:["Build the scene.",u.jsx("br",{}),"Keep it editable."]}),u.jsx(nr,{progress:s,start:.66,left:560,top:640,width:800,children:"HTML, media and effects in one composition graph."})]}),Fr={opening:{component:To,effect:"vintage",transition:"clean"},react:{component:Mo,effect:"magnify",lens:[.5,.29],lensStart:.06,lensTravel:.36,transition:"clean"},frame:{component:Fo,effect:"crt",lens:[.72,.28],lensStart:.54,lensTravel:.2,transition:"clean"},component:{component:Io,effect:"clean",transition:"bend"},cut:{component:Po,effect:"clean",transition:"store-peel"},composition:{component:_o,effect:"clouds",transition:"glitch"},html:{component:Do,effect:"article-highlight",transition:"clean"},hic:{component:Ao,effect:"magnify",lens:[.72,.49],lensStart:.46,lensTravel:.22,transition:"magnify"},raster:{component:Bo,effect:"bubble",transition:"clean"},media:{component:No,effect:"clean",media:!0,transition:"bubble"},ratio:{component:Ho,effect:"magnify",media:!0,lens:[.72,.5],lensStart:.44,lensTravel:.2,transition:"clean"},three:{component:Lo,effect:"clouds",transition:"clean"},depth:{component:Uo,effect:"clean",media:!0,transition:"clean"},magnify:{component:zo,effect:"magnify",lens:[.5,.34],lensStart:.1,lensTravel:.42,transition:"clean"},glitch:{component:Vo,effect:"glitch",transition:"clean"},bubble:{component:Oo,effect:"glass",lens:[.79,.32],transition:"clean"},clouds:{component:$o,effect:"clouds",transition:"clean"},effects:{component:Wo,effect:"glitch",transition:"clean"},agent:{component:Go,effect:"bubble",transition:"clean"},preview:{component:qo,effect:"clean",media:!0,transition:"clean"},render:{component:Zo,effect:"clouds",media:!0,transition:"clean"},runtime:{component:Xo,effect:"magnify",lens:[.5,.46],lensStart:.18,lensTravel:.3,transition:"clean"},result:{component:Yo,effect:"bubble",transition:"clean"},end:{component:Ko,effect:"clouds",transition:"clean"}},rr=s=>Fr[s],Ir=({id:s,frame:c,fps:h,progress:y})=>{const p=Fr[s].component;return u.jsx(p,{frame:c,fps:h,progress:y})},Jo=3600,Er=["opening","react","frame","component","cut","composition","html","hic","raster","media","ratio","three","depth","magnify","glitch","bubble","clouds","effects","agent","preview","render","runtime","result","end"],$e=(s,c)=>{const h=Math.max(1,c*5),y=Math.min(Er.length-1,Math.floor(s/h));return{id:Er[y],progress:s%h/h}},Re=1920,Ee=1080,Qo=(s,c)=>{const h=$e(s,c);return Eo.renderToStaticMarkup(j.createElement(Ir,{frame:s,fps:c,id:h.id,progress:h.progress}))},el=(s,c)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${Re}" height="${Ee}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${Re}px;height:${Ee}px">${Qo(s,c)}</div></foreignObject></svg>`,tl=(s,c,h,y,p)=>{const w=performance.now(),T=new Image;T.onload=()=>{const E=s.getContext("2d");E==null||E.clearRect(0,0,s.width,s.height),E==null||E.drawImage(T,0,0),c.needsUpdate=!0,p(performance.now()-w)},T.onerror=()=>p(performance.now()-w),T.src=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(el(h,y))}`},nl=({animate:s,frame:c,fps:h})=>{const y=Qn(b=>b.invalidate),p=s?c:0,w=j.useRef(0),[{canvas:T,texture:E}]=j.useState(()=>{const b=document.createElement("canvas");b.width=Re,b.height=Ee;const S=new er(b);return S.colorSpace=tr,{canvas:b,texture:S}});return j.useLayoutEffect(()=>{const b=Wr("Rasterizing Composition Graph React shot"),S=w.current+1;w.current=S;let U=!1;const H=()=>{U||(U=!0,Gr(b))};return tl(T,E,p,h,G=>{if(S!==w.current)return H();window.dispatchEvent(new CustomEvent("composition-graph-html-metrics",{detail:{adapter:"foreign-object",duration:G,frame:p}})),y(),H()}),H},[T,h,y,p,E]),j.useLayoutEffect(()=>()=>E.dispose(),[E]),{texture:E,width:Re,height:Ee}},Kn=()=>{const s=document.createElement("canvas"),c=s.getContext("2d");return typeof s.requestPaint=="function"&&typeof(c==null?void 0:c.drawElementImage)=="function"},rl=()=>{const s=document.createElement("canvas");s.width=Re,s.height=Ee,s.setAttribute("layoutsubtree","true"),s.style.cssText=`position:fixed;left:0;top:0;width:${Re}px;height:${Ee}px;pointer-events:none;z-index:-1;`;const c=document.createElement("div");return c.id="composition-graph-hic-source",c.style.cssText=`display:block;width:${Re}px;height:${Ee}px;`,s.appendChild(c),document.body.appendChild(s),{host:s,content:c}},ol=({animate:s,frame:c,fps:h})=>{const y=Qn(N=>N.invalidate),p=s?c:0,w=j.useRef(p),T=j.useRef(0),E=j.useRef(!1),b=j.useRef(null),S=j.useRef(null),U=j.useRef(null),H=Kn(),[G,fe]=j.useState("pending"),[{canvas:X,texture:re}]=j.useState(()=>{const N=document.createElement("canvas");N.width=Re,N.height=Ee;const L=new er(N);return L.colorSpace=tr,{canvas:N,texture:L}});return w.current=p,j.useLayoutEffect(()=>{if(!H){fe("unavailable"),window.dispatchEvent(new CustomEvent("composition-graph-html-metrics",{detail:{adapter:"html-in-canvas",status:"unavailable"}}));return}const{host:N,content:L}=rl(),q=N.getContext("2d");if(!q||!q.drawElementImage)throw new Error("HTML-in-Canvas 无法创建 drawElementImage context");return N.layoutSubtree=!0,b.current=L,S.current=N,U.current=Mr.createRoot(L),N.onpaint=()=>{const oe=performance.now();try{if(q.reset(),q.drawElementImage(L,0,0),!E.current){const Y=q.getImageData(0,0,1,1).data;if(!(Y[1]>180&&Y[0]>70&&Y[0]<160&&Y[2]>130))throw new Error(`HIC sentinel missing: rgba(${Y.join(",")})`);E.current=!0}T.current+=1,fe("verified"),re.image=N,re.needsUpdate=!0,window.dispatchEvent(new CustomEvent("composition-graph-html-metrics",{detail:{adapter:"html-in-canvas",duration:performance.now()-oe,frame:w.current,verified:E.current,paintCount:T.current,engine:"paint -> drawElementImage(DIV) -> CanvasTexture"}})),y()}catch(Y){fe("failed"),window.dispatchEvent(new CustomEvent("composition-graph-html-metrics",{detail:{adapter:"html-in-canvas",status:"capture-failed",message:Y instanceof Error?Y.message:String(Y)}}))}},()=>{var oe;N.onpaint=null,E.current=!1,S.current=null,b.current=null,(oe=U.current)==null||oe.unmount(),U.current=null,N.remove()}},[y,H,re]),j.useLayoutEffect(()=>{var Y;const N=b.current,L=S.current,q=U.current;if(!N||!L||!q)return;const oe=$e(p,h);qr.flushSync(()=>{q.render(j.createElement(Ir,{id:oe.id,frame:p,fps:h,progress:oe.progress}))}),(Y=L.requestPaint)==null||Y.call(L)},[h,p,H]),j.useLayoutEffect(()=>()=>re.dispose(),[re]),{texture:re,width:Re,height:Ee,supported:H,status:G}},ll=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,sl=`
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform float uZoom;
  uniform vec3 uColor;
  uniform float uHud;
  uniform float uAberration;
  uniform float uHaze;
  varying vec2 vUv;

  const float PI = 3.14159265358979;

  float pow2(float x) { return x * x; }

  vec3 page(vec2 px) {
    vec2 uv = clamp(px / uResolution, 0.0005, 0.9995);
    return pow(texture2D(uMap, uv).rgb, vec3(2.2));
  }

  vec3 pageAA(vec2 px) {
    // CanvasUI selects a mip from this footprint. CanvasTexture has no stable mip chain
    // across every browser backend, so the footprint is retained for the shader's AA math.
    float footprint = max(length(fwidth(px)), 1.0);
    return mix(page(px), page(px + vec2(footprint * 0.12)), 0.08);
  }

  float line(float d, float halfWidth) {
    return 1.0 - smoothstep(halfWidth - 0.75, halfWidth + 0.75, abs(d));
  }

  void main() {
    vec2 fragPx = vUv * uResolution;
    vec2 p = fragPx - uCenter;
    float d = length(p);
    float w = 1.1;
    float lensMask = 1.0 - smoothstep(uRadius - 1.5, uRadius, d);
    vec2 lensPx = uCenter + p / max(uZoom, 1.0);
    float rimT = pow2(clamp(d / max(uRadius, 1.0), 0.0, 1.0));
    vec2 dir = p / max(d, 0.5);
    float caPx = uAberration * 5.0 * rimT;
    vec3 inside;
    inside.r = pageAA(lensPx + dir * caPx).r;
    inside.g = pageAA(lensPx).g;
    inside.b = pageAA(lensPx - dir * caPx).b;

    vec3 soft = page(lensPx);
    inside = mix(
      inside,
      soft * (1.0 + 0.4 * uHaze) + uColor * 0.06 * uHaze,
      clamp(uHaze, 0.0, 1.0) * 0.45
    );

    float hud = line(d - uRadius, 1.3);
    float angle = atan(p.y, p.x);
    float sector = PI / 4.0;
    float da = abs(angle - floor(angle / sector + 0.5) * sector) * max(d, 1.0);
    float tickBand = smoothstep(uRadius + 4.0, uRadius + 6.0, d)
      * (1.0 - smoothstep(uRadius + 12.0, uRadius + 14.0, d));
    hud += line(da, w) * tickBand;

    float reach = uRadius * 1.14;
    float crossLine = max(
      line(p.x, w) * step(abs(p.y), reach),
      line(p.y, w) * step(abs(p.x), reach)
    );
    hud += crossLine * smoothstep(6.0, 10.0, d) * 0.75;

    vec2 q = abs(p);
    float c = uRadius * 0.64;
    float arm = uRadius * 0.2;
    float arm1 = line(q.x - c, w) * step(c - arm, q.y) * step(q.y, c + w);
    float arm2 = line(q.y - c, w) * step(c - arm, q.x) * step(q.x, c + w);
    hud += max(arm1, arm2);
    hud += 1.0 - smoothstep(1.6, 2.6, d);
    hud += line(d - 5.5, 0.9) * 0.6;
    hud = clamp(hud, 0.0, 1.0) * uHud;

    vec3 base = mix(page(fragPx), inside, lensMask);
    base = mix(base, uColor, hud);
    gl_FragColor = vec4(pow(max(base, 0.0), vec3(1.0 / 2.2)), 1.0);
  }
`,il=({center:s,height:c,texture:h,width:y,zoom:p})=>{const w=j.useRef(null),T=j.useMemo(()=>({uMap:new R(h),uResolution:new R(new te(y,c)),uCenter:new R(new te(s[0]*y,s[1]*c)),uRadius:new R(140),uZoom:new R(p),uColor:new R(new Xn(.8,.8,.8)),uHud:new R(.8),uAberration:new R(.8),uHaze:new R(.2)}),[c,h,y]);return j.useLayoutEffect(()=>{w.current&&(w.current.uniforms.uResolution.value.set(y,c),w.current.uniforms.uCenter.value.set(s[0]*y,s[1]*c),w.current.uniforms.uZoom.value=p)},[s,c,y,p]),u.jsx("shaderMaterial",{ref:w,fragmentShader:sl,toneMapped:!1,uniforms:T,vertexShader:ll})},al=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ul=`
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform float uProgress;
  uniform float uMaxAxisDistance;
  uniform float uCurlRadius;
  uniform vec2 uCorner;
  uniform vec2 uDirection;
  uniform vec2 uBandNormal;
  uniform float uBandT;
  uniform float uHaloSigma;
  uniform float uCoreSigma;
  uniform float uHaloIntensity;
  uniform float uCoreIntensity;
  varying vec2 vUv;

  const float PI = 3.14159265359;
  const vec3 BACK_COLOR = vec3(0.96, 0.93, 0.86);

  vec4 sampleFlat(vec2 uv) {
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);
    return texture2D(uMap, uv);
  }

  float shineIntensity(vec2 point) {
    vec2 fromCenter = point - uResolution * 0.5;
    float distanceToBand = abs(dot(fromCenter, uBandNormal) - uBandT);
    float halo = exp(-(distanceToBand * distanceToBand) / (uHaloSigma * uHaloSigma)) * uHaloIntensity;
    float core = exp(-(distanceToBand * distanceToBand) / (uCoreSigma * uCoreSigma)) * uCoreIntensity;
    return clamp(halo + core, 0.0, 1.0);
  }

  vec4 applyShine(vec4 color, float intensity) {
    return vec4(color.rgb * (1.0 - intensity) + intensity * color.a, color.a);
  }

  void main() {
    vec2 point = vec2(vUv.x * uResolution.x, (1.0 - vUv.y) * uResolution.y);
    vec2 fromCorner = point - uCorner;
    float projected = dot(fromCorner, uDirection);
    vec2 perpendicular = fromCorner - projected * uDirection;
    float curlAxis = uProgress * uMaxAxisDistance;
    vec4 flatColor = sampleFlat(vUv);
    float shine = shineIntensity(point);

    if (projected >= curlAxis) {
      gl_FragColor = applyShine(flatColor, shine);
      return;
    }

    float delta = curlAxis - projected;
    if (delta > uCurlRadius) {
      gl_FragColor = vec4(0.0);
      return;
    }

    float ratio = clamp(delta / uCurlRadius, 0.0, 1.0);
    float frontArc = uCurlRadius * asin(ratio);
    float backArc = PI * uCurlRadius - frontArc;
    vec2 frontPoint = uCorner + perpendicular + (curlAxis - frontArc) * uDirection;
    vec2 backPoint = uCorner + perpendicular + (curlAxis - backArc) * uDirection;
    vec2 frontUv = vec2(frontPoint.x / uResolution.x, 1.0 - frontPoint.y / uResolution.y);
    vec2 backUv = vec2(backPoint.x / uResolution.x, 1.0 - backPoint.y / uResolution.y);
    vec4 front = sampleFlat(frontUv);
    vec4 back = sampleFlat(backUv);
    float frontShade = mix(1.0, 0.78, sin(frontArc / uCurlRadius));
    float backShade = mix(0.62, 0.42, (backArc / uCurlRadius - PI * 0.5) / (PI * 0.5));

    if (front.a > 0.02) {
      gl_FragColor = applyShine(vec4(front.rgb * frontShade, front.a), shine);
    } else if (back.a > 0.02 && flatColor.a > 0.02) {
      gl_FragColor = vec4(BACK_COLOR * backShade, back.a);
    } else {
      gl_FragColor = vec4(0.0);
    }
  }
`,cl=s=>{const c=Math.max(0,Math.min(1,s));return 1-(1-c)*(1-c)},fl=({height:s,progress:c,texture:h,time:y,width:p})=>{const w=j.useRef(null),T=j.useMemo(()=>new te(-.72,.69).normalize(),[]),E=j.useMemo(()=>new te(.87,-.5).normalize(),[]),b=Math.abs(T.x)*p*.5+Math.abs(T.y)*s*.5,S=Math.min(p,s)*.24,U=Math.abs(E.x)*p*.5+Math.abs(E.y)*s*.5,H=j.useMemo(()=>({uMap:new R(h),uResolution:new R(new te(p,s)),uProgress:new R(1),uMaxAxisDistance:new R(b+S),uCurlRadius:new R(S),uCorner:new R(new te(p*.5-T.x*b,s*.5-T.y*b)),uDirection:new R(T),uBandNormal:new R(E),uBandT:new R(-U),uHaloSigma:new R(Math.min(p,s)*.28),uCoreSigma:new R(Math.min(p,s)*.09),uHaloIntensity:new R(.3),uCoreIntensity:new R(.4)}),[E,S,T,s,U,b,h,p]);return j.useLayoutEffect(()=>{if(!w.current)return;const G=cl(c);w.current.uniforms.uProgress.value=1-G,w.current.uniforms.uBandT.value=-U+2*U*G,w.current.uniforms.uResolution.value.set(p,s)},[s,c,U,y,p]),u.jsx("shaderMaterial",{ref:w,depthWrite:!1,fragmentShader:ul,transparent:!0,toneMapped:!1,uniforms:H,vertexShader:al})},dl=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,pl=`
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uGrain;
  uniform float uVignette;
  uniform float uWarmth;
  uniform float uFade;
  varying vec2 vUv;

  float hash(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  void main() {
    vec2 uv = vUv + vec2(
      sin(uTime * 11.0) * 0.0015 + sin(uTime * 3.7) * 0.0009,
      cos(uTime * 8.3) * 0.0013 + cos(uTime * 2.4) * 0.0007
    );
    vec2 fromCenter = uv - 0.5;
    float radius = length(fromCenter);
    vec2 direction = radius > 0.0001 ? normalize(fromCenter) : vec2(0.0);
    float aberration = 0.0024 * pow(radius * 1.4, 1.6);
    vec3 color = vec3(
      texture2D(uMap, uv + direction * aberration).r,
      texture2D(uMap, uv).g,
      texture2D(uMap, uv - direction * aberration).b
    );
    float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color = mix(color, vec3(luminance), 0.30);
    color = mix(vec3(0.5), color, mix(1.0, 0.78, uFade));
    color = mix(color, mix(vec3(0.22, 0.21, 0.20), vec3(0.98, 0.97, 0.96), color), uWarmth);
    float frameIndex = floor(uTime * 24.0);
    color += (hash(gl_FragCoord.xy + vec2(frameIndex * 17.31, frameIndex * 7.91)) - 0.5) * uGrain;
    float scratchSeed = floor(uTime * 8.0);
    for (int index = 0; index < 3; index++) {
      float slot = float(index);
      float enabled = step(0.78, hash(vec2(scratchSeed, slot * 19.7 + 3.1)));
      float x = hash(vec2(scratchSeed, slot * 7.13 + 11.4)) * uResolution.x;
      float jitter = 0.4 * sin(vUv.y * 80.0 + slot * 9.0);
      float line = enabled * smoothstep(2.4, 0.0, abs(gl_FragCoord.x - x + jitter));
      color += vec3(line * (0.45 + 0.25 * hash(vec2(scratchSeed, slot))) * 0.9);
    }
    float dustSeed = floor(uTime * 24.0);
    for (int index = 0; index < 4; index++) {
      float slot = float(index);
      vec2 dustPosition = vec2(hash(vec2(dustSeed, slot * 2.13 + 1.7)), hash(vec2(dustSeed, slot * 5.71 + 9.3)));
      float enabled = step(0.55, hash(vec2(dustSeed, slot * 3.33 + 21.0)));
      float dustRadius = 0.004 + 0.006 * hash(vec2(dustSeed, slot * 4.4));
      color += vec3(0.52, 0.51, 0.50) * smoothstep(dustRadius, 0.0, distance(vUv, dustPosition)) * enabled;
    }
    float leak = smoothstep(0.85, 0.05, distance(vUv, vec2(0.86, 0.18)));
    color += vec3(0.96, 0.90, 0.84) * leak * 0.14 * (0.55 + 0.45 * sin(uTime * 0.7));
    float leak2 = smoothstep(0.7, 0.0, distance(vUv, vec2(0.12, 0.85)));
    color += vec3(0.88, 0.86, 0.84) * leak2 * 0.07 * (0.5 + 0.5 * sin(uTime * 0.4 + 1.7));
    color *= mix(1.0, smoothstep(1.05, 0.30, radius * 1.25), uVignette);
    color *= 1.0 + 0.035 * sin(uTime * 7.0) + 0.018 * sin(uTime * 19.0 + 1.3);
    gl_FragColor = vec4(color * vec3(1.01, 1.0, 0.99), 1.0);
  }
`,hl=({height:s,texture:c,time:h,width:y})=>{const p=j.useRef(null),w=j.useMemo(()=>({uMap:new R(c),uTime:new R(h),uResolution:new R(new te(y,s)),uGrain:new R(.126),uVignette:new R(.6),uWarmth:new R(.28),uFade:new R(.385)}),[s,c,y]);return j.useLayoutEffect(()=>{p.current&&(p.current.uniforms.uTime.value=h,p.current.uniforms.uResolution.value.set(y,s))},[s,h,y]),u.jsx("shaderMaterial",{ref:p,fragmentShader:pl,toneMapped:!1,uniforms:w,vertexShader:dl})},bn=4.9,Jn=s=>Math.min(1,Math.max(0,s)),Dt=s=>{const c=Jn(s);return c*c*(3-2*c)},ml=(s,c,h,y)=>{const p=Dt((c-h)/Math.max(1-h,.01)),w=(p-.5)*y,T=Math.sin(p*Math.PI)*.035;return[Jn(s[0]+w),Jn(s[1]+T)]},vl=(s,c,h)=>{s.fillStyle="#0d1926",s.fillRect(0,0,960,540),s.fillStyle="#14273a",s.fillRect(28,28,904,392);const y=s.createRadialGradient(670,175,10,670,175,360);y.addColorStop(0,"#4a78d8"),y.addColorStop(.48,"#234b76"),y.addColorStop(1,"#101f31"),s.fillStyle=y,s.fillRect(28,28,904,392),s.fillStyle="rgba(105, 227, 186, 0.95)",s.fillRect(86,92,240,10),s.fillStyle="#f3f7fa",s.font="700 54px Arial",s.fillText("LIVE COMPOSITION",82,184),s.fillStyle="#b9d0dc",s.font="32px Arial",s.fillText(c.toUpperCase(),82,238),s.fillStyle="#69e3ba",s.fillRect(82,308,376,14),s.fillStyle="#f3f7fa",s.beginPath(),s.arc(760,227,84,0,Math.PI*2),s.fill(),s.fillStyle="#3156c6",s.beginPath(),s.arc(760,227,62,0,Math.PI*2),s.fill(),s.fillStyle="#69e3ba",s.fillRect(28,454,904,42),s.fillStyle="#071019",s.fillRect(44,470,850,10),s.fillStyle="#f3f7fa",s.fillRect(44,470,h%5/5*850,10)},xl=()=>{const s=ot(),{fps:c}=lt(),h=j.useMemo(()=>{const p=document.createElement("canvas");p.width=960,p.height=540;const w=new er(p);return w.colorSpace=tr,w.minFilter=wr,w.magFilter=wr,w},[]),y=$e(s,c);return j.useLayoutEffect(()=>{vl(h.image.getContext("2d"),y.id,s/c),h.needsUpdate=!0},[s,c,y.id,h]),j.useLayoutEffect(()=>()=>h.dispose(),[h]),h},Pr=({id:s,progress:c,frame:h,fps:y,magnify:p,texture:w,width:T,height:E})=>{const b=Dt(c/.13),S=rr(s),U=S.lens??[.5,.5],H=[U[0],1-U[1]],G=c<.2&&S.transition!=="clean"?S.transition:S.effect,fe=S.lensStart??0,X=ml(H,c,fe,S.lensTravel??.28),re=G==="magnify"&&p&&c>=fe,N=G==="store-peel"?u.jsx(fl,{height:E,progress:c/.2,texture:w,time:h/y,width:T}):G==="bend"?u.jsx(uo,{bend:(1-b)*1.12,texture:w}):re?u.jsx(il,{center:X,height:E,texture:w,width:T,zoom:1.7}):G==="glitch"?u.jsx(yo,{aspect:T/E,intensity:1.35,texture:w,time:c*3.7}):G==="glass"?u.jsx(ko,{center:H,texture:w,height:E,width:T,zoom:1.34}):G==="bubble"?u.jsx(ro,{aspect:T/E,height:E,intensity:1,texture:w,time:h/y,width:T}):G==="crt"?u.jsx(vo,{height:E,texture:w,time:h/y,width:T}):G==="vintage"?u.jsx(hl,{height:E,texture:w,time:h/y,width:T}):G==="article-highlight"?u.jsx(so,{height:E,texture:w,width:T}):u.jsx("meshBasicMaterial",{map:w,toneMapped:!1}),L=G==="bend"?(1-b)*.15:0;return u.jsxs("mesh",{position:[0,0,0],rotation:[0,L,0],scale:[1+(1-b)*.035,1+(1-b)*.035,1],children:[u.jsx("planeGeometry",{args:[T/E*bn,bn,32,1]}),N]})},_r=({animate:s,magnify:c})=>{const h=ot(),{fps:y}=lt(),{texture:p,width:w,height:T}=nl({animate:s,frame:h,fps:y}),E=$e(h,y);return u.jsx(Pr,{id:E.id,progress:E.progress,frame:h,fps:y,height:T,magnify:c,texture:p,width:w})},gl=({animate:s,magnify:c})=>{const h=ot(),{fps:y}=lt(),{texture:p,width:w,height:T,status:E}=ol({animate:s,frame:h,fps:y});if(E!=="verified")return u.jsx(_r,{animate:s,magnify:c});const b=$e(h,y);return u.jsx(Pr,{id:b.id,progress:b.progress,frame:h,fps:y,height:T,magnify:c,texture:p,width:w})},yl=({animate:s,magnify:c,rasterizer:h})=>h==="html-in-canvas"?u.jsx(gl,{animate:s,magnify:c}):u.jsx(_r,{animate:s,magnify:c}),Sl=()=>{const s=ot(),{fps:c}=lt(),h=$e(s,c),y=xl();if(!rr(h.id).media)return null;const p=Dt(h.progress/.17);return u.jsxs("mesh",{position:[1.87,-.18,.18],rotation:[0,-.12,.012],scale:.8+p*.2,children:[u.jsx("planeGeometry",{args:[3.02,1.7]}),u.jsx("meshBasicMaterial",{map:y,toneMapped:!1})]})},wl=()=>{const s=ot(),{fps:c,width:h,height:y}=lt(),p=$e(s,c),w=rr(p.id).effect==="clouds"?.74*Dt(p.progress/.18)*Dt((1-p.progress)/.18):0;return u.jsxs("mesh",{position:[0,0,.12],renderOrder:2,children:[u.jsx("planeGeometry",{args:[h/y*bn,bn]}),u.jsx(po,{opacity:w,time:s/c})]})},kl=()=>{const{isRendering:s}=Zr(),c=j.useRef(performance.now()),h=j.useRef(0);return Qr(()=>{if(s)return;h.current+=1;const y=performance.now();y-c.current<500||(window.dispatchEvent(new CustomEvent("composition-graph-metrics",{detail:{fps:Math.round(h.current*1e3/(y-c.current))}})),h.current=0,c.current=y)}),null},bl=()=>{const s=ot(),c=Qn(h=>h.invalidate);return j.useLayoutEffect(()=>c(),[s,c]),null},Cl=({htmlAnimation:s,magnify:c,htmlRasterizer:h})=>u.jsxs(u.Fragment,{children:[u.jsx("color",{attach:"background",args:["#070c08"]}),u.jsx(yl,{animate:s,magnify:c,rasterizer:h}),u.jsx(Sl,{}),u.jsx(wl,{}),u.jsx(kl,{}),u.jsx(bl,{})]}),Rl=({htmlAnimation:s,htmlRasterizer:c,magnify:h})=>{const{width:y,height:p}=lt();return u.jsx(Xr,{style:{background:"#071019"},children:u.jsx(Kr,{camera:{fov:34,position:[0,0,8]},dpr:[1,2],frameloop:"demand",gl:{alpha:!1,antialias:!0,powerPreference:"high-performance"},height:p,width:y,children:u.jsx(Cl,{htmlAnimation:s,htmlRasterizer:c,magnify:h})})})},Dr=90,El=()=>({"foreign-object":{samples:[],status:"waiting"},"html-in-canvas":{samples:[],status:"waiting"}}),jl=(s,c)=>{if(s.length===0)return null;const h=[...s].sort((y,p)=>y-p);return h[Math.min(h.length-1,Math.floor((h.length-1)*c))]},Zn=s=>s===null?"--":`${s.toFixed(2)} ms`,jr=({label:s,measurement:c})=>{const h=c.samples.at(-1)??null,y=c.samples.length===0?null:c.samples.reduce((T,E)=>T+E,0)/c.samples.length,p=jl(c.samples,.95),w=c.verified?"VERIFIED":c.status.toUpperCase();return u.jsxs("article",{className:"benchmark-column",children:[u.jsxs("div",{className:"benchmark-column-heading",children:[u.jsx("span",{children:s}),u.jsx("output",{className:`capture-state capture-state-${c.status}`,title:c.message,children:w})]}),u.jsxs("dl",{className:"benchmark-values",children:[u.jsxs("div",{children:[u.jsx("dt",{children:"latest"}),u.jsx("dd",{children:Zn(h)})]}),u.jsxs("div",{children:[u.jsx("dt",{children:"mean"}),u.jsx("dd",{children:Zn(y)})]}),u.jsxs("div",{children:[u.jsx("dt",{children:"p95"}),u.jsx("dd",{children:Zn(p)})]})]}),u.jsxs("div",{className:"benchmark-samples",children:[c.samples.length," / ",Dr," samples"]}),c.verified?u.jsxs("div",{className:"benchmark-proof",children:["paint ",c.paintCount," · drawElementImage(DIV)"]}):null]})},Tl=()=>{const[s,c]=j.useState(null),[h,y]=j.useState(El),p=j.useRef(h);return j.useEffect(()=>{const w=b=>c(b.detail.fps),T=b=>{const S=b.detail;if(!S.adapter)return;const U=p.current[S.adapter],H=typeof S.duration=="number"?[...U.samples,S.duration].slice(-Dr):U.samples,G=typeof S.duration=="number"?"recording":S.status==="unavailable"?"unavailable":S.status==="capture-failed"?"failed":U.status;p.current={...p.current,[S.adapter]:{samples:H,status:G,message:S.message,verified:S.verified??U.verified,paintCount:S.paintCount??U.paintCount}}},E=window.setInterval(()=>y({...p.current}),500);return window.addEventListener("composition-graph-metrics",w),window.addEventListener("composition-graph-html-metrics",T),()=>{window.clearInterval(E),window.removeEventListener("composition-graph-metrics",w),window.removeEventListener("composition-graph-html-metrics",T)}},[]),u.jsxs("section",{"aria-label":"HTML capture benchmark",className:"benchmark-panel",children:[u.jsxs("div",{className:"benchmark-heading",children:[u.jsxs("div",{children:[u.jsx("p",{children:"CAPTURE BENCHMARK"}),u.jsx("span",{children:"rolling CPU copy time"})]}),u.jsx("output",{className:"benchmark-fps",children:s===null?"-- FPS":`${s} FPS`})]}),u.jsxs("div",{className:"benchmark-grid",children:[u.jsx(jr,{label:"SVG foreignObject",measurement:h["foreign-object"]}),u.jsx(jr,{label:"HTML-in-Canvas",measurement:h["html-in-canvas"]})]})]})},Ml=()=>{const[s,c]=j.useState(!0),[h,y]=j.useState(()=>Kn()?"html-in-canvas":"foreign-object"),[p,w]=j.useState(!0),T=Kn();return u.jsxs("main",{className:"lab-shell",children:[u.jsxs("header",{className:"lab-header",children:[u.jsxs("div",{children:[u.jsx("p",{children:"RECUT / COMPOSITION LAB"}),u.jsx("h1",{children:"Remotion + Three + HIC"})]}),u.jsxs("div",{className:"runtime-status",children:[u.jsx("span",{children:"120 SECONDS"}),u.jsx("span",{children:"ALL VISIBLE NODES IN THREE"}),u.jsx("span",{children:"HIC + CANVAS UI"}),u.jsxs("label",{className:"lab-select",children:[u.jsx("span",{children:"capture"}),u.jsxs("select",{"aria-label":"HTML capture adapter",onChange:E=>y(E.target.value),value:h,children:[u.jsx("option",{value:"foreign-object",children:"foreignObject"}),u.jsx("option",{disabled:!T,value:"html-in-canvas",children:"HTML-in-Canvas"})]})]}),u.jsxs("label",{className:"lab-toggle",children:[u.jsx("input",{checked:s,onChange:E=>c(E.target.checked),type:"checkbox"}),"animate HTML"]}),u.jsxs("label",{className:"lab-toggle",children:[u.jsx("input",{checked:p,onChange:E=>w(E.target.checked),type:"checkbox"}),"magnify pass"]})]})]}),u.jsx("section",{className:"film-main",children:u.jsx("div",{className:"player-frame",children:u.jsx(Yr,{acknowledgeRemotionLicense:!0,component:Rl,compositionHeight:1080,compositionWidth:1920,controls:!0,durationInFrames:Jo,fps:30,inputProps:{htmlAnimation:s,htmlRasterizer:h,magnify:p},loop:!0,style:{width:"100%",height:"100%"}})})}),u.jsx(Tl,{})]})};Mr.createRoot(document.getElementById("root")).render(u.jsx(Ml,{}));
