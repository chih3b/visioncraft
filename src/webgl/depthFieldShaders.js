/* ============================================================================
   Depth-field shaders — GLSL ES 1.00 (WebGL 1, so it runs everywhere)
   ----------------------------------------------------------------------------
   The page's thesis, expressed in a shader: a grid of points that starts as a
   perfectly flat sheet (raw pixels) and lifts into 3D relief (spatial
   understanding) as `uMorph` goes 0 → 1.

   No textures and no geometry uploads beyond one static grid — the depth is
   computed procedurally in the vertex shader, so the whole thing is a single
   draw call over ~29k points.
   ========================================================================== */

export const VERT = /* glsl */ `
precision highp float;

attribute vec2  aGrid;   // position on the plane, roughly -1.6 .. 1.6
attribute float aSeed;   // per-point random, 0 .. 1

uniform mat4  uProj;
uniform float uTime;
uniform float uMorph;    // 0 = flat sheet, 1 = full relief
uniform float uReveal;   // 0 .. 1 load-in sweep
uniform vec2  uPointer;  // damped cursor, -1 .. 1
uniform float uDpr;

varying float vSubject;  // 0 .. 1 how much this point belongs to the subject
varying float vFog;      // distance fade
varying float vAlpha;    // reveal / edge fade

/* --- cheap value noise: no textures, no dependencies --------------------- */
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),                 hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int k = 0; k < 4; k++) {
    sum += amp * vnoise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return sum;
}

/* Signed distance to a rounded box — the bounding-box motif, echoed in the
   geometry itself rather than pasted on top of it. */
float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 d = abs(p) - b + r;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

/* A raised mass: 1 at the centre, easing to 0 at the edge. */
float mass(vec2 p, vec2 c, vec2 b, float r, float feather) {
  float d = sdRoundBox(p - c, b, r);
  return 1.0 - smoothstep(-feather, feather, d);
}

void main() {
  vec2 g = aGrid;

  /* --- the depth map ---------------------------------------------------- */
  // Ground: low, drifting ripples so the field never looks dead.
  float ground = fbm(g * 1.5 + vec2(uTime * 0.045, uTime * 0.03)) * 0.16;

  // One dominant subject plus two satellites — a scene with a clear figure,
  // which is what a detector would actually latch onto.
  float subject =
      mass(g, vec2( 0.02,  0.05), vec2(0.42, 0.30), 0.16, 0.30) * 1.00
    + mass(g, vec2(-0.95, -0.62), vec2(0.20, 0.15), 0.09, 0.26) * 0.55
    + mass(g, vec2( 1.02, -0.45), vec2(0.16, 0.20), 0.08, 0.26) * 0.48;
  subject = clamp(subject, 0.0, 1.0);

  // A scan ridge travelling across the field: the vision system, working.
  float scanX   = fract(uTime * 0.07) * 3.6 - 1.8;
  float scan    = exp(-pow((g.x - scanX) * 3.4, 2.0));

  float height = (ground + subject * 0.62 + scan * 0.10) * uMorph;

  /* --- place it in space ------------------------------------------------ */
  vec3 pos = vec3(g.x, height, g.y);

  // Slow orbit, nudged by the cursor.
  float ang = uTime * 0.045 + uPointer.x * 0.34;
  float ca = cos(ang), sa = sin(ang);
  pos.xz = mat2(ca, -sa, sa, ca) * pos.xz;

  // Tilt so we read the plane as ground, not as a wall.
  float tilt = 1.02 + uPointer.y * 0.12;
  float ct = cos(tilt), st = sin(tilt);
  vec3 v = vec3(pos.x, pos.y * ct - pos.z * st, pos.y * st + pos.z * ct);

  v.z -= 3.05;                       // push in front of the camera

  gl_Position = uProj * vec4(v, 1.0);

  /* --- shading terms --------------------------------------------------- */
  float dist = max(-v.z, 0.001);
  gl_PointSize = clamp(uDpr * 5.6 / dist, uDpr * 0.75, uDpr * 3.4);

  vSubject = clamp(subject * 1.1 + scan * 0.35, 0.0, 1.0);
  vFog     = smoothstep(5.4, 1.5, dist);

  // Points fade in by seed, so the field assembles instead of popping.
  vAlpha = smoothstep(0.0, 0.35, uReveal - aSeed * 0.65);
}
`

export const FRAG = /* glsl */ `
precision mediump float;

uniform vec3 uBase;    // dim, cool white — the unremarkable background points
uniform vec3 uAccent;  // brand violet — where the model is confident

varying float vSubject;
varying float vFog;
varying float vAlpha;

void main() {
  // Round the point off; square points read as debug output, not craft.
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;

  float soft = smoothstep(0.25, 0.015, d2);
  vec3  col  = mix(uBase, uAccent, smoothstep(0.12, 0.72, vSubject));

  // Subject points burn a little brighter — depth cue without a bloom pass.
  float gain = 0.42 + vSubject * 0.72;

  gl_FragColor = vec4(col, soft * vFog * vAlpha * gain);
}
`
