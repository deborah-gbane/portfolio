import { useMemo, useRef, useState } from "react";
import { useCanvas, rgba, randn, clamp } from "../hooks.js";
import { useT, getLang } from "../i18n.jsx";

/* Centroïdes réels du modèle (README mall-customers-segmentation) — revenu k$, score de dépense */
const PROFILES = [
  { name: "Standard", en: "Standard", income: 55.3, score: 49.5, n: 81, sx: 8, sy: 6 },
  { name: "Premium", en: "Premium", income: 86.5, score: 82.1, n: 39, sx: 13, sy: 9 },
  { name: "Impulsive", en: "Impulsive", income: 25.7, score: 79.4, n: 22, sx: 7.5, sy: 10 },
  { name: "Prudente", en: "Cautious", income: 88.2, score: 17.1, n: 35, sx: 14, sy: 9.5 },
  { name: "Économe", en: "Thrifty", income: 26.3, score: 20.9, n: 23, sx: 7.5, sy: 13 },
];
// StandardScaler sur le dataset Mall Customers (200 clients)
const MU = [60.56, 50.2], SD = [26.2, 25.76];
const COLORS = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)", "var(--c5)"];
const X0 = 10, X1 = 145, Y0 = 0, Y1 = 100;

const std = (p) => [(p[0] - MU[0]) / SD[0], (p[1] - MU[1]) / SD[1]];
const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
const nearestProfile = (p) => {
  const z = std(p);
  return PROFILES.map((c, i) => [d2(z, std([c.income, c.score])), i]).sort((a, b) => a[0] - b[0]);
};

function simulate() {
  const pts = [];
  PROFILES.forEach((c) => {
    for (let i = 0; i < c.n; i++)
      pts.push([clamp(c.income + randn() * c.sx, 15, 137), clamp(c.score + randn() * c.sy, 1, 99)]);
  });
  return pts;
}

function kmeansRun(Z, k, seed) {
  let C = seed.map((c) => [...c]);
  const history = [];
  for (let it = 0; it < 20; it++) {
    const lab = Z.map((z) => C.map((c, i) => [d2(z, c), i]).sort((a, b) => a[0] - b[0])[0][1]);
    const inertia = Z.reduce((s, z, i) => s + d2(z, C[lab[i]]), 0);
    history.push({ C: C.map((c) => [...c]), lab, inertia });
    const N = C.map((c, i) => {
      const m = Z.filter((_, j) => lab[j] === i);
      return m.length ? [m.reduce((s, z) => s + z[0], 0) / m.length, m.reduce((s, z) => s + z[1], 0) / m.length] : c;
    });
    if (N.every((c, i) => d2(c, C[i]) < 1e-8)) break;
    C = N;
  }
  return history;
}

// k-means++ pour l'initialisation
function initPP(Z, k) {
  const C = [Z[(Math.random() * Z.length) | 0]];
  while (C.length < k) {
    const D = Z.map((z) => Math.min(...C.map((c) => d2(z, c))));
    let r = Math.random() * D.reduce((a, b) => a + b, 0);
    let i = 0;
    while ((r -= D[i]) > 0) i++;
    C.push(Z[Math.min(i, Z.length - 1)]);
  }
  return C;
}

// n_init = 10, comme scikit-learn : on garde l'exécution d'inertie minimale
function bestOf(Z, k, n = 10) {
  let best = null;
  for (let i = 0; i < n; i++) {
    const h = kmeansRun(Z, k, initPP(Z, k));
    if (!best || h[h.length - 1].inertia < best[best.length - 1].inertia) best = h;
  }
  return best;
}

