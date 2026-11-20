import { useEffect, useRef } from "react";
import * as THREE from "three";
import { reducedMotion } from "../hooks.js";
import { getLang } from "../i18n.jsx";

/**
 * Double hélice de données (Three.js).
 * - deux brins lumineux + des « paires de bases » faites de tuiles de caractères (atlas de glyphes) ;
 * - profondeur de champ simulée : les tuiles hors du plan net deviennent des halos flous ;
 * - une onde de lecture parcourt l'hélice et réchauffe les tuiles ; les caractères changent en continu ;
 * - intro : les particules écrivent le nom, puis se replient en hélice ; rotation permanente.
 */

const GLYPHS = ["0", "1", "2", "3", "4", "5", "7", "8", "A", "E", "F", "P", "S", "Σ", "λ", "∂"];
const FILLED = new Set([3, 7, 10, 14]); // cases pleines (caractère en négatif)

function makeAtlas() {
  const S = 128, c = document.createElement("canvas");
  c.width = c.height = S * 4;
  const g = c.getContext("2d");
  g.textAlign = "center"; g.textBaseline = "middle";
  GLYPHS.forEach((ch, i) => {
    const x = (i % 4) * S, y = Math.floor(i / 4) * S, pad = 14, r = 14;
    g.save(); g.translate(x, y);
    g.beginPath();
    g.roundRect(pad, pad, S - pad * 2, S - pad * 2, r);
    if (FILLED.has(i)) {
      g.fillStyle = "#fff"; g.fill();
      g.globalCompositeOperation = "destination-out";
      g.font = `600 ${S * 0.52}px "Geist Mono Variable", monospace`;
      g.fillText(ch, S / 2, S / 2 + 4);
    } else {
      g.strokeStyle = "rgba(255,255,255,.95)"; g.lineWidth = 7; g.stroke();
      g.fillStyle = "#fff";
      g.font = `500 ${S * 0.5}px "Geist Mono Variable", monospace`;
      g.fillText(ch, S / 2, S / 2 + 4);
    }
    g.restore();
  });
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

function sampleName(lines, count, worldW) {
  const c = document.createElement("canvas");
  const W = 1400, H = 520;
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle";
  const fs = 190;
  g.font = `600 ${fs}px "Geist Variable", system-ui, sans-serif`;
  const k = Math.min(1, (W * 0.94) / Math.max(...lines.map((l) => g.measureText(l).width)));
  g.font = `600 ${fs * k}px "Geist Variable", system-ui, sans-serif`;
  lines.forEach((l, i) => g.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * fs * k * 1.02));
  const d = g.getImageData(0, 0, W, H).data, pts = [];
  for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) if (d[(y * W + x) * 4 + 3] > 128) pts.push([x, y]);
  for (let i = pts.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
  const s = worldW / W;
  return Array.from({ length: count }, (_, i) => { const [x, y] = pts[i % pts.length]; return [(x - W / 2) * s, -(y - H / 2) * s, (Math.random() - 0.5) * 0.2]; });
}

/* Silhouette d'une main qui tend l'index (vers la droite) : contour dense + intérieur clairsemé. */
function sampleHand(count, { robot = false } = {}) {
  const W = 640, H = 300, c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  g.fillStyle = "#fff"; g.strokeStyle = "#fff"; g.lineCap = "round"; g.lineJoin = "round";
  // avant-bras + paume
  g.beginPath();
  g.moveTo(0, 138); g.lineTo(200, 122); g.lineTo(330, 114); g.quadraticCurveTo(366, 122, 366, 140);
  g.lineTo(362, 204); g.quadraticCurveTo(320, 226, 262, 218); g.lineTo(200, 204); g.lineTo(0, 196); g.closePath(); g.fill();
  const seg = (pts, w) => { g.lineWidth = w; g.beginPath(); g.moveTo(...pts[0]); pts.slice(1).forEach((p) => g.lineTo(...p)); g.stroke(); };
  seg([[338, 128], [470, 125], [606, 121]], 23);           // index tendu
  seg([[356, 150], [452, 157], [478, 184]], 21);           // majeur, replié
  seg([[352, 172], [436, 184], [456, 210]], 20);           // annulaire
  seg([[344, 194], [410, 206], [426, 228]], 17);           // auriculaire
  seg([[292, 120], [346, 94], [404, 98]], 22);             // pouce
  // fines séparations entre les doigts
  g.globalCompositeOperation = "destination-out";
  seg([[372, 139], [455, 142], [490, 168]], 3);
  seg([[368, 162], [446, 172], [470, 196]], 3);
  seg([[360, 184], [424, 196], [440, 220]], 3);
  if (robot) [400, 510, 568, 262].forEach((x) => seg([[x, 60], [x, 250]], 4)); // articulations
  const d = g.getImageData(0, 0, W, H).data, A = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : d[(y * W + x) * 4 + 3]);
  const edge = [], inner = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
    if (A(x, y) < 128) continue;
    if (x < 210 && Math.random() > Math.pow(x / 210, 1.6)) continue; // l'avant-bras s'estompe
    const isEdge = A(x - 4, y) < 128 || A(x + 4, y) < 128 || A(x, y - 4) < 128 || A(x, y + 4) < 128;
    (isEdge ? edge : inner).push([x, y]);
  }
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  shuffle(edge); shuffle(inner);
  const nE = Math.floor(count * (robot ? 0.7 : 0.62));
  const out = [];
  for (let i = 0; i < count; i++) out.push(i < nE ? edge[i % edge.length] : inner[(i - nE) % inner.length]);
  return out.map(([x, y]) => [x / W, y / H]);
}

