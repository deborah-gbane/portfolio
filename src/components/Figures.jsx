import { useCanvas, rgba, rand, randn, clamp, lerp } from "../hooks.js";
import { getLang } from "../i18n.jsx";
const L10 = (fr, en) => (getLang() === "en" ? en : fr);

const MONO = "10px 'Geist Mono Variable', monospace";

function axes(ctx, w, h, th, pad = 28) {
  ctx.strokeStyle = th.rule;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, 10); ctx.lineTo(pad, h - pad); ctx.lineTo(w - 10, h - pad);
  ctx.stroke();
}
function label(ctx, th, text, x, y, align = "left") {
  ctx.fillStyle = th.muted; ctx.font = MONO; ctx.textAlign = align; ctx.fillText(text, x, y); ctx.textAlign = "left";
}

/* Chaque figure : setup(size) → état ; draw(ctx, état, t, dt, size, thème) */
const FIGS = {
  /* Matrice d'attention (traduction NLLB) */
  attention: {
    setup: () => ({ n: 7, m: 6, align: [0, 1, 1, 2, 4, 3, 5] }),
    draw(ctx, s, t, dt, { w, h }, th) {
      ctx.clearRect(0, 0, w, h);
      const pad = 34, cs = Math.min((w - pad - 12) / s.m, (h - pad - 12) / s.n);
      const ox = pad + (w - pad - 12 - cs * s.m) / 2, oy = 10;
      const focus = (t * 1.1) % s.n;
      for (let i = 0; i < s.n; i++) for (let j = 0; j < s.m; j++) {
        const d = Math.abs(j - s.align[i]);
        let a = Math.exp(-d * d * 1.2) * 0.85 + 0.05 * (1 + Math.sin(i * 3 + j * 2 + t));
        const on = Math.abs(i - focus) < 0.5;
        ctx.fillStyle = rgba(on ? th.accent : th.ink, clamp(a * (on ? 1 : 0.55)));
        ctx.fillRect(ox + j * cs + 1, oy + i * cs + 1, cs - 2, cs - 2);
      }
      for (let i = 0; i < s.n; i++) label(ctx, th, `s${i + 1}`, ox - 8, oy + i * cs + cs / 2 + 3, "right");
      for (let j = 0; j < s.m; j++) label(ctx, th, `c${j + 1}`, ox + j * cs + cs / 2, oy + s.n * cs + 14, "center");
    },
  },

  /* Similarité requête ↔ documents (recherche avant génération) */
  retrieval: {
    setup: () => ({ docs: ["doc₁", "doc₂", "doc₃", "doc₄", "doc₅"], base: [0.86, 0.79, 0.71, 0.55, 0.22] }),
    draw(ctx, s, t, dt, { w, h }, th) {
      ctx.clearRect(0, 0, w, h);
      const lx = 92, bw = w - lx - 48, bh = Math.min(16, (h - 30) / s.docs.length - 10);
      const cycle = (t * 0.35) % 1;
      const grow = clamp(cycle / 0.5);
      s.docs.forEach((d, i) => {
        const y = 14 + i * (bh + 12);
        const v = s.base[i] + Math.sin(t * 0.9 + i) * 0.02;
        const kept = i < 3;
        label(ctx, th, d, lx - 10, y + bh / 2 + 3, "right");
        ctx.fillStyle = rgba(th.ink, 0.06); ctx.fillRect(lx, y, bw, bh);
        ctx.fillStyle = kept ? th.accent : rgba(th.ink, 0.35);
        ctx.fillRect(lx, y, bw * v * grow, bh);
        label(ctx, th, (v * grow).toFixed(2), lx + bw + 6, y + bh / 2 + 3);
      });
      const yk = 14 + 3 * (bh + 12) - 6;
      ctx.setLineDash([3, 3]); ctx.strokeStyle = th.muted;
      ctx.beginPath(); ctx.moveTo(lx, yk); ctx.lineTo(lx + bw, yk); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, th, L10("top-k = 3 → contexte du LLM", "top-k = 3 → LLM context"), lx, h - 6);
    },
  },

  /* Embeddings + k plus proches voisins (FAISS) */
  knn: {
    setup: ({ w, h }) => {
      const centers = [[0.25, 0.3], [0.7, 0.25], [0.55, 0.7], [0.2, 0.75]];
      const pts = Array.from({ length: 90 }, (_, i) => {
        const c = centers[i % 4];
        return { x: (c[0] + randn() * 0.07) * w, y: (c[1] + randn() * 0.07) * h, c: i % 4 };
      });
      return { pts };
    },
    draw(ctx, s, t, dt, { w, h }, th) {
      ctx.clearRect(0, 0, w, h);
      const q = { x: w * (0.48 + Math.cos(t * 0.45) * 0.3), y: h * (0.5 + Math.sin(t * 0.7) * 0.28) };
      const nn = s.pts.map((p, i) => [Math.hypot(p.x - q.x, p.y - q.y), i]).sort((a, b) => a[0] - b[0]).slice(0, 3);
      const ids = new Set(nn.map((n) => n[1]));
      s.pts.forEach((p, i) => {
        ctx.fillStyle = ids.has(i) ? th.accent : rgba(th.ink, 0.25 + p.c * 0.12);
        ctx.beginPath(); ctx.arc(p.x, p.y, ids.has(i) ? 3.6 : 2.4, 0, Math.PI * 2); ctx.fill();
      });
      ctx.strokeStyle = th.accent; ctx.lineWidth = 1;
      nn.forEach(([, i]) => { ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(s.pts[i].x, s.pts[i].y); ctx.stroke(); });
      ctx.strokeStyle = rgba(th.accent, 0.4); ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.arc(q.x, q.y, nn[2][0], 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = th.ink; ctx.beginPath(); ctx.arc(q.x, q.y, 4.5, 0, Math.PI * 2); ctx.fill();
      label(ctx, th, `q · d₃ = ${(nn[2][0] / w).toFixed(3)}`, q.x + 9, q.y - 8);
    },
  },

  /* Régression logistique : σ(z) */
  sigmoid: {
    setup: () => ({
      pts: Array.from({ length: 46 }, () => {
        const z = randn() * 2.2;
        const y = Math.random() < 1 / (1 + Math.exp(-1.6 * z)) ? 1 : 0;
        return { z, y, j: rand(-0.04, 0.04) };
      }),
    }),
    draw(ctx, s, t, dt, { w, h }, th) {
      ctx.clearRect(0, 0, w, h);
      const pad = 28;
      axes(ctx, w, h, th, pad);
      const X = (z) => pad + ((z + 5) / 10) * (w - pad - 14);
      const Y = (p) => 10 + (1 - p) * (h - pad - 18);
      const k = 1.6, prog = clamp((t * 0.4) % 1.4);
      // seuil 0,5
      ctx.setLineDash([3, 3]); ctx.strokeStyle = th.muted;
      ctx.beginPath(); ctx.moveTo(pad, Y(0.5)); ctx.lineTo(w - 10, Y(0.5)); ctx.stroke(); ctx.setLineDash([]);
      s.pts.forEach((p) => {
        const correct = (p.z > 0) === (p.y === 1);
        ctx.fillStyle = correct ? rgba(th.ink, 0.55) : th.accent;
        ctx.beginPath(); ctx.arc(X(p.z), Y(p.y + p.j), 2.6, 0, Math.PI * 2); ctx.fill();
      });
      ctx.strokeStyle = th.accent; ctx.lineWidth = 2; ctx.beginPath();
      for (let z = -5; z <= -5 + 10 * prog; z += 0.05) ctx.lineTo(X(z), Y(1 / (1 + Math.exp(-k * z))));
      ctx.stroke(); ctx.lineWidth = 1;
      label(ctx, th, L10("P(survie)", "P(survival)"), pad + 4, 20);
      label(ctx, th, "z = wᵀx + b", w - 12, h - 10, "right");
      label(ctx, th, "0,5", pad - 4, Y(0.5) + 3, "right");
    },
  },

  /* Frontière de décision linéaire */
  boundary: {
    setup: () => ({
      pts: Array.from({ length: 70 }, () => {
        const a = Math.random(), b = Math.random();
        const y = a * 0.9 + b * 0.7 + randn() * 0.12 > 0.85 ? 1 : 0;
        return { a, b, y };
      }),
    }),
    draw(ctx, s, t, dt, { w, h }, th) {
      ctx.clearRect(0, 0, w, h);
      const pad = 28;
      axes(ctx, w, h, th, pad);
      const X = (v) => pad + 6 + v * (w - pad - 22), Y = (v) => h - pad - 6 - v * (h - pad - 22);
      // la frontière converge vers la solution (descente de gradient simulée)
      const k = clamp(((t * 0.3) % 1.3) / 0.9);
      // frontière : nx·x₁ + ny·x₂ = c, interpolée d'une solution initiale vers la solution finale
      const e = 1 - Math.pow(1 - k, 3);
      const L = Math.hypot(0.9, 0.7);
      const ang = lerp(1.1, Math.atan2(0.7, 0.9), e);
      const nx = Math.cos(ang), ny = Math.sin(ang);
      const c = lerp(0.45, 0.85 / L, e);
      const line = [];
      for (let a = -0.1; a <= 1.11; a += 0.05) line.push([a, (c - nx * a) / ny]);
      // zone de la classe positive
      ctx.fillStyle = rgba(th.accent, 0.07);
      ctx.beginPath();
      ctx.moveTo(X(-0.1), Y(1.2));
      line.forEach(([a, b]) => ctx.lineTo(X(a), Y(b)));
      ctx.lineTo(X(1.1), Y(1.2)); ctx.closePath(); ctx.fill();
      s.pts.forEach((p) => {
        ctx.fillStyle = p.y ? th.accent : th.bg;
        ctx.strokeStyle = p.y ? th.accent : th.ink;
        ctx.beginPath(); ctx.arc(X(p.a), Y(p.b), 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      ctx.strokeStyle = th.ink; ctx.lineWidth = 1.5; ctx.beginPath();
      line.forEach(([a, b], i) => (i ? ctx.lineTo(X(a), Y(b)) : ctx.moveTo(X(a), Y(b))));
      ctx.stroke(); ctx.lineWidth = 1;
      label(ctx, th, `${L10("époque", "epoch")} ${Math.round(k * 100)}`, w - 12, 20, "right");
      label(ctx, th, "x₁", w - 12, h - 10, "right");
      label(ctx, th, "x₂", pad + 4, 20);
    },
  },

  /* Distribution softmax du prochain token */
  tokens: {
    setup: () => ({
      en: [
        ["Logistic", ["regression", "function", "loss", "growth", "curve"]],
        ["Logistic regression", ["estimates", "predicts", "models", "is", "uses"]],
        ["Logistic regression estimates", ["the", "a", "class", "each", "how"]],
        ["Logistic regression estimates the", ["probability", "class", "odds", "value", "label"]],
        ["Logistic regression estimates the probability", ["of", "that", "for", "given", "."]],
      ],
      steps: [
        ["La", ["régression", "validation", "donnée", "moyenne", "classe"]],
        ["La régression", ["logistique", "linéaire", "ridge", "est", "permet"]],
        ["La régression logistique", ["estime", "prédit", "modélise", "est", "utilise"]],
        ["La régression logistique estime", ["une", "la", "des", "le", "un"]],
        ["La régression logistique estime une", ["probabilité", "classe", "valeur", "cote", "variable"]],
      ],
    }),
    draw(ctx, s, t, dt, { w, h }, th) {
      ctx.clearRect(0, 0, w, h);
      const steps = getLang() === "en" ? s.en : s.steps;
      const i = Math.floor(t / 1.6) % steps.length;
      const [ctxt, cands] = steps[i];
      const local = (t % 1.6) / 1.6;
      const logits = cands.map((_, k) => 2.6 - k * 0.75 + Math.sin(t * 2 + k) * 0.08);
      const ex = logits.map(Math.exp), Z = ex.reduce((a, b) => a + b, 0);
      ctx.fillStyle = th.ink; ctx.font = "13px 'Geist Variable', sans-serif";
      ctx.fillText(ctxt + (local > 0.5 ? " ▍" : ""), 8, 22);
      const lx = 96, bw = w - lx - 50, bh = Math.min(14, (h - 50) / 5 - 8);
      cands.forEach((c, k) => {
        const y = 40 + k * (bh + 9), p = ex[k] / Z;
        label(ctx, th, c, lx - 8, y + bh / 2 + 3, "right");
        ctx.fillStyle = k === 0 ? th.accent : rgba(th.ink, 0.3);
        ctx.fillRect(lx, y, bw * p * clamp(local * 2.5), bh);
        label(ctx, th, p.toFixed(2), lx + bw * p + 6, y + bh / 2 + 3);
      });
    },
  },

  /* Nuage de points 3D en rotation */
  cloud: {
    setup: () => {
      const pts = [];
      for (let i = 0; i < 420; i++) {
        const u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2;
        const r = 1 + (Math.random() < 0.15 ? -0.45 : randn() * 0.03);
        pts.push([Math.sqrt(1 - u * u) * Math.cos(a) * r, u * r, Math.sqrt(1 - u * u) * Math.sin(a) * r]);
      }
      return { pts };
    },
    draw(ctx, s, t, dt, { w, h }, th) {
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.38, cx = w / 2, cy = h / 2;
      const ca = Math.cos(t * 0.5), sa = Math.sin(t * 0.5), cb = Math.cos(0.4), sb = Math.sin(0.4);
      const proj = s.pts.map(([x, y, z]) => {
        const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
        const y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
        return [cx + x1 * R, cy + y1 * R, z2, Math.hypot(x, y, z) < 0.8];
      }).sort((a, b) => a[2] - b[2]);
      proj.forEach(([x, y, z, inner]) => {
        ctx.fillStyle = inner ? th.accent : rgba(th.ink, 0.15 + (z + 1) * 0.3);
        ctx.beginPath(); ctx.arc(x, y, inner ? 2.4 : 1.3 + (z + 1) * 0.5, 0, Math.PI * 2); ctx.fill();
      });
      label(ctx, th, `θ = ${((t * 0.5 * 180) / Math.PI % 360).toFixed(0)}°`, 8, h - 8);
    },
  },

  /* K-Means : itérations de Lloyd (assignation → recentrage) */
  kmeans: {
    setup: () => {
      const C = [[0.42, 0.5], [0.75, 0.2], [0.15, 0.22], [0.78, 0.8], [0.16, 0.8]];
      const pts = [];
      C.forEach((c, k) => { for (let i = 0; i < 34; i++) pts.push([clamp(c[0] + randn() * 0.06, 0.03, 0.97), clamp(c[1] + randn() * 0.07, 0.03, 0.97)]); });
      return { pts, cycle: -1, hist: [] };
    },
    draw(ctx, s, t, dt, { w, h }, th) {
      ctx.clearRect(0, 0, w, h);
      const cyc = Math.floor(t / 7);
      if (cyc !== s.cycle) { // nouvelle exécution depuis une initialisation aléatoire
        s.cycle = cyc;
        let cent = Array.from({ length: 5 }, () => [Math.random(), Math.random()]);
        s.hist = [];
        for (let it = 0; it < 8; it++) {
          const lab = s.pts.map((p) => cent.map((c, i) => [(p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2, i]).sort((a, b) => a[0] - b[0])[0][1]);
          s.hist.push({ cent: cent.map((c) => [...c]), lab });
          cent = cent.map((c, i) => {
            const m = s.pts.filter((_, j) => lab[j] === i);
            return m.length ? [m.reduce((a, p) => a + p[0], 0) / m.length, m.reduce((a, p) => a + p[1], 0) / m.length] : c;
          });
        }
      }
      const local = t % 7, it = Math.min(s.hist.length - 1, Math.floor(local / 0.7)), f = clamp((local % 0.7) / 0.5);
      const H = s.hist[it], N = s.hist[Math.min(it + 1, s.hist.length - 1)];
      const cs = getComputedStyle(ctx.canvas);
      const col = ["--c1", "--c2", "--c3", "--c4", "--c5"].map((v) => cs.getPropertyValue(v).trim() || th.ink);
      const X = (v) => 16 + v * (w - 32), Y = (v) => 12 + v * (h - 40);
      s.pts.forEach((p, i) => {
        ctx.fillStyle = rgba(col[H.lab[i]], 0.75);
        ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 2.6, 0, Math.PI * 2); ctx.fill();
      });
      H.cent.forEach((c, i) => {
        const x = X(lerp(c[0], N.cent[i][0], f)), y = Y(lerp(c[1], N.cent[i][1], f));
        ctx.strokeStyle = th.ink; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x - 5, y - 5); ctx.lineTo(x + 5, y + 5); ctx.moveTo(x + 5, y - 5); ctx.lineTo(x - 5, y + 5); ctx.stroke();
      });
      ctx.lineWidth = 1;
      label(ctx, th, `${L10("itération", "iteration")} ${it + 1} · k = 5`, 14, h - 8);
    },
  },

  /* Graphe logistique : plus court chemin (Dijkstra) */
  graph: {
    setup: () => {
      // coordonnées approximatives (longitude, latitude) des villes
      const V = [
        ["Korhogo", -5.63, 9.46], ["Odienné", -7.56, 9.51], ["Bouaké", -5.03, 7.69], ["Man", -7.55, 7.41],
        ["Daloa", -6.45, 6.88], ["Yamoussoukro", -5.28, 6.82], ["Abengourou", -3.49, 6.73],
        ["San-Pédro", -6.64, 4.75], ["Abidjan", -4.01, 5.36],
      ];
      const E = [[0, 1], [0, 2], [1, 3], [2, 5], [2, 6], [3, 4], [4, 5], [4, 7], [5, 8], [6, 8], [7, 8], [2, 4]];
      const dist = (a, b) => Math.hypot(V[a][1] - V[b][1], V[a][2] - V[b][2]);
      const adj = V.map(() => []);
      E.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
      const dijkstra = (src, dst) => {
        const d = V.map(() => Infinity), prev = V.map(() => -1), done = new Set();
        d[src] = 0;
        while (done.size < V.length) {
          let u = -1;
          d.forEach((v, i) => { if (!done.has(i) && (u < 0 || v < d[u])) u = i; });
          done.add(u);
          adj[u].forEach((v) => { const nd = d[u] + dist(u, v); if (nd < d[v]) { d[v] = nd; prev[v] = u; } });
        }
        const path = []; for (let u = dst; u >= 0; u = prev[u]) path.unshift(u);
        return path;
      };
      const routes = [[0, 8], [1, 7], [3, 6], [0, 7]].map(([a, b]) => dijkstra(a, b));
      return { V, E, routes };
    },
    draw(ctx, s, t, dt, { w, h }, th) {
      ctx.clearRect(0, 0, w, h);
      const X = (lon) => 20 + ((lon + 8.2) / 5.2) * (w - 90), Y = (lat) => 14 + ((10 - lat) / 5.6) * (h - 30);
      const ri = Math.floor(t / 3) % s.routes.length, path = s.routes[ri], prog = clamp((t % 3) / 2);
      ctx.strokeStyle = th.rule; ctx.lineWidth = 1;
      s.E.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(X(s.V[a][1]), Y(s.V[a][2])); ctx.lineTo(X(s.V[b][1]), Y(s.V[b][2])); ctx.stroke(); });
      ctx.strokeStyle = th.accent; ctx.lineWidth = 2.5; ctx.beginPath();
      const segs = path.length - 1, upto = prog * segs;
      for (let i = 0; i <= Math.min(segs, Math.floor(upto)); i++) {
        const [, lon, lat] = s.V[path[i]];
        i ? ctx.lineTo(X(lon), Y(lat)) : ctx.moveTo(X(lon), Y(lat));
      }
      if (upto < segs) {
        const i = Math.floor(upto), f = upto - i, A = s.V[path[i]], B = s.V[path[i + 1]];
        ctx.lineTo(X(lerp(A[1], B[1], f)), Y(lerp(A[2], B[2], f)));
      }
      ctx.stroke(); ctx.lineWidth = 1;
      s.V.forEach(([name, lon, lat], i) => {
        const on = path.includes(i);
        ctx.fillStyle = on ? th.accent : th.bg; ctx.strokeStyle = on ? th.accent : th.ink;
        ctx.beginPath(); ctx.arc(X(lon), Y(lat), 3.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        label(ctx, th, name, X(lon) + 7, Y(lat) + 3);
      });
    },
  },
};

export default function Figure({ type }) {
  const f = FIGS[type];
  const ref = useCanvas(f ? f.setup : () => ({}), f ? f.draw : () => {}, [type]);
  if (!f) return null;
  return <canvas ref={ref} className="figure-canvas" aria-hidden="true" />;
}