export default function KMeansLab() {
  const { t, lang } = useT();
  const pname = (i) => (lang === "en" ? PROFILES[i].en : PROFILES[i].name);
  const pts = useMemo(simulate, []);
  const Z = useMemo(() => pts.map(std), [pts]);
  const elbow = useMemo(
    () => Array.from({ length: 10 }, (_, i) => {
      const h = bestOf(Z, i + 1, 4);
      return h[h.length - 1].inertia;
    }),
    [Z]
  );
  const S = useRef({ history: bestOf(Z, 5), t0: 0, clock: 0, added: [] });
  const [iter, setIter] = useState({ it: 0, total: S.current.history.length, inertia: 0 });
  const [picked, setPicked] = useState(null);

  const restart = () => {
    S.current.history = bestOf(Z, 5);
    S.current.t0 = S.current.clock;
  };

  const ref = useCanvas(
    () => S.current,
    (ctx, s, t, dt, { w, h }, th) => {
      s.clock = t;
      ctx.clearRect(0, 0, w, h);
      const pl = 40, pb = 34, pr = 12, pt = 10;
      const X = (v) => pl + ((v - X0) / (X1 - X0)) * (w - pl - pr);
      const Y = (v) => pt + (1 - (v - Y0) / (Y1 - Y0)) * (h - pt - pb);
      const cs = getComputedStyle(ctx.canvas);
      const col = COLORS.map((c) => cs.getPropertyValue(c.slice(4, -1)).trim());

      // grille
      ctx.strokeStyle = th.rule; ctx.lineWidth = 1; ctx.font = "10px 'Geist Mono Variable', monospace"; ctx.fillStyle = th.muted;
      for (let v = 20; v <= 140; v += 20) { ctx.beginPath(); ctx.moveTo(X(v), pt); ctx.lineTo(X(v), h - pb); ctx.stroke(); ctx.textAlign = "center"; ctx.fillText(v, X(v), h - pb + 14); }
      for (let v = 0; v <= 100; v += 25) { ctx.beginPath(); ctx.moveTo(pl, Y(v)); ctx.lineTo(w - pr, Y(v)); ctx.stroke(); ctx.textAlign = "right"; ctx.fillText(v, pl - 6, Y(v) + 3); }
      ctx.textAlign = "center"; ctx.fillText(getLang() === "en" ? "Annual income (k$)" : "Revenu annuel (k$)", (pl + w - pr) / 2, h - 4);
      ctx.save(); ctx.translate(11, (pt + h - pb) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(getLang() === "en" ? "Spending score" : "Score de dépense", 0, 0); ctx.restore();
      ctx.textAlign = "left";

      // itération courante de Lloyd
      const it = Math.min(Math.floor((t - s.t0) / 0.7), s.history.length - 1);
      const H = s.history[Math.max(0, it)];
      // associe chaque cluster trouvé au profil réel le plus proche (couleurs stables)
      const map = H.C.map((c) => nearestProfile([c[0] * SD[0] + MU[0], c[1] * SD[1] + MU[1]])[0][1]);

      pts.forEach((p, i) => {
        ctx.fillStyle = rgba(col[map[H.lab[i]]], 0.75);
        ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 3, 0, Math.PI * 2); ctx.fill();
      });
      H.C.forEach((c, i) => {
        const x = X(c[0] * SD[0] + MU[0]), y = Y(c[1] * SD[1] + MU[1]);
        ctx.strokeStyle = th.ink; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x - 6, y - 6); ctx.lineTo(x + 6, y + 6); ctx.moveTo(x + 6, y - 6); ctx.lineTo(x - 6, y + 6); ctx.stroke();
        ctx.lineWidth = 1;
        void i;
      });
      // clients ajoutés au clic
      s.added.forEach((a) => {
        const r = 6 + Math.sin(t * 4) * 1.5;
        ctx.strokeStyle = col[a.k]; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(X(a.p[0]), Y(a.p[1]), r, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = th.ink; ctx.beginPath(); ctx.arc(X(a.p[0]), Y(a.p[1]), 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 1;
      });
      s.geom = { X0, X1, pl, pr, pt, pb, w, h };
      if (s.lastIt !== it) { s.lastIt = it; setIter({ it: it + 1, total: s.history.length, inertia: H.inertia }); }
    },
    []
  );

  const onClick = (e) => {
    const g = S.current.geom;
    if (!g) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const income = X0 + ((x - g.pl) / (g.w - g.pl - g.pr)) * (X1 - X0);
    const score = Y1 - ((y - g.pt) / (g.h - g.pt - g.pb)) * (Y1 - Y0);
    if (income < 15 || income > 140 || score < 0 || score > 100) return;
    const ranked = nearestProfile([income, score]);
    const k = ranked[0][1];
    S.current.added = [...S.current.added.slice(-5), { p: [income, score], k }];
    setPicked({ income, score, k, dist: Math.sqrt(ranked[0][0]), second: ranked[1][1] });
  };

  // courbe du coude
  const emax = elbow[0];
  const ex = (k) => 10 + (k - 1) * (180 / 9), ey = (v) => 10 + (1 - v / emax) * 80;

  return (
    <div className="lab">
      <div className="lab__plot" data-cursor={t("cursor.click")}>
        <canvas ref={ref} className="lab__canvas" onClick={onClick} role="img" aria-label={t("lab.aria")} />
      </div>
      <aside className="lab__side">
        <div className="lab__block">
          <p className="mono-label">{t("lab.lloyd")}</p>
          <p className="lab__big">{t("lab.iteration")} {iter.it}<span className="muted"> / {iter.total}</span></p>
          <p className="mono-small">{t("lab.inertia")} = {iter.inertia.toFixed(2)}</p>
          <button className="btn btn--small" onClick={restart} data-magnetic>{t("lab.restart")}</button>
        </div>
        <div className="lab__block">
          <p className="mono-label">{t("lab.elbow")}</p>
          <svg viewBox="0 0 200 104" className="elbow" role="img" aria-label={lang === "en" ? "Inertia as a function of K, elbow at K = 5" : "Inertie en fonction de K, coude à K = 5"}>
            <polyline fill="none" stroke="currentColor" strokeWidth="1.2" points={elbow.map((v, i) => `${ex(i + 1)},${ey(v)}`).join(" ")} />
            {elbow.map((v, i) => (
              <circle key={i} cx={ex(i + 1)} cy={ey(v)} r={i === 4 ? 4 : 2} className={i === 4 ? "elbow__k" : ""} fill="currentColor" />
            ))}
            <text x={ex(5) + 7} y={ey(elbow[4]) - 6} className="elbow__label">K = 5</text>
          </svg>
        </div>
        <div className="lab__block">
          <p className="mono-label">{t("lab.classify")}</p>
          {picked ? (
            <>
              <p className="lab__big"><span className="swatch" style={{ background: COLORS[picked.k] }} />{t("lab.segment")} {pname(picked.k).toLowerCase()}</p>
              <p className="mono-small">
                {t("lab.income")} = {picked.income.toFixed(1)} k$ · {t("lab.score")} = {picked.score.toFixed(0)}<br />
                {t("lab.dist")} = {picked.dist.toFixed(2)}σ · {t("lab.second")} : {pname(picked.second).toLowerCase()}
              </p>
            </>
          ) : (
            <p className="muted">{t("lab.hint")}</p>
          )}
        </div>
        <ul className="legend">
          {PROFILES.map((p, i) => (
            <li key={p.name}><span className="swatch" style={{ background: COLORS[i] }} />{pname(i)}<span className="muted mono-small"> n={p.n}</span></li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