const VS = `
  attribute vec3 aScatter; attribute vec3 aName; attribute float aRand; attribute float aType; attribute float aGlyph; attribute float aWarm; attribute float aScale;
  uniform float uA, uB, uTime, uPR, uSize, uFocus, uScan;
  varying float vType, vGlyph, vBlur, vHot, vB, vWarm, vRand;
  void main(){
    float a = smoothstep(0.0, 1.0, clamp(uA * 1.5 - aRand * 0.5, 0.0, 1.0));
    float b = smoothstep(0.0, 1.0, clamp(uB * 1.6 - aRand * 0.6, 0.0, 1.0));
    vec3 nm = aName + vec3(sin(uTime * 1.2 + aRand * 40.0), cos(uTime + aRand * 30.0), 0.0) * 0.01;
    vec3 p = mix(mix(aScatter, nm, a), position, b);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float depth = -mv.z;
    vBlur = clamp(abs(depth - uFocus) / 4.5, 0.0, 1.0) * b;
    vHot = exp(-pow(position.y - uScan, 2.0) / 3.0) * b;
    vType = aType; vGlyph = aGlyph; vB = b; vWarm = aWarm; vRand = aRand;
    float base = aType > 1.5 ? 1.3 : (aType > 0.5 ? 10.5 : 3.0);
    float size = mix(3.4 + aRand * 2.0, base * (1.0 + vBlur * 1.8) * (1.0 + vHot * 0.35), b);
    gl_PointSize = size * mix(1.0, aScale, b) * uSize * uPR * (16.0 / depth);
    gl_Position = projectionMatrix * mv;
  }`;
const FS = `
  uniform sampler2D uAtlas;
  uniform vec3 uC1, uC2, uC3, uHot, uN1, uN2;
  varying float vType, vGlyph, vBlur, vHot, vB, vWarm, vRand;
  void main(){
    vec2 uv = gl_PointCoord;
    float d = length(uv - 0.5);
    float soft = smoothstep(0.5, 0.0, d);
    vec3 blue = mix(uC1, uC2, vRand);
    vec3 warm = uC3;
    vec3 col = mix(blue, warm, clamp(vWarm * 0.85 + vHot * vWarm, 0.0, 1.0));
    col = mix(col, uHot, vHot * 0.45);
    float alpha;
    if (vType > 0.5 && vType < 1.5 && vB > 0.5) {
      // tuile de caractère : net au plan focal, halo flou ailleurs
      vec2 cell = vec2(mod(vGlyph, 4.0), floor(vGlyph / 4.0));
      float g = texture2D(uAtlas, (cell + vec2(uv.x, uv.y)) / 4.0).a;
      alpha = mix(g, soft * 0.35, smoothstep(0.15, 0.85, vBlur));
      alpha *= 0.75 + vHot * 0.5;
    } else if (vType > 1.5 && vB > 0.5) {
      alpha = soft * 0.35;
    } else {
      // nom : orange profond et opaque pour un contraste fort sur fond clair
      float nameA = smoothstep(0.5, 0.2, d);
      alpha = mix(nameA, pow(soft, 1.6) * 0.9, vB);
      col = mix(mix(uN1, uN2, vRand), col, vB);
    }
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col, alpha * (1.0 - vBlur * 0.35));
  }`;

export default function DataHelix3D({ start, lines, onPhase, onStats, onShape }) {
  const mount = useRef(null);
  const startRef = useRef(start);
  startRef.current = start;

  useEffect(() => {
    const el = mount.current;
    const still = reducedMotion();
    const narrow = el.clientWidth < 760;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const PR = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(PR);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const tilt = new THREE.Group(); // orientation diagonale de l'hélice
    const spin = new THREE.Group(); // rotation autour de son axe
    tilt.add(spin); scene.add(tilt);

    /* ---------- géométrie de l'hélice ---------- */
    const LEN = 30, R = 3.0, TURNS = 2.6, RUNG_STEP = 0.3, TILES = 11;
    const helix = []; // { p, type, glyph, warm }
    const angleAt = (y) => (y / LEN) * TURNS * Math.PI * 2;
    // brins
    const NB = narrow ? 1000 : 1700;
    for (let s = 0; s < 2; s++) for (let i = 0; i < NB; i++) {
      const y = -LEN / 2 + (i / NB) * LEN, a = angleAt(y) + s * Math.PI;
      const j = (Math.random() - 0.5) * 0.12;
      helix.push({ p: [Math.cos(a) * (R + j), y + (Math.random() - 0.5) * 0.05, Math.sin(a) * (R + j)], type: 0 });
    }
    // paires de bases (tuiles)
    const rungs = Math.floor(LEN / RUNG_STEP);
    const warmZones = [Math.random() * LEN - LEN / 2, Math.random() * LEN - LEN / 2];
    for (let r = 0; r < rungs; r++) {
      const y = -LEN / 2 + r * RUNG_STEP, a = angleAt(y);
      const warmRung = warmZones.some((z) => Math.abs(z - y) < 1.4) ? 1 : 0;
      for (let k = 0; k < TILES; k++) {
        if (Math.random() < 0.12) continue;
        const u = (k + 0.5) / TILES * 2 - 1; // de -1 à 1 entre les deux brins
        helix.push({ p: [Math.cos(a) * R * u, y, Math.sin(a) * R * u], type: 1, glyph: (Math.random() * 16) | 0, warm: warmRung * (Math.random() < 0.7 ? 1 : 0) });
      }
    }
    // poussière
    for (let i = 0; i < (narrow ? 160 : 320); i++) {
      helix.push({ p: [(Math.random() - 0.5) * 18, (Math.random() - 0.5) * LEN, (Math.random() - 0.5) * 18], type: 2 });
    }
    const N = helix.length;
    const pos = new Float32Array(N * 3), scatter = new Float32Array(N * 3), name = new Float32Array(N * 3);
    const rnd = new Float32Array(N), type = new Float32Array(N), glyph = new Float32Array(N), warm = new Float32Array(N);
    const namePts = sampleName(lines, N, narrow ? 7.6 : 12);
    const tileIdx = [];
    helix.forEach((h, i) => {
      pos.set(h.p, i * 3);
      const rr = 10 + Math.random() * 8, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      scatter.set([rr * Math.sin(ph) * Math.cos(th), rr * Math.sin(ph) * Math.sin(th), rr * Math.cos(ph) - 4], i * 3);
      name.set(namePts[i], i * 3);
      rnd[i] = Math.random(); type[i] = h.type; glyph[i] = h.glyph || 0; warm[i] = h.warm || 0;
      if (h.type === 1) tileIdx.push(i);
    });

    /* ---------- formes de fond, une par section ---------- */
    const order = Array.from({ length: N }, (_, i) => i).sort(() => Math.random() - 0.5);
    const shapes = { helix: Float32Array.from(pos) };
    const make = (fn) => { const a = new Float32Array(N * 3); order.forEach((i, k) => a.set(fn(k, i), i * 3)); return a; };
    const GOLD = Math.PI * (3 - Math.sqrt(5));
    shapes.sphere = make((k) => { const y = 1 - (2 * (k + 0.5)) / N, r = Math.sqrt(1 - y * y), t = k * GOLD; return [Math.cos(t) * r * 5.6, y * 5.6, Math.sin(t) * r * 5.6]; });
    shapes.layers = make((k) => {
      const L = 6, l = k % L, rad = [2.4, 3.6, 4.2, 3.6, 2.6, 1.6][l], q = 0.42;
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * rad;
      return [(l - (L - 1) / 2) * 3.0, Math.round((Math.cos(a) * r) / q) * q, Math.round((Math.sin(a) * r) / q) * q];
    });
    const COLS = Math.ceil(Math.sqrt(N * 1.8)), ROWS = Math.ceil(N / COLS);
    shapes.wave = make((k) => [((k % COLS) / COLS - 0.5) * 24, 0, (Math.floor(k / COLS) / ROWS - 0.5) * 13]);
    shapes.torus = make(() => { const u = Math.random() * Math.PI * 2, v = Math.random() * Math.PI * 2, R0 = 5.2, r0 = 1.3; return [(R0 + r0 * Math.cos(v)) * Math.cos(u), r0 * Math.sin(v), (R0 + r0 * Math.cos(v)) * Math.sin(u)]; });
    shapes.galaxy = make((k) => {
      const arm = k % 3, r = Math.pow(Math.random(), 0.7) * 8.5, a = r * 0.75 + (arm * Math.PI * 2) / 3 + (Math.random() - 0.5) * 0.5;
      return [Math.cos(a) * r, (Math.random() - 0.5) * 1.2 * (1 - r / 9), Math.sin(a) * r];
    });
    /* scène « création » : main humaine, main robotique, globe, anneaux, rayons */
    const scaleA = new Float32Array(N).fill(1);
    const role = new Uint8Array(N); // 0 main humaine, 1 globe, 2 anneau, 3 rayon, 4 main robot, 5 étincelle
    const creation = new Float32Array(N * 3);
    {
      const backbone = [], tiles = [], dust = [];
      for (let i = 0; i < N; i++) (type[i] === 1 ? tiles : type[i] === 2 ? dust : backbone).push(i);
      const L = 7.2, GAP = 1.55, Hh = L * 300 / 640;
      const human = sampleHand(Math.floor(backbone.length * 0.34));
      const robotEdge = sampleHand(Math.floor(backbone.length * 0.2), { robot: true });
      const nRobot = Math.floor(tiles.length * 0.32);
      const robotIn = sampleHand(nRobot, { robot: true });
      let b = 0;
      const putHuman = ([u, v]) => { const i = backbone[b++]; role[i] = 0; creation.set([-GAP - (1 - u) * L, (0.43 - v) * Hh, (Math.random() - 0.5) * 0.5], i * 3); };
      const putRobot = (i, [u, v]) => { role[i] = 4; creation.set([GAP + (1 - u) * L, (0.43 - v) * Hh - 0.2, (Math.random() - 0.5) * 0.4], i * 3); };
      human.forEach(putHuman);
      robotEdge.forEach((uv) => putRobot(backbone[b++], uv));
      robotIn.forEach((uv, k) => { putRobot(tiles[k], uv); scaleA[tiles[k]] = 0.5; });
      // tuiles restantes : anneau de données en orbite autour du globe
      const restTiles = tiles.slice(nRobot), nRingT = Math.floor(restTiles.length * 0.4);
      restTiles.forEach((i, k) => {
        if (k < nRingT) { // anneau de données fin
          role[i] = 2; scaleA[i] = 0.42;
          const t = (k / nRingT) * Math.PI * 2, R0 = 4.1;
          const x = Math.cos(t) * R0, z0 = Math.sin(t) * R0 * 0.3;
          creation.set([x, z0 * Math.sin(0.25), z0 * Math.cos(0.25)], i * 3);
        } else { // fragments de données qui rayonnent
          role[i] = 3; scaleA[i] = 0.32;
          const t = Math.random() * Math.PI * 2, r = 2 + Math.pow(Math.random(), 1.2) * 5;
          creation.set([Math.cos(t) * r, Math.sin(t) * r * 0.7, (Math.random() - 0.5) * 1.5], i * 3);
        }
      });
      const rest = backbone.length - b, nGlobe = Math.floor(rest * 0.55), nRing = Math.floor(rest * 0.33);
      for (let k = 0; k < nGlobe; k++) { // globe : surface + méridiens/parallèles
        const i = backbone[b++]; role[i] = 1;
        let x, y, z;
        if (k % 3 === 0) { const m = (k % 8) * Math.PI / 8, t = Math.random() * Math.PI * 2; x = Math.cos(t) * Math.cos(m); z = Math.cos(t) * Math.sin(m); y = Math.sin(t); }
        else if (k % 3 === 1) { const lat = (((k % 7) - 3) / 3.6) * (Math.PI / 2), t = Math.random() * Math.PI * 2; x = Math.cos(lat) * Math.cos(t); z = Math.cos(lat) * Math.sin(t); y = Math.sin(lat); }
        else { const yy = Math.random() * 2 - 1, t = Math.random() * Math.PI * 2, r = Math.sqrt(1 - yy * yy); x = r * Math.cos(t); y = yy; z = r * Math.sin(t); }
        creation.set([x * 1.45, y * 1.45, z * 1.45], i * 3);
      }
      for (let k = 0; k < nRing; k++) { // anneaux inclinés
        const i = backbone[b++]; role[i] = 2;
        const ring = k % 3, R0 = [2.2, 2.8, 3.5][ring], tl = [0.35, -0.5, 1.1][ring], t = Math.random() * Math.PI * 2;
        const x = Math.cos(t) * R0, z0 = Math.sin(t) * R0 * 0.35;
        creation.set([x, z0 * Math.sin(tl) + (Math.random() - 0.5) * 0.04, z0 * Math.cos(tl)], i * 3);
      }
      while (b < backbone.length) { // étincelle entre les deux index
        const i = backbone[b++]; role[i] = 5;
        const r = Math.pow(Math.random(), 2) * 0.5, t = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
        creation.set([r * Math.sin(ph) * Math.cos(t), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(t)], i * 3);
      }
      dust.forEach((i) => { // rayons lumineux
        role[i] = 3;
        const t = Math.random() * Math.PI * 2, r = 1.8 + Math.pow(Math.random(), 1.4) * 4.2;
        creation.set([Math.cos(t) * r, Math.sin(t) * r * 0.7, (Math.random() - 0.5) * 1.5], i * 3);
      });
    }
    shapes.creation = creation;
    pos.set(creation);
    for (let i = 0; i < N; i++) warm[i] = role[i] === 0 || role[i] === 5 ? 1 : role[i] === 4 ? 0 : warm[i];

    // étiquettes flottantes autour du globe
    const LABELS = [["AI", -2.6, 2.6], ["DATA", 3.1, 2.2], ["ML", -3.4, -1.6], ["NLP", 3.6, -2.0], ["LLM", 0.4, 3.4], ["▂▄▆█", -1.4, -3.1]];
    const labelEls = LABELS.map(([txt]) => { const d = document.createElement("span"); d.className = "net3d__label"; d.textContent = txt; el.appendChild(d); return d; });
    const lv = new THREE.Vector3();
    const spark = document.createElement("span"); spark.className = "net3d__spark"; el.appendChild(spark);

    /* cerveau : deux hémisphères plissés + cervelet + tronc */
    shapes.brain = make((k) => {
      const part = Math.random();
      if (part < 0.86) {
        const side = k % 2 ? 1 : -1;
        const u = Math.random() * 2 - 1, t = Math.random() * Math.PI * 2, rr = Math.sqrt(1 - u * u);
        let x = rr * Math.cos(t), y = u, z = rr * Math.sin(t);
        if (y < -0.35) y = -0.35 - (y + 0.35) * 0.45;            // base aplatie
        const fold = 1 + 0.085 * Math.sin(9 * x + 2) * Math.cos(8 * y) * Math.sin(7 * z + 1); // gyri
        const sh = Math.random() < 0.8 ? 1 : 0.55 + Math.random() * 0.4;    // surtout en surface
        return [x * 4.0 * fold * sh, y * 2.9 * fold * sh + 0.4, (Math.abs(z) * 1.65 * fold * sh + 0.18) * side];
      }
      if (part < 0.95) { // cervelet
        const u = Math.random() * 2 - 1, t = Math.random() * Math.PI * 2, rr = Math.sqrt(1 - u * u);
        return [-2.6 + rr * Math.cos(t) * 1.3, -1.6 + u * 0.75, rr * Math.sin(t) * 1.9];
      }
      const h = Math.random(); // tronc cérébral
      return [-0.9 - h * 0.6 + (Math.random() - 0.5) * 0.5, -1.6 - h * 2.0, (Math.random() - 0.5) * 0.6];
    });
    const CYCLES = { fr: [["creation", 7.5], ["brain", 6.5], ["helix", 6.5]], en: [["creation", 7.5], ["galaxy", 6.5], ["layers", 6.5]] };
    let HERO_CYCLE = CYCLES.fr;
    let heroIdx = 0, heroT = 0;
    const explode = { t: 0, vel: new Float32Array(N * 3) };
    const boom = () => {
      explode.t = 0.95;
      for (let i = 0; i < N; i++) {
        const j = i * 3, x = pos[j], y = pos[j + 1], z = pos[j + 2], l = Math.hypot(x, y, z) || 1;
        const sp = 6 + Math.random() * 10;
        explode.vel[j] = (x / l) * sp + (Math.random() - 0.5) * 6;
        explode.vel[j + 1] = (y / l) * sp + (Math.random() - 0.5) * 6;
        explode.vel[j + 2] = (z / l) * sp + (Math.random() - 0.5) * 6;
      }
    };

    const SECTIONS_EN = [["top", "creation"], ["apropos", "torus"], ["experience", "layers"], ["formation", "sphere"], ["formations", "wave"], ["certifications", "galaxy"], ["projets", "helix"], ["laboratoire", "sphere"], ["competences", "brain"], ["contact", "torus"]];
    const SECTIONS = [["top", "creation"], ["apropos", "wave"], ["experience", "sphere"], ["formation", "layers"], ["formations", "torus"], ["certifications", "wave"], ["projets", "galaxy"], ["laboratoire", "layers"], ["competences", "sphere"], ["contact", "helix"]];
    const POSE = { creation: [0.05, 0.0], brain: [0.25, 0.0], helix: [0.35, -0.72], sphere: [0.2, 0.1], layers: [0.3, 0.0], wave: [0.75, 0.0], torus: [0.9, 0.15], galaxy: [0.95, 0.2] };
    let shape = "creation", checkT = 0;
    const speedOf = new Float32Array(N).map(() => 1.2 + Math.random() * 1.8);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    geo.setAttribute("aName", new THREE.BufferAttribute(name, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));
    geo.setAttribute("aType", new THREE.BufferAttribute(type, 1));
    geo.setAttribute("aGlyph", new THREE.BufferAttribute(glyph, 1));
    geo.setAttribute("aWarm", new THREE.BufferAttribute(warm, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scaleA, 1));
    const uniforms = {
      uA: { value: still ? 1 : 0 }, uB: { value: still ? 1 : 0 }, uTime: { value: 0 }, uPR: { value: PR },
      uSize: { value: narrow ? 0.8 : 1 }, uFocus: { value: 16 }, uScan: { value: 0 },
      uAtlas: { value: makeAtlas() },
      uC1: { value: new THREE.Color() }, uC2: { value: new THREE.Color() }, uC3: { value: new THREE.Color() },
      uHot: { value: new THREE.Color() }, uN1: { value: new THREE.Color() }, uN2: { value: new THREE.Color() },
    };
    // palettes : orange (FR) / cobalt (EN), interpolées en douceur au changement de langue
    const PAL = {
      fr: { uC1: [0.95, 0.42, 0.11], uC2: [1.0, 0.64, 0.33], uC3: [0.72, 0.22, 0.04], uHot: [0.8, 0.2, 0.0], uN1: [0.62, 0.2, 0.02], uN2: [0.88, 0.33, 0.04] },
      en: { uC1: [0.15, 0.39, 0.92], uC2: [0.42, 0.64, 1.0], uC3: [0.05, 0.18, 0.55], uHot: [0.0, 0.32, 0.88], uN1: [0.04, 0.16, 0.5], uN2: [0.14, 0.36, 0.86] },
    };
    const target = new THREE.Color();
    const setPal = (k) => Object.entries(PAL[getLang() === "en" ? "en" : "fr"]).forEach(([u, c]) => { target.setRGB(...c); uniforms[u].value.lerp(target, k); });
    setPal(1);
    const mat = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, uniforms, transparent: true, depthWrite: false, blending: THREE.NormalBlending });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    spin.add(points);

    onStats?.({ pairs: rungs, tiles: tileIdx.length, points: N });

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.position.set(0, 0, w < 760 ? 19 : 14);
      uniforms.uFocus.value = camera.position.z;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; };
    window.addEventListener("pointermove", onMove, { passive: true });
    let visible = true;
    const io = new IntersectionObserver(() => {});
    io.observe(el);

    const seq = { phase: still ? "net" : "wait", t: 0, morph: still ? 1 : 0 };
    const clock = new THREE.Clock();
    let raf = 0, time = 0, angle = 0, lastScroll = scrollY, speed = 0;
    const smooth = (x) => x * x * (3 - 2 * x);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible) return;
      time += dt;
      uniforms.uTime.value = time;

      if (seq.phase === "wait" && startRef.current) { seq.phase = "gather"; seq.t = 0; onPhase?.("name"); }
      if (seq.phase !== "wait" && seq.phase !== "net") seq.t += dt;
      if (seq.phase === "gather") {
        uniforms.uA.value = Math.min(1, seq.t / 2.0);
        if (seq.t > 2.0) { seq.phase = "hold"; seq.t = 0; }
      } else if (seq.phase === "hold") {
        if (seq.t > 1.6) { seq.phase = "morph"; seq.t = 0; onPhase?.("morph"); }
      } else if (seq.phase === "morph") {
        const k = Math.min(1, seq.t / 2.6);
        uniforms.uB.value = k;
        seq.morph = smooth(k);
        if (k >= 1) { seq.phase = "net"; onPhase?.("net"); }
      }
      const net = seq.morph;

      // rotation permanente, accélérée par le défilement
      const sc = scrollY;
      speed += (Math.abs(sc - lastScroll) * 0.004 - speed) * 0.1;
      lastScroll = sc;
      angle += dt * (0.35 + speed * 4) * net;
      if (shape === "creation") { spin.rotation.y += (Math.sin(time * 0.3) * 0.18 - spin.rotation.y) * 0.04; angle = spin.rotation.y; } else spin.rotation.y = angle;

      // onde de lecture qui parcourt l'hélice
      uniforms.uScan.value = ((time * 3.2) % (LEN + 8)) - LEN / 2 - 4;

      // forme selon la section visible
      checkT -= dt;
      if (checkT <= 0 && net >= 1) {
        checkT = 0.25;
        let cur = "top";
        for (const [id, sh] of getLang() === "en" ? SECTIONS_EN : SECTIONS) {
          const sec = document.getElementById(id);
          if (sec && sec.getBoundingClientRect().top < innerHeight * 0.5) cur = id === "top" ? "top" : sh;
        }
        const next = cur === "top" ? HERO_CYCLE[heroIdx][0] : cur;
        if (next !== shape && cur === "top" && explode.t <= 0 && shape !== "creation" && HERO_CYCLE.every(([n]) => n !== shape)) heroT = 0;
        shape = next;
      }
      // langue : palette et cycle du hero
      setPal(1 - Math.exp(-dt * 2.5));
      const cyc = getLang() === "en" ? CYCLES.en : CYCLES.fr;
      if (cyc !== HERO_CYCLE) { HERO_CYCLE = cyc; heroIdx = heroIdx % HERO_CYCLE.length; if (scrollY < innerHeight * 0.5 && net >= 1) { boom(); shape = HERO_CYCLE[heroIdx][0]; onShape?.(shape); } }

      // cycle du hero : la scène explose puis se recompose en une autre forme
      const atTop = scrollY < innerHeight * 0.5;
      if (net >= 1 && atTop && !still) {
        heroT += dt;
        if (explode.t <= 0 && heroT > HERO_CYCLE[heroIdx][1]) {
          boom();
          heroT = 0;
          heroIdx = (heroIdx + 1) % HERO_CYCLE.length;
          shape = HERO_CYCLE[heroIdx][0];
          onShape?.(shape);
        }
      }
      if (explode.t > 0) {
        explode.t -= dt;
        const damp = Math.exp(-dt * 2.4);
        for (let j = 0; j < N * 3; j++) { pos[j] += explode.vel[j] * dt; explode.vel[j] *= damp; }
        geo.attributes.position.needsUpdate = true;
      } else if (net >= 1) {
        const T = shapes[shape];
        for (let i = 0; i < N; i++) {
          const k = 1 - Math.exp(-dt * speedOf[i]);
          const j = i * 3;
          let tx = T[j], ty = T[j + 1], tz = T[j + 2];
          if (shape === "wave") ty = Math.sin(T[j] * 0.45 + time * 1.2) * Math.cos(T[j + 2] * 0.5 + time * 0.8) * 1.3;
          if (shape === "creation") {
            const r = role[i];
            if (r === 1 || r === 2) { const a = time * (r === 1 ? 0.45 : 0.25), ca = Math.cos(a), sa = Math.sin(a); tx = T[j] * ca - T[j + 2] * sa; tz = T[j] * sa + T[j + 2] * ca; }
            else if (r === 5) { const f = 1 + Math.sin(time * 3 + i) * 0.35; tx *= f; ty *= f; tz *= f; }
            else if (r === 3) { const f = 1 + ((time * 0.25 + rnd[i]) % 1) * 0.35; tx *= f; ty *= f; }
            else { ty += Math.sin(time * 0.8 + (r === 4 ? 1.5 : 0)) * 0.08; }
          }
          pos[j] += (tx - pos[j]) * k;
          pos[j + 1] += (ty - pos[j + 1]) * k;
          pos[j + 2] += (tz - pos[j + 2]) * k;
        }
        geo.attributes.position.needsUpdate = true;
      }

      // flux de données : des caractères changent en continu
      if (net > 0.5) {
        for (let k = 0; k < 14; k++) glyph[tileIdx[(Math.random() * tileIdx.length) | 0]] = (Math.random() * 16) | 0;
        geo.attributes.aGlyph.needsUpdate = true;
      }

      // orientation : le nom fait face, puis l'hélice prend sa diagonale
      const scroll = Math.min(1, sc / Math.max(1, el.clientHeight));
      // grands écrans : après le hero, l'animation occupe la zone libre à droite du contenu
      const W = el.clientWidth, wide = W >= 1400;
      el.style.opacity = String(wide ? 1 - 0.3 * scroll : 1 - 0.78 * scroll);
      const visW = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect;
      const contentRight = Math.max(48, W * 0.04) + Math.min(1500, W * 0.72);
      const zoneCenter = ((contentRight + (W - contentRight) / 2) / W - 0.5) * visW;
      const zoneW = ((W - contentRight) / W) * visW;
      const pose = POSE[shape];
      const tz = (shape === "helix" && narrow ? -0.35 : pose[1]) * net + mouse.x * 0.08 * net;
      const tx = pose[0] * net + mouse.y * 0.12;
      tilt.rotation.z += (tz - tilt.rotation.z) * 0.05;
      tilt.rotation.x += (tx - tilt.rotation.x) * 0.05;
      const isC = shape === "creation";
      const isB = shape === "brain" || ((shape === "galaxy" || shape === "layers") && scroll < 0.5);
      const baseX = narrow ? (isC || isB ? 0 : 0.4) : isC ? 1.3 : isB ? 2.6 : 3.4;
      const afterX = wide ? zoneCenter : baseX + (narrow ? 0 : 2.6);
      tilt.position.x = (baseX + (afterX - baseX) * scroll) * net + mouse.x * 0.4 * net;
      tilt.position.y = (narrow ? (isC || isB ? 2.4 : 1.2) : isC ? 1.1 : isB ? 1.2 : 0.4) * net;
      const wideShape = shape === "layers" || shape === "galaxy";
      const heroSc = narrow ? (isC ? 0.4 : wideShape ? 0.3 : isB ? 0.42 : 0.7) : isC ? 0.82 : wideShape ? 0.5 : isB ? 0.68 : 1;
      const sc0 = wide && scroll > 0.5 ? Math.min(0.65, Math.max(0.28, zoneW / 15.5)) : heroSc;
      tilt.scale.x += (sc0 - tilt.scale.x) * 0.05; tilt.scale.y = tilt.scale.z = tilt.scale.x;

      const showL = shape === "creation" && net > 0.95 && scroll < 0.5 && explode.t <= 0;
      spark.classList.toggle("is-on", shape === "creation" && net > 0.6 && scroll < 0.6 && explode.t <= 0);
      lv.set(0, 0, 0).applyMatrix4(points.matrixWorld).project(camera);
      spark.style.transform = `translate(${((lv.x + 1) / 2) * el.clientWidth}px, ${((1 - lv.y) / 2) * el.clientHeight}px) translate(-50%, -50%)`;
      labelEls.forEach((d, k) => {
        d.classList.toggle("is-on", showL);
        if (!showL) return;
        const [, lx, ly] = LABELS[k];
        lv.set(lx, ly + Math.sin(time * 0.9 + k) * 0.15, 0.5).applyMatrix4(points.matrixWorld).project(camera);
        d.style.transform = `translate(${((lv.x + 1) / 2) * el.clientWidth}px, ${((1 - lv.y) / 2) * el.clientHeight}px) translate(-50%, -50%)`;
      });

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose(); mat.dispose(); uniforms.uAtlas.value.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
      labelEls.forEach((d) => d.remove()); spark.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines.join("|")]);

  return <div className="net3d" ref={mount} aria-hidden="true" />;
}
